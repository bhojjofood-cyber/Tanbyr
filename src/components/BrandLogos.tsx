import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const SpotifyLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.307c-.216.354-.68.468-1.034.252-2.83-1.73-6.393-2.12-10.59-1.163-.404.093-.812-.162-.904-.566-.093-.404.162-.812.566-.904 4.593-1.049 8.528-.605 11.71 1.347.354.216.468.68.252 1.034zm1.467-3.26c-.272.443-.852.585-1.295.313-3.24-1.99-8.18-2.566-12.012-1.402-.497.151-1.026-.135-1.177-.633-.151-.498.136-1.027.633-1.178 4.382-1.33 9.818-.69 13.538 1.605.443.272.585.852.313 1.295zm.126-3.41c-3.886-2.308-10.292-2.52-13.993-1.396-.597.181-1.23-.162-1.411-.759-.181-.597.162-1.23.759-1.411 4.256-1.292 11.32-1.045 15.797 1.613.537.319.714 1.016.395 1.553-.319.537-1.016.714-1.547.4z" />
  </svg>
);

export const InstagramLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const YouTubeLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const YouTubeMusicLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.824A7.824 7.824 0 1 1 12 4.176a7.824 7.824 0 0 1 0 15.648zm0-13.648a5.824 5.824 0 1 0 0 11.648 5.824 5.824 0 0 0 0-11.648zm-2 3.824 5 3-5 3v-6z" />
  </svg>
);

export const AppleMusicLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M23.994 6.129c-.047-.79-.272-1.504-.84-2.072s-1.282-.793-2.072-.84C19.742 3.14 15.871 3 12 3s-7.742.14-9.082.217c-.79.047-1.504.272-2.072.84s-.793 1.282-.84 2.072C-.07 7.469-.21 11.34-.21 15.21c0 3.871.14 7.742.217 9.082.047.79.272 1.504.84 2.072s1.282.793 2.072.84c1.34.077 5.211.217 9.082.217 3.871 0 7.742-.14 9.082-.217.79-.047 1.504-.272 2.072-.84s.793-1.282.84-2.072c.077-1.34.217-5.211.217-9.082 0-3.871-.14-7.742-.217-9.082zM17.48 11.458l-5.632 3.253a.965.965 0 0 1-.965 0 .964.964 0 0 1-.483-.836V7.365a.966.966 0 0 1 1.448-.836l5.632 3.253a.967.967 0 0 1 0 1.676z" />
  </svg>
);

export const AppleBrandLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.66-.8 1.11-1.92.99-3.04-1 .04-2.14.65-2.82 1.45-.58.68-1.1 1.78-.96 2.87 1.11.08 2.19-.55 2.79-1.28z" />
  </svg>
);

export const FacebookLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const TikTokLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export const XTwitterLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const SoundCloudLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M1.175 12.225c-.05 0-.095.043-.1.096l-.275 2.825c-.006.056.035.105.09.11l.285.02c.05 0 .094-.043.1-.096l.275-2.825c.005-.056-.036-.105-.09-.11l-.285-.02zm1.095-.56c-.06 0-.112.046-.118.106l-.37 3.39c-.007.065.04.12.103.127l.34.026c.06 0 .11-.046.118-.106l.37-3.39c.007-.065-.04-.12-.104-.127l-.34-.025zm1.19-.57c-.07 0-.13.05-.136.12l-.44 3.96c-.008.075.048.14.122.146l.42.03c.07 0 .13-.05.137-.12l.44-3.96c.007-.075-.05-.14-.123-.146l-.42-.03zm1.25-.33c-.08 0-.147.058-.155.138l-.48 4.3c-.01.087.054.16.14.168l.48.03c.08 0 .147-.058.156-.137l.48-4.3c.01-.087-.054-.16-.14-.168l-.48-.03zm1.31-.07c-.09 0-.164.066-.173.156l-.51 4.38c-.01.098.06.18.158.188l.54.03c.09 0 .164-.066.173-.156l.51-4.38c.01-.098-.06-.18-.158-.188l-.54-.03zm1.37-.12c-.1 0-.18.074-.19.174l-.53 4.5c-.012.108.068.2.176.208l.6.03c.1 0 .182-.074.192-.174l.53-4.5c.012-.108-.068-.2-.176-.208l-.6-.03zm1.43-.22c-.11 0-.2.082-.21.192l-.54 4.72c-.013.12.076.22.195.23l.66.03c.11 0 .2-.08.21-.19l.54-4.72c.014-.12-.075-.22-.194-.23l-.66-.03zm1.5-.53c-.12 0-.218.09-.23.21l-.54 5.25c-.015.13.083.24.214.25l.72.03c.12 0 .217-.09.228-.21l.54-5.25c.014-.13-.084-.24-.214-.25l-.72-.03zm4.68-2.615c-.4 0-.79.08-1.15.22-.27.1-.51.25-.72.43l-.33 7.245c.1.01.21.02.32.02h7.68c2.14 0 3.88-1.74 3.88-3.88s-1.74-3.88-3.88-3.88c-.37 0-.73.06-1.07.16-.36-1.89-2.03-3.31-4.04-3.31-.24 0-.47.02-.7.07-.46-.77-1.3-1.29-2.26-1.29l.27 4.22z" />
  </svg>
);

