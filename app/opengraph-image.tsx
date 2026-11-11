import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'FANUZU | 팬의 시간을 기여로';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Link-preview cards (KakaoTalk, Slack, iMessage, …) had no og:image to read
// at all, so crawlers fell back to grabbing whatever large <img> they found
// on the page — the Hero wordmark, cropped at an arbitrary zoom. This file
// is Next's convention for a route-level OG image: it's picked up
// automatically and wired into the page's og:image/twitter:image meta, no
// manual <head> tag needed.
//
// Satori (the renderer behind ImageResponse) ships no default CJK glyphs,
// so the Korean tagline would render blank without an explicit Korean
// font — assets/fonts/NotoSansKR-*.ttf, subset with pyftsubset down to just
// the ~37 characters this file actually draws (full Noto Sans KR is ~6MB
// per weight; the subset is under 6KB) so it isn't a multi-megabyte addition
// to the repo for three glyphs' worth of Korean text.
export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), 'assets/fonts');
  const [regular, bold, extraBold] = await Promise.all([
    readFile(join(fontDir, 'NotoSansKR-Regular.ttf')),
    readFile(join(fontDir, 'NotoSansKR-Bold.ttf')),
    readFile(join(fontDir, 'NotoSansKR-ExtraBold.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#05030B',
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(255,125,221,.35), transparent 55%), radial-gradient(circle at 75% 75%, rgba(155,124,255,.3), transparent 55%)',
          fontFamily: 'Noto Sans KR',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '10px 26px',
            borderRadius: 999,
            border: '1px solid rgba(255,125,221,.35)',
            background: 'rgba(255,125,221,.08)',
            color: '#FF7DDD',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 36,
          }}
        >
          THE ACTION FANDOM FOR K-POP ARTISTS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 108, fontWeight: 800, color: '#FFFAFC' }}>
          <span>FAN</span>
          <span style={{ color: '#FF7DDD' }}>UZU</span>
        </div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 36, color: '#B8AFC4', fontWeight: 500 }}>
          팬의 시간을 기여로
        </div>
        <div style={{ display: 'flex', marginTop: 44, fontSize: 24, color: '#6B6478', letterSpacing: 1 }}>
          fanuzu.co.kr
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto Sans KR', data: regular, weight: 400, style: 'normal' },
        { name: 'Noto Sans KR', data: bold, weight: 700, style: 'normal' },
        { name: 'Noto Sans KR', data: extraBold, weight: 800, style: 'normal' },
      ],
    }
  );
}
