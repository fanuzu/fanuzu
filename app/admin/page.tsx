'use client';

import { Fragment, useEffect, useState } from 'react';

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
  preregGoal: number | null;
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

interface CountryRow {
  country: string;
  count: number;
}

interface ReferralProgramSummary {
  total: number;
  referred: number;
  direct: number;
}

interface ReferrerRow {
  referrerId: number;
  referralCode: string;
  email: string;
  referredCount: number;
  pendingPop: number;
  paidPop: number;
}

interface ReferralSearchRow {
  id: number;
  email: string;
  referralCode: string;
  referredByCode: string | null;
  isReferred: boolean;
  rewardAmount: number;
  rewardStatus: string;
  createdAt: string;
  emailVerified: boolean;
  excludedFromRanking: boolean;
}

interface BasePartnerRow {
  id: number;
  name: string;
  xHandle: string | null;
  fandom: string;
  code: string;
  targetCount: number | null;
  isActive: boolean;
  preregCount: number;
  achievementPct: number | null;
  createdAt: string;
}

interface SuspiciousRow {
  id: number;
  email: string;
  artistName: string;
  ip: string;
  createdAt: string;
  windowCount: number;
}

interface TrendPoint {
  day: string;
  count: number;
}

type RankingEventStatus = 'draft' | 'active' | 'finalized';
type VisibilityMode = 'manual' | 'auto';