export const BandcampLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" />
  </svg>
);

export const AmazonMusicLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M13.88 17.58c-4.48 2.8-9.82 1.48-12.78-.45-.24-.16-.06-.47.21-.35 3.12 1.34 8.01 1.76 11.96-.75.6-.38 1.19.26.61.66v-.11zm1.26-1.38c-.34-.45-.88-.56-1.36-.18-.18.14-.3.35-.34.57-.1.53.18 1.05.69 1.25 1.06.41 1.7-.58 1.01-1.64zm8.68 3.01c-.34-.27-.67-.54-1.02-.8-.21-.16-.38-.07-.3.17.26.79.52 1.58.78 2.37.07.21.23.23.36.07.72-.88 1.43-1.76 2.15-2.65.17-.21.08-.34-.14-.23-.61.34-1.22.7-1.83 1.07zm-7.91-11.45c-2.31 0-4.18 1.88-4.18 4.19s1.87 4.19 4.18 4.19 4.18-1.88 4.18-4.19-1.87-4.19-4.18-4.19zm0 6.64c-1.35 0-2.45-1.1-2.45-2.45s1.1-2.45 2.45-2.45 2.45 1.1 2.45 2.45-1.1 2.45-2.45 2.45z" />
  </svg>
);

export const DeezerLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M17.47 4.41h4.09v2.86h-4.09V4.41zm0 4.29h4.09v2.86h-4.09V8.7zm0 4.29h4.09v2.86h-4.09v-2.86zm0 4.29h4.09v2.86h-4.09v-2.86zM11.65 8.7h4.09v2.86h-4.09V8.7zm0 4.29h4.09v2.86h-4.09v-2.86zm0 4.29h4.09v2.86h-4.09v-2.86zM5.82 12.99h4.09v2.86H5.82v-2.86zm0 4.29h4.09v2.86H5.82v-2.86zM0 17.28h4.09v2.86H0v-2.86z" />
  </svg>
);

export const TidalLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M12 7.5L8.25 11.25 12 15l3.75-3.75L12 7.5zM4.5 11.25L.75 15 4.5 18.75 8.25 15 4.5 11.25zm7.5 7.5L8.25 15 12 11.25l3.75 3.75L12 18.75zm7.5-7.5l-3.75 3.75L19.5 18.75 23.25 15 19.5 11.25zm0-7.5L15.75 7.5 19.5 11.25 23.25 7.5 19.5 3.75z" />
  </svg>
);

