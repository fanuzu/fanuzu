import { NextResponse } from 'next/server';
import { getFandomProgress } from '@/lib/artist-registry';

export const runtime = 'nodejs';
// Same reasoning as /api/prereg/ranking: a route with no request-specific
// reads gets statically baked at build time by default, freezing both the
// flag check and the live count forever.
export const dynamic = 'force-dynamic';

// Public, flagged off by default — see ArtistRanking.tsx's note on why an
// early/sparse count reads worse than no count at all. The team sets a
// fandom's goal (and so puts it in this response) only once showing
// progress for it is worth doing.
export async function GET() {
  if (process.env.SHOW_FANDOM_PROGRESS !== 'true') {
    return NextResponse.json({ enabled: false });
  }

  try {
    const fandoms = await getFandomProgress();
    return NextResponse.json({ enabled: true, fandoms });
  } catch (err) {
    console.error('fandom progress query failed:', err);
    return NextResponse.json({ enabled: false });
  }
}
