
import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { useNavigate } from 'react-router-dom';

const AddMoney: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (!amount || parseInt(amount) < 10) {
        alert('Minimum deposit is 10 BDT');
        return;
    }
    localStorage.setItem('pending_add_money', JSON.stringify({ amount: parseInt(amount) }));
    navigate('/pay');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-4">
            <i className="fa-solid fa-piggy-bank"></i>
        </div>
        <h2 className="text-xl font-black text-gray-800 uppercase italic">Recharge Wallet</h2>
        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest text-center px-4">Instant deposit to your TMI wallet 24/7</p>

        <div className="w-full mt-8 space-y-6">
            <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-blue-600">{settings.currencySymbol}</span>
                <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter Amount"
                    className="w-full bg-gray-50 border-none rounded-[1.5rem] px-12 py-6 text-3xl font-black text-gray-800 placeholder:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {[50, 100, 500, 1000].map(val => (
                    <button 
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        className="bg-gray-50 py-3 rounded-xl font-black text-sm text-gray-500 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    >
                        +{val}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
                PROCEED TO PAY <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">How it works</h3>
        <a 
            href={settings.youtubeLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl group"
        >
            <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i className="fa-brands fa-youtube"></i>
            </div>
            <div>
                <p className="font-black text-red-600 text-sm">Watch Video Tutorial</p>
                <p className="text-[10px] font-bold text-red-400 uppercase">Step by step guide</p>
            </div>
        </a>
      </div>
    </div>
  );
};

export default AddMoney;
