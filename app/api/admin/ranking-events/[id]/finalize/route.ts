import { NextResponse } from 'next/server';
import { finalizeRankingEvent } from '@/lib/ranking-events';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

// Admin-only, irreversible: freezes the event's current standing into
// ranking_event_results and flips it to 'finalized'. See
// lib/ranking-events.ts's finalizeRankingEvent for exactly what gets
// snapshotted.
export async function POST(request: Request, { params }: { params: { id: string } }) {
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

  try {
    const event = await finalizeRankingEvent(id);
    if (!event) {
      return NextResponse.json({ error: 'not_found_or_already_finalized' }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (err) {
    console.error('admin ranking-event finalize failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
