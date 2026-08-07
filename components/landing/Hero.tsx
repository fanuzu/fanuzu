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
        <h1
          style={{
            fontSize: 'clamp(40px,6.4vw,72px)',
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 26px',
          }}
        >
          <span style={{ color: '#FFFAFC' }}>{tr.hero.t1}</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg,#FFFAFC,var(--planet-a1) 55%,var(--planet-a2))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
            }}
          >
            {tr.hero.t2}
          </span>
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
            {tr.hero.t3}
          </span>
        </h1>
        <p
          style={{
            fontSize: 'clamp(20px,2.6vw,24px)',
            lineHeight: 1.4,
            fontWeight: 800,
            letterSpacing: '-0.01em',
            background: 'linear-gradient(90deg,#FFFAFC,var(--planet-a1))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
            maxWidth: 520,
            margin: '0 0 22px',
          }}
        >
          {tr.hero.coreMessage}
        </p>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#B8AFC4', maxWidth: 520, margin: '0 0 14px' }}>{tr.hero.d1}</p>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#9089A0', maxWidth: 520, margin: '0 0 14px' }}>{tr.hero.d2}</p>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#9089A0', maxWidth: 520, margin: '0 0 34px' }}>{tr.hero.d3}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 30 }}>
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
          <a
            href="#prereg"
            style={{
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.16)',
              color: '#FFFAFC',
              fontWeight: 600,
              fontSize: 16,
              padding: '15px 28px',
              borderRadius: 999,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {tr.hero.ctaPrereg}
          </a>
          <a
            href="#why"
            style={{
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.16)',
              color: '#FFFAFC',
              fontWeight: 600,
              fontSize: 16,
              padding: '15px 28px',
              borderRadius: 999,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {tr.hero.ctaSecondary}
          </a>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px' }}>
          {tr.hero.sub.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#B8AFC4' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7CE8FF' }} />
              {s}
            </div>
          ))}
        </div>
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
