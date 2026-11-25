// Server-only: admin-configured fandom ranking events (see lib/db.ts's
// ranking_events / ranking_event_results tables). Never import from a client
// component.
import { ensureSchema, getPool } from './db';

export type RankingEventStatus = 'draft' | 'active' | 'finalized';
export type VisibilityMode = 'manual' | 'auto';

// 2nd-round review item 3: a fan who registered before the event closed but
// hasn't yet clicked their confirmation email's verify link shouldn't be
// silently cut out the moment end_at passes — but a verification arriving
// arbitrarily late (weeks after the fact) shouldn't be able to retroactively
// change a result either. Both the live standing and the final snapshot
// apply the same cutoff: a registration only counts if it was also verified
// by end_at plus this grace window. Env-overridable, same pattern as
// RANKING_MIN_PARTICIPANTS, so it can be tuned without a code change.
export const EMAIL_VERIFY_GRACE_HOURS = Number(process.env.RANKING_EMAIL_VERIFY_GRACE_HOURS) || 48;

export interface RankingEvent {
  id: number;
  name: string;
  startAt: string | null;
  endAt: string | null;
  visibilityMode: VisibilityMode;
  isVisible: boolean;
  includeExistingRegistrants: boolean;
  rewardFirst: number;
  rewardSecond: number;
  rewardThird: number;
  rewardFourthToTenth: number;
  status: RankingEventStatus;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RankingEventRow {
  id: number;
  name: string;
  start_at: string | null;
  end_at: string | null;
  visibility_mode: VisibilityMode;
  is_visible: boolean;
  include_existing_registrants: boolean;
  reward_first: number;
  reward_second: number;
  reward_third: number;
  reward_fourth_to_tenth: number;
  status: RankingEventStatus;
  finalized_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: RankingEventRow): RankingEvent {
  return {
    id: row.id,
    name: row.name,
    startAt: row.start_at,
    endAt: row.end_at,
    visibilityMode: row.visibility_mode,
    isVisible: row.is_visible,
    includeExistingRegistrants: row.include_existing_registrants,
    rewardFirst: row.reward_first,
    rewardSecond: row.reward_second,
    rewardThird: row.reward_third,
    rewardFourthToTenth: row.reward_fourth_to_tenth,
    status: row.status,
    finalizedAt: row.finalized_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface RankingEventInput {
  name: string;
  startAt: string | null;
  endAt: string | null;
  visibilityMode: VisibilityMode;
  isVisible: boolean;
  includeExistingRegistrants: boolean;
  rewardFirst: number;
  rewardSecond: number;
  rewardThird: number;
  rewardFourthToTenth: number;
}

// Admin-only: every event, most recently created first, for the management
// list (which shows drafts and finalized history alongside whatever's live).
export async function listRankingEvents(): Promise<RankingEvent[]> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<RankingEventRow>(
    'SELECT * FROM ranking_events ORDER BY created_at DESC'
  );
  return rows.map(mapRow);
}

export async function createRankingEvent(input: RankingEventInput): Promise<RankingEvent> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<RankingEventRow>(
    `INSERT INTO ranking_events (
       name, start_at, end_at, visibility_mode, is_visible, include_existing_registrants,
       reward_first, reward_second, reward_third, reward_fourth_to_tenth
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      input.name,
      input.startAt,
      input.endAt,
      input.visibilityMode,
      input.isVisible,
      input.includeExistingRegistrants,
      input.rewardFirst,
      input.rewardSecond,
      input.rewardThird,
      input.rewardFourthToTenth,
    ]
  );
  return mapRow(rows[0]);
}

export type RankingEventUpdateInput = Partial<RankingEventInput> & {
  // Only 'draft' <-> 'active' is reachable here — finalizing is its own
  // function below, since it also has to write the frozen snapshot.
  status?: 'draft' | 'active';
};

// Thrown by updateRankingEvent when the request touches a reward amount,
// the aggregation window (start_at/end_at), or include_existing_registrants
// on an event that has already left 'draft' — 2nd-round review item 2.
// Changing what's being measured, or what it pays out, after fans have
// already started registering under the original terms would be an
// unannounced rule change mid-event; name/visibility/status aren't locked,
// since those are operational, not the event's actual terms.
export class CoreFieldsLockedError extends Error {
  constructor() {
    super('Reward amounts, the aggregation window, and the registrant-inclusion rule can only change while the event is still in draft.');
    this.name = 'CoreFieldsLockedError';
  }
}

const LOCKED_AFTER_DRAFT: (keyof RankingEventUpdateInput)[] = [
  'rewardFirst',
  'rewardSecond',
  'rewardThird',
  'rewardFourthToTenth',
  'startAt',
  'endAt',
  'includeExistingRegistrants',
];

// Admin-only: an event already 'finalized' can't be edited back — the whole
// point of finalizing is that it's done moving. Once an event has left
// 'draft' at all (i.e. it's 'active'), its core terms are additionally
// locked (see CoreFieldsLockedError) even though the row itself isn't
// finalized yet.
export async function updateRankingEvent(id: number, input: RankingEventUpdateInput): Promise<RankingEvent | null> {
  await ensureSchema();
  const pool = getPool();

  if (LOCKED_AFTER_DRAFT.some((key) => input[key] !== undefined)) {
    const { rows } = await pool.query<{ status: RankingEventStatus }>('SELECT status FROM ranking_events WHERE id = $1', [id]);
    if (rows[0] && rows[0].status !== 'draft') {
      throw new CoreFieldsLockedError();
    }
  }

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  const set = (col: string, val: unknown) => {
    fields.push(`${col} = $${i++}`);
    values.push(val);
  };
  if (input.name !== undefined) set('name', input.name);
  if (input.startAt !== undefined) set('start_at', input.startAt);
  if (input.endAt !== undefined) set('end_at', input.endAt);
  if (input.visibilityMode !== undefined) set('visibility_mode', input.visibilityMode);
  if (input.isVisible !== undefined) set('is_visible', input.isVisible);
  if (input.includeExistingRegistrants !== undefined) set('include_existing_registrants', input.includeExistingRegistrants);
  if (input.rewardFirst !== undefined) set('reward_first', input.rewardFirst);
  if (input.rewardSecond !== undefined) set('reward_second', input.rewardSecond);
  if (input.rewardThird !== undefined) set('reward_third', input.rewardThird);
  if (input.rewardFourthToTenth !== undefined) set('reward_fourth_to_tenth', input.rewardFourthToTenth);
  if (input.status !== undefined) set('status', input.status);

  if (fields.length === 0) {
    const { rows } = await pool.query<RankingEventRow>(
      "SELECT * FROM ranking_events WHERE id = $1 AND status != 'finalized'",
      [id]
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  fields.push('updated_at = now()');
  values.push(id);
  const { rows } = await pool.query<RankingEventRow>(
    `UPDATE ranking_events SET ${fields.join(', ')} WHERE id = $${i} AND status != 'finalized' RETURNING *`,
    values
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

// Public: the one event (if any) relevant to what the public ranking page
// should show right now — the most recently created event that's either
// live ('active') or frozen ('finalized'). A 'draft' event is still being
// configured and never surfaces here.
export async function getCurrentRankingEvent(): Promise<RankingEvent | null> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<RankingEventRow>(
    "SELECT * FROM ranking_events WHERE status IN ('active','finalized') ORDER BY id DESC LIMIT 1"
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export interface RankingStandingRow {
  artist: string;
  count: number;
}

// Shared by getRankingStandingsForEvent (live) and finalizeRankingEvent (the
// permanent snapshot) — 2nd-round review item 1 flagged that these two had
// drifted into slightly different tie-break logic, which must never happen
// again, so both now build their WHERE/ON conditions from this one place:
//   - verified email, registry-linked artist, not admin-excluded (same
//     safety bar as lib/artist-registry.ts's getVerifiedArtistCounts)
//   - include_existing_registrants = false restricts to registrations
//     created at/after start_at, so a ranking meant to measure fresh
//     sign-ups for this event isn't padded by ones from before it existed
//   - if end_at is set, a registration must have been created by then, AND
//     (review item 3) verified by end_at plus EMAIL_VERIFY_GRACE_HOURS —
//     late registrations never count, late *verifications* get a grace
//     window before they stop counting too
function buildStandingConditions(event: RankingEvent): { conditions: string[]; params: unknown[] } {
  const conditions = ['p.email_verified_at IS NOT NULL', 'p.excluded_from_ranking = false'];
  const params: unknown[] = [];
  if (!event.includeExistingRegistrants && event.startAt) {
    params.push(event.startAt);
    conditions.push(`p.created_at >= $${params.length}`);
  }
  if (event.endAt) {
    params.push(event.endAt);
    conditions.push(`p.created_at <= $${params.length}`);
    const verifyDeadline = new Date(new Date(event.endAt).getTime() + EMAIL_VERIFY_GRACE_HOURS * 3600 * 1000);
    params.push(verifyDeadline.toISOString());
    conditions.push(`p.email_verified_at <= $${params.length}`);
  }
  return { conditions, params };
}

// Deterministic tie-break (review item 1): whoever reached the current
// count first (earliest of their qualifying rows), then artist name for the
// true all-zero group — identical ORDER BY in both the live query below and
// finalizeRankingEvent's snapshot query.
const STANDING_ORDER_BY = 'ORDER BY COUNT(p.id) DESC, MAX(p.created_at) ASC NULLS LAST, a.artist_name ASC';

// The live standing for an 'active' event. LEFT JOIN (not JOIN) so an
// artist with zero qualifying registrations for this event still shows up
// (count 0) for search.
export async function getRankingStandingsForEvent(event: RankingEvent): Promise<RankingStandingRow[]> {
  await ensureSchema();
  const pool = getPool();
  const { conditions, params } = buildStandingConditions(event);
  const { rows } = await pool.query<{ artist_name: string; count: string }>(
    `SELECT a.artist_name, COUNT(p.id) AS count
     FROM artists a
     LEFT JOIN preregistrations p ON p.artist_id = a.id AND ${conditions.join(' AND ')}
     GROUP BY a.id
     ${STANDING_ORDER_BY}`,
    params
  );
  return rows.map((r) => ({ artist: r.artist_name, count: Number(r.count) }));
}

export interface RankingResultRow {
  artist: string;
  count: number;
  rank: number;
}

// Thrown by finalizeRankingEvent when the event has a set end date and
// EMAIL_VERIFY_GRACE_HOURS hasn't fully elapsed since — the review's "조기
// 확정 방지" requirement, extended for "이벤트 종료 후 이메일 인증 인정
// 범위" (review item 3): finalizing freezes the standing permanently, so it
// can't happen before every fan who registered in time has also had their
// full grace window to verify their email.
export class FinalizeTooEarlyError extends Error {
  constructor() {
    super("Cannot finalize until the event's end date plus its email-verification grace period has passed.");
    this.name = 'FinalizeTooEarlyError';
  }
}

// Admin-only, irreversible: computes the current standing one last time and
// writes it into ranking_event_results, then flips status to 'finalized'.
// Returns null if the event doesn't exist or is already finalized. Throws
// FinalizeTooEarlyError if end_at is set and end_at + EMAIL_VERIFY_GRACE_HOURS
// hasn't passed yet (an event with no end_at has no fixed close, so admin
// discretion decides).
export async function finalizeRankingEvent(id: number): Promise<RankingEvent | null> {
  await ensureSchema();
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: eventRows } = await client.query<RankingEventRow>(
      "SELECT * FROM ranking_events WHERE id = $1 AND status != 'finalized' FOR UPDATE",
      [id]
    );
    if (eventRows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    const event = mapRow(eventRows[0]);

    if (event.endAt) {
      const verifyDeadline = new Date(new Date(event.endAt).getTime() + EMAIL_VERIFY_GRACE_HOURS * 3600 * 1000);
      if (new Date() < verifyDeadline) {
        await client.query('ROLLBACK');
        throw new FinalizeTooEarlyError();
      }
    }

    // Same conditions and tie-break as the live standing (see
    // buildStandingConditions/STANDING_ORDER_BY above) — folded into the
    // JOIN's own ON clause rather than a separate WHERE, which is
    // equivalent for an INNER JOIN and keeps this query structurally
    // identical to the live one. Deliberately still an INNER (not LEFT)
    // JOIN: a permanent snapshot has no reason to freeze in a 0-count
    // artist that never actually competed.
    const { conditions, params } = buildStandingConditions(event);
    const { rows: standingRows } = await client.query<{ artist_id: number; artist_name: string; count: string }>(
      `SELECT a.id AS artist_id, a.artist_name, COUNT(p.id) AS count
       FROM artists a
       JOIN preregistrations p ON p.artist_id = a.id AND ${conditions.join(' AND ')}
       GROUP BY a.id
       ${STANDING_ORDER_BY}`,
      params
    );

    let rank = 0;
    for (const row of standingRows) {
      rank += 1;
      await client.query(
        `INSERT INTO ranking_event_results (ranking_event_id, artist_id, artist_name, rank, count)
         VALUES ($1,$2,$3,$4,$5)`,
        [id, row.artist_id, row.artist_name, rank, Number(row.count)]
      );
    }

    const { rows: updatedRows } = await client.query<RankingEventRow>(
      "UPDATE ranking_events SET status = 'finalized', finalized_at = now(), updated_at = now() WHERE id = $1 RETURNING *",
      [id]
    );
    await client.query('COMMIT');
    return mapRow(updatedRows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Public: the frozen snapshot for a finalized event, in rank order.
export async function getFinalizedResults(eventId: number): Promise<RankingResultRow[]> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<{ artist_name: string; rank: number; count: number }>(
    'SELECT artist_name, rank, count FROM ranking_event_results WHERE ranking_event_id = $1 ORDER BY rank ASC',
    [eventId]
  );
  return rows.map((r) => ({ artist: r.artist_name, rank: r.rank, count: r.count }));
}
