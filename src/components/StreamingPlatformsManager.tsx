import React from 'react';
import { Plus, Trash2, Disc3, ExternalLink } from 'lucide-react';
import { StreamingPlatformLink } from '../types';
import { getBrandMeta, SUPPORTED_STREAMING_PLATFORMS } from './BrandLogos';

interface StreamingPlatformsManagerProps {
  platforms: StreamingPlatformLink[];
  onChange: (updatedPlatforms: StreamingPlatformLink[]) => void;
}

export const StreamingPlatformsManager: React.FC<StreamingPlatformsManagerProps> = ({
  platforms,
  onChange,
}) => {
  const handleAddPlatform = () => {
    // Find next unselected streaming platform
    const existing = new Set(platforms.map((p) => p.platform));
    const nextAvailable =
      SUPPORTED_STREAMING_PLATFORMS.find((p) => !existing.has(p.id)) ||
      SUPPORTED_STREAMING_PLATFORMS[0];

    const newPlatform: StreamingPlatformLink = {
      id: `stream-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      platform: nextAvailable.id,
      label: nextAvailable.name,
      url: '',
      actionText: nextAvailable.actionText || 'Listen',
    };
    onChange([...platforms, newPlatform]);
  };

  const handleUpdate = (id: string, field: keyof StreamingPlatformLink, value: any) => {
    const updated = platforms.map((item) => {
      if (item.id === id) {
        const next = { ...item, [field]: value };
        if (field === 'platform') {
          const meta = getBrandMeta(value);
          const oldMeta = getBrandMeta(item.platform);
          if (!item.label || item.label === oldMeta.name) {
            next.label = meta.name;
          }
          if (!item.actionText || item.actionText === oldMeta.actionText) {
            next.actionText = meta.actionText || 'Listen';
          }
        }
        return next;
      }
      return item;
    });
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    onChange(platforms.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Header with (+) Add Platform Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center space-x-2">
            <Disc3 className="w-4 h-4 text-emerald-400" />
            <span>Available Streaming Platforms &amp; Stores ("Listen On")</span>
          </label>
          <p className="text-[11px] text-neutral-400 font-light mt-0.5">
            Add platforms where fans can stream this song (Spotify, Apple Music, YouTube, etc.). Displayed on the release's dedicated Smart Link page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddPlatform}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Platform</span>
        </button>
      </div>

      {/* List */}
      {platforms.length === 0 ? (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center">
          <p className="text-xs text-neutral-400">
            No platforms added yet. Click "+ Add Platform" to add Spotify, Apple Music, etc.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {platforms.map((plat) => {
            const meta = getBrandMeta(plat.platform);
            const BrandIcon = meta.icon;

            return (
              <div
                key={plat.id}
                className="p-3 rounded-xl bg-[#121218] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3"
              >
                {/* Platform Selector & Icon */}
                <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                    style={{
                      backgroundColor: `${meta.defaultColor}15`,
                      color: meta.defaultColor,
                    }}
                  >
                    <BrandIcon className="w-4 h-4" />
                  </div>

                  <select
                    value={plat.platform}
                    onChange={(e) =>
                      handleUpdate(plat.id, 'platform', e.target.value)
                    }
                    className="flex-1 sm:w-36 px-2.5 py-1.5 rounded-lg bg-[#181822] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-white/40 cursor-pointer"
                  >
                    {SUPPORTED_STREAMING_PLATFORMS.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#181822] text-white">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* URL Input */}
                <div className="flex-1 w-full min-w-0 relative">
                  <input
                    type="url"
                    value={plat.url}
                    onChange={(e) =>
                      handleUpdate(plat.id, 'url', e.target.value)
                    }
                    placeholder={meta.placeholderUrl || 'https://...'}
                    required
                    className="w-full px-2.5 py-1.5 pr-7 rounded-lg bg-[#181822] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-white/40"
                  />
                  {plat.url && (
                    <a
                      href={plat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      title="Test stream URL"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Action Text (e.g. Listen, Play, Buy) */}
                <div className="w-24 shrink-0">
                  <input
                    type="text"
                    value={plat.actionText || 'Listen'}
                    onChange={(e) =>
                      handleUpdate(plat.id, 'actionText', e.target.value)
                    }
                    placeholder="Listen"
                    title="Button action label (e.g. Listen, Watch, Play)"
                    className="w-full px-2 py-1.5 rounded-lg bg-[#181822] border border-white/15 text-white text-xs text-center font-bold focus:outline-none focus:border-white/40"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(plat.id)}
                  title="Remove platform"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer self-end sm:self-center shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
