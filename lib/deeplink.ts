// Client-safe. Same "ready but inactive" convention as lib/ad-pixels.ts
// and AppLevelCta.tsx: NEXT_PUBLIC_APP_STORE_URL doubles as the launch
// flag (unset = app isn't out, so every CTA site-wide points at
// pre-registration instead), and NEXT_PUBLIC_APP_URL_SCHEME is the
// custom URL scheme the real app will register in its Info.plist /
// AndroidManifest once it exists — both plug in later with no code
// change. Deep link *paths* (artist/{slug}, event/{id}) are decided now,
// before the app exists, specifically so the native team can register
// matching routes against a spec that won't move later.
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL;
const APP_URL_SCHEME = process.env.NEXT_PUBLIC_APP_URL_SCHEME || 'fanuzu';

export function isAppLaunched(): boolean {
  return !!APP_STORE_URL;
}

export type DeepLinkTarget = { kind: 'artist'; slug: string } | { kind: 'event'; id: number | string } | { kind: 'home' };

function deepLinkPath(target: DeepLinkTarget): string {
  switch (target.kind) {
    case 'artist':
      return `artist/${target.slug}`;
    case 'event':
      return `event/${target.id}`;
    case 'home':
    default:
      return '';
  }
}

// `fanuzu://artist/le-sserafim` etc. — a custom-scheme attempt is the
// only reliable way to launch the app from a tapped *button* (as opposed
// to an incoming OS-level link, which Universal Links/App Links handle
// separately — see openAppOrStore's doc comment below).
export function buildCustomSchemeLink(target: DeepLinkTarget): string {
  return `${APP_URL_SCHEME}://${deepLinkPath(target)}`;
}

// The public web URL for the same target. Once the app exists and the
// operator publishes a real Apple App Site Association /
// assetlinks.json, THIS is the URL that should be used everywhere
// (share links, search results, ads) — iOS/Android intercept a tap on
// it and open the app directly, no custom scheme needed, with the exact
// same web page as a correct fallback when the app isn't installed. No
// code change on this side is needed when that day comes; only the two
// well-known files, hosted by whoever builds the native app.
export function buildWebFallbackPath(target: DeepLinkTarget, localeHome: string): string {
  switch (target.kind) {
    case 'artist':
      return `${localeHome}artists/${target.slug}`;
    case 'event':
      return `${localeHome}events/${target.id}`;
    case 'home':
    default:
      return localeHome || '/';
  }
}

// Standard "try the app, fall back to the store" technique for a JS
// button tap: attempt the custom-scheme navigation, then check back
// after a short delay — if the tab is still visible, nothing caught the
// scheme (app not installed, or on a platform that silently ignores
// unknown schemes), so send them to the store instead. `document.hidden`
// flips true the moment the OS actually switches to the app, which is
// what distinguishes "it worked" from "nothing happened."
export function openAppOrStore(target: DeepLinkTarget): void {
  if (!APP_STORE_URL) return;
  const fallbackTimer = window.setTimeout(() => {
    if (!document.hidden) window.location.href = APP_STORE_URL;
  }, 1500);
  window.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) window.clearTimeout(fallbackTimer);
    },
    { once: true }
  );
  window.location.href = buildCustomSchemeLink(target);
}
