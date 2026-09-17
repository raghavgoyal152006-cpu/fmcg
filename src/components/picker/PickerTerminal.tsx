import React, { useState } from 'react';
import {
  UserCheck,
  Package,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PickerTerminal: React.FC = () => {
  const {
    orders,
    advanceOrderStatus,
    selectedDarkStore,
    setCurrentRole,
  } = useStore();

  const [pickedItemsMap, setPickedItemsMap] = useState<Record<string, boolean>>({});

  // Active picking orders
  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED');

  const togglePicked = (orderId: string, productId: string) => {
    const key = `${orderId}-${productId}`;
    setPickedItemsMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-['Outfit']">
              Dark Store Picker Handheld Terminal
            </h2>
            <p className="text-xs text-slate-400">
              Station: {selectedDarkStore.name} ({selectedDarkStore.code}) • SLA Target: 3.5 min pick time
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentRole('customer')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
        >
          ← Return to Storefront
        </button>
      </div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-800 space-y-3">
          <Package className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No active picking orders in queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All orders for {selectedDarkStore.code} have been picked, packed, and handed over to delivery partners.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-800 border border-slate-700 rounded-3xl p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <span className="font-mono text-sm font-black text-white">
                    Order #{order.orderNumber}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                    <span>{order.items.length} SKUs</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold uppercase">{order.status}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Sub Policy:</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {order.substitutionPolicy.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Items to Pick */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Bin Pick List:
                </span>
                <div className="space-y-2">
                  {order.items.map((item, idx) => {
                    const isPicked = !!pickedItemsMap[`${order.id}-${item.productId}`];
                    const aisleNumber = `Aisle ${(idx % 4) + 1}-Shelf ${((idx * 2) % 6) + 1}`;

                    return (
                      <div
                        key={item.productId}
                        onClick={() => togglePicked(order.id, item.productId)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isPicked
                            ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-200'
                            : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                              isPicked
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                : 'border-slate-600'
                            }`}
                          >
                            {isPicked && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-950"
                          />
                          <div>
                            <p className="text-xs font-bold text-white line-clamp-1">
                              {item.productName}
                            </p>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                              <span className="font-mono text-indigo-300">{aisleNumber}</span>
                              <span>•</span>
                              <span>{item.packSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-amber-400 block">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-[10px] text-slate-500">Scan Barcode</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transition State Button */}
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Quality check verified</span>
                </div>

                <button
                  onClick={() => advanceOrderStatus(order.id)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-amber-600/20"
                >
                  <span>
                    {order.status === 'PLACED'
                      ? 'Begin Picking'
                      : order.status === 'PICKING'
                      ? 'Mark Packed & Inspected'
                      : order.status === 'PACKED'
                      ? 'Handover to Rider'
                      : 'Mark Delivered'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
