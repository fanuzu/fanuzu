import type { Metadata, Viewport } from 'next';
import { LANGS, type Lang } from './i18n';
import { HREFLANG_TAG, OG_LOCALE, localePath } from './locale';
import { buildStructuredData, buildEventStructuredData } from './structured-data';
import { SITE_URL } from './site';

export { SITE_URL };

// Shared by every route group's root layout — Next 14 moved themeColor
// off the `metadata` export (deprecated there) onto this separate one.
export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080914',
};

// Short, locale-appropriate title/description per language — previously
// the root layout hardcoded a single Korean title + English description
// for every visitor regardless of language. These double as the OG/
// Twitter card copy. Phrasing follows the confirmed 9-language brand
// slogan table (ranking-section subtitle unification).
const SEO_META: Record<Lang, { title: string; description: string; artistTitle: (artist: string) => string; artistDescription: (artist: string) => string }> = {
  ko: {
    title: 'FANUZU | 나의 최애를 이 우주에서 가장 빛나게',
    description: '우리 팬덤의 힘으로 최애에게 광고를 선물하세요. 지금 무료로 사전등록하고 FANUZU와 함께 팬덤 행성을 키워보세요.',
    artistTitle: (artist) => `FANUZU | ${artist}와 함께 사전등록 이벤트 참여하기`,
    artistDescription: (artist) => `우리 팬덤의 힘으로 ${artist}에게 광고를 선물하세요. 지금 무료로 사전등록하세요.`,
  },
  en: {
    title: 'FANUZU | Make Your Bias Shine the Brightest',
    description: 'Turn fan actions into real campaigns for your favorite K-pop artist. Pre-register free and grow your fandom planet with FANUZU.',
    artistTitle: (artist) => `FANUZU | Pre-register for ${artist}'s fandom event`,
    artistDescription: (artist) => `Turn your fandom's power into a real ad for ${artist}. Pre-register free now.`,
  },
  ja: {
    title: 'FANUZU | 推しを宇宙で一番輝かせよう',
    description: 'ファンの力でアーティストに広告をプレゼント。今すぐ無料で事前登録して、FANUZUでファンダム惑星を育てよう。',
    artistTitle: (artist) => `FANUZU | ${artist}の事前登録イベントに参加する`,
    artistDescription: (artist) => `ファンの力で${artist}に広告をプレゼント。今すぐ無料で事前登録しよう。`,
  },
  es: {
    title: 'FANUZU | Haz Brillar a Tu Artista Favorito',
    description: 'Convierte las acciones de los fans en campañas reales para tu artista K-pop favorito. Preregístrate gratis y haz crecer tu planeta fandom con FANUZU.',
    artistTitle: (artist) => `FANUZU | Preinscríbete al evento de ${artist}`,
    artistDescription: (artist) => `Convierte el poder de tu fandom en un anuncio real para ${artist}. Preinscríbete gratis ahora.`,
  },
  zhHans: {
    title: 'FANUZU | 让你的爱豆成为宇宙中最闪耀的星',
    description: '用粉丝的力量为爱豆献上广告支持。立即免费预注册，和FANUZU一起培育你的饭圈星球。',
    artistTitle: (artist) => `FANUZU | 一起为${artist}预注册吧`,
    artistDescription: (artist) => `用粉丝的力量为${artist}献上广告支持。现在就免费预注册。`,
  },
  zhHant: {
    title: 'FANUZU | 讓你的偶像成為宇宙中最閃耀的星',
    description: '用粉絲的力量為偶像獻上廣告支持。立即免費預先註冊，和FANUZU一起培育你的飯圈星球。',
    artistTitle: (artist) => `FANUZU | 一起為${artist}預先註冊吧`,
    artistDescription: (artist) => `用粉絲的力量為${artist}獻上廣告支持。現在就免費預先註冊。`,
  },
  id: {
    title: 'FANUZU | Buat Biasmu Bersinar Paling Terang',
    description: 'Ubah aksi fans menjadi kampanye nyata untuk artis K-pop favoritmu. Pre-registrasi gratis dan kembangkan planet fandommu bersama FANUZU.',
    artistTitle: (artist) => `FANUZU | Pre-registrasi acara ${artist} bersama kami`,
    artistDescription: (artist) => `Ubah kekuatan fandom jadi iklan nyata untuk ${artist}. Pre-registrasi gratis sekarang.`,
  },
  fil: {
    title: 'FANUZU | Pasikatin ang Bias Mo',
    description: 'Gawing tunay na kampanya ang mga aksyon ng fans para sa paborito mong K-pop artist. Mag-pre-register nang libre at palaguin ang iyong fandom planet sa FANUZU.',
    artistTitle: (artist) => `FANUZU | Mag-pre-register para sa event ni ${artist}`,
    artistDescription: (artist) => `Gawing tunay na ad ang lakas ng fandom mo para kay ${artist}. Mag-pre-register nang libre ngayon.`,
  },
  th: {
    title: 'FANUZU | ทำให้ไบอัสของคุณเปล่งประกายที่สุด',
    description: 'เปลี่ยนการสนับสนุนของแฟนคลับให้เป็นแคมเปญจริงเพื่อศิลปิน K-pop คนที่คุณรัก ลงทะเบียนล่วงหน้าฟรีวันนี้ และเติบโตไปกับดาวเคราะห์แฟนด้อมของคุณบน FANUZU',
    artistTitle: (artist) => `FANUZU | ลงทะเบียนล่วงหน้าร่วมกับ ${artist}`,
    artistDescription: (artist) => `เปลี่ยนพลังแฟนคลับให้เป็นโฆษณาจริงเพื่อ ${artist} ลงทะเบียนล่วงหน้าฟรีตอนนี้`,
  },
};

