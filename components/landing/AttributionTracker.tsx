'use client';

import { useEffect } from 'react';
import { usePreregModal } from '@/components/providers/PreregModalProvider';
import {
  captureFromUrl,
  writeAttributionIfAbsent,
  resolveBaseCodeArtist,
  hasTrackedVisitThisSession,
  markVisitTrackedThisSession,
  hasAutoOpenedThisSession,
  markAutoOpenedThisSession,
} from './attribution';

// Renders nothing — mounted once in LandingPage to capture ?ref=/?code=/
// ?artist=/utm_* query params, record a visit, and open the registration
// modal straight away instead of making people find the CTA themselves. A
// referral/code/artist link always opens it (pre-filled); an organic visit
// opens it once per tab session so closing it doesn't just bring it right
// back on the next refresh.
export default function AttributionTracker() {
  const { openModal } = usePreregModal();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { attribution, hasAnyParam } = captureFromUrl();

      // ?code= (a fandom base-partner link) names a fandom rather than a
      // specific artist string, so it needs a lookup to auto-select the
      // artist the same way ?artist= already does directly. Skipped when
      // ?artist= was also given — more specific, no lookup needed.
      const baseCode = new URLSearchParams(window.location.search).get('code');
      if (baseCode && !attribution.artist) {
        const fandom = await resolveBaseCodeArtist(baseCode);
        if (cancelled) return;
        if (fandom) attribution.artist = fandom;
      }

      if (hasAnyParam) {
        writeAttributionIfAbsent(attribution);
      }

      if (!hasTrackedVisitThisSession()) {
        markVisitTrackedThisSession();
        fetch('/api/track/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...attribution,
            landingPath: window.location.pathname + window.location.search,
            referrer: document.referrer || undefined,
          }),
        }).catch(() => {});
      }

      if (attribution.referralCode || attribution.artist) {
        openModal();
      } else if (!hasAutoOpenedThisSession()) {
        markAutoOpenedThisSession();
        openModal();
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // Runs once on mount only — this is a one-time landing capture, not
    // something that should re-fire on client-side navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
