import { NextResponse } from 'next/server';
import { getReferralProgramSummary, getReferrerLeaderboard, searchReferrals, type ReferralSearchFilters } from '@/lib/tracking';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

// Referral program spec section 14: admin visibility into actual referral
// relationships (referrer -> referred -> reward status), distinct from the
// UTM/link-click traffic view in /api/admin/analytics. Search params mirror
// section 14's filter list: email/code substring, referral yes/no, date range.
export async function GET(request: Request) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const hasReferralParam = url.searchParams.get('hasReferral');
  const filters: ReferralSearchFilters = {
    q: url.searchParams.get('q') || undefined,
    hasReferral: hasReferralParam === 'yes' || hasReferralParam === 'no' ? hasReferralParam : undefined,
    from: url.searchParams.get('from') || undefined,
    to: url.searchParams.get('to') || undefined,
  };

  try {
    const [summary, leaderboard, rows] = await Promise.all([
      getReferralProgramSummary(),
      getReferrerLeaderboard(),
      searchReferrals(filters),
    ]);
    return NextResponse.json({ summary, leaderboard, rows });
  } catch (err) {
    console.error('admin referral-program query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
