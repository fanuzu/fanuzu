'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Campaign() {
  const { tr } = useLang();
  // Plain emoji rather than a custom icon font/SVG set — after this
  // session's two font-coverage incidents (Black Han Sans' missing
  // glyphs, then a stale color fallback), emoji glyphs are rendered by
  // the OS/browser's own emoji font, so there's no subset-coverage risk
  // to re-verify here.
  const steps = [
    { label: tr.campaign.s1l, title: tr.campaign.s1t, desc: tr.campaign.s1d, icon: '✨' },
    { label: tr.campaign.s2l, title: tr.campaign.s2t, desc: tr.campaign.s2d, icon: '🪐' },
    { label: tr.campaign.s3l, title: tr.campaign.s3t, desc: tr.campaign.s3d, icon: '📣' },
  ];

  return (
    <section id="campaign" style={{ position: 'relative', zIndex: 1, background: '#171827', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ maxWidth: 680, margin: '0 auto 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: '.06em', color: '#9675F5', marginBottom: 14 }}>{tr.campaign.tagline}</div>
          <h2 className="headline-font" style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 16px', color: '#F5F3FF' }}>
            {tr.campaign.t1}
            <br />
            {tr.campaign.t2}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 6px' }}>{tr.campaign.lead}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.campaign.d2}</p>
        </div>

        {/* A numbered stepper (big filled circle + connecting line) instead
            of equal-weight boxes with a thin arrow — the old layout gave the
            step number the same visual weight as everything else, so the
            "this is a 3-step process" structure didn't register at a
            glance. The circle+line reads as a sequence regardless of
            viewport width, with no responsive layout switch needed. */}
        <div style={{ maxWidth: 480, margin: '56px auto 36px' }}>
          {steps.map((st, i) => (
            <div key={i} style={{ display: 'flex', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#FF7DDD,#9675F5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#080914',
                    flex: '0 0 auto',
                    boxShadow: '0 8px 24px rgba(255,125,221,.3)',
                  }}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 40,
                      margin: '8px 0',
                      background: 'linear-gradient(180deg,rgba(255,125,221,.5),rgba(150,117,245,.15))',
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em', color: '#9675F5', marginBottom: 6 }}>{st.label}</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px', color: '#F5F3FF', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 19 }}>{st.icon}</span>
                  {st.title}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#B8AFC4', margin: 0 }}>{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto 36px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: '.06em', color: '#9675F5', marginBottom: 14 }}>
            {tr.campaign.examplesLabel}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', justifyContent: 'center', marginBottom: 14 }}>
            {tr.campaign.examples.map((ex, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: '#B8AFC4' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#9675F5' }} />
                {ex}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12.5, lineHeight: 1.6, color: '#6B6478', margin: 0 }}>{tr.campaign.popNote}</p>
        </div>
      </div>
    </section>
  );
}
