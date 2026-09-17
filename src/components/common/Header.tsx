import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  Clock,
  ChevronDown,
  Repeat,
  ShieldCheck,
  Zap,
  Store,
  LayoutDashboard,
  UserCheck,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { performSmartFmcgSearch } from '../../utils/searchEngine';

export const Header: React.FC = () => {
  const {
    products,
    cart,
    cartTotal,
    cartSavings,
    darkStores,
    selectedDarkStore,
    setSelectedDarkStore,
    selectedAddress,
    setIsAddressModalOpen,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    setIsSubscriptionsOpen,
    subscriptions,
    currentRole,
    setCurrentRole,
    setSelectedProductForModal,
    orders,
    currentActiveOrder,
    setIsOrderTrackingOpen,
  } = useStore();

  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeSubsCount = subscriptions.filter((s) => s.status === 'ACTIVE').length;

  // Autocomplete live suggestions
  const liveSearchResults = searchQuery.trim()
    ? performSmartFmcgSearch(products, searchQuery).slice(0, 5)
    : [];

  const quickSearchSuggestions = [
    'surf 2kg',
    'atta 5kg',
    'amul milk',
    'toor dal',
    'ghee 1L',
    'maggi',
    'parle-g',
  ];

  // Close search preview on outside click and bind '/' shortcut
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Utility Bar */}
      <div className="bg-slate-950 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-emerald-400 font-semibold tracking-wide">
            <Zap className="w-3.5 h-3.5 mr-1 animate-pulse" /> 10-MIN FULFILLMENT GUARANTEE
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">
            FMCG Direct Dark Store Network: {selectedDarkStore.name} ({selectedDarkStore.deliveryEstimateMinutes} mins away)
          </span>
        </div>

        {/* View / Role Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 hidden sm:inline text-[11px]">Role View:</span>
          <div className="inline-flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setCurrentRole('customer')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentRole === 'customer'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setCurrentRole('picker')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all flex items-center ${
                currentRole === 'picker'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3 mr-1" /> Dark Store Picker
            </button>
            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all flex items-center ${
                currentRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3 h-3 mr-1" /> Admin Hub
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center space-x-6 shrink-0">
          <div
            onClick={() => {
              setCurrentRole('customer');
              setSearchQuery('');
            }}
            className="cursor-pointer group flex items-center space-x-2.5 select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-current text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-['Outfit']">
                  Velox<span className="text-brand-600">Mart</span>
                </span>
                <span className="bg-citrus-100 text-citrus-700 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  FMCG
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
                10-Minute Supermarket
              </p>
            </div>
          </div>

          {/* Location & Dark Store Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="text-left flex items-center space-x-2 py-1.5 px-3 rounded-xl border border-slate-200 hover:border-brand-500/50 hover:bg-emerald-50/40 transition-all text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="max-w-[170px]">
                <div className="flex items-center text-[11px] font-bold text-slate-900">
                  <span className="truncate">{selectedAddress.area || selectedDarkStore.area}</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400 shrink-0" />
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center">
                  <Clock className="w-3 h-3 mr-0.5" />
                  <span>{selectedDarkStore.deliveryEstimateMinutes} mins • {selectedDarkStore.code}</span>
                </div>
              </div>
            </button>

            {/* Dark Store Dropdown */}
            {isStoreDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center">
                    <Store className="w-3.5 h-3.5 mr-1.5 text-brand-600" /> Select Dark Store Hub
                  </span>
                  <button
                    onClick={() => setIsStoreDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {darkStores.map((ds) => (
                    <button
                      key={ds.id}
                      onClick={() => {
                        setSelectedDarkStore(ds);
                        setIsStoreDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all text-xs flex items-start justify-between ${
                        selectedDarkStore.id === ds.id
                          ? 'bg-emerald-50 border border-brand-300 text-brand-900'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900">{ds.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{ds.address}</p>
                        <span className="inline-flex items-center text-[10px] font-medium text-emerald-600 mt-1">
                          ⚡ {ds.deliveryEstimateMinutes} mins • {ds.distanceKm} km away
                        </span>
                      </div>
                      {selectedDarkStore.id === ds.id && (
                        <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsStoreDropdownOpen(false);
                      setIsAddressModalOpen(true);
                    }}
                    className="w-full py-1.5 text-center text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    + Change Delivery Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Smart Search Bar */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl relative">
          <div
            className={`flex items-center bg-slate-100/90 rounded-2xl px-3.5 py-2.5 transition-all border ${
              isSearchFocused
                ? 'bg-white border-brand-500 shadow-md ring-2 ring-brand-500/20'
                : 'border-transparent hover:bg-slate-200/70'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search groceries, brands & products (e.g. 'surf 2kg', 'atta', 'amul')..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-200/70 rounded border border-slate-300">
                /
              </kbd>
            )}
          </div>

          {/* Autocomplete & Smart Results Overlay */}
          {isSearchFocused && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              {searchQuery.trim() ? (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Top Matches ({liveSearchResults.length})
                  </div>
                  {liveSearchResults.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {liveSearchResults.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setSelectedProductForModal(prod);
                            setIsSearchFocused(false);
                          }}
                          className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                                {prod.name}
                              </p>
                              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                                <span className="font-medium text-brand-600">{prod.brand}</span>
                                <span>•</span>
                                <span>{prod.packSize}</span>
                                <span>•</span>
                                <span className="font-mono text-slate-400">{prod.unitPriceString}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-slate-900">₹{prod.price}</span>
                            <span className="text-[10px] text-slate-400 line-through block">
                              ₹{prod.mrp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No FMCG product found matching "{searchQuery}". Try "atta", "milk", or "surf".
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Popular FMCG Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickSearchSuggestions.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          setIsSearchFocused(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 text-xs text-slate-700 font-medium transition-all"
                      >
                        🔍 {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Active Order Tracker Shortcut */}
          {(currentActiveOrder || orders.length > 0) && (
            <button
              onClick={() => {
                if (!currentActiveOrder && orders.length > 0) {
                  useStore().setCurrentActiveOrder(orders[0]);
                }
                setIsOrderTrackingOpen(true);
              }}
              className="relative hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors border border-emerald-200"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Track Order</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />
            </button>
          )}

          {/* Subscriptions Button */}
          <button
            onClick={() => setIsSubscriptionsOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-emerald-50 text-slate-700 font-semibold text-xs transition-colors"
            title="Recurring Daily / Weekly Grocery Subscriptions"
          >
            <Repeat className="w-4 h-4 text-brand-600" />
            <span>Subscriptions</span>
            {activeSubsCount > 0 && (
              <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {activeSubsCount}
              </span>
            )}
          </button>

          {/* Cart Floating / Header Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-citrus-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-brand-600 animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </div>

            <div className="text-left hidden sm:block">
              {totalCartItems > 0 ? (
                <>
                  <div className="text-white text-xs font-black leading-tight">
                    ₹{cartTotal}
                  </div>
                  {cartSavings > 0 && (
                    <div className="text-[10px] text-emerald-100 font-semibold leading-tight">
                      Saved ₹{cartSavings}
                    </div>
                  )}
                </>
              ) : (
                <span className="font-bold text-xs">My Cart</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
