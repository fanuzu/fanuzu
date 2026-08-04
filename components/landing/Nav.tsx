'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';

export default function Nav() {
  const { tr, lang, setLang, langList } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    const onResize = () => setIsNarrow(window.innerWidth < 1180);
    onResize();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const navBg = isScrolled ? 'rgba(10,6,19,.72)' : 'transparent';
  const navBlur = isScrolled ? 'blur(20px) saturate(160%)' : 'none';
  const navBorder = isScrolled ? '1px solid rgba(255,255,255,.08)' : '1px solid transparent';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: navBg,
        backdropFilter: navBlur,
        WebkitBackdropFilter: navBlur,
        borderBottom: navBorder,
        transition: 'all .35s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          FAN<span style={{ color: '#FF7DDD' }}>UZ</span>U
        </div>
        <div
          style={{
            display: isNarrow ? 'none' : 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 13.5,
            color: '#B8AFC4',
          }}
        >
          <a href="#why" style={{ color: '#B8AFC4', textDecoration: 'none', whiteSpace: 'nowrap' }}>{tr.nav.why}</a>
          <a href="#experience" style={{ color: '#B8AFC4', textDecoration: 'none', whiteSpace: 'nowrap' }}>{tr.nav.exp}</a>
          <a href="#system" style={{ color: '#B8AFC4', textDecoration: 'none', whiteSpace: 'nowrap' }}>{tr.nav.system}</a>
          <a href="#passport" style={{ color: '#B8AFC4', textDecoration: 'none', whiteSpace: 'nowrap' }}>{tr.nav.passport}</a>
          <a href="#origin" style={{ color: '#B8AFC4', textDecoration: 'none', whiteSpace: 'nowrap' }}>{tr.nav.origin}</a>
          <a href="#prereg" style={{ color: '#B8AFC4', textDecoration: 'none', whiteSpace: 'nowrap' }}>{tr.nav.prereg}</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              gap: 4,
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 999,
              padding: 4,
            }}
          >
            {langList.map((lg) => (
              <button
                key={lg.code}
                onClick={() => setLang(lg.code)}
                style={{
                  border: 'none',
                  background: lg.code === lang ? 'linear-gradient(135deg,#FF7DDD,#9B7CFF)' : 'transparent',
                  color: lg.code === lang ? '#05030B' : '#B8AFC4',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '6px 9px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {lg.label}
              </button>
            ))}
          </div>
          <a
            href="#prereg"
            style={{
              background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
              color: '#05030B',
              fontWeight: 700,
              fontSize: 14,
              padding: '10px 18px',
              borderRadius: 999,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {tr.nav.cta}
          </a>
        </div>
      </div>
    </nav>
  );
}
