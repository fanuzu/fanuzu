import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = 'https://fanuzu.co.kr';

// TODO(seo): hreflang alternates below all point at the same URL because
// language is a client-side toggle (state + localStorage), not a route —
// doc section 20 assumes locale-specific URLs (e.g. /en, /ja). This is a
// best-effort signal until the site adopts locale-based routing; search
// engines may not fully credit it without distinct URLs per locale.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'FANUZU | 팬의 시간을 기여로',
  description:
    'FANUZU turns fan time into contribution: fans turn actions into POP, grow a fandom planet, and launch real campaigns for the artists they love.',
  alternates: {
    canonical: SITE_URL,
    languages: {
      ko: SITE_URL,
      en: SITE_URL,
      ja: SITE_URL,
      es: SITE_URL,
      'zh-Hans': SITE_URL,
      'zh-Hant': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    title: 'FANUZU | 팬의 시간을 기여로',
    description:
      'FANUZU turns fan time into contribution: fans turn actions into POP, grow a fandom planet, and launch real campaigns for the artists they love.',
    url: SITE_URL,
    siteName: 'FANUZU',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
