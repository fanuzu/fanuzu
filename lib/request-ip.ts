export function clientIp(request: Request): string {
  // Vercel (and most reverse proxies) set x-forwarded-for to
  // "client, proxy1, proxy2" — the first entry is the original client.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
