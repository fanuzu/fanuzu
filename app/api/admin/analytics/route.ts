import { NextResponse } from 'next/server';
import { getUtmBreakdown, getReferralStats, getCountryBreakdown, getSuspiciousRegistrations } from '@/lib/tracking';
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
    const [utm, referrals, countries, suspicious] = await Promise.all([
      getUtmBreakdown(),
      getReferralStats(),
      getCountryBreakdown(),
      getSuspiciousRegistrations(),
    ]);
    return NextResponse.json({ utm, referrals, countries, suspicious });
  } catch (err) {
    console.error('admin analytics query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
