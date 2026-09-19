export interface ArtistProfile {
  name: string;
  tagline: string;
  bio: string;
  profileImageUrl: string;
  heroImageUrl: string;
  genre: string;
  country: string;
  location: string;
  activeSince: string;
}

export interface CustomSocialLink {
  id: string;
  platform: string; // 'instagram' | 'spotify' | 'youtube' | 'facebook' | 'tiktok' | 'x' | 'appleMusic' | 'youtubeMusic' | 'soundcloud' | 'bandcamp' | 'threads' | 'whatsapp' | 'discord' | 'custom';
  label: string;
  url: string;
  enabled?: boolean;
}

export interface StreamingPlatformLink {
  id: string;
  platform: string; // 'spotify' | 'appleMusic' | 'youtubeMusic' | 'youtube' | 'amazonMusic' | 'deezer' | 'tidal' | 'soundcloud' | 'bandcamp' | 'jiosaavn' | 'audiomack' | 'custom';
  label: string;
  url: string;
  actionText?: string; // 'Listen' | 'Play' | 'Stream' | 'Watch' | 'Buy';
}

export interface MusicRelease {
  id: string;
  title: string;
  type: 'Single' | 'EP' | 'Album';
  releaseDate: string;
  coverImage: string;
  description: string;
  slug?: string;
  smartUrl?: string; // Feature.fm, ffem.bio, ffm.bio or other all-in-one smart link
  // Available streaming platforms added dynamically via (+) Plus icon:
  streamingPlatforms?: StreamingPlatformLink[];
  spotifyUrl?: string;
  previewAudioUrl?: string;
  youtubeUrl?: string;
  youtubeMusicUrl?: string;
  appleMusicUrl?: string;
  otherUrl?: string;
  lyricsUrl?: string;
  lyricsText?: string;
  credits?: string;
  featured: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  description: string;
  releaseDate: string;
  featured: boolean;
  order?: number;
  createdAt?: string;
}

export interface PhotoItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: 'Live' | 'Press' | 'Studio' | 'Editorial' | 'Backstage';
  date: string;
  featured: boolean;
  order?: number;
  createdAt?: string;
}

export interface SocialLinks {
  customLinks?: CustomSocialLink[];
  spotify?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  x?: string;
  appleMusic?: string;
  youtubeMusic?: string;
}

export interface SiteSettings {
  websiteTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  keywords: string;
  canonicalUrl: string;
}
