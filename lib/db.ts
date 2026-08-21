import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __fanuzuPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __fanuzuMigration: Promise<void> | undefined;
}

function createPool(): Pool {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error(
      'DATABASE_URL is not set. Point it at your Postgres/Supabase connection string (see .env.example).'
    );
  }

  // A `sslmode` query param leads pg-connection-string to derive its own TLS
  // options from the URL (recent pg versions treat sslmode=require as an
  // alias for verify-full — see the SECURITY WARNING it logs). That derived
  // config fights the explicit `ssl` option below and rejects Supabase's
  // pooler cert with SELF_SIGNED_CERT_IN_CHAIN. Stripping it here makes the
  // `ssl` option below the single source of truth.
  const url = new URL(raw);
  url.searchParams.delete('sslmode');
  const connectionString = url.toString();

  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const useSsl = !isLocal || process.env.PGSSL === 'true';

  return new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS preregistrations (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    artist_name_input TEXT NOT NULL,
    artist_name_normalized TEXT NOT NULL,
    fandom_name TEXT,
    fan_since_year TEXT,
    language TEXT,
    referral_code_input TEXT,
    referred_by_id INTEGER REFERENCES preregistrations(id),
    reward_amount INTEGER NOT NULL,
    age_confirmed BOOLEAN NOT NULL,
    privacy_consent BOOLEAN NOT NULL,
    artist_join_order INTEGER NOT NULL,
    origin_100_eligible BOOLEAN NOT NULL,
    origin_100_number INTEGER,
    referral_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_prereg_email ON preregistrations (lower(email));
  CREATE INDEX IF NOT EXISTS idx_prereg_artist ON preregistrations (artist_name_normalized);

  -- Consent audit trail (doc section 4/5/6): which document version was
  -- agreed to and when, plus marketing opt-in tracked separately from the
  -- two required consents so it can never block registration.
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS email_normalized TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS terms_version TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS privacy_version TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS marketing_consent_at TIMESTAMPTZ;
  -- Both flip to false once the full app pays out POP on first login —
  -- no such flow exists yet, so every row is created pending.
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS reward_pending BOOLEAN NOT NULL DEFAULT true;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS referrer_reward_pending BOOLEAN NOT NULL DEFAULT false;

  UPDATE preregistrations SET email_normalized = lower(email) WHERE email_normalized IS NULL;

  CREATE TABLE IF NOT EXISTS pop_reward_ledger (
    id SERIAL PRIMARY KEY,
    preregistration_id INTEGER NOT NULL REFERENCES preregistrations(id),
    reward_type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    related_preregistration_id INTEGER REFERENCES preregistrations(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- Minimal per-IP rate limiting (doc section 17). One row per attempt
  -- (success or failure); submitPreregistration counts recent rows for the
  -- caller's IP before doing any real work.
  CREATE TABLE IF NOT EXISTS rate_limit_log (
    id SERIAL PRIMARY KEY,
    ip TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_time ON rate_limit_log (ip, created_at);

  -- Artist registry, kept deliberately separate from preregistrations: this
  -- is the gate that decides whether an artist gets the OFFICIAL badge and
  -- licensed logo/photo assets on the site. Every artist starts unofficial
  -- with no license — nothing unlocks until an admin flips these fields
  -- after a real agency agreement is in place. logo_license and
  -- image_license are independent of official_status on purpose: a
  -- partnership can be confirmed before asset licensing paperwork clears,
  -- and we never want to render an asset we don't have documented rights to
  -- just because official_status looks good.
  CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    artist_name TEXT NOT NULL,
    fandom_name TEXT,
    agency TEXT,
    official_status TEXT NOT NULL DEFAULT 'unofficial'
      CHECK (official_status IN ('unofficial', 'pending', 'official')),
    logo_license BOOLEAN NOT NULL DEFAULT false,
    logo_url TEXT,
    image_license BOOLEAN NOT NULL DEFAULT false,
    hero_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- Nullable, and only ever set by looking up an existing artists row (never
  -- auto-created) — see lib/prereg.ts. Custom "Other" entries a fan types in
  -- stay unlinked until an admin formally adds that artist to the registry.
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS artist_id INTEGER REFERENCES artists(id);

  -- Seed the preset grid (lib/artists.ts POPULAR_ARTISTS) so the registry
  -- has a row to look up from day one. ON CONFLICT DO NOTHING so re-running
  -- this on every deploy never clobbers an admin's later edits.
  INSERT INTO artists (slug, artist_name, fandom_name, agency) VALUES
    ('bts', 'BTS', 'ARMY', 'HYBE'),
    ('blackpink', 'BLACKPINK', 'BLINK', 'YG Entertainment'),
    ('seventeen', 'SEVENTEEN', 'CARAT', 'PLEDIS Entertainment'),
    ('stray kids', 'Stray Kids', 'STAY', 'JYP Entertainment'),
    ('aespa', 'aespa', 'MY', 'SM Entertainment'),
    ('ive', 'IVE', 'DIVE', 'Starship Entertainment'),
    ('nct', 'NCT', 'NCTzen', 'SM Entertainment'),
    ('enhypen', 'ENHYPEN', 'ENGENE', 'BELIFT LAB'),
    ('twice', 'TWICE', 'ONCE', 'JYP Entertainment'),
    ('babymonster', 'BABYMONSTER', 'MONSTIEZ', 'YG Entertainment')
  ON CONFLICT (slug) DO NOTHING;

  -- Picker refresh: NCT and TWICE dropped off POPULAR_ARTISTS (their rows
  -- above are left as-is — harmless, and any existing pre-registrations
  -- still point at them), these 8 replace/join them. fandom_name/agency
  -- left NULL where not confidently known rather than guessed; an admin
  -- can fill them in later from the Artist registry screen.
  INSERT INTO artists (slug, artist_name, fandom_name, agency) VALUES
    ('ateez', 'ATEEZ', 'ATINY', 'KQ Entertainment'),
    ('le sserafim', 'LE SSERAFIM', 'FEARNOT', 'SOURCE MUSIC'),
    ('riize', 'RIIZE', 'BRIIZE', 'SM Entertainment'),
    ('boynextdoor', 'BOYNEXTDOOR', 'DOR', 'KOZ Entertainment'),
    ('illit', 'ILLIT', NULL, 'BELIFT LAB'),
    ('tws', 'TWS', NULL, 'PLEDIS Entertainment'),
    ('cortis', 'CORTIS', NULL, NULL),
    ('hearts2hearts', 'Hearts2Hearts', NULL, 'SM Entertainment')
  ON CONFLICT (slug) DO NOTHING;

  -- Fandom-level querying (admin CSV export, per-artist breakdown) leans on
  -- this join constantly — preregistrations was only indexed on the raw
  -- normalized name before artist_id existed.
  CREATE INDEX IF NOT EXISTS idx_prereg_artist_id ON preregistrations (artist_id);

  -- Attribution: which UTM parameters and/or invite link brought this
  -- registration in. Captured client-side on landing (see
  -- components/landing/AttributionTracker.tsx) and submitted along with the
  -- form — first-touch, not last-touch, so a fan who browses around before
  -- registering is still credited to whatever link/campaign first brought
  -- them in.
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS utm_source TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS utm_medium TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS utm_term TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS utm_content TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS landing_path TEXT;
  CREATE INDEX IF NOT EXISTS idx_prereg_utm_source ON preregistrations (utm_source);

  -- Every landing hit that carries a referral code and/or UTM params, logged
  -- before we know whether it converts — this is what makes click-through
  -- and conversion-rate-per-referrer measurable, not just raw signup counts.
  -- One row per browser session (deduped client-side), not per pageview.
  CREATE TABLE IF NOT EXISTS link_visits (
    id SERIAL PRIMARY KEY,
    referral_code TEXT,
    artist_param TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    landing_path TEXT,
    referrer TEXT,
    ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS idx_link_visits_code ON link_visits (referral_code);
  CREATE INDEX IF NOT EXISTS idx_link_visits_time ON link_visits (created_at);
  CREATE INDEX IF NOT EXISTS idx_link_visits_utm_source ON link_visits (utm_source);

  -- Referral program spec section 6/9: structure for matching a pre-registration
  -- to the real FANUZU account created after app launch, and for tracking that
  -- registrant's own signup reward through to actual payout. Nothing here pays
  -- out POP by itself — every row is created 'pending' and stays that way until
  -- a post-launch matching flow (which doesn't exist yet) flips it.
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS app_user_id TEXT;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS matched_at TIMESTAMPTZ;
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS reward_status TEXT NOT NULL DEFAULT 'pending';
  ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS reward_paid_at TIMESTAMPTZ;
  DO $$ BEGIN
    ALTER TABLE preregistrations ADD CONSTRAINT preregistrations_reward_status_check
      CHECK (reward_status IN ('pending', 'eligible', 'paid', 'rejected'));
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  CREATE UNIQUE INDEX IF NOT EXISTS idx_prereg_app_user_id ON preregistrations (app_user_id) WHERE app_user_id IS NOT NULL;

  -- Referral program spec section 7: a normalized relationship row per
  -- successful referral, kept alongside (not instead of) preregistrations
  -- .referred_by_id — this is what makes per-referrer aggregation (count,
  -- ranking, reward status) a straight query instead of a self-join, and
  -- gives referral rewards their own payout lifecycle independent of the
  -- referred user's own signup reward. The UNIQUE on referred_preregistration_id
  -- enforces "one referrer per user" at the DB level, not just in application code.
  CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_preregistration_id INTEGER NOT NULL REFERENCES preregistrations(id),
    referred_preregistration_id INTEGER NOT NULL UNIQUE REFERENCES preregistrations(id),
    referral_code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'eligible', 'paid', 'rejected')),
    reward_amount_referrer INTEGER NOT NULL DEFAULT 100,
    reward_amount_referred INTEGER NOT NULL DEFAULT 100,
    reward_paid_at TIMESTAMPTZ
  );
  CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_preregistration_id);
  CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals (referral_code);
`;

// Cached across hot-reloads/invocations within the same process so we don't
// reopen the pool (or re-run the idempotent schema check) on every call.
export function getPool(): Pool {
  if (!global.__fanuzuPool) {
    global.__fanuzuPool = createPool();
  }
  return global.__fanuzuPool;
}

export function ensureSchema(): Promise<void> {
  if (!global.__fanuzuMigration) {
    global.__fanuzuMigration = getPool().query(SCHEMA_SQL).then(() => undefined);
  }
  return global.__fanuzuMigration;
}
