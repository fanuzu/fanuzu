'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Origin() {
  const { tr } = useLang();

  return (
    <section id="origin" style={{ position: 'relative', zIndex: 1, background: '#0A0613', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ maxWidth: 640, margin: '0 auto 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 14px', color: '#FFFAFC' }}>
            {tr.origin.t1}
            <br />
            {tr.origin.t2}
          </h2>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255,125,221,.1)',
              border: '1px solid rgba(255,125,221,.3)',
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '.06em',
              color: '#FF7DDD',
              marginBottom: 18,
            }}
          >
            {tr.origin.badge}
          </span>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.origin.d1}</p>
        </div>
        <p
          style={{
            textAlign: 'center',
            fontSize: 'clamp(17px,2.2vw,21px)',
            fontWeight: 600,
            lineHeight: 1.5,
            color: '#FF7DDD',
            maxWidth: 640,
            margin: '36px auto 40px',
          }}
        >
          {tr.origin.quote}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 36 }}>
          <div
            style={{
              flex: '1 1 260px',
              maxWidth: 320,
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(124,232,255,.3)',
              borderRadius: 16,
              padding: 22,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 8 }}>{tr.origin.founderLabel}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#B8AFC4' }}>{tr.origin.founderDesc}</div>
          </div>
          <div
            style={{
              flex: '1 1 260px',
              maxWidth: 320,
              background: 'rgba(255,125,221,.08)',
              border: '1px solid rgba(255,125,221,.4)',
              borderRadius: 16,
              padding: 22,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: '#FF7DDD', marginBottom: 8 }}>{tr.origin.originLabel}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#FFFAFC' }}>{tr.origin.originDesc}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 36 }}>
          {tr.origin.benefits.map((b, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 26 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 14px', color: '#FFFAFC' }}>{b.title}</h3>
              {b.items.map((bi, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ color: '#FF7DDD', fontSize: 12, lineHeight: 1.6 }}>✦</span>
                  <span style={{ fontSize: 13, lineHeight: 1.55, color: '#B8AFC4' }}>{bi}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, lineHeight: 1.6, color: '#6B6478', maxWidth: 600, margin: '0 auto 36px' }}>
          {tr.origin.note}
        </p>

        <div style={{ textAlign: 'center' }}>
          <a
            href="#prereg"
            style={{
              background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
              color: '#05030B',
              fontWeight: 700,
              fontSize: 15.5,
              padding: '15px 30px',
              borderRadius: 999,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {tr.origin.ctaLabel}
          </a>
          <p style={{ fontSize: 12.5, color: '#6B6478', margin: '14px 0 0' }}>{tr.origin.ctaSub}</p>
        </div>
      </div>
    </section>
  );
}
