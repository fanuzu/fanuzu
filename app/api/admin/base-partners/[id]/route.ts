import { NextResponse } from 'next/server';
import { setBasePartnerActive } from '@/lib/base-partners';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

// Only toggles is_active today — see lib/base-partners.ts's note on why a
// base partner is never deleted (a deactivated code must keep resolving to
// "normal registration, no error" forever, and its historical counts must
// stay intact).
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

  if (typeof body.isActive !== 'boolean') {
    return NextResponse.json({ error: 'invalid_is_active' }, { status: 400 });
  }

  try {
    const partner = await setBasePartnerActive(id, body.isActive);
    if (!partner) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ partner });
  } catch (err) {
    console.error('admin base-partner update failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
