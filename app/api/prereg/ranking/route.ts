import { NextResponse } from 'next/server';
import { getVerifiedArtistCounts } from '@/lib/artist-registry';
import {
  getCurrentRankingEvent,
  getFinalizedResults,
  getRankingStandingsForEvent,
  EMAIL_VERIFY_GRACE_HOURS,
} from '@/lib/ranking-events';

export const runtime = 'nodejs';
// No request-specific data is read here, so Next.js would otherwise treat
// this as a static route and bake the response (including the env var
// check and the DB query result) in at build time — making the "flip the
// flag later" design pointless and freezing the ranking at whatever it was
// during the build.
export const dynamic = 'force-dynamic';

// `Number(x) || fallback` would silently treat a deliberately-set "0" the
// same as "unset" — matters here too, since an event with no participation
// floor at all (RANKING_MIN_PARTICIPANTS=0) must not quietly become 100.
function envNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

// A leaderboard with a handful of names on it reads as "nobody's here yet"
// rather than exciting, so the ranked LIST stays hidden until total
// participation clears this bar — env-overridable so it can be tuned
// without a code change. Per the ranking-event review's item 1, this only
// ever gates the numbers/list, never the event's own intro/rewards/period/
// CTA (see rankingVisible below) — and it never applies to a finalized
// event, since publishing a frozen result is already an explicit admin
// action.
const MIN_PARTICIPANTS_FOR_RANKING = envNumber('RANKING_MIN_PARTICIPANTS', 100);

function totalCount(rows: { count: number }[]): number {
  return rows.reduce((sum, r) => sum + r.count, 0);
}

export interface PublicRankingEvent {
  name: string;
  startAt: string | null;
  endAt: string | null;
  rewardFirst: number;
  rewardSecond: number;
  rewardThird: number;
  rewardFourthToTenth: number;
  // Surfaced so the public terms disclosure (RankingSection.tsx) always
  // states the actual configured grace window rather than a hardcoded
  // guess that could drift from RANKING_EMAIL_VERIFY_GRACE_HOURS.
  emailVerifyGraceHours: number;
}

// Four states the public UI distinguishes: 'upcoming' is "admin has
// announced it but start_at hasn't arrived yet" (GENESIS review section
// 5.1's pre-promo window) — a start countdown instead of an end countdown,
// and the ranking is never computed at all (nothing has started); 'active'
// is a normal in-progress countdown; 'ended_pending' is "end_at has passed
// but an admin hasn't finalized yet" — standings are still live/last-known,
// not yet the official frozen result; 'finalized' is the permanent snapshot.
export type RankingEventState = 'upcoming' | 'active' | 'ended_pending' | 'finalized';

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
      // The full registry, not just a top slice (2nd-round review item 4) —
      // the artist registry is admin-curated and small by construction, so
      // sending all of it costs nothing, and it's what lets the client's
      // search find an artist ranked below whatever its own "top 10" cut
      // shows by default (see RankingSection.tsx).
      const ranking = counts.map((c) => ({ artist: c.artist, count: c.count }));
      return NextResponse.json({ enabled: true, rankingVisible: true, ranking });
    }

    const eventMeta: PublicRankingEvent = {
      name: event.name,
      startAt: event.startAt,
      endAt: event.endAt,
      rewardFirst: event.rewardFirst,
      rewardSecond: event.rewardSecond,
      rewardThird: event.rewardThird,
      rewardFourthToTenth: event.rewardFourthToTenth,
      emailVerifyGraceHours: EMAIL_VERIFY_GRACE_HOURS,
    };

    // Finalized: serve the frozen snapshot forever, regardless of what
    // happens to the underlying registrations afterward. Never gated by
    // the participant minimum — finalizing is already an explicit, final
    // admin decision to publish.
    if (event.status === 'finalized') {
      const results = await getFinalizedResults(event.id);
      const ranking = results.map((r) => ({ artist: r.artist, count: r.count }));
      return NextResponse.json({
        enabled: true,
        event: eventMeta,
        eventState: 'finalized' as RankingEventState,
        finalized: true,
        rankingVisible: true,
        ranking,
      });
    }

    // Respect this event's own visibility setting before showing anything —
    // 'manual' means the admin decides (and can turn it on well before
    // start_at, for a pre-promo window — GENESIS review section 5.1), 'auto'
    // means it goes live automatically at start_at (so 'auto' mode never
    // surfaces the 'upcoming' state below; it simply isn't visible at all
    // until it's already started). This is a separate, coarser switch from
    // the participant minimum further down: if the admin hasn't turned the
    // event on at all, nothing about it — not even the intro — is shown.
    const visible =
      event.visibilityMode === 'manual'
        ? event.isVisible
        : !event.startAt || new Date() >= new Date(event.startAt);
    if (!visible) {
      return NextResponse.json({ enabled: false });
    }

    const now = new Date();
    const eventState: RankingEventState =
      event.startAt && now < new Date(event.startAt)
        ? 'upcoming'
        : event.endAt && now >= new Date(event.endAt)
        ? 'ended_pending'
        : 'active';

    // Upcoming: start_at hasn't arrived, so there is nothing to count yet —
    // skip the standings query entirely rather than compute a ranking that
    // (with include_existing_registrants off, as GENESIS-style events use)
    // would just be an empty/zero board anyway. The pre-promo screen is
    // intro + rewards + a start countdown, never a ranking.
    if (eventState === 'upcoming') {
      return NextResponse.json({ enabled: true, event: eventMeta, eventState, rankingVisible: false });
    }

    const counts = await getRankingStandingsForEvent(event);
    const totalSoFar = totalCount(counts);
    const rankingVisible = totalSoFar >= MIN_PARTICIPANTS_FOR_RANKING;

    // Event intro/rewards/period/CTA are always returned once the event is
    // visible — only the actual ranked list is withheld (not even sent to
    // the client) until participation clears the bar, so a sparse count is
    // never leaked even indirectly. `unlockProgressPct` alone doesn't leak
    // it either — without the threshold itself (never sent to the client),
    // "40%" could mean 40 of 100 or 4 of 10, so the real scale stays hidden
    // while still giving the locked state something to visualize.
    if (!rankingVisible) {
      const unlockProgressPct =
        MIN_PARTICIPANTS_FOR_RANKING > 0 ? Math.min(100, Math.round((totalSoFar / MIN_PARTICIPANTS_FOR_RANKING) * 100)) : 100;
      return NextResponse.json({ enabled: true, event: eventMeta, eventState, rankingVisible: false, unlockProgressPct });
    }

    const ranking = counts.map((c) => ({ artist: c.artist, count: c.count }));
    return NextResponse.json({ enabled: true, event: eventMeta, eventState, rankingVisible: true, ranking });
  } catch (err) {
    console.error('artist ranking query failed:', err);
    return NextResponse.json({ enabled: false });
  }
}
