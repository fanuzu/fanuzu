'use client';

import { useEffect, useRef } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';
import { usePreregModal } from '@/components/providers/PreregModalProvider';

const VISIBLE_MS = 4200;
// Doubles as the launch flag: unset/empty means the app isn't out yet, so
// there's nowhere real to send a tap — set it (a NEXT_PUBLIC_ var, since
// this reads in the browser) once a real store link exists and this
// automatically switches from the "coming soon" message to a direct link,
// no code change needed.
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL;

// The web planet only has one upgrade in it (nebula -> formed, at STAGE2),
// and further GIVE taps past that point now lock the planet (see
// ContributionProvider's planetLocked/PLANET_LOCK_TAPS and PlanetSwiper's
// lock indicator) rather than doing nothing silently. This fires exactly
// once, right at that lock moment, pointing the energy toward the app:
// before launch, a nudge back to pre-registration (the thing this whole
// site exists to convert); after, straight to the store. Fixed English,
// same convention as the other new mechanic copy (GIVE, PLANET UPGRADE).
export default function AppLevelCta() {
  const { planetLockedNonce, activeOverlay, claimOverlay, releaseOverlay } = useContribution();
  const { openModal } = usePreregModal();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Mid-priority overlay — loses the shared slot to the (rarer) upgrade
    // badge, but still outranks the ambient contribution toast.
    claimOverlay('appCta', VISIBLE_MS);
  }, [planetLockedNonce, claimOverlay]);

  if (activeOverlay !== 'appCta') return null;

  function handleClick() {
    releaseOverlay('appCta');
    if (!APP_STORE_URL) {
      openModal();
    }
  }

  const content = (
    <>
      <span style={{ fontSize: 22, lineHeight: 1 }}>📲</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#F5F3FF' }}>
        {APP_STORE_URL ? 'Continue in the FANUZU app' : 'The next level is waiting in the FANUZU app'}
      </span>
      <span style={{ fontSize: 11.5, color: '#9675F5', textDecoration: 'underline' }}>
        {APP_STORE_URL ? 'Open app store' : 'Pre-register to get notified'}
      </span>
    </>
  );

  const sharedStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    bottom: 'calc(max(22px, env(safe-area-inset-bottom)) + 68px + 16px)',
    transform: 'translateX(-50%)',
    zIndex: 160,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    maxWidth: 'min(90vw, 360px)',
    padding: '12px 18px',
    borderRadius: 999,
    background: 'rgba(23,24,39,.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(150,117,245,.4)',
    boxShadow: '0 12px 32px rgba(0,0,0,.45)',
    animation: 'toastIn .3s cubic-bezier(.22,.61,.36,1)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
  };

  return APP_STORE_URL ? (
    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={handleClick} style={sharedStyle}>
      {content}
    </a>
  ) : (
    <button onClick={handleClick} style={{ ...sharedStyle, border: '1px solid rgba(150,117,245,.4)' }}>
      {content}
    </button>
  );
}
