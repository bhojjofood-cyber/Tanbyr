import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { LyricsModal } from './components/LyricsModal';
import { PhotoLightbox } from './components/PhotoLightbox';

import { HomePage } from './pages/HomePage';
import { MusicPage } from './pages/MusicPage';
import { VideosPage } from './pages/VideosPage';
import { PhotosPage } from './pages/PhotosPage';
import { AboutPage } from './pages/AboutPage';
import { ReleaseSmartLinkPage } from './pages/ReleaseSmartLinkPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

import {
  ArtistProfile,
  MusicRelease,
  MusicVideo,
  PhotoItem,
  SocialLinks,
  SiteSettings,
} from './types';

import {
  initialArtistProfile,
  initialReleases,
  initialMusicVideos,
  initialPhotos,
  initialSocialLinks,
  initialSiteSettings,
} from './lib/seedData';

import {
  getArtistProfile,
  getReleases,
  getMusicVideos,
  getPhotos,
  getSocialLinks,
  getSiteSettings,
  subscribeToAuth,
  lockAdminSession,
  AuthState,
} from './lib/firebase';

function getNormalizedPath(): string {
  // 1. Check hash route (e.g. #/admin, #admin, #music) - avoids server 404s completely
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    if (rawHash && rawHash !== '/') {
      return '/' + rawHash.replace(/^\/+/, '').replace(/\/+$/, '');
    }
  }

  // 2. Check query parameters (e.g. ?admin, ?p=admin, ?page=admin)
  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('admin')) return '/admin';
    const p = searchParams.get('p') || searchParams.get('page') || searchParams.get('route');
    if (p) return '/' + p.replace(/^\/+/, '').replace(/\/+$/, '');
  }

  // 3. Fallback to standard pathname
  const path = window.location.pathname || '/';
  if (path !== '/') {
    return '/' + path.replace(/^\/+/, '').replace(/\/+$/, '');
  }
  return '/';
}

