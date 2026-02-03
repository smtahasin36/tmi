
import React, { useState } from 'react';
import { DB } from '../../db';
import { SiteSettings } from '../../types';

const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings>(DB.getSettings());

    const handleUpdate = () => {
        DB.updateSettings(settings);
        alert('Settings updated successfully!');
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-black text-slate-800 italic uppercase">System Configuration</h1>
                <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Global Site Parameters</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingField label="Site Name" value={settings.siteName} onChange={v => setSettings({...settings, siteName: v})} />
                    <SettingField label="Site Title" value={settings.siteTitle} onChange={v => setSettings({...settings, siteTitle: v})} />
                    <SettingField label="Currency Symbol" value={settings.currencySymbol} onChange={v => setSettings({...settings, currencySymbol: v})} />
                    <SettingField label="WhatsApp/FAB Link" value={settings.fabLink} onChange={v => setSettings({...settings, fabLink: v})} />
                </div>
                
                <SettingField label="Site Description" value={settings.siteDescription} onChange={v => setSettings({...settings, siteDescription: v})} type="textarea" />
                
                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Marquee Status</label>
                        <button 
                            onClick={() => setSettings({...settings, marqueeStatus: !settings.marqueeStatus})}
                            className={`w-14 h-8 rounded-full p-1 transition-all ${settings.marqueeStatus ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-all ${settings.marqueeStatus ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                    <SettingField label="Marquee Text" value={settings.marqueeText} onChange={v => setSettings({...settings, marqueeText: v})} />
                </div>

                <button 
                    onClick={handleUpdate}
                    className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4"
                >
                    COMMIT ALL CHANGES
                </button>
            </div>
        </div>
    );
};

const SettingField: React.FC<{ label: string, value: string, onChange: (v: string) => void, type?: 'input' | 'textarea' }> = ({ label, value, onChange, type = 'input' }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{label}</label>
        {type === 'input' ? (
            <input 
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        ) : (
            <textarea 
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 h-24"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        )}
    </div>
);

export default AdminSettings;
