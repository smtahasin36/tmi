
import React, { useState } from 'react';
import { DB } from '../../db';
import { Game } from '../../types';
import LoadingModal from '../../components/LoadingModal';

const AdminGames: React.FC = () => {
    const [games, setGames] = useState<Game[]>(DB.getGames());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Game>>({ name: '', type: 'uid', description: '', image: 'https://picsum.photos/400/300' });
    const [editId, setEditId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        if (!formData.name) return;
        setLoading(true);

        setTimeout(() => {
            const newGame: Game = {
                id: editId || Math.random().toString(36).substr(2, 9),
                name: formData.name!,
                type: formData.type as 'uid' | 'voucher',
                description: formData.description || '',
                image: formData.image || 'https://picsum.photos/400/300',
            };

            const updated = editId ? games.map(g => g.id === editId ? newGame : g) : [...games, newGame];
            setGames(updated);
            DB.saveGames(updated);
            setLoading(false);
            setIsModalOpen(false);
            setEditId(null);
            setFormData({ name: '', type: 'uid', description: '', image: 'https://picsum.photos/400/300' });
        }, 800);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure?')) return;
        setLoading(true);
        setTimeout(() => {
            const updated = games.filter(g => g.id !== id);
            setGames(updated);
            DB.saveGames(updated);
            setLoading(false);
        }, 500);
    };

    return (
        <div className="space-y-6">
            <LoadingModal isOpen={loading} message="Updating System..." />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 italic uppercase">Game Management</h1>
                    <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Configure Game Categories</p>
                </div>
                <button 
                    onClick={() => { setEditId(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                    ADD NEW GAME
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map(game => (
                    <div key={game.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 group relative">
                        <div className="flex items-center gap-4">
                            <img src={game.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt="" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-slate-800 uppercase tracking-tight truncate">{game.name}</h3>
                                <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit uppercase mb-2">
                                    {game.type} Topup
                                </p>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditId(game.id); setFormData(game); setIsModalOpen(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button onClick={() => handleDelete(game.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 transition-colors">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-fadeIn">
                        <h3 className="text-xl font-black text-slate-800 italic uppercase mb-6">{editId ? 'Edit Game' : 'Add New Game'}</h3>
                        <div className="space-y-4">
                            <input 
                                placeholder="Game Name"
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            <select 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 appearance-none"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as any})}
                            >
                                <option value="uid">UID Top Up</option>
                                <option value="voucher">Unipin Voucher</option>
                            </select>
                            <input 
                                placeholder="Image URL"
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                            />
                            <textarea 
                                placeholder="Description"
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 h-24"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                            <button 
                                onClick={handleSave}
                                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all"
                            >
                                {editId ? 'UPDATE SYSTEM' : 'ADD TO STORE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGames;
