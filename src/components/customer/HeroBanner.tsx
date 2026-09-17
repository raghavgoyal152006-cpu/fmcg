import React from 'react';
import { Zap, Clock, ShieldCheck, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, selectedDarkStore } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Background glow graphics */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-64 h-64 bg-citrus-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>SUPERFAST FMCG FULFILLMENT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white font-medium">{selectedDarkStore.name}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-['Outfit']">
              Your Daily Pantry & Staples, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Delivered in 10 Minutes.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Wholesale supermarket pricing with instant dark store fulfillment. Verified authentic brands, transparent unit pricing (₹/kg), and zero fake discounts.
            </p>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Average 10-12 Min Delivery</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">100% Genuine Direct from Brands</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Tag className="w-4 h-4 text-citrus-400" />
                <span className="font-semibold">Max Guaranteed Pantry Savings</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setSelectedCategory('staples')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-brand-600/30 transition-all hover:translate-x-0.5"
              >
                <span>Shop Atta, Rice & Dals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedCategory('dairy-breakfast')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/15 transition-all"
              >
                Fresh Milk & Breakfast
              </button>
            </div>
          </div>

          {/* Right Highlight Teaser */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/80 p-5 rounded-2xl backdrop-blur-lg shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-black uppercase tracking-wider text-citrus-400 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Today’s Dark Store Specials
                </span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                  LIVE STOCK
                </span>
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌾</span>
                    <div>
                      <p className="text-xs font-bold text-white">Aashirvaad Sharbati Atta 5kg</p>
                      <p className="text-[11px] text-slate-400 font-mono">₹55.00/kg • 14% OFF</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">₹275</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🫒</span>
                    <div>
                      <p className="text-xs font-bold text-white">Amul Pure Cow Ghee 1L Tin</p>
                      <p className="text-[11px] text-slate-400 font-mono">₹595.00/L • 10% OFF</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">₹595</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🧺</span>
                    <div>
                      <p className="text-xs font-bold text-white">Surf Excel Matic 2kg Front Load</p>
                      <p className="text-[11px] text-slate-400 font-mono">₹199.50/kg • 15% OFF</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">₹399</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
