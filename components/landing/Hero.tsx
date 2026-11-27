'use client';

import { useLang } from '@/components/providers/LangProvider';
import { usePreregModal } from '@/components/providers/PreregModalProvider';
import { useContribution } from '@/components/providers/ContributionProvider';
import { useLiveActivity } from './useLiveActivity';
import PlanetSwiper from './PlanetSwiper';

const DEMO_COPY = {"ko":["체험용 POP","웹 체험용 수치이며 실제 적립되거나 지급되지 않습니다."],"en":["Demo POP","Simulated web experience only; no actual POP is earned or awarded."],"ja":["体験用POP","ウェブ体験用の数値で、実際には付与されません。"],"es":["POP de demostración","Simulación web: no se acumulan ni se otorgan POP reales."],"zhHans":["体验用 POP","仅用于网页体验，不会实际获得或发放 POP。"],"zhHant":["體驗用 POP","僅供網頁體驗，不會實際獲得或發放 POP。"],"id":["POP demo","Hanya simulasi web; tidak ada POP nyata yang diperoleh atau diberikan."],"fil":["Demo POP","Simulasyon lamang sa web; walang aktuwal na POP na makukuha."],"th":["POP สำหรับทดลอง","เป็นการจำลองบนเว็บเท่านั้น ไม่ได้รับ POP จริง"]};

export default function Hero() {
  const { tr, lang } = useLang();
  const { openModal } = usePreregModal();
  const { popCount } = useLiveActivity();
  // The ambient counter climbs on its own (other fans' activity); the
  // visitor's own POP from zapping/contributing stacks on top of it, so
  // tapping ZAP visibly moves this number instead of only affecting the
  // planet's glow.
  const { score, triggerPreview } = useContribution();
  const displayedPop = popCount + score;

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1180,
        margin: '0 auto',
        padding: 'clamp(104px,26vw,150px) 24px clamp(56px,10vw,100px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 56,
      }}
    >
      <div style={{ flex: '1 1 460px', minWidth: 300 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: 8,
            background: 'rgba(255,125,221,.1)',
            border: '1px solid rgba(255,125,221,.3)',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12,
            letterSpacing: '.08em',
            color: '#FF7DDD',
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#FF7DDD',
              animation: 'pulseDot 2s ease-in-out infinite',
              marginTop: 4,
              flex: '0 0 auto',
            }}
          />
          {tr.hero.badge}
        </div>
        <h1
          className="headline-font"
          style={{
            fontSize: 'clamp(40px,6.4vw,72px)',
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 26px',
          }}
        >
          <span style={{ color: '#F5F3FF' }}>{tr.hero.t1}</span>
          <br />
          <span
            className="gradient-text"
            style={{
              backgroundImage: 'linear-gradient(90deg,#F5F3FF,var(--planet-a1) 55%,var(--planet-a2))',
              transition: 'background-image 1.1s cubic-bezier(.22,.61,.36,1)',
            }}
          >
            {tr.hero.t2}
          </span>
          <br />
          <span
            className="gradient-text"
            style={{
              backgroundImage: 'linear-gradient(90deg,var(--planet-a1),var(--planet-a2))',
              transition: 'background-image 1.1s cubic-bezier(.22,.61,.36,1)',
            }}
          >
            {tr.hero.t3}
          </span>
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
          <button
            onClick={openModal}
            style={{
              background: 'linear-gradient(135deg,var(--planet-a1),var(--planet-a2))',
              color: '#080914',
              fontWeight: 700,
              fontSize: 17,
              padding: '16px 32px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-block',
              transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
            }}
          >
            {tr.hero.ctaPrereg}
          </button>
        </div>
        <p style={{ fontSize: 14, color: '#B8AFC4', lineHeight: 1.6, margin: '0 0 14px' }}>{tr.hero.subLead}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tr.hero.sub.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#9675F5', marginTop: 8, flex: '0 0 auto' }} />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#F5F3FF' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#B8AFC4', marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={triggerPreview}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            padding: 0,
            marginTop: 20,
            color: '#9675F5',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            textDecoration: 'underline',
          }}
        >
          {tr.hero.detailsCta} →
        </button>
      </div>

      <div style={{ flex: '1 1 380px', minWidth: 280, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <PlanetSwiper>
          <div
            style={{
              position: 'absolute',
              left: '-8%',
              bottom: '2%',
              background: 'rgba(23,24,39,.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 16,
              padding: '14px 18px',
              minWidth: 150,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#F5F3FF' }}>{displayedPop.toLocaleString()} POP</div>
            <div style={{ fontSize: 12, color: '#B8AFC4', marginTop: 2 }}>{DEMO_COPY[lang][0]}</div>
            <div style={{ fontSize: 10.5, color: '#6B6478', marginTop: 6, maxWidth: 170, lineHeight: 1.4 }}>{DEMO_COPY[lang][1]}</div>
          </div>
        </PlanetSwiper>
      </div>
    </section>
  );
}
