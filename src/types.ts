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

export interface MusicRelease {
  id: string;
  title: string;
  type: 'Single' | 'EP' | 'Album';
  releaseDate: string;
  coverImage: string;
  description: string;
  spotifyUrl?: string;
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
