import type { ReactNode } from 'react';
import Logo from '@/components/landing/Logo';

export default function LegalLayout({
  eyebrow,
  title,
  effective,
  children,
}: {
  eyebrow: string;
  title: string;
  effective: string;
  children: ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#05030B', color: '#FFFAFC', fontFamily: 'Pretendard,Inter,system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 100px' }}>
        <div style={{ marginBottom: 40 }}>
          <Logo size={26} fontSize={19} gap={7} />
        </div>
        <div style={{ fontSize: 12, letterSpacing: '.12em', color: '#FF7DDD', fontWeight: 700, marginBottom: 12 }}>{eyebrow}</div>
        <h1 style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, lineHeight: 1.3, margin: '0 0 10px', color: '#FFFAFC' }}>{title}</h1>
        <div style={{ fontSize: 13, color: '#6B6478', marginBottom: 40 }}>{effective}</div>
        <div style={{ fontSize: 15, lineHeight: 1.75, color: '#D8D2E0' }}>{children}</div>
      </div>
    </div>
  );
}

export function InfoBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg,rgba(255,125,221,.14),rgba(155,124,255,.1))',
        border: '1px solid rgba(255,125,221,.22)',
        borderRadius: 16,
        padding: '18px 22px',
        fontSize: 14,
        lineHeight: 1.7,
        color: '#FFFAFC',
      }}
    >
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', color: '#FF7DDD', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

export function Article({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFAFC', margin: '0 0 14px', display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <span style={{ color: '#7CE8FF', fontSize: 13, fontWeight: 700 }}>{n}</span>
        {title}
      </h2>
      <div className="legal-article">{children}</div>
      <style>{`
        .legal-article p { margin: 0 0 12px; }
        .legal-article p:last-child { margin-bottom: 0; }
        .legal-article ul { margin: 0; padding-left: 20px; }
        .legal-article li { margin-bottom: 8px; }
        .legal-article li:last-child { margin-bottom: 0; }
      `}</style>
    </section>
  );
}

export function DefTerm({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 14 }}>
      <div style={{ flex: '0 0 150px', fontWeight: 600, color: '#FFFAFC' }}>{term}</div>
      <div style={{ color: '#B8AFC4' }}>{children}</div>
    </div>
  );
}

export function LegalTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', margin: '14px 0', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,.04)',
                  color: '#FFFAFC',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255,255,255,.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: '12px 14px',
                    color: '#B8AFC4',
                    borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
                    verticalAlign: 'top',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
