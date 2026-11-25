import { NextResponse } from 'next/server';
import { updateRankingEvent, CoreFieldsLockedError, type RankingEventUpdateInput, type VisibilityMode } from '@/lib/ranking-events';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

function parseDateOrNull(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || (typeof value === 'string' && !value.trim())) return null;
  if (typeof value !== 'string') return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function parseRewardInt(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

// Edits a draft/active event in place (name, dates, visibility, eligibility,
// rewards, and the draft<->active status toggle). Finalizing is a separate
// action (see ./finalize/route.ts) since it also writes a frozen snapshot —
// this route can never set status to 'finalized'.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'malformed_body' }, { status: 400 });
  }

  const input: RankingEventUpdateInput = {};
  if (typeof body.name === 'string' && body.name.trim()) input.name = body.name.trim();
  if ('startAt' in body) input.startAt = parseDateOrNull(body.startAt);
  if ('endAt' in body) input.endAt = parseDateOrNull(body.endAt);
  if (body.visibilityMode === 'manual' || body.visibilityMode === 'auto') {
    input.visibilityMode = body.visibilityMode as VisibilityMode;
  }
  if (typeof body.isVisible === 'boolean') input.isVisible = body.isVisible;
  if (typeof body.includeExistingRegistrants === 'boolean') input.includeExistingRegistrants = body.includeExistingRegistrants;
  const rewardFirst = parseRewardInt(body.rewardFirst);
  if (rewardFirst !== undefined) input.rewardFirst = rewardFirst;
  const rewardSecond = parseRewardInt(body.rewardSecond);
  if (rewardSecond !== undefined) input.rewardSecond = rewardSecond;
  const rewardThird = parseRewardInt(body.rewardThird);
  if (rewardThird !== undefined) input.rewardThird = rewardThird;
  const rewardFourthToTenth = parseRewardInt(body.rewardFourthToTenth);
  if (rewardFourthToTenth !== undefined) input.rewardFourthToTenth = rewardFourthToTenth;
  if (body.status === 'draft' || body.status === 'active') input.status = body.status;

  try {
    const event = await updateRankingEvent(id, input);
    if (!event) {
      return NextResponse.json({ error: 'not_found_or_finalized' }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (err) {
    if (err instanceof CoreFieldsLockedError) {
      return NextResponse.json({ error: 'core_fields_locked' }, { status: 400 });
    }
    console.error('admin ranking-event update failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
