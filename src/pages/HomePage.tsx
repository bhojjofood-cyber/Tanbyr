import React from 'react';
import { motion, type Variants } from 'motion/react';
import { Play, ArrowRight, Disc3, ExternalLink, Share2, Sparkles, Flame, Calendar, Clock } from 'lucide-react';
import { ArtistProfile, MusicRelease, MusicVideo, PhotoItem, SocialLinks } from '../types';
import { VideoCard } from '../components/VideoCard';
import { SocialIcons } from '../components/SocialIcons';
import { SmartImage } from '../components/SmartImage';
import { BrandIcon, getBrandMeta, SpotifyLogo, YouTubeLogo } from '../components/BrandLogos';
import { FollowSubscribeSection } from '../components/FollowSubscribeSection';
import { CountdownTimer, isReleaseInFuture, getReleaseTargetTimestamp } from '../components/CountdownTimer';

// Cinematic animation variants for content sections
const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const showcaseCardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggeredGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const cinematicCardVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const detailsStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const detailItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface HomePageProps {
  artist: ArtistProfile;
  latestRelease: MusicRelease | null;
  releases?: MusicRelease[];
  featuredVideos: MusicVideo[];
  featuredPhotos: PhotoItem[];
  socials?: SocialLinks;
  onNavigate: (path: string) => void;
  onPlayVideo: (video: MusicVideo) => void;
  onOpenLyrics: (release: MusicRelease) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  artist,
  latestRelease,
  releases = [],
  featuredVideos,
  featuredPhotos,
  socials,
  onNavigate,
  onPlayVideo,
  onOpenLyrics,
}) => {
  // Identify upcoming release with future release date to automatically trigger countdown
  const upcomingRelease = React.useMemo(() => {
    const pool = releases && releases.length > 0 ? releases : (latestRelease ? [latestRelease] : []);
    const futureReleases = pool
      .filter((r) => isReleaseInFuture(r))
      .sort((a, b) => getReleaseTargetTimestamp(a.releaseDate) - getReleaseTargetTimestamp(b.releaseDate));
    return futureReleases[0] || null;
  }, [releases, latestRelease]);

  // Determine which released track to showcase in the Latest Release section:
  // If latestRelease is already released, display it!
  // If latestRelease is in the future, find the most recent past release so fans can listen while hyped
  const displayedLatestRelease = React.useMemo(() => {
    if (!latestRelease) return null;
    if (!isReleaseInFuture(latestRelease)) return latestRelease;
    const pastReleases = (releases || [])
      .filter((r) => !isReleaseInFuture(r))
      .sort((a, b) => getReleaseTargetTimestamp(b.releaseDate) - getReleaseTargetTimestamp(a.releaseDate));
    return pastReleases[0] || null;
  }, [latestRelease, releases]);

  const latestReleaseYear = displayedLatestRelease?.releaseDate
    ? new Date(displayedLatestRelease.releaseDate).getFullYear() || displayedLatestRelease.releaseDate
    : '2026';

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
      >
        {/* Cinematic Artist Hero Background Image */}
        <div className="absolute inset-0 z-0 bg-[#070709]">
          <SmartImage
            key={artist.heroImageUrl || 'hero-fallback'}
            src={artist.heroImageUrl}
            alt={`${artist.name} Hero`}
            priority={true}
            showSpinner={false}
            fallbackType="hero"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1]"
          />
          {/* Subtle multi-layer cinematic vignette & dark gradations */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#070709]/40 to-[#070709] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center pt-28 pb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Tagline / Subtitle */}
            <p className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-neutral-400 uppercase mb-4 sm:mb-6">
              {artist.tagline || 'Artist / Singer-Songwriter'}
            </p>

            {/* Giant Artist Moniker */}
            <h1
              id="hero-artist-name"
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-[0.25em] text-white uppercase select-none mb-6 drop-shadow-2xl"
            >
              {artist.name || 'TANBYR'}
            </h1>

            {/* Subtle Origin / Genre indicator */}
            <p className="max-w-xl text-sm sm:text-base text-neutral-300 font-light tracking-wide leading-relaxed mb-6 text-center">
              <span>{artist.genre || '#Banglapop'}</span>
              {artist.location && artist.location !== 'Dhaka, Bangladesh' && artist.location !== 'Dhaka' ? (
                <span> &middot; {artist.location}</span>
              ) : null}
            </p>

            {/* Upcoming Single Teaser Pill (Triggered automatically when future release is scheduled) */}
            {upcomingRelease && (
              <motion.button
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => {
                  const el = document.getElementById('upcoming-release-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('/music');
                }}
                className="mb-8 inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md hover:scale-105 hover:border-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/10 group"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-current animate-pulse group-hover:scale-110 transition-transform" />
                <span>Next Single &ldquo;{upcomingRelease.title}&rdquo; Premiering Soon &middot; View Countdown &darr;</span>
              </motion.button>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto mb-8">
              <button
                id="hero-listen-now-btn"
                onClick={() => {
                  const el = document.getElementById('latest-release-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('/music');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Disc3 className="w-4 h-4 animate-[spin_6s_linear_infinite]" />
                <span>LISTEN NOW</span>
              </button>

              <button
                id="hero-watch-videos-btn"
                onClick={() => onNavigate('/videos')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs tracking-[0.25em] uppercase backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>WATCH VIDEOS</span>
              </button>
            </div>

            {/* Direct Artist Follow & Subscribe CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <a
                href={socials?.spotify || 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link'}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-spotify-follow-pill"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1DB954]/10 hover:bg-[#1DB954] border border-[#1DB954]/30 hover:border-[#1DB954] text-neutral-200 hover:text-black text-xs font-bold tracking-wider uppercase transition-all duration-300 group cursor-pointer shadow-lg shadow-[#1DB954]/10 hover:scale-105"
              >
                <SpotifyLogo className="w-4 h-4 text-[#1DB954] group-hover:text-black transition-colors" />
                <span>Follow on Spotify</span>
              </a>

              <a
                href={
                  socials?.youtube
                    ? socials.youtube.includes('sub_confirmation')
                      ? socials.youtube
                      : `${socials.youtube}${socials.youtube.includes('?') ? '&' : '?'}sub_confirmation=1`
                    : 'https://youtube.com/@tanbyrmusic?sub_confirmation=1'
                }
                target="_blank"
                rel="noopener noreferrer"
                id="hero-youtube-subscribe-pill"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000] border border-[#FF0000]/30 hover:border-[#FF0000] text-neutral-200 hover:text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 group cursor-pointer shadow-lg shadow-[#FF0000]/10 hover:scale-105"
              >
                <YouTubeLogo className="w-4 h-4 text-[#FF0000] group-hover:text-white transition-colors" />
                <span>Subscribe on YouTube</span>
              </a>
            </div>

            {/* Hero Social / Streaming Icons */}
            {socials && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium mb-3">
                  Stream &amp; Connect
                </span>
                <SocialIcons socials={socials} variant="hero" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent"
          />
        </div>
      </section>

      {/* 2. UPCOMING RELEASE COUNTDOWN SPOTLIGHT (Triggered automatically when a release date is in the future) */}
      {upcomingRelease && (
        <section
          id="upcoming-release-section"
          className="relative py-20 sm:py-28 px-6 sm:px-8 border-t border-amber-500/20 bg-gradient-to-b from-[#110f18] via-[#09080e] to-[#08080c] overflow-hidden"
        >
          {/* Subtle cinematic radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Eyebrow with cinematic reveal */}
            <motion.div
              variants={sectionHeaderVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center justify-between mb-10 sm:mb-12"
            >
              <div>
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 mb-1 flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>Upcoming Single &middot; Hype Countdown</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  Premiere Spotlight
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/music')}
                className="hidden sm:inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span>View All Releases</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Countdown Component in Full Spotlight mode with cinematic scale-in */}
            <motion.div
              variants={showcaseCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <CountdownTimer
                release={upcomingRelease}
                variant="spotlight"
                onNavigate={onNavigate}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. LATEST RELEASE SECTION WITH CINEMATIC FRAMER MOTION ENTRANCE */}
      {displayedLatestRelease && (!upcomingRelease || displayedLatestRelease.id !== upcomingRelease.id || !isReleaseInFuture(displayedLatestRelease)) && (
        <section
          id="latest-release-section"
          className="relative py-24 sm:py-28 px-6 sm:px-8 border-t border-white/5 bg-[#09090d] overflow-hidden"
        >
          {/* Ambient cinematic backdrop lights */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Eyebrow */}
            <motion.div
              variants={sectionHeaderVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 block mb-1">
                  {isReleaseInFuture(displayedLatestRelease) ? 'Upcoming Release' : 'Latest Release'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  Featured Music
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/music')}
                className="hidden sm:inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Featured Release Showcase Container */}
            <motion.div
              variants={showcaseCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="relative bg-[#0e0e13] border border-white/10 rounded-3xl overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/80 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center group/card hover:border-white/20 transition-colors duration-500"
            >
              {/* Artwork with cinematic slide & scale */}
              <motion.div
                initial={{ opacity: 0, x: -35, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 relative"
              >
                <a
                  href={displayedLatestRelease.smartUrl || `/#/release/${displayedLatestRelease.slug || displayedLatestRelease.id}`}
                  target={displayedLatestRelease.smartUrl ? '_blank' : undefined}
                  rel={displayedLatestRelease.smartUrl ? 'noopener noreferrer' : undefined}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-black shadow-2xl group block cursor-pointer"
                  title={displayedLatestRelease.smartUrl ? 'Stream on Feature.fm (ffem.bio)' : 'View Release Details'}
                >
                  <SmartImage
                    key={displayedLatestRelease.coverImage || displayedLatestRelease.id}
                    src={displayedLatestRelease.coverImage}
                    alt={`${displayedLatestRelease.title} Cover`}
                    fallbackType="artwork"
                    fallbackText={displayedLatestRelease.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                      {displayedLatestRelease.type} &middot; {latestReleaseYear}
                    </span>
                  </div>
                  {displayedLatestRelease.smartUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-xl">
                        <span>Stream ffem.bio</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </a>
              </motion.div>

              {/* Details & Action with Staggered Elements */}
              <motion.div
                variants={detailsStaggerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="lg:col-span-7 flex flex-col justify-center space-y-6"
              >
                <motion.div variants={detailItemVariants}>
                  <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase block mb-2">
                    Official {displayedLatestRelease.type} &middot; {latestReleaseYear}
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
                    {displayedLatestRelease.title}
                  </h3>
                </motion.div>

                {displayedLatestRelease.description && (
                  <motion.p
                    variants={detailItemVariants}
                    className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed"
                  >
                    {displayedLatestRelease.description}
                  </motion.p>
                )}

                {displayedLatestRelease.credits && (
                  <motion.p
                    variants={detailItemVariants}
                    className="text-xs text-neutral-400 font-normal leading-normal border-l-2 border-white/20 pl-4 py-1"
                  >
                    {displayedLatestRelease.credits}
                  </motion.p>
                )}

                {/* If this release is in the future, show inline countdown timer */}
                {isReleaseInFuture(displayedLatestRelease) ? (
                  <motion.div variants={detailItemVariants} className="pt-2">
                    <CountdownTimer
                      release={displayedLatestRelease}
                      variant="inline"
                      onNavigate={onNavigate}
                    />
                  </motion.div>
                ) : (
                  /* Streaming Links Buttons for released music with staggered motion */
                  <motion.div variants={detailItemVariants} className="pt-2">
                    <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                      Stream &middot; Listen &middot; Download
                    </span>
                    <div className="flex flex-wrap gap-3 items-center">
                      {/* Primary Feature.fm / ffem.bio Smart Link Button */}
                      {displayedLatestRelease.smartUrl && (
                        <motion.a
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          href={displayedLatestRelease.smartUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                          <span>Stream on Feature.fm (ffem.bio)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </motion.a>
                      )}

                      {/* Dynamic Platforms (if populated) */}
                      {displayedLatestRelease.streamingPlatforms && displayedLatestRelease.streamingPlatforms.length > 0 ? (
                        displayedLatestRelease.streamingPlatforms
                          .filter((p) => Boolean(p.url && p.url.trim() !== '' && p.url !== '#'))
                          .map((p) => (
                            <motion.a
                              key={p.id || p.platform}
                              whileHover={{ scale: 1.04, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                            >
                              <BrandIcon platform={p.platform} className="w-4 h-4" />
                              <span>{p.label || getBrandMeta(p.platform).name}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </motion.a>
                          ))
                      ) : (
                        <>
                          {displayedLatestRelease.spotifyUrl && (
                            <motion.a
                              whileHover={{ scale: 1.04, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              href={displayedLatestRelease.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                            >
                              <BrandIcon platform="spotify" className="w-4 h-4" />
                              <span>Spotify</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.a>
                          )}
                          {displayedLatestRelease.appleMusicUrl && (
                            <motion.a
                              whileHover={{ scale: 1.04, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              href={displayedLatestRelease.appleMusicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-black border border-pink-500/30 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                            >
                              <BrandIcon platform="appleMusic" className="w-4 h-4" />
                              <span>Apple Music</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.a>
                          )}
                          {displayedLatestRelease.youtubeUrl && (
                            <motion.a
                              whileHover={{ scale: 1.04, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              href={displayedLatestRelease.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                            >
                              <BrandIcon platform="youtube" className="w-4 h-4" />
                              <span>YouTube</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.a>
                          )}
                          {displayedLatestRelease.youtubeMusicUrl && (
                            <motion.a
                              whileHover={{ scale: 1.04, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              href={displayedLatestRelease.youtubeMusicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                            >
                              <BrandIcon platform="youtubeMusic" className="w-4 h-4" />
                              <span>YouTube Music</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.a>
                          )}
                          {displayedLatestRelease.otherUrl && (
                            <motion.a
                              whileHover={{ scale: 1.04, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              href={displayedLatestRelease.otherUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                            >
                              <span>More Platforms</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.a>
                          )}
                        </>
                      )}

                      {/* Dedicated Smart Link Bio Landing Page */}
                      <motion.a
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={`/#/release/${displayedLatestRelease.slug || displayedLatestRelease.id}`}
                        className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                        title="Open Dedicated Smart Landing Page"
                      >
                        <Share2 className="w-3.5 h-3.5 text-pink-400" />
                        <span>Smart Link Page</span>
                      </motion.a>
                    </div>
                  </motion.div>
                )}

                {/* Lyrics CTA */}
                {displayedLatestRelease.lyricsText && (
                  <motion.div variants={detailItemVariants} className="pt-2 flex items-center space-x-4">
                    <button
                      onClick={() => onOpenLyrics(displayedLatestRelease)}
                      className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-300 hover:text-white underline underline-offset-8 transition-colors cursor-pointer"
                    >
                      Read Lyrics &amp; Details &rarr;
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. DEDICATED SPOTIFY FOLLOW & YOUTUBE SUBSCRIBE SECTION */}
      <FollowSubscribeSection socials={socials} artistName={artist.name} />

      {/* 4. FEATURED MUSIC VIDEOS PREVIEW WITH CINEMATIC MOTION */}
      {featuredVideos.length > 0 && (
        <section id="featured-videos-section" className="py-24 px-6 sm:px-8 border-t border-white/5 relative overflow-hidden">
          {/* Subtle cinematic visual ambient flare */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              variants={sectionHeaderVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-1">
                  Visuals
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  Music Videos
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/videos')}
                className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span>View All Videos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              variants={staggeredGridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {featuredVideos.slice(0, 2).map((video) => (
                <motion.div
                  key={video.id}
                  variants={cinematicCardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="rounded-2xl"
                >
                  <VideoCard video={video} onPlay={onPlayVideo} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 4. AESTHETIC VISUAL GALLERY PREVIEW WITH CINEMATIC MOTION */}
      {featuredPhotos.length > 0 && (
        <section id="featured-photos-section" className="py-24 px-6 sm:px-8 border-t border-white/5 bg-[#060608] relative overflow-hidden">
          {/* Subtle cinematic background glow */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neutral-800/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              variants={sectionHeaderVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-1">
                  Atmosphere
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  Photography
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/photos')}
                className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span>Full Gallery</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              variants={staggeredGridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredPhotos.slice(0, 3).map((photo) => (
                <motion.div
                  key={photo.id}
                  variants={cinematicCardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.35, ease: 'easeOut' } }}
                  onClick={() => onNavigate('/photos')}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer shadow-lg"
                >
                  <SmartImage
                    key={photo.imageUrl || photo.id}
                    src={photo.imageUrl}
                    alt={photo.caption || 'TANBYR Photography'}
                    fallbackType="photo"
                    fallbackText={photo.caption || photo.category}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20 pointer-events-none">
                    <span className="text-[10px] tracking-widest text-amber-400/90 uppercase font-bold">
                      {photo.category}
                    </span>
                    <p className="text-sm text-white font-medium line-clamp-1 mt-1 drop-shadow-md">
                      {photo.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 5. ABOUT TEASER SECTION WITH CINEMATIC MOTION */}
      <section id="about-teaser-section" className="py-24 px-6 sm:px-8 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10"
        >
          <span className="text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase mb-4">
            Biography
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase mb-8">
            About TANBYR
          </h2>
          <p className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl mb-10">
            {artist.bio ? artist.bio.split('\n\n')[0] : 'Independent artist, singer and songwriter.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('/about')}
            className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer shadow-lg"
          >
            <span>Read Full Biography &amp; Credits</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
