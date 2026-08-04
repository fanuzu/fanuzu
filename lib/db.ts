import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __fanuzuPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __fanuzuMigration: Promise<void> | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Point it at your Postgres/Supabase connection string (see .env.example).'
    );
  }
  // Supabase (and most managed Postgres) terminate with a cert that isn't
  // in Node's default trust store unless the sslmode is already in the
  // connection string — rejectUnauthorized:false only weakens verification
  // of the intermediate chain, not the encrypted-transport guarantee.
  const useSsl = /sslmode=require/.test(connectionString) || process.env.PGSSL === 'true';
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

  CREATE TABLE IF NOT EXISTS pop_reward_ledger (
    id SERIAL PRIMARY KEY,
    preregistration_id INTEGER NOT NULL REFERENCES preregistrations(id),
    reward_type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    related_preregistration_id INTEGER REFERENCES preregistrations(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
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
