'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { detectLangFromBrowserOrSaved, type Lang } from '@/lib/i18n';
import { localePath, persistLangChoice } from '@/lib/locale';

const DISMISS_KEY = 'fanuzu_lang_suggest_dismissed';

// Doc section 20 asks for a "guide to the matching language on first
// visit" without a crawler-blocking forced redirect — so this never
// changes the URL on its own. It only ever (a) offers a dismissible
// banner the visitor can act on, or (b) silently migrates a pre-existing
// localStorage choice (from before this feature shipped) into the cookie
// middleware reads, which is just as much "their own prior explicit
// choice" as a fresh pick and needs no re-asking.
const SUGGEST_TEXT: Partial<Record<Lang, { prompt: string; switchLabel: string; stayLabel: string }>> = {
  en: { prompt: 'View this page in English?', switchLabel: 'English', stayLabel: 'No thanks' },
  ja: { prompt: 'このページを日本語で表示しますか?', switchLabel: '日本語で見る', stayLabel: '閉じる' },
  es: { prompt: '¿Ver esta página en español?', switchLabel: 'Español', stayLabel: 'No, gracias' },
  zhHans: { prompt: '要切换到简体中文查看此页面吗?', switchLabel: '简体中文', stayLabel: '不用了' },
  zhHant: { prompt: '要切換到繁體中文查看此頁面嗎?', switchLabel: '繁體中文', stayLabel: '不用了' },
  id: { prompt: 'Lihat halaman ini dalam Bahasa Indonesia?', switchLabel: 'Bahasa Indonesia', stayLabel: 'Tidak, terima kasih' },
  fil: { prompt: 'Tingnan ang pahinang ito sa Filipino?', switchLabel: 'Filipino', stayLabel: 'Huwag na lang' },
  th: { prompt: 'ดูหน้านี้เป็นภาษาไทยหรือไม่?', switchLabel: 'ภาษาไทย', stayLabel: 'ไม่เป็นไร' },
};

export default function LangSuggestion({ subpath }: { subpath: '' | '/ranking' }) {
  const router = useRouter();
  const [suggested, setSuggested] = useState<Lang | null>(null);

  useEffect(() => {
    const detected = detectLangFromBrowserOrSaved();
    if (!detected || detected === 'ko') return;

    try {
      // Already chosen once before (old localStorage-only mechanism) —
      // honor it and migrate it to the cookie, no banner needed.
      if (localStorage.getItem('fanuzu_lang')) {
        persistLangChoice(detected);
        router.replace(localePath(detected, subpath) + window.location.search);
        return;
      }
    } catch (e) {}

    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch (e) {}

    if (SUGGEST_TEXT[detected]) setSuggested(detected);
  }, [router, subpath]);

  if (!suggested) return null;
  const text = SUGGEST_TEXT[suggested];
  if (!text) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 20,
        transform: 'translateX(-50%)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#171827',
        border: '1px solid rgba(255,125,221,.25)',
        borderRadius: 999,
        padding: '10px 10px 10px 18px',
        boxShadow: '0 16px 40px rgba(0,0,0,.45)',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <span style={{ fontSize: 13.5, color: '#F5F3FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text.prompt}</span>
      <button
        onClick={() => {
          persistLangChoice(suggested);
          router.push(localePath(suggested, subpath) + window.location.search);
        }}
        style={{
          border: 'none',
          background: 'linear-gradient(135deg,#FF7DDD,#9675F5)',
          color: '#080914',
          fontSize: 13,
          fontWeight: 700,
          padding: '8px 16px',
          borderRadius: 999,
          cursor: 'pointer',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        {text.switchLabel}
      </button>
      <button
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, '1');
          } catch (e) {}
          setSuggested(null);
        }}
        aria-label={text.stayLabel}
        style={{
          border: 'none',
          background: 'transparent',
          color: '#6B6478',
          fontSize: 16,
          cursor: 'pointer',
          padding: '4px 6px',
        }}
      >
        ✕
      </button>
    </div>
  );
}
