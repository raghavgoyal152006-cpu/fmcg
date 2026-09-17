import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  Tag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Check,
  X,
  RotateCw,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Store,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    updateProductStock,
    triggerReorderStock,
    orders,
    updateOrderStatus,
    advanceOrderStatus,
    promotions,
    addPromotion,
    adminStats,
    darkStores,
    selectedDarkStore,
    setCurrentRole,
    currentRole,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'inventory' | 'orders' | 'promotions' | 'analytics'>(
    currentRole === 'picker' ? 'orders' : 'overview'
  );

  // Search in admin tables
  const [adminSearch, setAdminSearch] = useState('');

  // Add Product Form Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('staples');
  const [newProdPack, setNewProdPack] = useState('');
  const [newProdMrp, setNewProdMrp] = useState(100);
  const [newProdPrice, setNewProdPrice] = useState(85);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdUnitString, setNewProdUnitString] = useState('₹85.00/kg');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  );

  // Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Create Promo State
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoType, setPromoType] = useState<'PERCENTAGE' | 'FLAT' | 'FREE_DELIVERY'>('PERCENTAGE');
  const [promoVal, setPromoVal] = useState(15);
  const [promoMin, setPromoMin] = useState(499);

  // Stock edit popup state
  const [stockAdjustmentId, setStockAdjustmentId] = useState<string | null>(null);
  const [newStockQty, setNewStockQty] = useState(0);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand || !newProdPack) return;

    addProduct({
      name: newProdName,
      brand: newProdBrand,
      category: newProdCategory,
      subCategory: 'General FMCG',
      packSize: newProdPack,
      unitQuantity: 1,
      unitType: 'kg',
      mrp: Number(newProdMrp),
      price: Number(newProdPrice),
      unitPriceString: newProdUnitString || `₹${newProdPrice}`,
      images: [newProdImage],
      description: `${newProdBrand} ${newProdName} verified FMCG pack for fast supermarket fulfillment.`,
      countryOfOrigin: 'India',
      manufacturer: `${newProdBrand} Consumer Goods Ltd`,
      rating: 4.8,
      reviewCount: 1,
      stockQuantity: Number(newProdStock),
      reservedQuantity: 0,
      reorderLevel: 15,
      batchNumber: `VM-${Date.now().toString().slice(-5)}`,
      expiryDate: '2027-01-01',
      isFastMover: false,
      dailyVelocity: 5,
      tags: [newProdBrand.toLowerCase(), newProdCategory.toLowerCase()],
      shelfLife: '12 Months',
      isVeg: true,
    });

    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdBrand('');
    setNewProdPack('');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      price: editingProduct.price,
      mrp: editingProduct.mrp,
      packSize: editingProduct.packSize,
      unitPriceString: editingProduct.unitPriceString,
      isFastMover: editingProduct.isFastMover,
    });
    setEditingProduct(null);
  };

  const handleCreatePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || !promoTitle) return;

    addPromotion({
      code: promoCode.toUpperCase(),
      title: promoTitle,
      description: `${promoType === 'PERCENTAGE' ? `${promoVal}% OFF` : `Flat ₹${promoVal} OFF`} on orders above ₹${promoMin}`,
      discountType: promoType,
      discountValue: Number(promoVal),
      minOrderValue: Number(promoMin),
      validUntil: '2026-12-31',
      isActive: true,
    });

    setIsAddPromoOpen(false);
    setPromoCode('');
    setPromoTitle('');
  };

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white font-['Outfit']">
                VeloxMart <span className="text-indigo-400">Operations Control</span>
              </span>
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                {currentRole === 'picker' ? 'PICKER TERMINAL' : 'EXECUTIVE ADMIN'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Active Hub: {selectedDarkStore.name} ({selectedDarkStore.code})
            </span>
          </div>
        </div>

        {/* Tab Controls & Customer Switcher */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentRole('customer')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <span>← Back to Customer Store</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-2 flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs font-semibold">
        {[
          { key: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
          { key: 'orders', label: `Live Orders & Picking (${orders.length})`, icon: Truck },
          { key: 'inventory', label: `Inventory & Dark Store Hub (${products.length} SKUs)`, icon: Boxes },
          { key: 'catalog', label: 'Catalog Manager', icon: Package },
          { key: 'promotions', label: `Promotions & Offers (${promotions.length})`, icon: Tag },
          { key: 'analytics', label: 'FMCG Intelligence & Velocity', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Today's Gross GMV
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-white font-mono">
                    ₹{adminStats.todaySales.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">+15.4%</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Fulfilled via {selectedDarkStore.code} & dark store network
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Orders Today
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-white font-mono">
                    {adminStats.todayOrders}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">10-min avg SLA</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {orders.filter((o) => o.status !== 'DELIVERED').length} active in pipeline
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Average Order Value (AOV)
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-white font-mono">₹{adminStats.aov}</span>
                  <span className="text-xs font-bold text-emerald-400">High Pantry Density</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Avg 4.8 items per customer cart
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Inventory Alerts
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {adminStats.lowStockCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Low Stock SKUs</span>
                </div>
                <span className="text-[11px] text-red-400 mt-1 block">
                  {adminStats.stockOutCount} SKUs currently out of stock
                </span>
              </div>
            </div>

            {/* Operational Dark Store Status */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center">
                  <Store className="w-4 h-4 mr-2 text-indigo-400" /> Dark Store Fulfillment Hubs
                </h3>
                <span className="text-xs text-emerald-400 font-semibold">
                  All 3 Hubs Operational • Optimal SLA (9.8 min avg)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {darkStores.map((ds) => (
                  <div
                    key={ds.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{ds.name}</span>
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                        {ds.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{ds.address}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <span>Pickers on floor: {ds.activePickers}</span>
                      <span className="text-emerald-400 font-bold">⚡ {ds.deliveryEstimateMinutes} min SLA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: LIVE ORDERS & PICKING ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  Live Dark Store Orders & Picking Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Manage real-time order progression from Confirmed → Picking → Packed → Out for Delivery → Delivered.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-800">
                <Truck className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-400">No active customer orders placed yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Place an order in the Customer Store to see live real-time picking operations here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-white font-mono">
                            Order #{ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : ord.status === 'OUT_FOR_DELIVERY'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Placed at: {new Date(ord.createdAt).toLocaleTimeString()} • Deliver to: {ord.deliveryAddress.name} ({ord.deliveryAddress.area})
                        </p>
                      </div>

                      {/* Transition Action */}
                      <div className="flex items-center space-x-2">
                        {ord.status !== 'DELIVERED' && (
                          <button
                            onClick={() => advanceOrderStatus(ord.id)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                          >
                            <span>Advance Status →</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Customer Out-of-Stock Substitution Preference */}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs flex items-center justify-between">
                      <span className="text-slate-400">
                        Customer Substitution Policy:{' '}
                        <strong className="text-emerald-400 font-semibold">
                          {ord.substitutionPolicy.replace(/_/g, ' ')}
                        </strong>
                      </span>
                      <span className="text-slate-400">
                        Hub: <strong className="text-white">{ord.darkStore.name}</strong>
                      </span>
                    </div>

                    {/* Items Checklist for Picker */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Picker Item Verification Checklist:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {ord.items.map((item) => (
                          <div
                            key={item.productId}
                            className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                              <div className="truncate">
                                <p className="font-bold text-white truncate">{item.productName}</p>
                                <span className="text-[10px] text-slate-400">
                                  {item.packSize} • Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-400 shrink-0 ml-2">
                              ₹{item.totalPrice}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer with totals */}
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Payment: <strong className="text-white">{ord.paymentMethod} ({ord.paymentStatus})</strong>
                      </span>
                      <span className="text-sm font-black text-white font-mono">
                        Total: ₹{ord.totalAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: INVENTORY ENGINE ===================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  FMCG Inventory Engine & Reorder Signals
                </h3>
                <p className="text-xs text-slate-400">
                  Formula: <strong>Available Stock = Physical Stock − Reserved Stock</strong>. Automatic reorder recommendations based on sales velocity.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter inventory SKU or name..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 w-64"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">SKU & Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Physical Stock</th>
                      <th className="p-3.5">Reserved</th>
                      <th className="p-3.5">Available Stock</th>
                      <th className="p-3.5">Daily Velocity</th>
                      <th className="p-3.5">Coverage / Reorder</th>
                      <th className="p-3.5 text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredProducts.map((p) => {
                      const available = p.stockQuantity - p.reservedQuantity;
                      const daysCoverage =
                        p.dailyVelocity > 0 ? (available / p.dailyVelocity).toFixed(1) : '30+';
                      const isStockout = available <= 0;
                      const isLow = available > 0 && available <= p.reorderLevel;

                      return (
                        <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-cover bg-slate-900 shrink-0"
                              />
                              <div>
                                <span className="font-mono text-[10px] text-indigo-400 block">
                                  {p.sku}
                                </span>
                                <span className="font-bold text-white line-clamp-1">{p.name}</span>
                                <span className="text-[10px] text-slate-400">
                                  {p.packSize} • Expiry: {p.expiryDate}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-300 font-semibold capitalize">
                            {p.category.replace('-', ' ')}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-white">
                            {p.stockQuantity}
                          </td>
                          <td className="p-3.5 font-mono text-amber-400 font-bold">
                            {p.reservedQuantity}
                          </td>
                          <td className="p-3.5 font-mono">
                            <span
                              className={`px-2 py-0.5 rounded font-black text-xs ${
                                isStockout
                                  ? 'bg-red-950 text-red-300 border border-red-800'
                                  : isLow
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {available}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">
                            {p.dailyVelocity} units/day
                          </td>
                          <td className="p-3.5">
                            {isStockout ? (
                              <span className="text-[10px] font-black text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                                OUT OF STOCK
                              </span>
                            ) : isLow ? (
                              <div>
                                <span className="text-[10px] font-black text-amber-400">
                                  ⚠️ {daysCoverage} days left
                                </span>
                                <span className="text-[9px] text-slate-400 block">
                                  Reorder Recommended
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">
                                {daysCoverage} days coverage
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => triggerReorderStock(p.id, 25)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-colors"
                            >
                              + Restock 25
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: CATALOG MANAGER ===================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  FMCG Catalog & SKU Management
                </h3>
                <p className="text-xs text-slate-400">
                  Update selling prices, MRPs, pack sizes, and add new SKUs with batch codes.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New FMCG SKU</span>
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                      />
                      <div>
                        <span className="font-mono text-[10px] text-indigo-400 block">
                          {prod.sku}
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                        <span className="text-[11px] text-slate-400">
                          {prod.brand} • {prod.packSize}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingProduct(prod)}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      title="Edit pricing"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {prod.unitPriceString}
                      </span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="font-bold text-white text-sm font-mono">₹{prod.price}</span>
                        <span className="text-[10px] text-slate-500 line-through">₹{prod.mrp}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Stock: {prod.stockQuantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: PROMOTIONS ENGINE ===================== */}
        {activeTab === 'promotions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  FMCG Promotions & Discounts Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Configure cart offers, percentage coupons, flat grocery vouchers, and free delivery thresholds.
                </p>
              </div>

              <button
                onClick={() => setIsAddPromoOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Promotion</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((prm) => (
                <div
                  key={prm.id}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-indigo-300 bg-indigo-950/80 border border-indigo-800 px-2.5 py-1 rounded-lg">
                      {prm.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      ACTIVE
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{prm.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{prm.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span>Min Order: ₹{prm.minOrderValue}</span>
                    <span>Used: {prm.usageCount} times</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 6: ANALYTICS & VELOCITY ===================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-white font-['Outfit']">
              FMCG Velocity Intelligence & Category Heatmap
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fast Moving SKUs */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5" /> High-Velocity Fast Movers
                </span>
                <div className="space-y-3">
                  {products
                    .filter((p) => p.isFastMover)
                    .slice(0, 5)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{p.name}</p>
                            <span className="text-[10px] text-slate-400">{p.brand}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-xs shrink-0 ml-2">
                          {p.dailyVelocity} / day
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Slow Moving SKUs */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" /> Slow Moving SKUs (Reorder Caution)
                </span>
                <div className="space-y-3">
                  {products
                    .filter((p) => !p.isFastMover)
                    .slice(0, 5)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{p.name}</p>
                            <span className="text-[10px] text-slate-400">{p.brand}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-400 text-xs shrink-0 ml-2">
                          {p.dailyVelocity} / day
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Price Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-sm">Edit FMCG Pricing & Pack</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400 font-bold">{editingProduct.name}</p>

            <form onSubmit={handleSaveEditProduct} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Selling Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">MRP (₹)</label>
                <input
                  type="number"
                  value={editingProduct.mrp}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Unit Price String</label>
                <input
                  type="text"
                  value={editingProduct.unitPriceString}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, unitPriceString: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New FMCG SKU Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-sm">Add New FMCG SKU to Catalog</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffola Active Cooking Oil 1L"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saffola"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="staples">Atta, Rice & Staples</option>
                    <option value="oils-ghee">Edible Oils & Ghee</option>
                    <option value="dals-pulses">Dals & Pulses</option>
                    <option value="dairy-breakfast">Dairy & Breakfast</option>
                    <option value="beverages">Tea, Coffee & Drinks</option>
                    <option value="snacks-biscuits">Snacks & Biscuits</option>
                    <option value="cleaning-home">Cleaning & Home Care</option>
                    <option value="personal-care">Personal Care & Hygiene</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pack Size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 L"
                    value={newProdPack}
                    onChange={(e) => setNewProdPack(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdMrp}
                    onChange={(e) => setNewProdMrp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Unit Price String</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹165.00/L"
                    value={newProdUnitString}
                    onChange={(e) => setNewProdUnitString(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Initial Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Publish SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Promotion Modal */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-sm">Create New Promotion</h3>
              <button
                onClick={() => setIsAddPromoOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePromoSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON30"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% Off All Staples"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Type</label>
                  <select
                    value={promoType}
                    onChange={(e) => setPromoType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat (₹)</option>
                    <option value="FREE_DELIVERY">Free Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={promoVal}
                    onChange={(e) => setPromoVal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Minimum Order (₹)</label>
                <input
                  type="number"
                  value={promoMin}
                  onChange={(e) => setPromoMin(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddPromoOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Activate Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
