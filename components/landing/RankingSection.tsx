'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/components/providers/LangProvider';
import { usePreregModal } from '@/components/providers/PreregModalProvider';

interface RankingRow {
  artist: string;
  count: number;
}

interface RankingEventMeta {
  name: string;
  startAt: string | null;
  endAt: string | null;
  rewardFirst: number;
  rewardSecond: number;
  rewardThird: number;
  rewardFourthToTenth: number;
  emailVerifyGraceHours: number;
}

type RankingEventState = 'upcoming' | 'active' | 'ended_pending' | 'finalized';

interface RankingApiResponse {
  enabled: boolean;
  event?: RankingEventMeta;
  eventState?: RankingEventState;
  rankingVisible?: boolean;
  ranking?: RankingRow[];
  finalized?: boolean;
  // 0-100, sent only while rankingVisible is false. Deliberately not the
  // raw participant count or the configured threshold — neither is ever
  // sent to the client — so this can be shown honestly without revealing
  // how small the real numbers are this early.
  unlockProgressPct?: number;
}

// Generic fake rows for the blurred locked-list preview — same row shape
// as the real list (rank/name-bar/count-bar) so a visitor immediately
// recognizes "that's a leaderboard" even though nothing real is shown.
const PLACEHOLDER_ROWS = [0, 1, 2, 3, 4];

// Matches the "5-10 minute refresh" cadence from the ranking-event review —
// frequent enough that the board feels alive, far enough apart that it's
// not hammering the DB on every visitor's tab.
const REFRESH_MS = 5 * 60 * 1000;
const TOP_SHOWN = 10;
const RANK_ACCENTS = ['#FFD24A', '#C9D2E0', '#E5995A'];

function krw(n: number): string {
  return `₩${n.toLocaleString()}`;
}

interface CountdownParts {
  d: number;
  h: number;
  m: number;
  s: number;
}

function msToParts(diffMs: number): CountdownParts {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  return {
    d: Math.floor(totalSeconds / 86400),
    h: Math.floor((totalSeconds % 86400) / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  };
}

// Site-wide, not per-event — the official FANUZU app launch date, shown
// alongside the ranking event's own dates so a fan knows when the app
// itself (not just this event) is coming (GENESIS review section 5.1/5.3).
// A plain env var rather than a ranking_events column, since it's true
// regardless of which ranking event is currently configured.
const APP_LAUNCH_DATE = process.env.NEXT_PUBLIC_APP_LAUNCH_DATE || '';

const INTL_LOCALE: Record<string, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  es: 'es-ES',
  zhHans: 'zh-CN',
  zhHant: 'zh-TW',
  id: 'id-ID',
  fil: 'fil-PH',
  th: 'th-TH',
};

