import React from 'react';
import {
  Home,
  Grid,
  Search,
  Clock,
  User,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileNav: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    setSelectedCategory,
    setSearchQuery,
    orders,
    currentActiveOrder,
    setIsOrderTrackingOpen,
    setIsSubscriptionsOpen,
    cart,
    cartTotal,
    setIsCartOpen,
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (currentRole !== 'customer') return null;

  return (
    <>
      {/* Persistent Floating Cart Pill if Cart has Items (Mobile & Tablet) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-16 inset-x-4 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white p-3 rounded-2xl shadow-xl shadow-brand-600/30 flex items-center justify-between font-bold text-xs animate-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
                {totalCartCount}
              </div>
              <span>{totalCartCount} items in basket</span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-sm">
              <span>View Cart • ₹{cartTotal}</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 z-40 flex items-center justify-around sm:hidden">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
          className="flex flex-col items-center text-brand-700 space-y-0.5"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('staples');
          }}
          className="flex flex-col items-center text-slate-500 hover:text-brand-600 space-y-0.5"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Categories</span>
        </button>

        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-slate-500 hover:text-brand-600 space-y-0.5"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Search</span>
        </button>

        <button
          onClick={() => {
            if (orders.length > 0) {
              setIsOrderTrackingOpen(true);
            } else {
              setIsSubscriptionsOpen(true);
            }
          }}
          className="flex flex-col items-center text-slate-500 hover:text-brand-600 space-y-0.5 relative"
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Orders</span>
          {orders.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-0 right-3" />
          )}
        </button>

        <button
          onClick={() => setIsSubscriptionsOpen(true)}
          className="flex flex-col items-center text-slate-500 hover:text-brand-600 space-y-0.5"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Account</span>
        </button>
      </div>
    </>
  );
};
