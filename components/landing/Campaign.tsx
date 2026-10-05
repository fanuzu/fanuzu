'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Campaign() {
  const { tr } = useLang();
  const steps = [
    { label: tr.campaign.s1l, title: tr.campaign.s1t, desc: tr.campaign.s1d, hasArrow: true },
    { label: tr.campaign.s2l, title: tr.campaign.s2t, desc: tr.campaign.s2d, hasArrow: true },
    { label: tr.campaign.s3l, title: tr.campaign.s3t, desc: tr.campaign.s3d, hasArrow: false },
  ];

  return (
    <section id="campaign" style={{ position: 'relative', zIndex: 1, background: '#0A0613', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ maxWidth: 680, margin: '0 auto 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 14 }}>{tr.campaign.tagline}</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 16px', color: '#FFFAFC' }}>
            {tr.campaign.t1}
            <br />
            {tr.campaign.t2}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 6px' }}>{tr.campaign.lead}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.campaign.d2}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: 16, justifyContent: 'center', margin: '56px 0 36px' }}>
          {steps.map((st, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  flex: '1 1 260px',
                  minWidth: 220,
                  maxWidth: 280,
                  background: 'linear-gradient(160deg,rgba(255,125,221,.08),rgba(155,124,255,.03))',
                  border: '1px solid rgba(255,125,221,.18)',
                  borderRadius: 18,
                  padding: 26,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 10 }}>{st.label}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 10px', color: '#FFFAFC' }}>{st.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#B8AFC4', margin: 0 }}>{st.desc}</p>
              </div>
              {st.hasArrow && <div style={{ color: '#FF7DDD', fontSize: 22, flex: '0 0 auto' }}>→</div>}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto 36px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 14 }}>
            {tr.campaign.examplesLabel}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', justifyContent: 'center', marginBottom: 14 }}>
            {tr.campaign.examples.map((ex, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: '#B8AFC4' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7CE8FF' }} />
                {ex}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12.5, lineHeight: 1.6, color: '#6B6478', margin: 0 }}>{tr.campaign.popNote}</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 'clamp(17px,2.2vw,21px)', fontWeight: 600, lineHeight: 1.5, color: '#FFFAFC', maxWidth: 640, margin: '0 auto 14px' }}>
          {tr.campaign.highlight}
        </p>
        <p style={{ textAlign: 'center', fontSize: 13.5, lineHeight: 1.6, color: '#B8AFC4', maxWidth: 560, margin: '0 auto 22px' }}>
          {tr.campaign.result}
        </p>
        <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, letterSpacing: '.01em', color: '#7CE8FF', maxWidth: 560, margin: '0 auto' }}>
          {tr.hero.coreMessage}
        </p>
      </div>
    </section>
  );
}
