import type { Metadata } from 'next';
import '../globals.css';
import SiteFontLinks from '@/components/SiteFontLinks';
import { SITE_URL, siteViewport } from '@/lib/seo';

export const viewport = siteViewport;

// Separate root layout (doc section 20: multiple root layouts via route
// groups) for the admin panel — internal tool, not part of the public
// language structure, so <html lang> is a plain static default.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <SiteFontLinks />
      </head>
      <body>{children}</body>
    </html>
  );
}
