import { NextResponse } from 'next/server';
import { createBasePartner, listBasePartnersWithCounts } from '@/lib/base-partners';
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
    const partners = await listBasePartnersWithCounts();
    return NextResponse.json({ partners });
  } catch (err) {
    console.error('admin base-partners query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
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
  const fandom = typeof body.fandom === 'string' ? body.fandom.trim() : '';
  const xHandle = typeof body.xHandle === 'string' ? body.xHandle.trim() || null : null;
  const targetCount =
    body.targetCount === null || body.targetCount === undefined || body.targetCount === ''
      ? null
      : Number(body.targetCount);

  if (!name || !fandom) {
    return NextResponse.json({ error: 'name_and_fandom_required' }, { status: 400 });
  }
  if (targetCount !== null && (!Number.isInteger(targetCount) || targetCount < 0)) {
    return NextResponse.json({ error: 'invalid_target_count' }, { status: 400 });
  }

  try {
    const partner = await createBasePartner({ name, xHandle, fandom, targetCount });
    return NextResponse.json({ partner }, { status: 201 });
  } catch (err) {
    console.error('admin base-partner create failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
