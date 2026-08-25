import React, { useState } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Zap, 
  Check, 
  Search
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from './ProductCard';

export function ProductGrid({ 
  products, 
  selectedCategory, 
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onQuickView,
  compareItems,
  onToggleCompare,
  currency
}) {
  const [selectedVoltage, setSelectedVoltage] = useState('all');
  const [selectedChemistry, setSelectedChemistry] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter products logic
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSub = p.subtitle.toLowerCase().includes(q);
      const matchChem = p.chemistry.toLowerCase().includes(q);
      const matchVolt = p.voltage.toLowerCase().includes(q);
      const matchCompat = p.compatibility.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchSub && !matchChem && !matchVolt && !matchCompat) return false;
    }

    if (selectedVoltage !== 'all' && !p.voltage.toLowerCase().includes(selectedVoltage.toLowerCase())) return false;
    if (selectedChemistry !== 'all' && !p.chemistry.toLowerCase().includes(selectedChemistry.toLowerCase())) return false;
    if (p.price > maxPrice) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'cycles') {
      const getCycles = (str) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
      return getCycles(b.cycleLife) - getCycles(a.cycleLife);
    }
    return 0;
  });

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedVoltage('all');
    setSelectedChemistry('all');
    setSearchQuery('');
    setMaxPrice(3000);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedVoltage !== 'all' || selectedChemistry !== 'all' || searchQuery !== '' || maxPrice < 3000;

  return (
    <section id="products-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Category Pills Navigation Bar (Electrent Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 border-b border-slate-200">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-outfit whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedCategory === 'all'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>All Battery Systems ({products.length})</span>
        </button>

        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-outfit whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800"
          >
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
          </button>

          <p className="text-xs text-slate-600 font-mono">
            Showing <strong className="text-slate-900 font-sans font-bold">{filteredProducts.length}</strong> lithium battery & inverter solutions
          </p>

          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* Sort Selection */}
        <div className="flex items-center gap-2 text-xs bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5">
          <span className="text-slate-500 font-mono">Sort By:</span>
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured & Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
            <option value="cycles">Maximum Cycle Life</option>
          </select>
        </div>
      </div>

      {/* Catalog Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Filter Sidebar */}
        <div className={`lg:col-span-3 space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" /> Filter Solutions
              </span>
            </div>

            {/* Voltage Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-600 uppercase">System Voltage</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', '12V', '24V', '36V', '48V', '51.2V'].map(v => (
                  <button
                    key={v}
                    onClick={() => setSelectedVoltage(v)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedVoltage === v 
                        ? 'bg-slate-950 text-white' 
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {v === 'all' ? 'All V' : v}
                  </button>
                ))}
              </div>
            </div>

            {/* Chemistry Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-600 uppercase">Battery Tech</label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Technologies' },
                  { id: 'LiFePO4', label: 'LiFePO4 (Lithium Iron)' },
                  { id: 'AGM', label: 'AGM (Absorbent Glass)' },
                  { id: 'NMC', label: 'NMC Lithium Ion' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChemistry(c.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedChemistry === c.id 
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' 
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{c.label}</span>
                    {selectedChemistry === c.id && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-600 uppercase">Max Budget</span>
                <span className="font-mono font-extrabold text-emerald-700">${maxPrice}</span>
              </div>
              <input 
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <Zap className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-xl font-bold font-outfit text-slate-800">No matching battery models found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or resetting your search term to view our full lithium inverter catalog.
              </p>
              <button 
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-lg bg-slate-950 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  isCompared={compareItems.some(i => i.id === product.id)}
                  onToggleCompare={onToggleCompare}
                  currency={currency}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
