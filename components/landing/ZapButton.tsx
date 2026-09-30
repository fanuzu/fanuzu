'use client';

import { useEffect, useRef, useState } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';
import { usePreregModal } from '@/components/providers/PreregModalProvider';
import AppPreviewOverlay from './AppPreviewOverlay';

// The app's home screen has a floating ZAP button that sends POP straight
// into the planet. This is the web equivalent: the particle always flies
// toward the Hero planet specifically (that's the one wired to
// ContributionProvider's planetRef, via PlanetSwiper). Tapping ZAP scrolls
// that planet into view — not just to window scrollY 0, since on tall
// mobile layouts Hero's stacked content (badge/headline/CTA/bullets) is
// taller than one viewport, so scrolling to the literal top can leave the
// planet itself below the fold — then fires the same fly-to-planet
// particle the Experience section's own action buttons use, landing right
// as the planet comes into view. Kept at one fixed screen position
// regardless of scroll position, rather than tracking the planet —
// simpler and more predictable than a button that repositions itself as
// you scroll. Also flashes a quick app-screenshot preview on tap, as a
// taste of what "the planet" actually leads to in the real app.
const ZAP_VALUE = 20;
const SCROLL_SETTLE_MS = 700;
const PREVIEW_VISIBLE_MS = 3000;
const PREVIEW_FADE_MS = 400;

export default function ZapButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { zapFromPoint } = useContribution();
  const { isOpen: preregModalOpen } = usePreregModal();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFading, setPreviewFading] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const unmountTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(unmountTimer.current);
    };
  }, []);

  function dismissPreview() {
    clearTimeout(hideTimer.current);
    clearTimeout(unmountTimer.current);
    setPreviewFading(true);
    unmountTimer.current = setTimeout(() => {
      setPreviewVisible(false);
      setPreviewFading(false);
    }, PREVIEW_FADE_MS);
  }

  function handleZap() {
    const heroPlanet = document.getElementById('hero-planet-visual');
    if (heroPlanet) {
      heroPlanet.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const rect = btnRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    window.setTimeout(() => {
      zapFromPoint(ZAP_VALUE, { x: originX, y: originY });
    }, SCROLL_SETTLE_MS);

    clearTimeout(hideTimer.current);
    clearTimeout(unmountTimer.current);
    setPreviewFading(false);
    setPreviewVisible(true);
    hideTimer.current = setTimeout(dismissPreview, PREVIEW_VISIBLE_MS);
  }

  return (
    <>
      <AppPreviewOverlay visible={previewVisible} fading={previewFading} onDismiss={dismissPreview} />
      {!preregModalOpen && (
        <button
          ref={btnRef}
          onClick={handleZap}
          aria-label="ZAP"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 'max(22px, env(safe-area-inset-bottom))',
            transform: 'translateX(-50%)',
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
      )}
    </>
  );
}
