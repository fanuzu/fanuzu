import { NextResponse } from 'next/server';
import { getArtistCounts } from '@/lib/prereg';

export const runtime = 'nodejs';

// Fails closed: if no ADMIN_PASSWORD is configured, nobody gets in rather
// than defaulting to open. Set ADMIN_PASSWORD in the environment to enable
// the /admin dashboard.
export async function GET(request: Request) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }

  const supplied = request.headers.get('x-admin-password');
  if (supplied !== configured) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const counts = await getArtistCounts();
    const total = counts.reduce((sum, c) => sum + c.count, 0);
    return NextResponse.json({ counts, total });
  } catch (err) {
    console.error('admin stats query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
