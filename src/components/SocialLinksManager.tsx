import React from 'react';
import { Plus, Trash2, Globe, ExternalLink } from 'lucide-react';
import { CustomSocialLink } from '../types';
import { getBrandMeta, SUPPORTED_SOCIAL_PLATFORMS } from './BrandLogos';

interface SocialLinksManagerProps {
  links: CustomSocialLink[];
  onChange: (updatedLinks: CustomSocialLink[]) => void;
}

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  links,
  onChange,
}) => {
  const handleAddLink = () => {
    // Find first unused platform or default to instagram
    const existingPlatforms = new Set(links.map((l) => l.platform));
    const nextAvailable =
      SUPPORTED_SOCIAL_PLATFORMS.find((p) => !existingPlatforms.has(p.id)) ||
      SUPPORTED_SOCIAL_PLATFORMS[0];

    const newLink: CustomSocialLink = {
      id: `soc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      platform: nextAvailable.id,
      label: nextAvailable.name,
      url: '',
      enabled: true,
    };
    onChange([...links, newLink]);
  };

  const handleUpdateLink = (id: string, field: keyof CustomSocialLink, value: any) => {
    const updated = links.map((link) => {
      if (link.id === id) {
        const next = { ...link, [field]: value };
        // Auto-update default label if platform changes and label was unmodified or equal to old platform
        if (field === 'platform') {
          const meta = getBrandMeta(value);
          const oldMeta = getBrandMeta(link.platform);
          if (!link.label || link.label === oldMeta.name) {
            next.label = meta.name;
          }
        }
        return next;
      }
      return link;
    });
    onChange(updated);
  };

  const handleDeleteLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Top Header with Add (+) Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Social & Artist Profiles ({links.length})</span>
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5 font-light">
            Add Instagram, YouTube, TikTok, Spotify, and other links. Brand logos render automatically with authentic colors.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLink}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      {/* List of Dynamic Social Links */}
      {links.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/15 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">No social links added yet</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click the "+ Add Social Link" button above to add your Instagram, Spotify, or YouTube links.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            + Add First Link
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => {
            const meta = getBrandMeta(link.platform);
            const BrandLogo = meta.icon;

            return (
              <div
                key={link.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  link.enabled
                    ? 'bg-[#0e0e14] border-white/15'
                    : 'bg-[#0a0a0d] border-white/5 opacity-60'
                } flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4`}
              >
                {/* 1. Official Platform Logo & Selector */}
                <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0">
                  {/* Real Authentic Logo Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner transition-colors"
                    style={{
                      backgroundColor: `${meta.defaultColor}15`,
                      color: meta.defaultColor,
                    }}
                    title={meta.name}
                  >
                    <BrandLogo className="w-5 h-5" />
                  </div>

                  {/* Platform Dropdown */}
                  <div className="flex-1 sm:w-44">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Platform
                    </label>
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        handleUpdateLink(link.id, 'platform', e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#15151e] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-white/40 cursor-pointer"
                    >
                      {SUPPORTED_SOCIAL_PLATFORMS.map((plat) => (
                        <option key={plat.id} value={plat.id} className="bg-[#15151e] text-white">
                          {plat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Display Name / Label */}
                <div className="w-full sm:w-44">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      handleUpdateLink(link.id, 'label', e.target.value)
                    }
                    placeholder={meta.name}
                    className="w-full px-3 py-2 rounded-lg bg-[#15151e] border border-white/15 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                {/* 3. URL input */}
                <div className="flex-1 w-full min-w-0">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Profile URL *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        handleUpdateLink(link.id, 'url', e.target.value)
                      }
                      placeholder={meta.placeholderUrl || 'https://...'}
                      required
                      className="w-full px-3 py-2 pr-8 rounded-lg bg-[#15151e] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-white/40"
                    />
                    {link.url && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        title="Test link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* 4. Controls: Enabled toggle & Delete button */}
                <div className="flex items-center space-x-2 pt-2 sm:pt-4 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateLink(link.id, 'enabled', !link.enabled)
                    }
                    title={link.enabled ? 'Click to hide link' : 'Click to show link'}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      link.enabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    {link.enabled ? 'Active' : 'Hidden'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteLink(link.id)}
                    title="Remove link"
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Preview Bar */}
      {links.filter((l) => l.enabled && l.url).length > 0 && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            Public Website Icon Bar Preview
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {links
              .filter((l) => l.enabled && l.url)
              .map((link) => {
                const meta = getBrandMeta(link.platform);
                const Icon = meta.icon;
                return (
                  <div
                    key={link.id}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white"
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: meta.defaultColor }} />
                    <span>{link.label || meta.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
