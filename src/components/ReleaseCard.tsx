import React from 'react';
import { FileText, ExternalLink, Share2, Disc, Sparkles } from 'lucide-react';
import { MusicRelease } from '../types';
import { SmartImage } from './SmartImage';
import { BrandIcon, getBrandMeta } from './BrandLogos';

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

  // Prefer dynamic streamingPlatforms array; fall back to legacy links
  const dynamicLinks =
    release.streamingPlatforms && release.streamingPlatforms.length > 0
      ? release.streamingPlatforms
          .filter((p) => Boolean(p.url && p.url.trim() !== '' && p.url !== '#'))
          .map((p) => {
            const meta = getBrandMeta(p.platform);
            return {
              platform: p.platform,
              name: p.label || meta.name,
              url: p.url,
              color: 'hover:border-white/40 hover:text-white',
            };
          })
      : [
          { platform: 'spotify', name: 'Spotify', url: release.spotifyUrl, color: 'hover:border-emerald-500/50 hover:text-emerald-400' },
          { platform: 'appleMusic', name: 'Apple Music', url: release.appleMusicUrl, color: 'hover:border-pink-500/50 hover:text-pink-400' },
          { platform: 'youtube', name: 'YouTube', url: release.youtubeUrl, color: 'hover:border-red-500/50 hover:text-red-400' },
          { platform: 'youtubeMusic', name: 'YouTube Music', url: release.youtubeMusicUrl, color: 'hover:border-red-400/50 hover:text-red-300' },
          { platform: 'bandcamp', name: 'Stores', url: release.otherUrl, color: 'hover:border-white/50 hover:text-white' },
        ].filter((link) => Boolean(link.url && link.url.trim() !== '' && link.url !== '#'));

  const releaseSmartLinkUrl = `/#/release/${release.slug || release.id}`;

  return (
    <div
      id={`release-card-${release.id}`}
      className="group bg-[#0d0d11] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-500 flex flex-col justify-between"
    >
      <div>
        {/* Cover Artwork with hover zoom and smart link routing */}
        <a
          href={release.smartUrl || releaseSmartLinkUrl}
          target={release.smartUrl ? '_blank' : undefined}
          rel={release.smartUrl ? 'noopener noreferrer' : undefined}
          className="relative aspect-square w-full overflow-hidden bg-neutral-900 block group/art cursor-pointer"
          title={release.smartUrl ? 'Stream on Feature.fm (ffem.bio)' : release.title}
        >
          <SmartImage
            key={release.coverImage || release.id}
            src={release.coverImage}
            alt={`${release.title} Cover Artwork`}
            fallbackType="artwork"
            fallbackText={release.title}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-black/70 backdrop-blur-md text-white border border-white/10">
              {release.type}
            </span>
            {release.featured && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white text-black">
                Featured
              </span>
            )}
            {release.smartUrl && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase bg-pink-500/80 backdrop-blur-md text-white shadow-sm">
                ffem.bio
              </span>
            )}
          </div>

          {release.smartUrl && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/art:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-black text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-xl">
                <span>Stream ffem.bio</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          )}
        </a>

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

          {/* Streaming Platform Pill Buttons with Authentic Brand Logos */}
          <div className="flex flex-wrap gap-2 pt-2">
            {/* Primary Feature.fm / ffem.bio Direct Button */}
            {release.smartUrl && (
              <a
                href={release.smartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-pink-500/40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500 hover:to-purple-600 text-pink-300 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                title="Direct link to Feature.fm (ffem.bio)"
              >
                <Sparkles className="w-3 h-3 text-pink-300" />
                <span>Stream (ffem.bio)</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}

            {dynamicLinks.map((link) => (
              <a
                key={link.platform + link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border border-white/10 bg-white/[0.03] text-neutral-300 transition-all duration-300 ${link.color}`}
              >
                <BrandIcon platform={link.platform} className="w-3.5 h-3.5" />
                <span>{link.name}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            ))}

            {/* Smart Landing Page button */}
            <a
              href={releaseSmartLinkUrl}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Open Smart Link Landing Page"
            >
              <Share2 className="w-3 h-3 text-pink-400" />
              <span>Smart Link</span>
            </a>
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
