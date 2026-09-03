import React, { useState, useMemo } from 'react';
import { PhotoItem } from '../types';
import { Camera, Calendar, Tag, Maximize2 } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface PhotosPageProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const PhotosPage: React.FC<PhotosPageProps> = ({ photos, onSelectPhoto }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Extract all available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    photos.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'ALL') return photos;
    return photos.filter((p) => p.category === selectedCategory);
  }, [photos, selectedCategory]);

  return (
    <div className="pt-32 pb-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Header with Scroll Reveal */}
      <ScrollReveal direction="up" distance={25}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase block mb-3">
            Gallery
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase mb-6">
            Photography
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            Editorial portraits, live performance frames, and candid studio memories.
          </p>
        </div>
      </ScrollReveal>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'ALL' ? 'All Photographs' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Photos Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <ScrollReveal key={photo.id} direction="up" distance={25} delay={(idx % 3) * 0.1}>
              <div
                onClick={() => onSelectPhoto(photo)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer shadow-lg aspect-[4/5]"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'TANBYR Photography'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-[10px] text-neutral-400 uppercase font-semibold tracking-wider mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white">
                        {photo.category}
                      </span>
                      {photo.date && <span>{photo.date}</span>}
                    </div>
                    {photo.caption && (
                      <p className="text-sm font-medium text-white line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>

                {photo.featured && (
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-white/5 rounded-3xl bg-[#0a0a0e] p-8">
          <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
            No Photos in this Category
          </h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Try choosing another category or view all photographs.
          </p>
        </div>
      )}
    </div>
  );
};
