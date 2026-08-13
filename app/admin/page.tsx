'use client';

import { useEffect, useState } from 'react';

interface ArtistCount {
  artist: string;
  count: number;
}

const STORAGE_KEY = 'fanuzu_admin_password';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [counts, setCounts] = useState<ArtistCount[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin — FANUZU';
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      fetchStats(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchStats(pw: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', { headers: { 'x-admin-password': pw } });
      if (res.status === 401) {
        setError('Incorrect password.');
        sessionStorage.removeItem(STORAGE_KEY);
        setCounts(null);
        return;
      }
      if (res.status === 503) {
        setError('ADMIN_PASSWORD is not configured on the server.');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError('Something went wrong loading stats.');
        return;
      }
      setCounts(data.counts);
      setTotal(data.total);
      sessionStorage.setItem(STORAGE_KEY, pw);
      setPassword(pw);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput.trim()) fetchStats(passwordInput.trim());
  }

  const maxCount = counts && counts.length > 0 ? counts[0].count : 1;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#05030B',
        color: '#FFFAFC',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>FANUZU Admin</h1>
        <p style={{ fontSize: 14, color: '#9089A0', margin: '0 0 32px' }}>Pre-registrations by artist</p>

        {!password || !counts ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 360 }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Admin password"
              autoFocus
              style={{
                flex: 1,
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.14)',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFAFC',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                color: '#05030B',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 20px',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '···' : 'Enter'}
            </button>
          </form>
        ) : null}

        {error && <p style={{ color: '#FF7DDD', fontSize: 13, marginTop: 12 }}>{error}</p>}

        {counts && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: '#9089A0' }}>{counts.length} artists</span>
              <span style={{ fontSize: 13, color: '#9089A0' }}>{total.toLocaleString()} total pre-registrations</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {counts.map((c) => (
                <div key={c.artist} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 140, flex: '0 0 auto', fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.artist}
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 6, overflow: 'hidden', height: 22 }}>
                    <div
                      style={{
                        width: `${Math.max(2, (c.count / maxCount) * 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg,#FF7DDD,#9B7CFF)',
                        borderRadius: 6,
                      }}
                    />
                  </div>
                  <div style={{ width: 56, flex: '0 0 auto', textAlign: 'right', fontSize: 13.5, fontWeight: 700 }}>
                    {c.count.toLocaleString()}
                  </div>
                </div>
              ))}
              {counts.length === 0 && <p style={{ color: '#6B6478', fontSize: 13 }}>No pre-registrations yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
