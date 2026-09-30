'use client';

import Image from 'next/image';
import { useContribution } from '@/components/providers/ContributionProvider';
import { useLang } from '@/components/providers/LangProvider';

const PREVIEW_IMAGES = [
  { src: '/images/app-preview-campaign.png', rotate: -7, delay: 0 },
  { src: '/images/app-preview-inside.png', rotate: 6, delay: 0.03 },
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
  if (!previewVisible) return null;

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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 16px',
          borderRadius: 999,
          background: 'linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
          color: '#05030B',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '.03em',
          transform: 'rotate(-3deg)',
          boxShadow: '0 8px 22px rgba(0,0,0,.4), 0 0 20px rgba(255,125,221,.35)',
          animation: fading ? undefined : 'previewCaptionIn .28s ease-out both',
        }}
      >
        👀 REAL APP SCREENS
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(-28px,-4vw,-10px)' }}>
        {PREVIEW_IMAGES.map((p, i) => (
          <div
            key={p.src}
            style={
              {
                position: 'relative',
                width: 'clamp(150px,32vw,220px)',
                aspectRatio: '375/812',
                borderRadius: 28,
                overflow: 'hidden',
                border: '3px solid transparent',
                backgroundImage:
                  'linear-gradient(#0a0714,#0a0714), linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 30px 70px rgba(0,0,0,.55), 0 0 50px 8px rgba(255,125,221,.32)',
                transform: fading ? 'scale(.94) translateY(-16px) rotate(var(--rotate))' : undefined,
                transition: fading ? 'transform .4s ease' : undefined,
                animation: fading ? undefined : `previewPhoneIn .22s cubic-bezier(.22,.61,.36,1) ${p.delay}s both`,
                zIndex: i,
                '--rotate': `${p.rotate}deg`,
              } as React.CSSProperties
            }
          >
            <Image src={p.src} alt="FANUZU app preview" fill sizes="220px" style={{ objectFit: 'cover' }} />
          </div>
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
        ✨ {tr.hero.previewCaption}
      </div>
    </div>
  );
}
