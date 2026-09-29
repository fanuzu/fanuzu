'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { PLANETS, mixPlanetTheme } from '@/lib/planets';
import { usePlanetTheme } from '@/components/providers/PlanetThemeProvider';
import { useContribution } from '@/components/providers/ContributionProvider';

const wrap = (n: number) => ((n % PLANETS.length) + PLANETS.length) % PLANETS.length;

export default function PlanetSwiper({ children }: { children?: ReactNode }) {
  const { index, setIndex, setPreviewTheme } = usePlanetTheme();
  const { planetRef, glowBlur, glowSpread, glowOpacity, planetBrightness } = useContribution();

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

  const loadSlideImages = (i: number) => {
    if (imgPrevRef.current) imgPrevRef.current.src = PLANETS[wrap(i - 1)].image;
    if (imgCurRef.current) imgCurRef.current.src = PLANETS[i].image;
    if (imgNextRef.current) imgNextRef.current.src = PLANETS[wrap(i + 1)].image;
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
      if (Math.abs(dragDxRef.current) > threshold) {
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
      <div style={{ position: 'relative', width: 'min(78vw,420px)', aspectRatio: '1/1' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-16%',
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(var(--planet-g1),.35),rgba(var(--planet-g2),.18) 45%,transparent 70%)',
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
          ref={(el) => {
            orbRef.current = el;
            planetRef.current = el;
          }}
          style={{
            position: 'absolute',
            inset: '8%',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: `0 0 ${glowBlur}px ${glowSpread}px rgba(var(--planet-g1),${glowOpacity}),0 0 90px 10px rgba(var(--planet-g2),.25)`,
            animation: 'floatY 7s ease-in-out infinite',
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
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFAFC' }}>{planet.label}</div>
        <div style={{ fontSize: 11.5, color: '#6B6478', marginTop: 2 }}>{planet.tagline}</div>
      </div>
    </div>
  );
}
