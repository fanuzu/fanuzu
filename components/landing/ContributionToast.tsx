'use client';

import { useEffect, useRef, useState } from 'react';
import { useContribution } from '@/components/providers/ContributionProvider';
import { useLang } from '@/components/providers/LangProvider';

const VISIBLE_MS = 2600;

// Fires a small "thanks, the planet grew" toast every time a contribution
// lands — from the in-section action buttons or the floating ZAP button
// alike — so every tap gets a response, not just a number ticking up.
export default function ContributionToast() {
  const { toastNonce } = useContribution();
  const { tr } = useLang();
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(hideTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastNonce]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        // Clears the floating ZAP button (bottom-right, 68px) so the two
        // never overlap — they're most likely to appear at the same time,
        // since tapping ZAP is exactly what triggers this toast.
        bottom: 'calc(max(22px, env(safe-area-inset-bottom)) + 68px + 16px)',
        transform: 'translateX(-50%)',
        zIndex: 160,
        maxWidth: 'min(90vw, 380px)',
        background: 'rgba(10,6,19,.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,125,221,.35)',
        borderRadius: 999,
        padding: '12px 20px',
        boxShadow: '0 12px 32px rgba(0,0,0,.45)',
        color: '#FFFAFC',
        fontSize: 13.5,
        lineHeight: 1.4,
        textAlign: 'center',
        animation: 'toastIn .3s cubic-bezier(.22,.61,.36,1)',
      }}
    >
      {tr.exp.contributionToast}
    </div>
  );
}
