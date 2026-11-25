import { NextResponse } from 'next/server';
import { deleteRegistration, setExcludedFromRanking } from '@/lib/prereg';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

// Only toggles excluded_from_ranking today — a lighter touch than DELETE
// for a fraudulent/test row an admin wants out of ranking-event counts
// without losing the registration itself (see lib/prereg.ts).
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

  if (typeof body.excludedFromRanking !== 'boolean') {
    return NextResponse.json({ error: 'invalid_excluded_from_ranking' }, { status: 400 });
  }

  try {
    const updated = await setExcludedFromRanking(id, body.excludedFromRanking);
    if (!updated) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('admin registration exclude-toggle failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

// Admin-only, irreversible: removes one pre-registration and its referral
// relationships/ledger entries. See lib/prereg.ts's deleteRegistration for
// exactly what gets cleaned up alongside the row itself.
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
    const deleted = await deleteRegistration(id);
    if (!deleted) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('admin registration delete failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
