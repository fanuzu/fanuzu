import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/landing/LandingPage';
import JsonLd from '@/components/JsonLd';
import { buildLandingMetadata, buildPageStructuredData } from '@/lib/seo';
import { SEGMENT_TO_LANG } from '@/lib/locale';

// Same ad-landing page as app/(home)/ranking/page.tsx, for the 8
// non-ko languages — see that file's comment for what this route is.
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { artist?: string };
}): Promise<Metadata> {
  const lang = SEGMENT_TO_LANG[params.locale];
  if (!lang) return {};
  const artist = typeof searchParams.artist === 'string' ? searchParams.artist.trim().slice(0, 40) : '';
  return buildLandingMetadata({ lang, subpath: '/ranking', artist: artist || undefined });
}

export default function RankingPage({ params }: { params: { locale: string } }) {
  const lang = SEGMENT_TO_LANG[params.locale];
  if (!lang) notFound();
  return (
    <>
      <JsonLd data={buildPageStructuredData({ lang, subpath: '/ranking' })} />
      <LandingPage lang={lang} rankingFirst />
    </>
  );
}
