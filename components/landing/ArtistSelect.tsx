'use client';

import { useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';
import { POPULAR_ARTISTS } from '@/lib/artists';
import ArtistRanking from './ArtistRanking';

const pillStyle: React.CSSProperties = {
  background: 'linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02))',
  border: '1px solid rgba(255,255,255,.12)',
  borderRadius: 14,
  padding: '17px 10px',
  color: '#FFFAFC',
  fontSize: 'clamp(12px,3.6vw,14.5px)',
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  textAlign: 'center',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
};

export default function ArtistSelect({
  onConfirm,
  headingId,
}: {
  onConfirm: (artist: string) => void;
  headingId?: string;
}) {
  const { tr } = useLang();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
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
          marginBottom: 18,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7DDD', flex: '0 0 auto' }} />
        {tr.prereg.statusBadge}
      </div>
      <h2
        id={headingId}
        className="gradient-text"
        style={{
          fontSize: 'clamp(28px,4.6vw,38px)',
          lineHeight: 1.3,
          fontWeight: 800,
          margin: '0 0 12px',
          backgroundImage: 'linear-gradient(90deg,#FFFAFC,var(--planet-a1) 60%,var(--planet-a2))',
        }}
      >
        ✨ {tr.prereg.selectTitle}
      </h2>
      <p style={{ fontSize: 14.5, color: '#B8AFC4', margin: '0 0 22px' }}>{tr.prereg.selectSub}</p>

      <ArtistRanking />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
          gap: 10,
          textAlign: 'left',
        }}
      >
        {POPULAR_ARTISTS.map((artist, i) => (
          <button
            key={artist}
            onClick={() => onConfirm(artist)}
            className="artist-pill"
            style={{ ...pillStyle, animation: `fadeUp .4s ease-out ${Math.min(i, 12) * 0.03}s both` }}
          >
            {artist}
          </button>
        ))}
        <button
          onClick={() => setShowCustomInput(true)}
          className="artist-pill"
          style={{
            ...pillStyle,
            color: '#B8AFC4',
            border: '1px dashed rgba(255,255,255,.16)',
            animation: `fadeUp .4s ease-out ${Math.min(POPULAR_ARTISTS.length, 12) * 0.03}s both`,
          }}
        >
          {tr.prereg.selectOther}
        </button>
      </div>

      {showCustomInput && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customText.trim()) onConfirm(customText.trim());
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
