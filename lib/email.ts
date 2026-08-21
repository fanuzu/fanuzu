import { T, type Lang } from './i18n';

interface PreregEmailParams {
  to: string;
  lang: Lang;
  artistName: string;
  rewardAmount: number;
  referralCode: string;
  hasRef: boolean;
}

interface EmailCopy {
  subject: string;
  eyebrow: string;
  title: string;
  intro: (artistName: string) => string;
  rewardLine: (amount: number) => string;
  referralLabel: string;
  referralNote: string;
  closingLine: string;
}

const EMAIL_COPY: Record<Lang, EmailCopy> = {
  ko: {
    subject: '[FANUZU] 사전등록이 완료되었습니다',
    eyebrow: '행동이 아티스트를 위한 기여가 되는 액션 팬덤, FANUZU입니다.',
    title: '사전등록이 완료되었습니다.',
    intro: (a) => `${a} 팬덤 행성에 대한 사전등록이 정상적으로 접수되었습니다.`,
    rewardLine: (n) => `예약된 첫 기여: ${n} POP (FANUZU 정식 오픈 가입 프로세스 완료 후 지급됩니다.)`,
    referralLabel: '나의 추천 코드',
    referralNote: '추천 코드를 공유하면 코드를 사용한 친구와 나 모두 100 POP을 받을 수 있어요.',
    closingLine: 'FANUZU가 시작되는 순간 가장 먼저 알려드리겠습니다.',
  },
  en: {
    subject: '[FANUZU] Your pre-registration is complete',
    eyebrow: 'FANUZU is the action fandom where your actions become contributions for the artist.',
    title: 'Your pre-registration is complete.',
    intro: (a) => `Your pre-registration for ${a}'s fandom planet has been received.`,
    rewardLine: (n) => `Reserved first contribution: ${n} POP (paid out once you complete FANUZU's official launch sign-up)`,
    referralLabel: 'Your referral code',
    referralNote: 'Share your code — anyone who uses it, and you, both get 100 POP.',
    closingLine: "We'll be the first to let you know the moment FANUZU launches.",
  },
  ja: {
    subject: '[FANUZU] 事前登録が完了しました',
    eyebrow: '行動がアーティストへの貢献になる、アクションファンダムFANUZUです。',
    title: '事前登録が完了しました。',
    intro: (a) => `${a}のファンダム惑星への事前登録を受け付けました。`,
    rewardLine: (n) => `予約された最初の貢献: ${n} POP（FANUZU正式オープンの会員登録完了後に支給されます）`,
    referralLabel: '紹介コード',
    referralNote: '紹介コードを共有すると、使った人とあなたの両方に100 POPが贈られます。',
    closingLine: 'FANUZUが始まる瞬間、誰よりも早くお知らせします。',
  },
  es: {
    subject: '[FANUZU] Tu preinscripción se ha completado',
    eyebrow: 'FANUZU es el fandom de acción donde tus acciones se convierten en contribución para el artista.',
    title: 'Tu preinscripción se ha completado.',
    intro: (a) => `Hemos recibido tu preinscripción para el planeta del fandom de ${a}.`,
    rewardLine: (n) => `Primera contribución reservada: ${n} POP (se paga tras completar el registro del lanzamiento oficial de FANUZU)`,
    referralLabel: 'Tu código de referido',
    referralNote: 'Comparte tu código: quien lo use y tú recibirán 100 POP cada uno.',
    closingLine: 'Serás de los primeros en saberlo en cuanto FANUZU se lance.',
  },
  zhHans: {
    subject: '[FANUZU] 预注册已完成',
    eyebrow: 'FANUZU 是让你的行动化为对艺人贡献的行动粉丝团。',
    title: '预注册已完成。',
    intro: (a) => `你为${a}粉丝星球提交的预注册已收到。`,
    rewardLine: (n) => `已预留的首个贡献：${n} POP（将在完成FANUZU正式上线的注册流程后发放）`,
    referralLabel: '我的推荐码',
    referralNote: '分享你的推荐码，使用者和你都将获得100 POP。',
    closingLine: 'FANUZU正式上线的那一刻，我们会第一时间通知你。',
  },
  zhHant: {
    subject: '[FANUZU] 預先註冊已完成',
    eyebrow: 'FANUZU 是讓你的行動化為對藝人貢獻的行動粉絲團。',
    title: '預先註冊已完成。',
    intro: (a) => `你為${a}粉絲星球提交的預先註冊已收到。`,
    rewardLine: (n) => `已預留的首個貢獻：${n} POP（將在完成FANUZU正式上線的註冊流程後發放）`,
    referralLabel: '我的推薦碼',
    referralNote: '分享你的推薦碼，使用者和你都將獲得100 POP。',
    closingLine: 'FANUZU正式上線的那一刻，我們會第一時間通知你。',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Trust signals reuse the site's own footer copy (lib/i18n.ts) rather than
// duplicating a second translation of the same legal boilerplate — company
// name, business registration number, and address are what make a
// pre-launch confirmation email read as a real company and not a phishing
// attempt, so they're rendered in every language, not just Korean.
function renderHtml(copy: EmailCopy, params: PreregEmailParams): string {
  const footer = T[params.lang].footer;
  const artistName = escapeHtml(params.artistName);
  const referralCode = escapeHtml(params.referralCode);

  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;">
      <div style="background:linear-gradient(135deg,#FF7DDD,#9B7CFF);padding:20px 24px;border-radius:16px 16px 0 0;">
        <span style="font-size:15px;font-weight:800;letter-spacing:.04em;color:#05030B;">FANUZU</span>
      </div>
      <div style="border:1px solid #ECE7F5;border-top:none;border-radius:0 0 16px 16px;padding:28px 24px 24px;color:#1a1030;">
        <p style="font-size:12.5px;line-height:1.6;color:#8A7FA0;margin:0 0 18px;">${copy.eyebrow}</p>
        <h1 style="font-size:20px;margin:0 0 16px;">${copy.title}</h1>
        <p style="font-size:14px;line-height:1.6;color:#40384d;margin:0 0 20px;">${copy.intro(artistName)}</p>
        <div style="background:#f6f3ff;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
          <p style="font-size:13px;line-height:1.6;margin:0;color:#1a1030;">${copy.rewardLine(params.rewardAmount)}</p>
        </div>
        <p style="font-size:12px;color:#6b6478;margin:0 0 4px;">${copy.referralLabel}</p>
        <p style="font-size:16px;font-weight:700;letter-spacing:.02em;margin:0 0 12px;">${referralCode}</p>
        <p style="font-size:12.5px;line-height:1.6;color:#6b6478;margin:0 0 24px;">${copy.referralNote}</p>
        <p style="font-size:13.5px;line-height:1.6;color:#1a1030;margin:0;">${copy.closingLine}</p>
      </div>
      <div style="padding:20px 24px 0;">
        <p style="font-size:11px;line-height:1.6;color:#9089A0;margin:0 0 3px;">${escapeHtml(footer.company)}</p>
        <p style="font-size:11px;line-height:1.6;color:#9089A0;margin:0 0 3px;">${escapeHtml(footer.address)}</p>
        <p style="font-size:11px;line-height:1.6;color:#9089A0;margin:0 0 10px;">${escapeHtml(footer.contact)}</p>
        <p style="font-size:10.5px;color:#B8B0C8;margin:0 0 20px;">${escapeHtml(footer.copyright)}</p>
      </div>
    </div>
  `.trim();
}

/**
 * Fire-and-log: a failed send is caught by the caller and never turns a
 * successful pre-registration into an error response.
 */
export async function sendPreregConfirmationEmail(params: PreregEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn('sendPreregConfirmationEmail skipped: RESEND_API_KEY or EMAIL_FROM is not set.');
    return;
  }

  const copy = EMAIL_COPY[params.lang] || EMAIL_COPY.en;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: copy.subject,
      html: renderHtml(copy, params),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Resend request failed (${res.status}): ${text}`);
  }
}
