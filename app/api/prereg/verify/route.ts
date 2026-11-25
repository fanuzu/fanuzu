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
  let verified = false;
  if (token) {
    try {
      verified = await verifyPreregEmail(token);
    } catch (err) {
      console.error('verifyPreregEmail failed:', err);
    }
  }
  return NextResponse.redirect(`${SITE_URL}/?emailVerified=${verified ? '1' : '0'}`);
}
