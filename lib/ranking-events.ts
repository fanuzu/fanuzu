// Server-only: admin-configured fandom ranking events (see lib/db.ts's
// ranking_events / ranking_event_results tables). Never import from a client
// component.
import { ensureSchema, getPool } from './db';

export type RankingEventStatus = 'draft' | 'active' | 'finalized';
export type VisibilityMode = 'manual' | 'auto';

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

// Admin-only: an event already 'finalized' can't be edited back — the whole
// point of finalizing is that it's done moving.
export async function updateRankingEvent(id: number, input: RankingEventUpdateInput): Promise<RankingEvent | null> {
  await ensureSchema();
  const pool = getPool();

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

// The live standing for an 'active' event — same safety bar as
// lib/artist-registry.ts's getVerifiedArtistCounts (verified email,
// registry-linked artist, not admin-excluded), plus this event's own
// date-window rule: include_existing_registrants = false restricts it to
// registrations created at/after start_at (and at/before end_at, if set),
// so a ranking that's meant to measure fresh sign-ups for this event isn't
// padded by registrations from long before it existed.
//
// LEFT JOIN (not JOIN), same as getVerifiedArtistCounts, so an artist with
// zero qualifying registrations for this event still shows up (count 0)
// for search — and the same deterministic tie-break (earliest to reach the
// current count, then artist name) applies here too.
export async function getRankingStandingsForEvent(event: RankingEvent): Promise<RankingStandingRow[]> {
  await ensureSchema();
  const pool = getPool();
  const conditions = ['p.email_verified_at IS NOT NULL', 'p.excluded_from_ranking = false'];
  const params: unknown[] = [];
  if (!event.includeExistingRegistrants && event.startAt) {
    params.push(event.startAt);
    conditions.push(`p.created_at >= $${params.length}`);
  }
  if (event.endAt) {
    params.push(event.endAt);
    conditions.push(`p.created_at <= $${params.length}`);
  }
  const { rows } = await pool.query<{ artist_name: string; count: string }>(
    `SELECT a.artist_name, COUNT(p.id) AS count
     FROM artists a
     LEFT JOIN preregistrations p ON p.artist_id = a.id AND ${conditions.join(' AND ')}
     GROUP BY a.id
     ORDER BY COUNT(p.id) DESC, MAX(p.created_at) ASC NULLS LAST, a.artist_name ASC`,
    params
  );
  return rows.map((r) => ({ artist: r.artist_name, count: Number(r.count) }));
}

export interface RankingResultRow {
  artist: string;
  count: number;
  rank: number;
}

// Thrown by finalizeRankingEvent when the event has a set end date that
// hasn't passed yet — the review's "조기 확정 방지" requirement: finalizing
// early would freeze a standing before every fan who's going to register
// has had the chance to.
export class FinalizeTooEarlyError extends Error {
  constructor() {
    super("Cannot finalize before the event's end date.");
    this.name = 'FinalizeTooEarlyError';
  }
}

// Admin-only, irreversible: computes the current standing one last time and
// writes it into ranking_event_results, then flips status to 'finalized'.
// Returns null if the event doesn't exist or is already finalized. Throws
// FinalizeTooEarlyError if end_at is set and hasn't passed yet (an event
// with no end_at has no fixed close, so admin discretion decides).
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

    if (event.endAt && new Date() < new Date(event.endAt)) {
      await client.query('ROLLBACK');
      throw new FinalizeTooEarlyError();
    }

    const conditions = ['p.email_verified_at IS NOT NULL', 'p.excluded_from_ranking = false'];
    const params: unknown[] = [];
    if (!event.includeExistingRegistrants && event.startAt) {
      params.push(event.startAt);
      conditions.push(`p.created_at >= $${params.length}`);
    }
    if (event.endAt) {
      params.push(event.endAt);
      conditions.push(`p.created_at <= $${params.length}`);
    }
    const { rows: standingRows } = await client.query<{ artist_id: number; artist_name: string; count: string }>(
      `SELECT a.id AS artist_id, a.artist_name, COUNT(p.id) AS count
       FROM artists a
       JOIN preregistrations p ON p.artist_id = a.id
       WHERE ${conditions.join(' AND ')}
       GROUP BY a.id
       ORDER BY COUNT(p.id) DESC`,
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
