export const metadata = { title: 'Terms of Service — FANUZU' };

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#05030B', color: '#FFFAFC', padding: '80px 24px', fontFamily: 'Pretendard,Inter,system-ui,sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Terms of Service</h1>
        <p style={{ color: '#B8AFC4', lineHeight: 1.7 }}>
          FANUZU&apos;s terms of service are being finalized ahead of launch. For questions, contact
          help@fanuzu.co.kr.
        </p>
        <a href="/" style={{ color: '#FF7DDD' }}>← Back to FANUZU</a>
      </div>
    </div>
  );
}
