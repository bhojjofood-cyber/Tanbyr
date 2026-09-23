import React, { useState } from 'react';
import {
  X,
  Disc3,
  Loader2,
  Check,
  Music,
  ExternalLink,
  Play,
  Pause,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { MusicRelease } from '../types';
import { syncFromSpotify, SpotifySyncResponse } from '../lib/mediaSyncClient';
import { BrandLogos } from './BrandLogos';

interface SpotifySyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportReleases: (releases: MusicRelease[]) => Promise<void>;
  defaultArtistUrl?: string;
}

export const SpotifySyncModal: React.FC<SpotifySyncModalProps> = ({
  isOpen,
  onClose,
  onImportReleases,
  defaultArtistUrl = 'https://open.spotify.com/artist/7tUWUGzYWCzKKf7JwbhmP7?si=vqQIL_-HTRy_r8muY_r7Ng&utm_source=copy-link',
}) => {
  const [spotifyUrl, setSpotifyUrl] = useState(defaultArtistUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [syncData, setSyncData] = useState<SpotifySyncResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!spotifyUrl.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSyncData(null);

    try {
      const data = await syncFromSpotify(spotifyUrl.trim());
      if (!data.success) {
        setErrorMessage(data.error || 'Could not fetch data from Spotify.');
      } else {
        setSyncData(data);
        // By default, select all fetched releases
        setSelectedIds(new Set(data.releases.map((r) => r.id)));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to Spotify sync service.');
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
    if (!syncData) return;
    if (selectedIds.size === syncData.releases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(syncData.releases.map((r) => r.id)));
    }
  };

  const handleTogglePlay = (previewUrl?: string) => {
    if (!previewUrl) return;

    if (playingPreview === previewUrl) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingPreview(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(previewUrl);
    audio.play().catch((e) => console.warn('Audio play notice:', e));
    audio.onended = () => setPlayingPreview(null);
    setAudioElement(audio);
    setPlayingPreview(previewUrl);
  };

  const handleImport = async () => {
    if (!syncData) return;
    const toImport = syncData.releases.filter((r) => selectedIds.has(r.id));
    if (toImport.length === 0) {
      alert('Please select at least one song to import.');
      return;
    }

    setIsImporting(true);
    try {
      if (audioElement) {
        audioElement.pause();
      }
      await onImportReleases(toImport);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving releases to CMS.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (audioElement) {
      audioElement.pause();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c0c10] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#101016]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954]">
              <BrandLogos platform="spotify" className="w-5 h-5 text-[#1DB954]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Auto-Fetch from Spotify</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">
                  Live
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Instantly scan all your songs and releases currently live on Spotify.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Input Form */}
          <form onSubmit={handleFetch} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Spotify Artist URL or Track URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="https://open.spotify.com/artist/..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#14141a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#1DB954] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-lg shadow-[#1DB954]/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scanning Spotify...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Fetch Releases</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Tip: You can paste your Spotify Artist profile URL to scan all releases, or paste an individual track URL.
            </p>
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
            <div className="space-y-4">
              {/* Artist Card */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center space-x-3">
                  {syncData.artistImage && syncData.artistImage.trim() !== '' ? (
                    <img
                      src={syncData.artistImage}
                      alt={syncData.artistName || 'Artist'}
                      className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Music className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      {syncData.artistName || 'Spotify Artist'}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {syncData.count} release{syncData.count === 1 ? '' : 's'} live on Spotify
                    </p>
                  </div>
                </div>

                {syncData.releases.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-xs text-[#1DB954] hover:underline uppercase font-bold tracking-wider cursor-pointer"
                  >
                    {selectedIds.size === syncData.releases.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {/* Releases List */}
              {syncData.releases.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-neutral-400 text-xs">
                  No tracks were found directly in the profile embed. Make sure the artist profile has public tracks on Spotify or paste a track link directly.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                    <span>Select songs you want to import into your website catalog:</span>
                    <span className="font-bold text-white">
                      {selectedIds.size} of {syncData.releases.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-[340px] overflow-y-auto pr-1">
                    {syncData.releases.map((rel) => {
                      const isSelected = selectedIds.has(rel.id);
                      return (
                        <div
                          key={rel.id}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between space-x-3 ${
                            isSelected
                              ? 'bg-[#1DB954]/5 border-[#1DB954]/40'
                              : 'bg-white/[0.02] border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(rel.id)}
                              className="w-4 h-4 rounded bg-neutral-900 border-white/30 text-[#1DB954] cursor-pointer shrink-0"
                            />
                            {rel.coverImage && rel.coverImage.trim() !== '' ? (
                              <img
                                src={rel.coverImage}
                                alt={rel.title}
                                className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                                <Music className="w-6 h-6 text-neutral-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white">
                                  {rel.type}
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  {rel.releaseDate}
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-white truncate mt-0.5">
                                {rel.title}
                              </h5>
                              <p className="text-[11px] text-neutral-400 line-clamp-1">
                                {rel.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {rel.previewAudioUrl && (
                              <button
                                type="button"
                                onClick={() => handleTogglePlay(rel.previewAudioUrl)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                title={playingPreview === rel.previewAudioUrl ? 'Pause audio preview' : 'Play 30s preview'}
                              >
                                {playingPreview === rel.previewAudioUrl ? (
                                  <Pause className="w-3.5 h-3.5 text-[#1DB954]" />
                                ) : (
                                  <Play className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                            <a
                              href={rel.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                              title="Open on Spotify"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#101016] flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {syncData && syncData.releases.length > 0 && (
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
                  <span>Import {selectedIds.size} Selected Release{selectedIds.size === 1 ? '' : 's'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
