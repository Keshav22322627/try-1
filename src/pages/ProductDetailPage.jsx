// India Hyundai Power - Product Detail Page

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { dbStore } from '../data/dbStore.js';
import Footer from '../components/Footer.jsx';
import { ShieldCheck, ShoppingBag, Truck, Zap, Check, Star, ArrowLeft, Store } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const all = dbStore.getProducts();
    const found = all.find(p => p.slug === slug || p.id === slug) || all[0];
    setProduct(found);
    if (found) setActiveImage(found.images[0]);
  }, [slug]);

  if (!product) return null;

  const isDealer = currentUser?.role === 'DEALER' || currentUser?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Back link */}
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066B1] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Batteries Shop
          </Link>

          {/* Product Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex items-center justify-center h-80">
                <img src={activeImage} alt={product.name} className="max-h-72 object-contain" />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 bg-slate-50 rounded-xl border p-2 ${activeImage === img ? 'border-[#0066B1] ring-2 ring-blue-400' : 'border-slate-200'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Spec Info */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-[#002C6C] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">SKU: {product.sku}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex text-amber-400">★★★★★</div>
                  <span className="font-bold text-slate-700">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} Customer Reviews)</span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Retail Price (Inclusive GST)</span>
                  <div className="text-3xl font-black text-[#002C6C]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  {isDealer && product.dealerPrice && (
                    <div className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5" /> Authorized Dealer Price: ₹{product.dealerPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-right">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 inline-block">
                    In Stock & Ready for Dispatch
                  </span>
                  <div className="text-[11px] text-slate-400">Free Door Delivery in 24 Hours</div>
                </div>
              </div>

              {/* Specs Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Technical Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Battery Capacity</span>
                    <span className="font-bold text-slate-900 text-sm">{product.capacity}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Voltage</span>
                    <span className="font-bold text-slate-900 text-sm">{product.voltage}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Warranty Period</span>
                    <span className="font-bold text-slate-900 text-sm">{product.warranty.split(' ')[0]} {product.warranty.split(' ')[1]}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-sm font-bold text-slate-600">-</button>
                  <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-sm font-bold text-slate-600">+</button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="w-full sm:flex-1 bg-[#002C6C] hover:bg-[#0066B1] text-white font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart & Checkout
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
