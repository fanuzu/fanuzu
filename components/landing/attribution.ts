// Shared by AttributionTracker.tsx (captures + fires the visit ping once)
// and PreregFormContent.tsx (reads it back to prefill the form). Plain
// module, no 'use client' needed — every export here only ever touches
// browser storage, so it's inert during SSR and only does anything once a
// client component calls it inside an effect.
export const ATTRIBUTION_KEY = 'fanuzu_attribution';
const VISIT_TRACKED_KEY = 'fanuzu_visit_tracked';

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
    referralCode: params.get('ref') || undefined,
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

export function readAttribution(): Attribution | null {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
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
