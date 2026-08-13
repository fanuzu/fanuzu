import { NextResponse } from 'next/server';
import { updateArtist, type ArtistUpdateInput, type OfficialStatus } from '@/lib/artist-registry';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const OFFICIAL_STATUSES: OfficialStatus[] = ['unofficial', 'pending', 'official'];

function nullableString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return typeof value === 'string' ? value.trim() || null : undefined;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'malformed_body' }, { status: 400 });
  }

  const input: ArtistUpdateInput = {};
  if (body.fandomName !== undefined) input.fandomName = nullableString(body.fandomName);
  if (body.agency !== undefined) input.agency = nullableString(body.agency);
  if (body.logoUrl !== undefined) input.logoUrl = nullableString(body.logoUrl);
  if (body.heroImageUrl !== undefined) input.heroImageUrl = nullableString(body.heroImageUrl);
  if (body.logoLicense !== undefined) {
    if (typeof body.logoLicense !== 'boolean') {
      return NextResponse.json({ error: 'invalid_logo_license' }, { status: 400 });
    }
    input.logoLicense = body.logoLicense;
  }
  if (body.imageLicense !== undefined) {
    if (typeof body.imageLicense !== 'boolean') {
      return NextResponse.json({ error: 'invalid_image_license' }, { status: 400 });
    }
    input.imageLicense = body.imageLicense;
  }
  if (body.officialStatus !== undefined) {
    if (!OFFICIAL_STATUSES.includes(body.officialStatus as OfficialStatus)) {
      return NextResponse.json({ error: 'invalid_official_status' }, { status: 400 });
    }
    input.officialStatus = body.officialStatus as OfficialStatus;
  }

  try {
    const artist = await updateArtist(id, input);
    if (!artist) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ artist });
  } catch (err) {
    console.error('admin artist update failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
