import { ensureSchema, getPool } from './db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Doc section 17: minimal per-IP rate limiting. Generous enough that a
// legitimate user retrying a typo'd form never hits it, tight enough to
// slow down a scripted flood.
const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_ATTEMPTS = 8;

export interface PreregRequestBody {
  artistName?: unknown;
  fandomName?: unknown;
  email?: unknown;
  fanSince?: unknown;
  language?: unknown;
  referralCode?: unknown;
  age14Consent?: unknown;
  termsConsent?: unknown;
  privacyConsent?: unknown;
  marketingConsent?: unknown;
  termsVersion?: unknown;
  privacyVersion?: unknown;
  termsAcceptedAt?: unknown;
  privacyAcceptedAt?: unknown;
  marketingConsentAt?: unknown;
}

// Matches the 6-language error taxonomy in lib/i18n.ts's `errors` resource
// (doc section 23) — the client looks up a localized message by this code.
export type PreregErrorCode =
  | 'invalid_email'
  | 'email_already_registered'
  | 'invalid_referral'
  | 'self_referral_not_allowed'
  | 'required_consent'
  | 'rate_limit';

export interface PreregSuccess {
  success: true;
  preregistrationOrder: number;
  artistJoinOrder: number;
  rewardAmount: number;
  referralApplied: boolean;
  origin100Eligible: boolean;
  origin100Number: number | null;
  referralCode: string;
}

export interface PreregFailure {
  success: false;
  error: PreregErrorCode;
  message: string;
}

function normalizeArtistName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function slugFromArtist(name: string): string {
  const slug = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  return slug || 'FANZ';
}

async function generateReferralCode(artistName: string): Promise<string> {
  const pool = getPool();
  const slug = slugFromArtist(artistName);
  for (let attempt = 0; attempt < 25; attempt++) {
    const code = `FANUZU-${slug}${Math.floor(1000 + Math.random() * 9000)}`;
    const { rows } = await pool.query('SELECT 1 FROM preregistrations WHERE referral_code = $1', [code]);
    if (rows.length === 0) return code;
  }
  // Astronomically unlikely fallback: widen the suffix so collisions can't persist.
  return `FANUZU-${slug}${Date.now().toString(36).toUpperCase()}`;
}

