import { NextResponse } from 'next/server';
import { getFandomExportRows, type FandomExportRow } from '@/lib/tracking';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const COLUMNS: (keyof FandomExportRow)[] = [
  'id',
  'email',
  'artistName',
  'fandomName',
  'fanSinceYear',
  'language',
  'referralCodeInput',
  'rewardAmount',
  'artistJoinOrder',
  'origin100Eligible',
  'origin100Number',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'createdAt',
];

export async function GET(request: Request) {
  const auth = checkAdminAuth(request);
  if (auth === 'not_configured') {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const artistIdParam = new URL(request.url).searchParams.get('artistId');
  const artistId = artistIdParam ? Number(artistIdParam) : null;
  if (artistIdParam && (!Number.isInteger(artistId) || (artistId as number) <= 0)) {
    return NextResponse.json({ error: 'invalid_artist_id' }, { status: 400 });
  }

  try {
    const rows = await getFandomExportRows(artistId);
    const lines = [COLUMNS.join(',')];
    for (const row of rows) {
      lines.push(COLUMNS.map((c) => csvCell(row[c])).join(','));
    }
    const csv = lines.join('\n');
    const filename = artistId ? `fanuzu-prereg-artist-${artistId}.csv` : 'fanuzu-prereg-all.csv';
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('admin export failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
