import type { Lang } from './i18n';

// Doc section 3: the <html lang> attribute should follow these exact BCP47
// tags (zh-CN/zh-TW here, not zh-Hans/zh-Hant — see HREFLANG_TAG below for
// the different tags the doc asks for in hreflang specifically).
export const HTML_LANG: Record<Lang, string> = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
  es: 'es',
  zhHans: 'zh-CN',
  zhHant: 'zh-TW',
  id: 'id',
  fil: 'fil',
  th: 'th',
};

// Doc section 20: hreflang alternates use zh-Hans/zh-Hant rather than
// zh-CN/zh-TW.
export const HREFLANG_TAG: Record<Lang, string> = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
  es: 'es',
  zhHans: 'zh-Hans',
  zhHant: 'zh-Hant',
  id: 'id',
  fil: 'fil',
  th: 'th',
};

// Facebook/OG's locale format (og:locale) — underscore + region, not the
// hyphenated BCP47 hreflang uses. Picked a real, commonly-targeted region
// per language rather than a generic one (e.g. es_ES over es_MX) since
// OG locale is a single best-guess tag, not a full alternates list — the
// actual alternates are still covered by hreflang, not this.
export const OG_LOCALE: Record<Lang, string> = {
  ko: 'ko_KR',
  en: 'en_US',
  ja: 'ja_JP',
  es: 'es_ES',
  zhHans: 'zh_CN',
  zhHant: 'zh_TW',
  id: 'id_ID',
  fil: 'fil_PH',
  th: 'th_TH',
};

// SEO routing (search-exposure fix): ko is the unprefixed root ('/') —
// everything else gets its own real URL segment so each language is a
// distinct, independently crawlable/indexable page instead of nine
// languages sharing one URL. Lowercase + hyphenated (zh-hans, not
// zh-Hans) since that's the conventional casing for URL path segments;
// HREFLANG_TAG above is the separate, differently-cased string that goes
// in the actual hreflang attribute/sitemap entry.
export const LOCALE_SEGMENT: Record<Lang, string> = {
  ko: '',
  en: 'en',
  ja: 'ja',
  es: 'es',
  zhHans: 'zh-hans',
  zhHant: 'zh-hant',
  id: 'id',
  fil: 'fil',
  th: 'th',
};

// Reverse of LOCALE_SEGMENT, built from it so the two can never drift out
// of sync — used by the [locale] route segment to turn the URL's raw
// string back into a Lang. Deliberately has no 'ko' entry: ko is only
// ever reached unprefixed, so a literal "/ko" must 404 rather than
// duplicate the root's content under a second URL.
export const SEGMENT_TO_LANG: Partial<Record<string, Lang>> = Object.fromEntries(
  (Object.entries(LOCALE_SEGMENT) as [Lang, string][])
    .filter(([lang, seg]) => lang !== 'ko' && seg !== '')
    .map(([lang, seg]) => [seg, lang])
);

// The 8 non-ko URL segments, for generateStaticParams on the [locale] route.
export const LOCALE_SEGMENTS: string[] = Object.keys(SEGMENT_TO_LANG);

export function localePath(lang: Lang, subpath: string = ''): string {
  const seg = LOCALE_SEGMENT[lang];
  return seg ? `/${seg}${subpath}` : subpath || '/';
}

// The one place a visitor's language choice is written, from the two
// places that let them pick one by hand (the Nav switcher, the
// first-visit suggestion banner) — never from merely landing on a
// locale's URL (doc section 20: only an explicit choice should persist
// and steer later visits to the bare domain; arriving via a shared /ja
// link isn't that). Writes both storages: localStorage for this
// unprefixed-root page's own client-side read, and the cookie so
// middleware (which can't see localStorage) can redirect a returning
// visitor straight to their locale before any HTML is sent.
export function persistLangChoice(code: Lang): void {
  try {
    localStorage.setItem('fanuzu_lang', code);
  } catch (e) {}
  try {
    document.cookie = `fanuzu_lang=${code}; path=/; max-age=31536000; samesite=lax`;
  } catch (e) {}
}
