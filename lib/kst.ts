// Server-safe: KST (Asia/Seoul, UTC+9, no DST) helpers for the admin ranking
// event panel. GENESIS review section 4 flagged that the admin's displayed
// times and its saved times need to actually agree on KST — without this,
// a bare <input type="datetime-local"> value like "2026-12-02T00:00" gets
// parsed by `new Date(...)` in whatever timezone the Node process happens
// to be running in (UTC on most hosts), silently shifting an intended KST
// midnight by 9 hours.

// Treats a bare "YYYY-MM-DDTHH:mm[:ss]" (no timezone marker) as KST — this
// is exactly what the admin panel's datetime-local inputs produce, so
// typing "2026-12-02 00:00" there always means midnight KST regardless of
// what timezone the browser or server happen to be in. A value that
// already carries its own offset (Z or ±HH:mm) is parsed as-is.
export function parseAdminDateAsKst(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const trimmed = value.trim();
  const hasOffset = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(trimmed);
  const d = new Date(hasOffset ? trimmed : `${trimmed}+09:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// The inverse for display: a stored UTC instant, rendered as its KST wall-
// clock time — explicit Intl timeZone rather than toLocaleString(), which
// would otherwise follow whichever timezone the *viewer's* browser is in.
export function formatKst(iso: string | null): string {
  if (!iso) return '미설정';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '미설정';
  const formatted = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  return `${formatted} KST`;
}
