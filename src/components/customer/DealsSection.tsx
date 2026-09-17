import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const DealsSection: React.FC = () => {
  const { products, setSelectedCategory } = useStore();

  // Pick top discounted items
  const dealProducts = products
    .filter((p) => p.mrp > p.price)
    .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
    .slice(0, 4);

  // Countdown timer simulation for deal validity
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-citrus-50 border border-citrus-200 px-3 py-1 rounded-full text-citrus-800 text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-citrus-600" />
            <span>FLASH FMCG SAVINGS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
            Today’s Top Deals
          </h2>
        </div>

        {/* Live Deal Expiry Countdown */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <Timer className="w-4 h-4 text-citrus-600 animate-pulse" />
          <span>Expires in:</span>
          <div className="flex items-center space-x-1 font-mono font-bold text-slate-900">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
