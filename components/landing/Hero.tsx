'use client';

import { useLang } from '@/components/providers/LangProvider';
import { usePreregModal } from '@/components/providers/PreregModalProvider';
import { useLiveActivity } from './useLiveActivity';
import PlanetSwiper from './PlanetSwiper';

export default function Hero() {
  const { tr } = useLang();
  const { openModal } = usePreregModal();
  const { popCount } = useLiveActivity();

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1180,
        margin: '0 auto',
        padding: 'clamp(104px,26vw,150px) 24px clamp(56px,10vw,100px)',
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
          <button
            onClick={openModal}
            style={{
              background: 'linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
              color: '#05030B',
              fontWeight: 700,
              fontSize: 17,
              padding: '16px 32px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-block',
              transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
            }}
          >
            {tr.hero.ctaPrereg}
          </button>
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
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFAFC' }}>{popCount.toLocaleString()} POP</div>
            <div style={{ fontSize: 12, color: '#B8AFC4', marginTop: 2 }}>{tr.hero.statLabel}</div>
            <div style={{ fontSize: 10.5, color: '#6B6478', marginTop: 6, maxWidth: 170, lineHeight: 1.4 }}>{tr.hero.statSub}</div>
          </div>
        </PlanetSwiper>
      </div>
    </section>
  );
}
