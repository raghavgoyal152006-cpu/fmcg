import React, { useEffect } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { handleImageError } from '../../utils/imageUtils';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    products,
    cart,
    addToCart,
    updateCartQty,
    selectedDarkStore,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProductForModal) {
        setSelectedProductForModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProductForModal, setSelectedProductForModal]);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const cartItem = cart.find((item) => item.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const availableStock = product.stockQuantity - product.reservedQuantity;
  const isOutOfStock = availableStock <= 0;
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Frequently bought items
  const frequentlyBought = (product.frequentlyBoughtWith || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  const bundleTotal = product.price + frequentlyBought.reduce((sum, item) => sum + item.price, 0);

  const handleAddBundle = () => {
    addToCart(product, 1);
    frequentlyBought.forEach((p) => addToCart(p, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">SKU: {product.sku}</span>
          </div>
          <button
            onClick={() => setSelectedProductForModal(null)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Product Imagery */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, product.category)}
                />
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-citrus-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-sm">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Verified FMCG Indicators */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-2">
                <div className="flex items-center text-emerald-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-brand-600 shrink-0" />
                  <span>100% Genuine Direct from Brand</span>
                </div>
                <div className="flex items-center text-emerald-900 font-semibold">
                  <Truck className="w-4 h-4 mr-1.5 text-brand-600 shrink-0" />
                  <span>Fulfillment in {selectedDarkStore.deliveryEstimateMinutes} mins from {selectedDarkStore.code}</span>
                </div>
                <div className="flex items-center text-emerald-900 font-semibold">
                  <Calendar className="w-4 h-4 mr-1.5 text-brand-600 shrink-0" />
                  <span>Expiry: {product.expiryDate} (Batch: {product.batchNumber})</span>
                </div>
              </div>
            </div>

            {/* Right: Pricing, Description, Nutrition & Add */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-['Outfit']">
                  {product.name}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-lg">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 ml-1 fill-current text-emerald-700" />
                  </div>
                  <span className="text-xs text-slate-500">({product.reviewCount} verified reviews)</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {product.packSize}
                  </span>
                </div>
              </div>

              {/* Price Row */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 font-mono">
                    Unit Price: <span className="text-slate-800 font-bold">{product.unitPriceString}</span>
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-sm text-slate-400 line-through">₹{product.mrp}</span>
                    )}
                    {product.mrp > product.price && (
                      <span className="text-xs font-bold text-emerald-600">
                        (Save ₹{product.mrp - product.price})
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper or Add button */}
                <div>
                  {isOutOfStock ? (
                    <span className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200">
                      Out of Stock
                    </span>
                  ) : qtyInCart > 0 ? (
                    <div className="flex items-center bg-brand-600 text-white rounded-xl shadow-sm px-2 py-1">
                      <button
                        onClick={() => updateCartQty(product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-brand-700 rounded-lg text-white font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-black select-none">
                        {qtyInCart}
                      </span>
                      <button
                        onClick={() => updateCartQty(product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-brand-700 rounded-lg text-white font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-md shadow-brand-600/20 active:scale-95 transition-all"
                    >
                      ADD TO CART
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                <span className="font-bold text-slate-900 block">Product Overview</span>
                <p>{product.description}</p>
              </div>

              {/* Nutritional Breakdown if available */}
              {product.nutritionalInfo && (
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                  <span className="text-xs font-bold text-slate-900 block mb-1.5 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-citrus-600" /> Nutritional Facts (Per 100g)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {Object.entries(product.nutritionalInfo).map(([key, val]) => (
                      <div key={key} className="bg-white/80 p-1.5 rounded-lg border border-amber-100">
                        <span className="text-slate-500 text-[10px] block">{key}</span>
                        <span className="font-bold text-slate-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regulated Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-700 block">Manufacturer</span>
                  <span className="truncate block">{product.manufacturer}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-700 block">Country of Origin</span>
                  <span>{product.countryOfOrigin}</span>
                </div>
              </div>

              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Allergens: {product.allergens.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Frequently Bought Together Bundle */}
          {frequentlyBought.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
                  <Layers className="w-4 h-4 mr-1.5 text-brand-600" /> Frequently Bought Together
                </h3>
                <span className="text-xs font-bold text-brand-700">Combo Price: ₹{bundleTotal}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold text-slate-400">+</span>
                  {frequentlyBought.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-slate-600 pl-2">
                    <p className="font-semibold text-slate-800">
                      {product.name.slice(0, 18)}... + {frequentlyBought.length} more
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddBundle}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors shrink-0 flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD COMBO TO CART</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
