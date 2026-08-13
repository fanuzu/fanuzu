'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface PreregModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const PreregModalContext = createContext<PreregModalContextValue | null>(null);

export function PreregModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback(() => {
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    lastFocusedRef.current?.focus?.();
  }, []);

  return <PreregModalContext.Provider value={{ isOpen, openModal, closeModal }}>{children}</PreregModalContext.Provider>;
}

export function usePreregModal(): PreregModalContextValue {
  const ctx = useContext(PreregModalContext);
  if (!ctx) throw new Error('usePreregModal must be used within a PreregModalProvider');
  return ctx;
}
