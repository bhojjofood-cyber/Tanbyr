import React from 'react';
import { Play, FileText, Music2, ExternalLink } from 'lucide-react';
import { MusicRelease } from '../types';

interface ReleaseCardProps {
  release: MusicRelease;
  onOpenLyrics: (release: MusicRelease) => void;
  onPlayPreview?: (release: MusicRelease) => void;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({
  release,
  onOpenLyrics,
}) => {
  const releaseYear = release.releaseDate
    ? new Date(release.releaseDate).getFullYear() || release.releaseDate
    : '2026';

  const streamingLinks = [
    { name: 'Spotify', url: release.spotifyUrl, color: 'hover:border-emerald-500/50 hover:text-emerald-400' },
    { name: 'Apple Music', url: release.appleMusicUrl, color: 'hover:border-pink-500/50 hover:text-pink-400' },
    { name: 'YouTube', url: release.youtubeUrl, color: 'hover:border-red-500/50 hover:text-red-400' },
    { name: 'YouTube Music', url: release.youtubeMusicUrl, color: 'hover:border-red-400/50 hover:text-red-300' },
    { name: 'Stream / Download', url: release.otherUrl, color: 'hover:border-white/50 hover:text-white' },
  ].filter((link) => Boolean(link.url && link.url.trim() !== '' && link.url !== '#'));

  return (
    <div
      id={`release-card-${release.id}`}
      className="group bg-[#0d0d11] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-500 flex flex-col justify-between"
    >
      <div>
        {/* Cover Artwork with hover zoom */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
          <img
            src={release.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80'}
            alt={`${release.title} Cover Artwork`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-black/70 backdrop-blur-md text-white border border-white/10">
              {release.type}
            </span>
            {release.featured && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white text-black">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Info Body */}
        <div className="p-6 sm:p-7">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-xl font-bold tracking-wider text-white uppercase group-hover:text-neutral-200 transition-colors">
              {release.title}
            </h3>
            <span className="text-xs tracking-widest text-neutral-400 uppercase font-medium">
              {release.type} &middot; {releaseYear}
            </span>
          </div>

          {release.description && (
            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-6 font-light">
              {release.description}
            </p>
          )}

          {/* Streaming Platform Pill Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {streamingLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border border-white/10 bg-white/[0.03] text-neutral-300 transition-all duration-300 ${link.color}`}
              >
                <span>{link.name}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Card Actions */}
      <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs">
        <button
          onClick={() => onOpenLyrics(release)}
          className="inline-flex items-center space-x-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="tracking-wider uppercase text-[11px] font-medium">Lyrics & Credits</span>
        </button>

        {release.releaseDate && (
          <span className="text-[11px] text-neutral-400 tracking-wider">
            Released {release.releaseDate}
          </span>
        )}
      </div>
    </div>
  );
};
