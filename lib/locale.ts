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
};
