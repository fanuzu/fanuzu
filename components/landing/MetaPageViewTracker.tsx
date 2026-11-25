'use client';

import { useEffect } from 'react';
import { trackMetaPageView } from '@/lib/ad-pixels';

// Renders nothing — mounted once in LandingPage. Fires Meta's standard
// PageView event on every visit (home and /ranking), separate from the
// one-time CompleteRegistration fired by AdConversionTracker on a fan's
// first verified, consented registration. Without this, Meta's Events
// Manager sees only the rare conversion event and never a base PageView,
// which it flags as an inactive/incomplete pixel and which also means no
// PageView-based retargeting/lookalike audiences can be built.
export default function MetaPageViewTracker() {
  useEffect(() => {
    trackMetaPageView().catch(() => {});
  }, []);

  return null;
}
