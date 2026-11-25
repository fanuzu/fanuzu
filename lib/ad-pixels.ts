// Client-only: Meta/TikTok/X conversion pixel integrations (ranking-event
// review item 3). Each platform is a no-op until its env var is set, so
// this ships ready-but-inactive — the team plugs in real ad-account IDs
// later with no code change:
//   NEXT_PUBLIC_META_PIXEL_ID
//   NEXT_PUBLIC_TIKTOK_PIXEL_ID
//   NEXT_PUBLIC_X_PIXEL_ID + NEXT_PUBLIC_X_CONVERSION_EVENT_ID (X's tag
//     needs both its own pixel id and the specific conversion event id
//     created for it in the Twitter/X Ads conversion-tracking dashboard)
//
// `fireAdConversions` (CompleteRegistration/etc.) is called exactly once,
// by AdConversionTracker.tsx, right after a fan's FIRST email verification
// — so ad platforms count "verified pre-registration," not raw traffic.
// `trackMetaPageView` is the exception: it's meant to fire on every page
// load (MetaPageViewTracker.tsx), matching Meta's own standard base-pixel
// behavior — without it, Events Manager never sees anything but the rare
// conversion event and flags the pixel as inactive. Verify these against
// each platform's own event-debugging tools once real IDs are in place;
// the snippets below follow each vendor's standard, documented loading
// pattern but haven't been exercised against a live ad account here.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      page: () => void;
      track: (event: string) => void;
    };
    twq?: (...args: unknown[]) => void;
  }
}

function loadScriptOnce(src: string, markerAttr: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[${markerAttr}]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    s.setAttribute(markerAttr, 'true');
    // Fail open: a blocked/failed pixel script (ad blockers are common on
    // exactly this kind of script) should never break the page it's on.
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

// `fbq('init', ...)` only needs to run once per page even though both
// PageView (every visit) and CompleteRegistration (one-time, on conversion)
// call into this — a module-level promise makes a second caller reuse the
// same in-flight/completed script load + init instead of re-running it.
let metaInitPromise: Promise<boolean> | null = null;

function ensureMetaPixelInit(): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return Promise.resolve(false);
  if (!metaInitPromise) {
    metaInitPromise = loadScriptOnce('https://connect.facebook.net/en_US/fbevents.js', 'data-fanuzu-meta-pixel').then(() => {
      if (typeof window.fbq !== 'function') return false;
      window.fbq('init', pixelId);
      return true;
    });
  }
  return metaInitPromise;
}

// Standard Meta Pixel base behavior: fires on every page load, not gated by
// marketing_consent — an anonymous visitor who hasn't reached the
// pre-registration form has no consent decision recorded yet to gate on.
export async function trackMetaPageView(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (await ensureMetaPixelInit()) window.fbq?.('track', 'PageView');
}

async function trackMeta(): Promise<void> {
  if (await ensureMetaPixelInit()) window.fbq?.('track', 'CompleteRegistration');
}

async function trackTikTok(): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (!pixelId) return;
  await loadScriptOnce(
    `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`,
    'data-fanuzu-tiktok-pixel'
  );
  if (!window.ttq) return;
  window.ttq.page();
  window.ttq.track('CompleteRegistration');
}

async function trackX(): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_X_PIXEL_ID;
  const eventId = process.env.NEXT_PUBLIC_X_CONVERSION_EVENT_ID;
  if (!pixelId || !eventId) return;
  await loadScriptOnce('https://static.ads-twitter.com/uwt.js', 'data-fanuzu-x-pixel');
  if (typeof window.twq !== 'function') return;
  window.twq('config', pixelId);
  window.twq('event', eventId, {});
}

// Fires whichever platforms are configured, in parallel; silently does
// nothing for any that aren't (including all three, in a plain dev/test
// environment with no pixel IDs set at all).
export async function fireAdConversions(): Promise<void> {
  if (typeof window === 'undefined') return;
  await Promise.all([trackMeta(), trackTikTok(), trackX()]);
}
