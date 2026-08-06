'use client';

import { useEffect, useState } from 'react';

const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface Meteor {
  id: number;
  top: number;
  left: number;
  angle: number;
  length: number;
  delay: number;
}

function buildMeteors(): Meteor[] {
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    top: rand(i * 4.7) * 35,
    left: rand(i * 2.9) * 85,
    angle: 28 + rand(i * 6.1) * 18,
    length: 90 + rand(i * 3.3) * 70,
    delay: rand(i * 8.3) * 0.7,
  }));
}

export default function MeteorShower() {
  // Client-only, same reasoning as StarField: Math.sin can drift a bit
  // between the server's and browser's float implementations, which would
  // otherwise risk a hydration mismatch for a purely decorative layer.
  const [meteors, setMeteors] = useState<Meteor[] | null>(null);

  useEffect(() => {
    setMeteors(buildMeteors());
  }, []);

  if (!meteors) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {meteors.map((m) => (
        <div
          key={m.id}
          style={{
            position: 'absolute',
            top: `${m.top}%`,
            left: `${m.left}%`,
            transform: `rotate(${m.angle}deg)`,
            transformOrigin: 'left center',
          }}
        >
          <div
            style={{
              width: m.length,
              height: 2,
              borderRadius: 999,
              background: 'linear-gradient(90deg, transparent, rgba(255,250,252,.5) 55%, #FFFAFC 88%, #FF7DDD)',
              boxShadow: '0 0 8px 1.5px rgba(255,255,255,.55)',
              animation: 'meteorStreak 2s linear infinite',
              animationDelay: `${m.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
