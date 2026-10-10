import { MusicRelease, ArtistProfile } from '../types';

/**
 * Converts mm:ss or hh:mm:ss format (e.g. "3:42") to ISO 8601 duration ("PT3M42S")
 * for Schema.org MusicRecording duration compliance.
 */
export function formatIsoDuration(durationStr?: string): string {
  if (!durationStr) return '';
  const clean = durationStr.trim();
  const parts = clean.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return `PT${parts[0]}M${parts[1]}S`;
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
  }
  return '';
}

/**
 * Builds valid Schema.org JSON-LD structured data for a release
 */
export function generateReleaseSchema(release: MusicRelease, artist: ArtistProfile, canonicalUrl: string) {
  const isMultiTrack = (release.releaseType === 'ep' || release.releaseType === 'album');
  
  // Collect verified streaming URLs for sameAs
  const sameAsUrls: string[] = [];
  if (release.spotifyUrl && release.spotifyUrl !== '#') sameAsUrls.push(release.spotifyUrl);
  if (release.appleMusicUrl && release.appleMusicUrl !== '#') sameAsUrls.push(release.appleMusicUrl);
  if (release.youtubeUrl && release.youtubeUrl !== '#') sameAsUrls.push(release.youtubeUrl);
  if (release.youtubeMusicUrl && release.youtubeMusicUrl !== '#') sameAsUrls.push(release.youtubeMusicUrl);
  if (release.smartUrl && release.smartUrl !== '#') sameAsUrls.push(release.smartUrl);

  const artistEntity = {
    '@type': 'MusicGroup',
    '@id': 'https://tanbyr.com/#artist',
    name: artist.name || 'TANBYR',
    url: 'https://tanbyr.com/',
  };

  if (isMultiTrack) {
    const tracksList = (release.tracks && release.tracks.length > 0)
      ? release.tracks.map((t, idx) => {
          const trackSameAs: string[] = [];
          if (t.spotifyUrl) trackSameAs.push(t.spotifyUrl);
          if (t.youtubeUrl) trackSameAs.push(t.youtubeUrl);
          if (t.appleMusicUrl) trackSameAs.push(t.appleMusicUrl);

          const isoDuration = formatIsoDuration(t.duration);

          return {
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'MusicRecording',
              name: t.title || `Track ${idx + 1}`,
              position: t.trackNumber || idx + 1,
              byArtist: artistEntity,
              ...(isoDuration ? { duration: isoDuration } : {}),
              ...(t.isrc ? { isrcCode: t.isrc } : {}),
              ...(trackSameAs.length > 0 ? { sameAs: trackSameAs } : {}),
            },
          };
        })
      : [];

    return {
      '@context': 'https://schema.org',
      '@type': 'MusicAlbum',
      '@id': `${canonicalUrl}#album`,
      name: release.title,
      albumReleaseType: release.releaseType === 'ep' ? 'https://schema.org/EP' : 'https://schema.org/Album',
      byArtist: artistEntity,
      datePublished: release.releaseDate,
      image: release.coverImage,
      description: release.description || `${release.type} by ${artist.name}`,
      ...(release.genre ? { genre: release.genre } : {}),
      ...(release.upc ? { gtin12: release.upc } : {}),
      url: canonicalUrl,
      ...(sameAsUrls.length > 0 ? { sameAs: sameAsUrls } : {}),
      ...(tracksList.length > 0
        ? {
            numTracks: tracksList.length,
            track: {
              '@type': 'ItemList',
              numberOfItems: tracksList.length,
              itemListElement: tracksList,
            },
          }
        : {}),
    };
  }

  // Single release schema
  const isoDuration = formatIsoDuration(release.tracks?.[0]?.duration);
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    '@id': `${canonicalUrl}#recording`,
    name: release.title,
    byArtist: artistEntity,
    datePublished: release.releaseDate,
    image: release.coverImage,
    description: release.description || `Single "${release.title}" by ${artist.name}`,
    url: canonicalUrl,
    ...(release.isrc ? { isrcCode: release.isrc } : {}),
    ...(release.genre ? { genre: release.genre } : {}),
    ...(isoDuration ? { duration: isoDuration } : {}),
    ...(sameAsUrls.length > 0 ? { sameAs: sameAsUrls } : {}),
    inAlbum: {
      '@type': 'MusicAlbum',
      name: `${release.title} - Single`,
      byArtist: artistEntity,
    },
  };
}

/**
 * Injects/updates head meta tags and structured data dynamically
 */
export function updateDocumentMetadata(
  title: string,
  description: string,
  canonicalUrl: string,
  imageUrl: string,
  ogType: 'music.song' | 'music.album' | 'website' = 'website',
  schemaData?: object
) {
  if (typeof document === 'undefined') return;

  // 1. Document title
  document.title = title;

  // 2. Meta description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', description);

  // 3. Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Helper for meta tags
  const setMeta = (attr: 'property' | 'name', key: string, value: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  // 4. Open Graph
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:image', imageUrl);
  setMeta('property', 'og:type', ogType);

  // 5. Twitter
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', imageUrl);

  // 6. Structured Data (JSON-LD)
  if (schemaData) {
    let scriptEl = document.getElementById('tanbyr-release-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'tanbyr-release-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaData, null, 2);
  }
}
