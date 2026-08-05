'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function FinalCta() {
  const { tr } = useLang();

  return (
    <section style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '80px 24px 100px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(26px,3.6vw,36px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 20px', color: '#FFFAFC' }}>
        {tr.hero.mainT1}
        <br />
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
      <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 700, letterSpacing: '.04em', color: '#FFFAFC', margin: '0 0 8px' }}>
        FANUZU
      </div>
      <p style={{ fontSize: 13, letterSpacing: '.04em', color: '#6B6478', margin: '0 0 32px' }}>{tr.hero.brandLine}</p>
      <a
        href="#prereg"
        style={{
          background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
          color: '#05030B',
          fontWeight: 700,
          fontSize: 15.5,
          padding: '15px 30px',
          borderRadius: 999,
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        {tr.hero.ctaPrimary}
      </a>
    </section>
  );
}
