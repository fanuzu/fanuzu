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

// High enough to cover "TOP 100 + search your own fandom" entirely from one
// response — the public ranking section does its own top-10 cut and
// client-side search across whatever comes back, rather than needing a
// second endpoint.
const TOP_N = 100;

// A leaderboard with a handful of names on it reads as "nobody's here yet"
// rather than exciting, so the board stays hidden (even with
// SHOW_ARTIST_RANKING=true) until total participation clears this bar —
// env-overridable so it can be tuned without a code change. Only applied to
// the live/in-progress views below; a finalized event is an explicit admin
// action to reveal final results and is never hidden by this.
const MIN_PARTICIPANTS_FOR_RANKING = Number(process.env.RANKING_MIN_PARTICIPANTS) || 100;

function totalCount(rows: { count: number }[]): number {
  return rows.reduce((sum, r) => sum + r.count, 0);
}

export interface PublicRankingEvent {
  name: string;
  endAt: string | null;
  rewardFirst: number;
  rewardSecond: number;
  rewardThird: number;
  rewardFourthToTenth: number;
}

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
    // existed). No event metadata to show in this case.
    if (!event) {
      const counts = await getVerifiedArtistCounts();
      if (totalCount(counts) < MIN_PARTICIPANTS_FOR_RANKING) {
        return NextResponse.json({ enabled: false });
      }
      const ranking = counts.slice(0, TOP_N).map((c) => ({ artist: c.artist, count: c.count }));
      return NextResponse.json({ enabled: true, ranking });
    }

    const eventMeta: PublicRankingEvent = {
      name: event.name,
      endAt: event.endAt,
      rewardFirst: event.rewardFirst,
      rewardSecond: event.rewardSecond,
      rewardThird: event.rewardThird,
      rewardFourthToTenth: event.rewardFourthToTenth,
    };

    // Finalized: serve the frozen snapshot forever, regardless of what
    // happens to the underlying registrations afterward.
    if (event.status === 'finalized') {
      const results = await getFinalizedResults(event.id);
      const ranking = results.slice(0, TOP_N).map((r) => ({ artist: r.artist, count: r.count }));
      return NextResponse.json({ enabled: true, ranking, finalized: true, event: eventMeta });
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
    if (totalCount(counts) < MIN_PARTICIPANTS_FOR_RANKING) {
      return NextResponse.json({ enabled: false });
    }
    const ranking = counts.slice(0, TOP_N).map((c) => ({ artist: c.artist, count: c.count }));
    return NextResponse.json({ enabled: true, ranking, event: eventMeta });
  } catch (err) {
    console.error('artist ranking query failed:', err);
    return NextResponse.json({ enabled: false });
  }
}
