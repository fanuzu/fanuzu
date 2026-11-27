import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import EventLandingPage from '@/components/event-landing/EventLandingPage';
import { getPublicRankingEventPage } from '@/lib/ranking-events';
import { buildGenericMetadata, buildEventPageStructuredData } from '@/lib/seo';
import { EVENT_LANDING_COPY } from '@/lib/event-landing-copy';

// Live DB-backed data — see the /events index page's identical comment.
export const dynamic = 'force-dynamic';

// ko (unprefixed) variant — see app/(intl)/[locale]/events/[id]/page.tsx
// for the other 8 languages.
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return {};
  const data = await getPublicRankingEventPage(id);
  if (!data) return {};
  const copy = EVENT_LANDING_COPY.ko;
  const description = data.state === 'finalized' ? copy.metaDescriptionFinalized(data.event.name) : copy.metaDescriptionActive(data.event.name);
  return buildGenericMetadata({
    lang: 'ko',
    subpath: `/events/${params.id}`,
    title: copy.metaTitle(data.event.name),
    description,
  });
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const data = await getPublicRankingEventPage(id);
  if (!data) notFound();
  const copy = EVENT_LANDING_COPY.ko;
  const description = data.state === 'finalized' ? copy.metaDescriptionFinalized(data.event.name) : copy.metaDescriptionActive(data.event.name);

  return (
    <>
      <JsonLd
        data={buildEventPageStructuredData({
          lang: 'ko',
          subpath: `/events/${params.id}`,
          title: copy.metaTitle(data.event.name),
          description,
          startAt: data.event.startAt,
          endAt: data.event.endAt,
          state: data.state,
        })}
      />
      <EventLandingPage lang="ko" data={data} homeHref="/" eventsHref="/events" rankingHref="/ranking" />
    </>
  );
}
