// India Hyundai Power - Product Card Component

import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldCheck, ShoppingBag, Eye, Zap, Check } from 'lucide-react';

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const isDealer = currentUser?.role === 'DEALER' || currentUser?.role === 'ADMIN';

  return (
    <div className="hyundai-card group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* Image Container */}
      <div className="relative bg-slate-50 p-6 flex items-center justify-center overflow-hidden h-52">
        
        {/* Warranty Badge */}
        <span className="absolute top-3 left-3 bg-[#002C6C] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm z-10">
          {product.warranty.split(' ')[0]} {product.warranty.split(' ')[1]} Warranty
        </span>

        {/* Stock Status Badge */}
        <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 z-10 flex items-center gap-1">
          <Check className="w-3 h-3" /> In Stock
        </span>

        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-40 object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-[#0066B1] uppercase tracking-wider">
            {product.category}
          </div>
          <h3
            onClick={() => onViewDetails && onViewDetails(product)}
            className="font-bold text-slate-900 text-sm line-clamp-2 cursor-pointer hover:text-[#0066B1] transition"
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Technical Specs Pill Bar */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
          <div>
            <span className="text-slate-400 block">Capacity</span>
            <span className="font-bold text-slate-800">{product.capacity}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Voltage</span>
            <span className="font-bold text-slate-800">{product.voltage}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block">Retail MRP</span>
            <div className="text-lg font-black text-[#002C6C] leading-none">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {isDealer && product.dealerPrice && (
              <div className="text-[11px] font-bold text-emerald-600 mt-1">
                Dealer Rate: ₹{product.dealerPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails && onViewDetails(product)}
              className="p-2 text-slate-600 hover:text-[#002C6C] hover:bg-slate-100 rounded-xl transition"
              title="View Specs & Reviews"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => addToCart(product)}
              className="bg-[#002C6C] hover:bg-[#0066B1] text-white p-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Buy
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
