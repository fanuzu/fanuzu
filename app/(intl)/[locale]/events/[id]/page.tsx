import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import EventLandingPage from '@/components/event-landing/EventLandingPage';
import { getPublicRankingEventPage } from '@/lib/ranking-events';
import { buildGenericMetadata, buildEventPageStructuredData } from '@/lib/seo';
import { EVENT_LANDING_COPY } from '@/lib/event-landing-copy';
import { SEGMENT_TO_LANG, localePath } from '@/lib/locale';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const lang = SEGMENT_TO_LANG[params.locale];
  const id = Number(params.id);
  if (!lang || !Number.isInteger(id)) return {};
  const data = await getPublicRankingEventPage(id);
  if (!data) return {};
  const copy = EVENT_LANDING_COPY[lang];
  const description = data.state === 'finalized' ? copy.metaDescriptionFinalized(data.event.name) : copy.metaDescriptionActive(data.event.name);
  return buildGenericMetadata({
    lang,
    subpath: `/events/${params.id}`,
    title: copy.metaTitle(data.event.name),
    description,
  });
}

export default async function Page({ params }: { params: { locale: string; id: string } }) {
  const lang = SEGMENT_TO_LANG[params.locale];
  const id = Number(params.id);
  if (!lang || !Number.isInteger(id)) notFound();
  const data = await getPublicRankingEventPage(id);
  if (!data) notFound();
  const copy = EVENT_LANDING_COPY[lang];
  const description = data.state === 'finalized' ? copy.metaDescriptionFinalized(data.event.name) : copy.metaDescriptionActive(data.event.name);

  return (
    <>
      <JsonLd
        data={buildEventPageStructuredData({
          lang,
          subpath: `/events/${params.id}`,
          title: copy.metaTitle(data.event.name),
          description,
          startAt: data.event.startAt,
          endAt: data.event.endAt,
          state: data.state,
        })}
      />
      <EventLandingPage
        lang={lang}
        data={data}
        homeHref={localePath(lang, '')}
        eventsHref={localePath(lang, '/events')}
        rankingHref={localePath(lang, '/ranking')}
      />
    </>
  );
}
