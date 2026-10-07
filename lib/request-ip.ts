export function clientIp(request: Request): string {
  // Vercel (and most reverse proxies) set x-forwarded-for to
  // "client, proxy1, proxy2" — the first entry is the original client.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

// Vercel's edge network stamps every request with the requester's
// geolocated country as an ISO 3166-1 alpha-2 code (e.g. "KR", "US") —
// no external geo-IP service or API key needed. Returns null off Vercel
// (local dev, other hosts), where the field is simply left unknown rather
// than guessed.
export function clientCountry(request: Request): string | null {
  const country = request.headers.get('x-vercel-ip-country');
  return country && country.trim() ? country.trim().toUpperCase() : null;
}
