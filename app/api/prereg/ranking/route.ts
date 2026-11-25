import { NextResponse } from 'next/server';
import { getVerifiedArtistCounts } from '@/lib/artist-registry';
import { getCurrentRankingEvent, getFinalizedResults, getRankingStandingsForEvent } from '@/lib/ranking-events';

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
    const event = await getCurrentRankingEvent();

    // No admin-configured event yet — fall back to the plain always-on
    // verified/linked aggregate (unchanged from before the admin panel
    // existed).
    if (!event) {
      const counts = await getVerifiedArtistCounts();
      const ranking = counts.slice(0, TOP_N).map((c) => ({ artist: c.artist, count: c.count }));
      return NextResponse.json({ enabled: true, ranking });
    }

    // Finalized: serve the frozen snapshot forever, regardless of what
    // happens to the underlying registrations afterward.
    if (event.status === 'finalized') {
      const results = await getFinalizedResults(event.id);
      const ranking = results.slice(0, TOP_N).map((r) => ({ artist: r.artist, count: r.count }));
      return NextResponse.json({ enabled: true, ranking, finalized: true });
    }

    // Active: respect this event's own visibility setting before showing
    // anything — 'manual' means the admin decides, 'auto' means it goes
    // live automatically at start_at.
    const visible =
      event.visibilityMode === 'manual'
        ? event.isVisible
        : !event.startAt || new Date() >= new Date(event.startAt);
    if (!visible) {
      return NextResponse.json({ enabled: false });
    }

    const counts = await getRankingStandingsForEvent(event);
    const ranking = counts.slice(0, TOP_N).map((c) => ({ artist: c.artist, count: c.count }));
    return NextResponse.json({ enabled: true, ranking });
  } catch (err) {
    console.error('artist ranking query failed:', err);
    return NextResponse.json({ enabled: false });
  }
}