export const ThreadsLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M12.186 24C5.514 24 0 18.571 0 12 0 5.429 5.514 0 12.186 0 18.771 0 24 5.343 24 12c0 2.229-.6 4.371-1.8 6.257l-1.971-1.371C21.171 15.343 21.6 13.714 21.6 12c0-5.229-4.2-9.6-9.414-9.6-5.314 0-9.686 4.371-9.686 9.6 0 5.314 4.371 9.686 9.686 9.686 3.086 0 5.914-1.543 7.629-4.029l1.971 1.371C19.714 21.943 16.114 24 12.186 24zm4.286-12.086c0-2.829-1.886-4.629-4.457-4.629-2.743 0-4.8 2.057-4.8 4.8 0 2.743 2.057 4.8 4.8 4.8 1.457 0 2.829-.686 3.6-1.8l1.629 1.457c-1.2 1.629-3.257 2.657-5.229 2.657-4.029 0-7.2-3.171-7.2-7.114 0-4.029 3.171-7.2 7.2-7.2 3.857 0 6.857 2.657 6.857 6.943 0 3.686-2.4 6.257-5.914 6.257-1.8 0-3.343-.857-4.2-2.314l1.886-1.2c.514.857 1.457 1.286 2.314 1.286 2.057 0 3.514-1.457 3.514-3.657v-1.086z" />
  </svg>
);

export const WhatsAppLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.131-.611.136-.134.301-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.628-.925-2.228-.244-.585-.492-.506-.675-.515-.175-.009-.375-.011-.575-.011s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.502s1.075 2.902 1.225 3.102c.15.2 2.115 3.23 5.124 4.531.716.31 1.275.495 1.71.634.719.229 1.373.197 1.891.12.578-.087 1.78-.727 2.03-1.429.25-.701.25-1.302.175-1.428-.075-.126-.275-.201-.575-.351zM12.042 21.788c-1.77 0-3.504-.47-5.029-1.362l-.36-.213-3.741.981.999-3.648-.234-.372c-.982-1.564-1.5-3.376-1.5-5.234 0-5.467 4.449-9.916 9.919-9.916 2.648 0 5.137 1.032 7.006 2.903s2.899 4.36 2.898 7.011c-.002 5.469-4.452 9.85-9.958 9.85zM12.042.2C5.524.2.22 5.503.218 12.025c-.001 2.085.544 4.12 1.579 5.918L0 24l6.233-1.635c1.734.945 3.687 1.444 5.807 1.445h.005c6.517 0 11.822-5.304 11.824-11.827.001-3.16-1.228-6.13-3.463-8.367C18.17 1.429 15.201.2 12.042.2z" />
  </svg>
);

export const DiscordLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={color ? { color } : undefined}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export interface BrandMeta {
  key: string;
  name: string;
  category: 'music' | 'social' | 'both';
  icon: React.ComponentType<LogoProps>;
  defaultColor: string;
  hoverBg: string;
  hoverBorder: string;
  hoverText: string;
  placeholderUrl: string;
  actionText: string;
}

