'use client';

import { useState, type FormEvent } from 'react';
import { useLang } from '@/components/providers/LangProvider';

interface PreregResult {
  hasRef: boolean;
  preregOrder: number;
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

export default function Prereg() {
  const { tr, lang } = useLang();

  const [artistName, setArtistName] = useState('');
  const [fandomName, setFandomName] = useState('');
  const [email, setEmail] = useState('');
  const [fanSince, setFanSince] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [termsConsent, setTermsConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorText, setErrorText] = useState('');
  const [result, setResult] = useState<PreregResult | null>(null);
  const [copied, setCopied] = useState(false);

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
    if (!artistName || !email || email.indexOf('@') === -1 || !termsConsent || !privacyConsent) {
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
          termsConsent,
          privacyConsent,
          marketingConsent,
          termsVersion: TERMS_VERSION,
          privacyVersion: PRIVACY_VERSION,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
          marketingConsentAt: marketingConsent ? now : null,
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
        preregOrder: data.preregistrationOrder,
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

  function copyReferral() {
    const code = result ? result.code : '';
    if (navigator.clipboard && code) navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const resultTitle = result ? (result.hasRef ? tr.prereg.resultTitleRef : tr.prereg.resultTitleNoRef) : '';
  const resultBody = result ? (result.hasRef ? tr.prereg.resultBodyRef : tr.prereg.resultBodyNoRef) : '';
  const resultRows = result
    ? [
        { k: tr.prereg.rArtist, v: artistName },
        { k: tr.prereg.rStatus, v: tr.prereg.rStatusVal },
        { k: tr.prereg.rOrder, v: '#' + String(result.preregOrder).padStart(6, '0') },
        { k: tr.prereg.rJoinOrder, v: '#' + String(result.joinOrder).padStart(3, '0') },
        { k: tr.prereg.rReward, v: result.reward + ' POP' },
        {
          k: result.hasRef ? tr.prereg.rOriginBadge : tr.prereg.rReferralCode,
          v: result.hasRef ? tr.origin.originLabel : result.code,
        },
      ]
    : [];
  const hasReferralCode = !!(result && !result.hasRef);

  return (
    <section id="prereg" style={{ position: 'relative', zIndex: 1, background: '#0A0613', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ maxWidth: 640, margin: '0 auto 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.3, fontWeight: 700, margin: '0 0 18px', color: '#FFFAFC' }}>
            {tr.prereg.t1}
            <br />
            {tr.prereg.t2}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: '0 0 6px' }}>{tr.prereg.d1}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#B8AFC4', margin: 0 }}>{tr.prereg.d2}</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 16,
            maxWidth: 900,
            margin: '44px auto 48px',
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
                <label htmlFor="prereg-artist" style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.artistLabel}</label>
                <input
                  id="prereg-artist"
                  type="text"
                  required
                  placeholder={tr.prereg.artistPlaceholder}
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="prereg-fandom" style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.fandomLabel}</label>
                <input
                  id="prereg-fandom"
                  type="text"
                  placeholder={tr.prereg.fandomPlaceholder}
                  value={fandomName}
                  onChange={(e) => setFandomName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="prereg-email" style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.emailLabel}</label>
                <input
                  id="prereg-email"
                  type="email"
                  required
                  placeholder={tr.prereg.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="prereg-fan-since" style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.fanSinceLabel}</label>
                <select
                  id="prereg-fan-since"
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
                <label htmlFor="prereg-referral" style={{ display: 'block', fontSize: 12.5, color: '#B8AFC4', marginBottom: 6 }}>{tr.prereg.referralHint}</label>
                <input
                  id="prereg-referral"
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label htmlFor="prereg-terms" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#B8AFC4', cursor: 'pointer', flex: 1 }}>
                    <input id="prereg-terms" type="checkbox" required checked={termsConsent} onChange={(e) => setTermsConsent(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF7DDD', flex: '0 0 auto' }} />
                    <span><span style={{ color: '#FF7DDD' }}>{tr.prereg.requiredBadge}</span> {tr.prereg.termsConsent}</span>
                  </label>
                  <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: '#7CE8FF', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    {tr.prereg.viewDoc}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label htmlFor="prereg-privacy" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#B8AFC4', cursor: 'pointer', flex: 1 }}>
                    <input id="prereg-privacy" type="checkbox" required checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF7DDD', flex: '0 0 auto' }} />
                    <span><span style={{ color: '#FF7DDD' }}>{tr.prereg.requiredBadge}</span> {tr.prereg.privacyConsentLabel}</span>
                  </label>
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: '#7CE8FF', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    {tr.prereg.viewDoc}
                  </a>
                </div>
                <label htmlFor="prereg-marketing" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#B8AFC4', cursor: 'pointer' }}>
                  <input id="prereg-marketing" type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF7DDD', flex: '0 0 auto' }} />
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
            </form>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {hasReferralCode && (
                  <button
                    onClick={copyReferral}
                    style={{
                      flex: 1,
                      minWidth: 180,
                      background: 'linear-gradient(135deg,#FF7DDD,#9B7CFF)',
                      color: '#05030B',
                      fontWeight: 700,
                      fontSize: 13.5,
                      padding: 13,
                      border: 'none',
                      borderRadius: 999,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {copied ? tr.prereg.copiedLabel : tr.prereg.btnCopy}
                  </button>
                )}
                <a
                  href="#passport"
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
    </section>
  );
}
