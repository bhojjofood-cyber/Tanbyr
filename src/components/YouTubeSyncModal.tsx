import React, { useState } from 'react';
import {
  X,
  Film,
  Loader2,
  Check,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Play,
  Plus,
} from 'lucide-react';
import { MusicVideo } from '../types';
import { syncFromYouTube, YouTubeSyncResponse } from '../lib/mediaSyncClient';
import { BrandLogos } from './BrandLogos';

interface YouTubeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportVideos: (videos: MusicVideo[]) => Promise<void>;
  defaultChannelInput?: string;
}

export const YouTubeSyncModal: React.FC<YouTubeSyncModalProps> = ({
  isOpen,
  onClose,
  onImportVideos,
  defaultChannelInput = '@tanbyr',
}) => {
  const [channelInput, setChannelInput] = useState(defaultChannelInput);
  const [videoUrlsInput, setVideoUrlsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncData, setSyncData] = useState<YouTubeSyncResponse | null>(null);
  const [discoveredVideos, setDiscoveredVideos] = useState<MusicVideo[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchChannel = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!channelInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await syncFromYouTube(channelInput.trim());
      if (!data.success) {
        setErrorMessage(data.error || 'Could not fetch data from YouTube channel.');
      } else {
        setSyncData(data);
        if (data.videos.length > 0) {
          setDiscoveredVideos(data.videos);
          setSelectedIds(new Set(data.videos.map((v) => v.id)));
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to YouTube sync service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchDirectVideos = async () => {
    if (!videoUrlsInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await syncFromYouTube(videoUrlsInput.trim());
      if (!data.success) {
        setErrorMessage(data.error || 'Could not fetch video details.');
      } else if (data.videos.length > 0) {
        // Merge with discovered videos without duplicate IDs
        const existingIds = new Set(discoveredVideos.map((v) => v.id));
        const newVids = data.videos.filter((v) => !existingIds.has(v.id));
        const merged = [...discoveredVideos, ...newVids];
        setDiscoveredVideos(merged);
        setSelectedIds(new Set(merged.map((v) => v.id)));
        setVideoUrlsInput('');
      } else {
        setErrorMessage('No valid YouTube video links found in input.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing YouTube video URLs.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === discoveredVideos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(discoveredVideos.map((v) => v.id)));
    }
  };

  const handleImport = async () => {
    const toImport = discoveredVideos.filter((v) => selectedIds.has(v.id));
    if (toImport.length === 0) {
      alert('Please select at least one video to import.');
      return;
    }

    setIsImporting(true);
    try {
      await onImportVideos(toImport);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving videos to CMS.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c0c10] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#101016]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF0000]/15 border border-[#FF0000]/30 flex items-center justify-center text-[#FF0000]">
              <BrandLogos platform="youtube" className="w-5 h-5 text-[#FF0000]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Auto-Fetch from YouTube</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#FF0000]/20 text-[#FF0000] border border-[#FF0000]/30">
                  Channel
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Sync music videos from your official YouTube channel or paste video links.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Channel Search Form */}
          <form onSubmit={handleFetchChannel} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              YouTube Channel Handle or URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="@tanbyr or https://www.youtube.com/@tanbyr"
                className="w-full pl-4 pr-4 py-3 rounded-xl bg-[#14141a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF0000] transition-colors flex-1"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-[#FF0000] hover:bg-[#ff1a1a] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-lg shadow-[#FF0000]/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Syncing Channel...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scan Channel</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sync Result Details */}
          {syncData && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  {syncData.channelTitle || 'YouTube Channel'}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Channel ID: <span className="font-mono text-neutral-300">{syncData.channelId}</span>
                </p>
              </div>
              <span className="text-xs text-neutral-300 px-2.5 py-1 rounded bg-white/10 font-mono">
                {discoveredVideos.length} Video{discoveredVideos.length === 1 ? '' : 's'}
              </span>
            </div>
          )}

          {/* Quick Paste Video Links Form */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Or Paste Direct YouTube Video URL(s)
            </label>
            <p className="text-[11px] text-neutral-400">
              Paste one or multiple video links (e.g. <span className="text-neutral-300">https://www.youtube.com/watch?v=...</span>). High-resolution thumbnails and titles will be fetched automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={videoUrlsInput}
                onChange={(e) => setVideoUrlsInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/15 text-white text-xs focus:outline-none focus:border-white/30 flex-1"
              />
              <button
                type="button"
                onClick={handleFetchDirectVideos}
                disabled={isLoading || !videoUrlsInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
                <span>Fetch Link</span>
              </button>
            </div>
          </div>

          {/* Discovered Videos List */}
          {discoveredVideos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span>Select videos to import into your website:</span>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-white">
                    {selectedIds.size} of {discoveredVideos.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-xs text-[#FF0000] hover:underline uppercase font-bold tracking-wider cursor-pointer"
                  >
                    {selectedIds.size === discoveredVideos.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {discoveredVideos.map((vid) => {
                  const isSelected = selectedIds.has(vid.id);
                  return (
                    <div
                      key={vid.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between space-x-3 ${
                        isSelected
                          ? 'bg-[#FF0000]/5 border-[#FF0000]/40'
                          : 'bg-white/[0.02] border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(vid.id)}
                          className="w-4 h-4 rounded bg-neutral-900 border-white/30 text-[#FF0000] cursor-pointer shrink-0"
                        />
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-16 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-white truncate">
                            {vid.title}
                          </h5>
                          <span className="text-[10px] text-neutral-400 block mt-0.5">
                            {vid.releaseDate}
                          </span>
                        </div>
                      </div>

                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Open on YouTube"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#101016] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {discoveredVideos.length > 0 && (
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting || selectedIds.size === 0}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to CMS...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Import {selectedIds.size} Selected Video{selectedIds.size === 1 ? '' : 's'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
