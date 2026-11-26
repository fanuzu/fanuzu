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
// conversion event and flags the pixel as inactive.
//
// IMPORTANT: each vendor's pixel script (fbevents.js, TikTok's events.js,
// X's uwt.js) is written assuming its own documented bootstrap snippet ran
// FIRST — that snippet pre-defines the global (`fbq`/`ttq`/`twq`) as a stub
// with a call queue, which the real script then takes over once it loads.
// Loading the vendor script directly (as a previous version of this file
// did, with a generic "wait for onload, then call the global") skips that
// stub entirely; live production testing confirmed this actually breaks
// Meta's script with "Uncaught ReferenceError: fbq is not defined" thrown
// from inside fbevents.js itself, so `window.fbq` was never usable and no
// event — PageView or CompleteRegistration — ever reached Meta. Each
// platform below now reproduces that vendor's own bootstrap snippet
// verbatim instead of inventing a load pattern.

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    _fbq?: unknown;
    ttq?: {
      page: () => void;
      track: (event: string) => void;
      load: (pixelId: string) => void;
    };
    twq?: ((...args: unknown[]) => void) & { exe?: (...args: unknown[]) => void; queue?: unknown[] };
  }
}

// --- Meta --------------------------------------------------------------

function installFbqStub(): void {
  if (window.fbq) return;
  const stub = function (...args: unknown[]) {
    if (stub.callMethod) stub.callMethod.apply(stub, args);
    else stub.queue!.push(args);
  } as NonNullable<Window['fbq']>;
  if (!window._fbq) window._fbq = stub;
  stub.queue = [];
  window.fbq = stub;
}

function injectScriptOnce(src: string, markerAttr: string): void {
  if (document.querySelector(`script[${markerAttr}]`)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  s.setAttribute(markerAttr, 'true');
  document.head.appendChild(s);
}

// `fbq('init', ...)` only needs to run once per page even though both
// PageView (every visit) and CompleteRegistration (one-time, on conversion)
// call into this — a module-level flag makes a second caller skip straight
// to using the already-installed fbq instead of re-running setup.
let metaReady: Promise<boolean> | null = null;

function ensureMetaPixelInit(): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return Promise.resolve(false);
  if (!metaReady) {
    installFbqStub();
    window.fbq!('init', pixelId);
    injectScriptOnce('https://connect.facebook.net/en_US/fbevents.js', 'data-fanuzu-meta-pixel');
    // The stub queues calls immediately (synchronously, above) regardless
    // of whether the real script has finished loading yet — callers don't
    // need to wait for the network fetch, only for the stub to exist.
    metaReady = Promise.resolve(true);
  }
  return metaReady;
}

// Standard Meta Pixel base behavior: fires on every page load, not gated by
// marketing_consent — an anonymous visitor who hasn't reached the
// pre-registration form has no consent decision recorded yet to gate on.
export async function trackMetaPageView(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (await ensureMetaPixelInit()) window.fbq!('track', 'PageView');
}

async function trackMeta(): Promise<void> {
  if (await ensureMetaPixelInit()) window.fbq!('track', 'CompleteRegistration');
}

// --- TikTok --------------------------------------------------------------

// Reproduces TikTok's own documented bootstrap snippet: it defines ttq's
// queueing methods and `ttq.load`, which itself creates and inserts the
// events.js script tag (with the pixel id baked into the query string) —
// there's deliberately no separate injectScriptOnce call for TikTok, since
// ttq.load already does that internally the way TikTok's script expects.
function installTtqStub(): NonNullable<Window['ttq']> {
  if (window.ttq) return window.ttq;
  const w = window as unknown as { ttq: Record<string, unknown> };
  const ttq = (w.ttq = (w.ttq || []) as unknown as Record<string, unknown> & unknown[]);
  const methods = [
    'page','track','identify','instances','debug','on','off','once','ready',
    'alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent',
  ];
  const setAndDefer = (target: Record<string, unknown>, method: string) => {
    target[method] = (...args: unknown[]) => {
      (target as unknown as unknown[]).push([method, ...args]);
    };
  };
  methods.forEach((m) => setAndDefer(ttq, m));
  ttq.load = (pixelId: string) => {
    const src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    const i = ttq as unknown as { _i?: Record<string, unknown>; _t?: Record<string, number>; _o?: Record<string, unknown> };
    i._i = i._i || {};
    i._i[pixelId] = [];
    i._t = i._t || {};
    i._t[pixelId] = Date.now();
    i._o = i._o || {};
    i._o[pixelId] = {};
    const script = document.createElement('script');
    script.async = true;
    script.src = `${src}?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`;
    const first = document.getElementsByTagName('script')[0];
    first.parentNode?.insertBefore(script, first);
  };
  return ttq as unknown as NonNullable<Window['ttq']>;
}

let tiktokReady: boolean | null = null;

function ensureTikTokPixelInit(): boolean {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (!pixelId) return false;
  if (tiktokReady === null) {
    const ttq = installTtqStub();
    ttq.load(pixelId);
    ttq.page();
    tiktokReady = true;
  }
  return tiktokReady;
}

async function trackTikTok(): Promise<void> {
  if (ensureTikTokPixelInit()) window.ttq!.track('CompleteRegistration');
}

// --- X / Twitter -----------------------------------------------------------

// Reproduces X's own documented universal website tag bootstrap: defines
// twq as a stub with a call queue (`queue`/`exe`) before loading uwt.js,
// the same stub-then-script-takeover shape as Meta's.
function installTwqStub(): void {
  if (window.twq) return;
  const stub = function (...args: unknown[]) {
    if (stub.exe) stub.exe.apply(stub, args);
    else stub.queue!.push(args);
  } as NonNullable<Window['twq']>;
  stub.queue = [];
  window.twq = stub;
  injectScriptOnce('https://static.ads-twitter.com/uwt.js', 'data-fanuzu-x-pixel');
}

let xReady: boolean | null = null;

function ensureXPixelInit(): boolean {
  const pixelId = process.env.NEXT_PUBLIC_X_PIXEL_ID;
  if (!pixelId) return false;
  if (xReady === null) {
    installTwqStub();
    window.twq!('config', pixelId);
    xReady = true;
  }
  return xReady;
}

async function trackX(): Promise<void> {
  const eventId = process.env.NEXT_PUBLIC_X_CONVERSION_EVENT_ID;
  if (!eventId) return;
  if (ensureXPixelInit()) window.twq!('event', eventId, {});
}

// Fires whichever platforms are configured, in parallel; silently does
// nothing for any that aren't (including all three, in a plain dev/test
// environment with no pixel IDs set at all).
export async function fireAdConversions(): Promise<void> {
  if (typeof window === 'undefined') return;
  await Promise.all([trackMeta(), trackTikTok(), trackX()]);
}
