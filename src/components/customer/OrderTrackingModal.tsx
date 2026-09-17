import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Package,
  Bike,
  Home,
  Thermometer,
  FileText,
  RotateCw,
  ChevronRight,
  Share2,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    currentActiveOrder,
    orders,
    advanceOrderStatus,
    addToCart,
    products,
  } = useStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [countdownSecs, setCountdownSecs] = useState(540); // 9 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOrderTrackingOpen) {
        setIsOrderTrackingOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOrderTrackingOpen, setIsOrderTrackingOpen]);

  const activeOrder = currentActiveOrder || orders[0];

  if (!isOrderTrackingOpen || !activeOrder) return null;

  const stages: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'PLACED',
      label: 'Order Confirmed',
      desc: 'Inventory locked & verified at dark store',
      icon: CheckCircle2,
    },
    {
      key: 'PICKING',
      label: 'Picking Items',
      desc: `${activeOrder.pickerName || 'Picker'} is gathering verified items`,
      icon: Package,
    },
    {
      key: 'PACKED',
      label: 'Quality Checked & Packed',
      desc: 'Sealed in tamper-evident eco pouch with freshness seal',
      icon: ShieldCheck,
    },
    {
      key: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      desc: `${activeOrder.riderName || 'Rider'} is on the way on EV scooter`,
      icon: Bike,
    },
    {
      key: 'DELIVERED',
      label: 'Delivered to Doorstep',
      desc: 'Handed over safely with contactless delivery',
      icon: Home,
    },
  ];

  const currentStepIndex = stages.findIndex((s) => s.key === activeOrder.status);

  // Rider map progress coordinate
  const riderProgressPct =
    activeOrder.status === 'PLACED'
      ? 10
      : activeOrder.status === 'PICKING'
      ? 25
      : activeOrder.status === 'PACKED'
      ? 45
      : activeOrder.status === 'OUT_FOR_DELIVERY'
      ? 78
      : 100;

  const handleReorder = () => {
    activeOrder.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) addToCart(prod, item.quantity);
    });
    setIsOrderTrackingOpen(false);
  };

  const handleShareTracking = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const minutesLeft = Math.floor(countdownSecs / 60);
  const secondsLeft = countdownSecs % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
                LIVE ORDER #{activeOrder.orderNumber}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-700">
                {activeOrder.status === 'DELIVERED'
                  ? 'Delivered'
                  : `Arriving in ${minutesLeft}m ${secondsLeft}s`}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareTracking}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors text-xs flex items-center space-x-1"
              title="Share tracking link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOrderTrackingOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Tracking Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Visual Fulfillment Map Simulation */}
          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-4 text-white overflow-hidden">
            <div className="flex items-center justify-between text-xs mb-3 text-slate-300">
              <span className="flex items-center font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
                Live Dark Store GPS Route
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Hub: {activeOrder.darkStore.code}
              </span>
            </div>

            {/* SVG Interactive Road Map */}
            <div className="relative h-28 w-full bg-slate-950/60 rounded-xl border border-slate-800 flex items-center px-6">
              {/* Waypoint Line */}
              <div className="absolute inset-x-8 h-1.5 bg-slate-800 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${riderProgressPct}%` }}
                />
              </div>

              {/* Dark Store Point */}
              <div className="relative z-10 text-center -translate-x-1/2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-brand-500 flex items-center justify-center text-white shadow-lg mx-auto">
                  <Package className="w-5 h-5 text-brand-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 block mt-1">
                  {activeOrder.darkStore.code}
                </span>
              </div>

              {/* Rider Moving Marker */}
              <div
                className="absolute z-20 transition-all duration-700 -translate-x-1/2"
                style={{ left: `${Math.max(10, Math.min(90, riderProgressPct))}%` }}
              >
                <div className="w-11 h-11 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl ring-4 ring-emerald-500/20">
                  <Bike className="w-6 h-6 fill-current animate-bounce" />
                </div>
                <span className="text-[9px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap block text-center mt-1">
                  {activeOrder.riderName}
                </span>
              </div>

              {/* Customer Doorstep Point */}
              <div className="relative z-10 text-center ml-auto translate-x-1/2">
                <div
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-white shadow-lg mx-auto ${
                    activeOrder.status === 'DELIVERED'
                      ? 'bg-brand-600 border-emerald-300'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <Home className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 block mt-1">
                  Doorstep
                </span>
              </div>
            </div>

            {/* Quick Demo Status Advancer */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Simulate Dark Store Fulfillment Pipeline:
              </span>
              <button
                onClick={() => advanceOrderStatus(activeOrder.id)}
                disabled={activeOrder.status === 'DELIVERED'}
                className="px-3 py-1 bg-emerald-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>Advance State</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Live Order Milestones
            </h3>
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.key}
                    className={`flex items-start space-x-3.5 p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-brand-500 shadow-xs ring-1 ring-brand-500/20'
                        : isPassed
                        ? 'bg-slate-50/70 border-slate-200'
                        : 'bg-white border-slate-100 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPassed
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-900">{stage.label}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                            IN PROGRESS
                          </span>
                        )}
                        {isPassed && !isCurrent && (
                          <span className="text-[10px] font-semibold text-slate-400">Completed</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider & Safety Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Delivery Partner
              </span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{activeOrder.riderName}</p>
              <div className="flex items-center space-x-2 text-slate-500 text-[11px] mt-1">
                <span>{activeOrder.riderVehicle}</span>
                <span>•</span>
                <span className="text-brand-700 font-semibold">{activeOrder.riderPhone}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Safety & Quality Protocol
              </span>
              <div className="flex items-center space-x-1.5 text-slate-700 mt-1">
                <Thermometer className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-semibold">Temperature Checked: {activeOrder.riderTemp}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Masked & Sanitized • Contactless drop-off enabled
              </p>
            </div>
          </div>

          {/* Order Items & Summary */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Basket Items ({activeOrder.items.length})
            </h4>
            <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto pr-1">
              {activeOrder.items.map((item) => (
                <div key={item.productId} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img src={item.image} alt={item.productName} className="w-9 h-9 object-cover rounded-lg bg-slate-50" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{item.productName}</p>
                      <span className="text-[10px] text-slate-500">{item.packSize} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Paid via {activeOrder.paymentMethod}</span>
              <span className="text-sm font-black text-slate-900 font-mono">Total: ₹{activeOrder.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Download Invoice</span>
          </button>

          <button
            onClick={handleReorder}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/20 flex items-center space-x-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Re-order Basket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
