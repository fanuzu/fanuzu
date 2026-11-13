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
  // Set only by the floating GIVE button specifically (not the in-section
  // action buttons that also go through addAction) — drives the one-shot
  // Santa-on-a-sleigh flight (SantaSleigh.tsx) from GIVE's own on-screen
  // position spiraling in toward the planet, a seasonal touch tied to
  // GIVE's own "big" gesture rather than every small contribution. id
  // changes on every tap (even if the coordinates happen to repeat) so the
  // watcher can always tell a new flight apart from the one just finishing.
  santaFlight: { id: number; fromX: number; fromY: number; toX: number; toY: number } | null;
  // Bumped exactly once, the moment score crosses from below STAGE2 to at
  // or above it — the planet's nebula -> formed-planet reveal (see
  // PlanetSwiper) and the celebratory badge (PlanetUpgradeBadge) both fire
  // off this, not off score itself, so they trigger once at the crossing
  // rather than once per contribution after it.
  planetUpgradedNonce: number;
  // Bumped every time GIVE is tapped while the planet has *already*
  // upgraded (not the crossing tap itself — that fires planetUpgradedNonce
  // instead) — drives AppLevelCta's nudge toward the app, since there's no
  // further visual payoff left to give on the web for continued taps.
  postUpgradeGiveNonce: number;
  // A quick "here's the app" screenshot flash, triggered by tapping the
  // planet itself (see PlanetSwiper's tap-vs-drag handling).
  previewVisible: boolean;
  previewFading: boolean;
  triggerPreview: () => void;
  dismissPreview: () => void;
  // The one floating reaction bubble (contribution toast, planet-upgrade
  // badge, app-level nudge) allowed on screen at a time — without this,
  // two of them could land on the same tap (e.g. the toast and the
  // upgrade badge both fire off the same contribution) and visually pile
  // up. null means nothing is claiming the slot right now.
  activeOverlay: OverlayKind | null;
  // Asks for the shared slot. A higher- or equal-priority kind always
  // wins and preempts whatever's showing (even mid-display); a
  // lower-priority kind is silently dropped rather than queued, since
  // these are decorative reactions, not something that must eventually
  // be seen.
  claimOverlay: (kind: OverlayKind, ms: number) => boolean;
  // Lets a claimed overlay clear itself early (e.g. on click) instead of
  // waiting out its own timer.
  releaseOverlay: (kind: OverlayKind) => void;
}

export type OverlayKind = 'toast' | 'appCta' | 'upgrade';
const OVERLAY_PRIORITY: Record<OverlayKind, number> = { toast: 1, appCta: 2, upgrade: 3 };

const ContributionContext = createContext<ContributionContextValue | null>(null);

const PREVIEW_FADE_MS = 400;

