import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { SubstitutionPolicy } from '../../types';
import { handleImageError } from '../../utils/imageUtils';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    clearCart,
    cartSubtotal,
    cartSavings,
    deliveryFee,
    promoDiscount,
    cartTotal,
    appliedPromo,
    applyPromo,
    removePromo,
    substitutionPolicy,
    setSubstitutionPolicy,
    setIsCheckoutOpen,
    products,
    addToCart,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  // Free delivery threshold: ₹499
  const freeDeliveryThreshold = 499;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  // Relevant upsell items
  const cartProductIds = cart.map((c) => c.product.id);
  const upsellItems = products
    .filter((p) => !cartProductIds.includes(p.id) && p.isFastMover)
    .slice(0, 3);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromo(promoInput);
    setPromoMsg(res.message);
    if (res.success) setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                My Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-brand-600">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your basket is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Explore daily essentials, pantry staples, and fresh dairy delivered in 10 minutes.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Milestone Progress */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-950 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {amountNeededForFree === 0
                        ? '🎉 You unlocked FREE 10-Min Delivery!'
                        : `Add ₹${amountNeededForFree} more for FREE Delivery`}
                    </span>
                    <span className="font-black text-emerald-700">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-xl bg-slate-50 shrink-0 border border-slate-100"
                        onError={(e) => handleImageError(e, product.category)}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-brand-700 uppercase">
                          {product.brand}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {product.packSize} • {product.unitPriceString}
                        </div>
                        <div className="flex items-baseline space-x-1 mt-0.5">
                          <span className="text-xs font-black text-slate-900">
                            ₹{product.price * quantity}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ₹{product.mrp * quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-brand-600 text-white rounded-xl shadow-xs px-1 py-0.5 shrink-0">
                        <button
                          onClick={() => updateCartQty(product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-brand-700 rounded-lg text-white font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-brand-700 rounded-lg text-white font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Frequently Bought With Your Cart Upsell */}
                {upsellItems.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                      Frequently Added With This Order
                    </span>
                    <div className="space-y-2">
                      {upsellItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                              onError={(e) => handleImageError(e, item.category)}
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {item.name}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ₹{item.price} ({item.packSize})
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="text-[11px] font-bold text-brand-600 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-brand-500 shrink-0 transition-colors"
                          >
                            + ADD
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Out-of-Stock Substitution Preference */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center">
                      <HelpCircle className="w-3.5 h-3.5 mr-1 text-brand-600" />
                      Substitution Preference
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    If an item becomes unavailable during picking at the dark store:
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      {
                        key: 'BEST_ALTERNATIVE',
                        title: 'Picker chooses best alternative',
                        desc: 'Same brand/size equivalent',
                      },
                      {
                        key: 'CALL_CUSTOMER',
                        title: 'Call me before substituting',
                        desc: 'Rider calls you directly',
                      },
                      {
                        key: 'INSTANT_REFUND',
                        title: 'Do not substitute (Instant Refund)',
                        desc: 'Auto-credited to payment method',
                      },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className={`flex items-start space-x-2.5 p-2 rounded-xl cursor-pointer transition-colors border ${
                          substitutionPolicy === opt.key
                            ? 'bg-emerald-50/80 border-brand-300 text-brand-950 font-semibold'
                            : 'bg-white border-slate-200/70 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="substitution"
                          value={opt.key}
                          checked={substitutionPolicy === opt.key}
                          onChange={() => setSubstitutionPolicy(opt.key as SubstitutionPolicy)}
                          className="mt-0.5 accent-brand-600"
                        />
                        <div>
                          <span className="block text-[11px] font-bold">{opt.title}</span>
                          <span className="block text-[10px] text-slate-500">{opt.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Promo Code Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                    <Tag className="w-3.5 h-3.5 text-citrus-600" />
                    <span>Promo & Coupons</span>
                  </div>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div>
                        <span className="font-extrabold text-emerald-800 font-mono">
                          {appliedPromo.code}
                        </span>
                        <span className="text-[11px] text-emerald-600 block">
                          {appliedPromo.title}
                        </span>
                      </div>
                      <button
                        onClick={removePromo}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Try FIRST100, FMCG20"
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 uppercase font-mono focus:outline-none focus:border-brand-500"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoMsg && !appliedPromo && (
                    <p className="text-[11px] text-amber-600 mt-1.5 font-medium">{promoMsg}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer & Total Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-3">
              {/* Savings callout */}
              {cartSavings > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-brand-600" /> You saved on this order:
                  </span>
                  <span className="text-emerald-700 font-black">₹{cartSavings}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-900 font-mono">₹{cartSubtotal}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-brand-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-₹{promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>10-Min Delivery Fee</span>
                  <span className="font-semibold font-mono">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                  <span>To Pay</span>
                  <span className="font-mono text-base text-brand-700">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
              >
                <span>PROCEED TO CHECKOUT • ₹{cartTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
