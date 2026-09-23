import { ArtistProfile, MusicRelease, MusicVideo, PhotoItem, SocialLinks, SiteSettings } from '../types';

export const initialArtistProfile: ArtistProfile = {
  name: 'TANBYR',
  tagline: 'Artist / Singer-Songwriter',
  bio: `TANBYR is an emerging independent artist from Bangladesh, creating music inspired by emotions, dreams, love, and the stories we often keep to ourselves.

Blending emotive Bengali songwriting with contemporary acoustic textures, cinematic ambient layers, and heartfelt melodies, his music navigates love, longing, and poetic storytelling with modern nuance.`,
  profileImageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab6761610000e5eb61eed80a169785bf1b21053d',
  heroImageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab6761610000e5eb61eed80a169785bf1b21053d',
  genre: '#Banglapop',
  country: 'Bangladesh',
  location: 'Dhaka, Bangladesh',
  activeSince: '2026',
};

export const initialReleases: MusicRelease[] = [
  {
    id: 'rel-mayabi-chokh-2026',
    title: 'Mayabi Chokh',
    type: 'Single',
    slug: 'mayabi-chokh',
    releaseDate: '2026-10-10',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=80',
    description: 'Upcoming melodic indie-pop single by TANBYR exploring starlit nostalgia, unspoken yearning, and acoustic elegance. Dropping soon on all streaming platforms.',
    smartUrl: 'https://ffem.bio/tanbyr-mayabichokh',
    streamingPlatforms: [
      { id: 'sp-mb-1', platform: 'spotify', label: 'Spotify Pre-Save', url: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link', actionText: 'Pre-Save' },
      { id: 'am-mb-1', platform: 'appleMusic', label: 'Apple Music Pre-Add', url: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7', actionText: 'Pre-Add' },
      { id: 'yt-mb-1', platform: 'youtube', label: 'YouTube Premiere', url: 'https://youtube.com/@tanbyrmusic', actionText: 'Notify' },
    ],
    spotifyUrl: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link',
    youtubeUrl: 'https://youtube.com/@tanbyrmusic',
    youtubeMusicUrl: 'https://music.youtube.com/search?q=tanbyr+mayabi+chokh',
    appleMusicUrl: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7',
    otherUrl: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link',
    credits: 'Composed, Written & Performed by TANBYR · Production & Mix by TANBYR Studio',
    featured: true,
    order: 0,
    createdAt: '2026-09-18T12:00:00Z',
  },
  {
    id: 'rel-tomar-hasi-2026',
    title: 'Tomar Hasi',
    type: 'Single',
    slug: 'tomar-hasi',
    releaseDate: '2026-08-08',
    coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b27346f38a1df6be191f41ec1bef',
    description: 'Official single by TANBYR released on Spotify. A heartfelt ballad combining warm acoustic tones, intimate lyricism, and modern melody.',
    streamingPlatforms: [
      { id: 'sp-1', platform: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/track/1GL2KkLinDVBRpXplTZe3I', actionText: 'Listen' },
      { id: 'am-1', platform: 'appleMusic', label: 'Apple Music', url: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7', actionText: 'Listen' },
      { id: 'ym-1', platform: 'youtubeMusic', label: 'YouTube Music', url: 'https://music.youtube.com/search?q=tanbyr+tomar+hasi', actionText: 'Listen' },
      { id: 'yt-1', platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@tanbyrmusic', actionText: 'Watch' },
      { id: 'az-1', platform: 'amazonMusic', label: 'Amazon Music', url: 'https://music.amazon.com/search/tanbyr+tomar+hasi', actionText: 'Stream' },
    ],
    spotifyUrl: 'https://open.spotify.com/track/1GL2KkLinDVBRpXplTZe3I',
    youtubeUrl: 'https://youtube.com/@tanbyrmusic',
    youtubeMusicUrl: 'https://music.youtube.com/search?q=tanbyr+tomar+hasi',
    appleMusicUrl: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7',
    otherUrl: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link',
    lyricsUrl: '#',
    credits: 'Composed, Written & Performed by TANBYR',
    featured: true,
    order: 1,
    createdAt: '2026-08-08T12:00:00Z',
  },
  {
    id: 'rel-jabonare-2026',
    title: 'Jabonare',
    type: 'Single',
    slug: 'jabonare',
    releaseDate: '2026-09-15',
    coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1000&q=80',
    description: 'An atmospheric indie ballad that captures quiet melancholia, poetic surrender, and heartfelt acoustic warmth.',
    streamingPlatforms: [
      { id: 'sp-2', platform: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link', actionText: 'Listen' },
      { id: 'am-2', platform: 'appleMusic', label: 'Apple Music', url: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7', actionText: 'Listen' },
      { id: 'ym-2', platform: 'youtubeMusic', label: 'YouTube Music', url: 'https://music.youtube.com/search?q=tanbyr+jabonare', actionText: 'Listen' },
      { id: 'yt-2', platform: 'youtube', label: 'YouTube Video', url: 'https://youtube.com/@tanbyrmusic', actionText: 'Watch' },
      { id: 'az-2', platform: 'amazonMusic', label: 'Amazon Music', url: 'https://music.amazon.com/search/tanbyr+jabonare', actionText: 'Stream' },
    ],
    spotifyUrl: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link',
    youtubeUrl: 'https://youtube.com/@tanbyrmusic',
    youtubeMusicUrl: 'https://music.youtube.com/search?q=tanbyr+jabonare',
    appleMusicUrl: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7',
    otherUrl: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link',
    lyricsUrl: '#',
    lyricsText: `[Verse 1]
নিশিরাতে মেঘের ছায়ায় দাঁড়িয়ে একা
শব্দহীন শহরে যদি পাইরে দেখা
বাতাস বলে ফিরে যা তুই ঘরের পানে
হৃদয় জুড়ে শুধুই তোকে ভাবার টানে

[Chorus]
যাবোনা রে যাবোনা রে তোমায় ছেড়ে আর কোথাও
যদি মেঘ জমে এই আকাশে আমায় জড়িয়ে নাও
যাবোনা রে যাবোনা রে দূর সীমানার ওপারে
বাঁধবো তোমায় আমার গানের প্রতি চরণে...

[Verse 2]
কুয়াশা ঘেরা এই শহরের বুক চিরে
কত কথা জমে আছে কত দীর্ঘশ্বাসে
তোমার হাসির এক টুকরো আলো পেলে
সব আঁধার মুছে যায় ভোরের বাতাসে...

[Outro]
যাবোনা রে... তোমায় ছেড়ে... যাবোনা রে...`,
    credits: 'Composed, Written & Performed by TANBYR · Mastered by SoundLab Studio',
    featured: true,
    order: 2,
    createdAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'rel-city-nights-2026',
    title: 'City Nights (Acoustic)',
    type: 'Single',
    releaseDate: '2026-04-20',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    description: 'A stripped-down live acoustic recording celebrating late night city lights, fleeting memories, and midnight rain.',
    spotifyUrl: 'https://open.spotify.com/artist/placeholder-tanbyr',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeMusicUrl: 'https://music.youtube.com/search?q=tanbyr',
    appleMusicUrl: 'https://music.apple.com/artist/placeholder-tanbyr',
    credits: 'Acoustic Guitar & Vocals: TANBYR · Recorded Live at Studio 71',
    featured: false,
    order: 2,
    createdAt: '2026-04-20T10:00:00Z',
  }
];

export const initialMusicVideos: MusicVideo[] = [
  {
    id: 'vid-jabonare-official',
    title: 'Jabonare — Official Music Video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Cinematic visual companion for TANBYR\'s breakout single "Jabonare", captured across evocative riverfront mist and atmospheric lighting.',
    releaseDate: '2026-09-15',
    featured: true,
    order: 1,
  },
  {
    id: 'vid-city-acoustic-live',
    title: 'City Nights — Live Studio Session',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'An intimate one-take acoustic performance recorded under warm incandescent studio lighting.',
    releaseDate: '2026-05-10',
    featured: true,
    order: 2,
  },
  {
    id: 'vid-behind-the-scenes',
    title: 'Behind the Sound: In the Studio with TANBYR',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'A behind-the-scenes documentary capturing the songwriting sessions, guitar arrangements, and vocal takes.',
    releaseDate: '2026-07-02',
    featured: false,
    order: 3,
  }
];

export const initialPhotos: PhotoItem[] = [
  {
    id: 'photo-1',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Studio songwriting session with vintage acoustic guitar',
    category: 'Studio',
    date: '2026-08-14',
    featured: true,
  },
  {
    id: 'photo-2',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    caption: 'Stage rehearsal under low golden spotlights',
    category: 'Live',
    date: '2026-07-28',
    featured: true,
  },
  {
    id: 'photo-3',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    caption: 'Official portrait for "Jabonare" single announcement',
    category: 'Press',
    date: '2026-09-01',
    featured: true,
  },
  {
    id: 'photo-4',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    caption: 'Live performance in indie music showcase',
    category: 'Live',
    date: '2026-06-18',
    featured: false,
  },
  {
    id: 'photo-5',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    caption: 'Analog mixing desk and vocal microphone setup',
    category: 'Studio',
    date: '2026-05-12',
    featured: false,
  },
  {
    id: 'photo-6',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    caption: 'Backstage candid moments before stepping onto the stage',
    category: 'Backstage',
    date: '2026-04-30',
    featured: false,
  },
];

export const initialSocialLinks: SocialLinks = {
  customLinks: [
    { id: 'soc-spotify', platform: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link', enabled: true },
    { id: 'soc-youtube', platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@tanbyrmusic', enabled: true },
    { id: 'soc-instagram', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/tanbyrmusic', enabled: true },
    { id: 'soc-appleMusic', platform: 'appleMusic', label: 'Apple Music', url: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7', enabled: true },
    { id: 'soc-facebook', platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/tanbyrmusic', enabled: true },
    { id: 'soc-tiktok', platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@tanbyrmusic', enabled: true },
  ],
  spotify: 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link',
  youtube: 'https://youtube.com/@tanbyrmusic',
  instagram: 'https://instagram.com/tanbyrmusic',
  tiktok: 'https://tiktok.com/@tanbyrmusic',
  facebook: 'https://facebook.com/tanbyrmusic',
  x: 'https://x.com/tanbyrmusic',
  appleMusic: 'https://music.apple.com/artist/7tUWUGzYWCzKKf7JwbhmP7',
  youtubeMusic: 'https://music.youtube.com/search?q=tanbyr',
};

export const initialSiteSettings: SiteSettings = {
  websiteTitle: 'TANBYR — Official Artist Website',
  metaDescription: 'Official website of TANBYR — independent artist, singer and songwriter from Bangladesh.',
  ogImageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab6761610000e5eb61eed80a169785bf1b21053d',
  keywords: 'TANBYR, Tanbyr music, Tomar Hasi, Jabonare, Banglapop, singer songwriter, independent artist, Bangladesh',
  canonicalUrl: 'https://tanbyr.com',
};
