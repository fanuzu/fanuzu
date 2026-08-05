'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function PopIntro() {
  const { tr } = useLang();

  return (
    <section style={{ position: 'relative', zIndex: 1, background: '#0A0613', padding: '100px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.25, fontWeight: 700, margin: '0 0 20px', color: '#FFFAFC' }}>
          {tr.pop.t1}
          <br />
          {tr.pop.t2}
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 40px' }}>{tr.pop.d1}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px 14px' }}>
          {tr.pop.flow.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px 14px' }}>
              <div
                style={{
                  background: 'rgba(255,125,221,.1)',
                  border: '1px solid rgba(255,125,221,.3)',
                  borderRadius: 999,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#FFFAFC',
                }}
              >
                {step}
              </div>
              {i < tr.pop.flow.length - 1 && <span style={{ color: '#B8AFC4', fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
