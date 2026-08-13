import { useEffect, useState } from 'react';

// Simulated activity for the Hero stat card — no backend behind this, just a
// client-side feel of "people are here right now and POP keeps accumulating."
// Initial values are fixed constants (not randomized) so server and first
// client render match exactly; the actual ticking only starts after mount,
// so there's nothing for hydration to disagree about.
const BASE_POP = 12480;
const INITIAL_VIEWERS = 312;
const VIEWER_MIN = 220;
const VIEWER_MAX = 480;

export interface LiveActivity {
  popCount: number;
  viewerCount: number;
}

export function useLiveActivity(): LiveActivity {
  const [popCount, setPopCount] = useState(BASE_POP);
  const [viewerCount, setViewerCount] = useState(INITIAL_VIEWERS);

  useEffect(() => {
    let cancelled = false;
    let popTimer: ReturnType<typeof setTimeout>;
    let viewerTimer: ReturnType<typeof setTimeout>;

    // POP only ever climbs — it stands in for accumulated fan contribution.
    function scheduleNextPop() {
      const delay = 3000 + Math.random() * 3500;
      popTimer = setTimeout(() => {
        if (cancelled) return;
        setPopCount((c) => c + 1 + Math.floor(Math.random() * 6));
        scheduleNextPop();
      }, delay);
    }

    // Viewers drift up and down like real concurrent visitors, with a slight
    // upward bias so the page reads as growing rather than just noisy.
    function scheduleNextViewer() {
      const delay = 2500 + Math.random() * 3000;
      viewerTimer = setTimeout(() => {
        if (cancelled) return;
        setViewerCount((v) => {
          const delta = Math.floor(Math.random() * 15) - 6;
          return Math.min(VIEWER_MAX, Math.max(VIEWER_MIN, v + delta));
        });
        scheduleNextViewer();
      }, delay);
    }

    scheduleNextPop();
    scheduleNextViewer();

    return () => {
      cancelled = true;
      clearTimeout(popTimer);
      clearTimeout(viewerTimer);
    };
  }, []);

  return { popCount, viewerCount };
}
