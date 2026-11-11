'use client';

import { useEffect, useRef } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';

const FLIGHT_MS = 2200;
// Full turns the sleigh spirals through on its way from GIVE to the planet.
const TURNS = 2.4;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// One-shot seasonal payoff for the GIVE button specifically (see
// ContributionProvider's santaFlight — set only by zapFromPoint, not the
// in-section action buttons that also go through addAction), separate from
// the always-on SnowFall decoration. Driven by rAF rather than a CSS
// @keyframes because the path is different every tap: it has to start
// exactly at GIVE's on-screen position and spiral in on wherever the
// tracked planet currently is, both only known at click time.
export default function SantaSleigh() {
  const { santaFlight } = useContribution();
  const elRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isFirstRender = useRef(true);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!santaFlight) return;

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }

    const { fromX, fromY, toX, toY } = santaFlight;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.hypot(dx, dy);
    // Spiral radius scales with the actual GIVE-to-planet distance (wider
    // swing when the planet is far, tighter when it's close), clamped to a
    // sane range so it still reads as a spiral rather than a barely-curved
    // line or an absurdly wide loop.
    const maxRadius = Math.min(140, Math.max(36, distance * 0.22));
    // Orthonormal basis built from the straight-line path itself, so the
    // spiral is a clean circle around that line regardless of its angle —
    // dir runs along the path, perp runs sideways to it.
    const dirX = dx / (distance || 1);
    const dirY = dy / (distance || 1);
    const perpX = -dirY;
    const perpY = dirX;

    const el = elRef.current;
    const start = performance.now();

    function frame(now: number) {
      const t = Math.min(1, (now - start) / FLIGHT_MS);
      const eased = easeInOutCubic(t);
      const baseX = fromX + dx * eased;
      const baseY = fromY + dy * eased;
      const angle = eased * TURNS * Math.PI * 2;
      // Shrinks to 0 as t -> 1, so the loops tighten into a point right as
      // the sleigh reaches the planet instead of arriving off-center.
      const radius = maxRadius * (1 - eased);
      const offsetX = radius * (Math.cos(angle) * perpX + Math.sin(angle) * dirX);
      const offsetY = radius * (Math.cos(angle) * perpY + Math.sin(angle) * dirY);
      if (el) {
        el.style.transform = `translate(${baseX + offsetX}px, ${baseY + offsetY}px) scale(${1 - 0.35 * eased})`;
        el.style.opacity = t < 0.05 ? `${t / 0.05}` : t > 0.9 ? `${(1 - t) / 0.1}` : '1';
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [santaFlight]);

  return (
    <>
      <audio ref={audioRef} src="/audio/give-bell.mp3" preload="auto" style={{ display: 'none' }} />
      <div
        ref={elRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 200,
          pointerEvents: 'none',
          fontSize: 'clamp(24px,5vw,38px)',
          whiteSpace: 'nowrap',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      >
        🦌🛷🎅
      </div>
    </>
  );
}
