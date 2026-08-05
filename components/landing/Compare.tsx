'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Compare() {
  const { tr } = useLang();

  return (
    <section id="compare" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '100px 24px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto 44px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.3, fontWeight: 700, margin: 0, color: '#FFFAFC' }}>
          {tr.compare.t1}
          <br />
          {tr.compare.t2}
        </h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
        <div style={{ flex: '1 1 340px', maxWidth: 440, background: '#1A1720', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 20px', color: '#9089A0' }}>{tr.compare.oldT}</h3>
          {tr.compare.oldItems.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
              <span style={{ color: '#6B6478', fontSize: 14, lineHeight: 1.6 }}>–</span>
              <span style={{ fontSize: 14.5, lineHeight: 1.6, color: '#9089A0' }}>{it}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            flex: '1 1 340px',
            maxWidth: 440,
            background: 'linear-gradient(160deg,rgba(255,125,221,.18),rgba(155,124,255,.14))',
            border: '1px solid rgba(255,125,221,.32)',
            borderRadius: 20,
            padding: 32,
          }}
        >
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 20px', color: '#FFFAFC' }}>{tr.compare.newT}</h3>
          {tr.compare.newItems.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
              <span style={{ color: '#FF7DDD', fontSize: 14, lineHeight: 1.6 }}>✦</span>
              <span style={{ fontSize: 14.5, lineHeight: 1.6, color: '#FFFAFC' }}>{it}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
