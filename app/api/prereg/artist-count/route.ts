import { NextResponse } from 'next/server';
import { getArtistFounderCount } from '@/lib/prereg';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const artist = new URL(request.url).searchParams.get('artist')?.trim();
  if (!artist) {
    return NextResponse.json({ count: 0 }, { status: 400 });
  }

  try {
    const count = await getArtistFounderCount(artist);
    return NextResponse.json({ count });
  } catch (err) {
    console.error('artist-count lookup failed:', err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