interface RankingEvent {
  id: number;
  name: string;
  startAt: string | null;
  endAt: string | null;
  visibilityMode: VisibilityMode;
  isVisible: boolean;
  includeExistingRegistrants: boolean;
  rewardFirst: number;
  rewardSecond: number;
  rewardThird: number;
  rewardFourthToTenth: number;
  status: RankingEventStatus;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  const [preregGoal, setPreregGoal] = useState(artist.preregGoal !== null ? String(artist.preregGoal) : '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const dirty =
    fandomName !== (artist.fandomName ?? '') ||
    agency !== (artist.agency ?? '') ||
    officialStatus !== artist.officialStatus ||
    logoLicense !== artist.logoLicense ||
    logoUrl !== (artist.logoUrl ?? '') ||
    imageLicense !== artist.imageLicense ||
    heroImageUrl !== (artist.heroImageUrl ?? '') ||
    preregGoal !== (artist.preregGoal !== null ? String(artist.preregGoal) : '');

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
          preregGoal: preregGoal.trim() ? Number(preregGoal.trim()) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError('저장에 실패했습니다.');
        return;
      }
      onSaved({ ...data.artist, preregCount: artist.preregCount });
    } catch {
      setSaveError('네트워크 오류입니다.');
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
        <span style={{ fontSize: 12, color: '#9089A0' }}>사전등록 {artist.preregCount.toLocaleString()}건</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          팬덤명
          <input style={{ ...fieldStyle, marginTop: 4 }} value={fandomName} onChange={(e) => setFandomName(e.target.value)} />
        </label>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          소속사
          <input style={{ ...fieldStyle, marginTop: 4 }} value={agency} onChange={(e) => setAgency(e.target.value)} />
        </label>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          공식 상태
          <select
            style={{ ...fieldStyle, marginTop: 4, cursor: 'pointer' }}
            value={officialStatus}
            onChange={(e) => setOfficialStatus(e.target.value as OfficialStatus)}
          >
            <option value="unofficial">비공식</option>
            <option value="pending">검토 중</option>
            <option value="official">공식</option>
          </select>
        </label>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          공개 목표 인원 (선택)
          <input
            style={{ ...fieldStyle, marginTop: 4 }}
            type="number"
            min="0"
            placeholder="설정 전까지 숨김"
            value={preregGoal}
            onChange={(e) => setPreregGoal(e.target.value)}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <input type="checkbox" checked={logoLicense} onChange={(e) => setLogoLicense(e.target.checked)} />
            로고 라이선스
          </span>
          <input style={fieldStyle} placeholder="로고 URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
        </label>
        <label style={{ fontSize: 11, color: '#9089A0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <input type="checkbox" checked={imageLicense} onChange={(e) => setImageLicense(e.target.checked)} />
            이미지 라이선스
          </span>
          <input style={fieldStyle} placeholder="대표 이미지 URL" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} />
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
          {saving ? '저장 중···' : '저장'}
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
          CSV 내보내기
        </button>
        {saveError && <span style={{ fontSize: 12, color: '#FF7DDD' }}>{saveError}</span>}
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<RankingEventStatus, string> = {
  draft: '초안',
  active: '진행중',
  finalized: '확정됨',
};
const STATUS_COLOR: Record<RankingEventStatus, string> = {
  draft: '#9089A0',
  active: '#7CE8FF',
  finalized: '#FF7DDD',
};

function fmtKrw(n: number): string {
  return `${n.toLocaleString()}원`;
}

function RankingEventRow({
  event,
  onUpdate,
  onFinalize,
}: {
  event: RankingEvent;
  onUpdate: (id: number, patch: Record<string, unknown>) => void;
  onFinalize: (id: number, name: string) => void;
}) {
  return (
    <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>{event.name}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.05em',
              color: STATUS_COLOR[event.status],
              border: `1px solid ${STATUS_COLOR[event.status]}`,
              padding: '2px 7px',
              borderRadius: 999,
            }}
          >
            {STATUS_LABEL[event.status]}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {event.status === 'draft' && (
            <button
              onClick={() => onUpdate(event.id, { status: 'active' })}
              style={{
                background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                color: '#05030B',
                fontWeight: 700,
                fontSize: 11.5,
                padding: '6px 12px',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              진행 시작
            </button>
          )}
          {event.status === 'active' && event.visibilityMode === 'manual' && (
            <button
              onClick={() => onUpdate(event.id, { isVisible: !event.isVisible })}
              style={{
                background: event.isVisible ? 'rgba(124,232,255,.12)' : 'rgba(255,255,255,.06)',
                border: `1px solid ${event.isVisible ? 'rgba(124,232,255,.4)' : 'rgba(255,255,255,.14)'}`,
                color: event.isVisible ? '#7CE8FF' : '#6B6478',
                fontSize: 11.5,
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {event.isVisible ? '공개 중' : '비공개'}
            </button>
          )}
          {event.status === 'active' && (
            <button
              onClick={() => onFinalize(event.id, event.name)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,125,221,.3)',
                color: '#FF7DDD',
                fontSize: 11.5,
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              결과 확정
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, fontSize: 12, color: '#9089A0' }}>
        <div>
          시작일 {event.startAt ? new Date(event.startAt).toLocaleString() : '미설정'}
        </div>
        <div>
          종료일 {event.endAt ? new Date(event.endAt).toLocaleString() : '미설정'}
        </div>
        <div>공개 방식 {event.visibilityMode === 'manual' ? '관리자 결정' : '시작일 자동 공개'}</div>
        <div>{event.includeExistingRegistrants ? '기존 사전등록자 포함' : '이벤트 시작 이후 등록자만'}</div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: '#B8B0C8' }}>
        1위 {fmtKrw(event.rewardFirst)} · 2위 {fmtKrw(event.rewardSecond)} · 3위 {fmtKrw(event.rewardThird)} · 4~10위(각)
        {' '}
        {fmtKrw(event.rewardFourthToTenth)}
      </div>
    </div>
  );
}

function RankingEventPanel({
  events,
  error,
  saving,
  newEventName,
  setNewEventName,
  newEventStartAt,
  setNewEventStartAt,
  newEventEndAt,
  setNewEventEndAt,
  newEventVisibilityMode,
  setNewEventVisibilityMode,
  newEventIncludeExisting,
  setNewEventIncludeExisting,
  newEventRewardFirst,
  setNewEventRewardFirst,
  newEventRewardSecond,
  setNewEventRewardSecond,
  newEventRewardThird,
  setNewEventRewardThird,
  newEventRewardRest,
  setNewEventRewardRest,
  onCreate,
  onUpdate,
  onFinalize,
}: {
  events: RankingEvent[] | null;
  error: string;
  saving: boolean;
  newEventName: string;
  setNewEventName: (v: string) => void;
  newEventStartAt: string;
  setNewEventStartAt: (v: string) => void;
  newEventEndAt: string;
  setNewEventEndAt: (v: string) => void;
  newEventVisibilityMode: VisibilityMode;
  setNewEventVisibilityMode: (v: VisibilityMode) => void;
  newEventIncludeExisting: boolean;
  setNewEventIncludeExisting: (v: boolean) => void;
  newEventRewardFirst: string;
  setNewEventRewardFirst: (v: string) => void;
  newEventRewardSecond: string;
  setNewEventRewardSecond: (v: string) => void;
  newEventRewardThird: string;
  setNewEventRewardThird: (v: string) => void;
  newEventRewardRest: string;
  setNewEventRewardRest: (v: string) => void;
  onCreate: (e: React.FormEvent) => void;
  onUpdate: (id: number, patch: Record<string, unknown>) => void;
  onFinalize: (id: number, name: string) => void;
}) {
  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>랭킹전 관리</h2>
      <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
        팬덤별 사전등록 랭킹 이벤트를 만들고 공개 여부·보상·참여 자격을 설정합니다. 랭킹 집계는 이메일 인증을 완료하고
        공식 레지스트리에 연결된 아티스트로 등록한 사전등록만 포함됩니다 (관리자 승인 전 자유 입력 아티스트명은
        제외). "결과 확정"을 누르면 그 시점의 순위가 영구히 고정되며 되돌릴 수 없습니다.
      </p>

      {error && <p style={{ color: '#FF7DDD', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <form onSubmit={onCreate} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginBottom: 10 }}>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            이벤트명
            <input
              style={{ ...fieldStyle, marginTop: 4 }}
              placeholder="예: FANUZU GENESIS"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
            />
          </label>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            시작일 (선택)
            <input
              style={{ ...fieldStyle, marginTop: 4 }}
              type="datetime-local"
              value={newEventStartAt}
              onChange={(e) => setNewEventStartAt(e.target.value)}
            />
          </label>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            종료일 (선택)
            <input
              style={{ ...fieldStyle, marginTop: 4 }}
              type="datetime-local"
              value={newEventEndAt}
              onChange={(e) => setNewEventEndAt(e.target.value)}
            />
          </label>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            공개 방식
            <select
              style={{ ...fieldStyle, marginTop: 4, cursor: 'pointer' }}
              value={newEventVisibilityMode}
              onChange={(e) => setNewEventVisibilityMode(e.target.value as VisibilityMode)}
            >
              <option value="manual">관리자가 공개 시점 결정</option>
              <option value="auto">이벤트 시작일 자동 공개</option>
            </select>
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9089A0', marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={newEventIncludeExisting}
            onChange={(e) => setNewEventIncludeExisting(e.target.checked)}
          />
          기존 사전등록자 포함 (해제 시 이벤트 시작일 이후 등록자만 집계)
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            1위 보상 (원)
            <input
              style={{ ...fieldStyle, marginTop: 4 }}
              type="number"
              min="0"
              value={newEventRewardFirst}
              onChange={(e) => setNewEventRewardFirst(e.target.value)}
            />
          </label>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            2위 보상 (원)
            <input
              style={{ ...fieldStyle, marginTop: 4 }}
              type="number"
              min="0"
              value={newEventRewardSecond}
              onChange={(e) => setNewEventRewardSecond(e.target.value)}
            />
          </label>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            3위 보상 (원)
            <input
              style={{ ...fieldStyle, marginTop: 4 }}
              type="number"
              min="0"
              value={newEventRewardThird}
              onChange={(e) => setNewEventRewardThird(e.target.value)}
            />
          </label>
          <label style={{ fontSize: 11, color: '#9089A0' }}>
            4~10위 보상 (원, 각각)
            <input
              style={{ ...fieldStyle, marginTop: 4 }}
              type="number"
              min="0"
              value={newEventRewardRest}
              onChange={(e) => setNewEventRewardRest(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving || !newEventName.trim()}
          style={{
            background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
            color: '#05030B',
            fontWeight: 700,
            fontSize: 12.5,
            padding: '8px 18px',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? '···' : '랭킹전 만들기'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {events?.map((ev) => (
          <RankingEventRow key={ev.id} event={ev} onUpdate={onUpdate} onFinalize={onFinalize} />
        ))}
        {events?.length === 0 && <p style={{ color: '#6B6478', fontSize: 13 }}>아직 만들어진 랭킹전이 없습니다.</p>}
        {events === null && <p style={{ color: '#6B6478', fontSize: 13 }}>불러오는 중···</p>}
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
  const [countries, setCountries] = useState<CountryRow[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [referralSummary, setReferralSummary] = useState<ReferralProgramSummary | null>(null);
  const [referrerLeaderboard, setReferrerLeaderboard] = useState<ReferrerRow[] | null>(null);
  const [referralRows, setReferralRows] = useState<ReferralSearchRow[] | null>(null);
  const [referralProgramError, setReferralProgramError] = useState('');
  const [referralProgramLoading, setReferralProgramLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [hasReferralFilter, setHasReferralFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [basePartners, setBasePartners] = useState<BasePartnerRow[] | null>(null);
  const [basePartnerError, setBasePartnerError] = useState('');
  const [basePartnerSaving, setBasePartnerSaving] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerXHandle, setNewPartnerXHandle] = useState('');
  const [newPartnerFandom, setNewPartnerFandom] = useState('');
  const [newPartnerTarget, setNewPartnerTarget] = useState('');
  const [trendForCode, setTrendForCode] = useState<string | null>(null);
  const [trendPoints, setTrendPoints] = useState<TrendPoint[] | null>(null);
  const [trendLoading, setTrendLoading] = useState(false);

  const [suspicious, setSuspicious] = useState<SuspiciousRow[] | null>(null);

  const [rankingEvents, setRankingEvents] = useState<RankingEvent[] | null>(null);
  const [rankingEventsError, setRankingEventsError] = useState('');
  const [rankingEventSaving, setRankingEventSaving] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventStartAt, setNewEventStartAt] = useState('');
  const [newEventEndAt, setNewEventEndAt] = useState('');
  const [newEventVisibilityMode, setNewEventVisibilityMode] = useState<VisibilityMode>('manual');
  const [newEventIncludeExisting, setNewEventIncludeExisting] = useState(true);
  const [newEventRewardFirst, setNewEventRewardFirst] = useState('1000000');
  const [newEventRewardSecond, setNewEventRewardSecond] = useState('500000');
  const [newEventRewardThird, setNewEventRewardThird] = useState('300000');
  const [newEventRewardRest, setNewEventRewardRest] = useState('100000');

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
        setError('비밀번호가 올바르지 않습니다.');
        sessionStorage.removeItem(STORAGE_KEY);
        setCounts(null);
        setArtists(null);
        setUtm(null);
        setReferrals(null);
        setCountries(null);
        setSuspicious(null);
        return;
      }
      if (statsRes.status === 503 || artistsRes.status === 503 || analyticsRes.status === 503) {
        setError('서버에 ADMIN_PASSWORD가 설정되어 있지 않습니다.');
        return;
      }
      const statsData = await statsRes.json();
      const artistsData = await artistsRes.json();
      const analyticsData = await analyticsRes.json();
      if (!statsRes.ok || !artistsRes.ok || !analyticsRes.ok) {
        setError('관리자 데이터를 불러오는 중 문제가 발생했습니다.');
        return;
      }
      setCounts(statsData.counts);
      setTotal(statsData.total);
      setArtists(artistsData.artists);
      setUtm(analyticsData.utm);
      setReferrals(analyticsData.referrals);
      setCountries(analyticsData.countries);
      setSuspicious(analyticsData.suspicious);
      sessionStorage.setItem(STORAGE_KEY, pw);
      setPassword(pw);
      loadReferralProgram(pw, {});
      loadBasePartners(pw);
      loadRankingEvents(pw);
    } catch {
      setError('네트워크 오류입니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  async function loadBasePartners(pw: string) {
    setBasePartnerError('');
    try {
      const res = await fetch('/api/admin/base-partners', { headers: { 'x-admin-password': pw } });
      if (!res.ok) {
        setBasePartnerError('팬베이스 파트너를 불러오지 못했습니다.');
        return;
      }
      const data = await res.json();
      setBasePartners(data.partners);
    } catch {
      setBasePartnerError('네트워크 오류입니다. 다시 시도해주세요.');
    }
  }

  async function loadRankingEvents(pw: string) {
    setRankingEventsError('');
    try {
      const res = await fetch('/api/admin/ranking-events', { headers: { 'x-admin-password': pw } });
      if (!res.ok) {
        setRankingEventsError('랭킹전을 불러오지 못했습니다.');
        return;
      }
      const data = await res.json();
      setRankingEvents(data.events);
    } catch {
      setRankingEventsError('네트워크 오류입니다. 다시 시도해주세요.');
    }
  }

  async function handleCreateRankingEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEventName.trim()) return;
    setRankingEventSaving(true);
    setRankingEventsError('');
    try {
      const res = await fetch('/api/admin/ranking-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          name: newEventName.trim(),
          startAt: newEventStartAt || null,
          endAt: newEventEndAt || null,
          visibilityMode: newEventVisibilityMode,
          includeExistingRegistrants: newEventIncludeExisting,
          rewardFirst: Number(newEventRewardFirst) || 0,
          rewardSecond: Number(newEventRewardSecond) || 0,
          rewardThird: Number(newEventRewardThird) || 0,
          rewardFourthToTenth: Number(newEventRewardRest) || 0,
        }),
      });
      if (!res.ok) {
        setRankingEventsError('랭킹전을 만들지 못했습니다.');
        return;
      }
      setNewEventName('');
      setNewEventStartAt('');
      setNewEventEndAt('');
      loadRankingEvents(password);
    } catch {
      setRankingEventsError('네트워크 오류입니다. 다시 시도해주세요.');
    } finally {
      setRankingEventSaving(false);
    }
  }

  async function handleUpdateRankingEvent(id: number, patch: Record<string, unknown>) {
    setRankingEventsError('');
    try {
      const res = await fetch(`/api/admin/ranking-events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        setRankingEventsError('랭킹전을 수정하지 못했습니다.');
        return;
      }
      loadRankingEvents(password);
    } catch {
      setRankingEventsError('네트워크 오류입니다. 다시 시도해주세요.');
    }
  }

  async function handleFinalizeRankingEvent(id: number, name: string) {
    if (!window.confirm(`"${name}" 랭킹전을 확정할까요? 확정 후에는 결과가 고정되며 되돌릴 수 없습니다.`)) return;
    setRankingEventsError('');
    try {
      const res = await fetch(`/api/admin/ranking-events/${id}/finalize`, {
        method: 'POST',
        headers: { 'x-admin-password': password },
      });
      if (!res.ok) {
        setRankingEventsError('랭킹전을 확정하지 못했습니다.');
        return;
      }
      loadRankingEvents(password);
    } catch {
      setRankingEventsError('네트워크 오류입니다. 다시 시도해주세요.');
    }
  }

  async function handleToggleExcludedFromRanking(id: number, excludedFromRanking: boolean) {
    try {
      const res = await fetch(`/api/admin/preregistrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ excludedFromRanking }),
      });
      if (!res.ok) {
        window.alert('처리하지 못했습니다. 다시 시도해주세요.');
        return;
      }
      loadReferralProgram(password, { q: searchQ, hasReferral: hasReferralFilter, from: fromDate, to: toDate });
    } catch {
      window.alert('네트워크 오류입니다. 다시 시도해주세요.');
    }
  }

  async function handleCreateBasePartner(e: React.FormEvent) {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerFandom.trim()) return;
    setBasePartnerSaving(true);
    setBasePartnerError('');
    try {
      const res = await fetch('/api/admin/base-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          name: newPartnerName.trim(),
          xHandle: newPartnerXHandle.trim() || null,
          fandom: newPartnerFandom.trim(),
          targetCount: newPartnerTarget.trim() ? Number(newPartnerTarget.trim()) : null,
        }),
      });
      if (!res.ok) {
        setBasePartnerError('팬베이스 파트너를 만들지 못했습니다.');
        return;
      }
      setNewPartnerName('');
      setNewPartnerXHandle('');
      setNewPartnerFandom('');
      setNewPartnerTarget('');
      loadBasePartners(password);
    } catch {
      setBasePartnerError('네트워크 오류입니다. 다시 시도해주세요.');
    } finally {
      setBasePartnerSaving(false);
    }
  }

  async function handleToggleBasePartner(id: number, isActive: boolean) {
    setBasePartnerError('');
    try {
      const res = await fetch(`/api/admin/base-partners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) {
        setBasePartnerError('팬베이스 파트너를 수정하지 못했습니다.');
        return;
      }
      loadBasePartners(password);
    } catch {
      setBasePartnerError('네트워크 오류입니다. 다시 시도해주세요.');
    }
  }

  async function handleShowTrend(partner: BasePartnerRow) {
    if (trendForCode === partner.code) {
      setTrendForCode(null);
      setTrendPoints(null);
      return;
    }
    setTrendForCode(partner.code);
    setTrendPoints(null);
    setTrendLoading(true);
    try {
      const res = await fetch(`/api/admin/base-partners/trend?basePartnerId=${partner.id}`, {
        headers: { 'x-admin-password': password },
      });
      if (!res.ok) return;
      const data = await res.json();
      setTrendPoints(data.trend);
    } catch {
      // Trend panel just stays empty on failure — non-critical view.
    } finally {
      setTrendLoading(false);
    }
  }

  async function loadReferralProgram(
    pw: string,
    filters: { q?: string; hasReferral?: 'all' | 'yes' | 'no'; from?: string; to?: string }
  ) {
    setReferralProgramLoading(true);
    setReferralProgramError('');
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.hasReferral && filters.hasReferral !== 'all') params.set('hasReferral', filters.hasReferral);
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      const res = await fetch(`/api/admin/referral-program?${params.toString()}`, {
        headers: { 'x-admin-password': pw },
      });
      if (res.status === 401 || res.status === 503) {
        setReferralProgramError('추천인 프로그램 데이터를 불러오지 못했습니다.');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setReferralProgramError('추천인 프로그램 데이터를 불러오는 중 문제가 발생했습니다.');
        return;
      }
      setReferralSummary(data.summary);
      setReferrerLeaderboard(data.leaderboard);
      setReferralRows(data.rows);
    } catch {
      setReferralProgramError('네트워크 오류입니다. 다시 시도해주세요.');
    } finally {
      setReferralProgramLoading(false);
    }
  }

  function handleReferralSearch(e: React.FormEvent) {
    e.preventDefault();
    loadReferralProgram(password, { q: searchQ, hasReferral: hasReferralFilter, from: fromDate, to: toDate });
  }

  async function handleDeleteRegistration(id: number, email: string) {
    if (!window.confirm(`${email}의 사전등록을 영구 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/preregistrations/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      if (!res.ok && res.status !== 404) {
        window.alert('삭제하지 못했습니다. 다시 시도해주세요.');
        return;
      }
      // Re-run with current filters so the summary tiles and leaderboard
      // stay consistent instead of hand-patching several pieces of state.
      loadReferralProgram(password, { q: searchQ, hasReferral: hasReferralFilter, from: fromDate, to: toDate });
    } catch {
      window.alert('네트워크 오류입니다. 다시 시도해주세요.');
    } finally {
      setDeletingId(null);
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
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>FANUZU 관리자</h1>
            <p style={{ fontSize: 14, color: '#9089A0', margin: 0 }}>아티스트 등록 현황 및 사전등록 통계</p>
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
              전체 CSV 내보내기
            </button>
          )}
        </div>

        {!authed && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 360 }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="관리자 비밀번호"
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
              {loading ? '···' : '입장'}
            </button>
          </form>
        )}

        {error && <p style={{ color: '#FF7DDD', fontSize: 13, marginTop: 12 }}>{error}</p>}

        {authed && (
          <>
            <div style={{ marginTop: 8, marginBottom: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>아티스트 등록</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                공식 상태가 <code>official</code>인 아티스트만 OFFICIAL 뱃지가 표시됩니다. 로고/이미지는 각각의 라이선스
                체크박스가 켜져야 노출되며, 공식 상태만 바꾼다고 자산이 풀리지는 않습니다.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {artists!.map((a) => (
                  <ArtistRow key={a.id} artist={a} password={password} onSaved={handleArtistSaved} />
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>아티스트별 사전등록</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                팬이 직접 입력한 이름까지 포함한 전체 집계입니다 (레지스트리 등록 여부 무관).
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#9089A0' }}>아티스트 {counts!.length}명</span>
                <span style={{ fontSize: 13, color: '#9089A0' }}>총 사전등록 {total.toLocaleString()}건</span>
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
                {counts!.length === 0 && <p style={{ color: '#6B6478', fontSize: 13 }}>아직 사전등록이 없습니다.</p>}
              </div>
            </div>

            <RankingEventPanel
              events={rankingEvents}
              error={rankingEventsError}
              saving={rankingEventSaving}
              newEventName={newEventName}
              setNewEventName={setNewEventName}
              newEventStartAt={newEventStartAt}
              setNewEventStartAt={setNewEventStartAt}
              newEventEndAt={newEventEndAt}
              setNewEventEndAt={setNewEventEndAt}
              newEventVisibilityMode={newEventVisibilityMode}
              setNewEventVisibilityMode={setNewEventVisibilityMode}
              newEventIncludeExisting={newEventIncludeExisting}
              setNewEventIncludeExisting={setNewEventIncludeExisting}
              newEventRewardFirst={newEventRewardFirst}
              setNewEventRewardFirst={setNewEventRewardFirst}
              newEventRewardSecond={newEventRewardSecond}
              setNewEventRewardSecond={setNewEventRewardSecond}
              newEventRewardThird={newEventRewardThird}
              setNewEventRewardThird={setNewEventRewardThird}
              newEventRewardRest={newEventRewardRest}
              setNewEventRewardRest={setNewEventRewardRest}
              onCreate={handleCreateRankingEvent}
              onUpdate={handleUpdateRankingEvent}
              onFinalize={handleFinalizeRankingEvent}
            />

            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>유입 및 추천</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                방문은 랜딩 접속 시점에 기록되고, 전환은 같은 소스를 달고 들어온 사전등록을 뜻합니다.
              </p>

              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#B8B0C8', margin: '0 0 10px' }}>UTM 유입 분석</h3>
              <div style={{ overflowX: 'auto', marginBottom: 28 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>소스</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>매체</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>캠페인</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>방문</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600, textAlign: 'right' }}>전환</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utm!.map((row, i) => (
                      <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                        <td style={{ padding: '8px 12px 8px 0', fontWeight: 600 }}>{row.utmSource || '(없음)'}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{row.utmMedium || '—'}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{row.utmCampaign || '—'}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>{row.visits.toLocaleString()}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{row.conversions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {utm!.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>아직 추적된 유입이 없습니다.</p>}
              </div>

              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#B8B0C8', margin: '0 0 10px' }}>추천 링크 클릭 수</h3>
              <p style={{ fontSize: 11.5, color: '#6B6478', margin: '0 0 10px' }}>
                코드별 단순 클릭 수 대비 전환 수입니다 — 실제 추천 관계와 보상 상태는 아래 "추천인 프로그램"을 확인하세요.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>초대 코드</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>방문</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600, textAlign: 'right' }}>전환</th>
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
                {referrals!.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>아직 추천 활동이 없습니다.</p>}
              </div>

              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#B8B0C8', margin: '28px 0 10px' }}>국가별 사전등록</h3>
              <p style={{ fontSize: 11.5, color: '#6B6478', margin: '0 0 10px' }}>
                가입 시점 요청(Vercel 엣지 헤더)으로 위치를 추정한 값이며 팬에게 직접 물어보지 않습니다. "(unknown)"은
                국가를 판별하지 못한 경우입니다 (로컬 개발 환경, Vercel 외 트래픽 등).
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>국가</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600, textAlign: 'right' }}>사전등록</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries?.map((row) => (
                      <tr key={row.country} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                        <td style={{ padding: '8px 12px 8px 0', fontWeight: 700, fontFamily: 'monospace' }}>{row.country}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>{row.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {countries?.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>아직 사전등록이 없습니다.</p>}
                {countries === null && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>불러오는 중···</p>}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>추천인 프로그램</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                실제 추천인 → 피추천인 관계와 보상 상태입니다. POP은 사전등록 시점에 예약되며, 정식 출시 후 이 행이 실제
                계정과 연결되기 전까지 <code>pending</code> 상태로 유지됩니다.
              </p>

              {referralProgramError && <p style={{ color: '#FF7DDD', fontSize: 13, marginBottom: 12 }}>{referralProgramError}</p>}

              {referralSummary && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 24 }}>
                  <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#6B6478', marginBottom: 4 }}>총 사전등록</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{referralSummary.total.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#6B6478', marginBottom: 4 }}>추천을 통한 가입</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#FF7DDD' }}>{referralSummary.referred.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#6B6478', marginBottom: 4 }}>직접 가입</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{referralSummary.direct.toLocaleString()}</div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#B8B0C8', margin: '0 0 10px' }}>추천인 TOP</h3>
              <div style={{ overflowX: 'auto', marginBottom: 28 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>추천 코드</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>추천인 이메일</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>추천 인원</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>미지급 POP</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600, textAlign: 'right' }}>지급된 POP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrerLeaderboard?.map((r) => (
                      <tr key={r.referrerId} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                        <td style={{ padding: '8px 12px 8px 0', fontWeight: 700, fontFamily: 'monospace' }}>{r.referralCode}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{r.email}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>{r.referredCount.toLocaleString()}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>{r.pendingPop.toLocaleString()}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{r.paidPop.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {referrerLeaderboard?.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>아직 성사된 추천이 없습니다.</p>}
                {referrerLeaderboard === null && referralProgramLoading && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>불러오는 중···</p>}
              </div>

              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#B8B0C8', margin: '0 0 10px' }}>사전등록 검색</h3>
              <form onSubmit={handleReferralSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                <input
                  style={{ ...fieldStyle, width: 200 }}
                  placeholder="이메일 또는 추천 코드"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
                <select
                  style={{ ...fieldStyle, width: 140, cursor: 'pointer' }}
                  value={hasReferralFilter}
                  onChange={(e) => setHasReferralFilter(e.target.value as 'all' | 'yes' | 'no')}
                >
                  <option value="all">전체 가입</option>
                  <option value="yes">추천을 통한 가입</option>
                  <option value="no">직접 가입</option>
                </select>
                <input type="date" style={{ ...fieldStyle, width: 150 }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                <input type="date" style={{ ...fieldStyle, width: 150 }} value={toDate} onChange={(e) => setToDate(e.target.value)} />
                <button
                  type="submit"
                  disabled={referralProgramLoading}
                  style={{
                    background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                    color: '#05030B',
                    fontWeight: 700,
                    fontSize: 12.5,
                    padding: '0 18px',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  {referralProgramLoading ? '···' : '검색'}
                </button>
              </form>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>이메일</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>내 코드</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>추천인</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>보상</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>상태</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>이메일 인증</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>등록일</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }} />
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {referralRows?.map((r) => (
                      <tr key={r.id} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                        <td style={{ padding: '8px 12px 8px 0' }}>{r.email}</td>
                        <td style={{ padding: '8px 12px 8px 0', fontFamily: 'monospace' }}>{r.referralCode}</td>
                        <td style={{ padding: '8px 12px 8px 0', fontFamily: 'monospace', color: r.isReferred ? '#FF7DDD' : '#6B6478' }}>
                          {r.referredByCode ?? '—'}
                        </td>
                        <td style={{ padding: '8px 12px 8px 0', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.rewardAmount} POP</td>
                        <td style={{ padding: '8px 12px 8px 0', textTransform: 'capitalize' }}>{r.rewardStatus}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: r.emailVerified ? '#7CE8FF' : '#6B6478' }}>
                          {r.emailVerified ? '인증됨' : '미인증'}
                        </td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '8px 12px 8px 0', textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleExcludedFromRanking(r.id, !r.excludedFromRanking)}
                            style={{
                              background: r.excludedFromRanking ? 'rgba(255,125,221,.12)' : 'rgba(255,255,255,.06)',
                              border: `1px solid ${r.excludedFromRanking ? 'rgba(255,125,221,.4)' : 'rgba(255,255,255,.14)'}`,
                              color: r.excludedFromRanking ? '#FF7DDD' : '#6B6478',
                              fontSize: 11.5,
                              fontWeight: 600,
                              padding: '5px 10px',
                              borderRadius: 999,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {r.excludedFromRanking ? '랭킹 제외됨' : '랭킹 집계'}
                          </button>
                        </td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteRegistration(r.id, r.email)}
                            disabled={deletingId === r.id}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255,125,221,.3)',
                              color: '#FF7DDD',
                              fontSize: 11.5,
                              fontWeight: 600,
                              padding: '5px 10px',
                              borderRadius: 6,
                              cursor: deletingId === r.id ? 'default' : 'pointer',
                              opacity: deletingId === r.id ? 0.6 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {deletingId === r.id ? '···' : '삭제'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {referralRows?.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>일치하는 사전등록이 없습니다.</p>}
                {referralRows === null && referralProgramLoading && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>불러오는 중···</p>}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>팬베이스 파트너</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                팬덤 베이스 계정(X/트위터 팬 계정) 초대 코드입니다 — 위의 개인별 코드와는 별개예요. 코드는 개인 추천과
                동일하게 항상 100 POP을 지급하며, 비활성화하면 코드를 입력하지 않은 것처럼 처리되어 예전 링크를 쓰던
                사람에게도 오류 없이 넘어갑니다.
              </p>

              {basePartnerError && <p style={{ color: '#FF7DDD', fontSize: 13, marginBottom: 12 }}>{basePartnerError}</p>}

              <form
                onSubmit={handleCreateBasePartner}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}
              >
                <input
                  style={{ ...fieldStyle, width: 180 }}
                  placeholder="베이스 계정명"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                />
                <input
                  style={{ ...fieldStyle, width: 140 }}
                  placeholder="X 계정 (선택)"
                  value={newPartnerXHandle}
                  onChange={(e) => setNewPartnerXHandle(e.target.value)}
                />
                <input
                  style={{ ...fieldStyle, width: 140 }}
                  placeholder="팬덤 (예: TWS)"
                  value={newPartnerFandom}
                  onChange={(e) => setNewPartnerFandom(e.target.value)}
                />
                <input
                  style={{ ...fieldStyle, width: 120 }}
                  type="number"
                  min="0"
                  placeholder="목표 인원 (선택)"
                  value={newPartnerTarget}
                  onChange={(e) => setNewPartnerTarget(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={basePartnerSaving || !newPartnerName.trim() || !newPartnerFandom.trim()}
                  style={{
                    background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                    color: '#05030B',
                    fontWeight: 700,
                    fontSize: 12.5,
                    padding: '0 18px',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    opacity: basePartnerSaving ? 0.7 : 1,
                  }}
                >
                  {basePartnerSaving ? '···' : '생성 + 코드 발급'}
                </button>
              </form>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>코드</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>베이스 계정</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>팬덤</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>가입 수</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>목표</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>달성률</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>활성</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {basePartners?.map((p) => (
                      <Fragment key={p.id}>
                        <tr style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                          <td style={{ padding: '8px 12px 8px 0', fontWeight: 700, fontFamily: 'monospace' }}>{p.code}</td>
                          <td style={{ padding: '8px 12px 8px 0' }}>
                            {p.name}
                            {p.xHandle && <span style={{ color: '#6B6478' }}> ({p.xHandle})</span>}
                          </td>
                          <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{p.fandom}</td>
                          <td style={{ padding: '8px 0', textAlign: 'right' }}>
                            <button
                              onClick={() => handleShowTrend(p)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#7CE8FF',
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                textDecoration: 'underline',
                                padding: 0,
                              }}
                            >
                              {p.preregCount.toLocaleString()}
                            </button>
                          </td>
                          <td style={{ padding: '8px 12px 8px 0', textAlign: 'right', color: '#9089A0' }}>
                            {p.targetCount ? p.targetCount.toLocaleString() : '—'}
                          </td>
                          <td style={{ padding: '8px 12px 8px 0', textAlign: 'right', fontWeight: 700 }}>
                            {p.achievementPct !== null ? `${p.achievementPct}%` : '—'}
                          </td>
                          <td style={{ padding: '8px 12px 8px 0' }}>
                            <button
                              onClick={() => handleToggleBasePartner(p.id, !p.isActive)}
                              style={{
                                background: p.isActive ? 'rgba(124,232,255,.12)' : 'rgba(255,255,255,.06)',
                                border: `1px solid ${p.isActive ? 'rgba(124,232,255,.4)' : 'rgba(255,255,255,.14)'}`,
                                color: p.isActive ? '#7CE8FF' : '#6B6478',
                                fontSize: 11.5,
                                fontWeight: 600,
                                padding: '5px 10px',
                                borderRadius: 999,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {p.isActive ? '활성' : '비활성'}
                            </button>
                          </td>
                          <td style={{ padding: '8px 0' }} />
                        </tr>
                        {trendForCode === p.code && (
                          <tr style={{ borderTop: '1px solid rgba(255,255,255,.04)' }}>
                            <td colSpan={8} style={{ padding: '4px 0 14px' }}>
                              {trendLoading && <p style={{ color: '#6B6478', fontSize: 12.5, margin: 0 }}>일별 추이 불러오는 중···</p>}
                              {!trendLoading && trendPoints?.length === 0 && (
                                <p style={{ color: '#6B6478', fontSize: 12.5, margin: 0 }}>이 코드로 가입한 사람이 아직 없습니다.</p>
                              )}
                              {!trendLoading && trendPoints && trendPoints.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 420 }}>
                                  {trendPoints.map((pt) => (
                                    <div key={pt.day} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5 }}>
                                      <span style={{ width: 84, flex: '0 0 auto', color: '#6B6478' }}>{pt.day}</span>
                                      <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden', height: 14 }}>
                                        <div
                                          style={{
                                            width: `${Math.max(3, (pt.count / Math.max(...trendPoints.map((x) => x.count))) * 100)}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg,#7CE8FF,#9B7CFF)',
                                          }}
                                        />
                                      </div>
                                      <span style={{ width: 24, flex: '0 0 auto', textAlign: 'right', fontWeight: 700 }}>{pt.count}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
                {basePartners?.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>아직 팬베이스 파트너가 없습니다.</p>}
                {basePartners === null && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>불러오는 중···</p>}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>부정 등록 의심</h2>
              <p style={{ fontSize: 12.5, color: '#6B6478', margin: '0 0 16px' }}>
                같은 IP에서 10분 이내 3건 이상 가입이 발생하면 표시됩니다 — 스크립트성 악용을 이미 완전히 차단하는
                하드 레이트 리밋(10분 / 8회)과 별개로, 검토용으로만 쓰는 가벼운 신호입니다.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#6B6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>IP</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>이메일</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>아티스트</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600, textAlign: 'right' }}>구간 내 건수</th>
                      <th style={{ padding: '0 12px 8px 0', fontWeight: 600 }}>등록일시</th>
                      <th style={{ padding: '0 0 8px 0', fontWeight: 600 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {suspicious?.map((r) => (
                      <tr key={r.id} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                        <td style={{ padding: '8px 12px 8px 0', fontFamily: 'monospace', color: '#FF7DDD' }}>{r.ip}</td>
                        <td style={{ padding: '8px 12px 8px 0' }}>{r.email}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{r.artistName}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{r.windowCount}</td>
                        <td style={{ padding: '8px 12px 8px 0', color: '#9089A0' }}>{new Date(r.createdAt).toLocaleString()}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteRegistration(r.id, r.email)}
                            disabled={deletingId === r.id}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255,125,221,.3)',
                              color: '#FF7DDD',
                              fontSize: 11.5,
                              fontWeight: 600,
                              padding: '5px 10px',
                              borderRadius: 6,
                              cursor: deletingId === r.id ? 'default' : 'pointer',
                              opacity: deletingId === r.id ? 0.6 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {deletingId === r.id ? '···' : '삭제'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {suspicious?.length === 0 && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>표시된 항목이 없습니다.</p>}
                {suspicious === null && <p style={{ color: '#6B6478', fontSize: 13, marginTop: 8 }}>불러오는 중···</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
