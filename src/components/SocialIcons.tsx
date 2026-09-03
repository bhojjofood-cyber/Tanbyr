import React from 'react';
import { motion } from 'motion/react';
import {
  Headphones,
  Apple,
  Youtube,
  Music2,
  Instagram,
  Facebook,
  Twitter,
  Music,
} from 'lucide-react';
import { SocialLinks } from '../types';

interface SocialIconsProps {
  socials?: SocialLinks | null;
  variant?: 'navbar' | 'hero' | 'footer' | 'drawer' | 'card';
  showLabels?: boolean;
}

interface PlatformConfig {
  name: string;
  key: keyof SocialLinks;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  hoverBg: string;
  hoverBorder: string;
  hoverText: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    name: 'Spotify',
    key: 'spotify',
    icon: Headphones,
    accentColor: '#1DB954',
    hoverBg: 'hover:bg-emerald-500/10',
    hoverBorder: 'hover:border-emerald-500/40',
    hoverText: 'hover:text-emerald-400',
  },
  {
    name: 'Apple Music',
    key: 'appleMusic',
    icon: Apple,
    accentColor: '#FA243C',
    hoverBg: 'hover:bg-rose-500/10',
    hoverBorder: 'hover:border-rose-500/40',
    hoverText: 'hover:text-rose-400',
  },
  {
    name: 'YouTube',
    key: 'youtube',
    icon: Youtube,
    accentColor: '#FF0000',
    hoverBg: 'hover:bg-red-500/10',
    hoverBorder: 'hover:border-red-500/40',
    hoverText: 'hover:text-red-400',
  },
  {
    name: 'YouTube Music',
    key: 'youtubeMusic',
    icon: Music2,
    accentColor: '#FF0000',
    hoverBg: 'hover:bg-red-500/10',
    hoverBorder: 'hover:border-red-500/40',
    hoverText: 'hover:text-red-400',
  },
  {
    name: 'Instagram',
    key: 'instagram',
    icon: Instagram,
    accentColor: '#E4405F',
    hoverBg: 'hover:bg-pink-500/10',
    hoverBorder: 'hover:border-pink-500/40',
    hoverText: 'hover:text-pink-400',
  },
  {
    name: 'TikTok',
    key: 'tiktok',
    icon: Music,
    accentColor: '#00F2FE',
    hoverBg: 'hover:bg-cyan-500/10',
    hoverBorder: 'hover:border-cyan-500/40',
    hoverText: 'hover:text-cyan-300',
  },
  {
    name: 'Facebook',
    key: 'facebook',
    icon: Facebook,
    accentColor: '#1877F2',
    hoverBg: 'hover:bg-blue-500/10',
    hoverBorder: 'hover:border-blue-500/40',
    hoverText: 'hover:text-blue-400',
  },
  {
    name: 'X (Twitter)',
    key: 'x',
    icon: Twitter,
    accentColor: '#FFFFFF',
    hoverBg: 'hover:bg-white/10',
    hoverBorder: 'hover:border-white/40',
    hoverText: 'hover:text-white',
  },
];

export const SocialIcons: React.FC<SocialIconsProps> = ({
  socials,
  variant = 'footer',
  showLabels = false,
}) => {
  // If socials is undefined, null, or empty, return null gracefully
  if (!socials || typeof socials !== 'object') {
    return null;
  }

  // Filter platforms with valid URLs
  const activePlatforms = PLATFORMS.filter((p) => {
    const url = socials[p.key];
    return Boolean(url && typeof url === 'string' && url.trim() !== '' && url !== '#');
  });

  if (activePlatforms.length === 0) return null;

  // Render variant styles
  if (variant === 'navbar') {
    // Compact navbar icons
    return (
      <div className="flex items-center space-x-2">
        {activePlatforms.slice(0, 4).map((platform) => {
          const Icon = platform.icon;
          const url = socials[platform.key];
          return (
            <motion.a
              key={platform.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`TANBYR on ${platform.name}`}
              aria-label={`TANBYR on ${platform.name}`}
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full text-neutral-400 bg-white/[0.03] border border-white/5 transition-all duration-300 ${platform.hoverBg} ${platform.hoverBorder} ${platform.hoverText}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </motion.a>
          );
        })}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {activePlatforms.map((platform, idx) => {
          const Icon = platform.icon;
          const url = socials[platform.key];
          return (
            <motion.a
              key={platform.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`TANBYR on ${platform.name}`}
              aria-label={`TANBYR on ${platform.name}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-neutral-300 transition-all duration-300 ${platform.hoverBg} ${platform.hoverBorder} ${platform.hoverText}`}
            >
              <Icon className="w-4 h-4" />
              {showLabels && (
                <span className="text-[11px] font-medium tracking-wider uppercase">
                  {platform.name}
                </span>
              )}
            </motion.a>
          );
        })}
      </div>
    );
  }

  if (variant === 'drawer') {
    return (
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
        {activePlatforms.map((platform) => {
          const Icon = platform.icon;
          const url = socials[platform.key];
          return (
            <a
              key={platform.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`TANBYR on ${platform.name}`}
              aria-label={`TANBYR on ${platform.name}`}
              className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 transition-all duration-200 ${platform.hoverBg} ${platform.hoverBorder} ${platform.hoverText}`}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activePlatforms.map((platform) => {
          const Icon = platform.icon;
          const url = socials[platform.key];
          return (
            <motion.a
              key={platform.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center space-x-3 p-3.5 rounded-2xl bg-[#101016] border border-white/10 transition-all duration-300 ${platform.hoverBg} ${platform.hoverBorder} ${platform.hoverText} group`}
            >
              <div className="p-2 rounded-xl bg-white/5 text-white group-hover:bg-white/10 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-white tracking-wider uppercase truncate">
                  {platform.name}
                </span>
                <span className="block text-[10px] text-neutral-400 font-light truncate">
                  Official Channel
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    );
  }

  // Default 'footer' variant: Sophisticated circular badge buttons with tooltips & subtle labels
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
      {activePlatforms.map((platform) => {
        const Icon = platform.icon;
        const url = socials[platform.key];
        return (
          <motion.a
            key={platform.key}
            id={`footer-social-${platform.name.toLowerCase().replace(/[\s()]+/g, '-')}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Follow TANBYR on ${platform.name}`}
            aria-label={`Follow TANBYR on ${platform.name}`}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white transition-all duration-300 ${platform.hoverBg} ${platform.hoverBorder} ${platform.hoverText} group cursor-pointer`}
          >
            <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              {platform.name}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
};
