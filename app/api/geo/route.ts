import { NextResponse } from 'next/server';
import { clientCountry } from '@/lib/request-ip';

export const runtime = 'nodejs';
// Must stay dynamic — the country comes from this specific request's geo
// header, not something that can be baked in at build time.
export const dynamic = 'force-dynamic';

// Tiny, public, no PII: just the ISO 3166-1 alpha-2 country Vercel
// geolocated this request to (or null off-Vercel). Powers the
// browser-language-didn't-match language fallback in LangProvider.
export async function GET(request: Request) {
  return NextResponse.json({ country: clientCountry(request) });
}
