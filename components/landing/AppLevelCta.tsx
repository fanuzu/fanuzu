'use client';

import { useEffect, useRef, useState } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';
import { usePreregModal } from '@/components/providers/PreregModalProvider';

const VISIBLE_MS = 3400;
// Doubles as the launch flag: unset/empty means the app isn't out yet, so
// there's nowhere real to send a tap — set it (a NEXT_PUBLIC_ var, since
// this reads in the browser) once a real store link exists and this
// automatically switches from the "coming soon" message to a direct link,
// no code change needed.
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL;

// The web planet only has one upgrade in it (nebula -> formed, at STAGE2) —
// further GIVE taps past that point have no more visual payoff left to
// give here. Rather than let them feel like they're doing nothing,
// redirect that energy toward the app: before launch, a nudge back to
// pre-registration (the thing this whole site exists to convert); after,
// straight to the store. Fixed English, same convention as the other new
// mechanic copy (GIVE, PLANET UPGRADE, the forming-progress hint).
export default function AppLevelCta() {
  const { postUpgradeGiveNonce } = useContribution();
  const { openModal } = usePreregModal();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(hideTimer.current);
  }, [postUpgradeGiveNonce]);

  if (!visible) return null;

  function handleClick() {
    setVisible(false);
    if (!APP_STORE_URL) {
      openModal();
    }
  }

  const content = (
    <>
      <span style={{ fontSize: 22, lineHeight: 1 }}>📲</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFAFC' }}>
        {APP_STORE_URL ? 'Continue in the FANUZU app' : 'The next level is waiting in the FANUZU app'}
      </span>
      <span style={{ fontSize: 11.5, color: '#7CE8FF', textDecoration: 'underline' }}>
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
    background: 'rgba(10,6,19,.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(124,232,255,.4)',
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
    <button onClick={handleClick} style={{ ...sharedStyle, border: '1px solid rgba(124,232,255,.4)' }}>
      {content}
    </button>
  );
}
