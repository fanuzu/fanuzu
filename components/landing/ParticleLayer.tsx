'use client';

import { useContribution } from '@/components/providers/ContributionProvider';
import type { CSSProperties } from 'react';

export default function ParticleLayer() {
  const { particles } = useContribution();

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={
            {
              position: 'fixed',
              left: p.fromX,
              top: p.fromY,
              width: 10,
              height: 10,
              margin: -5,
              borderRadius: '50%',
              background: 'radial-gradient(circle,#FFFAFC,#FF7DDD 60%,transparent)',
              boxShadow: '0 0 16px 4px #FF7DDD',
              pointerEvents: 'none',
              zIndex: 9999,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              animation: 'particleTravel .9s ease forwards',
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
