import type { Lang } from '@/lib/i18n';
import { T } from '@/lib/i18n';
import { HTML_LANG } from '@/lib/locale';
import type { PublicRankingEventPage } from '@/lib/ranking-events';
import { EVENT_LANDING_COPY } from '@/lib/event-landing-copy';
import AppOrPreregCta from '@/components/landing/AppOrPreregCta';

function formatWon(n: number): string {
  return `₩${n.toLocaleString()}`;
}

function formatDate(iso: string | null, lang: Lang): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat(HTML_LANG[lang], { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// Permanent permalink for one specific ranking event (doc: "사전등록 이벤트
// 홍보 및 결과 보존") — lightweight and server-rendered like
// ArtistLandingPage, not the interactive embedded RankingSection.
export default function EventLandingPage({
  lang,
  data,
  homeHref,
  eventsHref,
  rankingHref,
}: {
  lang: Lang;
  data: PublicRankingEventPage;
  homeHref: string;
  eventsHref: string;
  rankingHref: string;
}) {
  const copy = EVENT_LANDING_COPY[lang];
  const rs = T[lang].rankingSection;
  const { event, state, rankingVisible, ranking, unlockProgressPct } = data;

  const stateLabel = {
    upcoming: copy.stateUpcoming,
    active: copy.stateActive,
    ended_pending: copy.stateEnded,
    finalized: copy.stateFinalized,
  }[state];

  const period = [formatDate(event.startAt, lang), formatDate(event.endAt, lang)].filter(Boolean).join(' – ');
  const preregHref = `${rankingHref}?utm_source=seo&utm_medium=event_page`;

  return (
    <main style={{ minHeight: '100vh', background: '#080914', color: '#F5F3FF', fontFamily: 'Pretendard,Inter,system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 100px' }}>
        <div style={{ fontSize: 12, letterSpacing: '.12em', color: '#FF7DDD', fontWeight: 700, marginBottom: 16 }}>{copy.eyebrow}</div>

        <h1 className="headline-font" style={{ fontSize: 'clamp(26px,5vw,36px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 12px' }}>
          {event.name}
        </h1>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#080914',
              background: 'linear-gradient(135deg,#FF7DDD,#9675F5)',
              borderRadius: 999,
              padding: '5px 14px',
            }}
          >
            {stateLabel}
          </span>
          {period && <span style={{ fontSize: 13.5, color: '#B8AFC4' }}>{period}</span>}
        </div>

        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 12.5, color: '#9675F5', fontWeight: 700, marginBottom: 12 }}>{rs.rewardLegendLabel}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              [rs.rankFirst, event.rewardFirst],
              [rs.rankSecond, event.rewardSecond],
              [rs.rankThird, event.rewardThird],
              [rs.rankFourthToTenth, event.rewardFourthToTenth],
            ].map(([label, amount], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: '#B8AFC4' }}>{label as string}</span>
                <span style={{ color: '#F5F3FF', fontWeight: 700 }}>{formatWon(amount as number)}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>{copy.resultsTitle}</h2>

        {rankingVisible && ranking.length > 0 ? (
          <ol style={{ listStyle: 'none', margin: '0 0 36px', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranking.slice(0, 10).map((row, i) => (
              <li
                key={row.artist}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: i < 3 ? 'rgba(255,125,221,.08)' : 'rgba(255,255,255,.03)',
                }}
              >
                <span style={{ fontWeight: 700 }}>
                  {i + 1}. {row.artist}
                </span>
                <span style={{ color: '#9675F5', fontWeight: 700 }}>{row.count.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 14, color: '#B8AFC4', lineHeight: 1.7, margin: '0 0 12px' }}>{copy.noResultsYet}</p>
            {typeof unlockProgressPct === 'number' && (
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${unlockProgressPct}%`,
                    background: 'linear-gradient(90deg,#FF7DDD,#9675F5)',
                    borderRadius: 999,
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <AppOrPreregCta
            target={{ kind: 'event', id: event.id }}
            preregHref={preregHref}
            preLaunchLabel={copy.ctaPreLaunch}
            postLaunchLabel={copy.ctaPostLaunch}
          />
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 20 }}>
            <a href={eventsHref} style={{ fontSize: 13, color: '#6B6478', textDecoration: 'none' }}>
              {copy.backToEvents}
            </a>
            <a href={homeHref} style={{ fontSize: 13, color: '#6B6478', textDecoration: 'none' }}>
              FANUZU →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
