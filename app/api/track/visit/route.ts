import { NextResponse } from 'next/server';
import { recordLinkVisit, type LinkVisitInput } from '@/lib/tracking';
import { clientIp } from '@/lib/request-ip';

export const runtime = 'nodejs';

// Public, fire-and-forget: called once per browser session by
// AttributionTracker.tsx on landing. No PII beyond IP/user-agent (already
// logged the same way for /api/prereg's rate limiting) — no email, no
// identity. Deliberately not rate-limited like /api/prereg; worst case a
// flood just grows an analytics table, it can't forge registrations or
// rewards.
export async function POST(request: Request) {
  let body: LinkVisitInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    await recordLinkVisit(body, clientIp(request), request.headers.get('user-agent') || '');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('recordLinkVisit failed:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
