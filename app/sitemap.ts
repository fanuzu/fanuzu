import type { MetadataRoute } from 'next';
import { LANGS } from '@/lib/i18n';
import { HREFLANG_TAG, localePath } from '@/lib/locale';
import { SITE_URL } from '@/lib/seo';
import { listArtistsWithCounts } from '@/lib/artist-registry';
import { listPublicRankingEvents } from '@/lib/ranking-events';
import { toUrlSlug } from '@/lib/artists';

// Live DB-backed (artist/event lists change) — same reasoning as
// app/api/prereg/ranking/route.ts's own force-dynamic: without this,
// Next.js would try to generate the sitemap once at build time instead
// of per-request.
export const dynamic = 'force-dynamic';

// Every entry carries the full 9-language hreflang set as <xhtml:link>
// alternates (Next's sitemap alternates.languages) for that same path —
// the same canonical/hreflang pairing as each page's own <head>, just
// also surfaced here so a crawler that reads the sitemap first already
// has it. /ranking and /events/[id]'s own /ranking-linking CTA are
// ad-landing surfaces, not meant to be discovered organically, so left out.
function entriesFor(subpath: string): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(LANGS.map((l) => [HREFLANG_TAG[l], SITE_URL + localePath(l, subpath)]));
  return { url: SITE_URL + localePath('ko', subpath), lastModified: new Date(), alternates: { languages } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // One entry per language for the home URL itself (not reusing
  // entriesFor, which always anchors `url` on ko — home needs each
  // language's own URL as `url`).
  const languages = Object.fromEntries(LANGS.map((l) => [HREFLANG_TAG[l], SITE_URL + localePath(l)]));
  const home: MetadataRoute.Sitemap = LANGS.map((lang) => ({
    url: SITE_URL + localePath(lang),
    lastModified: new Date(),
    alternates: { languages },
  }));

  const eventsIndex = entriesFor('/events');

  // A transient DB hiccup must not take the whole sitemap down (a 500 on
  // sitemap.xml itself is worse for crawl trust than briefly missing the
  // artist/event entries) — fall back to just the always-available home
  // entries, same defensive try/catch other DB-backed public routes
  // (e.g. app/api/prereg/ranking) already use instead of letting the
  // error surface as a 500.
  let artistEntries: MetadataRoute.Sitemap = [];
  let eventEntries: MetadataRoute.Sitemap = [];
  try {
    const [artists, events] = await Promise.all([listArtistsWithCounts(), listPublicRankingEvents()]);
    // Same "don't index a page with nothing real on it" gate as
    // getArtistLandingData's hasRealContent — an officially-partnered
    // artist, one with a set fandom name, or one with at least one
    // verified registration is real content; a freshly-added empty row
    // isn't, so it's left out of the sitemap (the page itself still
    // renders and carries its own noindex, just isn't submitted for
    // discovery).
    artistEntries = artists
      .filter((a) => a.officialStatus !== 'unofficial' || !!a.fandomName || a.preregCount > 0)
      .map((a) => entriesFor(`/artists/${toUrlSlug(a.artistName)}`));
    eventEntries = events.map((e) => entriesFor(`/events/${e.id}`));
  } catch (err) {
    console.error('sitemap: artist/event query failed, falling back to home entries only:', err);
  }

  return [...home, eventsIndex, ...artistEntries, ...eventEntries];
}