// Safe synchronous local storage retrieval to eliminate any flash of dummy/seed images
function getInitialLocalState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return getNormalizedPath();
  });

  // Data State (Initialized synchronously from localStorage to eliminate any flash of dummy/seed images)
  const [artist, setArtist] = useState<ArtistProfile>(() => {
    const cached = getInitialLocalState<ArtistProfile>('tanbyr_artist_profile', initialArtistProfile);
    return { ...initialArtistProfile, ...(cached || {}) };
  });
  const [releases, setReleases] = useState<MusicRelease[]>(() => {
    return getInitialLocalState<MusicRelease[]>('tanbyr_music_releases', initialReleases);
  });
  const [videos, setVideos] = useState<MusicVideo[]>(() => {
    return getInitialLocalState<MusicVideo[]>('tanbyr_music_videos', initialMusicVideos);
  });
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    return getInitialLocalState<PhotoItem[]>('tanbyr_photos', initialPhotos);
  });
  const [socials, setSocials] = useState<SocialLinks>(() => {
    const cached = getInitialLocalState<SocialLinks>('tanbyr_social_links', initialSocialLinks);
    return { ...initialSocialLinks, ...(cached || {}) };
  });
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const cached = getInitialLocalState<SiteSettings>('tanbyr_site_settings', initialSiteSettings);
    return { ...initialSiteSettings, ...(cached || {}) };
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authentication State
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
    isDemoAuth: false,
  });

  // Active Modals
  const [activeVideo, setActiveVideo] = useState<MusicVideo | null>(null);
  const [activeLyricsRelease, setActiveLyricsRelease] = useState<MusicRelease | null>(null);
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  // Fetch all live or local data
  const loadAppData = useCallback(async () => {
    try {
      const [artistData, releasesData, videosData, photosData, socialsData, settingsData] =
        await Promise.all([
          getArtistProfile(),
          getReleases(),
          getMusicVideos(),
          getPhotos(),
          getSocialLinks(),
          getSiteSettings(),
        ]);

      setArtist(artistData || initialArtistProfile);
      setReleases(releasesData || initialReleases);
      setVideos(videosData || initialMusicVideos);
      setPhotos(photosData || initialPhotos);
      setSocials(socialsData ? { ...initialSocialLinks, ...socialsData } : initialSocialLinks);
      setSettings(settingsData || initialSiteSettings);
    } catch (err) {
      console.warn('Error fetching application data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Safe client-side route navigation
  const navigate = useCallback((path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      window.location.hash = path;
    }
    const cleanPath = path.replace(/\/+$/, '') || '/';
    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser navigation (back/forward button) & hash route change
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getNormalizedPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Discreet shortcut to toggle /admin (Ctrl+Alt+A or Cmd+Alt+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  // Initial load and auth subscription
  useEffect(() => {
    loadAppData();

    const unsubscribeAuth = subscribeToAuth((state) => {
      setAuthState(state);
    });

    const handleDataUpdate = () => {
      loadAppData();
    };

    window.addEventListener('tanbyr_data_updated', handleDataUpdate);

    return () => {
      unsubscribeAuth();
      window.removeEventListener('tanbyr_data_updated', handleDataUpdate);
    };
  }, [loadAppData]);

  // Dynamic SEO title & metadata synchronization
  useEffect(() => {
    let pageTitle = settings.websiteTitle || 'TANBYR — Official Artist Website';
    if (currentPath === '/music') pageTitle = `Music & Releases — ${artist.name}`;
    else if (currentPath === '/videos') pageTitle = `Music Videos — ${artist.name}`;
    else if (currentPath === '/photos') pageTitle = `Photography — ${artist.name}`;
    else if (currentPath === '/about') pageTitle = `About ${artist.name} — Biography`;
    else if (currentPath.startsWith('/admin') || currentPath.startsWith('/admintanbyr')) {
      pageTitle = `Admin Portal — ${artist.name}`;
    }

    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        settings.metaDescription ||
          `Official website of ${artist.name} — independent artist, singer and songwriter.`
      );
    }
  }, [currentPath, settings, artist]);

  // Identify Latest Release (featured first, or most recent)
  const latestRelease =
    releases.find((r) => r.featured) || (releases.length > 0 ? releases[0] : null);

  const featuredVideos = videos.filter((v) => v.featured).length > 0
    ? videos.filter((v) => v.featured)
    : videos;

  const featuredPhotos = photos.filter((p) => p.featured).length > 0
    ? photos.filter((p) => p.featured)
    : photos;

  // -----------------------------------------------------------------
  // SECURE ADMIN ROUTING (/admin or /admintanbyr)
  // -----------------------------------------------------------------
  const isAdminRoute =
    currentPath === '/admin' ||
    currentPath.startsWith('/admin/') ||
    currentPath === '/admintanbyr' ||
    currentPath.startsWith('/admintanbyr/');

  if (isAdminRoute) {
    // If authenticated as admin, render full CMS dashboard
    if (authState.isAdmin) {
      return (
        <AdminDashboardPage
          artist={artist}
          releases={releases}
          videos={videos}
          photos={photos}
          socials={socials}
          settings={settings}
          onRefreshData={loadAppData}
          onExitToPublic={() => {
            lockAdminSession();
            navigate('/');
          }}
          onLogout={() => {
            lockAdminSession();
            navigate('/admin');
          }}
        />
      );
    }

    // Otherwise render secure login
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          setAuthState({
            user: null,
            isAdmin: true,
            loading: false,
            isDemoAuth: true,
          });
          navigate('/admin');
        }}
        onExitToPublic={() => {
          lockAdminSession();
          navigate('/');
        }}
      />
    );
  }

  // -----------------------------------------------------------------
  // DEDICATED RELEASE SMART LINK LANDING PAGE (/release/:slug)
  // Perfect for Instagram Bio, YouTube descriptions, and fan link-in-bio
  // -----------------------------------------------------------------
  const isReleaseRoute = currentPath === '/release' || currentPath.startsWith('/release/');
  if (isReleaseRoute) {
    const rawParam = currentPath.replace(/^\/release\/?/, '').trim().toLowerCase();
    const matchedRelease =
      releases.find((r) => r.slug && r.slug.toLowerCase() === rawParam) ||
      releases.find((r) => r.id.toLowerCase() === rawParam) ||
      releases.find(
        (r) =>
          r.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-') === rawParam
      ) ||
      latestRelease ||
      releases[0];

    if (matchedRelease) {
      return (
        <ReleaseSmartLinkPage
          release={matchedRelease}
          artist={artist}
          onBackHome={() => navigate('/')}
        />
      );
    }
  }

  // -----------------------------------------------------------------
  // PUBLIC WEBSITE
  // -----------------------------------------------------------------
  // Branded initial loading screen: if initial fetch is running and no data is cached yet,
  // show clean artist branding instead of ever flashing dummy / stock imagery
  const hasCachedProfile = typeof window !== 'undefined' && Boolean(localStorage.getItem('tanbyr_artist_profile'));
  if (isLoading && !hasCachedProfile && !isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-white select-none">
        <div className="flex flex-col items-center space-y-4">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-[0.35em] text-white uppercase animate-pulse">
            TANBYR
          </span>
          <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070709] text-neutral-100 font-sans selection:bg-white selection:text-black">
      {/* Public Navbar */}
      <Navbar currentPath={currentPath} onNavigate={navigate} socials={socials} />

      {/* Main Page Routing */}
      <main className="flex-grow">
        {currentPath === '/' && (
          <HomePage
            artist={artist}
            latestRelease={latestRelease}
            featuredVideos={featuredVideos}
            featuredPhotos={featuredPhotos}
            onNavigate={navigate}
            onPlayVideo={(v) => setActiveVideo(v)}
            onOpenLyrics={(r) => setActiveLyricsRelease(r)}
          />
        )}

        {currentPath === '/music' && (
          <MusicPage
            releases={releases}
            onOpenLyrics={(r) => setActiveLyricsRelease(r)}
          />
        )}

        {currentPath === '/videos' && (
          <VideosPage
            videos={videos}
            onPlayVideo={(v) => setActiveVideo(v)}
          />
        )}

        {currentPath === '/photos' && (
          <PhotosPage
            photos={photos}
            onSelectPhoto={(p) => setActivePhoto(p)}
          />
        )}

        {currentPath === '/about' && (
          <AboutPage artist={artist} socials={socials} />
        )}
      </main>

      {/* Public Social Footer */}
      <Footer socials={socials} onNavigate={navigate} />

      {/* Global Interactive Modals */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        videoUrl={activeVideo?.youtubeUrl || ''}
        title={activeVideo?.title || 'Music Video'}
        onClose={() => setActiveVideo(null)}
      />

      <LyricsModal
        isOpen={Boolean(activeLyricsRelease)}
        release={activeLyricsRelease}
        onClose={() => setActiveLyricsRelease(null)}
      />

      <PhotoLightbox
        photo={activePhoto}
        onClose={() => setActivePhoto(null)}
      />
    </div>
  );
}
