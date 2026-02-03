
import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, message = "Processing" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-8">
      {/* Frosted Liquid Backdrop */}
      <div className="absolute inset-0 bg-slate-100/30 backdrop-blur-[30px] transition-opacity duration-700"></div>
      
      {/* Liquid Modal Box */}
      <div className="relative liquid-glass p-12 rounded-[4rem] shadow-[0_64px_128px_rgba(0,0,0,0.15)] flex flex-col items-center gap-8 border-4 border-white/50 animate-liquid">
        {/* Organic Organic Animation */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="flex items-center justify-center h-full gap-2">
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                className="w-3 h-10 bg-blue-600 rounded-full animate-bounce" 
                style={{ animationDelay: `${i * 0.1}s`, opacity: 1 - (i * 0.2) }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-[0.4em] italic leading-tight">{message}</h4>
            <div className="flex items-center justify-center gap-2 mt-3">
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Establishing Socket</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
