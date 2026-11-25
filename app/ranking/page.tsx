import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

const DEFAULT_TITLE = 'FANUZU 사전등록 랭킹전 | 최애를 위한 우주';
const DEFAULT_DESCRIPTION = '우리 팬덤의 힘으로 최애에게 광고를 선물하세요. 지금 무료로 사전등록하고 랭킹전에 참여해보세요.';

// Dedicated ad-landing URL (ranking-event review item 2): same site, same
// providers/tracking, just with the ranking event's intro/rewards/CTA as
// the first thing on screen instead of Hero — see LandingPage's
// rankingFirst prop. Artist auto-select, UTM, and referral capture are
// already URL-param-driven (components/landing/AttributionTracker.tsx +
// attribution.ts) and need no route-specific code: an ad can point here
// with ?artist=BTS&utm_source=meta&utm_medium=cpc&... exactly like it
// would at the homepage.
//
// Metadata is dynamic (review item 5): with no ?artist=, the share card
// names the current ranking event (via /api/og); with one, it's the
// per-fandom card named after that artist — see app/api/og/route.tsx.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { artist?: string };
}): Promise<Metadata> {
  const artist = typeof searchParams.artist === 'string' ? searchParams.artist.trim().slice(0, 40) : '';
  const title = artist ? `FANUZU | ${artist}와 함께 사전등록 랭킹전 참여하기` : DEFAULT_TITLE;
  const description = artist
    ? `우리 팬덤의 힘으로 ${artist}에게 광고를 선물하세요. 지금 무료로 사전등록하세요.`
    : DEFAULT_DESCRIPTION;
  const ogImage = artist ? `/api/og?artist=${encodeURIComponent(artist)}` : '/api/og';

  return {
    title,
    description,
    alternates: { canonical: '/ranking' },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

export default function RankingPage() {
  return <LandingPage rankingFirst />;
}
