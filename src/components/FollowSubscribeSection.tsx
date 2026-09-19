import React from 'react';
import { Bell, ExternalLink, Sparkles, Music2, Radio } from 'lucide-react';
import { SpotifyLogo, YouTubeLogo } from './BrandLogos';
import { SocialLinks } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface FollowSubscribeSectionProps {
  socials?: SocialLinks;
  artistName?: string;
}

export const FollowSubscribeSection: React.FC<FollowSubscribeSectionProps> = ({
  socials,
  artistName = 'TANBYR',
}) => {
  const spotifyUrl =
    socials?.spotify ||
    'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=IuMN51JxTLyukUnWQ7jvDw';

  // Include YouTube sub_confirmation parameter for instant one-click subscription prompt
  const youtubeUrl =
    (socials?.youtube
      ? socials.youtube.includes('sub_confirmation')
        ? socials.youtube
        : `${socials.youtube}${socials.youtube.includes('?') ? '&' : '?'}sub_confirmation=1`
      : 'https://www.youtube.com/@tanbyr?sub_confirmation=1');

  return (
    <section
      id="community-follow-subscribe"
      className="relative py-20 px-6 sm:px-8 border-t border-white/5 bg-gradient-to-b from-[#09090d] via-[#0b0b10] to-[#070709] overflow-hidden"
    >
      {/* Subtle ambient lighting backdrops */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#1DB954]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-[#FF0000]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase bg-white/5 border border-white/10 text-neutral-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Official Artist Channels</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase mb-4">
              Follow &amp; Subscribe
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
              Stay connected with {artistName}. Get upcoming releases automatically delivered to your Spotify Release Radar and watch brand-new official music videos on YouTube.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* 1. SPOTIFY FOLLOW CARD */}
          <ScrollReveal direction="up" distance={30} delay={0.1}>
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-[#0e110e]/90 border border-[#1DB954]/25 hover:border-[#1DB954]/60 transition-all duration-300 shadow-xl flex flex-col justify-between h-full">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1DB954]/10 rounded-full blur-2xl group-hover:bg-[#1DB954]/20 transition-all pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <SpotifyLogo className="w-8 h-8" color="#1DB954" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954]">
                    Verified Artist
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <span>Spotify</span>
                  <span className="text-sm text-[#1DB954] font-semibold tracking-normal normal-case">&middot; Follow Artist</span>
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-light">
                  Follow {artistName} on Spotify to never miss fresh singles, studio recordings, and personalized algorithm recommendations.
                </p>

                <div className="flex items-center space-x-4 text-xs text-neutral-400 mb-8 border-y border-white/5 py-3">
                  <div className="flex items-center space-x-1.5">
                    <Music2 className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>Latest: &ldquo;Tomar Hasi&rdquo;</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>Release Radar Sync</span>
                  </div>
                </div>
              </div>

              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="spotify-follow-cta-btn"
                className="w-full py-4 px-6 rounded-2xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-lg shadow-[#1DB954]/25 hover:shadow-[#1DB954]/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <SpotifyLogo className="w-4 h-4" />
                <span>FOLLOW ON SPOTIFY</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>
            </div>
          </ScrollReveal>

          {/* 2. YOUTUBE SUBSCRIBE CARD */}
          <ScrollReveal direction="up" distance={30} delay={0.2}>
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-[#120e0e]/90 border border-[#FF0000]/25 hover:border-[#FF0000]/60 transition-all duration-300 shadow-xl flex flex-col justify-between h-full">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF0000]/10 rounded-full blur-2xl group-hover:bg-[#FF0000]/20 transition-all pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF0000]/15 border border-[#FF0000]/30 flex items-center justify-center text-[#FF0000] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <YouTubeLogo className="w-8 h-8" color="#FF0000" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] flex items-center space-x-1">
                    <Bell className="w-3 h-3" />
                    <span>Official Channel</span>
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <span>YouTube</span>
                  <span className="text-sm text-[#FF0000] font-semibold tracking-normal normal-case">&middot; @tanbyr</span>
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-light">
                  Subscribe to the official YouTube channel for official 4K music video premieres, lyric videos, behind-the-scenes, and acoustic performances.
                </p>

                <div className="flex items-center space-x-4 text-xs text-neutral-400 mb-8 border-y border-white/5 py-3">
                  <div className="flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#FF0000]" />
                    <span>All Notifications Enabled</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center space-x-1.5">
                    <span>4K Music Videos</span>
                  </div>
                </div>
              </div>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="youtube-subscribe-cta-btn"
                className="w-full py-4 px-6 rounded-2xl bg-[#FF0000] hover:bg-[#cc0000] text-white font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-lg shadow-[#FF0000]/25 hover:shadow-[#FF0000]/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <YouTubeLogo className="w-4 h-4" />
                <span>SUBSCRIBE ON YOUTUBE</span>
                <Bell className="w-3.5 h-3.5 opacity-90" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
