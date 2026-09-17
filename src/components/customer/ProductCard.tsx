import React from 'react';
import { Plus, Minus, Check, Clock, AlertTriangle, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { handleImageError } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart,
    addToCart,
    updateCartQty,
    setSelectedProductForModal,
  } = useStore();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const availableStock = product.stockQuantity - product.reservedQuantity;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= product.reorderLevel;

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden p-3.5 ${
      qtyInCart > 0
        ? 'border-brand-500/60 shadow-md ring-1 ring-brand-500/20'
        : 'border-slate-200/90 hover:border-brand-500/50 hover:shadow-card-hover'
    }`}>
      {/* Top Media & Badges */}
      <div>
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3 cursor-pointer shine-effect">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedProductForModal(product)}
            onError={(e) => handleImageError(e, product.category)}
            loading="lazy"
          />

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForModal(product);
            }}
            className="absolute inset-x-3 bottom-3 py-1.5 px-3 bg-white/95 backdrop-blur-md rounded-xl text-slate-800 text-xs font-semibold shadow-md flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-3.5 h-3.5 text-brand-600" />
            <span>Quick View</span>
          </button>

          {/* Discount Tag */}
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-citrus-500 to-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
              {discountPercent}% OFF
            </div>
          )}

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-xs">
            <div
              className={`w-3.5 h-3.5 border ${
                product.isVeg === false ? 'border-red-600' : 'border-emerald-600'
              } flex items-center justify-center p-0.5`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  product.isVeg === false ? 'bg-red-600' : 'bg-emerald-600'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Brand & Pack Size */}
        <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
          <span className="font-bold text-brand-700 tracking-wide uppercase truncate">
            {product.brand}
          </span>
          <span className="shrink-0 bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[10px]">
            {product.packSize}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => setSelectedProductForModal(product)}
          className="text-xs sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2 hover:text-brand-600 cursor-pointer transition-colors mb-2 h-9"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Shelf Life / Delivery Speed */}
        <div className="flex items-center text-[10px] text-slate-500 font-medium mb-2.5">
          <Clock className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
          <span className="truncate">{product.shelfLife}</span>
        </div>
      </div>

      {/* Pricing & Cart Action Area */}
      <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
        <div>
          {/* Unit Price (Mandatory FMCG transparency) */}
          <div className="text-[11px] font-semibold text-slate-500 font-mono leading-none mb-1">
            {product.unitPriceString}
          </div>

          {/* Selling Price & Strike-through MRP */}
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-slate-400 line-through leading-none">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* Stock Alert indicator */}
          {isOutOfStock ? (
            <span className="text-[10px] font-bold text-red-600 flex items-center mt-1">
              <AlertTriangle className="w-3 h-3 mr-0.5" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-semibold text-amber-600 mt-1 block">
              Only {availableStock} left
            </span>
          ) : (
            <span className="text-[10px] font-medium text-emerald-600 flex items-center mt-1">
              <Check className="w-3 h-3 mr-0.5" /> In Stock
            </span>
          )}
        </div>

        {/* Add / Stepper Button */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed uppercase"
            >
              Sold Out
            </button>
          ) : qtyInCart > 0 ? (
            <div className="flex items-center bg-brand-600 text-white rounded-xl shadow-sm px-1 py-0.5">
              <button
                onClick={() => updateCartQty(product.id, -1)}
                className="w-6 h-7 flex items-center justify-center hover:bg-brand-700 rounded-lg text-white font-bold transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-black select-none">
                {qtyInCart}
              </span>
              <button
                onClick={() => updateCartQty(product.id, 1)}
                className="w-6 h-7 flex items-center justify-center hover:bg-brand-700 rounded-lg text-white font-bold transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-3.5 py-1.5 rounded-xl border-2 border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-white font-extrabold text-xs transition-all shadow-xs active:scale-95 flex items-center space-x-1"
            >
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
