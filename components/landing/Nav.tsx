'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';
import Logo from './Logo';

export default function Nav() {
  const { tr, lang, setLang, langList } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [langOpen]);

  const currentLangLabel = langList.find((lg) => lg.code === lang)?.label ?? lang;

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
        <Logo spin />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div ref={langMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              aria-label="Choose language"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: '1px solid rgba(255,255,255,.1)',
                background: 'rgba(255,255,255,.06)',
                color: '#FFFAFC',
                fontSize: 12,
                fontWeight: 600,
                padding: '8px 12px',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {currentLangLabel}
              <span style={{ fontSize: 9, color: '#B8AFC4', transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s ease' }}>▾</span>
            </button>
            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'rgba(10,6,19,.95)',
                  backdropFilter: 'blur(20px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                  border: '1px solid rgba(255,255,255,.12)',
                  borderRadius: 14,
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minWidth: 120,
                  boxShadow: '0 20px 40px rgba(0,0,0,.4)',
                }}
              >
                {langList.map((lg) => (
                  <button
                    key={lg.code}
                    onClick={() => {
                      setLang(lg.code);
                      setLangOpen(false);
                    }}
                    style={{
                      border: 'none',
                      background: lg.code === lang ? 'linear-gradient(135deg,#FF7DDD,#9B7CFF)' : 'transparent',
                      color: lg.code === lang ? '#05030B' : '#B8AFC4',
                      fontSize: 12.5,
                      fontWeight: 600,
                      padding: '8px 12px',
                      borderRadius: 9,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    {lg.label}
                  </button>
                ))}
              </div>
            )}
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
