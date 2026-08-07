import type { Lang } from './i18n';

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
  title: string;
  intro: (artistName: string) => string;
  rewardLine: (amount: number) => string;
  referralLabel: string;
  referralNote: string;
  footer: string;
}

const EMAIL_COPY: Record<Lang, EmailCopy> = {
  ko: {
    subject: '[FANUZU] 사전등록이 완료되었습니다',
    title: '사전등록이 완료되었습니다.',
    intro: (a) => `${a} 팬덤 행성에 대한 사전등록이 정상적으로 접수되었습니다.`,
    rewardLine: (n) => `예약된 첫 기여: ${n} POP (FANUZU 정식 오픈 후 지급)`,
    referralLabel: '나의 추천 코드',
    referralNote: '추천 코드를 공유하면 코드를 사용한 친구와 나 모두 100 POP을 받을 수 있어요.',
    footer: 'FANUZU와 함께해주셔서 감사합니다.',
  },
  en: {
    subject: '[FANUZU] Your pre-registration is complete',
    title: 'Your pre-registration is complete.',
    intro: (a) => `Your pre-registration for ${a}'s fandom planet has been received.`,
    rewardLine: (n) => `Reserved first contribution: ${n} POP (paid out after FANUZU's official launch)`,
    referralLabel: 'Your referral code',
    referralNote: 'Share your code — anyone who uses it, and you, both get 100 POP.',
    footer: 'Thank you for joining FANUZU.',
  },
  ja: {
    subject: '[FANUZU] 事前登録が完了しました',
    title: '事前登録が完了しました。',
    intro: (a) => `${a}のファンダム惑星への事前登録を受け付けました。`,
    rewardLine: (n) => `予約された最初の貢献: ${n} POP（FANUZU正式オープン後に支給）`,
    referralLabel: '紹介コード',
    referralNote: '紹介コードを共有すると、使った人とあなたの両方に100 POPが贈られます。',
    footer: 'FANUZUにご参加いただきありがとうございます。',
  },
  es: {
    subject: '[FANUZU] Tu preinscripción se ha completado',
    title: 'Tu preinscripción se ha completado.',
    intro: (a) => `Hemos recibido tu preinscripción para el planeta del fandom de ${a}.`,
    rewardLine: (n) => `Primera contribución reservada: ${n} POP (se paga tras el lanzamiento oficial de FANUZU)`,
    referralLabel: 'Tu código de referido',
    referralNote: 'Comparte tu código: quien lo use y tú recibirán 100 POP cada uno.',
    footer: 'Gracias por unirte a FANUZU.',
  },
  zhHans: {
    subject: '[FANUZU] 预注册已完成',
    title: '预注册已完成。',
    intro: (a) => `你为${a}粉丝星球提交的预注册已收到。`,
    rewardLine: (n) => `已预留的首个贡献：${n} POP（将在FANUZU正式上线后发放）`,
    referralLabel: '我的推荐码',
    referralNote: '分享你的推荐码，使用者和你都将获得100 POP。',
    footer: '感谢你加入FANUZU。',
  },
  zhHant: {
    subject: '[FANUZU] 預先註冊已完成',
    title: '預先註冊已完成。',
    intro: (a) => `你為${a}粉絲星球提交的預先註冊已收到。`,
    rewardLine: (n) => `已預留的首個貢獻：${n} POP（將在FANUZU正式上線後發放）`,
    referralLabel: '我的推薦碼',
    referralNote: '分享你的推薦碼，使用者和你都將獲得100 POP。',
    footer: '感謝你加入FANUZU。',
  },
};

function renderHtml(copy: EmailCopy, params: PreregEmailParams): string {
  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1030;">
      <h1 style="font-size:20px;margin:0 0 16px;">${copy.title}</h1>
      <p style="font-size:14px;line-height:1.6;color:#40384d;margin:0 0 20px;">${copy.intro(params.artistName)}</p>
      <div style="background:#f6f3ff;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
        <p style="font-size:13px;line-height:1.6;margin:0;color:#1a1030;">${copy.rewardLine(params.rewardAmount)}</p>
      </div>
      <p style="font-size:12px;color:#6b6478;margin:0 0 4px;">${copy.referralLabel}</p>
      <p style="font-size:16px;font-weight:700;letter-spacing:.02em;margin:0 0 12px;">${params.referralCode}</p>
      <p style="font-size:12.5px;line-height:1.6;color:#6b6478;margin:0 0 24px;">${copy.referralNote}</p>
      <p style="font-size:13px;color:#6b6478;margin:0;">${copy.footer}</p>
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
