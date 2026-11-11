'use client';

import { useEffect, useState } from 'react';

const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface Flake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

function buildFlakes(): Flake[] {
  return Array.from({ length: 46 }, (_, i) => ({
    id: i,
    left: rand(i * 3.1) * 100,
    size: 5 + rand(i * 5.7) * 8,
    duration: 9 + rand(i * 2.3) * 10,
    delay: rand(i * 7.9) * 12,
    drift: 14 + rand(i * 4.4) * 26,
    opacity: 0.5 + rand(i * 6.6) * 0.45,
  }));
}

// Light seasonal touch (doc: "가벼운 시즌 연출") — same client-only,
// seeded-random pattern as StarField/MeteorShower so it never risks a
// hydration mismatch for a purely decorative layer. Meant to be easy to
// pull back out after the season: it's one component, one mount line in
// LandingPage.tsx, and one @keyframes block in globals.css.
export default function SnowFall() {
  const [flakes, setFlakes] = useState<Flake[] | null>(null);

  useEffect(() => {
    setFlakes(buildFlakes());
  }, []);

  if (!flakes) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {flakes.map((f) => (
        <div
          key={f.id}
          style={{
            position: 'absolute',
            top: -20,
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFFFFF, #CFE8FF)',
            opacity: f.opacity,
            boxShadow: '0 0 6px 2px rgba(207,232,255,.65)',
            ['--drift' as string]: `${f.drift}px`,
            animation: `snowFall ${f.duration}s linear infinite`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