function fail(error: PreregErrorCode, message: string): PreregFailure {
  return { success: false, error, message };
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Validates and persists a pre-registration, mirroring the server-side checks
 * called out in the product brief: rate limiting, email format + dedup,
 * referral code validity + self-referral, required terms/privacy consent
 * (marketing consent is optional and never blocks registration), artist join
 * order and ORIGIN 100 eligibility (first 100 valid registrations per
 * artist), and reward reservation (50 POP base / 100 POP with a valid
 * referral, plus a 100 POP ledger entry for the referrer).
 */
export async function submitPreregistration(
  body: PreregRequestBody,
  ip: string
): Promise<PreregSuccess | PreregFailure> {
  await ensureSchema();
  const pool = getPool();

  const { rows: rateRows } = await pool.query<{ count: string }>(
    `SELECT COUNT(*) AS count FROM rate_limit_log WHERE ip = $1 AND created_at > now() - interval '${RATE_LIMIT_WINDOW_MINUTES} minutes'`,
    [ip]
  );
  if (Number(rateRows[0].count) >= RATE_LIMIT_MAX_ATTEMPTS) {
    return fail('rate_limit', 'Too many attempts. Please try again shortly.');
  }
  await pool.query('INSERT INTO rate_limit_log (ip) VALUES ($1)', [ip]);

  const artistName = typeof body.artistName === 'string' ? body.artistName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const fandomName = typeof body.fandomName === 'string' ? body.fandomName.trim() : '';
  const fanSince = typeof body.fanSince === 'string' ? body.fanSince.trim() : '';
  const language = typeof body.language === 'string' ? body.language.trim() : '';
  const referralCodeInput = typeof body.referralCode === 'string' ? body.referralCode.trim() : '';
  const age14Consent = body.age14Consent === true;
  const termsConsent = body.termsConsent === true;
  const privacyConsent = body.privacyConsent === true;
  const marketingConsent = body.marketingConsent === true;
  const termsVersion = typeof body.termsVersion === 'string' ? body.termsVersion : null;
  const privacyVersion = typeof body.privacyVersion === 'string' ? body.privacyVersion : null;
  const termsAcceptedAt = parseDate(body.termsAcceptedAt);
  const privacyAcceptedAt = parseDate(body.privacyAcceptedAt);
  const marketingConsentAt = parseDate(body.marketingConsentAt);

  if (!artistName || !email || !age14Consent || !termsConsent || !privacyConsent) {
    return fail('required_consent', 'Artist name, email, and all required consents are needed.');
  }
  if (!EMAIL_RE.test(email)) {
    return fail('invalid_email', 'Enter a valid email address.');
  }

  const emailNormalized = email.toLowerCase();
  const dupe = await pool.query('SELECT 1 FROM preregistrations WHERE email_normalized = $1', [emailNormalized]);
  if (dupe.rows.length > 0) {
    return fail('email_already_registered', 'This email has already pre-registered.');
  }

  let referrer: { id: number; email: string } | null = null;
  if (referralCodeInput) {
    const { rows } = await pool.query<{ id: number; email: string }>(
      'SELECT id, email FROM preregistrations WHERE referral_code = $1',
      [referralCodeInput.toUpperCase()]
    );
    const row = rows[0];
    if (!row) {
      return fail('invalid_referral', "We couldn't find that referral code.");
    }
    if (row.email.toLowerCase() === emailNormalized) {
      return fail('self_referral_not_allowed', 'You cannot use your own referral code.');
    }
    referrer = row;
  }

  const artistNameNormalized = normalizeArtistName(artistName);
  const { rows: countRows } = await pool.query<{ count: string }>(
    'SELECT COUNT(*) AS count FROM preregistrations WHERE artist_name_normalized = $1',
    [artistNameNormalized]
  );
  const artistJoinOrder = Number(countRows[0].count) + 1;
  const origin100Eligible = artistJoinOrder <= 100;
  const origin100Number = origin100Eligible ? artistJoinOrder : null;

  const rewardAmount = referrer ? 100 : 50;
  const referralCode = await generateReferralCode(artistName);

  const client = await pool.connect();
  let preregistrationId: number;
  try {
    await client.query('BEGIN');

    const insertResult = await client.query<{ id: number }>(
      `INSERT INTO preregistrations (
         email, email_normalized, artist_name_input, artist_name_normalized, fandom_name, fan_since_year, language,
         referral_code_input, referred_by_id, reward_amount, age_confirmed, privacy_consent,
         terms_version, privacy_version, terms_accepted_at, privacy_accepted_at,
         marketing_consent, marketing_consent_at,
         artist_join_order, origin_100_eligible, origin_100_number, referral_code
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       RETURNING id`,
      [
        email,
        emailNormalized,
        artistName,
        artistNameNormalized,
        fandomName || null,
        fanSince || null,
        language || null,
        referralCodeInput || null,
        referrer ? referrer.id : null,
        rewardAmount,
        age14Consent,
        privacyConsent,
        termsVersion,
        privacyVersion,
        termsAcceptedAt,
        privacyAcceptedAt,
        marketingConsent,
        marketingConsentAt,
        artistJoinOrder,
        origin100Eligible,
        origin100Number,
        referralCode,
      ]
    );
    preregistrationId = insertResult.rows[0].id;

    await client.query(
      `INSERT INTO pop_reward_ledger (preregistration_id, reward_type, amount, related_preregistration_id)
       VALUES ($1,$2,$3,$4)`,
      [preregistrationId, referrer ? 'PREREGISTRATION_REFERRAL' : 'PREREGISTRATION_BASIC', rewardAmount, referrer ? referrer.id : null]
    );

    if (referrer) {
      await client.query(
        `INSERT INTO pop_reward_ledger (preregistration_id, reward_type, amount, related_preregistration_id)
         VALUES ($1,'REFERRER_REWARD',100,$2)`,
        [referrer.id, preregistrationId]
      );
      await client.query(
        'UPDATE preregistrations SET referrer_reward_pending = true WHERE id = $1',
        [referrer.id]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return {
    success: true,
    preregistrationOrder: preregistrationId,
    artistJoinOrder,
    rewardAmount,
    referralApplied: !!referrer,
    origin100Eligible,
    origin100Number,
    referralCode,
  };
}
