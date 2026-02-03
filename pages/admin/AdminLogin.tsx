
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded admin as per request
        if (username === 'mraiprime' && password === 'khfmhf2007') {
            localStorage.setItem('tmi_admin_session', 'active');
            navigate('/sm/index');
        } else {
            alert('Invalid admin credentials');
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-xl shadow-blue-500/30">
                        <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">ADMIN CONTROL</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Authorized Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Username</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none transition-all"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all mt-4">
                        SYSTEM ACCESS
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
