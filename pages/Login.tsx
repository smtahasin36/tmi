
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DB } from '../db';
import { User } from '../types';
import LoadingModal from '../components/LoadingModal';

const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
        const users = DB.getUsers();
        if (isLogin) {
            const user = users.find(u => u.phone === formData.phone && u.password === formData.password);
            if (user) {
                DB.setCurrentUser(user);
                onLogin(user);
                navigate('/');
            } else {
                alert('Invalid phone or password');
            }
        } else {
            if (users.some(u => u.phone === formData.phone)) {
                alert('Phone number already exists');
            } else {
                const newUser: User = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                    balance: 0,
                    totalSpent: 0,
                    weeklySpent: 0,
                    role: 'user'
                };
                DB.saveUsers([...users, newUser]);
                DB.setCurrentUser(newUser);
                onLogin(newUser);
                navigate('/');
            }
        }
        setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 relative">
      <LoadingModal isOpen={loading} message={isLogin ? "Verifying Identity" : "Provisioning Account"} />
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 blur-[100px] rounded-full animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 blur-[120px] rounded-full animate-float" style={{animationDelay: '-3s'}}></div>

      <div className="w-full max-w-md liquid-glass rounded-[3.5rem] p-10 shadow-2xl relative z-10 border-4 border-white/50 animate-liquid">
        <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white text-4xl mb-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)] rotate-3 animate-float">
                <i className="fa-solid fa-bolt-auto text-blue-400"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">THE SYSTEM</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em] mt-2">Authentication Required</p>
        </div>

        <div className="flex bg-slate-100/50 p-1.5 rounded-[2rem] mb-10 border border-slate-200">
            <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${isLogin ? 'bg-white shadow-xl text-blue-600 scale-100' : 'text-slate-400'}`}
            >
                Login
            </button>
            <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${!isLogin ? 'bg-white shadow-xl text-blue-600 scale-100' : 'text-slate-400'}`}
            >
                Register
            </button>
        </div>

        <form onSubmit={handleAction} className="space-y-5">
            {!isLogin && (
                <div className="relative group">
                    <input 
                        required
                        type="text" 
                        placeholder="NAME"
                        className="w-full bg-white/50 border-2 border-transparent focus:border-blue-600/30 rounded-2xl px-6 py-5 font-black text-slate-800 placeholder:text-slate-300 transition-all outline-none text-xs"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
            )}
            <div className="relative group">
                <input 
                    required
                    type="tel" 
                    placeholder="PHONE NUMBER"
                    className="w-full bg-white/50 border-2 border-transparent focus:border-blue-600/30 rounded-2xl px-6 py-5 font-black text-slate-800 placeholder:text-slate-300 transition-all outline-none text-xs"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                />
            </div>
            {!isLogin && (
                <div className="relative group">
                    <input 
                        required
                        type="email" 
                        placeholder="EMAIL"
                        className="w-full bg-white/50 border-2 border-transparent focus:border-blue-600/30 rounded-2xl px-6 py-5 font-black text-slate-800 placeholder:text-slate-300 transition-all outline-none text-xs"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
            )}
            <div className="relative group">
                <input 
                    required
                    type="password" 
                    placeholder="PASSWORD"
                    className="w-full bg-white/50 border-2 border-transparent focus:border-blue-600/30 rounded-2xl px-6 py-5 font-black text-slate-800 placeholder:text-slate-300 transition-all outline-none text-xs"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full liquid-btn bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-[0_24px_48px_rgba(0,0,0,0.2)] active:scale-95 transition-all mt-6"
            >
                {isLogin ? 'Execute Entry' : 'Create Identity'}
            </button>
        </form>

        <p className="text-center text-[9px] text-slate-400 font-bold mt-10 uppercase tracking-[0.3em] leading-loose">
            By connecting you agree to the <span className="text-blue-600 border-b border-blue-600/30">System Protocol</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
