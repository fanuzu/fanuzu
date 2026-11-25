import { NextResponse } from 'next/server';
import { getRankingEventAuditLog } from '@/lib/ranking-events';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

// GENESIS review section 4: the permanent history of any post-draft
// override of an event's locked core terms (see updateRankingEvent's
// overrideReason) — read-only, nothing here is ever edited.
export async function GET(request: Request, { params }: { params: { id: string } }) {
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
    const entries = await getRankingEventAuditLog(id);
    return NextResponse.json({ entries });
  } catch (err) {
    console.error('admin ranking-event audit-log query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
