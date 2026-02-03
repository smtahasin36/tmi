
import React, { useState } from 'react';
import { DB } from '../../db';
import { Slider } from '../../types';

const AdminSliders: React.FC = () => {
    const [sliders, setSliders] = useState<Slider[]>(DB.getSliders());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Slider>>({ image: '', link: '' });
    const [editId, setEditId] = useState<string | null>(null);

    const handleSave = () => {
        if (!formData.image) return;
        const newSlider: Slider = {
            id: editId || Math.random().toString(36).substr(2, 9),
            image: formData.image!,
            link: formData.link || '#',
        };

        const updated = editId ? sliders.map(s => s.id === editId ? newSlider : s) : [...sliders, newSlider];
        setSliders(updated);
        DB.saveSliders(updated);
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ image: '', link: '' });
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this slider?')) return;
        const updated = sliders.filter(s => s.id !== id);
        setSliders(updated);
        DB.saveSliders(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 italic uppercase">Slider Management</h1>
                    <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Homepage Hero Banners</p>
                </div>
                <button 
                    onClick={() => { setEditId(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest shadow-xl"
                >
                    ADD NEW SLIDER
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sliders.map(slider => (
                    <div key={slider.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 group">
                        <div className="aspect-[16/6] relative">
                            <img src={slider.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button onClick={() => { setEditId(slider.id); setFormData(slider); setIsModalOpen(true); }} className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg active:scale-90 transition-all">
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => handleDelete(slider.id)} className="w-12 h-12 rounded-full bg-white text-red-600 flex items-center justify-center shadow-lg active:scale-90 transition-all">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{slider.link}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 italic uppercase mb-6">{editId ? 'Edit Slider' : 'New Slider'}</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Banner Image URL</label>
                                <input 
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                                    value={formData.image}
                                    onChange={e => setFormData({...formData, image: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Redirect Link (Optional)</label>
                                <input 
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                                    value={formData.link}
                                    onChange={e => setFormData({...formData, link: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleSave}
                                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all mt-4"
                            >
                                SAVE BANNERS
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSliders;