export const KNOWN_BRANDS: Record<string, BrandMeta> = {
  spotify: {
    key: 'spotify',
    name: 'Spotify',
    category: 'both',
    icon: SpotifyLogo,
    defaultColor: '#1DB954',
    hoverBg: 'hover:bg-[#1DB954]/15',
    hoverBorder: 'hover:border-[#1DB954]/50',
    hoverText: 'hover:text-[#1DB954]',
    placeholderUrl: 'https://open.spotify.com/artist/...',
    actionText: 'Listen',
  },
  applemusic: {
    key: 'applemusic',
    name: 'Apple Music',
    category: 'both',
    icon: AppleMusicLogo,
    defaultColor: '#FA243C',
    hoverBg: 'hover:bg-[#FA243C]/15',
    hoverBorder: 'hover:border-[#FA243C]/50',
    hoverText: 'hover:text-[#FA243C]',
    placeholderUrl: 'https://music.apple.com/artist/...',
    actionText: 'Listen',
  },
  appleMusic: {
    key: 'appleMusic',
    name: 'Apple Music',
    category: 'both',
    icon: AppleMusicLogo,
    defaultColor: '#FA243C',
    hoverBg: 'hover:bg-[#FA243C]/15',
    hoverBorder: 'hover:border-[#FA243C]/50',
    hoverText: 'hover:text-[#FA243C]',
    placeholderUrl: 'https://music.apple.com/artist/...',
    actionText: 'Listen',
  },
  youtube: {
    key: 'youtube',
    name: 'YouTube',
    category: 'both',
    icon: YouTubeLogo,
    defaultColor: '#FF0000',
    hoverBg: 'hover:bg-[#FF0000]/15',
    hoverBorder: 'hover:border-[#FF0000]/50',
    hoverText: 'hover:text-[#FF0000]',
    placeholderUrl: 'https://youtube.com/@...',
    actionText: 'Watch',
  },
  youtubemusic: {
    key: 'youtubemusic',
    name: 'YouTube Music',
    category: 'both',
    icon: YouTubeMusicLogo,
    defaultColor: '#FF0000',
    hoverBg: 'hover:bg-[#FF0000]/15',
    hoverBorder: 'hover:border-[#FF0000]/50',
    hoverText: 'hover:text-[#FF0000]',
    placeholderUrl: 'https://music.youtube.com/search?q=...',
    actionText: 'Listen',
  },
  youtubeMusic: {
    key: 'youtubeMusic',
    name: 'YouTube Music',
    category: 'both',
    icon: YouTubeMusicLogo,
    defaultColor: '#FF0000',
    hoverBg: 'hover:bg-[#FF0000]/15',
    hoverBorder: 'hover:border-[#FF0000]/50',
    hoverText: 'hover:text-[#FF0000]',
    placeholderUrl: 'https://music.youtube.com/search?q=...',
    actionText: 'Listen',
  },
  instagram: {
    key: 'instagram',
    name: 'Instagram',
    category: 'social',
    icon: InstagramLogo,
    defaultColor: '#E1306C',
    hoverBg: 'hover:bg-[#E1306C]/15',
    hoverBorder: 'hover:border-[#E1306C]/50',
    hoverText: 'hover:text-[#E1306C]',
    placeholderUrl: 'https://instagram.com/...',
    actionText: 'Follow',
  },
  tiktok: {
    key: 'tiktok',
    name: 'TikTok',
    category: 'social',
    icon: TikTokLogo,
    defaultColor: '#00F2FE',
    hoverBg: 'hover:bg-[#00F2FE]/15',
    hoverBorder: 'hover:border-[#00F2FE]/50',
    hoverText: 'hover:text-[#00F2FE]',
    placeholderUrl: 'https://tiktok.com/@...',
    actionText: 'Follow',
  },
  facebook: {
    key: 'facebook',
    name: 'Facebook',
    category: 'social',
    icon: FacebookLogo,
    defaultColor: '#1877F2',
    hoverBg: 'hover:bg-[#1877F2]/15',
    hoverBorder: 'hover:border-[#1877F2]/50',
    hoverText: 'hover:text-[#1877F2]',
    placeholderUrl: 'https://facebook.com/...',
    actionText: 'Follow',
  },
  x: {
    key: 'x',
    name: 'X (Twitter)',
    category: 'social',
    icon: XTwitterLogo,
    defaultColor: '#FFFFFF',
    hoverBg: 'hover:bg-white/15',
    hoverBorder: 'hover:border-white/50',
    hoverText: 'hover:text-white',
    placeholderUrl: 'https://x.com/...',
    actionText: 'Follow',
  },
  twitter: {
    key: 'twitter',
    name: 'X (Twitter)',
    category: 'social',
    icon: XTwitterLogo,
    defaultColor: '#FFFFFF',
    hoverBg: 'hover:bg-white/15',
    hoverBorder: 'hover:border-white/50',
    hoverText: 'hover:text-white',
    placeholderUrl: 'https://x.com/...',
    actionText: 'Follow',
  },
  soundcloud: {
    key: 'soundcloud',
    name: 'SoundCloud',
    category: 'both',
    icon: SoundCloudLogo,
    defaultColor: '#FF5500',
    hoverBg: 'hover:bg-[#FF5500]/15',
    hoverBorder: 'hover:border-[#FF5500]/50',
    hoverText: 'hover:text-[#FF5500]',
    placeholderUrl: 'https://soundcloud.com/...',
    actionText: 'Stream',
  },
  bandcamp: {
    key: 'bandcamp',
    name: 'Bandcamp',
    category: 'both',
    icon: BandcampLogo,
    defaultColor: '#629AA9',
    hoverBg: 'hover:bg-[#629AA9]/15',
    hoverBorder: 'hover:border-[#629AA9]/50',
    hoverText: 'hover:text-[#629AA9]',
    placeholderUrl: 'https://....bandcamp.com',
    actionText: 'Buy / Stream',
  },
  amazonmusic: {
    key: 'amazonmusic',
    name: 'Amazon Music',
    category: 'music',
    icon: AmazonMusicLogo,
    defaultColor: '#00A8E1',
    hoverBg: 'hover:bg-[#00A8E1]/15',
    hoverBorder: 'hover:border-[#00A8E1]/50',
    hoverText: 'hover:text-[#00A8E1]',
    placeholderUrl: 'https://music.amazon.com/...',
    actionText: 'Listen',
  },
  amazonMusic: {
    key: 'amazonMusic',
    name: 'Amazon Music',
    category: 'music',
    icon: AmazonMusicLogo,
    defaultColor: '#00A8E1',
    hoverBg: 'hover:bg-[#00A8E1]/15',
    hoverBorder: 'hover:border-[#00A8E1]/50',
    hoverText: 'hover:text-[#00A8E1]',
    placeholderUrl: 'https://music.amazon.com/...',
    actionText: 'Listen',
  },
  deezer: {
    key: 'deezer',
    name: 'Deezer',
    category: 'music',
    icon: DeezerLogo,
    defaultColor: '#A238FF',
    hoverBg: 'hover:bg-[#A238FF]/15',
    hoverBorder: 'hover:border-[#A238FF]/50',
    hoverText: 'hover:text-[#A238FF]',
    placeholderUrl: 'https://deezer.com/...',
    actionText: 'Listen',
  },
  tidal: {
    key: 'tidal',
    name: 'Tidal',
    category: 'music',
    icon: TidalLogo,
    defaultColor: '#00FFFF',
    hoverBg: 'hover:bg-[#00FFFF]/15',
    hoverBorder: 'hover:border-[#00FFFF]/50',
    hoverText: 'hover:text-[#00FFFF]',
    placeholderUrl: 'https://tidal.com/...',
    actionText: 'Stream Hi-Fi',
  },
  threads: {
    key: 'threads',
    name: 'Threads',
    category: 'social',
    icon: ThreadsLogo,
    defaultColor: '#FFFFFF',
    hoverBg: 'hover:bg-white/15',
    hoverBorder: 'hover:border-white/50',
    hoverText: 'hover:text-white',
    placeholderUrl: 'https://threads.net/@...',
    actionText: 'Follow',
  },
  whatsapp: {
    key: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    icon: WhatsAppLogo,
    defaultColor: '#25D366',
    hoverBg: 'hover:bg-[#25D366]/15',
    hoverBorder: 'hover:border-[#25D366]/50',
    hoverText: 'hover:text-[#25D366]',
    placeholderUrl: 'https://wa.me/...',
    actionText: 'Chat',
  },
  discord: {
    key: 'discord',
    name: 'Discord',
    category: 'social',
    icon: DiscordLogo,
    defaultColor: '#5865F2',
    hoverBg: 'hover:bg-[#5865F2]/15',
    hoverBorder: 'hover:border-[#5865F2]/50',
    hoverText: 'hover:text-[#5865F2]',
    placeholderUrl: 'https://discord.gg/...',
    actionText: 'Join',
  },
};

