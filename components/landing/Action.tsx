'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Action() {
  const { tr } = useLang();

  return (
    <section id="action" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '100px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(30px,4.4vw,44px)', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 20px' }}>
          <span style={{ color: '#FFFAFC' }}>{tr.action.t1}</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg,#FF7DDD,#9B7CFF)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {tr.action.t2}
          </span>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 8px' }}>{tr.action.d1}</p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.action.d2}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '44px 0 20px' }}>
        {tr.action.icons.map((icon, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 999,
              padding: '10px 18px',
              fontSize: 14,
              color: '#FFFAFC',
            }}
          >
            <span style={{ fontSize: 16 }}>{icon.emoji}</span>
            {icon.label}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#6B6478', fontSize: 18, marginBottom: 8 }}>↓</div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <span
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
            color: '#05030B',
            fontWeight: 700,
            fontSize: 14,
            padding: '8px 20px',
            borderRadius: 999,
          }}
        >
          POP
        </span>
      </div>
      <p style={{ textAlign: 'center', fontSize: 'clamp(16px,2vw,19px)', fontWeight: 600, color: '#FFFAFC', margin: 0 }}>{tr.action.closing}</p>
    </section>
  );
}
