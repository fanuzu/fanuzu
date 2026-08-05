'use client';

import { useLang } from '@/components/providers/LangProvider';
import PlanetSwiper from './PlanetSwiper';

export default function Hero() {
  const { tr } = useLang();

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1180,
        margin: '0 auto',
        padding: '150px 24px 100px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 56,
      }}
    >
      <div style={{ flex: '1 1 460px', minWidth: 300 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: 8,
            background: 'rgba(255,125,221,.1)',
            border: '1px solid rgba(255,125,221,.3)',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12,
            letterSpacing: '.08em',
            color: '#FF7DDD',
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#FF7DDD',
              animation: 'pulseDot 2s ease-in-out infinite',
              marginTop: 4,
              flex: '0 0 auto',
            }}
          />
          {tr.hero.badge}
        </div>
        <p
          style={{
            fontSize: 'clamp(15px,1.8vw,18px)',
            lineHeight: 1.5,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: '#9089A0',
            margin: '0 0 14px',
          }}
        >
          {tr.hero.t1} {tr.hero.t2} {tr.hero.t3}
        </p>
        <h1
          style={{
            fontSize: 'clamp(36px,6vw,64px)',
            lineHeight: 1.12,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 22px',
          }}
        >
          <span style={{ color: '#FFFAFC' }}>{tr.hero.mainT1}</span>
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
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#B8AFC4', maxWidth: 480, margin: '0 0 30px' }}>
          {tr.hero.serviceLine1} {tr.hero.serviceLine2}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 10px', marginBottom: 30 }}>
          {tr.hero.flow.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px 10px' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.14)',
                  borderRadius: 999,
                  padding: '7px 14px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#FFFAFC',
                }}
              >
                {step}
              </div>
              {i < tr.hero.flow.length - 1 && <span style={{ color: '#6B6478', fontSize: 13 }}>→</span>}
            </div>
          ))}
        </div>
        <a
          href="#experience"
          style={{
            background: 'linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
            color: '#05030B',
            fontWeight: 700,
            fontSize: 16,
            padding: '15px 28px',
            borderRadius: 999,
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
          }}
        >
          {tr.hero.ctaPrimary}
        </a>
        <p style={{ fontSize: 12.5, letterSpacing: '.04em', color: '#6B6478', margin: '18px 0 0' }}>{tr.hero.brandLine}</p>
      </div>

      <div style={{ flex: '1 1 380px', minWidth: 280, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <PlanetSwiper>
          <div
            style={{
              position: 'absolute',
              left: '-8%',
              bottom: '2%',
              background: 'rgba(10,6,19,.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 16,
              padding: '14px 18px',
              minWidth: 150,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFAFC' }}>{tr.hero.statNumber}</div>
            <div style={{ fontSize: 12, color: '#B8AFC4', marginTop: 2 }}>{tr.hero.statLabel}</div>
            <div style={{ fontSize: 10.5, color: '#6B6478', marginTop: 6, maxWidth: 170, lineHeight: 1.4 }}>{tr.hero.statSub}</div>
          </div>
        </PlanetSwiper>
      </div>
    </section>
  );
}
