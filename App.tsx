
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DB } from './db';
import { User, SiteSettings } from './types';

// Layout Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import FAB from './components/FAB';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import GameDetail from './pages/GameDetail';
import InstantPay from './pages/InstantPay';
import OrderPage from './pages/OrderPage';
import AddMoney from './pages/AddMoney';
import MyCode from './pages/MyCode';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGames from './pages/admin/AdminGames';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSliders from './pages/admin/AdminSliders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRedeem from './pages/admin/AdminRedeem';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(DB.getCurrentUser());
  const [settings, setSettings] = useState<SiteSettings>(DB.getSettings());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    DB.initialize();
    setSettings(DB.getSettings());
    const interval = setInterval(() => {
        setSettings(DB.getSettings());
        setUser(DB.getCurrentUser());
    }, 1000); // Check for updates frequently to mimic "instant" sync
    return () => clearInterval(interval);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/sm');

  return (
    <div className={`min-h-screen ${isAdminRoute ? 'bg-slate-100' : 'bg-gray-50'} pb-20`}>
      {!isAdminRoute && <Header user={user} settings={settings} onMenuClick={() => setIsSidebarOpen(true)} />}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
      
      <div className={`${isAdminRoute ? '' : 'max-w-4xl mx-auto'}`}>
        <Routes>
          <Route path="/" element={<Home settings={settings} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/profile" element={user ? <Profile user={user} onLogout={() => { DB.setCurrentUser(null); setUser(null); }} /> : <Navigate to="/login" />} />
          <Route path="/game/:id" element={<GameDetail settings={settings} />} />
          <Route path="/pay" element={<InstantPay settings={settings} />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/add-money" element={<AddMoney settings={settings} />} />
          <Route path="/my-codes" element={<MyCode />} />

          {/* Admin Routes */}
          <Route path="/sm/login" element={<AdminLogin />} />
          <Route path="/sm/*" element={<AdminDashboardWrapper />} />
        </Routes>
      </div>

      {!isAdminRoute && <BottomNav />}
      {!isAdminRoute && <FAB settings={settings} />}
    </div>
  );
};

const AdminDashboardWrapper: React.FC = () => {
    const adminSession = localStorage.getItem('tmi_admin_session');
    if (!adminSession) return <Navigate to="/sm/login" />;

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="flex-1 p-4 md:p-8">
                <Routes>
                    <Route path="index" element={<AdminDashboard />} />
                    <Route path="game" element={<AdminGames />} />
                    <Route path="product" element={<AdminProducts />} />
                    <Route path="order" element={<AdminOrders />} />
                    <Route path="setting" element={<AdminSettings />} />
                    <Route path="sliders" element={<AdminSliders />} />
                    <Route path="payments" element={<AdminPayments />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="redeem" element={<AdminRedeem />} />
                    <Route path="*" element={<Navigate to="index" />} />
                </Routes>
            </div>
        </div>
    );
}

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
