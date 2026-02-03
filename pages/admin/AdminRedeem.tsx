
import React, { useState } from 'react';
import { DB } from '../../db';
import { RedeemCode, Game, Product } from '../../types';

const AdminRedeem: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
    const [codes, setCodes] = useState<RedeemCode[]>(DB.getRedeemCodes());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<RedeemCode>>({ gameId: '', productId: '', code: '' });
    
    const games = DB.getGames();
    const products = DB.getProducts();

    const filteredCodes = codes.filter(c => c.status === activeTab);

    const handleSave = () => {
        if (!formData.code || !formData.gameId || !formData.productId) return;
        const newCode: RedeemCode = {
            id: Math.random().toString(36).substr(2, 9),
            gameId: formData.gameId!,
            productId: formData.productId!,
            code: formData.code!,
            status: 'active'
        };

        const updated = [...codes, newCode];
        setCodes(updated);
        DB.saveRedeemCodes(updated);
        setIsModalOpen(false);
        setFormData({ gameId: '', productId: '', code: '' });
    };

    const handleDelete = (id: string) => {
        if (!confirm('Remove this code from the system?')) return;
        const updated = codes.filter(c => c.id !== id);
        setCodes(updated);
        DB.saveRedeemCodes(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 italic uppercase">Voucher Repository</h1>
                    <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Digital Redemption Keys</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest shadow-xl"
                >
                    IMPORT CODES
                </button>
            </div>

            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
                <button 
                    onClick={() => setActiveTab('active')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    ACTIVE CODES
                </button>
                <button 
                    onClick={() => setActiveTab('expired')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'expired' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    USED / EXPIRED
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">Voucher Code</th>
                            <th className="px-6 py-4">Package</th>
                            <th className="px-6 py-4">Game</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredCodes.length > 0 ? filteredCodes.map(code => (
                            <tr key={code.id} className="text-sm font-bold">
                                <td className="px-6 py-4">
                                    <span className="font-mono bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-slate-600">
                                        {code.code}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-800">
                                    {products.find(p => p.id === code.productId)?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 italic text-blue-600">
                                    {games.find(g => g.id === code.gameId)?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(code.id)} className="text-red-400 hover:text-red-600 p-2">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center text-slate-300 italic">No voucher codes in this category.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 italic uppercase mb-6">Import New Vouchers</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Game Category</label>
                                <select 
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 appearance-none"
                                    value={formData.gameId}
                                    onChange={e => setFormData({...formData, gameId: e.target.value})}
                                >
                                    <option value="">Choose Game</option>
                                    {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Target Product</label>
                                <select 
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 appearance-none"
                                    value={formData.productId}
                                    onChange={e => setFormData({...formData, productId: e.target.value})}
                                >
                                    <option value="">Choose Product</option>
                                    {products.filter(p => p.gameId === formData.gameId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Voucher Code String</label>
                                <input 
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                                    placeholder="ABCD-1234-EFGH"
                                    value={formData.code}
                                    onChange={e => setFormData({...formData, code: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleSave}
                                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all mt-4"
                            >
                                ADD VOUCHER
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRedeem;
