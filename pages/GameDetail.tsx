
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DB } from '../db';
import { Game, Product, SiteSettings, PaymentMethod, User } from '../types';

const GameDetail: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [playerTag, setPlayerTag] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'instant'>('wallet');
  const [user, setUser] = useState<User | null>(DB.getCurrentUser());

  useEffect(() => {
    const allGames = DB.getGames();
    const foundGame = allGames.find(g => g.id === id);
    if (foundGame) {
      setGame(foundGame);
      const allProducts = DB.getProducts();
      const gameProducts = allProducts.filter(p => p.gameId === id);
      setProducts(gameProducts);
      if (gameProducts.length > 0) setSelectedProduct(gameProducts[0]);
    }
  }, [id]);

  if (!game) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const handlePurchase = () => {
    if (!user) {
        navigate('/login');
        return;
    }
    if (game.type === 'uid' && !playerTag) {
        alert('Please enter your Player ID');
        return;
    }
    if (!selectedProduct) return;

    const total = selectedProduct.price * quantity;

    if (paymentMethod === 'wallet') {
        if (user.balance < total) {
            alert('Insufficient balance. Please add money.');
            navigate('/add-money');
            return;
        }
        const newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            productId: selectedProduct.id,
            gameId: game.id,
            quantity,
            totalPrice: total,
            status: 'completed' as const,
            paymentMethod: 'Wallet',
            createdAt: new Date().toISOString(),
            playerTag: game.type === 'uid' ? playerTag : undefined,
            voucherCode: game.type === 'voucher' ? 'VOUCHER-' + Math.random().toString(36).toUpperCase().substr(2, 10) : undefined
        };
        
        const orders = DB.getOrders();
        DB.saveOrders([...orders, newOrder]);
        
        const newUser = { ...user, balance: user.balance - total, totalSpent: user.totalSpent + total };
        const allUsers = DB.getUsers().map(u => u.id === user.id ? newUser : u);
        DB.saveUsers(allUsers);
        DB.setCurrentUser(newUser);
        setUser(newUser);
        
        navigate('/orders');
    } else {
        localStorage.setItem('pending_order_info', JSON.stringify({
            productId: selectedProduct.id,
            gameId: game.id,
            quantity,
            totalPrice: total,
            playerTag
        }));
        navigate('/pay');
    }
  };

  return (
    <div className="pb-32 animate-fadeInUp">
      {/* Cinematic Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src={game.image} alt={game.name} className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{game.type}</span>
            <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Verified Seller</span>
          </div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">{game.name}</h1>
          <p className="text-xs text-slate-300 font-bold mt-1 max-w-[300px] leading-relaxed italic">{game.description}</p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10 space-y-6">
        {/* Step 1: Account Info */}
        {game.type === 'uid' && (
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
             <StepLabel number="1" text="ACCOUNT DETAILS" />
             <div className="relative mt-4">
                <input 
                    type="text" 
                    placeholder="ENTER PLAYER UID / TAG"
                    value={playerTag}
                    onChange={(e) => setPlayerTag(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-lg font-black text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                />
                <i className="fa-solid fa-id-card absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 text-xl"></i>
             </div>
          </div>
        )}

        {/* Step 2: Product Grid */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
          <StepLabel number={game.type === 'uid' ? "2" : "1"} text="SELECT PACKAGE" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            {products.length > 0 ? products.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`p-5 rounded-3xl border-2 text-left relative transition-all duration-300 group ${selectedProduct?.id === p.id ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-200'}`}
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${selectedProduct?.id === p.id ? 'text-blue-600' : 'text-slate-400'}`}>{p.name}</p>
                  <p className="text-xl font-black text-slate-800">{settings.currencySymbol}{p.price}</p>
                </div>
                {selectedProduct?.id === p.id && (
                    <i className="fa-solid fa-circle-check absolute top-4 right-4 text-blue-600"></i>
                )}
              </button>
            )) : (
              <div className="col-span-2 text-center py-10">
                <i className="fa-solid fa-box-open text-4xl text-slate-100 mb-2"></i>
                <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No Packages Found</p>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center justify-between">
            <StepLabel number={game.type === 'uid' ? "3" : "2"} text="QUANTITY" />
            <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-12 h-12 rounded-xl bg-white text-slate-800 flex items-center justify-center text-xl font-black shadow-sm active:scale-90 transition-all"> - </button>
                <span className="text-xl font-black text-slate-800 min-w-[20px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="w-12 h-12 rounded-xl bg-white text-slate-800 flex items-center justify-center text-xl font-black shadow-sm active:scale-90 transition-all"> + </button>
            </div>
        </div>

        {/* Step 3: Payment Selection */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
           <StepLabel number={game.type === 'uid' ? "4" : "3"} text="PAYMENT METHOD" />
           <div className="grid grid-cols-1 gap-3 mt-6">
              <PaymentCard 
                active={paymentMethod === 'wallet'}
                onClick={() => setPaymentMethod('wallet')}
                icon="fa-wallet"
                title="TMI Wallet"
                subtitle={`Balance: ${settings.currencySymbol}${user?.balance || 0}`}
              />
              <PaymentCard 
                active={paymentMethod === 'instant'}
                onClick={() => setPaymentMethod('instant')}
                icon="fa-bolt-lightning"
                title="Instant Pay"
                subtitle="bKash, Nagad, Rocket"
              />
           </div>
        </div>
      </div>

      {/* Modern Checkout Bar */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40">
         <div className="bg-slate-900 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl border border-white/10">
            <div className="pl-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Price</p>
                <p className="text-2xl font-black text-white">{settings.currencySymbol}{(selectedProduct?.price || 0) * quantity}</p>
            </div>
            <button 
                onClick={handlePurchase}
                className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-3 group"
            >
                Checkout Now
                <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </button>
         </div>
      </div>
    </div>
  );
};

const StepLabel: React.FC<{ number: string, text: string }> = ({ number, text }) => (
    <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs italic">{number}</span>
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{text}</h3>
    </div>
);

const PaymentCard: React.FC<{ active: boolean, onClick: () => void, icon: string, title: string, subtitle: string }> = ({ active, onClick, icon, title, subtitle }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 ${active ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-slate-50/50 hover:bg-slate-50'}`}
    >
        <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border border-slate-100'}`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div className="text-left">
                <p className="font-black text-slate-800 text-sm uppercase italic">{title}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtitle}</p>
            </div>
        </div>
        {active && <i className="fa-solid fa-circle-check text-blue-600 text-lg"></i>}
    </button>
);

export default GameDetail;
