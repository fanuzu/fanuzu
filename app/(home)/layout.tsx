import type { Metadata } from 'next';
import '../globals.css';
import SiteFontLinks from '@/components/SiteFontLinks';
import { SITE_URL, siteViewport } from '@/lib/seo';

export const viewport = siteViewport;

// Root layout for the unprefixed domain root — ko is the default,
// server-rendered language here (doc section 20), so this is a real
// (static) root layout, not a shim: <html lang> is always "ko" because
// this group only ever serves ko content (every other language gets its
// own URL under the (intl) group's [locale] root layout, which sets its
// own <html lang> dynamically).
// Search-console ownership verification (Google/Naver): both check the
// meta tag on whichever URL the operator registers in their console,
// which for a domain like this is always the bare root — so this is the
// one place these need to live, not every locale's layout. Inert (renders
// no tag at all) until the operator supplies the real codes from their
// own Search Console / 네이버 서치어드바이저 "HTML 태그" verification step.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.NAVER_SITE_VERIFICATION
      ? { 'naver-site-verification': process.env.NAVER_SITE_VERIFICATION }
      : undefined,
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <SiteFontLinks />
      </head>
      <body>{children}</body>
    </html>
  );
}
