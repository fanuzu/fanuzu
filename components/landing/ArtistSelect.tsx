'use client';

import { useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';
import { POPULAR_ARTISTS } from '@/lib/artists';

const pillStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 14,
  padding: '16px 10px',
  color: '#FFFAFC',
  fontSize: 'clamp(12px,3.6vw,14.5px)',
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
  textAlign: 'center',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

export default function ArtistSelect({
  onConfirm,
  headingId,
}: {
  onConfirm: (artist: string, fandomName: string | null) => void;
  headingId?: string;
}) {
  const { tr } = useLang();
  const [pendingArtist, setPendingArtist] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [official, setOfficial] = useState(false);
  const [fandomName, setFandomName] = useState<string | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');

  async function reveal(artist: string) {
    setPendingArtist(artist);
    setCount(null);
    setOfficial(false);
    setFandomName(null);
    setLoadingCount(true);
    try {
      const res = await fetch(`/api/prereg/artist-count?artist=${encodeURIComponent(artist)}`);
      const data = await res.json();
      setCount(typeof data.count === 'number' ? data.count : 0);
      setOfficial(data.official === true);
      setFandomName(typeof data.fandomName === 'string' ? data.fandomName : null);
    } catch {
      setCount(0);
    } finally {
      setLoadingCount(false);
    }
  }

  function backToGrid() {
    setPendingArtist(null);
    setCount(null);
    setOfficial(false);
    setFandomName(null);
  }

  if (pendingArtist) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,125,221,.1)',
            border: '1px solid rgba(255,125,221,.3)',
            padding: '7px 14px',
            borderRadius: 999,
            fontSize: 11.5,
            letterSpacing: '.08em',
            color: '#FF7DDD',
            fontWeight: 700,
            marginBottom: 22,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7DDD', flex: '0 0 auto' }} />
          {tr.prereg.statusBadge}
        </div>
        <h2
          id={headingId}
          style={{
            fontSize: 'clamp(30px,5vw,44px)',
            lineHeight: 1.2,
            fontWeight: 800,
            margin: '0 0 10px',
            background: 'linear-gradient(90deg,#FFFAFC,var(--planet-a1))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {pendingArtist.toUpperCase()} PLANET
        </h2>
        {official && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
              color: '#05030B',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '.06em',
              padding: '4px 10px',
              borderRadius: 999,
              marginBottom: 22,
            }}
          >
            ✓ OFFICIAL
          </div>
        )}
        <p style={{ fontSize: 15, color: '#B8AFC4', margin: official ? '0 0 32px' : '18px 0 32px' }}>
          {loadingCount ? '···' : tr.prereg.founderCountLabel.replace('{n}', String(count ?? 0))}
        </p>
        <button
          onClick={() => onConfirm(pendingArtist, fandomName)}
          style={{
            background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
            color: '#05030B',
            fontWeight: 700,
            fontSize: 16,
            padding: '16px 32px',
            border: 'none',
            borderRadius: 999,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 16,
          }}
        >
          {tr.prereg.foundingCta}
        </button>
        <div>
          <button
            onClick={backToGrid}
            style={{
              background: 'none',
              border: 'none',
              color: '#9089A0',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'underline',
            }}
          >
            {tr.prereg.selectBack}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
      <h2 id={headingId} style={{ fontSize: 'clamp(26px,4vw,34px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 12px', color: '#FFFAFC' }}>
        {tr.prereg.selectTitle}
      </h2>
      <p style={{ fontSize: 14.5, color: '#B8AFC4', margin: '0 0 32px' }}>{tr.prereg.selectSub}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
          gap: 10,
          textAlign: 'left',
        }}
      >
        {POPULAR_ARTISTS.map((artist) => (
          <button key={artist} onClick={() => reveal(artist)} style={pillStyle}>
            {artist}
          </button>
        ))}
        <button
          onClick={() => setShowCustomInput(true)}
          style={{ ...pillStyle, color: '#B8AFC4', border: '1px dashed rgba(255,255,255,.16)' }}
        >
          {tr.prereg.selectOther}
        </button>
      </div>

      {showCustomInput && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customText.trim()) reveal(customText.trim());
          }}
          style={{ display: 'flex', gap: 10, marginTop: 16 }}
        >
          <input
            type="text"
            autoFocus
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={tr.prereg.artistPlaceholder}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.14)',
              borderRadius: 12,
              padding: '13px 16px',
              color: '#FFFAFC',
              fontSize: 14.5,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!customText.trim()}
            style={{
              background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
              color: '#05030B',
              fontWeight: 700,
              fontSize: 14,
              padding: '13px 22px',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              opacity: customText.trim() ? 1 : 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {tr.prereg.selectConfirm}
          </button>
        </form>
      )}
    </div>
  );
}
