import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import ArtistLandingPage from '@/components/artist-landing/ArtistLandingPage';
import { getArtistLandingData } from '@/lib/artist-registry';
import { buildGenericMetadata, buildGenericStructuredData, SITE_URL } from '@/lib/seo';
import { fromUrlSlug } from '@/lib/artists';
import { ARTIST_LANDING_COPY } from '@/lib/artist-landing-copy';
import { SEGMENT_TO_LANG, localePath } from '@/lib/locale';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const lang = SEGMENT_TO_LANG[params.locale];
  if (!lang) return {};
  const data = await getArtistLandingData(fromUrlSlug(params.slug));
  if (!data) return {};
  const copy = ARTIST_LANDING_COPY[lang];
  return buildGenericMetadata({
    lang,
    subpath: `/artists/${params.slug}`,
    title: copy.metaTitle(data.artist.artistName),
    description: copy.metaDescription(data.artist.artistName),
    ogImage: `${SITE_URL}/api/og?artist=${encodeURIComponent(data.artist.artistName)}`,
    noindex: !data.hasRealContent,
  });
}

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const lang = SEGMENT_TO_LANG[params.locale];
  if (!lang) notFound();
  const data = await getArtistLandingData(fromUrlSlug(params.slug));
  if (!data) notFound();
  const copy = ARTIST_LANDING_COPY[lang];

  return (
    <>
      <JsonLd
        data={buildGenericStructuredData({
          lang,
          subpath: `/artists/${params.slug}`,
          title: copy.metaTitle(data.artist.artistName),
          description: copy.metaDescription(data.artist.artistName),
          about: data.artist.artistName,
        })}
      />
      <ArtistLandingPage lang={lang} data={data} homeHref={localePath(lang, '')} />
    </>
  );
}
