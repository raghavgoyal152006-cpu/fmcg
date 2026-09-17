import React from 'react';
import { RotateCw, Plus, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { handleImageError } from '../../utils/imageUtils';

export const BuyAgainSection: React.FC = () => {
  const { products, cart, addToCart, setSelectedProductForModal } = useStore();

  // Weekly staple IDs: Milk, Bread, Eggs, Tea, Biscuits, Atta
  const repeatItemIds = ['fmcg-011', 'fmcg-014', 'fmcg-015', 'fmcg-016', 'fmcg-020', 'fmcg-001'];
  const buyAgainProducts = products.filter((p) => repeatItemIds.includes(p.id));

  const handleAddAll = () => {
    buyAgainProducts.forEach((prod) => {
      addToCart(prod, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 border border-emerald-200/80 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-brand-600 text-white shadow-xs">
                <RotateCw className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit']">
                Buy Again — Weekly Essentials
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Running low on your household staples? Re-order your weekly basket in 1 tap.
            </p>
          </div>

          <button
            onClick={handleAddAll}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ADD ALL TO CART ({buyAgainProducts.length} ITEMS)</span>
          </button>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {buyAgainProducts.map((prod) => {
            const inCart = cart.find((i) => i.product.id === prod.id);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-2.5 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedProductForModal(prod)}
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2 relative">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => handleImageError(e, prod.category)}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {prod.packSize}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-brand-700 uppercase">{prod.brand}</p>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600">
                    {prod.name}
                  </h4>
                </div>

                <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">₹{prod.price}</span>
                  {inCart ? (
                    <span className="text-[10px] font-bold text-brand-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-lg border border-brand-200">
                      <Check className="w-3 h-3 mr-0.5" /> Added ({inCart.quantity})
                    </span>
                  ) : (
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="text-[11px] font-extrabold text-brand-600 hover:bg-brand-600 hover:text-white px-2 py-1 rounded-lg border border-brand-500 transition-colors"
                    >
                      + ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
