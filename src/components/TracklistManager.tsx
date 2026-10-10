import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Music,
  ExternalLink,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ReleaseTrack } from '../types';
import { BrandIcon } from './BrandLogos';

interface TracklistManagerProps {
  tracks: ReleaseTrack[];
  onChange: (tracks: ReleaseTrack[]) => void;
  releaseType: 'single' | 'ep' | 'album';
}

export const TracklistManager: React.FC<TracklistManagerProps> = ({
  tracks,
  onChange,
  releaseType,
}) => {
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);

  // Add new track
  const handleAddTrack = () => {
    const nextNumber = tracks.length + 1;
    const newTrack: ReleaseTrack = {
      id: `track-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      trackNumber: nextNumber,
      title: '',
      duration: '',
      spotifyUrl: '',
      youtubeUrl: '',
      appleMusicUrl: '',
      isrc: '',
    };
    onChange([...tracks, newTrack]);
    setExpandedTrackId(newTrack.id);
  };

  // Remove track
  const handleRemoveTrack = (id: string) => {
    const remaining = tracks.filter((t) => t.id !== id);
    // Renumber tracks sequentially
    const renumbered = remaining.map((t, idx) => ({
      ...t,
      trackNumber: idx + 1,
    }));
    onChange(renumbered);
    if (expandedTrackId === id) {
      setExpandedTrackId(null);
    }
  };

  // Move track up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newTracks = [...tracks];
    const temp = newTracks[index - 1];
    newTracks[index - 1] = newTracks[index];
    newTracks[index] = temp;
    // Renumber
    const renumbered = newTracks.map((t, idx) => ({
      ...t,
      trackNumber: idx + 1,
    }));
    onChange(renumbered);
  };

  // Move track down
  const handleMoveDown = (index: number) => {
    if (index === tracks.length - 1) return;
    const newTracks = [...tracks];
    const temp = newTracks[index + 1];
    newTracks[index + 1] = newTracks[index];
    newTracks[index] = temp;
    // Renumber
    const renumbered = newTracks.map((t, idx) => ({
      ...t,
      trackNumber: idx + 1,
    }));
    onChange(renumbered);
  };

  // Update specific track field
  const handleUpdateTrack = (id: string, updates: Partial<ReleaseTrack>) => {
    const updated = tracks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    onChange(updated);
  };

  const labelType = releaseType === 'album' ? 'Album' : 'EP';

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {labelType} Tracklist ({tracks.length} track{tracks.length === 1 ? '' : 's'})
            </h4>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Add, reorder, and configure individual track titles, durations, and streaming links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddTrack}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Track</span>
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="py-6 px-4 rounded-xl border border-dashed border-white/15 bg-white/[0.01] text-center">
          <p className="text-xs text-neutral-400 mb-2">
            No tracks in this {labelType.toLowerCase()} yet.
          </p>
          <button
            type="button"
            onClick={handleAddTrack}
            className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Track 01</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          {tracks.map((track, index) => {
            const isExpanded = expandedTrackId === track.id;
            return (
              <div
                key={track.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-[#121217] border-white/20 shadow-lg'
                    : 'bg-[#0f0f14] border-white/10 hover:border-white/15'
                }`}
              >
                {/* Track Row Header */}
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    {/* Track Number Badge */}
                    <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-amber-400 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Track Title Input */}
                    <input
                      type="text"
                      placeholder={`Track ${index + 1} Title (required)`}
                      value={track.title}
                      onChange={(e) =>
                        handleUpdateTrack(track.id, { title: e.target.value })
                      }
                      className="bg-transparent text-sm text-white font-medium focus:outline-none focus:border-b focus:border-white/40 placeholder:text-neutral-500 w-full min-w-0"
                    />

                    {/* Quick Duration */}
                    <input
                      type="text"
                      placeholder="3:45"
                      value={track.duration || ''}
                      onChange={(e) =>
                        handleUpdateTrack(track.id, { duration: e.target.value })
                      }
                      className="w-16 text-center text-xs text-neutral-300 font-mono bg-white/5 border border-white/10 rounded-lg py-1 px-1.5 focus:outline-none focus:border-white/30 shrink-0"
                      title="Track Duration (e.g. 3:45)"
                    />
                  </div>

                  {/* Actions: Reorder, Expand, Delete */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                      title="Move track up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === tracks.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                      title="Move track down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTrackId(isExpanded ? null : track.id)
                      }
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer text-xs"
                      title={isExpanded ? 'Collapse track links' : 'Configure links & ISRC'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrack(track.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      title="Remove track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Spotify link, YouTube link, Apple Music link, ISRC */}
                {isExpanded && (
                  <div className="p-3.5 pt-1 border-t border-white/10 space-y-2.5 bg-black/20">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                      Individual Track Links & Metadata (Optional)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5 flex items-center space-x-1">
                          <BrandIcon platform="spotify" className="w-3 h-3 text-[#1DB954]" />
                          <span>Spotify Track URL</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://open.spotify.com/track/..."
                          value={track.spotifyUrl || ''}
                          onChange={(e) =>
                            handleUpdateTrack(track.id, { spotifyUrl: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#14141a] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#1DB954]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5 flex items-center space-x-1">
                          <BrandIcon platform="youtube" className="w-3 h-3 text-[#FF0000]" />
                          <span>YouTube Track URL</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          value={track.youtubeUrl || ''}
                          onChange={(e) =>
                            handleUpdateTrack(track.id, { youtubeUrl: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#14141a] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#FF0000]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5 flex items-center space-x-1">
                          <BrandIcon platform="appleMusic" className="w-3 h-3 text-[#FC3C44]" />
                          <span>Apple Music Track URL</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://music.apple.com/..."
                          value={track.appleMusicUrl || ''}
                          onChange={(e) =>
                            handleUpdateTrack(track.id, { appleMusicUrl: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#14141a] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#FC3C44]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5">
                          ISRC Code (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. BD-A01-26-00001"
                          value={track.isrc || ''}
                          onChange={(e) =>
                            handleUpdateTrack(track.id, { isrc: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#14141a] border border-white/10 text-white text-xs font-mono uppercase focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
