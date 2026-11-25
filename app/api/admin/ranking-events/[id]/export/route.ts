import { NextResponse } from 'next/server';
import { getRankingEventById, getFinalizedResults } from '@/lib/ranking-events';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// Admin-only: the final, confirmed standing for a finalized ranking event
// as a CSV — GENESIS review section 4's "최종 결과 확정 및 CSV 다운로드".
// Distinct from /api/admin/export (raw registration rows): this is the
// frozen, ranked, award-amount-attached result, not the underlying data.
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

  try {
    const event = await getRankingEventById(id);
    if (!event || event.status !== 'finalized') {
      return NextResponse.json({ error: 'not_finalized' }, { status: 400 });
    }
    const results = await getFinalizedResults(id);

    const rewardForRank = (rank: number): number => {
      if (rank === 1) return event.rewardFirst;
      if (rank === 2) return event.rewardSecond;
      if (rank === 3) return event.rewardThird;
      if (rank <= 10) return event.rewardFourthToTenth;
      return 0;
    };

    const lines = ['rank,artist,validParticipants,adSupportKrw'];
    for (const r of results) {
      lines.push([r.rank, csvCell(r.artist), r.count, rewardForRank(r.rank)].join(','));
    }
    const csv = lines.join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="fanuzu-ranking-event-${id}-results.csv"`,
      },
    });
  } catch (err) {
    console.error('admin ranking-event export failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
