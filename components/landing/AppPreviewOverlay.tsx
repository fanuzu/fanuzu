'use client';

import Image from 'next/image';
import { useContribution } from '@/components/providers/ContributionProvider';
import { useLang } from '@/components/providers/LangProvider';

const PREVIEW_IMAGES = [
  { src: '/images/app-preview-campaign.png', rotate: -7, delay: 0 },
  { src: '/images/app-preview-inside.png', rotate: 6, delay: 0.08 },
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
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(-28px,-4vw,-10px)',
        background: 'radial-gradient(circle at 50% 45%,rgba(155,124,255,.22),rgba(5,3,11,.72) 65%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity .4s ease',
        animation: fading ? undefined : 'previewBackdropIn .35s ease',
      }}
    >
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
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,.2)',
          background: 'rgba(255,255,255,.08)',
          color: '#FFFAFC',
          fontSize: 17,
          lineHeight: 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        ×
      </button>
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
              border: '3px solid rgba(255,255,255,.18)',
              boxShadow: '0 30px 70px rgba(0,0,0,.55), 0 0 50px 6px rgba(255,125,221,.28)',
              transform: fading ? 'scale(.94) translateY(-16px) rotate(var(--rotate))' : undefined,
              transition: fading ? 'transform .4s ease' : undefined,
              animation: fading ? undefined : `previewPhoneIn .5s cubic-bezier(.22,.61,.36,1) ${p.delay}s both`,
              zIndex: i,
              '--rotate': `${p.rotate}deg`,
            } as React.CSSProperties
          }
        >
          <Image src={p.src} alt="FANUZU app preview" fill sizes="220px" style={{ objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
}
