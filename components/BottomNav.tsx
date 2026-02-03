
import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md liquid-glass rounded-[2.5rem] py-4 px-8 z-40 flex items-center justify-between shadow-[0_32px_64px_rgba(0,0,0,0.12)]">
      <NavItem to="/" icon="fa-house-chimney" label="Home" />
      <NavItem to="/add-money" icon="fa-wallet" label="Add" />
      <NavItem to="/orders" icon="fa-receipt" label="Orders" />
      <NavItem to="/profile" icon="fa-circle-user" label="Profile" />
    </div>
  );
};

const NavItem: React.FC<{ to: string, icon: string, label: string }> = ({ to, icon, label }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `flex flex-col items-center gap-1 transition-all duration-500 group relative ${isActive ? 'text-blue-600' : 'text-slate-400'}`
    }
  >
    {({ isActive }) => (
      <>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-200 text-white scale-110 -translate-y-1' : 'bg-transparent group-active:scale-90'}`}>
          <i className={`fa-solid ${icon} text-lg`}></i>
        </div>
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full"></div>
        )}
      </>
    )}
  </NavLink>
);

export default BottomNav;
