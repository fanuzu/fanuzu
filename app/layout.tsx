import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FANUZU — 나의 별을 이 우주에서 가장 밝게',
  description:
    'FANUZU turns a fan’s time and action into POP, grows a fandom planet, and lets fans launch real campaigns for the artists they love.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
