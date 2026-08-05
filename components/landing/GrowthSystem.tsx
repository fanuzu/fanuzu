'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function GrowthSystem() {
  const { tr } = useLang();
  const cards = [
    { t: tr.growth.c1t, d: tr.growth.c1d },
    { t: tr.growth.c2t, d: tr.growth.c2d },
    { t: tr.growth.c3t, d: tr.growth.c3d },
    { t: tr.growth.c4t, d: tr.growth.c4d },
  ];

  return (
    <section id="system" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '100px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto 56px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.3, fontWeight: 700, margin: 0, color: '#FFFAFC' }}>
          {tr.growth.t1}
          <br />
          {tr.growth.t2}
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 28 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                marginBottom: 18,
              }}
            />
            <h3 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 10px', color: '#FFFAFC' }}>{c.t}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: '#B8AFC4', margin: 0 }}>{c.d}</p>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 'clamp(16px,2vw,19px)', fontWeight: 600, lineHeight: 1.5, color: '#FFFAFC', maxWidth: 600, margin: '36px auto 0' }}>
        {tr.growth.bridge}
      </p>
    </section>
  );
}
