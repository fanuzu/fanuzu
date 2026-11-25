import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

// Dedicated ad-landing URL (ranking-event review item 2): same site, same
// providers/tracking, just with the ranking event's intro/rewards/CTA as
// the first thing on screen instead of Hero — see LandingPage's
// rankingFirst prop. Artist auto-select, UTM, and referral capture are
// already URL-param-driven (components/landing/AttributionTracker.tsx +
// attribution.ts) and need no route-specific code: an ad can point here
// with ?artist=BTS&utm_source=meta&utm_medium=cpc&... exactly like it
// would at the homepage.
export const metadata: Metadata = {
  title: 'FANUZU 사전등록 랭킹전 | 최애를 위한 우주',
  description: '우리 팬덤의 힘으로 최애에게 광고를 선물하세요. 지금 무료로 사전등록하고 랭킹전에 참여해보세요.',
  alternates: { canonical: '/ranking' },
  openGraph: {
    title: 'FANUZU 사전등록 랭킹전',
    description: '우리 팬덤의 힘으로 최애에게 광고를 선물하세요. 지금 무료로 사전등록하고 랭킹전에 참여해보세요.',
    type: 'website',
  },
};

export default function RankingPage() {
  return <LandingPage rankingFirst />;
}
