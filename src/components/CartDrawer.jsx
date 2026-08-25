// India Hyundai Power - Cart Drawer Component

import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { dbStore } from '../data/dbStore.js';
import { X, Trash2, Plus, Minus, ArrowRight, Shield, Store, ShoppingBag } from 'lucide-react';
import CheckoutModal from './CheckoutModal.jsx';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    tax,
    totalAmount,
    selectedDealerId,
    setSelectedDealerId
  } = useCart();
  const { currentUser } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!isCartOpen) return null;

  const dealers = dbStore.getUsers().filter(u => u.role === 'DEALER');

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg">Your Battery Cart ({cartItems.length})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dealer selection info */}
        <div className="bg-blue-50 border-b border-blue-100 p-3.5 px-6 flex items-center gap-3">
          <Store className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="text-xs">
            <label className="font-bold text-blue-900 block">Fulfilling Dealer Outlet:</label>
            <select
              value={selectedDealerId}
              onChange={(e) => setSelectedDealerId(e.target.value)}
              className="mt-1 w-full bg-white border border-blue-200 text-slate-800 rounded px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {dealers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.areaName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium text-sm">Your shopping cart is currently empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="inline-block text-xs font-bold text-[#0066B1] hover:underline"
              >
                Browse Batteries Catalog &rarr;
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="pt-4 first:pt-0 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1">{item.productName}</h4>
                  <div className="text-[11px] text-slate-500 font-mono">SKU: {item.sku}</div>
                  <div className="text-xs font-bold text-[#002C6C] mt-1">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                    {currentUser?.role === 'DEALER' && (
                      <span className="ml-1.5 bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-medium">Dealer Rate</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded-l-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-800 min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded-r-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Volume Discount (5%):</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax (10%):</span>
                <span className="font-semibold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-[#002C6C] text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {!currentUser && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 rounded-xl flex items-center justify-between font-medium">
                <span>🔒 Sign in required to place order</span>
                <span className="text-[10px] font-bold underline cursor-pointer" onClick={() => { setIsCartOpen(false); window.location.href = '#/login'; }}>Sign In</span>
              </div>
            )}

            <button
              onClick={() => setShowCheckoutModal(true)}
              className="w-full bg-[#002C6C] hover:bg-[#0066B1] text-white font-bold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Authorized Hyundai Dealer Direct Dispatch
            </div>
          </div>
        )}

      </div>

      {showCheckoutModal && (
        <CheckoutModal onClose={() => setShowCheckoutModal(false)} />
      )}
    </>
  );
}
