'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';

interface ProgressRow {
  fandom: string;
  count: number;
  goal: number;
}

interface RankingRow {
  artist: string;
  count: number;
}

// Flagged off by default (SHOW_FANDOM_PROGRESS) and only shows a fandom the
// admin gave a public goal to (lib/artist-registry.ts's prereg_goal) — the
// aggregate count only, never a base partner's or individual's numbers (doc
// requirement 6). Renders nothing for an artist with no goal set, same
// "stay invisible rather than show a half-built feature" pattern as
// ArtistRanking.tsx.
export default function FandomProgress({ artist }: { artist: string }) {
  const { tr } = useLang();
  const [rows, setRows] = useState<ProgressRow[] | null>(null);
  const [ranking, setRanking] = useState<RankingRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/prereg/fandom-progress')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.enabled && Array.isArray(data.fandoms)) setRows(data.fandoms);
      })
      .catch(() => {});
    // Independent of the goal-progress flag — a fandom can have a rank
    // shown here even without an admin-set goal, as long as a ranking
    // event is configured.
    fetch('/api/prereg/ranking')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.enabled && Array.isArray(data.ranking)) setRanking(data.ranking);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const row = rows?.find((r) => r.fandom.toLowerCase() === artist.toLowerCase());
  const rankIndex = ranking?.findIndex((r) => r.artist.toLowerCase() === artist.toLowerCase()) ?? -1;
  const rank = rankIndex >= 0 ? rankIndex + 1 : null;

  if (!row) {
    if (!rank) return null;
    return (
      <div style={{ maxWidth: 360, margin: '0 auto 22px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: '#7CE8FF', fontWeight: 700, letterSpacing: '.04em' }}>
          {tr.rankingSection.currentRankLabel} #{rank}
        </span>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((row.count / row.goal) * 1000) / 10);

  return (
    <div style={{ maxWidth: 360, margin: '0 auto 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: '#7CE8FF', fontWeight: 700, letterSpacing: '.04em' }}>{row.fandom} PLANET GOAL</span>
        <span style={{ color: '#B8AFC4' }}>
          {row.count.toLocaleString()} / {row.goal.toLocaleString()}
        </span>
      </div>
      <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 999, overflow: 'hidden', height: 8 }}>
        <div
          style={{
            width: `${Math.max(2, pct)}%`,
            height: '100%',
            background: 'linear-gradient(90deg,#FF7DDD,#9B7CFF)',
            borderRadius: 999,
          }}
        />
      </div>
      {rank && (
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11.5, color: '#7CE8FF', fontWeight: 700 }}>
          {tr.rankingSection.currentRankLabel} #{rank}
        </div>
      )}
    </div>
  );
}
