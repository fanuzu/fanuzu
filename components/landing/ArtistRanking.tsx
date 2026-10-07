'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';

interface RankingRow {
  artist: string;
  count: number;
}

const RANK_ACCENTS = ['#FFD24A', '#C9D2E0', '#E5995A'];

export default function ArtistRanking() {
  const { tr } = useLang();
  const [ranking, setRanking] = useState<RankingRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
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

  if (!ranking || ranking.length === 0) return null;

  return (
    <div style={{ margin: '0 0 24px' }}>
      <div style={{ fontSize: 12, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 10 }}>{tr.prereg.rankingTitle}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {ranking.map((row, i) => (
          <div
            key={row.artist}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(160deg,rgba(255,125,221,.1),rgba(155,124,255,.04))',
              border: '1px solid rgba(255,125,221,.22)',
              borderRadius: 999,
              padding: '9px 16px',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: RANK_ACCENTS[i] ?? '#FFFAFC' }}>#{i + 1}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFAFC' }}>{row.artist}</span>
            <span style={{ fontSize: 12, color: '#B8AFC4' }}>{row.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
