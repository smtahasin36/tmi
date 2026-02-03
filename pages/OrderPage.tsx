
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Order, Game, Product } from '../types';
import { Link } from 'react-router-dom';

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [games, setGames] = useState<Game[]>(DB.getGames());
  const [products, setProducts] = useState<Product[]>(DB.getProducts());
  const user = DB.getCurrentUser();

  useEffect(() => {
    if (user) {
        const allOrders = DB.getOrders();
        setOrders(allOrders.filter(o => o.userId === user.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, []);

  const getGame = (id: string) => games.find(g => g.id === id);
  const getProduct = (id: string) => products.find(p => p.id === id);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2 mb-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        MY ORDERS
      </h2>

      {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
              <i className="fa-solid fa-box-open text-6xl opacity-20"></i>
              <p className="font-bold">You haven't ordered anything yet.</p>
              <Link to="/" className="text-blue-600 font-bold border-b-2 border-blue-600">Start Shopping</Link>
          </div>
      ) : (
          <div className="space-y-4">
            {orders.map(order => {
                const game = getGame(order.gameId);
                const product = getProduct(order.productId);
                return (
                    <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 overflow-hidden relative group transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                <img src={game?.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className="font-black text-gray-800 truncate uppercase text-sm tracking-wide">{game?.name}</h3>
                                    <StatusBadge status={order.status} />
                                </div>
                                <p className="text-xs text-gray-400 font-bold">{order.quantity}x {product?.name || 'Item'}</p>
                                <p className="text-lg font-black text-blue-600 mt-1">৳{order.totalPrice}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-gray-400">ORDER ID</span>
                                <span className="text-gray-800">#{order.id.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-gray-400">DATE</span>
                                <span className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            {order.playerTag && (
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">PLAYER ID</span>
                                    <span className="text-blue-600 font-black">{order.playerTag}</span>
                                </div>
                            )}
                        </div>

                        {order.voucherCode && (
                            <Link 
                                to="/my-codes" 
                                className="mt-4 block w-full bg-blue-50 text-blue-600 py-3 rounded-xl text-center text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                            >
                                View Voucher Code
                            </Link>
                        )}

                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.03] -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform"></div>
                    </div>
                );
            })}
          </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const colors = {
        pending: 'bg-amber-50 text-amber-600',
        completed: 'bg-green-50 text-green-600',
        cancelled: 'bg-red-50 text-red-600'
    };
    return (
        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${colors[status]}`}>
            {status}
        </span>
    );
};

export default OrderPage;
