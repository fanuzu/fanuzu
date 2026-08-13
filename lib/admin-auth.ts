export type AdminAuthResult = 'ok' | 'not_configured' | 'unauthorized';

// Shared by every /api/admin/* route. Fails closed: with no ADMIN_PASSWORD
// set, every request is 'not_configured' rather than falling through to
// open access.
export function checkAdminAuth(request: Request): AdminAuthResult {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return 'not_configured';
  const supplied = request.headers.get('x-admin-password');
  return supplied === configured ? 'ok' : 'unauthorized';
}
