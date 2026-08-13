// Client-safe: constants and pure functions only. Anything that touches the
// database lives in lib/artist-registry.ts instead — this file gets
// imported by client components (ArtistSelect.tsx), and pulling in lib/db's
// `pg` import here would drag Node-only modules (tls, net...) into the
// browser bundle.

// Proper nouns — group names stay identical across every locale, same as
// how the rest of the site treats stylized English brand terms.
export const POPULAR_ARTISTS: string[] = [
  'BTS',
  'BLACKPINK',
  'SEVENTEEN',
  'Stray Kids',
  'aespa',
  'IVE',
  'NCT',
  'ENHYPEN',
  'TWICE',
  'BABYMONSTER',
];

// Same normalization preregistrations.artist_name_normalized has always
// used — artists.slug is written with this so a fan's typed-in artist name
// and the registry row for that artist line up without a separate mapping
// table.
export function normalizeArtistSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}
