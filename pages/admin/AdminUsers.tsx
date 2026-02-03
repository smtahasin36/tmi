
import React, { useState } from 'react';
import { DB } from '../../db';
import { User } from '../../types';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>(DB.getUsers());

    const handleDelete = (id: string) => {
        if (id === '1') {
            alert("Cannot delete system demo user.");
            return;
        }
        if (!confirm('Delete this user? All history will be lost.')) return;
        const updated = users.filter(u => u.id !== id);
        setUsers(updated);
        DB.saveUsers(updated);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800 italic uppercase">User Directory</h1>
                <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Registered Customer Base</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">User Details</th>
                            <th className="px-6 py-4">Financials</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map(user => (
                            <tr key={user.id} className="text-sm">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 uppercase text-xs">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{user.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs font-black text-green-600">Balance: ৳{user.balance}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Total Spent: ৳{user.totalSpent}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
