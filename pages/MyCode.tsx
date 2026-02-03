
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Order, Game } from '../types';

const MyCode: React.FC = () => {
  const [vouchers, setVouchers] = useState<Order[]>([]);
  const user = DB.getCurrentUser();

  useEffect(() => {
    if (user) {
        const orders = DB.getOrders();
        setVouchers(orders.filter(o => o.userId === user.id && o.voucherCode).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          MY VOUCHERS
        </h2>
        <a 
            href="https://shop.garena.my/app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-black text-white bg-red-500 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-red-600 transition-all"
        >
            Redeem Now
        </a>
      </div>

      {vouchers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 opacity-20">
              <i className="fa-solid fa-ticket text-8xl mb-4"></i>
              <p className="font-black italic">NO VOUCHERS FOUND</p>
          </div>
      ) : (
          <div className="space-y-4">
            {vouchers.map(v => (
                <div key={v.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 text-2xl">
                            <i className="fa-solid fa-barcode"></i>
                        </div>
                        <div>
                            <h3 className="font-black text-gray-800 uppercase italic">
                                {DB.getGames().find(g => g.id === v.gameId)?.name} Code
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{new Date(v.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-blue-600/5 border-2 border-dashed border-blue-100 rounded-2xl p-5 flex flex-col items-center gap-3">
                        <p className="text-xl font-black text-blue-600 tracking-[0.3em] font-mono">{v.voucherCode}</p>
                        <button 
                            onClick={() => copyCode(v.voucherCode!)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all"
                        >
                            Copy Code
                        </button>
                    </div>
                    
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-50 border border-gray-100"></div>
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-50 border border-gray-100"></div>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default MyCode;
