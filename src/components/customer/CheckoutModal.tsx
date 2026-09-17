import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  ShieldCheck,
  Zap,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import type { Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSavings,
    selectedAddress,
    addresses,
    setSelectedAddress,
    setIsAddressModalOpen,
    selectedDarkStore,
    createOrder,
  } = useStore();

  const [deliveryType, setDeliveryType] = useState<Order['deliveryType']>('EXPRESS_10_MIN');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiVpa, setUpiVpa] = useState('user@okaxis');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCheckoutOpen && !isProcessing) {
        setIsCheckoutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, setIsCheckoutOpen, isProcessing]);

  if (!isCheckoutOpen || cart.length === 0) return null;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder(paymentMethod, deliveryType);
      setIsProcessing(false);

      if (order) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#f59e0b'],
        });
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-black text-slate-900 font-['Outfit']">
              Frictionless 10-Min Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Address Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-brand-600" /> 1. Delivery Address
              </span>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-0.5" /> Add New
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddress.id === addr.id
                      ? 'border-brand-500 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{addr.name}</span>
                    <span className="text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {addr.flatNo}, {addr.street}, {addr.area}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Pin: {addr.pincode} • {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Delivery Speed / Mode */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-brand-600" /> 2. Delivery Speed
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setDeliveryType('EXPRESS_10_MIN')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  deliveryType === 'EXPRESS_10_MIN'
                    ? 'border-brand-500 bg-emerald-50/60 ring-1 ring-brand-500'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      ⚡ Express 10-Min Flash
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dispatched from {selectedDarkStore.code}
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === 'EXPRESS_10_MIN'}
                  onChange={() => {}}
                  className="accent-brand-600"
                />
              </label>

              <label
                onClick={() => setDeliveryType('SCHEDULED_SLOT')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  deliveryType === 'SCHEDULED_SLOT'
                    ? 'border-brand-500 bg-emerald-50/60 ring-1 ring-brand-500'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      Scheduled Slot
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Today, 2:00 PM - 4:00 PM
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === 'SCHEDULED_SLOT'}
                  onChange={() => {}}
                  className="accent-brand-600"
                />
              </label>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center">
              <CreditCard className="w-4 h-4 mr-1 text-brand-600" /> 3. Payment Method
            </span>

            <div className="space-y-2">
              {/* UPI Option */}
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-brand-500 bg-emerald-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      UPI (Google Pay, PhonePe, Paytm, QR)
                    </span>
                    <span className="text-[10px] text-slate-500">Instant auto-confirm</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => {}}
                  className="accent-brand-600"
                />
              </label>

              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2 ml-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">Pay via UPI ID:</span>
                    <span className="text-emerald-700 font-semibold text-[10px]">Zero convenience fee</span>
                  </div>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-brand-500"
                    placeholder="yourname@okhdfcbank"
                  />
                </div>
              )}

              {/* Card Option */}
              <label
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-brand-500 bg-emerald-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Credit / Debit Card (Visa, MasterCard, RuPay)
                    </span>
                    <span className="text-[10px] text-slate-500">Saved card tokenization enabled</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => {}}
                  className="accent-brand-600"
                />
              </label>

              {/* Wallet Option */}
              <label
                onClick={() => setPaymentMethod('WALLET')}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'WALLET'
                    ? 'border-brand-500 bg-emerald-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      VeloxPay Wallet (Balance: ₹1,450)
                    </span>
                    <span className="text-[10px] text-slate-500">1-tap frictionless checkout</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'WALLET'}
                  onChange={() => {}}
                  className="accent-brand-600"
                />
              </label>

              {/* COD Option */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-brand-500 bg-emerald-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Cash / Pay on Delivery (UPI / Cash at Doorstep)
                    </span>
                    <span className="text-[10px] text-slate-500">Pay when order arrives</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => {}}
                  className="accent-brand-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer with Final Payable & Place Order CTA */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">
              Total Payable ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 font-mono">₹{cartTotal}</span>
              {cartSavings > 0 && (
                <span className="text-xs font-bold text-emerald-600">Saved ₹{cartSavings}</span>
              )}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-black text-sm shadow-xl shadow-brand-600/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            {isProcessing ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reserving Dark Store Inventory...</span>
              </span>
            ) : (
              <span>PLACE ORDER & PAY ₹{cartTotal}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
