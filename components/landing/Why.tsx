'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Why() {
  const { tr } = useLang();

  return (
    <section id="why" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '100px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto 56px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(30px,4.4vw,44px)', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 20px' }}>
          <span style={{ color: '#FFFAFC' }}>{tr.philosophy.t1}</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg,#FF7DDD,#9B7CFF)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {tr.philosophy.t2}
          </span>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 8px' }}>{tr.philosophy.d1}</p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.philosophy.d2}</p>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg,rgba(255,125,221,.14),rgba(155,124,255,.1))',
          border: '1px solid rgba(255,125,221,.22)',
          borderRadius: 24,
          padding: 44,
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 600, lineHeight: 1.4, margin: '0 0 16px', color: '#FFFAFC' }}>
          {tr.philosophy.big}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', maxWidth: 600, margin: '0 auto' }}>{tr.philosophy.bigSub}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 30 }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, margin: '0 0 12px', color: '#FFFAFC' }}>{tr.philosophy.card1T}</h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#B8AFC4', margin: 0 }}>{tr.philosophy.card1D}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 30 }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, margin: '0 0 12px', color: '#FFFAFC' }}>{tr.philosophy.card2T}</h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#B8AFC4', margin: 0 }}>{tr.philosophy.card2D}</p>
        </div>
      </div>
    </section>
  );
}
