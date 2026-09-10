import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Trash2, CheckCircle2, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'portrait' | 'video' | 'banner';
  previewHeight?: string;
  placeholder?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'square',
  placeholder = 'https://...',
  helperText,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>(value.startsWith('data:') ? 'upload' : 'url');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aspect ratio class calculation
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[3/4] max-w-[200px]';
      case 'video':
        return 'aspect-video max-w-[320px]';
      case 'banner':
        return 'aspect-[21/9] max-w-[360px]';
      case 'square':
      default:
        return 'aspect-square max-w-[200px]';
    }
  };

  // Optimize and convert selected file to WebP/JPEG data URL via canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (JPEG, PNG, WebP, or GIF).');
      return;
    }

    setIsCompressing(true);
    setPreviewError(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate proportional dimensions (max width/height 1600px to ensure fast Firestore storage)
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed WebP or JPEG
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(optimizedDataUrl);
        } else {
          // Fallback to raw data url if canvas context unavailable
          onChange(e.target?.result as string);
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        setIsCompressing(false);
        alert('Could not decode image file.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsCompressing(false);
      alert('Failed to read file from disk.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
        {/* Toggle between File Upload and URL */}
        <div className="flex items-center space-x-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeMode === 'url'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Image Link
          </button>
        </div>
      </div>

      {/* Input Mode 1: Direct File Upload */}
      {activeMode === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-colors ${
            isDragOver
              ? 'border-white bg-white/10'
              : 'border-white/15 hover:border-white/30 bg-[#0c0c11]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            {isCompressing ? (
              <>
                <RefreshCw className="w-6 h-6 text-white animate-spin" />
                <span className="text-xs text-neutral-300">Optimizing image...</span>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/5 border border-white/10">
                  <Upload className="w-5 h-5 text-neutral-300" />
                </div>
                <div className="text-xs text-neutral-300 font-medium">
                  <span className="text-white font-semibold underline">Click to choose image</span> or drag &amp; drop
                </div>
                <span className="text-[10px] text-neutral-500">
                  Supports JPG, PNG, WebP · Auto-optimized for web
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Input Mode 2: Direct URL Input */}
      {activeMode === 'url' && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => {
              setPreviewError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
          />
        </div>
      )}

      {/* Instant Active Image Preview (Strictly key-bound to prevent lingering stale image) */}
      {value && value.trim() !== '' && (
        <div className="flex items-start space-x-4 pt-1">
          <div
            className={`relative rounded-xl overflow-hidden border border-white/15 bg-neutral-950 w-full ${getAspectClass()}`}
          >
            <img
              key={value} // Forces clean re-mount so old image never lingers
              src={value}
              alt="Active Preview"
              onLoad={() => setPreviewError(false)}
              onError={() => setPreviewError(true)}
              className="w-full h-full object-cover"
            />
            {previewError && (
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-2 text-center text-red-400 text-[10px]">
                <ImageIcon className="w-5 h-5 mb-1" />
                <span>Invalid image URL</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex items-center space-x-1">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-emerald-400 border border-white/10 flex items-center space-x-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Ready</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setPreviewError(false);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
            <span className="text-[10px] text-neutral-500 max-w-[200px]">
              {value.startsWith('data:') ? 'Uploaded local file' : 'Direct URL asset'}
            </span>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-neutral-500 font-light">{helperText}</p>
      )}
    </div>
  );
};
