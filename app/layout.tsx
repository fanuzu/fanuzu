import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = 'https://fanuzu.co.kr';

// Locale switching is client-side; do not advertise identical URLs as localized alternatives.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'FANUZU | 최애를 위한 우주',
  description:
    'FANUZU turns fan time into contribution: fans turn actions into POP, grow a fandom planet, and launch real campaigns for the artists they love.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'FANUZU | 최애를 위한 우주',
    description:
      'FANUZU turns fan time into contribution: fans turn actions into POP, grow a fandom planet, and launch real campaigns for the artists they love.',
    url: SITE_URL,
    siteName: 'FANUZU',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Gothic+A1:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
