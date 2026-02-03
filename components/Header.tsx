
import React from 'react';
import { User, SiteSettings } from '../types';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  user: User | null;
  settings: SiteSettings;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, settings, onMenuClick }) => {
  const navigate = useNavigate();
  const siteName = settings?.siteName || 'Tmi Top Up';

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {settings?.marqueeStatus && (
          <div className="liquid-glass rounded-2xl py-2 px-4 overflow-hidden border-none shadow-sm">
            <div className="marquee-content text-[10px] font-bold text-blue-600/80 uppercase tracking-widest">
              {settings.marqueeText}
            </div>
          </div>
        )}
        
        <div className="liquid-glass rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick} 
              className="w-10 h-10 rounded-full bg-slate-100/50 flex items-center justify-center text-slate-600 active:scale-90 transition-all"
            >
              <i className="fa-solid fa-grid-2"></i>
            </button>
            <Link to="/" className="text-xl font-black text-slate-800 italic tracking-tighter">
              {siteName.split(' ')[0]}<span className="text-blue-600">UP</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => navigate('/add-money')} 
                  className="bg-blue-600 px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-plus-circle text-white/80 text-xs"></i>
                  <span className="text-sm font-black text-white">{settings?.currencySymbol || '৳'}{user.balance}</span>
                </div>
                <Link to="/profile">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                     <div className="w-full h-full bg-slate-200 flex items-center justify-center font-black text-slate-400">
                        {user.name[0]}
                     </div>
                  </div>
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Enter
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
