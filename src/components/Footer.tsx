import React from 'react';
import { SocialLinks } from '../types';
import { SocialIcons } from './SocialIcons';

interface FooterProps {
  socials?: SocialLinks | null;
}

export const Footer: React.FC<FooterProps> = ({ socials }) => {
  return (
    <footer id="main-footer" className="bg-[#050507] border-t border-white/5 py-16 px-6 sm:px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Artist Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src="https://i.postimg.cc/CKrv9H4g/file-00000000de7c8208b034011622efe4bc.png"
            alt="TANBYR"
            className="h-10 sm:h-12 w-auto max-w-[220px] object-contain mb-3 filter brightness-105"
            referrerPolicy="no-referrer"
          />
          <span className="text-xs tracking-[0.25em] uppercase text-neutral-400 block font-medium">
            Official Artist Website
          </span>
        </div>

        {/* Dynamic Social Icons & Links */}
        {socials && (
          <div className="mb-10 flex flex-col items-center">
            <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-4 font-semibold">
              Connect &middot; Stream &middot; Follow
            </span>
            <SocialIcons socials={socials} variant="footer" />
          </div>
        )}

        {/* Divider */}
        <div className="w-12 h-[1px] bg-white/10 mb-8" />

        {/* Copyright & Tag */}
        <p className="text-xs tracking-[0.15em] text-neutral-400">
          &copy; 2026 TANBYR. All Rights Reserved. &middot; #Banglapop
        </p>
      </div>
    </footer>
  );
};
