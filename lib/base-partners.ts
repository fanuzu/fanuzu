// Server-only: fandom-base-account invite codes (see lib/db.ts's
// base_partners table for the distinction from personal referral codes).
// Never import from a client component.
import { ensureSchema, getPool } from './db';

export interface BasePartner {
  id: number;
  name: string;
  xHandle: string | null;
  fandom: string;
  code: string;
  targetCount: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface BasePartnerWithCount extends BasePartner {
  preregCount: number;
  achievementPct: number | null;
}

interface BasePartnerRow {
  id: number;
  name: string;
  x_handle: string | null;
  fandom: string;
  code: string;
  target_count: number | null;
  is_active: boolean;
  created_at: string;
}

function mapRow(row: BasePartnerRow): BasePartner {
  return {
    id: row.id,
    name: row.name,
    xHandle: row.x_handle,
    fandom: row.fandom,
    code: row.code,
    targetCount: row.target_count,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

// Same misread-resistant alphabet as the personal referral codes
// (lib/prereg.ts) — O/0, I/1, L all dropped.
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_SUFFIX_LENGTH = 4;

function randomSuffix(length: number): string {
  let s = '';
  for (let i = 0; i < length; i++) {
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return s;
}

// Prefix is the fandom name itself, uppercased and stripped to
// letters/digits (e.g. "Stray Kids" -> "STRAYKIDS") so the code still reads
// as "which fandom" at a glance without a separate abbreviation mapping.
function codePrefix(fandom: string): string {
  const cleaned = fandom.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return cleaned || 'FAN';
}

async function generateBaseCode(fandom: string): Promise<string> {
  const pool = getPool();
  const prefix = codePrefix(fandom);
  for (let attempt = 0; attempt < 25; attempt++) {
    const code = `${prefix}-${randomSuffix(CODE_SUFFIX_LENGTH)}`;
    const { rows } = await pool.query('SELECT 1 FROM base_partners WHERE upper(code) = upper($1)', [code]);
    if (rows.length === 0) return code;
  }
  // Astronomically unlikely fallback: widen with a base36 time suffix so collisions can't persist.
  return `${prefix}-${randomSuffix(2)}${Date.now().toString(36).toUpperCase()}`;
}

export interface CreateBasePartnerInput {
  name: string;
  xHandle: string | null;
  fandom: string;
  targetCount: number | null;
}

// Admin-only: code is always server-generated (never supplied by the
// caller) so the misread-resistant alphabet and uniqueness guarantee always
// hold.
export async function createBasePartner(input: CreateBasePartnerInput): Promise<BasePartner> {
  await ensureSchema();
  const pool = getPool();
  const code = await generateBaseCode(input.fandom);
  const { rows } = await pool.query<BasePartnerRow>(
    `INSERT INTO base_partners (name, x_handle, fandom, code, target_count, is_active)
     VALUES ($1,$2,$3,$4,$5,true)
     RETURNING *`,
    [input.name, input.xHandle || null, input.fandom, code, input.targetCount]
  );
  return mapRow(rows[0]);
}

// Admin-only: every base partner plus how many fans registered through its
// code, and progress toward target_count when one is set.
export async function listBasePartnersWithCounts(): Promise<BasePartnerWithCount[]> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<BasePartnerRow & { prereg_count: string }>(
    `SELECT b.*, COUNT(p.id) AS prereg_count
     FROM base_partners b
     LEFT JOIN preregistrations p ON p.base_partner_id = b.id
     GROUP BY b.id
     ORDER BY b.created_at DESC`
  );
  return rows.map((r) => {
    const preregCount = Number(r.prereg_count);
    const achievementPct = r.target_count ? Math.round((preregCount / r.target_count) * 1000) / 10 : null;
    return { ...mapRow(r), preregCount, achievementPct };
  });
}

// Admin-only: flips is_active. Never deletes — a deactivated code still
// needs to resolve to "normal registration, no error" forever (see
// lib/prereg.ts), and its historical registrations/counts must stay intact.
export async function setBasePartnerActive(id: number, isActive: boolean): Promise<BasePartner | null> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<BasePartnerRow>(
    'UPDATE base_partners SET is_active = $1 WHERE id = $2 RETURNING *',
    [isActive, id]
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export interface BasePartnerMatch {
  id: number;
  fandom: string;
  isActive: boolean;
}

// Used by submitPreregistration to resolve an invite-code input that didn't
// match any personal referral code. Case-insensitive, same as the unique
// index.
export async function findBasePartnerByCode(code: string): Promise<BasePartnerMatch | null> {
  const pool = getPool();
  const { rows } = await pool.query<{ id: number; fandom: string; is_active: boolean }>(
    'SELECT id, fandom, is_active FROM base_partners WHERE upper(code) = upper($1)',
    [code]
  );
  const row = rows[0];
  return row ? { id: row.id, fandom: row.fandom, isActive: row.is_active } : null;
}

// Public (no admin gate): the only thing a visitor's own ?code= link is
// allowed to reveal is the fandom it belongs to, so the artist picker can
// auto-select it — never the partner's name, handle, target, or counts.
export async function getActiveBaseCodeFandom(code: string): Promise<string | null> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<{ fandom: string }>(
    'SELECT fandom FROM base_partners WHERE upper(code) = upper($1) AND is_active = true',
    [code]
  );
  return rows[0]?.fandom ?? null;
}
