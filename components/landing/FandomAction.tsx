'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function FandomAction() {
  const { tr } = useLang();
  const flow = tr.fandomAction.flow;

  return (
    <section id="fandom-action" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '100px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto 36px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 20px', color: '#FFFAFC' }}>
          {tr.fandomAction.t1}
          <br />
          {tr.fandomAction.t2}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 10px' }}>{tr.fandomAction.lead}</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.fandomAction.body}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 36 }}>
        {flow.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                background: 'rgba(255,125,221,.1)',
                border: '1px solid rgba(255,125,221,.3)',
                borderRadius: 999,
                padding: '9px 18px',
                fontSize: 13,
                color: '#FFFAFC',
              }}
            >
              {label}
            </div>
            {i < flow.length - 1 && <span style={{ color: '#B8AFC4' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 14 }}>{tr.fandomAction.examplesLabel}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', justifyContent: 'center' }}>
          {tr.fandomAction.examples.map((ex, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: '#B8AFC4' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7CE8FF' }} />
              {ex}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
