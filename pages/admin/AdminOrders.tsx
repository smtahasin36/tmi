
import React, { useState } from 'react';
import { DB } from '../../db';
import { Order } from '../../types';
import LoadingModal from '../../components/LoadingModal';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(DB.getOrders().reverse());
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
    const [loading, setLoading] = useState(false);

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const updateStatus = (id: string, status: Order['status']) => {
        setLoading(true);
        setTimeout(() => {
            const updated = DB.getOrders().map(o => o.id === id ? { ...o, status } : o);
            DB.saveOrders(updated);
            setOrders([...updated].reverse());
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
             <LoadingModal isOpen={loading} message="Processing Order..." />
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 italic uppercase">Order Center</h1>
                    <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Fulfill Requests</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {['all', 'pending', 'completed', 'cancelled'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredOrders.length > 0 ? filteredOrders.map(order => {
                    const game = DB.getGames().find(g => g.id === order.gameId);
                    const product = DB.getProducts().find(p => p.id === order.productId);
                    const user = DB.getUsers().find(u => u.id === order.userId);
                    return (
                        <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 text-2xl font-black">
                                    {game?.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-slate-800 italic">{game?.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">{product?.name} • ID: #{order.id.substr(0,8)}</p>
                                    <p className="text-xs font-bold text-blue-600 mt-1">Player Tag: {order.playerTag || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</p>
                                <p className="font-black text-slate-800">{user?.name || 'Unknown'}</p>
                                <p className="text-xl font-black text-slate-800">৳{order.totalPrice}</p>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => updateStatus(order.id, 'completed')}
                                    className="flex-1 md:flex-none bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-green-600 active:scale-95 transition-all"
                                >
                                    COMPLETE
                                </button>
                                <button 
                                    onClick={() => updateStatus(order.id, 'cancelled')}
                                    className="flex-1 md:flex-none bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-red-600 hover:text-white active:scale-95 transition-all"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-20 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-300">
                        <i className="fa-solid fa-box-open text-6xl mb-4"></i>
                        <p className="font-black tracking-widest uppercase">No orders in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
