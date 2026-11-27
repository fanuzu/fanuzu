import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import ArtistLandingPage from '@/components/artist-landing/ArtistLandingPage';
import { getArtistLandingData } from '@/lib/artist-registry';
import { buildGenericMetadata, buildGenericStructuredData, SITE_URL } from '@/lib/seo';
import { fromUrlSlug } from '@/lib/artists';
import { ARTIST_LANDING_COPY } from '@/lib/artist-landing-copy';

// Live DB-backed data (registration/progress numbers change) — same
// reasoning as app/api/prereg/ranking/route.ts's own force-dynamic.
export const dynamic = 'force-dynamic';

// ko (unprefixed) variant — see app/(intl)/[locale]/artists/[slug]/page.tsx
// for the other 8 languages. Exists only for rows the team has actually
// added to the artist registry (getArtistLandingData returns null
// otherwise, which 404s) — never synthesized from arbitrary URL input.
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getArtistLandingData(fromUrlSlug(params.slug));
  if (!data) return {};
  const copy = ARTIST_LANDING_COPY.ko;
  return buildGenericMetadata({
    lang: 'ko',
    subpath: `/artists/${params.slug}`,
    title: copy.metaTitle(data.artist.artistName),
    description: copy.metaDescription(data.artist.artistName),
    ogImage: `${SITE_URL}/api/og?artist=${encodeURIComponent(data.artist.artistName)}`,
    noindex: !data.hasRealContent,
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getArtistLandingData(fromUrlSlug(params.slug));
  if (!data) notFound();
  const copy = ARTIST_LANDING_COPY.ko;

  return (
    <>
      <JsonLd
        data={buildGenericStructuredData({
          lang: 'ko',
          subpath: `/artists/${params.slug}`,
          title: copy.metaTitle(data.artist.artistName),
          description: copy.metaDescription(data.artist.artistName),
          about: data.artist.artistName,
        })}
      />
      <ArtistLandingPage lang="ko" data={data} homeHref="/" />
    </>
  );
}