// hreflang + canonical for a given page (home or /ranking), every language
// pointing at its own real URL — the bug being fixed is every language
// pointing at the same URL, which search engines treat as a no-op signal.
// x-default points at the unprefixed root: that's the URL a
// language-less/unmatched visitor actually lands on (doc section 20).
export function buildAlternates(lang: Lang, subpath: string = ''): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of LANGS) {
    languages[HREFLANG_TAG[l]] = SITE_URL + localePath(l, subpath);
  }
  languages['x-default'] = SITE_URL + (subpath || '/');
  return {
    canonical: SITE_URL + localePath(lang, subpath),
    languages,
  };
}

// Shared by buildLandingMetadata and buildPageStructuredData so the two
// never quietly drift apart (e.g. a title changed in one but not the
// other, so the page and its JSON-LD disagree about its own name).
export function resolvePageCopy({ lang, subpath, artist }: { lang: Lang; subpath: '' | '/ranking'; artist?: string }) {
  const meta = SEO_META[lang];
  const title = artist ? meta.artistTitle(artist) : meta.title;
  const description = artist ? meta.artistDescription(artist) : meta.description;
  // Absolute, not metadataBase-relative: a statically prerendered locale
  // page (next build's SSG pass has no real request host) would otherwise
  // bake in "http://localhost:3000/api/og" as the og:image URL.
  const ogImage = artist
    ? `${SITE_URL}/api/og?artist=${encodeURIComponent(artist)}`
    : subpath === '/ranking'
    ? `${SITE_URL}/api/og`
    : undefined;
  const url = SITE_URL + localePath(lang, subpath);
  return { title, description, url, ogImage };
}

export function buildLandingMetadata({
  lang,
  subpath,
  artist,
}: {
  lang: Lang;
  subpath: '' | '/ranking';
  artist?: string;
}): Metadata {
  const { title, description, url, ogImage } = resolvePageCopy({ lang, subpath, artist });
  const alternateLocales = LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]);

  return {
    title,
    description,
    alternates: buildAlternates(lang, subpath),
    openGraph: {
      title,
      description,
      url,
      siteName: 'FANUZU',
      type: 'website',
      locale: OG_LOCALE[lang],
      alternateLocale: alternateLocales,
      // No explicit `images` when ogImage is unset (plain home page, no
      // ?artist=): Next's own opengraph-image.tsx file convention already
      // supplies og:image/twitter:image for that case, and restating it
      // here would just duplicate the tag.
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    // Always declared (not just when ogImage is set) so every page gets an
    // explicit twitter:card, instead of home's default case silently
    // depending on X/Twitter choosing to fall back to the og: tags.
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export function buildPageStructuredData({ lang, subpath, artist }: { lang: Lang; subpath: '' | '/ranking'; artist?: string }) {
  const { title, description, url } = resolvePageCopy({ lang, subpath, artist });
  return buildStructuredData({ lang, url, title, description });
}

// For the new, templated page types (artist landing pages, ranking-event
// pages) — unlike home/ranking's fixed SEO_META copy, title/description
// here are computed by the caller from per-template copy (see
// lib/artist-landing-copy.ts) since they're parameterized by an artist
// name or event, not one of the 9 fixed strings above.
export function buildGenericMetadata({
  lang,
  subpath,
  title,
  description,
  ogImage,
  noindex,
}: {
  lang: Lang;
  subpath: string;
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
}): Metadata {
  const url = SITE_URL + localePath(lang, subpath);
  const alternateLocales = LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]);

  return {
    title,
    description,
    alternates: buildAlternates(lang, subpath),
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: 'FANUZU',
      type: 'website',
      locale: OG_LOCALE[lang],
      alternateLocale: alternateLocales,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export function buildGenericStructuredData({
  lang,
  subpath,
  title,
  description,
  about,
}: {
  lang: Lang;
  subpath: string;
  title: string;
  description: string;
  about?: string;
}) {
  const url = SITE_URL + localePath(lang, subpath);
  return buildStructuredData({ lang, url, title, description, about });
}

export function buildEventPageStructuredData({
  lang,
  subpath,
  title,
  description,
  startAt,
  endAt,
  state,
}: {
  lang: Lang;
  subpath: string;
  title: string;
  description: string;
  startAt: string | null;
  endAt: string | null;
  state: 'upcoming' | 'active' | 'ended_pending' | 'finalized';
}) {
  const url = SITE_URL + localePath(lang, subpath);
  return buildEventStructuredData({ lang, url, title, description, startAt, endAt, state });
}
