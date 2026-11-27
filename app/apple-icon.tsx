import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS requires a raster apple-touch-icon (no SVG support there, unlike
// app/icon.svg's browser-tab favicon). Same brand colors as icon.svg, but
// a plain monogram rather than trying to reproduce its sparkle glyph: an
// attempt built from two overlapping rotated divs rendered as a flat
// solid square — Satori (the renderer behind ImageResponse) needs
// `display: flex` on every element or layout silently collapses, and
// isn't a good fit for reproducing arbitrary SVG <path> art anyway. Text
// is Satori's reliable case, so a monogram is the robust choice here.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FF7DDD',
          borderRadius: 46,
        }}
      >
        <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, color: '#080914', fontFamily: 'sans-serif' }}>F</div>
      </div>
    ),
    size
  );
}
