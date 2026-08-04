'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';

export const STAGE0 = 0;
export const STAGE1 = 30;
export const STAGE2 = 70;

export interface Particle {
  id: number;
  fromX: number;
  fromY: number;
  dx: number;
  dy: number;
}

interface ContributionContextValue {
  score: number;
  progressPct: number;
  glowBlur: number;
  glowSpread: number;
  glowOpacity: string;
  planetBrightness: string;
  particles: Particle[];
  planetRef: RefObject<HTMLDivElement>;
  addAction: (value: number) => (e: MouseEvent<HTMLButtonElement>) => void;
}

const ContributionContext = createContext<ContributionContextValue | null>(null);

export function ContributionProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const planetRef = useRef<HTMLDivElement>(null);

  const addAction = useCallback(
    (value: number) => (e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const planetEl = planetRef.current;
      const fromX = rect.left + rect.width / 2;
      const fromY = rect.top + rect.height / 2;
      let toX = window.innerWidth / 2;
      let toY = window.innerHeight / 2;
      if (planetEl) {
        const pr = planetEl.getBoundingClientRect();
        toX = pr.left + pr.width / 2;
        toY = pr.top + pr.height / 2;
      }
      const id = Date.now() + Math.random();
      const particle: Particle = { id, fromX, fromY, dx: toX - fromX, dy: toY - fromY };
      setScore((s) => s + value);
      setParticles((ps) => [...ps, particle]);
      setTimeout(() => {
        setParticles((ps) => ps.filter((p) => p.id !== id));
      }, 900);
    },
    []
  );

  const glowIntensity = Math.min(1, score / 90);
  const glowBlur = 40 + glowIntensity * 60;
  const glowSpread = 6 + glowIntensity * 14;
  const glowOpacity = (0.35 + glowIntensity * 0.45).toFixed(2);
  const planetBrightness = (1 + glowIntensity * 0.22).toFixed(2);
  const progressPct = Math.min(100, (score / 100) * 100);

  const value = useMemo<ContributionContextValue>(
    () => ({
      score,
      progressPct,
      glowBlur,
      glowSpread,
      glowOpacity,
      planetBrightness,
      particles,
      planetRef,
      addAction,
    }),
    [score, progressPct, glowBlur, glowSpread, glowOpacity, planetBrightness, particles, addAction]
  );

  return <ContributionContext.Provider value={value}>{children}</ContributionContext.Provider>;
}

export function useContribution(): ContributionContextValue {
  const ctx = useContext(ContributionContext);
  if (!ctx) throw new Error('useContribution must be used within a ContributionProvider');
  return ctx;
}
