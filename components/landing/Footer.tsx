'use client';

import { useLang } from '@/components/providers/LangProvider';

export default function Footer() {
  const { tr } = useLang();

  return (
    <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,.08)', padding: '44px 24px 60px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
            FAN<span style={{ color: '#FF7DDD' }}>UZ</span>U
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#6B6478', margin: '0 0 4px' }}>{tr.footer.company}</p>
          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#6B6478', margin: '0 0 4px' }}>{tr.footer.address}</p>
          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#6B6478', margin: 0 }}>{tr.footer.contact}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
          <a href="/privacy" style={{ color: '#B8AFC4', textDecoration: 'none' }}>{tr.footer.privacy}</a>
          <a href="/terms" style={{ color: '#B8AFC4', textDecoration: 'none' }}>{tr.footer.terms}</a>
        </div>
      </div>
      <div style={{ maxWidth: 1180, margin: '26px auto 0', fontSize: 12, color: '#6B6478' }}>{tr.footer.copyright}</div>
    </footer>
  );
}
