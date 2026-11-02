// Server-only: link_visits (top-of-funnel attribution) and the read-side
// queries the admin analytics view and CSV export use. Never import from a
// client component — see lib/artist-registry.ts for why (pulls `pg` into
// the browser bundle).
import { ensureSchema, getPool } from './db';
import { normalizeArtistSlug } from './artists';

const MAX_FIELD_LEN = 200;

function clip(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_FIELD_LEN);
}

export interface LinkVisitInput {
  referralCode?: unknown;
  artist?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  utmTerm?: unknown;
  utmContent?: unknown;
  landingPath?: unknown;
  referrer?: unknown;
}

// Fire-and-forget from the client on first landing each session (see
// AttributionTracker.tsx) — this is what makes click-through and
// conversion-rate-per-referrer measurable instead of just raw signup counts.
export async function recordLinkVisit(input: LinkVisitInput, ip: string, userAgent: string): Promise<void> {
  await ensureSchema();
  const pool = getPool();
  await pool.query(
    `INSERT INTO link_visits (referral_code, artist_param, utm_source, utm_medium, utm_campaign, utm_term, utm_content, landing_path, referrer, ip, user_agent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      clip(input.referralCode)?.toUpperCase() ?? null,
      clip(input.artist),
      clip(input.utmSource),
      clip(input.utmMedium),
      clip(input.utmCampaign),
      clip(input.utmTerm),
      clip(input.utmContent),
      clip(input.landingPath),
      clip(input.referrer),
      clip(ip),
      clip(userAgent),
    ]
  );
}

export interface UtmBreakdownRow {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  visits: number;
  conversions: number;
}

// Admin-only: every (source, medium, campaign) combo that's shown up as
// either a visit or a conversion, with both counts side by side so
// conversion rate per campaign is a glance, not a spreadsheet exercise.
export async function getUtmBreakdown(): Promise<UtmBreakdownRow[]> {
  await ensureSchema();
  const pool = getPool();

  const key = (s: string | null, m: string | null, c: string | null) => `${s ?? ''} ${m ?? ''} ${c ?? ''}`;
  const combined = new Map<string, UtmBreakdownRow>();

  const { rows: visitRows } = await pool.query<{ utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; count: string }>(
    `SELECT utm_source, utm_medium, utm_campaign, COUNT(*) AS count
     FROM link_visits
     WHERE utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL
     GROUP BY utm_source, utm_medium, utm_campaign`
  );
  for (const r of visitRows) {
    const k = key(r.utm_source, r.utm_medium, r.utm_campaign);
    combined.set(k, {
      utmSource: r.utm_source ?? '(none)',
      utmMedium: r.utm_medium ?? '(none)',
      utmCampaign: r.utm_campaign ?? '(none)',
      visits: Number(r.count),
      conversions: 0,
    });
  }

  const { rows: convRows } = await pool.query<{ utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; count: string }>(
    `SELECT utm_source, utm_medium, utm_campaign, COUNT(*) AS count
     FROM preregistrations
     WHERE utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL
     GROUP BY utm_source, utm_medium, utm_campaign`
  );
  for (const r of convRows) {
    const k = key(r.utm_source, r.utm_medium, r.utm_campaign);
    const existing = combined.get(k);
    if (existing) {
      existing.conversions = Number(r.count);
    } else {
      combined.set(k, {
        utmSource: r.utm_source ?? '(none)',
        utmMedium: r.utm_medium ?? '(none)',
        utmCampaign: r.utm_campaign ?? '(none)',
        visits: 0,
        conversions: Number(r.count),
      });
    }
  }

  return Array.from(combined.values()).sort((a, b) => b.visits + b.conversions - (a.visits + a.conversions));
}

export interface ReferralStatRow {
  referralCode: string;
  visits: number;
  conversions: number;
}

// Admin-only: per-invite-code visits vs. conversions, so "who's actually
// bringing people in" is answerable without a manual join.
export async function getReferralStats(): Promise<ReferralStatRow[]> {
  await ensureSchema();
  const pool = getPool();
  const combined = new Map<string, ReferralStatRow>();

  const { rows: visitRows } = await pool.query<{ referral_code: string; count: string }>(
    `SELECT referral_code, COUNT(*) AS count FROM link_visits WHERE referral_code IS NOT NULL GROUP BY referral_code`
  );
  for (const r of visitRows) {
    combined.set(r.referral_code, { referralCode: r.referral_code, visits: Number(r.count), conversions: 0 });
  }

  const { rows: convRows } = await pool.query<{ referral_code_input: string; count: string }>(
    `SELECT referral_code_input, COUNT(*) AS count FROM preregistrations WHERE referral_code_input IS NOT NULL GROUP BY referral_code_input`
  );
  for (const r of convRows) {
    const code = r.referral_code_input.toUpperCase();
    const existing = combined.get(code);
    if (existing) {
      existing.conversions = Number(r.count);
    } else {
      combined.set(code, { referralCode: code, visits: 0, conversions: Number(r.count) });
    }
  }

  return Array.from(combined.values()).sort((a, b) => b.conversions - a.conversions || b.visits - a.visits);
}

export interface ReferralProgramSummary {
  total: number;
  referred: number;
  direct: number;
}

// Admin-only, referral program spec section 14: how many pre-registrations
// came in with a valid referral relationship attached vs. on their own.
// Reads preregistrations.referred_by_id directly rather than the referrals
// table so it can never disagree with what submitPreregistration actually
// wrote at signup time.
export async function getReferralProgramSummary(): Promise<ReferralProgramSummary> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<{ total: string; referred: string }>(
    `SELECT COUNT(*) AS total, COUNT(referred_by_id) AS referred FROM preregistrations`
  );
  const total = Number(rows[0].total);
  const referred = Number(rows[0].referred);
  return { total, referred, direct: total - referred };
}

export interface ReferrerLeaderboardRow {
  referrerId: number;
  referralCode: string;
  email: string;
  referredCount: number;
  pendingPop: number;
  paidPop: number;
}

// Admin-only: one row per fan who has successfully referred at least one
// other person, aggregated from the `referrals` relationship table (spec
// section 7) — this is the "누가 실제로 사람을 데려오고 있는가" view, distinct
// from getReferralStats() in this file, which is raw link-click traffic and
// includes codes that were shared but never converted anyone yet.
export async function getReferrerLeaderboard(): Promise<ReferrerLeaderboardRow[]> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<{
    referrer_id: number;
    referral_code: string;
    email: string;
    referred_count: string;
    pending_pop: string;
    paid_pop: string;
  }>(
    `SELECT p.id AS referrer_id, p.referral_code, p.email,
            COUNT(r.id) AS referred_count,
            COALESCE(SUM(CASE WHEN r.status = 'pending' THEN r.reward_amount_referrer ELSE 0 END), 0) AS pending_pop,
            COALESCE(SUM(CASE WHEN r.status = 'paid' THEN r.reward_amount_referrer ELSE 0 END), 0) AS paid_pop
     FROM referrals r
     JOIN preregistrations p ON p.id = r.referrer_preregistration_id
     GROUP BY p.id, p.referral_code, p.email
     ORDER BY COUNT(r.id) DESC`
  );
  return rows.map((r) => ({
    referrerId: r.referrer_id,
    referralCode: r.referral_code,
    email: r.email,
    referredCount: Number(r.referred_count),
    pendingPop: Number(r.pending_pop),
    paidPop: Number(r.paid_pop),
  }));
}

export interface ReferralSearchFilters {
  q?: string;
  hasReferral?: 'yes' | 'no';
  from?: string;
  to?: string;
}

export interface ReferralSearchRow {
  id: number;
  email: string;
  referralCode: string;
  referredByCode: string | null;
  isReferred: boolean;
  rewardAmount: number;
  rewardStatus: string;
  createdAt: string;
}

// Admin-only, referral program spec section 14's search box: by email or
// referral code (own or the one they entered), a date range, and whether a
// referral was involved at all. Every clause is bound as a query parameter —
// none of this is string-interpolated into the SQL.
export async function searchReferrals(filters: ReferralSearchFilters): Promise<ReferralSearchRow[]> {
  await ensureSchema();
  const pool = getPool();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.q) {
    params.push(`%${filters.q}%`);
    const i = params.length;
    clauses.push(`(email ILIKE $${i} OR referral_code ILIKE $${i} OR referral_code_input ILIKE $${i})`);
  }
  if (filters.hasReferral === 'yes') {
    clauses.push('referred_by_id IS NOT NULL');
  } else if (filters.hasReferral === 'no') {
    clauses.push('referred_by_id IS NULL');
  }
  if (filters.from) {
    params.push(filters.from);
    clauses.push(`created_at >= $${params.length}`);
  }
  if (filters.to) {
    params.push(filters.to);
    clauses.push(`created_at <= $${params.length}`);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await pool.query<{
    id: number;
    email: string;
    referral_code: string;
    referred_by_code: string | null;
    reward_amount: number;
    reward_status: string;
    created_at: string;
  }>(
    `SELECT p.id, p.email, p.referral_code, ref.referral_code AS referred_by_code,
            p.reward_amount, p.reward_status, p.created_at
     FROM preregistrations p
     LEFT JOIN preregistrations ref ON ref.id = p.referred_by_id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT 200`,
    params
  );
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    referralCode: r.referral_code,
    referredByCode: r.referred_by_code,
    isReferred: !!r.referred_by_code,
    rewardAmount: r.reward_amount,
    rewardStatus: r.reward_status,
    createdAt: r.created_at,
  }));
}

export interface CountryBreakdownRow {
  country: string;
  count: number;
}

// Admin-only: how many pre-registrations came from each country, read from
// Vercel's edge geo header at submission time (see lib/request-ip.ts) —
// never asked of the fan directly. Rows with no detected country (local
// dev, non-Vercel traffic) are grouped under '(unknown)' rather than
// dropped, so the total here still matches the overall pre-reg count.
export async function getCountryBreakdown(): Promise<CountryBreakdownRow[]> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<{ country: string | null; count: string }>(
    `SELECT country, COUNT(*) AS count FROM preregistrations GROUP BY country ORDER BY COUNT(*) DESC`
  );
  return rows.map((r) => ({ country: r.country ?? '(unknown)', count: Number(r.count) }));
}

export interface FandomExportRow {
  id: number;
  email: string;
  artistName: string;
  fandomName: string | null;
  fanSinceYear: string | null;
  language: string | null;
  country: string | null;
  referralCodeInput: string | null;
  basePartnerCode: string | null;
  rewardAmount: number;
  artistJoinOrder: number;
  preregBadgeEligible: boolean;
  preregBadgeNumber: number | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
}

// Admin-only: the concrete "give us this fandom's pre-registrations" export
// — filtered to one artist_id, or every registration when artistId is null.
// origin_100_eligible/origin_100_number are the DB's historical column names
// from the retired ORIGIN 100 (first-100-only) policy; every fan now earns
// the PRE-REG BADGE regardless of order, so these columns are kept as-is
// (renaming them would be a migration for no functional gain) but surfaced
// here under the current preregBadge* names.
export async function getFandomExportRows(artistId: number | null): Promise<FandomExportRow[]> {
  await ensureSchema();
  const pool = getPool();
  const where = artistId !== null ? 'WHERE p.artist_id = $1' : '';
  const params = artistId !== null ? [artistId] : [];
  const { rows } = await pool.query<{
    id: number;
    email: string;
    artist_name_input: string;
    fandom_name: string | null;
    fan_since_year: string | null;
    language: string | null;
    country: string | null;
    referral_code_input: string | null;
    base_partner_code: string | null;
    reward_amount: number;
    artist_join_order: number;
    origin_100_eligible: boolean;
    origin_100_number: number | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    created_at: string;
  }>(
    `SELECT p.id, p.email, p.artist_name_input, p.fandom_name, p.fan_since_year, p.language, p.country,
            p.referral_code_input, b.code AS base_partner_code,
            p.reward_amount, p.artist_join_order, p.origin_100_eligible, p.origin_100_number,
            p.utm_source, p.utm_medium, p.utm_campaign, p.created_at
     FROM preregistrations p
     LEFT JOIN base_partners b ON b.id = p.base_partner_id
     ${where}
     ORDER BY p.artist_join_order ASC`,
    params
  );
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    artistName: r.artist_name_input,
    fandomName: r.fandom_name,
    fanSinceYear: r.fan_since_year,
    language: r.language,
    country: r.country,
    referralCodeInput: r.referral_code_input,
    basePartnerCode: r.base_partner_code,
    rewardAmount: r.reward_amount,
    artistJoinOrder: r.artist_join_order,
    preregBadgeEligible: r.origin_100_eligible,
    preregBadgeNumber: r.origin_100_number,
    utmSource: r.utm_source,
    utmMedium: r.utm_medium,
    utmCampaign: r.utm_campaign,
    createdAt: r.created_at,
  }));
}

export interface SuspiciousRegistrationRow {
  id: number;
  email: string;
  artistName: string;
  ip: string;
  createdAt: string;
  windowCount: number;
}

// Admin-only fraud-review surface: flags a registration whenever it's one of
// 3+ (SUSPICIOUS_THRESHOLD) from the same IP within a trailing
// SUSPICIOUS_WINDOW_MINUTES — a tighter, non-blocking signal layered on top
// of the hard rate limit in lib/prereg.ts (10 min / 8 attempts), which exists
// to slow down scripted abuse rather than to flag it for review. Rows with
// no IP (pre-dating the `ip` column, or off-Vercel) are never flagged.
const SUSPICIOUS_WINDOW_MINUTES = 10;
const SUSPICIOUS_THRESHOLD = 3;

export async function getSuspiciousRegistrations(): Promise<SuspiciousRegistrationRow[]> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<{
    id: number;
    email: string;
    artist_name_input: string;
    ip: string;
    created_at: string;
    window_count: string;
  }>(
    `SELECT id, email, artist_name_input, ip, created_at, window_count FROM (
       SELECT id, email, artist_name_input, ip, created_at,
              COUNT(*) OVER (
                PARTITION BY ip ORDER BY created_at
                RANGE BETWEEN INTERVAL '${SUSPICIOUS_WINDOW_MINUTES} minutes' PRECEDING AND CURRENT ROW
              ) AS window_count
       FROM preregistrations
       WHERE ip IS NOT NULL
     ) windowed
     WHERE window_count >= ${SUSPICIOUS_THRESHOLD}
     ORDER BY ip, created_at DESC`
  );
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    artistName: r.artist_name_input,
    ip: r.ip,
    createdAt: r.created_at,
    windowCount: Number(r.window_count),
  }));
}

export interface DailyTrendPoint {
  day: string;
  count: number;
}

export interface DailyTrendFilter {
  fandom?: string;
  basePartnerId?: number;
}

// Admin-only: registrations per day, optionally scoped to one fandom
// (artist_name_normalized) and/or one base partner code — same filter
// shape doubles as "fandom trend" and "code trend" (doc requirement 3c)
// depending on which fields are passed.
export async function getDailyRegistrationTrend(filter: DailyTrendFilter): Promise<DailyTrendPoint[]> {
  await ensureSchema();
  const pool = getPool();
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (filter.fandom) {
    params.push(normalizeArtistSlug(filter.fandom));
    clauses.push(`artist_name_normalized = $${params.length}`);
  }
  if (filter.basePartnerId) {
    params.push(filter.basePartnerId);
    clauses.push(`base_partner_id = $${params.length}`);
  }
  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await pool.query<{ day: string; count: string }>(
    `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*) AS count
     FROM preregistrations
     ${where}
     GROUP BY day
     ORDER BY day ASC`,
    params
  );
  return rows.map((r) => ({ day: r.day, count: Number(r.count) }));
}
