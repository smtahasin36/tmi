
import React, { useState } from 'react';
import { DB } from '../../db';
import { Product, Game } from '../../types';

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(DB.getProducts());
    const [games] = useState<Game[]>(DB.getGames());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({ gameId: games[0]?.id || '', name: '', price: 0 });
    const [editId, setEditId] = useState<string | null>(null);

    const handleSave = () => {
        if (!formData.name || !formData.gameId) return;
        const newProduct: Product = {
            id: editId || Math.random().toString(36).substr(2, 9),
            gameId: formData.gameId!,
            name: formData.name!,
            price: Number(formData.price),
        };

        const updated = editId ? products.map(p => p.id === editId ? newProduct : p) : [...products, newProduct];
        setProducts(updated);
        DB.saveProducts(updated);
        setIsModalOpen(false);
        setEditId(null);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this recharge package?')) return;
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        DB.saveProducts(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 italic uppercase">Recharge Packages</h1>
                    <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Manage Items & Prices</p>
                </div>
                <button 
                    onClick={() => { setEditId(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest shadow-xl"
                >
                    ADD RECHARGE
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">Game</th>
                            <th className="px-6 py-4">Package Name</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {products.map(p => (
                            <tr key={p.id} className="text-sm">
                                <td className="px-6 py-4 font-black text-blue-600 italic">
                                    {games.find(g => g.id === p.gameId)?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                                <td className="px-6 py-4 font-black">৳{p.price}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditId(p.id); setFormData(p); setIsModalOpen(true); }} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center">
                                            <i className="fa-solid fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 transition-all flex items-center justify-center">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 italic uppercase mb-6">{editId ? 'Edit Package' : 'New Package'}</h3>
                        <div className="space-y-4">
                            <select 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 appearance-none"
                                value={formData.gameId}
                                onChange={e => setFormData({...formData, gameId: e.target.value})}
                            >
                                {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                            <input 
                                placeholder="Package Name (e.g. 100 Diamonds)"
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="number"
                                placeholder="Selling Price"
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            />
                            <button 
                                onClick={handleSave}
                                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all"
                            >
                                SAVE PACKAGE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
