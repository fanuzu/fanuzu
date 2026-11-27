import type { Metadata } from 'next';
import EventsIndexPage from '@/components/event-landing/EventsIndexPage';
import { listPublicRankingEvents } from '@/lib/ranking-events';
import { buildGenericMetadata } from '@/lib/seo';
import { EVENT_LANDING_COPY } from '@/lib/event-landing-copy';

// Live DB-backed data (event state/standings change with the clock) —
// same reasoning as app/api/prereg/ranking/route.ts's own force-dynamic:
// without this, Next bakes whatever the data looked like at build time
// and never updates it.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = EVENT_LANDING_COPY.ko;
  return buildGenericMetadata({ lang: 'ko', subpath: '/events', title: copy.indexTitle, description: copy.indexTitle });
}

export default async function Page() {
  const events = await listPublicRankingEvents();
  return <EventsIndexPage lang="ko" events={events} eventHref={(id) => `/events/${id}`} homeHref="/" />;
}
