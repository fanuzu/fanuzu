'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';
import { useLang } from '@/components/providers/LangProvider';

const PREVIEW_IMAGES = [
  { src: '/images/app-preview-campaign.png' },
  { src: '/images/app-preview-inside.png' },
  { src: '/images/app-preview-nebula.png' },
  { src: '/images/app-preview-planet.png' },
];

const SPARKLES = [
  { top: '10%', left: '10%', size: 18, delay: 0 },
  { top: '16%', right: '8%', size: 14, delay: 0.4 },
  { top: '58%', left: '4%', size: 12, delay: 0.8 },
];

export default function AppPreviewOverlay() {
  const { previewVisible, previewFading, dismissPreview } = useContribution();
  const { tr } = useLang();
  const fading = previewFading;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!previewVisible) return null;

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.max(0, Math.min(PREVIEW_IMAGES.length - 1, i)));
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  };

  return (
    <div
      onClick={dismissPreview}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 170,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(10px,2.4vw,16px)',
        background: 'radial-gradient(circle at 50% 45%,rgba(155,124,255,.26),rgba(5,3,11,.78) 65%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity .3s ease',
        animation: fading ? undefined : 'previewBackdropIn .12s ease-out',
      }}
    >
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: 'left' in s ? s.left : undefined,
            right: 'right' in s ? s.right : undefined,
            fontSize: s.size,
            pointerEvents: 'none',
            animation: `sparkleTwinkle 2.2s ease-in-out ${s.delay}s infinite`,
          }}
        >
          ✨
        </span>
      ))}

      <button
        onClick={(e) => {
          e.stopPropagation();
          dismissPreview();
        }}
        aria-label={tr.nav.close}
        style={{
          position: 'absolute',
          top: 'max(18px, env(safe-area-inset-top))',
          right: 18,
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
          color: '#05030B',
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,.4), 0 0 16px rgba(255,125,221,.4)',
          zIndex: 5,
        }}
      >
        ×
      </button>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onClick={(e) => e.stopPropagation()}
        className="preview-carousel"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          width: 'clamp(190px,56vw,240px)',
          aspectRatio: '375/812',
          borderRadius: 28,
          cursor: 'grab',
          animation: fading ? undefined : 'previewPhoneIn .22s cubic-bezier(.22,.61,.36,1) both',
          transform: fading ? 'scale(.94) translateY(-16px)' : undefined,
          transition: fading ? 'transform .4s ease' : undefined,
        }}
      >
        {PREVIEW_IMAGES.map((p) => (
          <div
            key={p.src}
            style={{
              position: 'relative',
              flex: '0 0 100%',
              scrollSnapAlign: 'center',
              borderRadius: 28,
              overflow: 'hidden',
              border: '3px solid transparent',
              backgroundImage:
                'linear-gradient(#0a0714,#0a0714), linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 30px 70px rgba(0,0,0,.55), 0 0 50px 8px rgba(255,125,221,.32)',
            }}
          >
            <Image src={p.src} alt="FANUZU app preview" fill sizes="240px" style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          gap: 8,
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity .3s ease' : undefined,
        }}
      >
        {PREVIEW_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 4,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === activeIndex ? 'linear-gradient(90deg,var(--planet-a1),var(--planet-a2))' : 'rgba(255,255,255,.3)',
              transition: 'width .3s ease, background .3s ease',
            }}
          />
        ))}
      </div>

      <div
        className="gradient-text"
        style={{
          backgroundImage: 'linear-gradient(90deg,#FF7DDD,#9B7CFF)',
          maxWidth: 300,
          textAlign: 'center',
          fontSize: 16,
          fontWeight: 800,
          lineHeight: 1.5,
          padding: '0 24px',
          wordBreak: 'keep-all',
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity .3s ease' : undefined,
          animation: fading ? undefined : 'previewCaptionIn .3s ease-out .12s both',
        }}
      >
        ✨ {[tr.hero.previewCaption, tr.hero.previewCaptionInside, tr.hero.previewCaptionGrowth, tr.hero.previewCaptionGrowth][activeIndex]}
      </div>
    </div>
  );
}
