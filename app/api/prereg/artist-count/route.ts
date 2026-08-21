import { NextResponse } from 'next/server';
import { getArtistFounderCount } from '@/lib/prereg';
import { getArtistBadge, getArtistBySlug } from '@/lib/artist-registry';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const artist = new URL(request.url).searchParams.get('artist')?.trim();
  if (!artist) {
    return NextResponse.json({ count: 0, official: false, logoUrl: null, heroImageUrl: null, fandomName: null }, { status: 400 });
  }

  try {
    const [count, registryArtist] = await Promise.all([getArtistFounderCount(artist), getArtistBySlug(artist)]);
    const badge = getArtistBadge(registryArtist);
    return NextResponse.json({
      count,
      official: badge.isOfficial,
      logoUrl: badge.logoUrl,
      heroImageUrl: badge.heroImageUrl,
      fandomName: registryArtist?.fandomName ?? null,
    });
  } catch (err) {
    console.error('artist-count lookup failed:', err);
    return NextResponse.json({ count: 0, official: false, logoUrl: null, heroImageUrl: null, fandomName: null }, { status: 500 });
  }
}