export default function RankingSection() {
  const { tr, lang } = useLang();
  const { openModal } = usePreregModal();
  const [data, setData] = useState<RankingApiResponse | null>(null);
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/prereg/ranking');
        const body: RankingApiResponse = await res.json();
        if (!cancelled) setData(body);
      } catch {
        // Leave whatever was last loaded in place rather than clearing it
        // on a transient network blip.
      }
    }
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // A separate, faster tick just for the countdown display — ticking every
  // second (rather than the old 1-minute cadence) is what makes the digital
  // clock below actually look alive instead of a number that jumps once a
  // minute; no need to re-fetch the ranking itself this often.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!data || !data.enabled) return null;

  const { event, eventState, rankingVisible, ranking } = data;

  // Event intro/rewards/period/CTA always render once the event is enabled
  // (ranking-event review item 1) — only the list below is conditional on
  // rankingVisible, which is false exactly when participation hasn't
  // cleared the minimum bar yet.
  let staticLabel: string | null = null;
  let countdownLeadLabel: string | null = null;
  let countdown: CountdownParts | null = null;
  if (eventState === 'finalized') {
    staticLabel = tr.rankingSection.eventEndedLabel;
  } else if (eventState === 'ended_pending') {
    staticLabel = tr.rankingSection.verifyingLabel;
  } else if (event?.endAt) {
    // Always the countdown to the event's own close, whether it's
    // 'upcoming' or 'active' — showing "until it starts" then switching to
    // "until it ends" read as two different, conflicting dates sitting
    // right next to the site's own official-launch-date line below.
    const diffMs = new Date(event.endAt).getTime() - now;
    if (diffMs <= 0) {
      staticLabel = tr.rankingSection.verifyingLabel;
    } else {
      countdownLeadLabel = tr.rankingSection.countdownEndsLabel;
      countdown = msToParts(diffMs);
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filtered =
    rankingVisible && ranking
      ? normalizedQuery
        ? ranking.filter((r) => r.artist.toLowerCase().includes(normalizedQuery))
        : ranking.slice(0, TOP_SHOWN)
      : [];
  const maxCount = ranking?.[0]?.count || 1;

  return (
    <section id="ranking" style={{ position: 'relative', zIndex: 1, background: '#171827', padding: '72px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,125,221,.1)',
              border: '1px solid rgba(255,125,221,.3)',
              padding: '7px 14px',
              borderRadius: 999,
              fontSize: 11.5,
              letterSpacing: '.08em',
              color: '#FF7DDD',
              fontWeight: 700,
              marginBottom: 18,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7DDD', flex: '0 0 auto' }} />
            {tr.rankingSection.eyebrow}
          </div>
          {event?.name && (
            <h2 className="headline-font" style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 800, margin: '0 0 10px', color: '#F5F3FF' }}>{event.name}</h2>
          )}
          <p style={{ fontSize: 14.5, color: '#B8AFC4', margin: '0 0 8px' }}>{tr.rankingSection.subtitle}</p>
          {staticLabel && <div style={{ fontSize: 13, fontWeight: 700, color: '#9089A0' }}>{staticLabel}</div>}
          {APP_LAUNCH_DATE && (
            <div style={{ fontSize: 11.5, color: '#6B6478', marginTop: 6 }}>
              {tr.rankingSection.launchLabel}{' '}
              {new Date(APP_LAUNCH_DATE).toLocaleDateString(INTL_LOCALE[lang] ?? 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}
        </div>

        {event && (
          <div
            style={{
              // Deliberately wider than this section's 720px text column —
              // `left:50% + translateX(-50%)` centers on the column's own
              // centerline (which already sits on the page's center since
              // the column itself is margin-auto'd), so this "breaks out"
              // symmetrically regardless of viewport width instead of being
              // squeezed into the narrow column like the text above it.
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(960px, calc(100vw - 48px))',
              aspectRatio: '2/1',
              borderRadius: 18,
              overflow: 'hidden',
              border: '1px solid rgba(150,117,245,.22)',
              boxShadow: '0 20px 50px rgba(0,0,0,.4)',
              marginBottom: 20,
            }}
          >
            {/* Heavily blurred + darkened podium artwork as a backdrop
                texture, not something meant to be looked at directly — the
                countdown itself is now the focal point of this banner
                (moved here, enlarged, from its old small spot up in the
                intro) rather than a separate key-visual image. scale(1.15)
                keeps the blur's soft edge falloff from showing at the
                banner's own edges. */}
            <Image
              src="/images/genesis-podium.webp"
              alt=""
              fill
              sizes="960px"
              style={{ objectFit: 'cover', filter: 'blur(22px) brightness(.5) saturate(1.3)', transform: 'scale(1.15)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,24,39,.35)' }} />
            {(countdown || staticLabel) && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '0 20px',
                  textAlign: 'center',
                }}
              >
                {countdown ? (
                  <>
                    <div style={{ fontSize: 'clamp(12.5px,2vw,15px)', fontWeight: 700, letterSpacing: '.05em', color: '#F5F3FF' }}>
                      {countdownLeadLabel}
                    </div>
                    {/* Ticks every second (see the `now` interval above) —
                        digits only, no per-unit D/H/M/S captions, matching a
                        plain digital timer rather than another row of
                        labeled stat boxes. */}
                    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'clamp(8px,2vw,14px)', fontVariantNumeric: 'tabular-nums' }}>
                      {[countdown.d, countdown.h, countdown.m, countdown.s].map((val, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(8px,2vw,14px)' }}>
                          {i > 0 && (
                            <span style={{ color: 'rgba(245,243,255,.5)', fontSize: 'clamp(26px,6vw,46px)', fontWeight: 700 }}>:</span>
                          )}
                          <span
                            className="gradient-text"
                            style={{
                              fontSize: 'clamp(34px,8.5vw,60px)',
                              fontWeight: 800,
                              backgroundImage: 'linear-gradient(90deg,#FF7DDD,#9675F5)',
                            }}
                          >
                            {String(val).padStart(2, '0')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 'clamp(16px,3vw,22px)', fontWeight: 700, color: '#F5F3FF' }}>{staticLabel}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Rewards + CTA sit right after the intro, ahead of the searchable
            list below — so an ad click landing straight on this section
            (see app/ranking/page.tsx) sees the benefit and the free
            participate button without having to scroll past the board. */}
        {event && (
          <div
            style={{
              background: 'rgba(255,255,255,.03)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 14,
              padding: '20px 16px',
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '.06em', color: '#9675F5', marginBottom: 14, textAlign: 'center' }}>
              {tr.rankingSection.rewardLegendLabel}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '18px 22px' }}>
              {[
                { label: tr.rankingSection.rankFirst, amount: event.rewardFirst, color: RANK_ACCENTS[0] },
                { label: tr.rankingSection.rankSecond, amount: event.rewardSecond, color: RANK_ACCENTS[1] },
                { label: tr.rankingSection.rankThird, amount: event.rewardThird, color: RANK_ACCENTS[2] },
                { label: tr.rankingSection.rankFourthToTenth, amount: event.rewardFourthToTenth, color: '#B8AFC4' },
              ].map((r, i) => (
                <div key={r.label} style={{ textAlign: 'center', minWidth: i === 0 ? 108 : 86 }}>
                  <div style={{ fontSize: i === 0 ? 13 : 11.5, fontWeight: 700, color: r.color, marginBottom: 4 }}>{r.label}</div>
                  <div style={{ fontSize: i === 0 ? 'clamp(20px,4.5vw,27px)' : 16, fontWeight: 800, color: '#F5F3FF' }}>
                    {krw(r.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <button
            onClick={openModal}
            style={{
              background: 'linear-gradient(135deg,#FF7DDD,#9675F5)',
              color: '#080914',
              fontWeight: 700,
              fontSize: 15,
              padding: '14px 32px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {tr.rankingSection.ctaLabel}
          </button>
        </div>

        {rankingVisible && ranking ? (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr.rankingSection.searchPlaceholder}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.14)',
                borderRadius: 12,
                padding: '12px 16px',
                color: '#F5F3FF',
                fontSize: 14,
                marginBottom: 16,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {filtered.map((row) => {
                const rank = ranking.findIndex((r) => r.artist === row.artist) + 1;
                const prev = rank > 1 ? ranking[rank - 2] : null;
                const needed = prev ? prev.count - row.count + 1 : 0;
                return (
                  <div key={row.artist}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, flex: '0 0 auto', fontSize: 14, fontWeight: 800, color: RANK_ACCENTS[rank - 1] ?? '#B8AFC4' }}>
                        #{rank}
                      </div>
                      <div
                        style={{
                          width: 120,
                          flex: '0 0 auto',
                          fontSize: 13.5,
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {row.artist}
                      </div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 6, overflow: 'hidden', height: 20 }}>
                        <div
                          style={{
                            width: `${Math.max(2, (row.count / maxCount) * 100)}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg,#FF7DDD,#9675F5)',
                          }}
                        />
                      </div>
                      <div style={{ width: 56, flex: '0 0 auto', textAlign: 'right', fontSize: 13, fontWeight: 700 }}>
                        {row.count.toLocaleString()}
                      </div>
                    </div>
                    {prev && needed > 0 && (
                      <div style={{ marginLeft: 44, marginTop: 2, fontSize: 11, color: '#6B6478' }}>
                        {tr.rankingSection.neededForNext(needed)}
                      </div>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p style={{ color: '#6B6478', fontSize: 13, textAlign: 'center' }}>{tr.rankingSection.searchNoResults}</p>
              )}
            </div>
          </>
        ) : (
          // A plain text notice here used to be the entire "locked" state —
          // a first-time visitor had nothing to look at and no sense of what
          // a "ranking" even was. This keeps the lock (still good FOMO/hype
          // value per 2nd-round feedback) but shows a blurred mock-up of the
          // real list shape underneath it, plus a progress bar — without
          // ever revealing the real participant count or the threshold
          // itself (only a derived 0-100 percentage is sent to the client),
          // so the event doesn't look smaller than intended this early on.
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <div
              aria-hidden
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                filter: 'blur(7px)',
                opacity: 0.55,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {PLACEHOLDER_ROWS.map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, flex: '0 0 auto', fontSize: 14, fontWeight: 800, color: RANK_ACCENTS[i] ?? '#B8AFC4' }}>#{i + 1}</div>
                  <div style={{ width: 120, flex: '0 0 auto', height: 14, borderRadius: 6, background: 'rgba(255,255,255,.14)' }} />
                  <div style={{ flex: 1, height: 20, borderRadius: 6, background: 'rgba(255,255,255,.08)' }} />
                  <div style={{ width: 56, flex: '0 0 auto', height: 14, borderRadius: 6, background: 'rgba(255,255,255,.14)' }} />
                </div>
              ))}
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                textAlign: 'center',
                padding: '0 24px',
              }}
            >
              <div style={{ fontSize: 26 }}>🔒</div>
              <p style={{ fontSize: 13.5, color: '#F5F3FF', fontWeight: 700, margin: 0, maxWidth: 320, lineHeight: 1.5 }}>
                {eventState === 'upcoming' ? tr.rankingSection.upcomingNotice : tr.rankingSection.rankingHiddenMessage}
              </p>
              {typeof data.unlockProgressPct === 'number' && (
                <div style={{ width: '100%', maxWidth: 200, height: 6, borderRadius: 999, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${data.unlockProgressPct}%`,
                      background: 'linear-gradient(90deg,#FF7DDD,#9675F5)',
                      borderRadius: 999,
                      transition: 'width .6s ease',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Plain-language rules (2nd-round review item 9): what counts,
            the tie-break, the post-event email-verification grace window,
            and that a finalized result is permanent — stated here rather
            than left implicit, since real money is attached. Native
            <details> needs no extra state. */}
        {event && (
          <details style={{ marginTop: 4 }}>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: 12.5,
                color: '#9675F5',
                fontWeight: 600,
                listStyle: 'none',
              }}
            >
              {tr.rankingSection.termsToggleLabel}
            </summary>
            <ul
              style={{
                margin: '12px 0 0',
                padding: '14px 18px',
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 12,
                fontSize: 12,
                color: '#9089A0',
                lineHeight: 1.7,
                listStylePosition: 'inside',
              }}
            >
              {tr.rankingSection.termsItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
              <li>{tr.rankingSection.termsVerifyGrace(event.emailVerifyGraceHours)}</li>
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