export function ContributionProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toastNonce, setToastNonce] = useState(0);
  const [reactionNonce, setReactionNonce] = useState(0);
  const [santaFlight, setSantaFlight] = useState<ContributionContextValue['santaFlight']>(null);
  const [planetUpgradedNonce, setPlanetUpgradedNonce] = useState(0);
  const [postUpgradeGiveNonce, setPostUpgradeGiveNonce] = useState(0);
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFading, setPreviewFading] = useState(false);
  const planetRef = useRef<HTMLDivElement | null>(null);
  const previewUnmountTimer = useRef<ReturnType<typeof setTimeout>>();
  const [activeOverlay, setActiveOverlay] = useState<OverlayKind | null>(null);
  const activeOverlayRef = useRef<OverlayKind | null>(null);
  const overlayTimer = useRef<ReturnType<typeof setTimeout>>();
  // Once the user closes the preview, don't pop it back up on further
  // planet taps — closing it is treated as "got it, don't show again"
  // for the rest of this visit.
  const previewDismissedRef = useRef(false);

  useEffect(() => {
    return () => {
      clearTimeout(previewUnmountTimer.current);
      clearTimeout(overlayTimer.current);
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

  const claimOverlay = useCallback((kind: OverlayKind, ms: number) => {
    const current = activeOverlayRef.current;
    if (current && OVERLAY_PRIORITY[current] > OVERLAY_PRIORITY[kind]) {
      return false;
    }
    activeOverlayRef.current = kind;
    setActiveOverlay(kind);
    clearTimeout(overlayTimer.current);
    overlayTimer.current = setTimeout(() => {
      activeOverlayRef.current = null;
      setActiveOverlay(null);
    }, ms);
    return true;
  }, []);

  const releaseOverlay = useCallback((kind: OverlayKind) => {
    if (activeOverlayRef.current !== kind) return;
    clearTimeout(overlayTimer.current);
    activeOverlayRef.current = null;
    setActiveOverlay(null);
  }, []);

  // Shared by spawnParticle and zapFromPoint's own santaFlight path — both
  // fly toward wherever the tracked planet currently is, falling back to
  // the viewport center if no planet is mounted/tracked yet.
  const getPlanetCenter = useCallback(() => {
    const planetEl = planetRef.current;
    if (planetEl) {
      const pr = planetEl.getBoundingClientRect();
      return { x: pr.left + pr.width / 2, y: pr.top + pr.height / 2 };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }, []);

  // Shared by the in-section action buttons (origin = the button that was
  // clicked) and the site-wide floating ZAP button (origin = its fixed
  // on-screen position, since it doesn't sit next to the planet).
  const spawnParticle = useCallback((fromX: number, fromY: number, value: number) => {
    const { x: toX, y: toY } = getPlanetCenter();
    const id = Date.now() + Math.random();
    const particle: Particle = { id, fromX, fromY, dx: toX - fromX, dy: toY - fromY };
    setScore((s) => {
      const next = s + value;
      if (s < STAGE2 && next >= STAGE2) {
        setPlanetUpgradedNonce((n) => n + 1);
      }
      return next;
    });
    setParticles((ps) => [...ps, particle]);
    setToastNonce((n) => n + 1);
    setTimeout(() => {
      setParticles((ps) => ps.filter((p) => p.id !== id));
      setReactionNonce((n) => n + 1);
    }, 900);
  }, [getPlanetCenter]);

  const addAction = useCallback(
    (value: number) => (e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      spawnParticle(rect.left + rect.width / 2, rect.top + rect.height / 2, value);
    },
    [spawnParticle]
  );

  const zapFromPoint = useCallback(
    (value: number, origin: { x: number; y: number }) => {
      // Read before spawnParticle's setScore applies this tap's value, so
      // a tap landing exactly on STAGE2 is "the crossing" (handled by
      // planetUpgradedNonce), not "already upgraded" (this one).
      const alreadyUpgraded = scoreRef.current >= STAGE2;
      spawnParticle(origin.x, origin.y, value);
      const { x: toX, y: toY } = getPlanetCenter();
      setSantaFlight({ id: Date.now() + Math.random(), fromX: origin.x, fromY: origin.y, toX, toY });
      if (alreadyUpgraded) {
        setPostUpgradeGiveNonce((n) => n + 1);
      }
    },
    [spawnParticle, getPlanetCenter]
  );

  const glowIntensity = Math.min(1, score / 90);
  const glowBlur = 26 + glowIntensity * 34;
  const glowSpread = 3 + glowIntensity * 7;
  const glowOpacity = (0.22 + glowIntensity * 0.26).toFixed(2);
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
      santaFlight,
      planetUpgradedNonce,
      postUpgradeGiveNonce,
      previewVisible,
      previewFading,
      triggerPreview,
      dismissPreview,
      activeOverlay,
      claimOverlay,
      releaseOverlay,
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
      santaFlight,
      planetUpgradedNonce,
      postUpgradeGiveNonce,
      previewVisible,
      previewFading,
      triggerPreview,
      dismissPreview,
      activeOverlay,
      claimOverlay,
      releaseOverlay,
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
