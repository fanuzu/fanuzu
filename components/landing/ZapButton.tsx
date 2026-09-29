'use client';

import { useRef } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';
import { usePreregModal } from '@/components/providers/PreregModalProvider';

// The app's home screen has a floating ZAP button that sends POP straight
// into the planet. This is the web equivalent: since the planet only lives
// inside the Experience section (not next to this button), tapping it
// scrolls there first, then fires the same fly-to-planet particle the
// section's own action buttons use — landing right as the planet comes
// into view.
const ZAP_VALUE = 20;
const SCROLL_SETTLE_MS = 700;

export default function ZapButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { zapFromPoint } = useContribution();
  const { isOpen: preregModalOpen } = usePreregModal();

  function handleZap() {
    const experienceEl = document.getElementById('experience');
    experienceEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const rect = btnRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    window.setTimeout(() => {
      zapFromPoint(ZAP_VALUE, { x: originX, y: originY });
    }, SCROLL_SETTLE_MS);
  }

  if (preregModalOpen) return null;

  return (
    <button
      ref={btnRef}
      onClick={handleZap}
      aria-label="ZAP"
      style={{
        position: 'fixed',
        left: '50%',
        top: '58%',
        transform: 'translate(-50%, -50%)',
        zIndex: 150,
        width: 68,
        height: 68,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,.25)',
        background: 'linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        color: '#05030B',
        fontFamily: 'inherit',
        animation: 'zapPulse 2.4s ease-in-out infinite',
      }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>⚡</span>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.04em' }}>ZAP</span>
    </button>
  );
}
