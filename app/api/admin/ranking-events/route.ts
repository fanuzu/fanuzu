import { NextResponse } from 'next/server';
import { createRankingEvent, listRankingEvents, type VisibilityMode } from '@/lib/ranking-events';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const events = await listRankingEvents();
    return NextResponse.json({ events });
  } catch (err) {
    console.error('admin ranking-events query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

function parseDateOrNull(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function parseRewardInt(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

export async function POST(request: Request) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'malformed_body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) {
    return NextResponse.json({ error: 'name_required' }, { status: 400 });
  }
  const visibilityMode: VisibilityMode = body.visibilityMode === 'auto' ? 'auto' : 'manual';

  try {
    const event = await createRankingEvent({
      name,
      startAt: parseDateOrNull(body.startAt),
      endAt: parseDateOrNull(body.endAt),
      visibilityMode,
      isVisible: false,
      includeExistingRegistrants: body.includeExistingRegistrants !== false,
      rewardFirst: parseRewardInt(body.rewardFirst),
      rewardSecond: parseRewardInt(body.rewardSecond),
      rewardThird: parseRewardInt(body.rewardThird),
      rewardFourthToTenth: parseRewardInt(body.rewardFourthToTenth),
    });
    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error('admin ranking-event create failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
