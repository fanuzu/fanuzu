'use client';

import { useEffect, useRef } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';

const VISIBLE_MS = 3400;

// One-shot celebration the moment the planet finishes forming (score
// crosses STAGE2 — see ContributionProvider's planetUpgradedNonce and
// PlanetSwiper's nebula -> planet image swap, which this is the payoff
// for). Fixed English label rather than full i18n, same convention as
// other short badge-style callouts tied to one feature (PRE-REG BADGE,
// GIVE) — this one has no form/flow of its own to translate around.
export default function PlanetUpgradeBadge() {
  const { planetUpgradedNonce, activeOverlay, claimOverlay } = useContribution();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Highest-priority overlay — this always wins the shared slot, even
    // preempting a contribution toast fired by the same crossing tap.
    claimOverlay('upgrade', VISIBLE_MS);
  }, [planetUpgradedNonce, claimOverlay]);

  if (activeOverlay !== 'upgrade') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        top: '18%',
        transform: 'translate(-50%, -50%)',
        zIndex: 210,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '22px 34px',
        borderRadius: 20,
        background: 'rgba(10,6,19,.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,125,221,.45)',
        boxShadow: '0 20px 50px rgba(0,0,0,.5), 0 0 22px rgba(255,125,221,.18)',
        animation: 'modalPanelIn .4s cubic-bezier(.22,.61,.36,1)',
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1 }}>🪐</span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: '.06em',
          backgroundImage: 'linear-gradient(90deg,#FF7DDD,#9B7CFF)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        PLANET UPGRADE
      </span>
      <span style={{ fontSize: 12.5, color: '#B8AFC4' }}>Your planet has finished forming.</span>
    </div>
  );
}
