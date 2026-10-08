'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LANGS, LANG_LABELS, T, detectLangFromBrowserOrSaved, langFromCountry, type Lang, type TranslationSet } from '@/lib/i18n';
import { HTML_LANG } from '@/lib/locale';

interface LangContextValue {
  lang: Lang;
  setLang: (code: Lang) => void;
  tr: TranslationSet;
  langList: { code: Lang; label: string }[];
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  // Flips true the moment anything sets the language explicitly (a saved
  // preference, a browser-language match, or the visitor picking one by
  // hand) — guards the async country lookup below from clobbering a
  // choice that landed while that request was still in flight.
  const resolvedRef = useRef(false);

  useEffect(() => {
    const fromBrowserOrSaved = detectLangFromBrowserOrSaved();
    if (fromBrowserOrSaved) {
      resolvedRef.current = true;
      setLangState(fromBrowserOrSaved);
      return;
    }
    // Neither a saved choice nor the browser's language matched one of our
    // locales — ask the server which country this request geolocated to
    // and guess a more relevant language than a flat English default.
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data: { country: string | null }) => {
        if (resolvedRef.current) return;
        const guessed = langFromCountry(data.country);
        if (guessed) setLangState(guessed);
      })
      .catch(() => {});
  }, []);

  // Doc section 3: <html lang> must track the active locale (screen readers
  // and translation tools key off this, not just the visible text).
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  const setLang = (code: Lang) => {
    resolvedRef.current = true;
    setLangState(code);
    try {
      localStorage.setItem('fanuzu_lang', code);
    } catch (e) {}
  };

  const langList = useMemo(() => LANGS.map((code) => ({ code, label: LANG_LABELS[code] })), []);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, tr: T[lang], langList }),
    [lang, langList]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within a LangProvider');
  return ctx;
}
