// Shared by AttributionTracker.tsx (captures + fires the visit ping once)
// and PreregFormContent.tsx (reads it back to prefill the form). Plain
// module, no 'use client' needed — every export here only ever touches
// browser storage, so it's inert during SSR and only does anything once a
// client component calls it inside an effect.
export const ATTRIBUTION_KEY = 'fanuzu_attribution';
const VISIT_TRACKED_KEY = 'fanuzu_visit_tracked';
const AUTO_OPENED_KEY = 'fanuzu_prereg_auto_opened';
// Referral program spec section 13: an invite link's ref/artist/UTM params
// stay usable for 30 days after landing, not forever — someone who clicked a
// link once in January shouldn't still be crediting that referrer in June.
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface Attribution {
  referralCode?: string;
  artist?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  capturedAt: string;
}

export function captureFromUrl(): { attribution: Omit<Attribution, 'capturedAt'>; hasAnyParam: boolean } {
  const params = new URLSearchParams(window.location.search);
  const attribution = {
    // ?code= is a fandom base-partner link (see lib/base-partners.ts) —
    // shares the same input field as a personal ?ref= code, so it prefills
    // the same way. ?ref= wins on the rare chance both are present.
    referralCode: params.get('ref') || params.get('code') || undefined,
    artist: params.get('artist') || undefined,
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
  };
  const hasAnyParam = Object.values(attribution).some(Boolean);
  return { attribution, hasAnyParam };
}

// A ?code= link names a fandom, not a specific artist string — resolved
// server-side (lib/base-partners.ts) so the only thing a visitor's own link
// reveals is the fandom it belongs to, never the partner's identity or
// target/count. Returns null on any invalid/inactive code or network error,
// in which case the code still prefills the form (above) but doesn't
// auto-select an artist.
export async function resolveBaseCodeArtist(code: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/base-code/${encodeURIComponent(code)}`);
    const data = await res.json();
    return data.valid && typeof data.fandom === 'string' ? data.fandom : null;
  } catch {
    return null;
  }
}

export function readAttribution(): Attribution | null {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    const capturedAt = new Date(parsed.capturedAt).getTime();
    if (Number.isNaN(capturedAt) || Date.now() - capturedAt > ATTRIBUTION_TTL_MS) {
      localStorage.removeItem(ATTRIBUTION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// First-touch only: never overwrites an existing record with a later,
// organic (param-less) visit.
export function writeAttributionIfAbsent(attribution: Omit<Attribution, 'capturedAt'>): void {
  try {
    if (localStorage.getItem(ATTRIBUTION_KEY)) return;
    const full: Attribution = { ...attribution, capturedAt: new Date().toISOString() };
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(full));
  } catch {}
}

// One visit event per browser tab session, regardless of whether this
// particular pageview carried params — still counted as traffic volume in
// /api/admin/analytics.
export function hasTrackedVisitThisSession(): boolean {
  try {
    return sessionStorage.getItem(VISIT_TRACKED_KEY) === '1';
  } catch {
    return true; // fail closed: if sessionStorage is unavailable, don't fire repeatedly
  }
}

export function markVisitTrackedThisSession(): void {
  try {
    sessionStorage.setItem(VISIT_TRACKED_KEY, '1');
  } catch {}
}

// The prereg modal auto-opens on landing, but only once per tab session —
// otherwise every refresh after someone closes it would pop it right back up.
export function hasAutoOpenedThisSession(): boolean {
  try {
    return sessionStorage.getItem(AUTO_OPENED_KEY) === '1';
  } catch {
    return true; // fail closed: if sessionStorage is unavailable, don't force it open repeatedly
  }
}

export function markAutoOpenedThisSession(): void {
  try {
    sessionStorage.setItem(AUTO_OPENED_KEY, '1');
  } catch {}
}
