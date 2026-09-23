import React from 'react';
import { MusicVideo, SocialLinks } from '../types';
import { VideoCard } from '../components/VideoCard';
import { Film, Bell } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { YouTubeLogo } from '../components/BrandLogos';

interface VideosPageProps {
  videos: MusicVideo[];
  onPlayVideo: (video: MusicVideo) => void;
  socials?: SocialLinks;
}

export const VideosPage: React.FC<VideosPageProps> = ({ videos, onPlayVideo, socials }) => {
  const youtubeUrl = socials?.youtube
    ? (socials.youtube.includes('sub_confirmation')
        ? socials.youtube
        : `${socials.youtube}${socials.youtube.includes('?') ? '&' : '?'}sub_confirmation=1`)
    : 'https://youtube.com/@tanbyrmusic?sub_confirmation=1';

  return (
    <div className="pt-32 pb-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Page Header with Scroll Reveal */}
      <ScrollReveal direction="up" distance={25}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase block mb-3">
            Videography
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase mb-6">
            Music Videos
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-6">
            Official music videos, visualizers, and acoustic live studio sessions.
          </p>
          <div className="flex justify-center">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FF0000] hover:bg-[#cc0000] text-white font-extrabold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-[#FF0000]/25 hover:scale-105 cursor-pointer"
            >
              <YouTubeLogo className="w-4 h-4" />
              <span>SUBSCRIBE ON YOUTUBE</span>
              <Bell className="w-3.5 h-3.5 opacity-90" />
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, idx) => (
            <ScrollReveal key={video.id} direction="up" distance={30} delay={(idx % 3) * 0.12}>
              <VideoCard video={video} onPlay={onPlayVideo} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-white/5 rounded-3xl bg-[#0a0a0e] p-8">
          <Film className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
            No Videos Found
          </h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Music videos will appear here once released.
          </p>
        </div>
      )}
    </div>
  );
};
