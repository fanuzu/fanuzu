// Server-only: everything that touches the artists table. Never import this
// from a client component — import lib/artists.ts instead for the
// client-safe constants (POPULAR_ARTISTS, normalizeArtistSlug).
import { ensureSchema, getPool } from './db';
import { normalizeArtistSlug } from './artists';

export type OfficialStatus = 'unofficial' | 'pending' | 'official';

export interface ArtistRecord {
  id: number;
  slug: string;
  artistName: string;
  fandomName: string | null;
  agency: string | null;
  officialStatus: OfficialStatus;
  logoLicense: boolean;
  logoUrl: string | null;
  imageLicense: boolean;
  heroImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistWithCount extends ArtistRecord {
  preregCount: number;
}

// What the public-facing UI is allowed to know about an artist. Deliberately
// narrower than ArtistRecord — a component that only has an ArtistBadge
// physically cannot render an unlicensed logo, because there's no field to
// read it from.
export interface ArtistBadge {
  isOfficial: boolean;
  logoUrl: string | null;
  heroImageUrl: string | null;
}

interface ArtistRow {
  id: number;
  slug: string;
  artist_name: string;
  fandom_name: string | null;
  agency: string | null;
  official_status: OfficialStatus;
  logo_license: boolean;
  logo_url: string | null;
  image_license: boolean;
  hero_image_url: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: ArtistRow): ArtistRecord {
  return {
    id: row.id,
    slug: row.slug,
    artistName: row.artist_name,
    fandomName: row.fandom_name,
    agency: row.agency,
    officialStatus: row.official_status,
    logoLicense: row.logo_license,
    logoUrl: row.logo_url,
    imageLicense: row.image_license,
    heroImageUrl: row.hero_image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getArtistBySlug(name: string): Promise<ArtistRecord | null> {
  await ensureSchema();
  const pool = getPool();
  const slug = normalizeArtistSlug(name);
  const { rows } = await pool.query<ArtistRow>('SELECT * FROM artists WHERE slug = $1', [slug]);
  return rows[0] ? mapRow(rows[0]) : null;
}

// The gate this whole table exists for: an OFFICIAL badge or a licensed
// asset URL only ever comes out of this function, and only when the
// matching license flag is true. official_status alone never unlocks an
// asset — a confirmed partnership and cleared asset licensing are tracked
// (and gated) independently.
export function getArtistBadge(artist: ArtistRecord | null): ArtistBadge {
  if (!artist) return { isOfficial: false, logoUrl: null, heroImageUrl: null };
  return {
    isOfficial: artist.officialStatus === 'official',
    logoUrl: artist.logoLicense ? artist.logoUrl : null,
    heroImageUrl: artist.imageLicense ? artist.heroImageUrl : null,
  };
}

// Admin-only: every registry row plus how many fans have pre-registered for
// it (including registrations for custom-typed names that got linked to
// this row after the fact — see updateArtist / the admin "link" flow).
export async function listArtistsWithCounts(): Promise<ArtistWithCount[]> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query<ArtistRow & { prereg_count: string }>(
    `SELECT a.*, COUNT(p.id) AS prereg_count
     FROM artists a
     LEFT JOIN preregistrations p ON p.artist_id = a.id
     GROUP BY a.id
     ORDER BY a.artist_name ASC`
  );
  return rows.map((r) => ({ ...mapRow(r), preregCount: Number(r.prereg_count) }));
}

export interface ArtistUpdateInput {
  fandomName?: string | null;
  agency?: string | null;
  officialStatus?: OfficialStatus;
  logoLicense?: boolean;
  logoUrl?: string | null;
  imageLicense?: boolean;
  heroImageUrl?: string | null;
}

// Admin-only: partial update, `updated_at` bumped automatically. Never
// touches slug/artist_name — renaming an artist post-launch is a bigger
// decision than this form should make casually.
export async function updateArtist(id: number, input: ArtistUpdateInput): Promise<ArtistRecord | null> {
  await ensureSchema();
  const pool = getPool();

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  const set = (col: string, val: unknown) => {
    fields.push(`${col} = $${i++}`);
    values.push(val);
  };
  if (input.fandomName !== undefined) set('fandom_name', input.fandomName);
  if (input.agency !== undefined) set('agency', input.agency);
  if (input.officialStatus !== undefined) set('official_status', input.officialStatus);
  if (input.logoLicense !== undefined) set('logo_license', input.logoLicense);
  if (input.logoUrl !== undefined) set('logo_url', input.logoUrl);
  if (input.imageLicense !== undefined) set('image_license', input.imageLicense);
  if (input.heroImageUrl !== undefined) set('hero_image_url', input.heroImageUrl);

  if (fields.length === 0) {
    const { rows } = await pool.query<ArtistRow>('SELECT * FROM artists WHERE id = $1', [id]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  fields.push('updated_at = now()');
  values.push(id);
  const { rows } = await pool.query<ArtistRow>(
    `UPDATE artists SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return rows[0] ? mapRow(rows[0]) : null;
}
