'use client';

import Image from 'next/image';
import { useLang } from '@/components/providers/LangProvider';

export default function Passport() {
  const { tr } = useLang();

  return (
    <section id="passport" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '100px 24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 52, alignItems: 'center' }}>
        <div style={{ flex: '1 1 420px', minWidth: 280 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.25, fontWeight: 700, margin: '0 0 20px', color: '#FFFAFC' }}>
            {tr.passport.t1}
            <br />
            {tr.passport.t2}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 6px' }}>{tr.passport.d1}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 6px' }}>{tr.passport.d2}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.passport.d3}</p>
        </div>
        <div style={{ flex: '1 1 380px', minWidth: 300, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              background: 'linear-gradient(155deg,#241736,#0A0613 60%)',
              border: '1.5px solid rgba(255,125,221,.4)',
              borderRadius: 14,
              padding: 0,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(155,124,255,.18)',
              animation: 'passportGlow 1s ease-in-out infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.02) 3px,rgba(255,255,255,.02) 4px)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'absolute', inset: 10, border: '1px dashed rgba(255,255,255,.18)', borderRadius: 8, pointerEvents: 'none' }} />
            <div style={{ padding: '26px 24px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,.12)' }}>
              <div style={{ fontSize: 10, letterSpacing: '.25em', color: '#B8AFC4', marginBottom: 6 }}>{tr.passport.cardLabel}</div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 700, color: '#FFFAFC', letterSpacing: '.04em' }}>FANUZU</div>
            </div>
            <div style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 6,
                    overflow: 'hidden',
                    flex: '0 0 auto',
                    border: '1px solid rgba(255,255,255,.25)',
                    position: 'relative',
                  }}
                >
                  <Image src="/images/fanuzu-planet.png" alt="planet" fill sizes="52px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFAFC', fontFamily: 'Georgia,serif' }}>{tr.passport.nickname}</div>
                  <div style={{ fontSize: 11, color: '#B8AFC4', letterSpacing: '.05em' }}>{tr.passport.planet}</div>
                </div>
                <div
                  style={{
                    marginLeft: 'auto',
                    transform: 'rotate(-14deg)',
                    border: '2px solid rgba(255,125,221,.7)',
                    color: '#FF7DDD',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: '.05em',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    flex: '0 0 auto',
                  }}
                >
                  {tr.passport.originTag}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px 16px',
                  marginBottom: 18,
                  fontFamily: "'Courier New',monospace",
                }}
              >
                {tr.passport.fields.map((pf, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 9, color: '#6B6478' }}>{pf.k}</div>
                    <div style={{ fontSize: 12.5, color: '#FFFAFC', fontWeight: 600 }}>{pf.v}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,.12)',
                  paddingTop: 14,
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  color: '#B8AFC4',
                  fontStyle: 'italic',
                  fontFamily: 'Georgia,serif',
                }}
              >
                {tr.passport.footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
