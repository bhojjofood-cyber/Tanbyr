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
  AuthState,
} from './lib/firebase';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Data State
  const [artist, setArtist] = useState<ArtistProfile>(initialArtistProfile);
  const [releases, setReleases] = useState<MusicRelease[]>(initialReleases);
  const [videos, setVideos] = useState<MusicVideo[]>(initialMusicVideos);
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [socials, setSocials] = useState<SocialLinks>(initialSocialLinks);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
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

  // Listen for browser navigation (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe client-side route navigation
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
          onExitToPublic={() => navigate('/')}
          onLogout={() => navigate('/admin')}
        />
      );
    }

    // Otherwise render secure login
    return (
      <AdminLoginPage
        onLoginSuccess={() => navigate('/admin')}
        onExitToPublic={() => navigate('/')}
      />
    );
  }

  // -----------------------------------------------------------------
  // PUBLIC WEBSITE
  // -----------------------------------------------------------------
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
      <Footer socials={socials} />

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
