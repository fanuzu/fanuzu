'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type MutableRefObject,
  type ReactNode,
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
  planetRef: MutableRefObject<HTMLDivElement | null>;
  addAction: (value: number) => (e: MouseEvent<HTMLButtonElement>) => void;
  zapFromPoint: (value: number, origin: { x: number; y: number }) => void;
  // Bumped on every contribution (in-section buttons and the floating ZAP
  // button alike) so a toast component can react without this provider
  // needing to know anything about translated copy.
  toastNonce: number;
  // Bumped when a particle actually reaches the planet (not when it's
  // fired) — the planet's "impact" animation, so it's timed to when the
  // particle visually lands rather than the moment you tapped.
  reactionNonce: number;
  // A quick "here's the app" screenshot flash, triggered by tapping the
  // planet itself (see PlanetSwiper's tap-vs-drag handling).
  previewVisible: boolean;
  previewFading: boolean;
  triggerPreview: () => void;
  dismissPreview: () => void;
}

const ContributionContext = createContext<ContributionContextValue | null>(null);

const PREVIEW_FADE_MS = 400;

export function ContributionProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toastNonce, setToastNonce] = useState(0);
  const [reactionNonce, setReactionNonce] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFading, setPreviewFading] = useState(false);
  const planetRef = useRef<HTMLDivElement | null>(null);
  const previewUnmountTimer = useRef<ReturnType<typeof setTimeout>>();
  // Once the user closes the preview, don't pop it back up on further
  // planet taps — closing it is treated as "got it, don't show again"
  // for the rest of this visit.
  const previewDismissedRef = useRef(false);

  useEffect(() => {
    return () => {
      clearTimeout(previewUnmountTimer.current);
    };
  }, []);

  const dismissPreview = useCallback(() => {
    previewDismissedRef.current = true;
    clearTimeout(previewUnmountTimer.current);
    setPreviewFading(true);
    previewUnmountTimer.current = setTimeout(() => {
      setPreviewVisible(false);
      setPreviewFading(false);
    }, PREVIEW_FADE_MS);
  }, []);

  const triggerPreview = useCallback(() => {
    if (previewDismissedRef.current) return;
    clearTimeout(previewUnmountTimer.current);
    setPreviewFading(false);
    setPreviewVisible(true);
  }, []);

  // Shared by the in-section action buttons (origin = the button that was
  // clicked) and the site-wide floating ZAP button (origin = its fixed
  // on-screen position, since it doesn't sit next to the planet).
  const spawnParticle = useCallback((fromX: number, fromY: number, value: number) => {
    const planetEl = planetRef.current;
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
    setToastNonce((n) => n + 1);
    setTimeout(() => {
      setParticles((ps) => ps.filter((p) => p.id !== id));
      setReactionNonce((n) => n + 1);
    }, 900);
  }, []);

  const addAction = useCallback(
    (value: number) => (e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      spawnParticle(rect.left + rect.width / 2, rect.top + rect.height / 2, value);
    },
    [spawnParticle]
  );

  const zapFromPoint = useCallback(
    (value: number, origin: { x: number; y: number }) => {
      spawnParticle(origin.x, origin.y, value);
    },
    [spawnParticle]
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
      zapFromPoint,
      toastNonce,
      reactionNonce,
      previewVisible,
      previewFading,
      triggerPreview,
      dismissPreview,
    }),
    [
      score,
      progressPct,
      glowBlur,
      glowSpread,
      glowOpacity,
      planetBrightness,
      particles,
      addAction,
      zapFromPoint,
      toastNonce,
      reactionNonce,
      previewVisible,
      previewFading,
      triggerPreview,
      dismissPreview,
    ]
  );

  return <ContributionContext.Provider value={value}>{children}</ContributionContext.Provider>;
}

export function useContribution(): ContributionContextValue {
  const ctx = useContext(ContributionContext);
  if (!ctx) throw new Error('useContribution must be used within a ContributionProvider');
  return ctx;
}

const PULSE_DURATION_MS = 550;

// True for a brief moment whenever a particle lands on the planet — drives
// the one-shot "impact" animation (see planetZapPulse in globals.css) on
// whichever planet wrapper reads it. Shared so Hero's and Experience's
// planet don't each reimplement the same nonce-watching timeout.
export function usePlanetReactionPulse(): boolean {
  const { reactionNonce } = useContribution();
  const [pulsing, setPulsing] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), PULSE_DURATION_MS);
    return () => clearTimeout(t);
  }, [reactionNonce]);

  return pulsing;
}
