'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

const VOLUME = 0.32;
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
// Playback requires an explicit click on the audio control.
//
// The audio element itself lives here (mounted once for the page's whole
// life), but the mute toggle is rendered by Nav — a context provider
// rather than a single self-contained component so the control can live
// next to the language switcher instead of a hard-to-notice floating
// corner icon.
export function CarolProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  function toggleMute() {
    const audio = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (!audio) return;
    if (next) {
      audio.pause();
    } else {
      audio.volume = VOLUME;
      audio.play().catch(() => setMuted(true));
    }
  }

  return (
    <CarolContext.Provider value={{ muted, ready, toggleMute }}>
      {children}
      <audio ref={audioRef} src="/audio/carol-loop.mp3" loop preload="none" />
    </CarolContext.Provider>
  );
}

export function useCarol(): CarolContextValue {
  const ctx = useContext(CarolContext);
  if (!ctx) throw new Error('useCarol must be used within a CarolProvider');
  return ctx;
}
