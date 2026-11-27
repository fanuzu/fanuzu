import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FANUZU',
    short_name: 'FANUZU',
    description: '나의 최애를 이 우주에서 가장 빛나게 — FANUZU',
    start_url: '/',
    display: 'standalone',
    background_color: '#080914',
    theme_color: '#080914',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
