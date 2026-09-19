import { MusicRelease, MusicVideo } from '../types';

export interface SpotifySyncResponse {
  success: boolean;
  artistName?: string;
  artistImage?: string;
  count: number;
  releases: MusicRelease[];
  message?: string;
  error?: string;
}

export interface YouTubeSyncResponse {
  success: boolean;
  channelTitle?: string;
  channelId?: string;
  count: number;
  videos: MusicVideo[];
  message?: string;
  error?: string;
}

/**
 * Sync releases from Spotify via our backend API
 */
export async function syncFromSpotify(urlOrArtistId: string): Promise<SpotifySyncResponse> {
  const clean = (urlOrArtistId || '').trim();
  if (!clean) {
    return { success: false, count: 0, releases: [], error: 'Please enter a Spotify artist link or track URL.' };
  }

  try {
    const res = await fetch('/api/spotify/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: clean })
    });
    if (!res.ok) {
      throw new Error(`Spotify sync server responded with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to sync from Spotify API:', err);
    return {
      success: false,
      count: 0,
      releases: [],
      error: err.message || 'Could not connect to Spotify sync service.'
    };
  }
}

/**
 * Sync videos from YouTube Channel or Video URLs via our backend API
 */
export async function syncFromYouTube(channelOrVideoInput: string): Promise<YouTubeSyncResponse> {
  const clean = (channelOrVideoInput || '').trim();
  if (!clean) {
    return { success: false, count: 0, videos: [], error: 'Please enter a YouTube channel handle/link or video URL.' };
  }

  try {
    const res = await fetch('/api/youtube/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: clean })
    });
    if (!res.ok) {
      throw new Error(`YouTube sync server responded with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to sync from YouTube API:', err);
    return {
      success: false,
      count: 0,
      videos: [],
      error: err.message || 'Could not connect to YouTube sync service.'
    };
  }
}

export interface SmartLinkSyncResponse {
  success: boolean;
  title?: string;
  coverImage?: string;
  description?: string;
  smartUrl: string;
  message?: string;
  error?: string;
}

/**
 * Fetch release details from Feature.fm (ffem.bio / ffm.bio) or other smart links
 */
export async function syncFromSmartLink(urlInput: string): Promise<SmartLinkSyncResponse> {
  const clean = (urlInput || '').trim();
  if (!clean) {
    return { success: false, smartUrl: '', error: 'Please enter a Feature.fm or smart link URL.' };
  }

  const normalized = (!clean.startsWith('http://') && !clean.startsWith('https://'))
    ? `https://${clean}`
    : clean;

  try {
    const res = await fetch('/api/smartlink/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: normalized })
    });
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('Fallback parsing smart link:', err);
    let fallbackTitle = 'New Release';
    try {
      const parts = new URL(normalized).pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        fallbackTitle = parts[parts.length - 1]
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    } catch {}

    return {
      success: true,
      smartUrl: normalized,
      title: fallbackTitle,
      message: 'Initialized with smart link URL.'
    };
  }
}

