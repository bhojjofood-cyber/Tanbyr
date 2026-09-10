import React, { useEffect } from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoLightboxProps {
  photo: PhotoItem | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photo, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (photo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      id="photo-lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        id="close-lightbox-btn"
        onClick={onClose}
        className="absolute top-6 right-6 p-3 text-neutral-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
        aria-label="Close photo preview"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        id="lightbox-container"
        className="max-w-5xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={photo.imageUrl}
          src={photo.imageUrl}
          alt={photo.caption || 'TANBYR Photography'}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
        />

        <div className="mt-4 text-center max-w-xl">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wider uppercase bg-white/10 text-neutral-300">
              <Tag className="w-3 h-3" />
              <span>{photo.category}</span>
            </span>
            {photo.date && (
              <span className="inline-flex items-center space-x-1.5 text-xs text-neutral-400">
                <Calendar className="w-3 h-3" />
                <span>{photo.date}</span>
              </span>
            )}
          </div>
          {photo.caption && (
            <p className="text-sm text-neutral-200 font-light tracking-wide">
              {photo.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
