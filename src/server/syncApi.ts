export interface SpotifySyncResult {
  success: boolean;
  artistName?: string;
  artistImage?: string;
  count: number;
  releases: Array<{
    id: string;
    title: string;
    type: 'Single' | 'EP' | 'Album';
    slug: string;
    releaseDate: string;
    coverImage: string;
    description: string;
    spotifyUrl: string;
    previewAudioUrl?: string;
    streamingPlatforms: Array<{
      id: string;
      platform: string;
      label: string;
      url: string;
      actionText: string;
    }>;
    featured: boolean;
  }>;
  message?: string;
  error?: string;
}

export interface YouTubeSyncResult {
  success: boolean;
  channelTitle?: string;
  channelId?: string;
  count: number;
  videos: Array<{
    id: string;
    title: string;
    thumbnailUrl: string;
    youtubeUrl: string;
    description: string;
    releaseDate: string;
    featured: boolean;
  }>;
  message?: string;
  error?: string;
}

function createSlug(title: string): string {
  return (title || 'track')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch and extract tracks/albums from Spotify public embed pages
 */
export async function syncSpotifyData(inputUrlOrId: string): Promise<SpotifySyncResult> {
  const clean = (inputUrlOrId || '').trim();
  if (!clean) {
    return { success: false, count: 0, releases: [], error: 'Spotify URL or Artist ID is required.' };
  }

  try {
    let type: 'artist' | 'track' | 'album' = 'artist';
    let id = clean;

    if (clean.includes('track/')) {
      type = 'track';
      id = clean.split('track/')[1].split('/')[0].split('?')[0];
    } else if (clean.includes('album/')) {
      type = 'album';
      id = clean.split('album/')[1].split('/')[0].split('?')[0];
    } else if (clean.includes('artist/')) {
      type = 'artist';
      id = clean.split('artist/')[1].split('/')[0].split('?')[0];
    } else {
      id = clean.split('?')[0];
    }

    if (type === 'track') {
      const trackRes = await fetch(`https://open.spotify.com/embed/track/${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const html = await trackRes.text();
      const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
      if (match) {
        const data = JSON.parse(match[1]);
        const entity = data.props?.pageProps?.state?.data?.entity;
        const images = entity?.visualIdentity?.image || [];
        const highRes = images.find((img: any) => img.maxHeight >= 600) || images[0];
        const title = entity?.title || entity?.name || 'Spotify Release';
        const relDate = entity?.releaseDate?.isoString
          ? entity.releaseDate.isoString.split('T')[0]
          : new Date().toISOString().split('T')[0];
        const artistName = entity?.artists?.[0]?.name || 'TANBYR';

        return {
          success: true,
          artistName,
          count: 1,
          releases: [
            {
              id: `rel-spotify-${id}`,
              title,
              type: 'Single',
              slug: createSlug(title),
              releaseDate: relDate,
              coverImage: highRes?.url || 'https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b27346f38a1df6be191f41ec1bef',
              description: `Official track by ${artistName} released on Spotify.`,
              spotifyUrl: `https://open.spotify.com/track/${id}`,
              previewAudioUrl: entity?.audioPreview?.url,
              streamingPlatforms: [
                {
                  id: `sp-${id}`,
                  platform: 'spotify',
                  label: 'Spotify',
                  url: `https://open.spotify.com/track/${id}`,
                  actionText: 'Listen'
                }
              ],
              featured: true
            }
          ]
        };
      }
    }

    // Artist embed sync (default)
    const embedRes = await fetch(`https://open.spotify.com/embed/artist/${id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const embedHtml = await embedRes.text();
    const nextMatch = embedHtml.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);

    if (!nextMatch) {
      // Fallback to oEmbed if next data not matched
      const oembedRes = await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/artist/${id}`);
      const oembed = await oembedRes.json();
      return {
        success: true,
        artistName: oembed.title || 'TANBYR',
        artistImage: oembed.thumbnail_url,
        count: 0,
        releases: [],
        message: 'Connected to Spotify profile. No tracks found directly in embed.'
      };
    }

    const nextData = JSON.parse(nextMatch[1]);
    const entity = nextData.props?.pageProps?.state?.data?.entity;
    const artistName = entity?.name || entity?.title || 'TANBYR';
    const artistImages = entity?.visualIdentity?.image || [];
    const highResArtist = artistImages.find((img: any) => img.maxHeight >= 600) || artistImages[0];
    const trackList = entity?.trackList || [];

    const parsedReleases = [];

    for (const track of trackList) {
      const trackId = (track.uri || '').replace('spotify:track:', '') || track.uid;
      let coverImg = 'https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b27346f38a1df6be191f41ec1bef';
      let releaseDate = '2026-08-08';

      // Fetch track details for cover art and release date
      try {
        const trRes = await fetch(`https://open.spotify.com/embed/track/${trackId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const trHtml = await trRes.text();
        const trMatch = trHtml.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
        if (trMatch) {
          const trData = JSON.parse(trMatch[1]);
          const trEntity = trData.props?.pageProps?.state?.data?.entity;
          const trImgs = trEntity?.visualIdentity?.image || [];
          const trHighRes = trImgs.find((img: any) => img.maxHeight >= 600) || trImgs[0];
          if (trHighRes?.url) coverImg = trHighRes.url;
          if (trEntity?.releaseDate?.isoString) {
            releaseDate = trEntity.releaseDate.isoString.split('T')[0];
          }
        }
      } catch (trackErr) {
        console.warn('Track detail fetch warning:', trackErr);
      }

      parsedReleases.push({
        id: `rel-spotify-${trackId}`,
        title: track.title,
        type: 'Single' as const,
        slug: createSlug(track.title),
        releaseDate,
        coverImage: coverImg,
        description: `Official release by ${artistName} live on Spotify.`,
        spotifyUrl: `https://open.spotify.com/track/${trackId}`,
        previewAudioUrl: track.audioPreview?.url,
        streamingPlatforms: [
          {
            id: `sp-${trackId}`,
            platform: 'spotify',
            label: 'Spotify',
            url: `https://open.spotify.com/track/${trackId}`,
            actionText: 'Listen'
          }
        ],
        featured: true
      });
    }

    return {
      success: true,
      artistName,
      artistImage: highResArtist?.url,
      count: parsedReleases.length,
      releases: parsedReleases
    };
  } catch (err: any) {
    console.error('Error syncing Spotify data:', err);
    return {
      success: false,
      count: 0,
      releases: [],
      error: err.message || 'Failed to sync with Spotify.'
    };
  }
}

