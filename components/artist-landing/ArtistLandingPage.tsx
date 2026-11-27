import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import type { ArtistLandingData } from '@/lib/artist-registry';
import { ARTIST_LANDING_COPY } from '@/lib/artist-landing-copy';
import AppOrPreregCta from '@/components/landing/AppOrPreregCta';

// Deliberately NOT the full LandingPage component tree (doc: "검색 유입 및
// 앱 설치 전환을 위한 랜딩페이지로만 구현") — a focused, lightweight,
// server-rendered page: artist identity, why FANUZU, one CTA. No
// providers, no interactive planet/contribution mechanics; those stay
// exclusively in the app and the main pre-registration flow.
export default function ArtistLandingPage({
  lang,
  data,
  homeHref,
}: {
  lang: Lang;
  data: ArtistLandingData;
  homeHref: string;
}) {
  const copy = ARTIST_LANDING_COPY[lang];
  const { artist, badge, progress } = data;
  const preregHref = `${homeHref}?artist=${encodeURIComponent(artist.artistName)}&utm_source=seo&utm_medium=artist_page`;

  return (
    <main style={{ minHeight: '100vh', background: '#080914', color: '#F5F3FF', fontFamily: 'Pretendard,Inter,system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 100px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, letterSpacing: '.12em', color: '#FF7DDD', fontWeight: 700, marginBottom: 16 }}>{copy.eyebrow}</div>

        {badge.heroImageUrl && (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 20, overflow: 'hidden', marginBottom: 32 }}>
            <Image src={badge.heroImageUrl} alt="" fill sizes="640px" style={{ objectFit: 'cover' }} />
          </div>
        )}

        <h1 className="headline-font" style={{ fontSize: 'clamp(28px,5vw,40px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 18px' }}>
          {copy.h1(artist.artistName)}
        </h1>

        {badge.isOfficial && (
          <span
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 700,
              color: '#080914',
              background: 'linear-gradient(135deg,#FF7DDD,#9675F5)',
              borderRadius: 999,
              padding: '5px 14px',
              marginBottom: 18,
            }}
          >
            {copy.officialBadge}
          </span>
        )}

        <p style={{ fontSize: 15.5, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 36px' }}>{copy.intro(artist.artistName)}</p>

        {progress && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.08)', overflow: 'hidden', marginBottom: 10 }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.round((progress.count / progress.goal) * 100))}%`,
                  background: 'linear-gradient(90deg,#FF7DDD,#9675F5)',
                  borderRadius: 999,
                }}
              />
            </div>
            <p style={{ fontSize: 13, color: '#9675F5', fontWeight: 600, margin: 0 }}>{copy.progressLabel(progress.count, progress.goal)}</p>
          </div>
        )}

        <AppOrPreregCta
          target={{ kind: 'artist', slug: artist.slug.replace(/\s+/g, '-') }}
          preregHref={preregHref}
          preLaunchLabel={copy.ctaPreLaunch}
          postLaunchLabel={copy.ctaPostLaunch}
        />

        <div style={{ marginTop: 40 }}>
          <a href={homeHref} style={{ fontSize: 13, color: '#6B6478', textDecoration: 'none' }}>
            FANUZU →
          </a>
        </div>
      </div>
    </main>
  );
}
