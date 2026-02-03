
import React from 'react';
import { User } from '../types';
import { DB } from '../db';
import { Link } from 'react-router-dom';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const userOrders = DB.getOrders().filter(o => o.userId === user.id);

  return (
    <div className="p-4 space-y-8 animate-fadeInUp pb-32">
      {/* Executive Profile Header */}
      <div className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden text-white">
        <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-5xl font-black shadow-2xl ring-4 ring-white/10">
                    {user.name[0]}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-10 h-10 rounded-full border-4 border-slate-900 flex items-center justify-center text-white text-xs">
                    <i className="fa-solid fa-check"></i>
                </div>
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tight">{user.name}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">{user.phone}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full mt-10">
            <HeaderStat label="Balance" value={`৳${user.balance}`} />
            <HeaderStat label="Spent" value={`৳${user.totalSpent}`} />
        </div>

        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Modern Dashboard Stats */}
      <div className="grid grid-cols-2 gap-4">
        <DashboardCard icon="fa-receipt" label="Total Orders" value={userOrders.length} color="text-amber-500" />
        <DashboardCard icon="fa-shield" label="Trust Score" value="A+" color="text-emerald-500" />
      </div>

      {/* Menu List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6 mb-2">Account Control</h3>
        <ProfileMenuItem to="/add-money" icon="fa-plus" label="Add Balance" />
        <ProfileMenuItem to="/orders" icon="fa-history" label="My Order History" />
        <ProfileMenuItem to="/my-codes" icon="fa-key" label="Active Vouchers" />
        <ProfileMenuItem to="#" icon="fa-lock" label="Account Security" />
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-6 rounded-3xl bg-red-50 text-red-600 font-black uppercase text-xs tracking-[0.3em] border-2 border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
      >
        Sign Out System
      </button>

      {/* Support Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase opacity-80 mb-1">24/7 ASSISTANCE</p>
            <h4 className="text-xl font-black italic uppercase">Pro Support</h4>
            <p className="text-[10px] mt-2 max-w-[150px] leading-relaxed font-bold">Having issues? Connect with our team instantly.</p>
        </div>
        <button className="relative z-10 w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl hover:bg-white hover:text-blue-600 transition-all active:scale-90">
            <i className="fa-solid fa-headset"></i>
        </button>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

const HeaderStat: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] text-center backdrop-blur-md">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black">{value}</p>
    </div>
);

const DashboardCard: React.FC<{ icon: string, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm text-center">
        <i className={`fa-solid ${icon} ${color} text-2xl mb-3`}></i>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-slate-800 uppercase italic">{value}</p>
    </div>
);

const ProfileMenuItem: React.FC<{ to: string, icon: string, label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="flex items-center justify-between p-6 bg-white rounded-[1.5rem] border border-slate-50 shadow-sm group hover:border-blue-200 transition-all">
        <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <i className={`fa-solid ${icon} text-lg`}></i>
            </div>
            <span className="font-black text-slate-800 uppercase text-xs tracking-widest">{label}</span>
        </div>
        <i className="fa-solid fa-chevron-right text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
    </Link>
);

export default Profile;