export function getBrandMeta(keyOrName: string): BrandMeta {
  const normalized = (keyOrName || '').toLowerCase().replace(/[\s\-_]/g, '');
  if (KNOWN_BRANDS[normalized]) {
    return KNOWN_BRANDS[normalized];
  }

  // Fallback for custom or unrecognized platforms
  return {
    key: normalized || 'custom',
    name: keyOrName || 'Custom Platform',
    category: 'both',
    icon: SpotifyLogo,
    defaultColor: '#FFFFFF',
    hoverBg: 'hover:bg-white/10',
    hoverBorder: 'hover:border-white/30',
    hoverText: 'hover:text-white',
    placeholderUrl: 'https://...',
    actionText: 'Visit',
  };
}

export const BrandIcon: React.FC<{
  platform: string;
  className?: string;
  color?: string;
}> = ({ platform, className = 'w-5 h-5', color }) => {
  const meta = getBrandMeta(platform);
  const IconComponent = meta.icon;
  return <IconComponent className={className} color={color} />;
};

export const BrandLogos = BrandIcon;

export const SUPPORTED_SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', defaultPlaceholder: 'https://instagram.com/yourhandle' },
  { id: 'spotify', name: 'Spotify Profile', defaultPlaceholder: 'https://open.spotify.com/artist/...' },
  { id: 'youtube', name: 'YouTube Channel', defaultPlaceholder: 'https://youtube.com/@yourchannel' },
  { id: 'appleMusic', name: 'Apple Music Artist', defaultPlaceholder: 'https://music.apple.com/artist/...' },
  { id: 'tiktok', name: 'TikTok', defaultPlaceholder: 'https://tiktok.com/@yourhandle' },
  { id: 'facebook', name: 'Facebook Page', defaultPlaceholder: 'https://facebook.com/yourpage' },
  { id: 'x', name: 'X (Twitter)', defaultPlaceholder: 'https://x.com/yourhandle' },
  { id: 'threads', name: 'Threads', defaultPlaceholder: 'https://threads.net/@yourhandle' },
  { id: 'soundcloud', name: 'SoundCloud', defaultPlaceholder: 'https://soundcloud.com/yourhandle' },
  { id: 'bandcamp', name: 'Bandcamp', defaultPlaceholder: 'https://yourname.bandcamp.com' },
  { id: 'whatsapp', name: 'WhatsApp Channel / Link', defaultPlaceholder: 'https://wa.me/...' },
  { id: 'discord', name: 'Discord Server', defaultPlaceholder: 'https://discord.gg/...' },
  { id: 'custom', name: 'Other / Custom Platform', defaultPlaceholder: 'https://...' },
];

