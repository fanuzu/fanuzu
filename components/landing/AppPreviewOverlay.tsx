'use client';

import Image from 'next/image';
import { useContribution } from '@/components/providers/ContributionProvider';

const PREVIEW_IMAGES = [
  { src: '/images/app-preview-campaign.png', rotate: -7, delay: 0 },
  { src: '/images/app-preview-inside.png', rotate: 6, delay: 0.08 },
];

export default function AppPreviewOverlay() {
  const { previewVisible, previewFading, dismissPreview } = useContribution();
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
