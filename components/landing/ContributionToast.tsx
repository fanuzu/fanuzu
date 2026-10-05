'use client';

import { useEffect, useRef, useState } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';
import { useLang } from '@/components/providers/LangProvider';

const VISIBLE_MS = 2600;
const PLANET_IDS = ['hero-planet-visual'];
// Anchored near the TOP of whichever planet is on screen — reads like a
// reaction bubble popping up off the planet, rather than a generic toast
// stuck to the edge of the viewport.
const TOP_ANCHOR_FRACTION = 0.1;
const FALLBACK_BOTTOM_GAP = 'calc(max(22px, env(safe-area-inset-bottom)) + 68px + 16px)';

// Picks whichever tracked planet is nearest the viewport center right now
// and returns a `top` (px) near its top edge. Returns null when no planet
// is on screen, so the caller can fall back to a fixed position instead.
function computeTopNearPlanet(): number | null {
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

  if (!best) return null;
  return best.top + best.height * TOP_ANCHOR_FRACTION;
}

// Fires a small "thanks, the planet grew" toast every time a contribution
// lands — from the in-section action buttons or the floating ZAP button
// alike — so every tap gets a response, not just a number ticking up.
// Cycles through a few variations in turn (rather than repeating the same
// line, or picking randomly and risking back-to-back repeats).
export default function ContributionToast() {
  const { toastNonce } = useContribution();
  const { tr } = useLang();
  const [visible, setVisible] = useState(false);
  const [topPx, setTopPx] = useState<number | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const isFirstRender = useRef(true);
  const messages = tr.exp.contributionToasts;
  const message = messages[(toastNonce - 1 + messages.length) % messages.length] ?? messages[0];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // ZAP scrolls to the planet before this fires (see ZapButton's
    // SCROLL_SETTLE_MS), so by the time the toast shows, the relevant
    // planet's position is already settled — safe to measure once here
    // rather than tracking continuously through the toast's brief life.
    setTopPx(computeTopNearPlanet());
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(hideTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastNonce]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        ...(topPx !== null ? { top: topPx } : { bottom: FALLBACK_BOTTOM_GAP }),
        transform: 'translate(-50%, -50%)',
        zIndex: 160,
        maxWidth: 'min(90vw, 380px)',
        background: 'rgba(10,6,19,.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,125,221,.35)',
        borderRadius: 999,
        padding: '12px 20px',
        boxShadow: '0 12px 32px rgba(0,0,0,.45)',
        color: '#FFFAFC',
        fontSize: 13.5,
        lineHeight: 1.4,
        textAlign: 'center',
        animation: 'toastIn .3s cubic-bezier(.22,.61,.36,1)',
      }}
    >
      {message}
    </div>
  );
}
