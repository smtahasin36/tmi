
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { SiteSettings, PaymentMethod, User } from '../types';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal';

const InstantPay: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethod[]>(DB.getPaymentMethods());
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [pendingInfo, setPendingInfo] = useState<any>(null);
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('pending_order_info') || 'null');
    const addMoneyInfo = JSON.parse(localStorage.getItem('pending_add_money') || 'null');
    
    if (info) setPendingInfo({ ...info, type: 'order' });
    else if (addMoneyInfo) setPendingInfo({ ...addMoneyInfo, type: 'add_money' });
    else navigate('/');
  }, []);

  const handleSubmit = () => {
    if (!senderNumber || !trxId || !selectedMethod) {
        alert('Please fill all fields');
        return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
        const user = DB.getCurrentUser();
        if (!user) return;

        if (pendingInfo.type === 'order') {
             const newOrder = {
                id: Math.random().toString(36).substr(2, 9),
                userId: user.id,
                productId: pendingInfo.productId,
                gameId: pendingInfo.gameId,
                quantity: pendingInfo.quantity,
                totalPrice: pendingInfo.totalPrice,
                status: 'pending' as const,
                paymentMethod: selectedMethod.name,
                createdAt: new Date().toISOString(),
                playerTag: pendingInfo.playerTag
            };
            DB.saveOrders([...DB.getOrders(), newOrder]);
            localStorage.removeItem('pending_order_info');
            alert('Order submitted successfully! Waiting for admin approval.');
            navigate('/orders');
        } else {
            // Add Money flow
            const topupRequest = {
                id: Math.random().toString(36).substr(2, 9),
                user_id: user.id,
                amount: pendingInfo.amount,
                method_id: selectedMethod.id,
                sender_number: senderNumber,
                trx_id: trxId,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            const currentRequests = JSON.parse(localStorage.getItem('tmi_topup_requests') || '[]');
            localStorage.setItem('tmi_topup_requests', JSON.stringify([...currentRequests, topupRequest]));
            localStorage.removeItem('pending_add_money');
            alert('Add money request submitted! Your balance will be updated after verification.');
            navigate('/profile');
        }
        setLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Number copied!');
  };

  return (
    <div className="p-4 space-y-6">
      <LoadingModal isOpen={loading} message="Verifying Transaction..." />
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payment</p>
        <p className="text-4xl font-black text-blue-600">{settings.currencySymbol}{pendingInfo?.totalPrice || pendingInfo?.amount}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">Choose Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
            {methods.length > 0 ? methods.map(m => (
                <button 
                    key={m.id}
                    onClick={() => setSelectedMethod(m)}
                    className={`bg-white p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedMethod?.id === m.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    {m.logo ? <img src={m.logo} className="w-12 h-12 object-contain" alt={m.name} /> : <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">{m.name[0]}</div>}
                    <span className="font-bold text-gray-800 text-sm">{m.name}</span>
                </button>
            )) : (
                <div className="col-span-2 p-8 bg-white rounded-2xl text-center text-gray-400 italic">No payment methods configured.</div>
            )}
        </div>
      </div>

      {selectedMethod && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6 animate-fadeIn">
            <div className="flex flex-col items-center gap-4 text-center">
                {selectedMethod.qrImage && (
                    <img src={selectedMethod.qrImage} className="w-48 h-48 rounded-2xl border-4 border-gray-50" alt="QR Code" />
                )}
                <div className="bg-blue-50 px-6 py-4 rounded-2xl w-full flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase mb-0.5">Admin Number</p>
                        <p className="text-xl font-black text-blue-600 tracking-wider">{selectedMethod.number}</p>
                    </div>
                    <button onClick={() => copyToClipboard(selectedMethod.number)} className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                        <i className="fa-solid fa-copy"></i>
                    </button>
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl italic w-full">
                    {selectedMethod.description || "Send money to the number above and provide details below."}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase px-2">Your {selectedMethod.name} Number</label>
                    <input 
                        type="tel"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="e.g. 01700000000"
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase px-2">Transaction ID</label>
                    <input 
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="Paste Trx ID here"
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        </div>
                    ) : (
                        <>VERIFY PAYMENT <i className="fa-solid fa-shield-check"></i></>
                    )}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default InstantPay;
