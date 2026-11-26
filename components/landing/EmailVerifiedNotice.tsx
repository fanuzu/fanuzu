'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';

// Matches how long this polls for #ranking to show up before giving up
// (see below) — RankingSection renders it only after its own data fetch
// resolves, which a cold serverless function + DB round trip can push well
// past a fixed short delay.
const MAX_WAIT_MS = 4000;
const POLL_MS = 200;

// Renders a brief toast and scrolls to the ranking section when landing
// with ?emailVerified=1 (from the confirmation email's verify link) — what
// actually becomes true the moment verification succeeds is that this
// registration now counts toward the public ranking, so that's what this
// landing should show, not just the plain homepage top. #ranking only
// exists once RankingSection's own data fetch has resolved, so this polls
// for it rather than assuming a fixed delay is enough — a slow fetch (cold
// start, DB latency) previously meant the single timed attempt fired
// before the element existed, silently doing nothing but showing the
// toast. Gives up quietly after MAX_WAIT_MS if the ranking feature isn't
// enabled at all (no element ever appears).
export default function EmailVerifiedNotice() {
  const { tr } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('emailVerified') !== '1') return;
    setShow(true);

    let cancelled = false;
    let elapsed = 0;
    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById('ranking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      elapsed += POLL_MS;
      if (elapsed < MAX_WAIT_MS) setTimeout(tryScroll, POLL_MS);
    };
    const scrollTimer = setTimeout(tryScroll, POLL_MS);
    const hideTimer = setTimeout(() => setShow(false), 6000);
    return () => {
      cancelled = true;
      clearTimeout(scrollTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(max(14px, env(safe-area-inset-top)) + 54px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 170,
        maxWidth: 'min(90vw, 380px)',
        padding: '12px 20px',
        borderRadius: 999,
        background: 'rgba(23,24,39,.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(150,117,245,.4)',
        boxShadow: '0 12px 32px rgba(0,0,0,.45)',
        color: '#F5F3FF',
        fontSize: 13,
        fontWeight: 600,
        textAlign: 'center',
        animation: 'toastIn .3s cubic-bezier(.22,.61,.36,1)',
      }}
    >
      {tr.rankingSection.emailVerifiedToast}
    </div>
  );
}
