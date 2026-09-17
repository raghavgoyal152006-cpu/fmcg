import React from 'react';
import {
  Sparkles,
  Filter,
  ArrowUpDown,
  ChevronRight,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { CategoryBar } from './CategoryBar';
import { BuyAgainSection } from './BuyAgainSection';
import { DealsSection } from './DealsSection';
import { ProductCard } from './ProductCard';
import { performSmartFmcgSearch } from '../../utils/searchEngine';
import { CATEGORIES } from '../../data/mockData';

export const StorefrontView: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrandFilter,
    setSelectedBrandFilter,
    sortBy,
    setSortBy,
    selectedDarkStore,
  } = useStore();

  // Smart Search or Filtered catalog
  let displayedProducts = performSmartFmcgSearch(
    products,
    searchQuery,
    selectedCategory,
    selectedBrandFilter
  );

  // Sorting
  if (sortBy === 'price_low') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    displayedProducts.sort(
      (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
    );
  } else if (sortBy === 'rating') {
    displayedProducts.sort((a, b) => b.rating - a.rating);
  }

  // Extract unique brands for active category/results
  const availableBrands = Array.from(
    new Set(
      (selectedCategory === 'all'
        ? products
        : products.filter((p) => p.category === selectedCategory)
      ).map((p) => p.brand)
    )
  );

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const isFilteringOrSearching = searchQuery.trim().length > 0 || selectedCategory !== 'all' || selectedBrandFilter !== null;

  // Popular Brands List for FMCG credibility
  const popularBrands = [
    { name: 'Amul', logo: '🥛', desc: 'Taste of India' },
    { name: 'Aashirvaad', logo: '🌾', desc: 'Superior Wheat' },
    { name: 'Tata Sampann', logo: '🍲', desc: 'Unpolished Dals' },
    { name: 'Fortune', logo: '🫒', desc: 'Purity in Every Drop' },
    { name: 'Surf Excel', logo: '🧺', desc: 'Matic Laundry' },
    { name: 'Nestle', logo: '🍫', desc: 'Good Food, Good Life' },
    { name: 'Britannia', logo: '🍪', desc: 'Eat Healthy, Think Better' },
    { name: 'Dettol', logo: '🧴', desc: '100% Germ Protection' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Category Navigation Bar */}
      <CategoryBar />

      {!isFilteringOrSearching ? (
        // DEFAULT HOME EXPERIENCE
        <>
          {/* Top Hero Banner */}
          <HeroBanner />

          {/* Buy Again Weekly Essentials */}
          <BuyAgainSection />

          {/* Today's FMCG Deals */}
          <DealsSection />

          {/* Curated Category Section 1: Staples & Flours */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🌾</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                    Atta, Basmati Rice & Dals
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Direct from mills, untouched by hands, unpolished and 100% pure.
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory('staples')}
                className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center"
              >
                <span>View All Staples</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products
                .filter((p) => p.category === 'staples' || p.category === 'dals-pulses')
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          {/* Curated Category Section 2: Dairy, Milk & Breakfast */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🥛</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                    Fresh Dairy & Breakfast
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Chilled pasteurised milk, salted butter, high-protein eggs & whole wheat bread.
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory('dairy-breakfast')}
                className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center"
              >
                <span>View All Dairy</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products
                .filter((p) => p.category === 'dairy-breakfast')
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          {/* Popular FMCG Brands Showcase */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-white font-['Outfit'] flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-citrus-400" /> Popular FMCG Brands
                  </h3>
                  <p className="text-xs text-slate-400">
                    Trusted national FMCG brands available for 10-minute delivery in your area.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {popularBrands.map((b) => (
                  <div
                    key={b.name}
                    onClick={() => {
                      setSelectedBrandFilter(b.name);
                    }}
                    className="p-3 rounded-2xl bg-slate-800/80 hover:bg-emerald-950/80 border border-slate-700 hover:border-brand-500 cursor-pointer transition-all text-center group"
                  >
                    <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
                      {b.logo}
                    </span>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                      {b.name}
                    </p>
                    <span className="text-[10px] text-slate-400 block truncate">{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        // FILTERED / SEARCH CATALOG VIEW
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Header with Title & Sort controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-slate-900 font-['Outfit']">
                  {searchQuery ? `Search Results for "${searchQuery}"` : activeCategoryObj?.name}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {displayedProducts.length} items
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Delivering from {selectedDarkStore.name} ({selectedDarkStore.deliveryEstimateMinutes} mins)
              </p>
            </div>

            {/* Active Filters Clear Badge */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedBrandFilter(null);
                }}
                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Clear All Filters
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold flex items-center">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-1" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="discount">Discount %</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sub-Filters: Brands Pill Row */}
          {availableBrands.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center">
                <Filter className="w-3 h-3 mr-1" /> Brands:
              </span>
              <button
                onClick={() => setSelectedBrandFilter(null)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedBrandFilter === null
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Brands
              </button>
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() =>
                    setSelectedBrandFilter(selectedBrandFilter === brand ? null : brand)
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedBrandFilter === brand
                      ? 'bg-brand-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}

          {/* Catalog Grid */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
              <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No FMCG products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find items matching your search or filters in {selectedDarkStore.name}.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrandFilter(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