/**
 * Fetch and extract videos from YouTube Channel RSS feed or Video URLs
 */
export async function syncYouTubeData(inputUrlOrHandle: string): Promise<YouTubeSyncResult> {
  const clean = (inputUrlOrHandle || '').trim();
  if (!clean) {
    return { success: false, count: 0, videos: [], error: 'YouTube Channel or Video URL is required.' };
  }

  try {
    // Check if user provided direct video links (comma or whitespace separated)
    const videoMatches = [...clean.matchAll(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/g)];

    if (videoMatches.length > 0) {
      const uniqueVideoIds = [...new Set(videoMatches.map(m => m[1]))];
      const videos = [];

      for (const videoId of uniqueVideoIds) {
        try {
          const oembedRes = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
          );
          const oembed = await oembedRes.json();
          videos.push({
            id: `vid-yt-${videoId}`,
            title: oembed.title || 'Official Music Video',
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
            description: `Official music video by ${oembed.author_name || 'TANBYR'}.`,
            releaseDate: new Date().toISOString().split('T')[0],
            featured: true
          });
        } catch {
          videos.push({
            id: `vid-yt-${videoId}`,
            title: `TANBYR Music Video`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
            description: `Official music video stream.`,
            releaseDate: new Date().toISOString().split('T')[0],
            featured: true
          });
        }
      }

      return {
        success: true,
        count: videos.length,
        videos
      };
    }

    // Resolve channel ID from handle or URL
    let channelId = '';
    if (clean.includes('channel/')) {
      channelId = clean.split('channel/')[1].split('/')[0].split('?')[0];
    } else {
      let handle = clean;
      if (handle.startsWith('http')) {
        const parts = handle.split('/');
        handle = parts[parts.length - 1].split('?')[0];
      }
      if (!handle.startsWith('@') && !handle.startsWith('UC')) {
        handle = '@' + handle;
      }

      const chanPageRes = await fetch(`https://www.youtube.com/${handle}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const chanHtml = await chanPageRes.text();
      const m = chanHtml.match(/"externalId":"([^"]+)"/) || chanHtml.match(/"channelId":"([^"]+)"/);
      if (m) {
        channelId = m[1];
      }
    }

    if (!channelId) {
      return {
        success: false,
        count: 0,
        videos: [],
        error: 'Could not resolve YouTube Channel ID. Please provide a direct channel URL or video link.'
      };
    }

    // Fetch channel Atom feed
    const feedRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const feedXml = await feedRes.text();

    const channelTitleMatch = feedXml.match(/<title>([^<]+)<\/title>/);
    const channelTitle = channelTitleMatch ? channelTitleMatch[1] : 'TANBYR';

    // Parse video entries
    const entryBlocks = feedXml.split('<entry>').slice(1);
    const videos = [];

    for (const block of entryBlocks) {
      const vidMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = block.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = block.match(/<published>([^<]+)<\/published>/);
      const descMatch = block.match(/<media:description>([^<]*)<\/media:description>/);

      if (vidMatch && titleMatch) {
        const videoId = vidMatch[1];
        const title = titleMatch[1];
        const published = publishedMatch ? publishedMatch[1].split('T')[0] : new Date().toISOString().split('T')[0];
        const desc = descMatch ? descMatch[1].slice(0, 200) : `Official video by ${channelTitle}`;

        videos.push({
          id: `vid-yt-${videoId}`,
          title,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          description: desc,
          releaseDate: published,
          featured: true
        });
      }
    }

    return {
      success: true,
      channelTitle,
      channelId,
      count: videos.length,
      videos,
      message:
        videos.length === 0
          ? `Connected to YouTube channel "${channelTitle}", but no public uploaded videos were found in the feed yet. You can paste video links directly at any time.`
          : undefined
    };
  } catch (err: any) {
    console.error('Error syncing YouTube channel:', err);
    return {
      success: false,
      count: 0,
      videos: [],
      error: err.message || 'Failed to sync with YouTube.'
    };
  }
}

export interface SmartLinkFetchResult {
  success: boolean;
  title?: string;
  coverImage?: string;
  description?: string;
  smartUrl: string;
  platforms?: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
    actionText: string;
  }>;
  message?: string;
  error?: string;
}

/**
 * Fetch and extract metadata from Feature.fm (ffem.bio / ffm.bio / ffm.to) or other smart links
 */
export async function fetchSmartLinkMetadata(rawUrl: string): Promise<SmartLinkFetchResult> {
  let url = (rawUrl || '').trim();
  if (!url) {
    return { success: false, smartUrl: '', error: 'URL is required' };
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Fallback title from slug
  let fallbackTitle = '';
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const slug = pathParts[pathParts.length - 1];
      fallbackTitle = slug
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: true,
        smartUrl: url,
        title: fallbackTitle || 'New Release',
        message: 'Could not fetch page contents directly, initialized with smart URL.',
      };
    }

    const html = await response.text();

    // Extract OpenGraph Title
    let titleMatch =
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i) ||
      html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<title>([^<]+)<\/title>/i);

    let extractedTitle = titleMatch ? titleMatch[1].trim() : '';
    // Clean up generic Feature.fm / brand suffix
    if (extractedTitle) {
      extractedTitle = extractedTitle
        .replace(/\s*\|\s*Feature\.fm.*$/i, '')
        .replace(/\s*\|\s*ffm\.bio.*$/i, '')
        .replace(/\s*\|\s*Smartlink.*$/i, '')
        .replace(/\s*-\s*Listen on.*$/i, '')
        .trim();
    }

    // Extract OpenGraph Image
    let imageMatch =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
      html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

    let extractedImage = imageMatch ? imageMatch[1].trim() : '';

    // Extract Description
    let descMatch =
      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i) ||
      html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);

    let extractedDesc = descMatch ? descMatch[1].trim() : '';
    if (extractedDesc.toLowerCase().includes('listen to ') && extractedDesc.toLowerCase().includes('on feature.fm')) {
      extractedDesc = '';
    }

    return {
      success: true,
      smartUrl: url,
      title: extractedTitle || fallbackTitle || 'New Release',
      coverImage: extractedImage || '',
      description: extractedDesc || '',
    };
  } catch (err: any) {
    console.warn('Smart link metadata fetch error (using fallback):', err.message);
    return {
      success: true,
      smartUrl: url,
      title: fallbackTitle || 'New Release',
      coverImage: '',
      description: '',
      message: 'Initialized with smart link URL.',
    };
  }
}

