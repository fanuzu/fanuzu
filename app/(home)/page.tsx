import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';
import JsonLd from '@/components/JsonLd';
import { buildLandingMetadata, buildPageStructuredData } from '@/lib/seo';

// Unprefixed root = ko (doc section 20's chosen default). generateMetadata
// always runs now (not just when ?artist= is set) since there's no longer
// a single shared root layout able to supply a one-size-fits-all
// title/description across every language — each language's page computes
// its own, this one's ko.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { artist?: string };
}): Promise<Metadata> {
  const artist = typeof searchParams.artist === 'string' ? searchParams.artist.trim().slice(0, 40) : '';
  return buildLandingMetadata({ lang: 'ko', subpath: '', artist: artist || undefined });
}

export default function Page() {
  return (
    <>
      <JsonLd data={buildPageStructuredData({ lang: 'ko', subpath: '' })} />
      <LandingPage lang="ko" />
    </>
  );
}
