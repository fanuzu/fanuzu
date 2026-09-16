import { useEffect, useState } from 'react';

// Simulated activity for the Hero stat card — no backend behind this, just a
// client-side feel of "POP keeps accumulating." Initial value is a fixed
// constant (not randomized) so server and first client render match exactly;
// the actual ticking only starts after mount, so there's nothing for
// hydration to disagree about.
//
// This used to also simulate a "N people viewing now" counter, but a random
// walk confined to a narrow band reads as visibly fake after a few reloads
// (it always hovers in the same few hundred) and was eroding trust rather
// than building it — removed rather than patched.
const BASE_POP = 12480;

export interface LiveActivity {
  popCount: number;
}

export function useLiveActivity(): LiveActivity {
  const [popCount, setPopCount] = useState(BASE_POP);

  useEffect(() => {
    let cancelled = false;
    let popTimer: ReturnType<typeof setTimeout>;

    // POP only ever climbs — it stands in for accumulated fan contribution.
    function scheduleNextPop() {
      const delay = 3000 + Math.random() * 3500;
      popTimer = setTimeout(() => {
        if (cancelled) return;
        setPopCount((c) => c + 1 + Math.floor(Math.random() * 6));
        scheduleNextPop();
      }, delay);
    }

    scheduleNextPop();

    return () => {
      cancelled = true;
      clearTimeout(popTimer);
    };
  }, []);

  return { popCount };
}
