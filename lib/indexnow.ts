import { LANGS } from './i18n';
import { localePath } from './locale';
import { SITE_URL } from './site';

// IndexNow (Bing/Yandex/Naver all read from the same shared protocol) —
// key file lives at public/<key>.txt, served at
// https://fanuzu.co.kr/<key>.txt once deployed; IndexNow validates a
// submission by fetching that file and checking its contents match.
// Not wired to run automatically anywhere yet — there's no content
// pipeline that changes pages on its own right now (single static
// landing page per locale). Call pingIndexNow(...) by hand (or from a
// future content-publish step, once section-4 content pages exist) after
// a deploy that actually changed page content worth re-crawling.
const INDEXNOW_KEY = '1ad156c24e57dddcd5a62672a142ba75';

export async function pingIndexNow(urls: string[]): Promise<{ ok: boolean; status: number }> {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  return { ok: res.ok, status: res.status };
}

// All 9 locale home URLs — the current full set of indexable pages.
export function allIndexableUrls(): string[] {
  return LANGS.map((lang) => SITE_URL + localePath(lang));
}

// Fire-and-forget wrapper for the two auto-hooks (artist publish, event
// finalize) — a flaky or unreachable IndexNow endpoint must never fail
// the admin action that triggered it, same as how lib/ad-pixels.ts is
// always called with .catch(() => {}) rather than awaited-and-surfaced.
function submitQuietly(urls: string[]): void {
  pingIndexNow(urls).catch((err) => console.error('IndexNow submission failed:', err));
}

export function submitArtistUrls(urlSlug: string): void {
  submitQuietly(LANGS.map((lang) => SITE_URL + localePath(lang, `/artists/${urlSlug}`)));
}

export function submitEventUrls(eventId: number): void {
  submitQuietly(LANGS.map((lang) => SITE_URL + localePath(lang, `/events/${eventId}`)));
}
