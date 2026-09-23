import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  ExternalLink,
  Sparkles,
  Share2,
  Check,
  Radio,
  Bell,
  Disc3,
  Flame,
} from 'lucide-react';
import { MusicRelease } from '../types';
import { SmartImage } from './SmartImage';
import { SpotifyLogo, YouTubeLogo } from './BrandLogos';
import { copyToClipboard } from '../lib/clipboard';

interface CountdownTimerProps {
  release: MusicRelease;
  variant?: 'hero' | 'spotlight' | 'compact' | 'inline';
  className?: string;
  onNavigate?: (path: string) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
}

/**
 * Parses release date string safely.
 * If date is YYYY-MM-DD, attaches local midnight to avoid timezone shifts.
 */
export function getReleaseTargetTimestamp(dateStr: string): number {
  if (!dateStr) return 0;
  // If already includes time or timezone
  if (dateStr.includes('T')) {
    return new Date(dateStr).getTime();
  }
  // YYYY-MM-DD format -> midnight local time
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day, 0, 0, 0).getTime();
  }
  return new Date(dateStr).getTime();
}

/**
 * Checks if a release is in the future.
 */
export function isReleaseInFuture(release: MusicRelease): boolean {
  if (!release || !release.releaseDate) return false;
  const targetTime = getReleaseTargetTimestamp(release.releaseDate);
  return !isNaN(targetTime) && targetTime > Date.now();
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  release,
  variant = 'spotlight',
  className = '',
  onNavigate,
}) => {
  const targetTimestamp = useMemo(
    () => getReleaseTargetTimestamp(release.releaseDate),
    [release.releaseDate]
  );

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = Date.now();
    const diff = targetTimestamp - now;

    if (isNaN(diff) || diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
        isExpired: true,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs: diff,
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Immediate initial sync
    setTimeLeft(calculateTimeRemaining());

    const interval = setInterval(() => {
      const updated = calculateTimeRemaining();
      setTimeLeft(updated);
      if (updated.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  // Formatted human readable release date (e.g. "October 10, 2026")
  const formattedReleaseDate = useMemo(() => {
    try {
      const date = new Date(targetTimestamp);
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return release.releaseDate;
    }
  }, [targetTimestamp, release.releaseDate]);

  // Generate 1-click Google Calendar reminder link
  const googleCalendarUrl = useMemo(() => {
    const startDate = new Date(targetTimestamp);
    const endDate = new Date(targetTimestamp + 60 * 60 * 1000); // 1 hour duration
    const formatCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d+/g, '');
    const title = encodeURIComponent(`TANBYR — "${release.title}" Release Premiere`);
    const details = encodeURIComponent(
      `New ${release.type} "${release.title}" by TANBYR is dropping today!\nStream and listen here: ${
        release.smartUrl || `https://tanbyr.com/#/release/${release.slug || release.id}`
      }`
    );
    const location = encodeURIComponent('Spotify, Apple Music & All Streaming Platforms');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalDate(
      startDate
    )}/${formatCalDate(endDate)}&details=${details}&location=${location}`;
  }, [targetTimestamp, release]);

  // Share Hype handler
  const handleShare = async () => {
    const shareUrl = release.smartUrl || `${window.location.origin}/#/release/${release.slug || release.id}`;
    const shareData = {
      title: `TANBYR — ${release.title} (Dropping Soon)`,
      text: `Get ready for "${release.title}" by TANBYR dropping on ${formattedReleaseDate}! Pre-save now:`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        return;
      } catch (err: unknown) {
        // If user cancelled the share dialog, do not trigger fallback or log error
        if (err && typeof err === 'object' && 'name' in err && (err as { name?: string }).name === 'AbortError') {
          return;
        }
        // Fallback to clipboard
      }
    }

    await copyToClipboard(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const padZero = (n: number) => String(n).padStart(2, '0');

  // If expired, show active "Out Now" state
  if (timeLeft.isExpired) {
    return (
      <div
        className={`p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e0e13] to-emerald-950/40 border border-emerald-500/30 text-center ${className}`}
      >
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-500/40">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Out Now &middot; Streaming Worldwide</span>
        </div>
        <h4 className="text-xl font-black uppercase text-white tracking-wide mb-2">
          {release.title} is Officially Released!
        </h4>
        <p className="text-xs text-neutral-300 mb-4 font-light">
          Experience the latest single now on your favorite music platform.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={release.smartUrl || `/#/release/${release.slug || release.id}`}
            target={release.smartUrl ? '_blank' : undefined}
            rel={release.smartUrl ? 'noopener noreferrer' : undefined}
            className="px-6 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs uppercase tracking-wider transition-transform hover:scale-105 shadow-lg shadow-[#1DB954]/20 inline-flex items-center space-x-2"
          >
            <span>Stream Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // INLINE VARIANT (Used inside existing release card or compact containers)
  if (variant === 'inline') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Dropping In</span>
          </span>
          <span className="text-[10px] text-neutral-400 font-medium">
            {formattedReleaseDate}
          </span>
        </div>

        {/* 4 Units Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 shadow-inner">
            <span className="block text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
              {padZero(timeLeft.days)}
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">
              Days
            </span>
          </div>
          <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 shadow-inner">
            <span className="block text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
              {padZero(timeLeft.hours)}
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">
              Hours
            </span>
          </div>
          <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 shadow-inner">
            <span className="block text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
              {padZero(timeLeft.minutes)}
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">
              Mins
            </span>
          </div>
          <div className="bg-black/60 border border-amber-500/30 rounded-xl p-2.5 shadow-inner relative overflow-hidden">
            <span className="block text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-tight">
              {padZero(timeLeft.seconds)}
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-amber-300 font-semibold mt-0.5">
              Secs
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400/50 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // FULL SPOTLIGHT / HERO VARIANT
  return (
    <div
      id={`upcoming-release-countdown-${release.id}`}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#14121a] via-[#0d0c13] to-[#08080c] border border-amber-500/25 shadow-2xl p-6 sm:p-10 lg:p-12 ${className}`}
    >
      {/* Ambient background glow & subtle blurred artwork backing */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Artwork with Hype Badge */}
        <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-black shadow-2xl group">
          <SmartImage
            key={release.coverImage || release.id}
            src={release.coverImage}
            alt={`${release.title} Cover`}
            fallbackType="artwork"
            fallbackText={release.title}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Floating Premiere Tag */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg">
              <Flame className="w-3 h-3 text-black fill-current" />
              <span>Upcoming {release.type}</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-center">
              <span className="text-[11px] font-semibold text-white/90 uppercase tracking-widest block">
                Dropping {formattedReleaseDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Real-Time Countdown Blocks */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Eyebrow & Live Pulse */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>World Premiere Countdown</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
              title="Share Upcoming Single"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Hype</span>
                </>
              )}
            </button>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
              {release.title}
            </h3>
            {release.description ? (
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {release.description}
              </p>
            ) : (
              <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                The next official single by TANBYR is on its way. Be the first to experience the drop across all streaming platforms.
              </p>
            )}
          </div>

          {/* 4 Digit Real-Time Countdown Grid */}
          <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Time Remaining Until Release</span>
              </span>
              <span className="text-[11px] text-amber-400/90 font-mono font-semibold">
                T-MINUS
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
              {/* Days */}
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-colors">
                <span className="block text-3xl sm:text-5xl font-mono font-black text-white tracking-tight">
                  {padZero(timeLeft.days)}
                </span>
                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-colors">
                <span className="block text-3xl sm:text-5xl font-mono font-black text-white tracking-tight">
                  {padZero(timeLeft.hours)}
                </span>
                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-colors">
                <span className="block text-3xl sm:text-5xl font-mono font-black text-white tracking-tight">
                  {padZero(timeLeft.minutes)}
                </span>
                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 relative overflow-hidden">
                <span className="block text-3xl sm:text-5xl font-mono font-black text-amber-300 tracking-tight animate-pulse">
                  {padZero(timeLeft.seconds)}
                </span>
                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-200 mt-1">
                  Seconds
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Action CTAs: Pre-Save, Smart Link & Calendar Reminder */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Direct Pre-Save on Feature.fm / ffem.bio if available */}
            {release.smartUrl ? (
              <a
                href={release.smartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-pink-500/25 hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Pre-Save on Feature.fm (ffem.bio)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : release.spotifyUrl ? (
              <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#1DB954]/25 hover:scale-105 cursor-pointer"
              >
                <SpotifyLogo className="w-4 h-4 text-black" />
                <span>Pre-Save on Spotify</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}

            {/* Add to Google Calendar Reminder */}
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
              title="Add release drop to Google Calendar"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Add to Calendar</span>
            </a>

            {/* Smart Link Details Button */}
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate(`/release/${release.slug || release.id}`)}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-full bg-transparent hover:bg-white/5 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Disc3 className="w-4 h-4 text-neutral-400" />
                <span>View Release Details</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
