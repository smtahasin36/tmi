
import React, { useState } from 'react';
import { DB } from '../../db';
import { PaymentMethod } from '../../types';

const AdminPayments: React.FC = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>(DB.getPaymentMethods());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<PaymentMethod>>({ name: '', number: '', description: '', logo: '', qrImage: '' });
    const [editId, setEditId] = useState<string | null>(null);

    const handleSave = () => {
        if (!formData.name || !formData.number) return;
        const newMethod: PaymentMethod = {
            id: editId || Math.random().toString(36).substr(2, 9),
            name: formData.name!,
            number: formData.number!,
            logo: formData.logo || '',
            qrImage: formData.qrImage || '',
            description: formData.description || '',
        };

        const updated = editId ? methods.map(m => m.id === editId ? newMethod : m) : [...methods, newMethod];
        setMethods(updated);
        DB.savePaymentMethods(updated);
        setIsModalOpen(false);
        setEditId(null);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this payment method?')) return;
        const updated = methods.filter(m => m.id !== id);
        setMethods(updated);
        DB.savePaymentMethods(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 italic uppercase">Payment Gateways</h1>
                    <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Configure Instant Payments</p>
                </div>
                <button 
                    onClick={() => { setEditId(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest shadow-xl"
                >
                    ADD NEW METHOD
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {methods.map(method => (
                    <div key={method.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 group flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 p-2 flex items-center justify-center border border-slate-100">
                                {method.logo ? <img src={method.logo} className="w-full h-full object-contain" alt="" /> : <i className="fa-solid fa-credit-card text-2xl text-slate-300"></i>}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 uppercase italic tracking-tight">{method.name}</h3>
                                <p className="text-sm font-bold text-blue-600 mt-1">{method.number}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-[200px] truncate">{method.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditId(method.id); setFormData(method); setIsModalOpen(true); }} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all">
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button onClick={() => handleDelete(method.id)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-all">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 italic uppercase mb-6">Payment Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Method Name (e.g. bKash)" value={formData.name || ''} onChange={v => setFormData({...formData, name: v})} />
                            <InputField label="Account Number" value={formData.number || ''} onChange={v => setFormData({...formData, number: v})} />
                            <InputField label="Logo Image URL" value={formData.logo || ''} onChange={v => setFormData({...formData, logo: v})} />
                            <InputField label="QR Code URL" value={formData.qrImage || ''} onChange={v => setFormData({...formData, qrImage: v})} />
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Payment Instructions</label>
                                <textarea 
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 h-24"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleSave}
                            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all mt-6"
                        >
                            SAVE GATEWAY
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const InputField: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{label}</label>
        <input 
            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

export default AdminPayments;
