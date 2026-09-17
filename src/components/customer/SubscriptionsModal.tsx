import React, { useState, useEffect } from 'react';
import {
  X,
  Repeat,
  Calendar,
  Clock,
  Pause,
  Play,
  Trash2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Subscription } from '../../types';
import { handleImageError } from '../../utils/imageUtils';

export const SubscriptionsModal: React.FC = () => {
  const {
    isSubscriptionsOpen,
    setIsSubscriptionsOpen,
    subscriptions,
    toggleSubscriptionPause,
    cancelSubscription,
    createSubscription,
    products,
    selectedAddress,
  } = useStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [frequency, setFrequency] = useState<Subscription['frequency']>('DAILY');
  const [quantity, setQuantity] = useState(1);
  const [timeSlot, setTimeSlot] = useState<Subscription['timeSlot']>('6:00 AM - 8:00 AM');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSubscriptionsOpen) {
        setIsSubscriptionsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubscriptionsOpen, setIsSubscriptionsOpen]);

  if (!isSubscriptionsOpen) return null;

  const eligibleProducts = products.filter((p) =>
    ['dairy-breakfast', 'staples', 'cleaning-home'].includes(p.category)
  );

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    createSubscription({
      productId: prod.id,
      productName: prod.name,
      packSize: prod.packSize,
      image: prod.images[0],
      price: prod.price,
      quantity,
      frequency,
      timeSlot,
      startDate: new Date().toISOString().split('T')[0],
      nextDeliveryDate: 'Tomorrow, 7:00 AM',
      status: 'ACTIVE',
      addressId: selectedAddress.id,
    });

    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Repeat className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-base font-black text-slate-900 font-['Outfit']">
                Daily & Weekly Subscriptions
              </h2>
              <p className="text-[11px] text-slate-500">
                Never run out of milk, bread, eggs, or breakfast staples.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubscriptionsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Action to create new subscription */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Active Recurring Schedules ({subscriptions.length})
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Close Form' : 'New Subscription'}</span>
            </button>
          </div>

          {/* New Subscription Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateSub}
              className="p-4 rounded-2xl bg-emerald-50/70 border border-brand-200 space-y-4 animate-in fade-in duration-200"
            >
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-1 text-citrus-600" /> Schedule Everyday FMCG
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Everyday Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:border-brand-500"
                >
                  {eligibleProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.packSize}) — ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:border-brand-500"
                  >
                    <option value="DAILY">Everyday (Daily)</option>
                    <option value="ALTERNATE_DAYS">Alternate Days</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly Pantry Restock</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Morning Delivery Window
                </label>
                <div className="flex gap-3 text-xs">
                  <label className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="timeslot"
                      checked={timeSlot === '6:00 AM - 8:00 AM'}
                      onChange={() => setTimeSlot('6:00 AM - 8:00 AM')}
                      className="accent-brand-600"
                    />
                    <span className="font-semibold text-slate-800">6:00 AM - 8:00 AM (Early Bird)</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="timeslot"
                      checked={timeSlot === '6:00 PM - 8:00 PM'}
                      onChange={() => setTimeSlot('6:00 PM - 8:00 PM')}
                      className="accent-brand-600"
                    />
                    <span className="font-semibold text-slate-800">6:00 PM - 8:00 PM (Evening)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-brand-600 transition-colors shadow-sm"
                >
                  Activate Subscription
                </button>
              </div>
            </form>
          )}

          {/* Subscriptions List */}
          {subscriptions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No active subscriptions yet. Schedule milk or bread to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    sub.status === 'ACTIVE'
                      ? 'bg-white border-slate-200/90 shadow-xs'
                      : 'bg-slate-50 border-slate-200/60 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={sub.image}
                        alt={sub.productName}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                        onError={(e) => handleImageError(e)}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {sub.productName}
                          </h4>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                              sub.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-brand-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700">
                            {sub.quantity}x {sub.packSize}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-slate-900 font-mono">
                            ₹{sub.price * sub.quantity}
                          </span>
                          <span>•</span>
                          <span className="capitalize font-semibold text-brand-700">
                            {sub.frequency.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => cancelSubscription(sub.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete subscription"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delivery Schedule details and controls */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-medium">{sub.timeSlot}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Next: {sub.nextDeliveryDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleSubscriptionPause(sub.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 ${
                          sub.status === 'ACTIVE'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {sub.status === 'ACTIVE' ? (
                          <>
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
