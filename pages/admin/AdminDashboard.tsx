
import React from 'react';
import { DB } from '../../db';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const stats = {
        users: DB.getUsers().length,
        orders: DB.getOrders().length,
        pending: DB.getOrders().filter(o => o.status === 'pending').length,
        revenue: DB.getOrders().filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0),
        games: DB.getGames().length,
        products: DB.getProducts().length
    };

    const logout = () => {
        localStorage.removeItem('tmi_admin_session');
        navigate('/sm/login');
    };

    return (
        <div className="space-y-10 animate-scaleIn">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">System Core</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Management Hub v2.0 Premium</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/sm/setting" className="w-14 h-14 glass flex items-center justify-center rounded-2xl text-slate-600 hover:text-blue-600 transition-all shadow-sm">
                        <i className="fa-solid fa-gear text-xl"></i>
                    </Link>
                    <button onClick={logout} className="bg-red-500 text-white px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-200">
                        EXIT PANEL
                    </button>
                </div>
            </header>

            {/* Premium Stat Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                <StatCard icon="fa-users" label="Users" value={stats.users} color="from-blue-600 to-indigo-600" />
                <StatCard icon="fa-clock" label="Pending" value={stats.pending} color="from-amber-400 to-orange-500" />
                <StatCard icon="fa-cart-shopping" label="Orders" value={stats.orders} color="from-emerald-400 to-teal-600" />
                <StatCard icon="fa-coins" label="Revenue" value={`৳${stats.revenue}`} color="from-purple-500 to-pink-600" />
                <StatCard icon="fa-gamepad" label="Games" value={stats.games} color="from-slate-700 to-slate-900" />
                <StatCard icon="fa-box-open" label="Products" value={stats.products} color="from-rose-400 to-red-600" />
            </div>

            <section>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em]">System Controls</h2>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    <ActionButton to="/sm/game" icon="fa-folder-plus" label="Games" />
                    <ActionButton to="/sm/product" icon="fa-tag" label="Packages" />
                    <ActionButton to="/sm/order" icon="fa-check-double" label="Orders" />
                    <ActionButton to="/sm/users" icon="fa-users-gear" label="Users" />
                    <ActionButton to="/sm/sliders" icon="fa-image" label="Sliders" />
                    <ActionButton to="/sm/payments" icon="fa-money-bill-transfer" label="Gateways" />
                    <ActionButton to="/sm/redeem" icon="fa-ticket" label="Vouchers" />
                    <ActionButton to="/sm/setting" icon="fa-sliders" label="Settings" />
                </div>
            </section>

            <section className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-black text-slate-900 italic uppercase flex items-center gap-3">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        Live Traffic
                    </h2>
                    <Link to="/sm/order" className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-100">View Full Log</Link>
                 </div>
                 <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left min-w-[500px]">
                        <thead>
                            <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100">
                                <th className="pb-6">Reference</th>
                                <th className="pb-6">Destination</th>
                                <th className="pb-6">State</th>
                                <th className="pb-6 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {DB.getOrders().slice(-6).reverse().map(order => (
                                <tr key={order.id} className="text-sm group hover:bg-slate-50/50 transition-all">
                                    <td className="py-5">
                                        <p className="font-bold text-slate-400 text-xs">#{order.id.toUpperCase()}</p>
                                        <p className="text-[8px] font-black text-slate-300 uppercase mt-0.5">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </td>
                                    <td className="py-5 font-black text-slate-800 italic uppercase">
                                        {DB.getGames().find(g => g.id === order.gameId)?.name || 'Generic'}
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-5 text-right font-black text-blue-600">৳{order.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full"></div>
            </section>
        </div>
    );
};

const StatCard: React.FC<{ icon: string, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-slate-900 italic tracking-tight">{value}</p>
        </div>
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0 opacity-50"></div>
    </div>
);

const ActionButton: React.FC<{ to: string, icon: string, label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-blue-600 group transition-all duration-300">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <i className={`fa-solid ${icon} text-lg`}></i>
        </div>
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center group-hover:text-blue-600 transition-colors">{label}</span>
    </Link>
);

export default AdminDashboard;
