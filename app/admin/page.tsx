'use client';

import { useEffect, useState } from 'react';

interface ArtistCount {
  artist: string;
  count: number;
}

type OfficialStatus = 'unofficial' | 'pending' | 'official';

interface Artist {
  id: number;
  slug: string;
  artistName: string;
  fandomName: string | null;
  agency: string | null;
  officialStatus: OfficialStatus;
  logoLicense: boolean;
  logoUrl: string | null;
  imageLicense: boolean;
  heroImageUrl: string | null;
  preregCount: number;
}

interface UtmRow {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  visits: number;
  conversions: number;
}

interface ReferralRow {
  referralCode: string;
  visits: number;
  conversions: number;
}

const STORAGE_KEY = 'fanuzu_admin_password';

// GET with a custom auth header can't be a plain <a href> download, so fetch
// + Blob it instead — keeps the same header-based auth as every other admin
// call rather than leaking the password into a URL/browser history.
async function downloadCsv(url: string, password: string, filename: string) {
  const res = await fetch(url, { headers: { 'x-admin-password': password } });
  if (!res.ok) return;
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

const fieldStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.14)',
  borderRadius: 8,
  padding: '7px 10px',
  color: '#FFFAFC',
  fontSize: 12.5,
  outline: 'none',
  width: '100%',
};

