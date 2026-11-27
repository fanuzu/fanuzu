import type { Metadata } from 'next';
import '../../globals.css';
import SiteFontLinks from '@/components/SiteFontLinks';
import { SITE_URL, siteViewport } from '@/lib/seo';

export const viewport = siteViewport;
import { HTML_LANG, LOCALE_SEGMENTS, SEGMENT_TO_LANG } from '@/lib/locale';

// Root layout (doc section 20: multiple root layouts via route groups)
// for every non-ko language — each gets its own real URL segment here
// (/en, /ja, /zh-hans, …), so unlike (home)'s static "ko", <html lang>
// is set from the actual segment, matching what's server-rendered.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// Only these 8 segments are real pages — anything else 404s instead of
// silently rendering as if it were a locale (dynamicParams: false below
// enforces that, including "/ko": ko is only ever reached unprefixed).
export function generateStaticParams() {
  return LOCALE_SEGMENTS.map((locale) => ({ locale }));
}
export const dynamicParams = false;

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const lang = SEGMENT_TO_LANG[params.locale];
  return (
    <html lang={lang ? HTML_LANG[lang] : 'en'}>
      <head>
        <SiteFontLinks />
      </head>
      <body>{children}</body>
    </html>
  );
}
