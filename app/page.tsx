import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

const SITE_URL = 'https://fanuzu.co.kr';

// A share link that names a specific artist (?artist=X — see
// components/landing/attribution.ts, used by every referral/invite link)
// gets its own OG card naming that fandom instead of the generic site card
// every other share falls back to (ranking-event review item 5's
// "per-fandom share image"). The full openGraph/twitter objects are
// re-stated here rather than just `images`, since Next's metadata merge
// replaces an object field wholesale at the segment that defines it —
// leaving out title/description would drop them, not inherit root
// layout's.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { artist?: string };
}): Promise<Metadata> {
  const artist = typeof searchParams.artist === 'string' ? searchParams.artist.trim().slice(0, 40) : '';
  if (!artist) return {};

  const title = `FANUZU | ${artist}와 함께 사전등록 이벤트 참여하기`;
  const description = `우리 팬덤의 힘으로 ${artist}에게 광고를 선물하세요. 지금 무료로 사전등록하세요.`;
  const ogImage = `/api/og?artist=${encodeURIComponent(artist)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: 'FANUZU',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

export default function Page() {
  return <LandingPage />;
}
