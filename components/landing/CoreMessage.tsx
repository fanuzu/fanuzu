'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function CoreMessage() {
  const { tr } = useLang();

  return (
    <section style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.25, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 16px' }}>
        <span style={{ color: '#FFFAFC' }}>{tr.hero.mainT1} </span>
        <span
          style={{
            background: 'linear-gradient(90deg,var(--planet-a1),var(--planet-a2))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
          }}
        >
          {tr.hero.mainT2}
        </span>
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#B8AFC4', margin: 0 }}>{tr.campaign.highlight}</p>
    </section>
  );
}
