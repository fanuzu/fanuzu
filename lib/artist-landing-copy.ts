import type { Lang } from './i18n';

// Template copy for the artist landing pages — written ONCE per language
// (not per artist): every artist shares the same 9-language template,
// with only the artist name interpolated in. Kept in its own file rather
// than lib/i18n.ts's TranslationSet (same reasoning as lib/seo.ts's
// SEO_META): this is landing-page/SEO copy, not UI chrome shared across
// every component.
export interface ArtistLandingCopy {
  eyebrow: string;
  h1: (artist: string) => string;
  intro: (artist: string) => string;
  officialBadge: string;
  progressLabel: (count: number, goal: number) => string;
  ctaPreLaunch: string;
  ctaPostLaunch: string;
  metaTitle: (artist: string) => string;
  metaDescription: (artist: string) => string;
}

export const ARTIST_LANDING_COPY: Record<Lang, ArtistLandingCopy> = {
  ko: {
    eyebrow: 'FANUZU 팬덤',
    h1: (a) => `${a} 팬이라면, 지금 FANUZU에서 함께해요`,
    intro: (a) => `우리 팬덤의 힘으로 ${a}에게 응원광고를 선물하세요. 사전등록하고 팬덤 행성을 함께 키워보세요.`,
    officialBadge: '공식 파트너',
    progressLabel: (c, g) => `${c.toLocaleString()} / ${g.toLocaleString()}명이 함께하고 있어요`,
    ctaPreLaunch: '사전등록하기',
    ctaPostLaunch: '앱에서 확인하기',
    metaTitle: (a) => `${a} 팬덤 | FANUZU 사전등록`,
    metaDescription: (a) => `${a} 팬덤의 힘으로 응원광고를 만들어요. 지금 무료로 사전등록하세요.`,
  },
  en: {
    eyebrow: 'FANUZU Fandom',
    h1: (a) => `${a} fan? Join the fandom on FANUZU`,
    intro: (a) => `Turn your fandom's power into a real ad for ${a}. Pre-register and grow your fandom planet together.`,
    officialBadge: 'Official Partner',
    progressLabel: (c, g) => `${c.toLocaleString()} / ${g.toLocaleString()} fans joined so far`,
    ctaPreLaunch: 'Pre-register',
    ctaPostLaunch: 'Open in app',
    metaTitle: (a) => `${a} Fandom | FANUZU Pre-registration`,
    metaDescription: (a) => `Turn your fandom's power into a real ad for ${a}. Pre-register free now.`,
  },
  ja: {
    eyebrow: 'FANUZU ファンダム',
    h1: (a) => `${a}のファンなら、今すぐFANUZUで集まろう`,
    intro: (a) => `ファンの力で${a}に応援広告をプレゼント。事前登録してファンダム惑星を一緒に育てよう。`,
    officialBadge: '公式パートナー',
    progressLabel: (c, g) => `${c.toLocaleString()} / ${g.toLocaleString()}人が参加中`,
    ctaPreLaunch: '事前登録する',
    ctaPostLaunch: 'アプリで見る',
    metaTitle: (a) => `${a}ファンダム | FANUZU事前登録`,
    metaDescription: (a) => `ファンの力で${a}に応援広告をプレゼント。今すぐ無料で事前登録しよう。`,
  },
  es: {
    eyebrow: 'Fandom FANUZU',
    h1: (a) => `¿Eres fan de ${a}? Únete ahora en FANUZU`,
    intro: (a) => `Convierte el poder de tu fandom en un anuncio real para ${a}. Preregístrate y haz crecer tu planeta fandom.`,
    officialBadge: 'Socio Oficial',
    progressLabel: (c, g) => `${c.toLocaleString()} / ${g.toLocaleString()} fans se han unido`,
    ctaPreLaunch: 'Preregistrarme',
    ctaPostLaunch: 'Abrir en la app',
    metaTitle: (a) => `Fandom de ${a} | Preregistro FANUZU`,
    metaDescription: (a) => `Convierte el poder de tu fandom en un anuncio real para ${a}. Preinscríbete gratis ahora.`,
  },
  zhHans: {
    eyebrow: 'FANUZU 饭圈',
    h1: (a) => `${a}的粉丝？现在就在FANUZU集合`,
    intro: (a) => `用粉丝的力量为${a}献上应援广告。立即预注册，一起培育饭圈星球。`,
    officialBadge: '官方合作伙伴',
    progressLabel: (c, g) => `已有 ${c.toLocaleString()} / ${g.toLocaleString()} 人加入`,
    ctaPreLaunch: '立即预注册',
    ctaPostLaunch: '在App中查看',
    metaTitle: (a) => `${a}饭圈 | FANUZU预注册`,
    metaDescription: (a) => `用粉丝的力量为${a}献上应援广告。现在就免费预注册。`,
  },
  zhHant: {
    eyebrow: 'FANUZU 飯圈',
    h1: (a) => `${a}的粉絲？現在就在FANUZU集合`,
    intro: (a) => `用粉絲的力量為${a}獻上應援廣告。立即預先註冊，一起培育飯圈星球。`,
    officialBadge: '官方合作夥伴',
    progressLabel: (c, g) => `已有 ${c.toLocaleString()} / ${g.toLocaleString()} 人加入`,
    ctaPreLaunch: '立即預先註冊',
    ctaPostLaunch: '在App中查看',
    metaTitle: (a) => `${a}飯圈 | FANUZU預先註冊`,
    metaDescription: (a) => `用粉絲的力量為${a}獻上應援廣告。現在就免費預先註冊。`,
  },
  id: {
    eyebrow: 'Fandom FANUZU',
    h1: (a) => `Fans ${a}? Gabung sekarang di FANUZU`,
    intro: (a) => `Ubah kekuatan fandom jadi iklan nyata untuk ${a}. Pre-registrasi dan kembangkan planet fandommu bersama.`,
    officialBadge: 'Mitra Resmi',
    progressLabel: (c, g) => `${c.toLocaleString()} / ${g.toLocaleString()} fans sudah bergabung`,
    ctaPreLaunch: 'Pre-registrasi',
    ctaPostLaunch: 'Buka di aplikasi',
    metaTitle: (a) => `Fandom ${a} | Pre-registrasi FANUZU`,
    metaDescription: (a) => `Ubah kekuatan fandom jadi iklan nyata untuk ${a}. Pre-registrasi gratis sekarang.`,
  },
  fil: {
    eyebrow: 'Fandom ng FANUZU',
    h1: (a) => `Fan ka ba ni ${a}? Sumali na ngayon sa FANUZU`,
    intro: (a) => `Gawing tunay na ad ang lakas ng fandom mo para kay ${a}. Mag-pre-register at palaguin ang fandom planet mo.`,
    officialBadge: 'Opisyal na Kasosyo',
    progressLabel: (c, g) => `${c.toLocaleString()} / ${g.toLocaleString()} fans na ang sumali`,
    ctaPreLaunch: 'Mag-pre-register',
    ctaPostLaunch: 'Buksan sa app',
    metaTitle: (a) => `Fandom ni ${a} | Pre-registration ng FANUZU`,
    metaDescription: (a) => `Gawing tunay na ad ang lakas ng fandom mo para kay ${a}. Mag-pre-register nang libre ngayon.`,
  },
  th: {
    eyebrow: 'แฟนด้อม FANUZU',
    h1: (a) => `แฟน ${a} ใช่ไหม? มารวมตัวกันที่ FANUZU ตอนนี้`,
    intro: (a) => `เปลี่ยนพลังแฟนคลับให้เป็นโฆษณาจริงเพื่อ ${a} ลงทะเบียนล่วงหน้าแล้วมาปลูกฝังดาวเคราะห์แฟนด้อมไปด้วยกัน`,
    officialBadge: 'พาร์ทเนอร์อย่างเป็นทางการ',
    progressLabel: (c, g) => `มีผู้เข้าร่วมแล้ว ${c.toLocaleString()} / ${g.toLocaleString()} คน`,
    ctaPreLaunch: 'ลงทะเบียนล่วงหน้า',
    ctaPostLaunch: 'เปิดในแอป',
    metaTitle: (a) => `แฟนด้อม ${a} | ลงทะเบียนล่วงหน้า FANUZU`,
    metaDescription: (a) => `เปลี่ยนพลังแฟนคลับให้เป็นโฆษณาจริงเพื่อ ${a} ลงทะเบียนล่วงหน้าฟรีตอนนี้`,
  },
};
