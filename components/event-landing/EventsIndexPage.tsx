import type { Lang } from '@/lib/i18n';
import { HTML_LANG } from '@/lib/locale';
import type { RankingEvent } from '@/lib/ranking-events';
import { getRankingEventState } from '@/lib/ranking-events';
import { EVENT_LANDING_COPY } from '@/lib/event-landing-copy';

function formatDate(iso: string | null, lang: Lang): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat(HTML_LANG[lang], { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// Index of every publicly visible ranking event — exists mainly so a
// finalized event's permalink isn't orphaned (reachable only via the
// sitemap) once a newer event replaces it as "current" anywhere else on
// the site; also gives crawlers a normal internal link to each one.
export default function EventsIndexPage({
  lang,
  events,
  eventHref,
  homeHref,
}: {
  lang: Lang;
  events: RankingEvent[];
  eventHref: (id: number) => string;
  homeHref: string;
}) {
  const copy = EVENT_LANDING_COPY[lang];

  return (
    <main style={{ minHeight: '100vh', background: '#080914', color: '#F5F3FF', fontFamily: 'Pretendard,Inter,system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 100px' }}>
        <h1 className="headline-font" style={{ fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, margin: '0 0 32px' }}>
          {copy.indexTitle}
        </h1>

        {events.length === 0 ? (
          <p style={{ fontSize: 14, color: '#B8AFC4' }}>{copy.indexEmpty}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {events.map((event) => {
              const state = getRankingEventState(event);
              const stateLabel = {
                upcoming: copy.stateUpcoming,
                active: copy.stateActive,
                ended_pending: copy.stateEnded,
                finalized: copy.stateFinalized,
              }[state];
              const period = [formatDate(event.startAt, lang), formatDate(event.endAt, lang)].filter(Boolean).join(' – ');

              return (
                <a
                  key={event.id}
                  href={eventHref(event.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(255,255,255,.08)',
                    textDecoration: 'none',
                    color: '#F5F3FF',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{event.name}</div>
                    {period && <div style={{ fontSize: 12.5, color: '#6B6478' }}>{period}</div>}
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9675F5', whiteSpace: 'nowrap' }}>{stateLabel}</span>
                </a>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 40 }}>
          <a href={homeHref} style={{ fontSize: 13, color: '#6B6478', textDecoration: 'none' }}>
            FANUZU →
          </a>
        </div>
      </div>
    </main>
  );
}
