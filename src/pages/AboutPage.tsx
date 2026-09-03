import React from 'react';
import { ArtistProfile, SocialLinks } from '../types';
import { MapPin, Globe, Music, Calendar, Sparkles, Radio } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { SocialIcons } from '../components/SocialIcons';

interface AboutPageProps {
  artist: ArtistProfile;
  socials?: SocialLinks | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ artist, socials }) => {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Page Header with Scroll Reveal */}
      <ScrollReveal direction="up" distance={25}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase block mb-3">
            Profile
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase mb-4">
            About {artist.name || 'TANBYR'}
          </h1>
          <p className="text-sm sm:text-base font-semibold tracking-[0.25em] text-neutral-400 uppercase">
            {artist.tagline || 'Artist / Singer-Songwriter'}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Main Artist Photograph & Metadata Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <ScrollReveal direction="left" distance={30} delay={0.1}>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group">
              <img
                src={artist.profileImageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'}
                alt={`${artist.name} Portrait`}
                className="w-full h-full object-cover object-top filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xl font-bold tracking-[0.2em] text-white uppercase block">
                  {artist.name}
                </span>
                <span className="text-xs tracking-wider text-neutral-400 uppercase block mt-0.5">
                  Official Portrait &middot; {artist.location || 'Dhaka'}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Artist Metadata Card */}
          <ScrollReveal direction="up" distance={30} delay={0.2}>
            <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase pb-2 border-b border-white/5">
                Artist Metadata
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center space-x-2">
                    <Music className="w-3.5 h-3.5" />
                    <span>Genre</span>
                  </span>
                  <span className="text-white font-medium text-right">{artist.genre || 'Bengali Indie / Pop'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Country</span>
                  </span>
                  <span className="text-white font-medium">{artist.country || 'Bangladesh'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location</span>
                  </span>
                  <span className="text-white font-medium">{artist.location || 'Dhaka, Bangladesh'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Active Since</span>
                  </span>
                  <span className="text-white font-medium">{artist.activeSince || '2024'}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Detailed Biography Text & Artistic Vision */}
        <div className="lg:col-span-7 space-y-10">
          <ScrollReveal direction="right" distance={30} delay={0.15}>
            <div className="bg-[#0c0c10] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Artistic Journey</span>
              </h2>

              <div className="space-y-6 text-neutral-300 font-light text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {artist.bio}
              </div>
            </div>
          </ScrollReveal>

          {/* Sonic Identity Box */}
          <ScrollReveal direction="up" distance={25} delay={0.25}>
            <div className="p-8 border border-white/10 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent">
              <h3 className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase mb-3">
                Sonic Identity
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed italic">
                &ldquo;Music begins where spoken words fail. Every melody written is an honest reflection of love, longing, and the nocturnal rhythms of Dhaka.&rdquo;
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-bold mt-4">
                &mdash; TANBYR
              </p>
            </div>
          </ScrollReveal>

          {/* Official Streaming & Social Channels Card */}
          {socials && (
            <ScrollReveal direction="up" distance={25} delay={0.3}>
              <div className="bg-[#0c0c10] border border-white/10 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center space-x-2 mb-6">
                  <Radio className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
                    Official Streaming &amp; Social Channels
                  </h3>
                </div>
                <SocialIcons socials={socials} variant="card" />
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
};
