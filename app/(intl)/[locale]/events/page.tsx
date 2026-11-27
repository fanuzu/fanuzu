import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventsIndexPage from '@/components/event-landing/EventsIndexPage';
import { listPublicRankingEvents } from '@/lib/ranking-events';
import { buildGenericMetadata } from '@/lib/seo';
import { EVENT_LANDING_COPY } from '@/lib/event-landing-copy';
import { SEGMENT_TO_LANG, localePath } from '@/lib/locale';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const lang = SEGMENT_TO_LANG[params.locale];
  if (!lang) return {};
  const copy = EVENT_LANDING_COPY[lang];
  return buildGenericMetadata({ lang, subpath: '/events', title: copy.indexTitle, description: copy.indexTitle });
}

export default async function Page({ params }: { params: { locale: string } }) {
  const lang = SEGMENT_TO_LANG[params.locale];
  if (!lang) notFound();
  const events = await listPublicRankingEvents();
  return (
    <EventsIndexPage
      lang={lang}
      events={events}
      eventHref={(id) => localePath(lang, `/events/${id}`)}
      homeHref={localePath(lang, '')}
    />
  );
}
