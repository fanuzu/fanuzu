'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function PopIntro() {
  const { tr } = useLang();
  const steps = tr.pop.steps;

  return (
    <section style={{ position: 'relative', zIndex: 1, background: '#0A0613', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 44, alignItems: 'center' }}>
          <div style={{ flex: '1 1 420px', minWidth: 280 }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.25, fontWeight: 700, margin: '0 0 20px', color: '#FFFAFC' }}>
              {tr.pop.t1}
              <br />
              {tr.pop.t2}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 6px' }}>{tr.pop.d1}</p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 26px' }}>{tr.pop.d2}</p>
            <div
              style={{
                background: 'linear-gradient(135deg,rgba(255,125,221,.14),rgba(155,124,255,.1))',
                border: '1px solid rgba(255,125,221,.22)',
                borderRadius: 16,
                padding: '20px 24px',
              }}
            >
              <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, margin: 0, color: '#FFFAFC' }}>{tr.pop.highlight}</p>
            </div>
          </div>
          <div style={{ flex: '1 1 380px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((ps, i) => (
              <div key={i}>
                <div
                  style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: 14,
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#FFFAFC', marginBottom: 6 }}>{ps.t}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: '#B8AFC4' }}>{ps.d}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ textAlign: 'center', color: '#FF7DDD', fontSize: 16, padding: '6px 0' }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
