import React, { useState, useMemo } from 'react';
import { MusicRelease, SocialLinks } from '../types';
import { ReleaseCard } from '../components/ReleaseCard';
import { Disc3, Search, ExternalLink } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { SpotifyLogo } from '../components/BrandLogos';

interface MusicPageProps {
  releases: MusicRelease[];
  onOpenLyrics: (release: MusicRelease) => void;
  socials?: SocialLinks;
}

export const MusicPage: React.FC<MusicPageProps> = ({ releases, onOpenLyrics, socials }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SINGLE' | 'EP' | 'ALBUM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = useMemo(() => {
    return releases.filter((release) => {
      const matchesFilter =
        activeFilter === 'ALL' ||
        release.type.toUpperCase() === activeFilter;

      const matchesSearch =
        release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (release.description && release.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (release.credits && release.credits.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [releases, activeFilter, searchQuery]);

  return (
    <div className="pt-32 pb-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Page Header with Scroll Reveal */}
      <ScrollReveal direction="up" distance={25}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase block mb-3">
            Discography
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase mb-6">
            Music &amp; Releases
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-6">
            Official catalog of singles, extended plays, and collaborative acoustic projects by TANBYR.
          </p>
          <div className="flex justify-center">
            <a
              href={socials?.spotify || 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-[#1DB954]/25 hover:scale-105 cursor-pointer"
            >
              <SpotifyLogo className="w-4 h-4" />
              <span>FOLLOW ON SPOTIFY</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-white/5">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'SINGLE', 'EP', 'ALBUM'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter === 'ALL' ? 'All Releases' : `${filter}s`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, lyrics, credits..."
            className="w-full bg-[#0d0d11] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Releases Grid */}
      {filteredReleases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReleases.map((release, idx) => (
            <ScrollReveal key={release.id} direction="up" distance={30} delay={(idx % 3) * 0.1}>
              <ReleaseCard
                release={release}
                onOpenLyrics={onOpenLyrics}
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-white/5 rounded-3xl bg-[#0a0a0e] p-8">
          <Disc3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
            No Releases Found
          </h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            {searchQuery
              ? `No releases matching "${searchQuery}". Clear your search query to view all songs.`
              : 'No releases have been added yet.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-xs font-semibold tracking-wider text-white underline underline-offset-4 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};
