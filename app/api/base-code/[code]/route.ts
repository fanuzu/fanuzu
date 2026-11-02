import { NextResponse } from 'next/server';
import { getActiveBaseCodeFandom } from '@/lib/base-partners';

export const runtime = 'nodejs';
// The lookup must reflect is_active in real time (an admin can deactivate a
// code at any moment), so this can't be statically optimized at build time.
export const dynamic = 'force-dynamic';

// Public, unauthenticated — but deliberately narrow: a visitor who already
// has a ?code= link learns only the fandom it resolves to (so the artist
// picker can auto-select it), never the partner's name, handle, target, or
// registration counts. Inactive/unknown codes both come back as
// { valid: false } — never distinguishing the two, so this endpoint can't be
// used to probe which codes exist.
export async function GET(_request: Request, { params }: { params: { code: string } }) {
  const code = params.code?.trim();
  if (!code) {
    return NextResponse.json({ valid: false });
  }
  try {
    const fandom = await getActiveBaseCodeFandom(code);
    if (!fandom) {
      return NextResponse.json({ valid: false });
    }
    return NextResponse.json({ valid: true, fandom });
  } catch (err) {
    console.error('base-code lookup failed:', err);
    return NextResponse.json({ valid: false });
  }
}
