import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getCurrentRankingEvent } from '@/lib/ranking-events';

export const runtime = 'nodejs';

const WIDTH = 1200;
const HEIGHT = 630;

// Matches the root app/opengraph-image.tsx's fallback name exactly, same
// reasoning: it's proven safe against the bundled local subset font below.
const FALLBACK_EVENT_NAME = '사전등록 이벤트';

const fontCache = new Map<string, ArrayBuffer | null>();

// This route renders two kinds of genuinely arbitrary text: an admin's own
// ranking-event name, and a fan's free-typed artist name (ranking-event
// review item 5's "event and per-fandom share image") — either of which can
// contain Korean the bundled assets/fonts/NotoSansKR-*.ttf was never
// subset for (it only covers the fixed tagline + basic Latin used
// elsewhere on this card). Google Fonts' CSS2 endpoint can subset a font
// down to exactly the glyphs one string needs (`&text=`), which covers
// that gap without bundling a multi-megabyte font file. Satori (the
// renderer behind ImageResponse) needs TTF/OTF, not WOFF2, which is why
// the request spoofs an old User-Agent Google's CDN still answers with a
// TTF link for. Falls back to null (caller then falls back to the bundled
// subset font, which still renders Latin text fine) if this network call
// fails for any reason — a slow/unreachable font CDN should degrade the
// card, never break it. Not yet smoke-tested against a real production
// deploy; worth a manual check once this ships.
async function fetchGoogleFontSubset(text: string): Promise<ArrayBuffer | null> {
  if (!text) return null;
  if (fontCache.has(text)) return fontCache.get(text) ?? null;
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&text=${encodeURIComponent(text)}`;
    const css = await (
      await fetch(cssUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko' },
      })
    ).text();
    const match = css.match(/src: url\(([^)]+)\) format\('truetype'\)/);
    if (!match) {
      fontCache.set(text, null);
      return null;
    }
    const fontRes = await fetch(match[1]);
    const buf = fontRes.ok ? await fontRes.arrayBuffer() : null;
    fontCache.set(text, buf);
    return buf;
  } catch {
    fontCache.set(text, null);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artistRaw = searchParams.get('artist');
  const artist = artistRaw ? artistRaw.trim().slice(0, 40) : '';

  let eventName = FALLBACK_EVENT_NAME;
  try {
    const event = await getCurrentRankingEvent();
    if (event?.name) eventName = event.name;
  } catch {
    // Keep the fallback name — a DB hiccup should never fail the image.
  }

  const headline = artist || eventName;
  const fontDir = join(process.cwd(), 'assets/fonts');
  const [localBold, localExtraBold, dynamicHeadline] = await Promise.all([
    readFile(join(fontDir, 'NotoSansKR-Bold.ttf')),
    readFile(join(fontDir, 'NotoSansKR-ExtraBold.ttf')),
    fetchGoogleFontSubset(headline),
  ]);

  const fonts: { name: string; data: Buffer | ArrayBuffer; weight: 700 | 800; style: 'normal' }[] = [
    { name: 'Noto Sans KR', data: localBold, weight: 700, style: 'normal' },
    { name: 'Noto Sans KR', data: localExtraBold, weight: 800, style: 'normal' },
  ];
  // Registered under its own family name and used only for `headline` (the
  // one piece of genuinely arbitrary text) so it never competes with the
  // bundled subset's own coverage of the fixed copy below it.
  if (dynamicHeadline) {
    fonts.push({ name: 'Headline', data: dynamicHeadline, weight: 800, style: 'normal' });
  }

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
          position: 'relative',
          background: '#080914',
          backgroundImage:
            'radial-gradient(circle at 25% 20%, rgba(255,125,221,.32), transparent 55%), radial-gradient(circle at 78% 78%, rgba(150,117,245,.28), transparent 55%)',
          fontFamily: 'Noto Sans KR',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '10px 24px',
            borderRadius: 999,
            border: '1px solid rgba(255,125,221,.4)',
            background: 'rgba(255,125,221,.1)',
            color: '#FF7DDD',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
            marginBottom: 40,
          }}
        >
          PRE-REGISTRATION RANKING EVENT
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: artist ? 86 : 64,
            fontWeight: 800,
            color: '#F5F3FF',
            textAlign: 'center',
            maxWidth: 1000,
            lineHeight: 1.25,
            fontFamily: dynamicHeadline ? 'Headline' : 'Noto Sans KR',
          }}
        >
          {headline}
        </div>

        <div style={{ display: 'flex', marginTop: 26, fontSize: 28, color: '#B8AFC4', fontWeight: 500 }}>
          FANUZU · 최애를 위한 우주
        </div>

        <div style={{ display: 'flex', marginTop: 40, fontSize: 22, color: '#6B6478', letterSpacing: 1 }}>
          fanuzu.co.kr
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts }
  );
}
