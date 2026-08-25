// India Hyundai Power - Shop Catalog Page

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Footer from '../components/Footer.jsx';
import { dbStore } from '../data/dbStore.js';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, Grid, List } from 'lucide-react';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setProducts(dbStore.getProducts());
    setCategories(dbStore.getCategories());
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      product.categoryId === selectedCategory ||
      product.slug === selectedCategory ||
      product.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'warranty') return b.warranty.localeCompare(a.warranty);
    return 0; // featured
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      
      <div>
        {/* Banner */}
        <div className="bg-[#002C6C] text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black">India Hyundai Power Shop</h1>
            <p className="text-xs sm:text-sm text-blue-200">
              Browse genuine Hyundai Power batteries for cars, inverters, motorcycles, and commercial vehicles.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filters */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
                
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#0066B1]" /> Filters
                  </h3>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setMaxPrice(25000);
                      setSortBy('featured');
                    }}
                    className="text-[11px] text-blue-600 font-semibold hover:underline"
                  >
                    Reset All
                  </button>
                </div>

                {/* Search Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Search Battery</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Model, Ah, SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1] focus:bg-white"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Categories Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Battery Category</label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                        selectedCategory === 'all'
                          ? 'bg-[#002C6C] text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All Categories ({products.length})
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                          selectedCategory === c.id || selectedCategory === c.slug
                            ? 'bg-[#002C6C] text-white font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Max Price</span>
                    <span className="text-[#002C6C]">₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#0066B1]"
                  />
                </div>

              </div>
            </div>

            {/* Product Grid Area */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Header bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> results
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="featured">Featured Models</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="warranty">Warranty Duration</option>
                  </select>
                </div>
              </div>

              {/* Products List */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <Search className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-sm">No battery models match your filter criteria</h3>
                  <p className="text-xs text-slate-500">Try adjusting your category or price range filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={(prod) => navigate(`/product/${prod.slug}`)}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
