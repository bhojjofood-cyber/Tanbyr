import React from 'react';
import { Play, Calendar } from 'lucide-react';
import { MusicVideo } from '../types';
import { SmartImage } from './SmartImage';

interface VideoCardProps {
  video: MusicVideo;
  onPlay: (video: MusicVideo) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  return (
    <div
      id={`video-card-${video.id}`}
      className="group bg-[#0d0d11] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-500 cursor-pointer flex flex-col justify-between"
      onClick={() => onPlay(video)}
    >
      <div>
        {/* 16:9 Thumbnail with Play Overlay */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
          <SmartImage
            key={video.thumbnailUrl || video.id}
            src={video.thumbnailUrl}
            alt={video.title}
            fallbackType="artwork"
            fallbackText={video.title}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-xl">
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            </div>
          </div>

          {video.featured && (
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white text-black">
                Featured Video
              </span>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-6">
          <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-2">
            {video.releaseDate && (
              <span className="inline-flex items-center space-x-1 tracking-wider uppercase font-medium">
                <Calendar className="w-3 h-3 text-neutral-400" />
                <span>{video.releaseDate}</span>
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold tracking-wide text-white uppercase group-hover:text-neutral-200 transition-colors line-clamp-1">
            {video.title}
          </h3>

          {video.description && (
            <p className="mt-2 text-sm text-neutral-400 font-light leading-relaxed line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
        <span className="tracking-wider uppercase text-[11px] font-medium">Watch Music Video</span>
        <span className="tracking-widest">&rarr;</span>
      </div>
    </div>
  );
};
