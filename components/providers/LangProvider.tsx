'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGS, LANG_LABELS, T, detectLang, type Lang, type TranslationSet } from '@/lib/i18n';

interface LangContextValue {
  lang: Lang;
  setLang: (code: Lang) => void;
  tr: TranslationSet;
  langList: { code: Lang; label: string }[];
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ko');

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  const setLang = (code: Lang) => {
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
