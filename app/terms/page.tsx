'use client';

import { useEffect } from 'react';
import { LangProvider, useLang } from '@/components/providers/LangProvider';
import { LegalDocument } from '@/components/legal/LegalLayout';
import { LEGAL } from '@/lib/legal-content';

function TermsDocument() {
  const { lang } = useLang();
  const doc = LEGAL[lang].terms;

  useEffect(() => {
    document.title = `${doc.title} — FANUZU`;
  }, [doc.title]);

  return <LegalDocument doc={doc} />;
}

export default function TermsPage() {
  return (
    <LangProvider>
      <TermsDocument />
    </LangProvider>
  );
}
