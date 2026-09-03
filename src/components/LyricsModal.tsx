import React, { useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { MusicRelease } from '../types';

interface LyricsModalProps {
  isOpen: boolean;
  release: MusicRelease | null;
  onClose: () => void;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({
  isOpen,
  release,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !release) return null;

  return (
    <div
      id="lyrics-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        id="lyrics-modal-dialog"
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#0c0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#08080a]">
          <div className="flex items-center space-x-3">
            <FileText className="w-4 h-4 text-neutral-400" />
            <div>
              <h3 className="text-base font-bold tracking-wider text-white uppercase">
                {release.title}
              </h3>
              <p className="text-xs text-neutral-400 tracking-wider uppercase">
                Lyrics & Credits · {release.type}
              </p>
            </div>
          </div>
          <button
            id="close-lyrics-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-neutral-300">
          {release.lyricsText ? (
            <div>
              <h4 className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                Song Lyrics
              </h4>
              <pre className="font-sans whitespace-pre-wrap leading-relaxed text-sm sm:text-base text-neutral-200">
                {release.lyricsText}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-neutral-400 italic">
              Lyrics are currently being transcribed for this release.
            </p>
          )}

          {release.credits && (
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-2">
                Production Credits
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {release.credits}
              </p>
            </div>
          )}

          {release.lyricsUrl && release.lyricsUrl !== '#' && (
            <div className="pt-2">
              <a
                href={release.lyricsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider uppercase text-white underline underline-offset-4 hover:text-neutral-300"
              >
                View Full Verified Lyrics / Chord Sheet &rarr;
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
