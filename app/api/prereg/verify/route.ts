import { NextResponse } from 'next/server';
import { verifyPreregEmail } from '@/lib/prereg';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanuzu.co.kr';

// Landed on from the verify link in the pre-registration confirmation email
// (see lib/prereg.ts's verifyUrl / lib/email.ts's verify CTA). Flips
// email_verified_at and redirects home rather than rendering its own page —
// this route only needs to exist for the one click, not to be a destination
// anyone lingers on.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  let result = { verified: false, firstVerify: false, marketingConsent: false };
  if (token) {
    try {
      result = await verifyPreregEmail(token);
    } catch (err) {
      console.error('verifyPreregEmail failed:', err);
    }
  }

  const params = new URLSearchParams({ emailVerified: result.verified ? '1' : '0' });
  // Ad-performance tracking (review item 3): a conversion event fires only
  // for this specific fan's FIRST verification (never a re-click — see
  // verifyPreregEmail's firstVerify) and only when they opted into
  // marketing_consent at registration — see AdConversionTracker.tsx, which
  // reads this param once and strips it immediately so even reloading this
  // same URL can't fire it twice.
  if (result.verified && result.firstVerify && result.marketingConsent) {
    params.set('adConv', '1');
  }
  return NextResponse.redirect(`${SITE_URL}/?${params.toString()}`);
}
