'use client';

import Image from 'next/image';
import { useLang } from '@/components/providers/LangProvider';
import { STAGE1, STAGE2, useContribution, usePlanetReactionPulse } from '@/components/providers/ContributionProvider';

const DEMO_COPY = {"ko":["체험용 POP","웹 체험용 수치이며 실제 적립되거나 지급되지 않습니다."],"en":["Demo POP","Simulated web experience only; no actual POP is earned or awarded."],"ja":["体験用POP","ウェブ体験用の数値で、実際には付与されません。"],"es":["POP de demostración","Simulación web: no se acumulan ni se otorgan POP reales."],"zhHans":["体验用 POP","仅用于网页体验，不会实际获得或发放 POP。"],"zhHant":["體驗用 POP","僅供網頁體驗，不會實際獲得或發放 POP。"],"id":["POP demo","Hanya simulasi web; tidak ada POP nyata yang diperoleh atau diberikan."],"fil":["Demo POP","Simulasyon lamang sa web; walang aktuwal na POP na makukuha."],"th":["POP สำหรับทดลอง","เป็นการจำลองบนเว็บเท่านั้น ไม่ได้รับ POP จริง"]};

export default function Experience() {
  const { tr, lang } = useLang();
  const { score, progressPct, addAction } = useContribution();
  // Bumping this keeps the shared planet-pulse timer in sync even though
  // this section no longer renders its own planet image — Hero's planet
  // (just above, now that the sections between them were merged away) is
  // what visually reacts, so showing a second full planet here read as a
  // duplicate/bug rather than a second signal.
  usePlanetReactionPulse();

  const stageMessage =
    score === 0 ? tr.exp.stage0 : score < STAGE1 ? tr.exp.stage1 : score < STAGE2 ? tr.exp.stage2 : tr.exp.stage3;

  return (
    <section id="experience" style={{ position: 'relative', zIndex: 1, padding: '72px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(255,125,221,.22)',
            boxShadow: '0 20px 50px rgba(0,0,0,.4)',
            marginBottom: 40,
          }}
        >
          <Image src="/images/experience-totalpush.webp" alt="" fill sizes="640px" style={{ objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg,transparent 40%,rgba(8,9,20,.85) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <div style={{ maxWidth: 640, margin: '0 auto 40px', textAlign: 'center' }}>
          <h2 className="headline-font" style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.25, fontWeight: 700, margin: '0 0 18px', color: '#F5F3FF' }}>
            {tr.exp.t1}
            <br />
            {tr.exp.t2}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 4px' }}>{tr.exp.d1}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.exp.d2}</p>
        </div>
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
                color: '#F5F3FF',
                fontSize: 15,
                fontFamily: 'inherit',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{btn.label}</span>
              <span style={{ color: '#9675F5', fontWeight: 700, fontSize: 14 }}>+POP</span>
            </button>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(160deg,rgba(255,125,221,.08),rgba(150,117,245,.03))', border: '1px solid rgba(255,125,221,.18)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#B8AFC4', marginBottom: 10 }}>
            <span>{DEMO_COPY[lang][0]}</span>
            <span style={{ color: '#F5F3FF', fontWeight: 700 }}>{score}</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg,#FF7DDD,#9675F5)',
                borderRadius: 999,
                transition: 'width .6s ease',
              }}
            />
          </div>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.5, color: '#B8AFC4', textAlign: 'center' }}>{DEMO_COPY[lang][1]}</p>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#9675F5', fontWeight: 600, marginTop: 14, marginBottom: 0, textAlign: 'center' }}>{tr.exp.highlight}</p>
        <p
          style={{
            textAlign: 'center',
            fontSize: 14.5,
            lineHeight: 1.6,
            color: '#B8AFC4',
            maxWidth: 420,
            margin: '20px auto 0',
            whiteSpace: 'pre-line',
            minHeight: 44,
          }}
        >
          {stageMessage}
        </p>
      </div>
    </section>
  );
}
