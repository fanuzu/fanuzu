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
