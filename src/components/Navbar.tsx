import React, { useState, useEffect } from 'react';
import { Menu, X, Disc3 } from 'lucide-react';
import { SocialLinks } from '../types';
import { SocialIcons } from './SocialIcons';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  socials?: SocialLinks | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, socials }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'MUSIC', path: '/music' },
    { label: 'VIDEOS', path: '/videos' },
    { label: 'PHOTOS', path: '/photos' },
    { label: 'ABOUT', path: '/about' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#070709]/90 backdrop-blur-md border-b border-white/5 py-3 sm:py-3.5'
          : 'bg-transparent py-4 sm:py-5 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-logo"
          onClick={() => handleLinkClick('/')}
          aria-label="TANBYR Official Home"
          className="flex items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 py-1"
        >
          <img
            src="https://i.postimg.cc/CKrv9H4g/file-00000000de7c8208b034011622efe4bc.png"
            alt="TANBYR"
            className={`${
              isScrolled
                ? 'h-10 sm:h-12 md:h-14 lg:h-16 max-w-[220px] sm:max-w-[280px] md:max-w-[340px]'
                : 'h-12 sm:h-14 md:h-16 lg:h-20 max-w-[260px] sm:max-w-[340px] md:max-w-[420px]'
            } w-auto object-contain filter brightness-110 drop-shadow-sm group-hover:opacity-95 group-hover:scale-[1.03] transition-all duration-300`}
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                id={`nav-link-${item.label.toLowerCase()}`}
                onClick={() => handleLinkClick(item.path)}
                className={`text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTA & Social Icons */}
        <div className="hidden md:flex items-center space-x-5">
          {socials && <SocialIcons socials={socials} variant="navbar" />}

          <button
            id="nav-listen-cta"
            onClick={() => handleLinkClick('/music')}
            className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 rounded-full text-white cursor-pointer"
          >
            <Disc3 className="w-3.5 h-3.5 animate-[spin_6s_linear_infinite]" />
            <span>LISTEN</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            id="mobile-listen-cta"
            onClick={() => handleLinkClick('/music')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase border border-white/20 bg-white/5 rounded-full text-white cursor-pointer"
          >
            <Disc3 className="w-3 h-3" />
            <span>LISTEN</span>
          </button>
          
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden fixed inset-x-0 top-full bg-[#09090c]/98 backdrop-blur-xl border-b border-white/10 px-6 py-8 shadow-2xl transition-all duration-300"
        >
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  id={`mobile-link-${item.label.toLowerCase()}`}
                  onClick={() => handleLinkClick(item.path)}
                  className={`text-left text-base font-medium tracking-[0.2em] uppercase py-2 transition-colors cursor-pointer flex items-center justify-between ${
                    isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}

            {/* Mobile Social Links */}
            {socials && (
              <div className="pt-2">
                <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-3 font-semibold">
                  Official Channels
                </span>
                <SocialIcons socials={socials} variant="drawer" />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
