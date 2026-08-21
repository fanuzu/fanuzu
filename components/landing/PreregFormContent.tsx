'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { useLang } from '@/components/providers/LangProvider';
import ArtistSelect from './ArtistSelect';
import { readAttribution, type Attribution } from './attribution';

interface PreregResult {
  hasRef: boolean;
  joinOrder: number;
  reward: number;
  code: string;
}

type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.14)',
  borderRadius: 12,
  padding: '14px 16px',
  color: '#FFFAFC',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
};

const CURRENT_YEAR = new Date().getFullYear();
const FAN_SINCE_YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

// Bumped whenever the corresponding legal document's content changes;
// stored alongside each consent so we know which version a user agreed to.
const TERMS_VERSION = '1.0';
const PRIVACY_VERSION = '1.0';

export default function PreregFormContent({ headingId, onRequestClose }: { headingId?: string; onRequestClose?: () => void }) {
  const { tr, lang } = useLang();
  const uid = useId();

  const [step, setStep] = useState<'select' | 'form'>('select');
  const [artistName, setArtistName] = useState('');
  const [fandomName, setFandomName] = useState('');
  const [email, setEmail] = useState('');
  const [fanSince, setFanSince] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [age14Consent, setAge14Consent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorText, setErrorText] = useState('');
  const [result, setResult] = useState<PreregResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [attribution, setAttribution] = useState<Attribution | null>(null);
  // Starts false on both server and client so hydration always matches;
  // navigator.share only exists in the browser, so it's set for real after mount.
  const [canShareNatively, setCanShareNatively] = useState(false);

  // Prefill from whatever AttributionTracker captured on landing (invite
  // link's ref code, and/or the artist it named) — a fan who clicked a
  // shared link shouldn't have to re-enter what the link already told us.
  useEffect(() => {
    setCanShareNatively(typeof navigator !== 'undefined' && !!navigator.share);
    const attr = readAttribution();
    if (!attr) return;
    setAttribution(attr);
    if (attr.referralCode) setReferralCode(attr.referralCode);
    if (attr.artist) {
      setArtistName(attr.artist);
      setStep('form');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = tr.prereg.steps.map((s, i) => ({ n: i + 1, t: s.t, d: s.d }));

  const rewardHintText = referralCode.trim() ? tr.prereg.rewardRef : tr.prereg.rewardNoRef;
  const rewardTextColor = referralCode.trim() ? '#FF7DDD' : '#B8AFC4';

  const isSubmitting = formStatus === 'submitting';
  const isError = formStatus === 'error';
  const showForm = formStatus !== 'success';
  const showSuccess = formStatus === 'success';

  function errorMessageFor(code: unknown): string {
    switch (code) {
      case 'invalid_email':
        return tr.errors.invalidEmail;
      case 'email_already_registered':
        return tr.errors.emailAlreadyRegistered;
      case 'invalid_referral':
        return tr.errors.invalidReferral;
      case 'self_referral_not_allowed':
        return tr.errors.selfReferralNotAllowed;
      case 'required_consent':
        return tr.errors.requiredConsent;
      case 'rate_limit':
        return tr.errors.rateLimit;
      default:
        return tr.errors.serverError;
    }
  }

  async function submitPrereg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!artistName || !email || email.indexOf('@') === -1 || !age14Consent || !termsConsent || !privacyConsent) {
      setFormStatus('error');
      setErrorText(tr.errors.requiredConsent);
      return;
    }
    setFormStatus('submitting');
    setErrorText('');
    const now = new Date().toISOString();
    try {
      const res = await fetch('/api/prereg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName,
          fandomName,
          email,
          fanSince,
          language: lang,
          referralCode,
          age14Consent,
          termsConsent,
          privacyConsent,
          marketingConsent,
          termsVersion: TERMS_VERSION,
          privacyVersion: PRIVACY_VERSION,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
          marketingConsentAt: marketingConsent ? now : null,
          utmSource: attribution?.utmSource,
          utmMedium: attribution?.utmMedium,
          utmCampaign: attribution?.utmCampaign,
          utmTerm: attribution?.utmTerm,
          utmContent: attribution?.utmContent,
          landingPath: typeof window !== 'undefined' ? window.location.pathname + window.location.search : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormStatus('error');
        setErrorText(errorMessageFor(data.error));
        return;
      }
      setResult({
        hasRef: !!data.referralApplied,
        joinOrder: data.artistJoinOrder,
        reward: data.rewardAmount,
        code: data.referralCode,
      });
      setFormStatus('success');
    } catch {
      setFormStatus('error');
      setErrorText(tr.errors.networkError);
    }
  }

  // Referral program spec section 3: code copy, link copy, and share are
  // distinct affordances, not one combined "copy" button — a fan reposting
  // to a Discord server wants just the code; one DMing a friend wants the
  // full link; one on mobile wants the OS share sheet.
  function buildShareUrl(code: string): URL {
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set('ref', code);
    if (artistName) shareUrl.searchParams.set('artist', artistName);
    shareUrl.searchParams.set('utm_source', 'referral');
    shareUrl.searchParams.set('utm_medium', 'share');
    shareUrl.searchParams.set('utm_campaign', 'invite_code');
    return shareUrl;
  }

  function copyCode() {
    const code = result ? result.code : '';
    if (navigator.clipboard && code) navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1600);
  }

  function copyLink() {
    const code = result ? result.code : '';
    if (!code) return;
    const shareText = tr.prereg.shareMessage.replace('{code}', code).replace('{url}', buildShareUrl(code).toString());
    if (navigator.clipboard) navigator.clipboard.writeText(shareText).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1600);
  }

  function shareNative() {
    const code = result ? result.code : '';
    if (!code) return;
    const url = buildShareUrl(code).toString();
    const text = tr.prereg.shareMessage.replace('{code}', code).replace('{url}', url);
    if (navigator.share) {
      navigator.share({ text, url }).catch(() => {});
    } else {
      copyLink();
    }
  }

  function shareX() {
    const code = result ? result.code : '';
    if (!code) return;
    const text = tr.prereg.shareMessage.replace('{code}', code).replace('{url}', '').trim();
    const intentUrl = new URL('https://twitter.com/intent/tweet');
    intentUrl.searchParams.set('text', text);
    intentUrl.searchParams.set('url', buildShareUrl(code).toString());
    window.open(intentUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  const resultTitle = result ? (result.hasRef ? tr.prereg.resultTitleRef : tr.prereg.resultTitleNoRef) : '';
  const resultBody = result ? (result.hasRef ? tr.prereg.resultBodyRef : tr.prereg.resultBodyNoRef) : '';
  // Deliberately no exact sequence numbers here — a raw "#000042 of ###"
  // lets anyone back out real signup volume just by registering. Early
  // joiners still get a tier badge (bucketed, not a count) for the same
  // founder feeling without exposing one.
  const joinTier = result
    ? result.joinOrder === 1
      ? tr.origin.founderLabel
      : result.joinOrder <= 100
        ? tr.origin.originLabel
        : null
    : null;
  const resultRows = result
    ? [
        { k: tr.prereg.rArtist, v: artistName },
        { k: tr.prereg.rStatus, v: tr.prereg.rStatusVal },
        ...(joinTier ? [{ k: tr.prereg.rJoinTier, v: joinTier }] : []),
        { k: tr.prereg.rReward, v: result.reward + ' POP' },
        {
          k: result.hasRef ? tr.prereg.rOriginBadge : tr.prereg.rReferralCode,
          v: result.hasRef ? tr.origin.originLabel : result.code,
        },
      ]
    : [];
  const hasReferralCode = !!(result && !result.hasRef);

  if (step === 'select') {
    return (
      <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        <ArtistSelect
          headingId={headingId}
          onConfirm={(artist, fandom) => {
            setArtistName(artist);
            // Prefill from the registry (still editable) so most fans never
            // have to type their fandom's name at all — no registry match
            // (e.g. a custom "Other" entry) just leaves the field as-is.
            if (fandom) setFandomName(fandom);
            setStep('form');
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
      <div style={{ maxWidth: 640, margin: '0 auto 20px', textAlign: 'center' }}>
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
        <h2 id={headingId} style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 18px', color: '#FFFAFC' }}>
          {tr.prereg.t1}
          <br />
          {tr.prereg.t2}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 6px' }}>{tr.prereg.d1}</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 14px' }}>{tr.prereg.d2}</p>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#6B6478', margin: 0 }}>{tr.prereg.statusNote}</p>
      </div>

      <div
        style={{
          maxWidth: 560,
          margin: '32px auto 0',
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 18,
          padding: '22px 26px',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: '#7CE8FF', marginBottom: 14 }}>{tr.prereg.benefitsLabel}</div>
        {tr.prereg.benefits.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < tr.prereg.benefits.length - 1 ? 10 : 0 }}>
            <span style={{ color: '#FF7DDD', fontSize: 13, lineHeight: 1.6, flex: '0 0 auto' }}>✦</span>
            <span style={{ fontSize: 13.5, lineHeight: 1.55, color: '#FFFAFC' }}>{b}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 16,
          maxWidth: 900,
          margin: '32px auto 48px',
        }}
      >
        {steps.map((pst) => (
          <div key={pst.n} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 22 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                color: '#05030B',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              {pst.n}
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px', color: '#FFFAFC' }}>{pst.t}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: '#B8AFC4', margin: 0 }}>{pst.d}</p>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {showForm && (
          <form
            onSubmit={submitPrereg}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              textAlign: 'left',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 20,
              padding: 32,
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.artistLabel}</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  background: 'rgba(255,125,221,.08)',
                  border: '1px solid rgba(255,125,221,.28)',
                  borderRadius: 12,
                  padding: '13px 16px',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFAFC' }}>{artistName}</span>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7CE8FF',
                    fontSize: 12.5,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                    flex: '0 0 auto',
                  }}
                >
                  {tr.prereg.selectChange}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor={`${uid}-fandom`} style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.fandomLabel}</label>
              <input
                id={`${uid}-fandom`}
                type="text"
                placeholder={tr.prereg.fandomPlaceholder}
                value={fandomName}
                onChange={(e) => setFandomName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-email`} style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.emailLabel}</label>
              <input
                id={`${uid}-email`}
                type="email"
                required
                placeholder={tr.prereg.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-fan-since`} style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.fanSinceLabel}</label>
              <select
                id={`${uid}-fan-since`}
                value={fanSince}
                onChange={(e) => setFanSince(e.target.value)}
                style={{ ...inputStyle, appearance: 'auto', cursor: 'pointer' }}
              >
                <option value="" style={{ color: '#6B6478', background: '#1A1030' }}>
                  {tr.prereg.fanSincePlaceholder}
                </option>
                {FAN_SINCE_YEARS.map((y) => (
                  <option key={y} value={y} style={{ color: '#FFFAFC', background: '#1A1030' }}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${uid}-referral`} style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.referralHint}</label>
              <input
                id={`${uid}-referral`}
                type="text"
                placeholder={tr.prereg.referralPlaceholder}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                style={{ ...inputStyle, border: '1px solid rgba(255,125,221,.35)' }}
              />
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 13,
                lineHeight: 1.6,
                color: rewardTextColor,
              }}
            >
              {rewardHintText}
            </div>
            <p style={{ fontSize: 11.5, lineHeight: 1.5, color: '#6B6478', margin: 0 }}>{tr.prereg.rewardNote}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label htmlFor={`${uid}-age14`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#B8AFC4', cursor: 'pointer' }}>
                <input id={`${uid}-age14`} type="checkbox" required checked={age14Consent} onChange={(e) => setAge14Consent(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF7DDD', flex: '0 0 auto' }} />
                <span><span style={{ color: '#FF7DDD' }}>{tr.prereg.requiredBadge}</span> {tr.prereg.age14Consent}</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label htmlFor={`${uid}-terms`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#B8AFC4', cursor: 'pointer', flex: 1 }}>
                  <input id={`${uid}-terms`} type="checkbox" required checked={termsConsent} onChange={(e) => setTermsConsent(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF7DDD', flex: '0 0 auto' }} />
                  <span><span style={{ color: '#FF7DDD' }}>{tr.prereg.requiredBadge}</span> {tr.prereg.termsConsent}</span>
                </label>
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: '#7CE8FF', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  {tr.prereg.viewDoc}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label htmlFor={`${uid}-privacy`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#B8AFC4', cursor: 'pointer', flex: 1 }}>
                  <input id={`${uid}-privacy`} type="checkbox" required checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF7DDD', flex: '0 0 auto' }} />
                  <span><span style={{ color: '#FF7DDD' }}>{tr.prereg.requiredBadge}</span> {tr.prereg.privacyConsentLabel}</span>
                </label>
                <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: '#7CE8FF', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  {tr.prereg.viewDoc}
                </a>
              </div>
              <label htmlFor={`${uid}-marketing`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#B8AFC4', cursor: 'pointer' }}>
                <input id={`${uid}-marketing`} type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF7DDD', flex: '0 0 auto' }} />
                <span><span style={{ color: '#6B6478' }}>{tr.prereg.optionalBadge}</span> {tr.prereg.marketingConsent}</span>
              </label>
            </div>
            {isError && <div style={{ fontSize: 13, color: '#FF7DDD' }} role="alert">{errorText}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                color: '#05030B',
                fontWeight: 700,
                fontSize: 15.5,
                padding: 15,
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'inherit',
                marginTop: 6,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? tr.prereg.submitting : tr.prereg.submit}
            </button>
            <p style={{ fontSize: 11.5, lineHeight: 1.5, color: '#6B6478', textAlign: 'center', margin: 0 }}>{tr.prereg.trustNote}</p>
          </form>
        )}

        {showForm && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#524B5E', margin: 0 }}>{tr.footer.company}</p>
          </div>
        )}

        {showSuccess && (
          <div style={{ background: 'rgba(255,125,221,.08)', border: '1px solid rgba(255,125,221,.32)', borderRadius: 20, padding: 32 }}>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, margin: '0 0 10px', color: '#FFFAFC' }}>{resultTitle}</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#B8AFC4', margin: '0 0 24px' }}>{resultBody}</p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px 20px',
                borderTop: '1px solid rgba(255,255,255,.1)',
                borderBottom: '1px solid rgba(255,255,255,.1)',
                padding: '20px 0',
                marginBottom: 20,
              }}
            >
              {resultRows.map((rr, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: '#6B6478', marginBottom: 3 }}>{rr.k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFAFC' }}>{rr.v}</div>
                </div>
              ))}
            </div>
            {hasReferralCode && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <button
                  onClick={copyCode}
                  style={{
                    flex: '1 1 130px',
                    background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                    color: '#05030B',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: 12,
                    border: 'none',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {copiedCode ? tr.prereg.copiedLabel : tr.prereg.btnCopyCode}
                </button>
                <button
                  onClick={copyLink}
                  style={{
                    flex: '1 1 130px',
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,125,221,.35)',
                    color: '#FFFAFC',
                    fontWeight: 600,
                    fontSize: 13,
                    padding: 12,
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {copiedLink ? tr.prereg.copiedLabel : tr.prereg.btnCopyLink}
                </button>
                <button
                  onClick={shareX}
                  style={{
                    flex: '1 1 130px',
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.16)',
                    color: '#FFFAFC',
                    fontWeight: 600,
                    fontSize: 13,
                    padding: 12,
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {tr.prereg.btnShareX}
                </button>
                {canShareNatively && (
                  <button
                    onClick={shareNative}
                    style={{
                      flex: '1 1 130px',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.16)',
                      color: '#FFFAFC',
                      fontWeight: 600,
                      fontSize: 13,
                      padding: 12,
                      borderRadius: 999,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {tr.prereg.btnShare}
                  </button>
                )}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a
                href="#passport"
                onClick={onRequestClose}
                style={{
                  flex: 1,
                  minWidth: 180,
                  textAlign: 'center',
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.16)',
                  color: '#FFFAFC',
                  fontWeight: 600,
                  fontSize: 13.5,
                  padding: 13,
                  borderRadius: 999,
                  textDecoration: 'none',
                }}
              >
                {tr.prereg.btnPassport}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
