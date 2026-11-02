-- FANUZU: fandom-base-account invite codes (base partners)
--
-- NOTE: this repo has no separate migration runner — this exact SQL is
-- embedded in lib/db.ts's SCHEMA_SQL and already runs automatically and
-- idempotently (CREATE ... IF NOT EXISTS / ADD COLUMN IF NOT EXISTS) the
-- first time any API route touches the database after this code is
-- deployed. This file is a reference copy only, in case you want to review
-- or hand-run it against production ahead of deploying the app code.

-- Fandom-base-account invite codes (X/Twitter fan accounts), distinct from
-- the personal per-registrant codes: one base partner can be shared by an
-- unlimited number of fans, carries no "self-referral" concept, and is
-- tracked separately so admin can see which base account is actually
-- driving sign-ups for a given fandom. code is matched case-insensitively.
CREATE TABLE IF NOT EXISTS base_partners (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  x_handle TEXT,
  fandom TEXT NOT NULL,
  code TEXT NOT NULL,
  target_count INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_base_partners_code ON base_partners (upper(code));
CREATE INDEX IF NOT EXISTS idx_base_partners_fandom ON base_partners (fandom);

-- Nullable: only set when the invite code entered at sign-up resolved to a
-- base partner rather than another fan's personal code. ip is new here too
-- — previously only logged per-attempt in rate_limit_log, never persisted
-- on the successful registration itself, which made "same IP, several
-- sign-ups in a short window" unanswerable without this column. Already
-- covered by the existing privacy policy's IP/fraud-detection disclosure.
ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS base_partner_id INTEGER REFERENCES base_partners(id);
ALTER TABLE preregistrations ADD COLUMN IF NOT EXISTS ip TEXT;
CREATE INDEX IF NOT EXISTS idx_prereg_base_partner ON preregistrations (base_partner_id);
CREATE INDEX IF NOT EXISTS idx_prereg_ip_created ON preregistrations (ip, created_at);

-- Optional public per-fandom pre-registration goal (public progress bar,
-- flagged off by default via SHOW_FANDOM_PROGRESS). Its own arbitrary
-- admin-set number, independent of any individual base partner's own
-- target_count above.
ALTER TABLE artists ADD COLUMN IF NOT EXISTS prereg_goal INTEGER;
