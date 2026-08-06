export interface Planet {
  id: string;
  label: string;
  tagline: string;
  image: string;
  a1: string;
  a2: string;
  g1: string;
  g2: string;
  ring: string;
}

export const PLANETS: Planet[] = [
  {
    id: 'fanuzu',
    label: 'FANUZU Prime',
    tagline: 'The home planet',
    image: '/images/fanuzu-planet.png',
    a1: '#FF7DDD',
    a2: '#9B7CFF',
    g1: '255,125,221',
    g2: '155,124,255',
    ring: '124,232,255',
  },
  {
    id: 'terra',
    label: 'Terra Verde',
    tagline: 'A cooler, growth-toned world',
    image: '/images/planet-earth.png',
    a1: '#8CE86B',
    a2: '#35B4E0',
    g1: '140,232,107',
    g2: '53,180,224',
    ring: '160,255,190',
  },
  {
    id: 'sakura',
    label: 'Sakura Drift',
    tagline: 'Soft candy pink & lilac',
    image: '/images/planet-sakura.png',
    a1: '#FF9AD5',
    a2: '#C9A6FF',
    g1: '255,154,213',
    g2: '201,166,255',
    ring: '255,214,240',
  },
];

function mixHex(h1: string, h2: string, t: number): string {
  const c1 = parseInt(h1.slice(1), 16);
  const c2 = parseInt(h2.slice(1), 16);
  const mix = (shift: number) => {
    const v1 = (c1 >> shift) & 255;
    const v2 = (c2 >> shift) & 255;
    return Math.round(v1 * (1 - t) + v2 * t);
  };
  return '#' + [16, 8, 0].map((shift) => mix(shift).toString(16).padStart(2, '0')).join('');
}

function mixRgb(r1: string, r2: string, t: number): string {
  const a = r1.split(',').map(Number);
  const b = r2.split(',').map(Number);
  return a.map((v, i) => Math.round(v * (1 - t) + b[i] * t)).join(',');
}

export function mixPlanetTheme(p1: Planet, p2: Planet, t: number): Omit<Planet, 'id' | 'label' | 'tagline' | 'image'> {
  return {
    a1: mixHex(p1.a1, p2.a1, t),
    a2: mixHex(p1.a2, p2.a2, t),
    g1: mixRgb(p1.g1, p2.g1, t),
    g2: mixRgb(p1.g2, p2.g2, t),
    ring: mixRgb(p1.ring, p2.ring, t),
  };
}
