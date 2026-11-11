'use client';

import { useEffect, useRef, useState } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';

const FLIGHT_MS = 4200;

// One-shot seasonal payoff for the GIVE button specifically (see
// ContributionProvider's santaNonce — bumped only by zapFromPoint, not by
// the in-section action buttons), separate from the always-on SnowFall
// decoration. Same nonce-watch/timeout pattern as ContributionToast: skips
// the very first render (that's just the provider mounting, not a tap), and
// each new santaNonce restarts the flight even if one is already playing.
export default function SantaSleigh() {
  const { santaNonce } = useContribution();
  const [flying, setFlying] = useState(false);
  const isFirstRender = useRef(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setFlying(false);
    // Force the CSS animation to restart from its 0% keyframe even if a
    // flight is already mid-way through (rapid repeat taps on GIVE).
    requestAnimationFrame(() => setFlying(true));
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setFlying(false), FLIGHT_MS);

    // GIVE is a direct click, so this satisfies every browser's autoplay-
    // with-sound gesture requirement. Rewind first so a rapid repeat tap
    // restarts the jingle instead of being a no-op on an already-playing
    // <audio> element.
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.55;
      audio.play().catch(() => {});
    }

    return () => clearTimeout(hideTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [santaNonce]);

  return (
    <>
      <audio ref={audioRef} src="/audio/jingle.mp3" preload="auto" style={{ display: 'none' }} />
      {flying && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 200,
            pointerEvents: 'none',
            fontSize: 'clamp(28px,6vw,46px)',
            whiteSpace: 'nowrap',
            animation: `santaFly ${FLIGHT_MS}ms ease-in-out`,
          }}
        >
          🦌🛷🎅
        </div>
      )}
    </>
  );
}
