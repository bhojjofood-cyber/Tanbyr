import React from 'react';
import { motion } from 'motion/react';
import { SocialLinks, CustomSocialLink } from '../types';
import { getBrandMeta } from './BrandLogos';

interface SocialIconsProps {
  socials?: SocialLinks | null;
  variant?: 'navbar' | 'hero' | 'footer' | 'drawer' | 'card';
  showLabels?: boolean;
}

interface ResolvedSocialItem {
  id: string;
  name: string;
  url: string;
  platform: string;
  meta: ReturnType<typeof getBrandMeta>;
}

export function resolveActiveSocials(socials?: SocialLinks | null): ResolvedSocialItem[] {
  if (!socials || typeof socials !== 'object') return [];

  // 1. If user added custom dynamic links in Admin, prioritize them!
  if (Array.isArray(socials.customLinks) && socials.customLinks.length > 0) {
    return socials.customLinks
      .filter((link) => link.enabled !== false && Boolean(link.url && link.url.trim() !== '' && link.url !== '#'))
      .map((link) => {
        const meta = getBrandMeta(link.platform || link.label);
        return {
          id: link.id,
          name: link.label || meta.name,
          url: link.url,
          platform: link.platform,
          meta,
        };
      });
  }

  // 2. Otherwise fallback to standard predefined keys (legacy / initial state)
  const standardKeys: Array<{ key: keyof SocialLinks; platform: string; label: string }> = [
    { key: 'instagram', platform: 'instagram', label: 'Instagram' },
    { key: 'spotify', platform: 'spotify', label: 'Spotify' },
    { key: 'youtube', platform: 'youtube', label: 'YouTube' },
    { key: 'appleMusic', platform: 'appleMusic', label: 'Apple Music' },
    { key: 'tiktok', platform: 'tiktok', label: 'TikTok' },
    { key: 'facebook', platform: 'facebook', label: 'Facebook' },
    { key: 'x', platform: 'x', label: 'X (Twitter)' },
    { key: 'youtubeMusic', platform: 'youtubeMusic', label: 'YouTube Music' },
  ];

  const items: ResolvedSocialItem[] = [];
  for (const entry of standardKeys) {
    const val = socials[entry.key];
    if (typeof val === 'string' && val.trim() !== '' && val !== '#') {
      const meta = getBrandMeta(entry.platform);
      items.push({
        id: entry.platform,
        name: entry.label,
        url: val,
        platform: entry.platform,
        meta,
      });
    }
  }

  return items;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({
  socials,
  variant = 'footer',
  showLabels = false,
}) => {
  const activeItems = resolveActiveSocials(socials);

  if (activeItems.length === 0) {
    return null;
  }

  // Render variant styles
  if (variant === 'navbar') {
    // Compact navbar icons with authentic brand SVG
    return (
      <div className="flex items-center space-x-1.5">
        {activeItems.slice(0, 5).map((item) => {
          const Icon = item.meta.icon;
          return (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`TANBYR on ${item.name}`}
              aria-label={`TANBYR on ${item.name}`}
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full text-neutral-400 bg-white/[0.03] border border-white/5 transition-all duration-300 ${item.meta.hoverBg} ${item.meta.hoverBorder} ${item.meta.hoverText}`}
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
        {activeItems.map((item, idx) => {
          const Icon = item.meta.icon;
          return (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`TANBYR on ${item.name}`}
              aria-label={`TANBYR on ${item.name}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-neutral-300 transition-all duration-300 ${item.meta.hoverBg} ${item.meta.hoverBorder} ${item.meta.hoverText}`}
            >
              <Icon className="w-4 h-4" />
              {showLabels && (
                <span className="text-[11px] font-medium tracking-wider uppercase">
                  {item.name}
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
        {activeItems.map((item) => {
          const Icon = item.meta.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`TANBYR on ${item.name}`}
              aria-label={`TANBYR on ${item.name}`}
              className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 transition-all duration-200 ${item.meta.hoverBg} ${item.meta.hoverBorder} ${item.meta.hoverText}`}
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
        {activeItems.map((item) => {
          const Icon = item.meta.icon;
          return (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center space-x-3 p-3.5 rounded-2xl bg-[#101016] border border-white/10 transition-all duration-300 ${item.meta.hoverBg} ${item.meta.hoverBorder} ${item.meta.hoverText} group`}
            >
              <div className="p-2 rounded-xl bg-white/5 text-white group-hover:bg-white/10 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-white tracking-wider uppercase truncate">
                  {item.name}
                </span>
                <span className="block text-[10px] text-neutral-400 font-light truncate">
                  Official Profile
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    );
  }

  // Default 'footer' variant: Authentic circular badge buttons with tooltips & brand logos
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
      {activeItems.map((item) => {
        const Icon = item.meta.icon;
        return (
          <motion.a
            key={item.id}
            id={`footer-social-${item.id}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Follow TANBYR on ${item.name}`}
            aria-label={`Follow TANBYR on ${item.name}`}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white transition-all duration-300 ${item.meta.hoverBg} ${item.meta.hoverBorder} ${item.meta.hoverText} group cursor-pointer`}
          >
            <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              {item.name}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
};
