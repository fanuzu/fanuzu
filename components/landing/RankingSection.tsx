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
}

// Matches the "5-10 minute refresh" cadence from the ranking-event review —
// frequent enough that the board feels alive, far enough apart that it's
// not hammering the DB on every visitor's tab.
const REFRESH_MS = 5 * 60 * 1000;
const TOP_SHOWN = 10;
const RANK_ACCENTS = ['#FFD24A', '#C9D2E0', '#E5995A'];

function krw(n: number): string {
  return `₩${n.toLocaleString()}`;
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

  // A separate, faster tick just for the countdown display — no need to
  // re-fetch the ranking itself every minute to keep "N hours left" honest.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!data || !data.enabled) return null;

  const { event, eventState, rankingVisible, ranking } = data;

  // Event intro/rewards/period/CTA always render once the event is enabled
  // (ranking-event review item 1) — only the list below is conditional on
  // rankingVisible, which is false exactly when participation hasn't
  // cleared the minimum bar yet.
  let timeLabel: string | null = null;
  let timeLabelMuted = false;
  if (eventState === 'finalized') {
    timeLabel = tr.rankingSection.eventEndedLabel;
    timeLabelMuted = true;
  } else if (eventState === 'ended_pending') {
    timeLabel = tr.rankingSection.verifyingLabel;
    timeLabelMuted = true;
  } else if (eventState === 'upcoming' && event?.startAt) {
    const diffMs = new Date(event.startAt).getTime() - now;
    if (diffMs > 0) {
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      timeLabel = hours >= 24 ? tr.rankingSection.startsInDays(Math.ceil(hours / 24)) : tr.rankingSection.startsInHours(hours);
    }
  } else if (eventState === 'active' && event?.endAt) {
    const diffMs = new Date(event.endAt).getTime() - now;
    if (diffMs <= 0) {
      timeLabel = tr.rankingSection.verifyingLabel;
      timeLabelMuted = true;
    } else {
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      timeLabel = hours >= 24 ? tr.rankingSection.daysLeft(Math.ceil(hours / 24)) : tr.rankingSection.hoursLeft(hours);
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
    <section id="ranking" style={{ position: 'relative', zIndex: 1, background: '#0A0613', padding: '72px 24px' }}>
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
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 800, margin: '0 0 10px', color: '#FFFAFC' }}>{event.name}</h2>
          )}
          <p style={{ fontSize: 14.5, color: '#B8AFC4', margin: '0 0 8px' }}>{tr.rankingSection.subtitle}</p>
          {timeLabel && (
            <div style={{ fontSize: 13, fontWeight: 700, color: timeLabelMuted ? '#9089A0' : '#7CE8FF' }}>{timeLabel}</div>
          )}
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
              position: 'relative',
              width: '100%',
              aspectRatio: '2/1',
              borderRadius: 18,
              overflow: 'hidden',
              border: '1px solid rgba(124,232,255,.22)',
              boxShadow: '0 20px 50px rgba(0,0,0,.4)',
              marginBottom: 20,
            }}
          >
            <Image src="/images/genesis-ranking-visual.webp" alt="" fill sizes="720px" style={{ objectFit: 'cover' }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg,transparent 55%,rgba(10,6,19,.9) 100%)',
                pointerEvents: 'none',
              }}
            />
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
              padding: '16px 20px',
              marginBottom: 20,
              fontSize: 12.5,
              color: '#B8AFC4',
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 8 }}>{tr.rankingSection.rewardLegendLabel}</div>
            <div>
              {tr.rankingSection.rankFirst} {krw(event.rewardFirst)} · {tr.rankingSection.rankSecond} {krw(event.rewardSecond)} ·{' '}
              {tr.rankingSection.rankThird} {krw(event.rewardThird)} · {tr.rankingSection.rankFourthToTenth} {krw(event.rewardFourthToTenth)}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <button
            onClick={openModal}
            style={{
              background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
              color: '#05030B',
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
                color: '#FFFAFC',
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
                            background: 'linear-gradient(90deg,#FF7DDD,#9B7CFF)',
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
          <p style={{ color: '#9089A0', fontSize: 13.5, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
            {eventState === 'upcoming' ? tr.rankingSection.upcomingNotice : tr.rankingSection.rankingHiddenMessage}
          </p>
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
                color: '#7CE8FF',
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
