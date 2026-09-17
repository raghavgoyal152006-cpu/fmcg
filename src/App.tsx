import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { StorefrontView } from './components/customer/StorefrontView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PickerTerminal } from './components/picker/PickerTerminal';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';
import { SubscriptionsModal } from './components/customer/SubscriptionsModal';
import { AddressModal } from './components/customer/AddressModal';
import { Toast } from './components/common/Toast';
import { MobileNav } from './components/common/MobileNav';
import { Zap, ShieldCheck, Clock, Award, Sparkles, RefreshCw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, selectedDarkStore } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Toast notifications */}
      <Toast />

      {/* Conditionally render header based on role */}
      {currentRole === 'customer' && <Header />}

      {/* View Switcher */}
      <main className="flex-1">
        {currentRole === 'customer' && <StorefrontView />}
        {currentRole === 'picker' && <PickerTerminal />}
        {currentRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Customer Footer with FMCG Brand Rigor */}
      {currentRole === 'customer' && (
        <footer className="bg-slate-950 text-white border-t border-slate-800/80 pt-12 pb-20 sm:pb-12 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* 4 Pillars of VeloxMart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-slate-800">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">10-Minute Fulfillment</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Orders routed to the nearest hyper-local dark store hub within 1.5 km of your doorstep.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">100% Genuine Direct Supply</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Sourced directly from certified brand manufacturers: ITC, Tata Consumer, Amul, Nestle, and HUL.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Transparent Unit Pricing</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Clear ₹/kg and ₹/L prices on every card. No hidden markups or misleading price tags.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Automated Repeat Essentials</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    One-click "Buy Again" basket and flexible morning dairy subscriptions with skip/pause controls.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Brand Notice */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold text-white text-sm font-['Outfit']">VeloxMart FMCG</span>
                <span>• Licensed Digital Supermarket & Quick-Commerce Network</span>
              </div>

              <p className="text-[11px] text-slate-400 text-center sm:text-right">
                Serving {selectedDarkStore.area} from {selectedDarkStore.name} ({selectedDarkStore.code}).
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Customer Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <SubscriptionsModal />
      <AddressModal />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}

export default App;
