import React, { useState, useEffect } from 'react';
import { User, Music, Camera, Image as ImageIcon } from 'lucide-react';

interface SmartImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  showSpinner?: boolean;
  fallbackType?: 'profile' | 'hero' | 'artwork' | 'photo' | 'generic';
  fallbackText?: string;
  onClick?: () => void;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  showSpinner,
  fallbackType = 'generic',
  fallbackText,
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Disable intrusive spinner by default for hero banners or priority images
  const shouldShowSpinner =
    showSpinner !== undefined
      ? showSpinner
      : !priority && fallbackType !== 'hero';

  // When src changes, immediately reset loaded state so stale image doesn't linger
  useEffect(() => {
    if (!src || typeof src !== 'string' || src.trim() === '') {
      setLoaded(false);
      setError(true);
      return;
    }
    setLoaded(false);
    setError(false);
  }, [src]);

  const hasValidSrc = Boolean(src && typeof src === 'string' && src.trim() !== '');

  // Render fallback placeholder when there's no src or image failed to load
  const renderFallback = () => {
    if (fallbackType === 'hero') {
      return (
        <div className="w-full h-full bg-gradient-to-b from-[#09090e] via-[#101017] to-[#070709] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle atmospheric ambient glow */}
          <div className="absolute w-96 h-96 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center space-y-3 px-6 text-center opacity-40">
            <span className="text-3xl sm:text-5xl font-black tracking-[0.3em] text-white/50 uppercase">
              TANBYR
            </span>
          </div>
        </div>
      );
    }

    if (fallbackType === 'profile') {
      return (
        <div className="w-full h-full bg-[#0c0c11] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-neutral-400" />
          </div>
          <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
            {fallbackText || 'TANBYR'}
          </span>
          <span className="text-[10px] tracking-wider text-neutral-500 uppercase mt-0.5">
            Official Portrait
          </span>
        </div>
      );
    }

    if (fallbackType === 'artwork') {
      return (
        <div className="w-full h-full bg-[#0b0b0f] border border-white/10 flex flex-col items-center justify-center p-4 text-center">
          <Music className="w-8 h-8 text-neutral-500 mb-2" />
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase line-clamp-1">
            {fallbackText || 'Music Release'}
          </span>
        </div>
      );
    }

    if (fallbackType === 'photo') {
      return (
        <div className="w-full h-full bg-[#0c0c11] border border-white/10 flex flex-col items-center justify-center p-4 text-center">
          <Camera className="w-7 h-7 text-neutral-500 mb-2" />
          <span className="text-[11px] font-medium tracking-wider text-neutral-400 line-clamp-1">
            {fallbackText || 'Photograph'}
          </span>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-neutral-900 border border-white/10 flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-neutral-600" />
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden ${containerClassName} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Shimmer / Skeleton Placeholder while downloading new image (disabled for hero/priority) */}
      {hasValidSrc && !loaded && !error && shouldShowSpinner && (
        <div className="absolute inset-0 z-10 bg-neutral-900/60 flex items-center justify-center animate-pulse">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
        </div>
      )}

      {/* Fallback View if invalid URL or loading error */}
      {(!hasValidSrc || error) ? (
        renderFallback()
      ) : (
        <img
          key={src} // Forcing key ensures DOM node recreation, completely preventing stale bitmap lingering
          ref={(node) => {
            // If already cached in browser, immediately mark as loaded without flash
            if (node && node.complete && node.naturalWidth > 0 && !loaded) {
              setLoaded(true);
            }
          }}
          src={hasValidSrc && src ? src : undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => {
            setLoaded(true);
            setError(false);
          }}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
          className={`${className} transition-opacity ${priority ? 'duration-300' : 'duration-500'} ease-out ${
            loaded ? 'opacity-100' : priority ? 'opacity-90' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
