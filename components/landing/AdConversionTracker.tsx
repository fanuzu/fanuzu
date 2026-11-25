'use client';

import { useEffect } from 'react';
import { fireAdConversions } from '@/lib/ad-pixels';

// Renders nothing — mounted once in LandingPage. Reads the one-shot
// ?adConv=1 the verify route (app/api/prereg/verify/route.ts) adds to its
// redirect only for a fan's FIRST verified pre-registration who opted into
// marketing_consent, fires the configured ad-platform conversion events
// (lib/ad-pixels.ts), then strips the param immediately — so reloading or
// bookmarking this exact URL can never fire it a second time, on top of
// the server already never setting it for a re-click of the same link.
export default function AdConversionTracker() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('adConv') !== '1') return;
    url.searchParams.delete('adConv');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    fireAdConversions().catch(() => {});
  }, []);

  return null;
}
