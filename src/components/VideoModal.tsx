import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  title: string;
  onClose: () => void;
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  try {
    // Handle standard watch url
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    // Handle youtu.be shortlinks
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    // Handle embed url
    if (url.includes('youtube.com/embed/')) {
      return `${url}?autoplay=1&rel=0`;
    }
  } catch {
    return url;
  }
  return url;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoUrl,
  title,
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

  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div
      id="video-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="video-modal-dialog"
        className="relative w-full max-w-5xl bg-[#0d0d11] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090c]">
          <h3 className="text-sm font-semibold tracking-wider text-neutral-200 uppercase truncate pr-4">
            {title}
          </h3>
          <button
            id="close-video-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Video Frame */}
        <div className="relative w-full pb-[56.25%] bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
              Video source unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
