'use client';

import { useEffect, useState } from 'react';

const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface Star {
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
}

function buildStars(): Star[] {
  return Array.from({ length: 60 }, (_, i) => ({
    x: rand(i * 3.1) * 100,
    y: rand(i * 7.7) * 100,
    size: 1 + rand(i * 2.3) * 2,
    dur: 2 + rand(i * 5.5) * 3,
    delay: rand(i * 1.9) * 4,
  }));
}

export default function StarField() {
  // Math.sin's low-order bits can differ between the server's V8 build and
  // the browser's, so seeding this on the server risks a hydration
  // mismatch. It's purely decorative, so build it client-side only.
  const [stars, setStars] = useState<Star[] | null>(null);

  useEffect(() => {
    setStars(buildStars());
  }, []);

  if (!stars) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: '#FFFAFC',
            borderRadius: '50%',
            opacity: 0.5,
            animation: `twinkle ${star.dur}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
