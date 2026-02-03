
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Game, Slider, SiteSettings } from '../types';
import { Link } from 'react-router-dom';

const Home: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  const [games, setGames] = useState<Game[]>(DB.getGames());
  const [sliders, setSliders] = useState<Slider[]>(DB.getSliders());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  return (
    <div className="px-4 py-2 space-y-10 animate-liquid pb-32">
      {/* Liquid Slider */}
      <div className="relative overflow-hidden rounded-[3rem] shadow-[0_24px_48px_rgba(0,0,0,0.1)] aspect-[16/8] bg-slate-200 border-4 border-white">
        {sliders.map((slider, idx) => (
          <div 
            key={slider.id}
            className={`absolute inset-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) transform ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 translate-x-full'}`}
          >
            <img src={slider.image} alt="Promotion" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
        ))}
        <div className="absolute bottom-6 w-full flex justify-center gap-2.5">
          {sliders.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-10 bg-white' : 'w-1.5 bg-white/40'}`} 
            />
          ))}
        </div>
      </div>

      {/* Featured Grid */}
      <section>
        <div className="flex flex-col mb-8 px-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
            POPULAR <span className="text-blue-600">TOP-UPS</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Verified Digital Assets</p>
        </div>
        
        <div className="grid grid-cols-2 gap-5 px-2">
          {games.map(game => (
            <Link key={game.id} to={`/game/${game.id}`} className="group relative">
              <div className="liquid-glass rounded-[2.5rem] overflow-hidden p-2 transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl">
                <div className="aspect-square rounded-[2rem] overflow-hidden relative shadow-inner">
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                     <h3 className="font-black text-white text-sm uppercase italic leading-tight truncate">{game.name}</h3>
                     <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">Active Store</span>
                     </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Mesh Feature Card */}
      <section className="px-2">
        <div className="liquid-glass-dark rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                    <i className="fa-solid fa-crown text-amber-400"></i>
                 </div>
                 <div>
                    <h4 className="font-black text-lg italic uppercase tracking-tight">Elite Membership</h4>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Unlock VIP pricing</p>
                 </div>
              </div>
              <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-white/5 active:scale-95 transition-all">
                JOIN THE SYSTEM
              </button>
           </div>
           <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/30 blur-[100px] rounded-full"></div>
           <div className="absolute -left-20 -top-20 w-48 h-48 bg-purple-600/20 blur-[80px] rounded-full"></div>
        </div>
      </section>

      {/* Footer refined */}
      <footer className="pt-10 pb-20 px-6 space-y-10">
        <div className="flex justify-center gap-4">
           {['fa-discord', 'fa-twitter', 'fa-instagram', 'fa-youtube'].map(icon => (
             <div key={icon} className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all cursor-pointer">
                <i className={`fa-brands ${icon} text-lg`}></i>
             </div>
           ))}
        </div>
        <div className="text-center space-y-4">
            <h5 className="text-xs font-black text-slate-800 uppercase tracking-[0.5em]">{settings.siteName}</h5>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {['TOS', 'PRIVACY', 'REFUND', 'HELP'].map(link => (
                    <span key={link} className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-transparent hover:border-slate-300 cursor-pointer">{link}</span>
                ))}
            </div>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest pt-6 border-t border-slate-100">
                PROUDLY POWERED BY TMI ECOSYSTEM V2.6
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
