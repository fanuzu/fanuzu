import type { Metadata } from 'next';
import '../globals.css';
import SiteFontLinks from '@/components/SiteFontLinks';
import { SITE_URL, siteViewport } from '@/lib/seo';

export const viewport = siteViewport;

// Separate root layout (doc section 20: multiple root layouts via route
// groups) — terms/privacy keep their own existing client-side language
// toggle unchanged (LangProvider with no initialLang), so <html lang>
// here is a static default rather than something this layout computes;
// LangProvider's existing effect still corrects document.documentElement
// .lang once the client picks a language, exactly as before this change.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <SiteFontLinks />
      </head>
      <body>{children}</body>
    </html>
  );
}
