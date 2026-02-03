
import React from 'react';
import { SiteSettings } from '../types';

const FAB: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  return (
    <a 
      href={settings.fabLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse-custom group"
    >
      <i className="fa-brands fa-whatsapp text-3xl group-hover:rotate-12"></i>
      <span className="absolute -top-12 right-0 bg-white text-gray-800 text-xs py-1 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none">
        Chat with Us!
      </span>
    </a>
  );
};

export default FAB;
