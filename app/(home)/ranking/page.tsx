import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';
import JsonLd from '@/components/JsonLd';
import { buildLandingMetadata, buildPageStructuredData } from '@/lib/seo';

// Dedicated ad-landing URL (ranking-event review item 2): same site, same
// providers/tracking, just with the ranking event's intro/rewards/CTA as
// the first thing on screen instead of Hero — see LandingPage's
// rankingFirst prop. Artist auto-select, UTM, and referral capture are
// already URL-param-driven (components/landing/AttributionTracker.tsx +
// attribution.ts) and need no route-specific code: an ad can point here
// with ?artist=BTS&utm_source=meta&utm_medium=cpc&... exactly like it
// would at the homepage. This is the ko (unprefixed) variant — see
// app/(intl)/[locale]/ranking/page.tsx for the other 8 languages.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { artist?: string };
}): Promise<Metadata> {
  const artist = typeof searchParams.artist === 'string' ? searchParams.artist.trim().slice(0, 40) : '';
  return buildLandingMetadata({ lang: 'ko', subpath: '/ranking', artist: artist || undefined });
}

export default function RankingPage() {
  return (
    <>
      <JsonLd data={buildPageStructuredData({ lang: 'ko', subpath: '/ranking' })} />
      <LandingPage lang="ko" rankingFirst />
    </>
  );
}
