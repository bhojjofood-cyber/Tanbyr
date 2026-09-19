import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Share2,
  Copy,
  Check,
  Music,
  ArrowLeft,
  FileText,
  Play,
  Disc3,
  Sparkles,
} from 'lucide-react';
import { ArtistProfile, MusicRelease, StreamingPlatformLink } from '../types';
import { getBrandMeta } from '../components/BrandLogos';
import { SmartImage } from '../components/SmartImage';

interface ReleaseSmartLinkPageProps {
  release: MusicRelease;
  artist: ArtistProfile;
  onNavigate: (path: string) => void;
  onOpenLyrics?: (release: MusicRelease) => void;
}

export const ReleaseSmartLinkPage: React.FC<ReleaseSmartLinkPageProps> = ({
  release,
  artist,
  onNavigate,
  onOpenLyrics,
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLyricsInline, setShowLyricsInline] = useState(false);

  // Resolve active streaming platforms
  const getActivePlatforms = (): StreamingPlatformLink[] => {
    // 1. If dynamic platforms were saved via (+) Plus icon, prioritize them!
    if (Array.isArray(release.streamingPlatforms) && release.streamingPlatforms.length > 0) {
      return release.streamingPlatforms.filter(
        (p) => Boolean(p.url && p.url.trim() !== '' && p.url !== '#')
      );
    }

    // 2. Fallback to legacy fields so older releases also work seamlessly
    const fallbackList: StreamingPlatformLink[] = [];
    if (release.spotifyUrl && release.spotifyUrl !== '#') {
      fallbackList.push({
        id: 'sp',
        platform: 'spotify',
        label: 'Spotify',
        url: release.spotifyUrl,
        actionText: 'Listen',
      });
    }
    if (release.appleMusicUrl && release.appleMusicUrl !== '#') {
      fallbackList.push({
        id: 'am',
        platform: 'appleMusic',
        label: 'Apple Music',
        url: release.appleMusicUrl,
        actionText: 'Listen',
      });
    }
    if (release.youtubeMusicUrl && release.youtubeMusicUrl !== '#') {
      fallbackList.push({
        id: 'ym',
        platform: 'youtubeMusic',
        label: 'YouTube Music',
        url: release.youtubeMusicUrl,
        actionText: 'Listen',
      });
    }
    if (release.youtubeUrl && release.youtubeUrl !== '#') {
      fallbackList.push({
        id: 'yt',
        platform: 'youtube',
        label: 'YouTube',
        url: release.youtubeUrl,
        actionText: 'Watch',
      });
    }
    if (release.otherUrl && release.otherUrl !== '#') {
      fallbackList.push({
        id: 'other',
        platform: 'bandcamp',
        label: 'Bandcamp / Stores',
        url: release.otherUrl,
        actionText: 'Buy',
      });
    }
    return fallbackList;
  };

  const platforms = getActivePlatforms();

  // Full shareable URL (works with hash router or standard path)
  const getShareUrl = () => {
    const origin = window.location.origin;
    return `${origin}/#/release/${release.slug || release.id}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${release.title} by ${artist.name}`,
          text: `Listen to "${release.title}" by ${artist.name} on your favorite music streaming platform:`,
          url: shareUrl,
        });
      } catch {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const releaseYear = release.releaseDate
    ? new Date(release.releaseDate).getFullYear() || release.releaseDate
    : '2026';

  return (
    <div className="relative min-h-screen bg-[#070709] text-white flex flex-col items-center justify-between px-4 py-8 sm:py-12 overflow-x-hidden selection:bg-white selection:text-black">
      {/* 1. Atmospheric Ambient Background from Artwork */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {release.coverImage && (
          <div
            className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-cover bg-center filter blur-[90px] opacity-25 brightness-50 scale-110"
            style={{ backgroundImage: `url(${release.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/80 via-[#070709]/95 to-[#070709]" />
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      {/* 2. Top Navigation Bar for Smart Link */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Official Site</span>
        </button>

        <button
          onClick={handleNativeShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </header>

      {/* 3. Main Center Smart Link Card */}
      <main className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Artist Profile Header Pill */}
        <div className="flex items-center space-x-2.5 mb-6 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          {artist.profileImageUrl ? (
            <img
              src={artist.profileImageUrl}
              alt={artist.name}
              className="w-6 h-6 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
              {artist.name.charAt(0)}
            </div>
          )}
          <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
            {artist.name}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Artwork Showcase with subtle vinyl edge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-900 mb-6 group"
        >
          <SmartImage
            src={release.coverImage}
            alt={release.title}
            priority={true}
            fallbackType="artwork"
            fallbackText={release.title}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>

        {/* Release Title & Metadata */}
        <div className="text-center px-4 mb-6">
          <div className="inline-flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
              {release.type} &middot; {releaseYear}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase mb-1 drop-shadow-md">
            {release.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xs mx-auto">
            Choose your preferred music platform to stream or listen
          </p>
        </div>

        {/* 4. Streaming Platform Buttons List (The Core "Listen On" Experience) */}
        <div className="w-full space-y-2.5 mb-8">
          {/* Top Hero Banner if Feature.fm / Smart Link is available */}
          {release.smartUrl && (
            <motion.a
              href={release.smartUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              className="w-full mb-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-xl shadow-pink-500/20 border border-white/20 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm font-extrabold uppercase tracking-wider text-white truncate">
                    Stream on Feature.fm (ffem.bio)
                  </span>
                  <span className="block text-xs text-white/80 font-light truncate">
                    Direct access to Spotify, Apple, YouTube & more
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-black tracking-wider uppercase shrink-0 group-hover:bg-neutral-100 transition-colors shadow-md">
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </motion.a>
          )}

          {platforms.length > 0 ? (
            platforms.map((item, index) => {
              const meta = getBrandMeta(item.platform || item.label);
              const Icon = meta.icon;
              const actionLabel = item.actionText || meta.actionText || 'Listen';

              return (
                <motion.a
                  key={item.id || `${item.platform}-${index}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.06, duration: 0.4 }}
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 backdrop-blur-md transition-all duration-200 group cursor-pointer"
                >
                  {/* Left: Platform Logo + Brand Name */}
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `${meta.defaultColor}15`,
                        borderColor: `${meta.defaultColor}30`,
                        color: meta.defaultColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <span className="block text-sm font-bold text-white tracking-wide truncate group-hover:text-white">
                        {item.label || meta.name}
                      </span>
                      <span className="block text-[11px] text-neutral-400 font-light truncate">
                        {meta.category === 'music' || meta.category === 'both'
                          ? 'Available for streaming'
                          : 'Official Channel'}
                      </span>
                    </div>
                  </div>

                  {/* Right: High-contrast Action Button */}
                  <div className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold tracking-wider uppercase group-hover:bg-neutral-200 transition-colors shrink-0">
                    <span>{actionLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </motion.a>
              );
            })
          ) : release.smartUrl ? null : (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400">
              No streaming links have been added yet for this release.
            </div>
          )}
        </div>

        {/* 5. Lyrics Option (if available) */}
        {release.lyricsText && (
          <div className="w-full mb-6">
            <button
              onClick={() => {
                if (onOpenLyrics) {
                  onOpenLyrics(release);
                } else {
                  setShowLyricsInline(!showLyricsInline);
                }
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs font-semibold tracking-wider uppercase text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Read Lyrics (লিরিক্স পড়ুন)</span>
            </button>

            {showLyricsInline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-5 rounded-2xl bg-[#0c0c11] border border-white/10 text-xs text-neutral-300 whitespace-pre-line leading-relaxed font-serif"
              >
                {release.lyricsText}
              </motion.div>
            )}
          </div>
        )}

        {/* 6. Instagram Bio Share Banner */}
        <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-white/10 backdrop-blur-md flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-white tracking-wide truncate">
                Share this in your Instagram Bio
              </span>
              <span className="block text-[11px] text-neutral-400 truncate">
                One link to stream on all platforms
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* 7. Footer: Official Website Return Link */}
      <footer className="relative z-10 w-full max-w-md mx-auto pt-6 border-t border-white/10 text-center flex flex-col items-center space-y-2">
        <button
          onClick={() => onNavigate('/')}
          className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          &copy; {new Date().getFullYear()} {artist.name} &middot; Official Artist Website
        </button>
        <p className="text-[10px] text-neutral-500 font-light">
          Powered by TANBYR Official SmartLink Engine
        </p>
      </footer>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0e0e14] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Share Smart Link
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Copy this link to put in your Instagram bio, TikTok bio, or send in messages:
              </p>

              <div className="flex items-center space-x-2 p-2 rounded-xl bg-black border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="w-full bg-transparent text-xs text-neutral-300 px-2 focus:outline-none font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs shrink-0 cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Listen to ${release.title} by ${artist.name}: ${getShareUrl()}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Listen to "${release.title}" by @${artist.name}:`
                  )}&url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold text-center transition-colors"
                >
                  X (Twitter)
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
