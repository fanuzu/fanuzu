// Split out from lib/seo.ts: structured-data.ts and seo.ts both need this
// constant, and seo.ts itself imports from structured-data.ts (for
// buildPageStructuredData) — importing SITE_URL the other way around
// (structured-data.ts from seo.ts) made a circular import that crashed
// the production build with "Cannot access 'o' before initialization" at
// collect-page-data time. This tiny leaf module breaks that cycle.
export const SITE_URL = 'https://fanuzu.co.kr';
