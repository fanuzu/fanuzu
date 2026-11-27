'use client';

import { useEffect } from 'react';
import { trackGa4PageView } from '@/lib/ga4';

// Renders nothing — mounted once in LandingPage, same pattern as
// MetaPageViewTracker. No-op until NEXT_PUBLIC_GA4_MEASUREMENT_ID is set.
export default function Ga4Tracker() {
  useEffect(() => {
    trackGa4PageView();
  }, []);

  return null;
}