function ArtistRow({ artist, password, onSaved }: { artist: Artist; password: string; onSaved: (a: Artist) => void }) {
  const [fandomName, setFandomName] = useState(artist.fandomName ?? '');
  const [agency, setAgency] = useState(artist.agency ?? '');
  const [officialStatus, setOfficialStatus] = useState<OfficialStatus>(artist.officialStatus);
  const [logoLicense, setLogoLicense] = useState(artist.logoLicense);
  const [logoUrl, setLogoUrl] = useState(artist.logoUrl ?? '');
  const [imageLicense, setImageLicense] = useState(artist.imageLicense);
  const [heroImageUrl, setHeroImageUrl] = useState(artist.heroImageUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const dirty =
    fandomName !== (artist.fandomName ?? '') ||
    agency !== (artist.agency ?? '') ||
    officialStatus !== artist.officialStatus ||
    logoLicense !== artist.logoLicense ||
    logoUrl !== (artist.logoUrl ?? '') ||
    imageLicense !== artist.imageLicense ||
    heroImageUrl !== (artist.heroImageUrl ?? '');

  async function save() {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch(`/api/admin/artists/${artist.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          fandomName: fandomName || null,
          agency: agency || null,
          officialStatus,
          logoLicense,
          logoUrl: logoUrl || null,
          imageLicense,
          heroImageUrl: heroImageUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError('Save failed.');
        return;
      }
      onSaved({ ...data.artist, preregCount: artist.preregCount });
    } catch {
      setSaveError('Network error.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>{artist.artistName}</span>
          {artist.officialStatus === 'official' && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', color: '#05030B', background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)', padding: '2px 7px', borderRadius: 999 }}>
              OFFICIAL
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: '#9089A0' }}>{artist.preregCount.toLocaleString()} pre-registrations</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          Fandom name
          <input style={{ ...fieldStyle, marginTop: 4 }} value={fandomName} onChange={(e) => setFandomName(e.target.value)} />
        </label>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          Agency
          <input style={{ ...fieldStyle, marginTop: 4 }} value={agency} onChange={(e) => setAgency(e.target.value)} />
        </label>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          Official status
          <select
            style={{ ...fieldStyle, marginTop: 4, cursor: 'pointer' }}
            value={officialStatus}
            onChange={(e) => setOfficialStatus(e.target.value as OfficialStatus)}
          >
            <option value="unofficial">unofficial</option>
            <option value="pending">pending</option>
            <option value="official">official</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <input type="checkbox" checked={logoLicense} onChange={(e) => setLogoLicense(e.target.checked)} />
            Logo license
          </span>
          <input style={fieldStyle} placeholder="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
        </label>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <input type="checkbox" checked={imageLicense} onChange={(e) => setImageLicense(e.target.checked)} />
            Image license
          </span>
          <input style={fieldStyle} placeholder="Hero image URL" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} />
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={save}
          disabled={!dirty || saving}
          style={{
            background: dirty ? 'linear-gradient(135deg,#FF7DDD,#9B7CFF)' : 'rgba(255,255,255,.08)',
            color: dirty ? '#05030B' : '#6B6478',
            fontWeight: 700,
            fontSize: 12.5,
            padding: '8px 16px',
            border: 'none',
            borderRadius: 8,
            cursor: dirty ? 'pointer' : 'default',
          }}
        >
          {saving ? 'Saving···' : 'Save'}
        </button>
        <button
          onClick={() => downloadCsv(`/api/admin/export?artistId=${artist.id}`, password, `fanuzu-${artist.slug}.csv`)}
          style={{
            background: 'transparent',
            color: '#9089A0',
            fontWeight: 600,
            fontSize: 12.5,
            padding: '8px 16px',
            border: '1px solid rgba(255,255,255,.14)',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Export CSV
        </button>
        {saveError && <span style={{ fontSize: 12, color: '#FF7DDD' }}>{saveError}</span>}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [counts, setCounts] = useState<ArtistCount[] | null>(null);
  const [total, setTotal] = useState(0);
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [utm, setUtm] = useState<UtmRow[] | null>(null);
  const [referrals, setReferrals] = useState<ReferralRow[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin — FANUZU';
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      loadAll(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll(pw: string) {
    setLoading(true);
    setError('');
    try {
      const [statsRes, artistsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'x-admin-password': pw } }),
        fetch('/api/admin/artists', { headers: { 'x-admin-password': pw } }),
        fetch('/api/admin/analytics', { headers: { 'x-admin-password': pw } }),
      ]);
      if (statsRes.status === 401 || artistsRes.status === 401 || analyticsRes.status === 401) {
        setError('Incorrect password.');
        sessionStorage.removeItem(STORAGE_KEY);
        setCounts(null);
        setArtists(null);
        setUtm(null);
        setReferrals(null);
        return;
      }
      if (statsRes.status === 503 || artistsRes.status === 503 || analyticsRes.status === 503) {
        setError('ADMIN_PASSWORD is not configured on the server.');
        return;
      }
      const statsData = await statsRes.json();
      const artistsData = await artistsRes.json();
      const analyticsData = await analyticsRes.json();
      if (!statsRes.ok || !artistsRes.ok || !analyticsRes.ok) {
        setError('Something went wrong loading admin data.');
        return;
      }
      setCounts(statsData.counts);
      setTotal(statsData.total);
      setArtists(artistsData.artists);
      setUtm(analyticsData.utm);
      setReferrals(analyticsData.referrals);
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
    if (passwordInput.trim()) loadAll(passwordInput.trim());
  }

  function handleArtistSaved(updated: Artist) {
    setArtists((prev) => (prev ? prev.map((a) => (a.id === updated.id ? updated : a)) : prev));
  }

  const maxCount = counts && counts.length > 0 ? counts[0].count : 1;
  const authed = !!password && !!counts && !!artists && !!utm && !!referrals;

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
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>FANUZU Admin</h1>
            <p style={{ fontSize: 14, color: '#9089A0', margin: 0 }}>Artist registry & pre-registration stats</p>
          </div>
          {authed && (
            <button
              onClick={() => downloadCsv('/api/admin/export', password, 'fanuzu-all.csv')}
              style={{
                background: 'transparent',
                color: '#9089A0',
                fontWeight: 600,
                fontSize: 12.5,
                padding: '8px 16px',
                border: '1px solid rgba(255,255,255,.14)',
                borderRadius: 8,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Export all CSV
            </button>
          )}
        </div>

        {!authed && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 360 }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Admin password"
              autoFocus
              style={{ ...fieldStyle, padding: '12px 14px', fontSize: 14 }}
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
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? '···' : 'Enter'}
            </button>
          </form>
        )}

        {error && <p style={{ color: '#FF7DDD', fontSize: 13, marginTop: 12 }}>{error}</p>}

        {authed && (
          <>
            <div style={{ marginTop: 8, marginBottom: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Artist registry</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                Only artists with official status = <code>official</code> show the OFFICIAL badge. Logo/image assets stay
                hidden until their own license checkbox is on — flipping official status alone never unlocks an asset.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {artists!.map((a) => (
                  <ArtistRow key={a.id} artist={a} password={password} onSaved={handleArtistSaved} />
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Pre-registrations by artist</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                Every name a fan has typed in, registry or not.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#9089A0' }}>{counts!.length} artists</span>
                <span style={{ fontSize: 13, color: '#9089A0' }}>{total.toLocaleString()} total pre-registrations</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {counts!.map((c) => (
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
                {counts!.length === 0 && <p style={{ color: '#6B6478', fontSize: 13 }}>No pre-registrations yet.</p>}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Traffic & referrals</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                Visits are recorded on landing; conversions are pre-registrations that carried the same source.
              </p>

              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#B8B0C8', margin: '0 0 10px' }}>UTM breakdown</h3>
              <div style={{ overflowX: 'auto', marginBottom: 28 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>Source</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>Medium</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>Campaign</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>Visits</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600, textAlign: 'right' }}>Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utm!.map((row, i) => (
                      <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                        <td style={{ padding: '8px 12px 8px 0', fontWeight: 600 }}>{row.utmSource || '(none)'}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{row.utmMedium || '—'}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{row.utmCampaign || '—'}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>{row.visits.toLocaleString()}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{row.conversions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {utm!.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>No tracked traffic yet.</p>}
              </div>

              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#B8B0C8', margin: '0 0 10px' }}>Referral leaderboard</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>Invite code</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>Visits</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600, textAlign: 'right' }}>Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals!.map((row) => (
                      <tr key={row.referralCode} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                        <td style={{ padding: '8px 12px 8px 0', fontWeight: 700, fontFamily: 'monospace' }}>{row.referralCode}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>{row.visits.toLocaleString()}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{row.conversions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {referrals!.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>No referral activity yet.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
