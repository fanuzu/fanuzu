'use client';

import { useEffect, useRef, useState } from 'react';
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

const PLANET_IDS = ['hero-planet-visual', 'experience-planet-visual'];
const BUTTON_SIZE = 68;
// How far down the planet's own height to anchor the button's center — near
// its bottom edge, not fully below it. Anchoring inside the planet's own
// bounds (rather than requiring empty space beneath it) is what guarantees
// "never above the planet": whenever the planet is on screen at all, this
// point is too, regardless of how little room a short viewport leaves below
// the planet's actual bottom edge.
const BOTTOM_ANCHOR_FRACTION = 0.94;

// Picks whichever tracked planet is currently nearest the viewport center
// and returns the button's center `top` (px), anchored near that planet's
// bottom edge. Falls back to vertical-center when no planet is on screen.
function computeCenterYPx(): number {
  const viewportH = window.innerHeight;
  let best: { top: number; height: number; distanceToCenter: number } | null = null;

  for (const id of PLANET_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= viewportH) continue; // not on screen
    const center = rect.top + rect.height / 2;
    const distanceToCenter = Math.abs(center - viewportH / 2);
    if (!best || distanceToCenter < best.distanceToCenter) {
      best = { top: rect.top, height: rect.height, distanceToCenter };
    }
  }

  if (!best) return viewportH / 2;
  return best.top + best.height * BOTTOM_ANCHOR_FRACTION;
}

export default function ZapButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { zapFromPoint } = useContribution();
  const { isOpen: preregModalOpen } = usePreregModal();
  const [centerY, setCenterY] = useState<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCenterY(computeCenterYPx()));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

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

  // Nothing measured yet (first paint) — skip rendering rather than flash
  // at a wrong position for one frame.
  if (preregModalOpen || centerY === null) return null;

  return (
    <button
      ref={btnRef}
      onClick={handleZap}
      aria-label="ZAP"
      style={{
        position: 'fixed',
        left: '50%',
        top: centerY,
        transform: 'translate(-50%, -50%)',
        zIndex: 150,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
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
        transition: 'top .25s ease',
      }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>⚡</span>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.04em' }}>ZAP</span>
    </button>
  );
}
