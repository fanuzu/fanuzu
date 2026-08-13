import { NextResponse } from 'next/server';
import { listArtistsWithCounts } from '@/lib/artist-registry';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const artists = await listArtistsWithCounts();
    return NextResponse.json({ artists });
  } catch (err) {
    console.error('admin artists query failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
