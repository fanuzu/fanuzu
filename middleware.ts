import { NextResponse, type NextRequest } from 'next/server';
import type { Lang } from '@/lib/i18n';
import { LOCALE_SEGMENT } from '@/lib/locale';

// Doc section 20: "no forced redirect that blocks crawling" — so this
// only ever acts on a `fanuzu_lang` cookie, which is written in exactly
// two places (Nav's language switcher, LangSuggestion's "switch" button),
// both requiring an explicit click. A crawler never carries that cookie,
// so this is invisible to Googlebot/bots and never stops them reaching
// the real ko content at these bare URLs. It only touches the two
// genuinely ambiguous entry points — the unprefixed root and /ranking —
// never a URL that already names a language (a direct /ja link is
// respected as-is, even for a visitor whose cookie says something else).
export const config = {
  matcher: ['/', '/ranking'],
};

export function middleware(req: NextRequest) {
  const saved = req.cookies.get('fanuzu_lang')?.value as Lang | undefined;
  if (!saved) return NextResponse.next();

  const segment = LOCALE_SEGMENT[saved];
  if (!segment) return NextResponse.next(); // 'ko' (or an unrecognized value) — already the right content

  const url = req.nextUrl.clone();
  url.pathname = `/${segment}${req.nextUrl.pathname === '/ranking' ? '/ranking' : ''}`;
  // 307, not a permanent redirect: this is per-visitor personalization
  // based on a cookie, not a statement that the bare URL always means
  // this language — a shared cache must not apply it to anyone else.
  return NextResponse.redirect(url, 307);
}
