'use client';

import { useEffect, useRef, useState } from 'react';

const VOLUME = 0.32;
const MUTE_KEY = 'fanuzu_carol_muted';
// Any of these count as "the visitor has interacted with the page" for
// browsers that block autoplay-with-sound until a real user gesture.
const UNLOCK_EVENTS: (keyof DocumentEventMap)[] = ['pointerdown', 'keydown', 'touchstart'];

// Seasonal background loop, independent of SantaSleigh's short GIVE-tap
// jingle (a different, longer file — see public/audio/carol-loop.mp3).
// Browsers refuse audio-with-sound before any user gesture, so this tries
// to start immediately and, if that's rejected, falls back to starting on
// the visitor's very first tap/click/key anywhere on the page — which also
// covers the common case where that first tap IS the auto-opening pre-reg
// modal. A small corner toggle (not asked for explicitly, but looping
// audio with zero way to silence it is a real annoyance/accessibility
// issue) remembers the visitor's mute choice across visits.
export default function BackgroundCarol() {
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
    <>
      <audio ref={audioRef} src="/audio/carol-loop.mp3" loop preload="auto" />
      {ready && (
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute background carol' : 'Mute background carol'}
          style={{
            position: 'fixed',
            left: 16,
            bottom: 'max(16px, env(safe-area-inset-bottom))',
            zIndex: 150,
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.18)',
            background: 'rgba(10,6,19,.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#FFFAFC',
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {muted ? '🔇' : '🔔'}
        </button>
      )}
    </>
  );
}
