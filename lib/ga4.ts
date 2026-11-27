// Client-only GA4 integration — ships ready-but-inactive like the ad
// pixels in lib/ad-pixels.ts: a no-op until NEXT_PUBLIC_GA4_MEASUREMENT_ID
// is set, so the team plugs in a real property later with no code
// change. There is currently NO analytics tracking organic search
// traffic or pre-registration conversions at all (the existing pixels in
// lib/ad-pixels.ts are paid-ad attribution only) — this is net new.
//
// gtag.js's own bootstrap is simpler than Meta/TikTok/X's (no
// queue/stub indirection to replicate): define `dataLayer` + a `gtag`
// function that just pushes arguments onto it, then load the script —
// gtag.js itself drains the queue once it loads, no special ordering
// trick needed like the ad pixels required.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

function ensureGtag(): void {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID!)}`;
  document.head.appendChild(script);
}

// Fires on every page load, same as trackMetaPageView — GA4's own
// pageview is standard analytics, not ad-conversion tracking, so it
// follows the same "no consent gate needed yet" reasoning already
// documented on trackMetaPageView.
export function trackGa4PageView(): void {
  if (!GA4_ID) return;
  ensureGtag();
}

// Mirrors fireAdConversions' call site exactly (AdConversionTracker.tsx,
// gated on the server-added ?adConv=1 that only appears after a fan's
// first verified + marketing-consented pre-registration) so GA4 counts
// the same real conversion the ad platforms do, not raw form submits.
export function trackGa4Conversion(): void {
  if (!GA4_ID) return;
  ensureGtag();
  window.gtag!('event', 'sign_up', { method: 'prereg' });
}
