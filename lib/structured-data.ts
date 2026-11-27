import { HREFLANG_TAG } from './locale';
import { SITE_URL } from './site';
import type { Lang } from './i18n';

// Organization + WebSite are the same object on every page (schema.org's
// own convention: repeat the identical block, dedupe by @id) — only
// WebPage actually varies per locale/subpath. Kept to what's literally
// true of this site right now (a single-page pre-registration site, no
// internal search, no article content yet) rather than padding the
// graph with schema types the content doesn't back up.
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'FANUZU',
    legalName: 'Fancake Inc.',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.svg`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do',
      addressCountry: 'KR',
    },
  };
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: 'FANUZU',
    publisher: { '@id': ORGANIZATION_ID },
  };
}

// Ranking events have real startDate/endDate/status, which is exactly
// what schema.org's Event type is for — unlike the generic WebPage used
// elsewhere, this one is backed by real data, not padding.
function eventStatusFor(state: 'upcoming' | 'active' | 'ended_pending' | 'finalized'): string {
  return state === 'finalized' || state === 'ended_pending'
    ? 'https://schema.org/EventCompleted'
    : 'https://schema.org/EventScheduled';
}

export function buildEventStructuredData({
  lang,
  url,
  title,
  description,
  startAt,
  endAt,
  state,
}: {
  lang: Lang;
  url: string;
  title: string;
  description: string;
  startAt: string | null;
  endAt: string | null;
  state: 'upcoming' | 'active' | 'ended_pending' | 'finalized';
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(),
      website(),
      {
        '@type': 'Event',
        '@id': `${url}#event`,
        url,
        name: title,
        description,
        inLanguage: HREFLANG_TAG[lang],
        ...(startAt ? { startDate: startAt } : {}),
        ...(endAt ? { endDate: endAt } : {}),
        eventStatus: eventStatusFor(state),
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        location: { '@type': 'VirtualLocation', url },
        organizer: { '@id': ORGANIZATION_ID },
        isPartOf: { '@id': WEBSITE_ID },
      },
    ],
  };
}

export function buildStructuredData({
  lang,
  url,
  title,
  description,
  about,
}: {
  lang: Lang;
  url: string;
  title: string;
  description: string;
  // Topical hint for an artist/event landing page — a plain string, not
  // a fabricated Person/MusicGroup entity: we don't hold verified data
  // (birthdate, members, official socials) that would back a richer
  // schema.org type, and a wrong one is worse than none.
  about?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(),
      website(),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: HREFLANG_TAG[lang],
        isPartOf: { '@id': WEBSITE_ID },
        ...(about ? { about: { '@type': 'Thing', name: about } } : {}),
      },
    ],
  };
}
