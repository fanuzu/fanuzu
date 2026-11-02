import { NextResponse } from 'next/server';
import { getDailyRegistrationTrend } from '@/lib/tracking';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

// Fetched on demand (one fandom or one base code at a time) rather than
// folded into /api/admin/analytics's always-loaded payload, same reasoning
// as the referral-program search endpoint: a daily breakdown per
// fandom/code is easily the heaviest query here and most admin visits never
// need it.
export async function GET(request: Request) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const fandom = url.searchParams.get('fandom') || undefined;
  const basePartnerIdParam = url.searchParams.get('basePartnerId');
  const basePartnerId = basePartnerIdParam ? Number(basePartnerIdParam) : undefined;
  if (basePartnerIdParam && (!Number.isInteger(basePartnerId) || (basePartnerId as number) <= 0)) {
    return NextResponse.json({ error: 'invalid_base_partner_id' }, { status: 400 });
  }
  if (!fandom && !basePartnerId) {
    return NextResponse.json({ error: 'fandom_or_base_partner_id_required' }, { status: 400 });
  }

  try {
    const trend = await getDailyRegistrationTrend({ fandom, basePartnerId });
    return NextResponse.json({ trend });
  } catch (err) {
    console.error('admin base-partner trend query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
