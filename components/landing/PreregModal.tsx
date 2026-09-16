'use client';

import { useEffect, useRef } from 'react';
import { usePreregModal } from '@/components/providers/PreregModalProvider';
import { useLang } from '@/components/providers/LangProvider';
import PreregFormContent from './PreregFormContent';

const HEADING_ID = 'prereg-modal-heading';

export default function PreregModal() {
  const { isOpen, closeModal } = usePreregModal();
  const { tr } = useLang();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(5,3,11,.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(16px,4vw,48px) 16px',
        overflowY: 'auto',
        animation: 'modalBackdropIn .3s ease',
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={HEADING_ID}
        tabIndex={-1}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 680,
          background: 'linear-gradient(180deg, rgba(155,124,255,.08), rgba(10,6,19,0) 40%), #0A0613',
          border: '1px solid rgba(255,125,221,.35)',
          borderRadius: 24,
          padding: 'clamp(28px,5vw,48px) clamp(18px,4vw,32px)',
          boxShadow: '0 30px 80px rgba(0,0,0,.55), 0 0 60px rgba(155,124,255,.14)',
          outline: 'none',
          animation: 'modalPanelIn .38s cubic-bezier(.22,.61,.36,1)',
        }}
      >
        <button
          onClick={closeModal}
          aria-label={tr.nav.close}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.14)',
            background: 'rgba(255,255,255,.06)',
            color: '#FFFAFC',
            fontSize: 16,
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
        <PreregFormContent headingId={HEADING_ID} onRequestClose={closeModal} />
      </div>
    </div>
  );
}
