import { NextResponse } from 'next/server';
import { getArtistCounts } from '@/lib/prereg';

export const runtime = 'nodejs';
// No request-specific data is read here, so Next.js would otherwise treat
// this as a static route and bake the response (including the env var
// check and the DB query result) in at build time — making the "flip the
// flag later" design pointless and freezing the ranking at whatever it was
// during the build.
export const dynamic = 'force-dynamic';

const TOP_N = 3;

// Deliberately gated behind an env var (default off) rather than always
// shown — see ArtistSelect.tsx's note on founder counts: an early, sparse
// leaderboard reads as "nobody's here yet" rather than exciting. The team
// flips SHOW_ARTIST_RANKING=true once the numbers are worth showing off,
// no code change needed.
export async function GET() {
  if (process.env.SHOW_ARTIST_RANKING !== 'true') {
    return NextResponse.json({ enabled: false });
  }

  try {
    const counts = await getArtistCounts();
    const ranking = counts.slice(0, TOP_N).map((c) => ({ artist: c.artist, count: c.count }));
    return NextResponse.json({ enabled: true, ranking });
  } catch (err) {
    console.error('artist ranking query failed:', err);
    return NextResponse.json({ enabled: false });
  }
}
