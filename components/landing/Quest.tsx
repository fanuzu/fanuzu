'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Quest() {
  const { tr } = useLang();

  return (
    <section id="quest" style={{ position: 'relative', zIndex: 1, background: '#0A0613', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ maxWidth: 640, margin: '0 auto 44px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 18px', color: '#FFFAFC' }}>
            {tr.quest.t1}
            <br />
            {tr.quest.t2}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.quest.body}</p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 12, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 14, textAlign: 'center' }}>
            {tr.quest.examplesLabel}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, marginBottom: 22 }}>
            {tr.quest.examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 14,
                  padding: '16px 18px',
                  fontSize: 14,
                  color: '#FFFAFC',
                }}
              >
                {ex}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12.5, lineHeight: 1.6, color: '#6B6478', margin: 0 }}>{tr.quest.popNote}</p>
        </div>
      </div>
    </section>
  );
}
