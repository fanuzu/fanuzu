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
// rather than exciting, so the ranked LIST stays hidden until total
// participation clears this bar — env-overridable so it can be tuned
// without a code change. Per the ranking-event review's item 1, this only
// ever gates the numbers/list, never the event's own intro/rewards/period/
// CTA (see rankingVisible below) — and it never applies to a finalized
// event, since publishing a frozen result is already an explicit admin
// action.
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

// Three states the public UI distinguishes (review item 4): 'active' is a
// normal in-progress countdown; 'ended_pending' is "end_at has passed but
// an admin hasn't finalized yet" — standings are still live/last-known, not
// yet the official frozen result; 'finalized' is the permanent snapshot.
export type RankingEventState = 'active' | 'ended_pending' | 'finalized';

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
    // existed). No event metadata to introduce in this case, so there's
    // nothing to show at all until the participant bar clears.
    if (!event) {
      const counts = await getVerifiedArtistCounts();
      if (totalCount(counts) < MIN_PARTICIPANTS_FOR_RANKING) {
        return NextResponse.json({ enabled: false });
      }
      const ranking = counts.slice(0, TOP_N).map((c) => ({ artist: c.artist, count: c.count }));
      return NextResponse.json({ enabled: true, rankingVisible: true, ranking });
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
    // happens to the underlying registrations afterward. Never gated by
    // the participant minimum — finalizing is already an explicit, final
    // admin decision to publish.
    if (event.status === 'finalized') {
      const results = await getFinalizedResults(event.id);
      const ranking = results.slice(0, TOP_N).map((r) => ({ artist: r.artist, count: r.count }));
      return NextResponse.json({
        enabled: true,
        event: eventMeta,
        eventState: 'finalized' as RankingEventState,
        finalized: true,
        rankingVisible: true,
        ranking,
      });
    }

    // Active: respect this event's own visibility setting before showing
    // anything — 'manual' means the admin decides, 'auto' means it goes
    // live automatically at start_at. This is a separate, coarser switch
    // from the participant minimum below: if the admin hasn't turned the
    // event on at all, nothing about it — not even the intro — is shown.
    const visible =
      event.visibilityMode === 'manual'
        ? event.isVisible
        : !event.startAt || new Date() >= new Date(event.startAt);
    if (!visible) {
      return NextResponse.json({ enabled: false });
    }

    const eventState: RankingEventState =
      event.endAt && new Date() >= new Date(event.endAt) ? 'ended_pending' : 'active';

    const counts = await getRankingStandingsForEvent(event);
    const rankingVisible = totalCount(counts) >= MIN_PARTICIPANTS_FOR_RANKING;

    // Event intro/rewards/period/CTA are always returned once the event is
    // visible — only the actual ranked list is withheld (not even sent to
    // the client) until participation clears the bar, so a sparse count is
    // never leaked even indirectly.
    if (!rankingVisible) {
      return NextResponse.json({ enabled: true, event: eventMeta, eventState, rankingVisible: false });
    }

    const ranking = counts.slice(0, TOP_N).map((c) => ({ artist: c.artist, count: c.count }));
    return NextResponse.json({ enabled: true, event: eventMeta, eventState, rankingVisible: true, ranking });
  } catch (err) {
    console.error('artist ranking query failed:', err);
    return NextResponse.json({ enabled: false });
  }
}