export const SUPPORTED_STREAMING_PLATFORMS = [
  { id: 'spotify', name: 'Spotify', actionText: 'Listen', defaultPlaceholder: 'https://open.spotify.com/track/...' },
  { id: 'appleMusic', name: 'Apple Music', actionText: 'Listen', defaultPlaceholder: 'https://music.apple.com/album/...' },
  { id: 'youtubeMusic', name: 'YouTube Music', actionText: 'Listen', defaultPlaceholder: 'https://music.youtube.com/watch?v=...' },
  { id: 'youtube', name: 'YouTube (Video)', actionText: 'Watch', defaultPlaceholder: 'https://youtube.com/watch?v=...' },
  { id: 'amazonMusic', name: 'Amazon Music', actionText: 'Stream', defaultPlaceholder: 'https://music.amazon.com/albums/...' },
  { id: 'tidal', name: 'Tidal', actionText: 'Stream Hi-Fi', defaultPlaceholder: 'https://tidal.com/browse/track/...' },
  { id: 'deezer', name: 'Deezer', actionText: 'Listen', defaultPlaceholder: 'https://deezer.com/track/...' },
  { id: 'soundcloud', name: 'SoundCloud', actionText: 'Listen', defaultPlaceholder: 'https://soundcloud.com/...' },
  { id: 'bandcamp', name: 'Bandcamp', actionText: 'Buy / Listen', defaultPlaceholder: 'https://....bandcamp.com/track/...' },
  { id: 'custom', name: 'Other Platform', actionText: 'Listen', defaultPlaceholder: 'https://...' },
];
