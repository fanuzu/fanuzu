'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

const VOLUME = 0.32;
const MUTE_KEY = 'fanuzu_carol_muted';
// Any of these count as "the visitor has interacted with the page" for
// browsers that block autoplay-with-sound until a real user gesture.
const UNLOCK_EVENTS: (keyof DocumentEventMap)[] = ['pointerdown', 'keydown', 'touchstart'];

interface CarolContextValue {
  muted: boolean;
  ready: boolean;
  toggleMute: () => void;
}

const CarolContext = createContext<CarolContextValue | null>(null);

// Seasonal background loop, independent of SantaSleigh's short GIVE-tap
// bell accent (a different, longer file — see public/audio/carol-loop.mp3).
// Deliberately not the same Jingle Bells recording as that accent: the two
// play simultaneously, and overlapping the same melody at a different
// offset read as a phasing glitch rather than an intentional sound effect.
// Browsers refuse audio-with-sound before any user gesture, so this tries
// to start immediately and, if that's rejected, falls back to starting on
// the visitor's very first tap/click/key anywhere on the page — which also
// covers the common case where that first tap IS the auto-opening pre-reg
// modal.
//
// The audio element itself lives here (mounted once for the page's whole
// life), but the mute toggle is rendered by Nav — a context provider
// rather than a single self-contained component so the control can live
// next to the language switcher instead of a hard-to-notice floating
// corner icon.
export function CarolProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let storedMuted = false;
    try {
      storedMuted = localStorage.getItem(MUTE_KEY) === '1';
    } catch {}
    setMuted(storedMuted);
    setReady(true);

    const audio = audioRef.current;
    if (!audio || storedMuted) return;

    const unlock = () => {
      audio.play().catch(() => {});
    };

    audio.volume = VOLUME;
    audio.play().catch(() => {
      UNLOCK_EVENTS.forEach((evt) => document.addEventListener(evt, unlock, { once: true }));
    });

    return () => {
      UNLOCK_EVENTS.forEach((evt) => document.removeEventListener(evt, unlock));
    };
  }, []);

  function toggleMute() {
    const audio = audioRef.current;
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    } catch {}
    if (!audio) return;
    if (next) {
      audio.pause();
    } else {
      audio.volume = VOLUME;
      audio.play().catch(() => {});
    }
  }

  return (
    <CarolContext.Provider value={{ muted, ready, toggleMute }}>
      {children}
      <audio ref={audioRef} src="/audio/carol-loop.mp3" loop preload="auto" />
    </CarolContext.Provider>
  );
}

export function useCarol(): CarolContextValue {
  const ctx = useContext(CarolContext);
  if (!ctx) throw new Error('useCarol must be used within a CarolProvider');
  return ctx;
}
