'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PLANETS, mixPlanetTheme } from '@/lib/planets';
import { usePlanetTheme } from '@/components/providers/PlanetThemeProvider';
import { ANTICIPATION_MS, STAGE2, useContribution, usePlanetReactionPulse } from '@/components/providers/ContributionProvider';
import { ZAP_VALUE } from './ZapButton';

const wrap = (n: number) => ((n % PLANETS.length) + PLANETS.length) % PLANETS.length;

// Shown for every carousel slide, regardless of which planet is selected,
// until score reaches STAGE2 — nothing is "formed" yet, so swiping between
// planets pre-upgrade shows the same unformed nebula everywhere rather than
// three different half-finished states we don't have art for.
const NEBULA_IMAGE = '/images/nebula.png';

const RING_RADIUS = 48;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const BURST_MS = 1500;
const SHOCKWAVE_DELAYS_MS = [0, 160, 320];

export default function PlanetSwiper({ children }: { children?: ReactNode }) {
  const { index, setIndex, setPreviewTheme } = usePlanetTheme();
  const {
    planetRef,
    glowBlur,
    glowSpread,
    glowOpacity,
    planetBrightness,
    score,
    planetCrossedNonce,
    planetUpgradedNonce,
    planetLocked,
  } = useContribution();
  const pulsing = usePlanetReactionPulse();

  const isUpgraded = score >= STAGE2;
  const formProgress = Math.min(1, score / STAGE2);
  // A ring alone doesn't tell anyone what to click or why it's moving — an
  // ambient progress indicator isn't instruction. Spelled out explicitly,
  // tied to GIVE by name, with a live count rather than a static line.
  const tapsRemaining = Math.max(0, Math.ceil((STAGE2 - score) / ZAP_VALUE));

  // The actual nebula -> planet image swap and all of its dependent UI
  // (ring, caption) wait for this rather than `isUpgraded` directly, so the
  // whole reveal lands together right after the anticipation beat instead
  // of the moment score technically crosses the threshold.
  const [revealed, setRevealed] = useState(isUpgraded);
  // A ref (not just the `revealed` value) because loadSlideImages is called
  // from long-lived pointer-event closures set up once in the mount effect
  // below (empty deps) — those closures would otherwise see whatever
  // `revealed` was at mount forever, never the current value.
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;

  // A short, loud animation right at the reveal — without this the nebula
  // just quietly became a planet, which read as "did something break?"
  // rather than a deliberate reveal.
  const [bursting, setBursting] = useState(false);
  // Shaky, flickering "charging up" state, from the instant score crosses
  // (planetCrossedNonce) until the delayed reveal actually lands
  // (planetUpgradedNonce, ANTICIPATION_MS later — see ContributionProvider)
  // — the stronger cue that something big is about to happen.
  const [anticipating, setAnticipating] = useState(false);
  const isFirstCrossRender = useRef(true);
  useEffect(() => {
    if (isFirstCrossRender.current) {
      isFirstCrossRender.current = false;
      return;
    }
    setAnticipating(true);
  }, [planetCrossedNonce]);

  const isFirstBurstRender = useRef(true);
  const burstTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (isFirstBurstRender.current) {
      isFirstBurstRender.current = false;
      return;
    }
    setAnticipating(false);
    setRevealed(true);
    loadSlideImages(indexRef.current);
    setBursting(true);
    clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setBursting(false), BURST_MS);
    return () => clearTimeout(burstTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planetUpgradedNonce]);

  const orbRef = useRef<HTMLDivElement | null>(null);
  const imgPrevRef = useRef<HTMLImageElement>(null);
  const imgCurRef = useRef<HTMLImageElement>(null);
  const imgNextRef = useRef<HTMLImageElement>(null);

  const indexRef = useRef(index);
  indexRef.current = index;
  const draggingRef = useRef(false);
  const settlingRef = useRef(false);
  const startXRef = useRef(0);
  const dragDxRef = useRef(0);
  const orbWidthRef = useRef(0);

  const setTransforms = (offset: number, withTransition: boolean) => {
    const t = withTransition ? 'transform .42s cubic-bezier(.22,.61,.36,1)' : 'none';
    const w = orbWidthRef.current;
    if (imgPrevRef.current) {
      imgPrevRef.current.style.transition = t;
      imgPrevRef.current.style.transform = `translateX(${-w + offset}px)`;
    }
    if (imgCurRef.current) {
      imgCurRef.current.style.transition = t;
      imgCurRef.current.style.transform = `translateX(${offset}px)`;
    }
    if (imgNextRef.current) {
      imgNextRef.current.style.transition = t;
      imgNextRef.current.style.transform = `translateX(${w + offset}px)`;
    }
  };

  const slideSrc = (i: number) => (revealedRef.current ? PLANETS[wrap(i)].image : NEBULA_IMAGE);

  const loadSlideImages = (i: number) => {
    if (imgPrevRef.current) imgPrevRef.current.src = slideSrc(i - 1);
    if (imgCurRef.current) imgCurRef.current.src = slideSrc(i);
    if (imgNextRef.current) imgNextRef.current.src = slideSrc(i + 1);
  };

  const commit = (direction: 1 | -1) => {
    settlingRef.current = true;
    const w = orbWidthRef.current;
    const finalOffset = direction > 0 ? -w : w;
    const target = wrap(indexRef.current + direction);
    setPreviewTheme(PLANETS[target]);
    setTransforms(finalOffset, true);
    const cur = imgCurRef.current;
    const onEnd = () => {
      cur?.removeEventListener('transitionend', onEnd);
      indexRef.current = target;
      loadSlideImages(target);
      setTransforms(0, false);
      setIndex(target);
      setPreviewTheme(null);
      settlingRef.current = false;
    };
    cur?.addEventListener('transitionend', onEnd);
  };

  const goTo = (direction: 1 | -1) => {
    if (settlingRef.current) return;
    orbWidthRef.current = orbRef.current?.clientWidth ?? 0;
    commit(direction);
  };

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    loadSlideImages(indexRef.current);
    orbWidthRef.current = orb.clientWidth;
    setTransforms(0, false);

    const onResize = () => {
      orbWidthRef.current = orb.clientWidth;
    };
    window.addEventListener('resize', onResize);

    const onPointerDown = (e: PointerEvent) => {
      if (settlingRef.current) return;
      draggingRef.current = true;
      startXRef.current = e.clientX;
      dragDxRef.current = 0;
      orbWidthRef.current = orb.clientWidth;
      orb.style.cursor = 'grabbing';
      orb.setPointerCapture(e.pointerId);
      setTransforms(0, false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const w = orbWidthRef.current || 1;
      const dx = e.clientX - startXRef.current;
      dragDxRef.current = dx;
      const damped = dx * (Math.abs(dx) > w ? 0.35 : 1);
      setTransforms(damped, false);
      const t = Math.max(-1, Math.min(1, -dx / w));
      const mix = Math.min(1, Math.abs(t));
      const basis = PLANETS[indexRef.current];
      const target = t > 0 ? PLANETS[wrap(indexRef.current + 1)] : t < 0 ? PLANETS[wrap(indexRef.current - 1)] : basis;
      setPreviewTheme(mix === 0 ? null : mixPlanetTheme(basis, target, mix));
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      orb.style.cursor = 'grab';
      const w = orbWidthRef.current || 1;
      const threshold = w * 0.22;
      const movedDx = Math.abs(dragDxRef.current);
      if (movedDx > threshold) {
        commit(dragDxRef.current < 0 ? 1 : -1);
      } else {
        setTransforms(0, true);
        setPreviewTheme(null);
      }
    };

    orb.addEventListener('pointerdown', onPointerDown);
    orb.addEventListener('pointermove', onPointerMove);
    orb.addEventListener('pointerup', endDrag);
    orb.addEventListener('pointercancel', endDrag);

    return () => {
      window.removeEventListener('resize', onResize);
      orb.removeEventListener('pointerdown', onPointerDown);
      orb.removeEventListener('pointermove', onPointerMove);
      orb.removeEventListener('pointerup', endDrag);
      orb.removeEventListener('pointercancel', endDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const planet = PLANETS[index];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div
        style={{
          position: 'relative',
          width: 'min(78vw,420px)',
          aspectRatio: '1/1',
          animation: pulsing ? 'planetZapPulse .55s ease-out' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-16%',
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(var(--planet-g1),.22),rgba(var(--planet-g2),.11) 45%,transparent 70%)',
            filter: 'blur(6px)',
            animation: 'floatY 7s ease-in-out infinite',
            transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '6%',
            border: '1px solid rgba(255,255,255,.14)',
            borderRadius: '50%',
            transform: 'rotate(-18deg) scaleY(0.42)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-2%',
            border: '1px solid rgba(var(--planet-ring),.18)',
            borderRadius: '50%',
            transform: 'rotate(12deg) scaleY(0.5)',
            transition: 'border-color 1.1s cubic-bezier(.22,.61,.36,1)',
            pointerEvents: 'none',
          }}
        />
        {!revealed && (
          <svg
            viewBox="0 0 100 100"
            style={{ position: 'absolute', inset: '2%', pointerEvents: 'none', transform: 'rotate(-90deg)' }}
          >
            <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2.5" />
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke="url(#formRingGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - formProgress)}
              style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.22,.61,.36,1)' }}
            />
            <defs>
              <linearGradient id="formRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--planet-a1)" />
                <stop offset="100%" stopColor="var(--planet-a2)" />
              </linearGradient>
            </defs>
          </svg>
        )}
        {bursting && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '8%',
              borderRadius: '50%',
              pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(255,255,255,.9), rgba(255,125,221,.5) 45%, transparent 72%)',
              animation: `planetFormFlash ${BURST_MS}ms ease-out`,
            }}
          />
        )}
        {bursting &&
          SHOCKWAVE_DELAYS_MS.map((delay, i) => (
            <div
              key={i}
              aria-hidden
              style={{
                position: 'absolute',
                inset: '8%',
                borderRadius: '50%',
                pointerEvents: 'none',
                border: '4px solid rgba(255,255,255,.8)',
                animation: `planetFormShockwave ${BURST_MS - delay}ms ease-out ${delay}ms both`,
              }}
            />
          ))}
        <button
          onClick={() => goTo(-1)}
          aria-label="Previous planet"
          style={{
            position: 'absolute',
            top: '50%',
            left: -10,
            transform: 'translateY(-50%)',
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.16)',
            background: 'rgba(10,7,20,.75)',
            color: '#FFFAFC',
            cursor: 'pointer',
            fontSize: 18,
            zIndex: 3,
          }}
        >
          ‹
        </button>
        <button
          onClick={() => goTo(1)}
          aria-label="Next planet"
          style={{
            position: 'absolute',
            top: '50%',
            right: -10,
            transform: 'translateY(-50%)',
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.16)',
            background: 'rgba(10,7,20,.75)',
            color: '#FFFAFC',
            cursor: 'pointer',
            fontSize: 18,
            zIndex: 3,
          }}
        >
          ›
        </button>
        <div
          id="hero-planet-visual"
          ref={(el) => {
            orbRef.current = el;
            planetRef.current = el;
          }}
          style={{
            position: 'absolute',
            inset: '8%',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: `0 0 ${glowBlur}px ${glowSpread}px rgba(var(--planet-g1),${glowOpacity}),0 0 54px 5px rgba(var(--planet-g2),.14)`,
            animation: bursting
              ? `planetFormPunch ${BURST_MS}ms ease-out, floatY 7s ease-in-out infinite`
              : anticipating
              ? `anticipationCharge ${ANTICIPATION_MS}ms ease-in both, floatY 7s ease-in-out infinite`
              : 'floatY 7s ease-in-out infinite',
            filter: `brightness(${planetBrightness})`,
            transformOrigin: 'center',
            transition: 'box-shadow .6s ease, filter .6s ease',
            background: '#0a0714',
            cursor: 'grab',
            touchAction: 'pan-y',
            userSelect: 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgPrevRef}
            alt=""
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgCurRef}
            alt="FANUZU planet"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgNextRef}
            alt=""
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
        </div>
        {planetLocked && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '8%',
              borderRadius: '50%',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(5,3,11,.5)',
            }}
          >
            <span style={{ fontSize: 'clamp(36px,10vw,56px)' }}>🔒</span>
          </div>
        )}
        {children}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {PLANETS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              if (i === index || settlingRef.current) return;
              orbWidthRef.current = orbRef.current?.clientWidth ?? 0;
              commit(i > index ? 1 : -1);
            }}
            aria-label={`Go to ${p.label}`}
            style={{
              width: i === index ? 20 : 6,
              height: 6,
              borderRadius: 4,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === index ? 'linear-gradient(90deg,var(--planet-a1),var(--planet-a2))' : 'rgba(255,255,255,.16)',
              transition: 'width .3s ease, background .3s ease',
            }}
          />
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        {planetLocked ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 14px',
              borderRadius: 999,
              background: 'rgba(124,232,255,.1)',
              border: '1px solid rgba(124,232,255,.3)',
              color: '#FFFAFC',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 14 }}>🔒</span>
            Maxed out on web — continue in the FANUZU app
          </div>
        ) : revealed ? (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFAFC' }}>{planet.label}</div>
            <div style={{ fontSize: 11.5, color: '#6B6478', marginTop: 2 }}>{planet.tagline}</div>
          </>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 14px',
              borderRadius: 999,
              background: 'rgba(255,125,221,.1)',
              border: '1px solid rgba(255,125,221,.3)',
              color: '#FFFAFC',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 14 }}>👆</span>
            {tapsRemaining > 0
              ? `Tap GIVE ${tapsRemaining} more time${tapsRemaining > 1 ? 's' : ''} to finish forming`
              : 'Your planet is forming…'}
          </div>
        )}
      </div>
    </div>
  );
}
