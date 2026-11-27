import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { pingIndexNow, allIndexableUrls } from '@/lib/indexnow';

export const runtime = 'nodejs';

// Manual trigger (admin panel button) for "IndexNow 활성화": this sandbox
// can't reach api.indexnow.org to test a live submission (outbound
// network here is allowlisted and that domain isn't on it), so this is
// verified by code review + a dry run against the real production
// deploy, not a request made from this environment. The auto-hooks in
// lib/ranking-events.ts (finalizeRankingEvent) and the artist admin route
// call this same pingIndexNow helper when real content changes — this
// endpoint exists for everything else (a manual nudge, or re-submitting
// after an unrelated content edit).
export async function POST(request: Request) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const urls: string[] = Array.isArray(body?.urls) && body.urls.length > 0 ? body.urls : allIndexableUrls();
    const result = await pingIndexNow(urls);
    return NextResponse.json({ submitted: urls.length, ...result });
  } catch (err) {
    console.error('IndexNow submission failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
