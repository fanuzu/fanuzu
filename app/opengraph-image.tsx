import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'FANUZU | 최애를 위한 우주';
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
// the ~39 characters this file actually draws (full Noto Sans KR is ~6MB
// per weight; the subset is under 7KB) so it isn't a multi-megabyte addition
// to the repo for a few words' worth of Korean text. Re-subset (see git
// history for the pyftsubset command) whenever the Korean text here changes
// to a character not already covered — an uncovered glyph renders blank.
// Deterministic pseudo-random, same approach as StarField/MeteorShower —
// this image is only ever generated once at build time, but a plain
// sine-seeded spread still looks better than a regular grid.
const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const SNOW = Array.from({ length: 42 }, (_, i) => ({
  left: rand(i * 3.7) * 100,
  top: rand(i * 5.1) * 100,
  size: 3 + rand(i * 7.3) * 6,
  opacity: 0.3 + rand(i * 2.9) * 0.55,
}));

const GARLAND_COLORS = ['#E8373F', '#2E7D4F'];
const GARLAND = Array.from({ length: 15 }, (_, i) => ({
  left: 60 + (1080 / 14) * i,
  drop: Math.sin((i / 14) * Math.PI) * 14,
  color: GARLAND_COLORS[i % 2],
}));

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
          position: 'relative',
          background: '#05030B',
          backgroundImage:
            'radial-gradient(circle at 30% 15%, rgba(255,125,221,.3), transparent 55%), radial-gradient(circle at 75% 80%, rgba(155,124,255,.28), transparent 55%), radial-gradient(circle at 50% 0%, rgba(232,185,117,.14), transparent 45%)',
          fontFamily: 'Noto Sans KR',
        }}
      >
        {/* Scattered snow — seasonal touch, same restraint as the live
            site's SnowFall overlay: decoration, not a redesign. */}
        {SNOW.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              borderRadius: '50%',
              background: '#FFFAFC',
              opacity: f.opacity,
            }}
          />
        ))}

        {/* Card-frame border, like a greeting card's inner rule. */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
            right: 30,
            bottom: 30,
            width: 1140,
            height: 570,
            border: '2px solid rgba(232,185,117,.55)',
            borderRadius: 18,
          }}
        />

        {/* Garland strip along the top of the frame. */}
        <div style={{ position: 'absolute', top: 30, left: 0, width: '100%', display: 'flex' }}>
          {GARLAND.map((g, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: g.left,
                top: g.drop,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: g.color,
                boxShadow: `0 0 10px 2px ${g.color}99`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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

          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 108, fontWeight: 800, color: '#FFFAFC' }}>
              <span>FAN</span>
              <span style={{ color: '#FF7DDD' }}>UZU</span>
            </div>
            {/* Same tilted Santa hat as the live site's GIVE button,
                perched on the wordmark for the same "actually worn" look. */}
            <div
              style={{
                position: 'absolute',
                top: -46,
                right: 118,
                width: 86,
                height: 52,
                display: 'flex',
                transform: 'rotate(-14deg)',
              }}
            >
              <svg viewBox="0 0 100 60" width={86} height={52}>
                <path
                  d="M14 42 C 9 12, 42 -4, 63 7 C 86 18, 94 30, 85 38 C 78 44, 54 45, 36 45 Z"
                  fill="#E8373F"
                />
                <circle cx="87" cy="21" r="10" fill="#FFFAFC" />
                <rect x="6" y="39" width="82" height="16" rx="8" fill="#FFFAFC" />
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: 28, fontSize: 36, color: '#B8AFC4', fontWeight: 500 }}>
            최애를 위한 우주
          </div>
          <div style={{ display: 'flex', marginTop: 44, fontSize: 24, color: '#6B6478', letterSpacing: 1 }}>
            fanuzu.co.kr
          </div>
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
