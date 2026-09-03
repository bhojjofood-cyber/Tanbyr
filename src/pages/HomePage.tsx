import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, Disc3, ExternalLink } from 'lucide-react';
import { ArtistProfile, MusicRelease, MusicVideo, PhotoItem, SocialLinks } from '../types';
import { VideoCard } from '../components/VideoCard';
import { SocialIcons } from '../components/SocialIcons';
import { ScrollReveal } from '../components/ScrollReveal';

interface HomePageProps {
  artist: ArtistProfile;
  latestRelease: MusicRelease | null;
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
  featuredVideos,
  featuredPhotos,
  socials,
  onNavigate,
  onPlayVideo,
  onOpenLyrics,
}) => {
  const latestReleaseYear = latestRelease?.releaseDate
    ? new Date(latestRelease.releaseDate).getFullYear() || latestRelease.releaseDate
    : '2026';

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
      >
        {/* Cinematic Artist Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15, opacity: 0.8 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            src={artist.heroImageUrl || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1920&q=85'}
            alt={`${artist.name} Hero`}
            className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.1]"
            loading="eager"
          />
          {/* Subtle multi-layer cinematic vignette & dark gradations */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#070709]/40 to-[#070709]" />
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
            <p className="max-w-xl text-sm sm:text-base text-neutral-300 font-light tracking-wide leading-relaxed mb-8 text-center">
              <span>{artist.genre || '#Banglapop'}</span>
              {artist.location && artist.location !== 'Dhaka, Bangladesh' && artist.location !== 'Dhaka' ? (
                <span> &middot; {artist.location}</span>
              ) : null}
            </p>

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

      {/* 2. LATEST RELEASE SECTION WITH SCROLL REVEAL */}
      {latestRelease && (
        <section
          id="latest-release-section"
          className="relative py-28 px-6 sm:px-8 border-t border-white/5 bg-[#09090d]"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Eyebrow */}
            <ScrollReveal direction="up" distance={25}>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-1">
                    Featured Music
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                    Latest Release
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('/music')}
                  className="hidden sm:inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>

            {/* Featured Release Showcase Container */}
            <ScrollReveal direction="up" distance={35} delay={0.1}>
              <div className="bg-[#0e0e13] border border-white/10 rounded-3xl overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                {/* Artwork */}
                <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-black shadow-2xl group">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={latestRelease.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1000&q=80'}
                    alt={`${latestRelease.title} Cover`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                      {latestRelease.type} &middot; {latestReleaseYear}
                    </span>
                  </div>
                </div>

                {/* Details & Action */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                  <div>
                    <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase block mb-2">
                      Official Release &middot; {latestRelease.type}
                    </span>
                    <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
                      {latestRelease.title}
                    </h3>
                  </div>

                  {latestRelease.description && (
                    <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
                      {latestRelease.description}
                    </p>
                  )}

                  {latestRelease.credits && (
                    <p className="text-xs text-neutral-400 font-normal leading-normal border-l-2 border-white/20 pl-4 py-1">
                      {latestRelease.credits}
                    </p>
                  )}

                  {/* Streaming Links Buttons */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                      Stream / Download
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {latestRelease.spotifyUrl && (
                        <a
                          href={latestRelease.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                        >
                          <span>Spotify</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {latestRelease.appleMusicUrl && (
                        <a
                          href={latestRelease.appleMusicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-black border border-pink-500/30 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                        >
                          <span>Apple Music</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {latestRelease.youtubeUrl && (
                        <a
                          href={latestRelease.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                        >
                          <span>YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {latestRelease.youtubeMusicUrl && (
                        <a
                          href={latestRelease.youtubeMusicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                        >
                          <span>YouTube Music</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {latestRelease.otherUrl && (
                        <a
                          href={latestRelease.otherUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                        >
                          <span>More Platforms</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Lyrics CTA */}
                  <div className="pt-2 flex items-center space-x-4">
                    <button
                      onClick={() => onOpenLyrics(latestRelease)}
                      className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-300 hover:text-white underline underline-offset-8 transition-colors cursor-pointer"
                    >
                      Read Lyrics &amp; Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 3. FEATURED MUSIC VIDEOS PREVIEW WITH SCROLL REVEAL */}
      {featuredVideos.length > 0 && (
        <section id="featured-videos-section" className="py-24 px-6 sm:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" distance={25}>
              <div className="flex items-end justify-between mb-12">
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
                  className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <span>View All Videos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredVideos.slice(0, 2).map((video, idx) => (
                <ScrollReveal key={video.id} direction="up" distance={30} delay={idx * 0.15}>
                  <VideoCard video={video} onPlay={onPlayVideo} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. AESTHETIC VISUAL GALLERY PREVIEW WITH SCROLL REVEAL */}
      {featuredPhotos.length > 0 && (
        <section id="featured-photos-section" className="py-24 px-6 sm:px-8 border-t border-white/5 bg-[#060608]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" distance={25}>
              <div className="flex items-end justify-between mb-12">
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
                  className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Full Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPhotos.slice(0, 3).map((photo, idx) => (
                <ScrollReveal key={photo.id} direction="up" distance={30} delay={idx * 0.12}>
                  <div
                    onClick={() => onNavigate('/photos')}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer shadow-lg"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || 'TANBYR Photography'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-semibold">
                        {photo.category}
                      </span>
                      <p className="text-sm text-white font-medium line-clamp-1 mt-1">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. ABOUT TEASER SECTION WITH SCROLL REVEAL */}
      <section id="about-teaser-section" className="py-24 px-6 sm:px-8 border-t border-white/5">
        <ScrollReveal direction="up" distance={35}>
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <span className="text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase mb-4">
              Biography
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase mb-8">
              About TANBYR
            </h2>
            <p className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl mb-10">
              {artist.bio ? artist.bio.split('\n\n')[0] : 'Independent artist, singer and songwriter.'}
            </p>
            <button
              onClick={() => onNavigate('/about')}
              className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer"
            >
              <span>Read Full Biography &amp; Credits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
