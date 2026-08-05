'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PLANETS, type Planet } from '@/lib/planets';

type PlanetThemeColors = Omit<Planet, 'id' | 'label' | 'tagline' | 'image'>;

interface PlanetThemeContextValue {
  index: number;
  planet: Planet;
  setIndex: (index: number) => void;
  setPreviewTheme: (theme: PlanetThemeColors | null) => void;
}

const PlanetThemeContext = createContext<PlanetThemeContextValue | null>(null);

export function PlanetThemeProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [previewTheme, setPreviewTheme] = useState<PlanetThemeColors | null>(null);

  const planet = PLANETS[index];
  const activeTheme = previewTheme ?? planet;

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--planet-a1', activeTheme.a1);
    root.setProperty('--planet-a2', activeTheme.a2);
    root.setProperty('--planet-g1', activeTheme.g1);
    root.setProperty('--planet-g2', activeTheme.g2);
    root.setProperty('--planet-ring', activeTheme.ring);
  }, [activeTheme]);

  const value = useMemo<PlanetThemeContextValue>(
    () => ({ index, planet, setIndex, setPreviewTheme }),
    [index, planet]
  );

  return <PlanetThemeContext.Provider value={value}>{children}</PlanetThemeContext.Provider>;
}

export function usePlanetTheme(): PlanetThemeContextValue {
  const ctx = useContext(PlanetThemeContext);
  if (!ctx) throw new Error('usePlanetTheme must be used within a PlanetThemeProvider');
  return ctx;
}
