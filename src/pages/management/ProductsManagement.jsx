// India Hyundai Power - Products & Battery Inventory Management

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService } from '../../services/dbService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Package, Search, Plus, Trash2, X, Shield, CheckCircle2, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function ProductsManagement() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Search & Filter Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

  // Sort Controls
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'sku' | 'price' | 'dealerPrice' | 'stock'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmProd, setDeleteConfirmProd] = useState(null);
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    category: 'Automotive Batteries',
    capacity: '65 Ah',
    voltage: '12V',
    warranty: '36 Months',
    price: '',
    dealerPrice: '',
    stockQuantity: '100',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800'
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await dbService.getProducts();
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (currentUser?.role !== 'ADMIN') {
      alert('Unauthorized: Only Administrators can add products to the catalog.');
      return;
    }
    if (!newProd.name || !newProd.sku || !newProd.price) {
      alert('Please fill in Product Name, SKU, and Price.');
      return;
    }

    const payload = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: newProd.sku,
      category: newProd.category,
      brand: 'India Hyundai Power',
      capacity: newProd.capacity,
      voltage: newProd.voltage,
      warranty: newProd.warranty,
      price: parseFloat(newProd.price) || 0,
      dealerPrice: parseFloat(newProd.dealerPrice || newProd.price) || 0,
      stockQuantity: parseInt(newProd.stockQuantity, 10) || 0,
      images: [newProd.image || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800']
    };

    await dbService.createProduct(payload, currentUser);
    setActionSuccess(`Product "${newProd.name}" created successfully!`);
    setShowAddModal(false);
    setNewProd({
      name: '',
      sku: '',
      category: 'Automotive Batteries',
      capacity: '65 Ah',
      voltage: '12V',
      warranty: '36 Months',
      price: '',
      dealerPrice: '',
      stockQuantity: '100',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800'
    });
    setTimeout(() => setActionSuccess(''), 4000);
    loadProducts();
  };

  const handleDeleteProductClick = (product) => {
    if (currentUser?.role !== 'ADMIN') return;
    setDeleteConfirmProd(product);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deleteConfirmProd || currentUser?.role !== 'ADMIN') return;

    await dbService.deleteProduct(deleteConfirmProd.id, currentUser);
    setActionSuccess(`Deleted product "${deleteConfirmProd.name}".`);
    setDeleteConfirmProd(null);
    setTimeout(() => setActionSuccess(''), 4000);
    loadProducts();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStockFilter('ALL');
    setSortBy('name');
    setSortOrder('asc');
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  // Categories List
  const categoriesList = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.capacity?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Stock Status filter
    if (stockFilter !== 'ALL') {
      result = result.filter(p => {
        const qty = p.stockQuantity || 0;
        if (stockFilter === 'IN_STOCK') return qty > 10;
        if (stockFilter === 'LOW_STOCK') return qty > 0 && qty <= 10;
        if (stockFilter === 'OUT_OF_STOCK') return qty === 0;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'sku':
          valA = (a.sku || '').toLowerCase();
          valB = (b.sku || '').toLowerCase();
          break;
        case 'price':
          valA = a.price || 0;
          valB = b.price || 0;
          break;
        case 'dealerPrice':
          valA = a.dealerPrice || a.price || 0;
          valB = b.dealerPrice || b.price || 0;
          break;
        case 'stock':
          valA = a.stockQuantity || 0;
          valB = b.stockQuantity || 0;
          break;
        case 'name':
        default:
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchQuery, categoryFilter, stockFilter, sortBy, sortOrder]);

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'ALL' || stockFilter !== 'ALL' || sortBy !== 'name' || sortOrder !== 'asc';

  const renderSortHeader = (label, field) => {
    const isActive = sortBy === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-[#0066B1] transition focus:outline-none font-bold uppercase"
      >
        <span>{label}</span>
        {isActive ? (
          sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#0066B1]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#0066B1]" />
        ) : (
          <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Products & Battery Inventory</h1>
          <p className="text-xs text-slate-500">
            {isAdmin
              ? 'Administrator Controls: Manage full catalog, set retail & dealer pricing, and manage inventory.'
              : 'Product Directory: View available products, specs, retail and dealer pricing.'}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#002C6C] hover:bg-[#001D4A] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Add New Battery Product
          </button>
        ) : (
          <div className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Product Catalog Modifications: Admin Restricted</span>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* FILTER & SORTING BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <label className="font-bold text-slate-600 block mb-1">Search Products:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product Name, SKU, Ah capacity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Filter Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              {categoriesList.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Stock Availability:</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt; 10 units)</option>
              <option value="LOW_STOCK">Low Stock (1 - 10 units)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0 units)</option>
            </select>
          </div>

        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-medium border-t border-slate-100 text-slate-500">
          <div>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> catalog items
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline transition"
            >
              <RefreshCw className="w-3 h-3" /> Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-xs font-bold text-slate-400 animate-pulse">Loading product inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">No Products Found</div>
            <p className="text-xs text-slate-400">No catalog products match your search or filter options. Click "Reset All Filters".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">{renderSortHeader('Product Name', 'name')}</th>
                  <th className="p-3">{renderSortHeader('SKU', 'sku')}</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Specs (Capacity/Voltage)</th>
                  <th className="p-3">Warranty</th>
                  <th className="p-3">{renderSortHeader('Retail Price', 'price')}</th>
                  <th className="p-3">{renderSortHeader('Dealer Price', 'dealerPrice')}</th>
                  <th className="p-3">{renderSortHeader('Stock Quantity', 'stock')}</th>
                  {isAdmin && <th className="p-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800'}
                          alt=""
                          className="w-10 h-10 object-contain bg-slate-50 p-1 rounded border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.brand || 'India Hyundai Power'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#002C6C]">{p.sku}</td>
                    <td className="p-3 text-slate-600 font-semibold">{p.category}</td>
                    <td className="p-3 font-mono text-slate-700">{p.capacity} / {p.voltage}</td>
                    <td className="p-3 text-slate-700 font-bold">{p.warranty}</td>
                    <td className="p-3 font-extrabold text-[#002C6C]">₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-extrabold text-emerald-700">₹{Number(p.dealerPrice || p.price || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        (p.stockQuantity || 0) > 10 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        (p.stockQuantity || 0) > 0 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {p.stockQuantity || 0} units
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProductClick(p)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-xl text-xs font-bold transition inline-flex items-center gap-1 border border-rose-200"
                          title="Remove product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">Add New Product to Catalog</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyundai Extreme Power Tubular 150Ah"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="HYU-TUB-150"
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="Automotive Batteries">Automotive Batteries</option>
                    <option value="Inverter Batteries">Inverter Batteries</option>
                    <option value="Solar Batteries">Solar Batteries</option>
                    <option value="Heavy Duty Commercial">Heavy Duty Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Capacity</label>
                  <input
                    type="text"
                    placeholder="150 Ah"
                    value={newProd.capacity}
                    onChange={(e) => setNewProd({ ...newProd, capacity: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Voltage</label>
                  <input
                    type="text"
                    placeholder="12V"
                    value={newProd.voltage}
                    onChange={(e) => setNewProd({ ...newProd, voltage: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Warranty</label>
                  <input
                    type="text"
                    placeholder="36 Months"
                    value={newProd.warranty}
                    onChange={(e) => setNewProd({ ...newProd, warranty: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="18500"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dealer Price (₹)</label>
                  <input
                    type="number"
                    placeholder="14800"
                    value={newProd.dealerPrice}
                    onChange={(e) => setNewProd({ ...newProd, dealerPrice: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newProd.stockQuantity}
                    onChange={(e) => setNewProd({ ...newProd, stockQuantity: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-[#002C6C] text-white font-extrabold rounded-xl shadow">Create Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {deleteConfirmProd && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200 animate-in zoom-in-95 font-sans">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-lg text-slate-900">Delete Product Catalog Item?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete battery product <strong className="text-slate-900">{deleteConfirmProd.name}</strong> (SKU: {deleteConfirmProd.sku})?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProd(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
