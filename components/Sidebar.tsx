
import React from 'react';
import { User } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <i className="fa-solid fa-gamepad text-2xl"></i>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-white/80 hover:text-white">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>
          {user ? (
            <div>
              <h3 className="text-lg font-bold">{user.name}</h3>
              <p className="text-sm text-blue-100">{user.phone}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold">Welcome, Guest</h3>
              <p className="text-sm text-blue-100">Login to your account</p>
            </div>
          )}
        </div>

        <nav className="p-4 space-y-1">
          <SidebarLink icon="fa-house" label="Home" to="/" onClick={onClose} />
          <SidebarLink icon="fa-wallet" label="Add Money" to="/add-money" onClick={onClose} />
          <SidebarLink icon="fa-clock-rotate-left" label="My Orders" to="/orders" onClick={onClose} />
          <SidebarLink icon="fa-ticket" label="My Codes" to="/my-codes" onClick={onClose} />
          <SidebarLink icon="fa-user-gear" label="Profile" to="/profile" onClick={onClose} />
          <hr className="my-4 border-gray-100" />
          <SidebarLink icon="fa-circle-info" label="About Us" to="#" onClick={onClose} />
          <SidebarLink icon="fa-headset" label="Support" to="#" onClick={onClose} />
          {user && (
             <button 
                onClick={() => { localStorage.removeItem('tmi_current_user'); window.location.reload(); }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
             >
                <i className="fa-solid fa-right-from-bracket w-6"></i>
                <span className="font-medium">Logout</span>
             </button>
          )}
        </nav>
      </aside>
    </>
  );
};

const SidebarLink: React.FC<{ icon: string, label: string, to: string, onClick: () => void }> = ({ icon, label, to, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all active:scale-95"
  >
    <i className={`fa-solid ${icon} w-6 text-lg`}></i>
    <span className="font-medium">{label}</span>
  </Link>
);

export default Sidebar;
