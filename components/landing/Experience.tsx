'use client';

import Image from 'next/image';
import { useLang } from '@/components/providers/LangProvider';
import { STAGE1, STAGE2, useContribution } from '@/components/providers/ContributionProvider';

export default function Experience() {
  const { tr } = useLang();
  const { score, progressPct, glowBlur, glowSpread, glowOpacity, planetBrightness, addAction } = useContribution();

  const stageMessage =
    score === 0 ? tr.exp.stage0 : score < STAGE1 ? tr.exp.stage1 : score < STAGE2 ? tr.exp.stage2 : tr.exp.stage3;

  return (
    <section id="experience" style={{ position: 'relative', zIndex: 1, padding: '100px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ maxWidth: 640, margin: '0 auto 56px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.25, fontWeight: 700, margin: '0 0 18px', color: '#FFFAFC' }}>
            {tr.exp.t1}
            <br />
            {tr.exp.t2}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 4px' }}>{tr.exp.d1}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.exp.d2}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: 44, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 340px', minWidth: 280, maxWidth: 420 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
              {tr.exp.buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={addAction(btn.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,.05)',
                    border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 14,
                    padding: '16px 20px',
                    color: '#FFFAFC',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{btn.label}</span>
                  <span style={{ color: '#7CE8FF', fontWeight: 700, fontSize: 14 }}>+POP</span>
                </button>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#B8AFC4', marginBottom: 10 }}>
                <span>{tr.exp.scoreLabel}</span>
                <span style={{ color: '#FFFAFC', fontWeight: 700 }}>{score}</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg,#FF7DDD,#9B7CFF,#7CE8FF)',
                    borderRadius: 999,
                    transition: 'width .6s ease',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <div style={{ position: 'relative', width: 'min(60vw,300px)', aspectRatio: '1/1' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-20%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle,rgba(255,125,221,.4),rgba(155,124,255,.2) 45%,transparent 70%)',
                  animation: 'floatY 7s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: '6%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: `0 0 ${glowBlur}px ${glowSpread}px rgba(255,125,221,${glowOpacity}),0 0 70px 8px rgba(155,124,255,.25)`,
                  animation: 'floatY 7s ease-in-out infinite',
                  filter: `brightness(${planetBrightness})`,
                }}
              >
                <Image src="/images/fanuzu-planet.png" alt="FANUZU planet" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <p
              style={{
                textAlign: 'center',
                fontSize: 14.5,
                lineHeight: 1.6,
                color: '#B8AFC4',
                maxWidth: 320,
                whiteSpace: 'pre-line',
                minHeight: 66,
              }}
            >
              {stageMessage}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
