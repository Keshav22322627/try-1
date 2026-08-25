// India Hyundai Power - Order Checkout Modal

import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Truck, CreditCard, Shield, MapPin, Building, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ onClose }) {
  const { cartItems, subtotal, discount, tax, totalAmount, checkout, setIsCartOpen } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: currentUser?.name || 'Rajesh Kumar',
    clientEmail: currentUser?.email || 'rajesh.k@gmail.com',
    clientPhone: currentUser?.phone || '+91 98140 99887',
    address: currentUser?.address || '142-B, Mall Road, Ludhiana, Punjab 141001',
    paymentMethod: 'NET_BANKING',
    notes: 'Please test battery charge before dispatch.'
  });

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await checkout(formData);
      setCreatedOrder(order);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      alert(err.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden font-sans my-8 border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#002C6C] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/30 flex items-center justify-center text-cyan-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">India Hyundai Power Order Checkout</h3>
              <p className="text-xs text-blue-200">Fulfilling via Authorized Dealer Outlet</p>
            </div>
          </div>
          {!createdOrder && (
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-300">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {!currentUser ? (
          /* Unauthenticated Protection View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-200">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-xl font-bold text-slate-900">Sign In Required to Place Order</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order creation is strictly restricted to authenticated users. You must be signed in to your account to confirm battery purchases.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 text-left max-w-md mx-auto space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Shield className="w-4 h-4 text-amber-600" /> Security Policy Enforcement:
              </div>
              <p className="text-[11px] text-amber-800">
                Authorized Dealer dispatch, warranty activation, and invoice tracking require a verified user profile.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(false);
                  navigate('/login', { state: { message: 'Please sign in to your account before placing an order.' } });
                }}
                className="bg-[#002C6C] hover:bg-[#0066B1] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md transition"
              >
                Sign In to Account &rarr;
              </button>

              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : createdOrder ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">Order ID: <span className="font-bold text-[#002C6C]">{createdOrder.id}</span></p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-semibold text-slate-800">
                <span>Customer: {createdOrder.clientName}</span>
                <span className="text-[#002C6C]">₹{createdOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <p><span className="text-slate-500">Dealer Assigned:</span> {createdOrder.dealerName}</p>
              <p><span className="text-slate-500">Delivery Address:</span> {createdOrder.deliveryAddress}</p>
              <p><span className="text-slate-500">Estimated Delivery:</span> 2 to 3 Business Days</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(false);
                  navigate(`/order-tracking?orderId=${createdOrder.id}`);
                }}
                className="bg-[#002C6C] hover:bg-[#0066B1] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                Track Delivery Timeline &rarr;
              </button>

              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(false);
                  navigate('/dashboard');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-2.5 rounded-xl font-semibold text-xs"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
            
            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
                <Building className="w-4 h-4 text-[#0066B1]" /> Customer Information & Shipping Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1] focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
                <CreditCard className="w-4 h-4 text-[#0066B1]" /> Preferred Payment Mode
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <label className={`p-3 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center ${formData.paymentMethod === 'NET_BANKING' ? 'border-[#0066B1] bg-blue-50/50 text-[#002C6C] font-bold' : 'border-slate-200 text-slate-600'}`}>
                  <input
                    type="radio"
                    name="pm"
                    checked={formData.paymentMethod === 'NET_BANKING'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'NET_BANKING' })}
                    className="sr-only"
                  />
                  <span className="text-xs">Bank Transfer / NEFT</span>
                </label>

                <label className={`p-3 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center ${formData.paymentMethod === 'UPI' ? 'border-[#0066B1] bg-blue-50/50 text-[#002C6C] font-bold' : 'border-slate-200 text-slate-600'}`}>
                  <input
                    type="radio"
                    name="pm"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                    className="sr-only"
                  />
                  <span className="text-xs">UPI / GPay / PhonePe</span>
                </label>

                <label className={`p-3 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center ${formData.paymentMethod === 'DEALER_CREDIT' ? 'border-[#0066B1] bg-blue-50/50 text-[#002C6C] font-bold' : 'border-slate-200 text-slate-600'}`}>
                  <input
                    type="radio"
                    name="pm"
                    checked={formData.paymentMethod === 'DEALER_CREDIT'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'DEALER_CREDIT' })}
                    className="sr-only"
                  />
                  <span className="text-xs">Dealer Credit / COD</span>
                </label>
              </div>
            </div>

            {/* Order Summary & Submit */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 space-y-0.5 w-full sm:w-auto">
                <div>Subtotal ({cartItems.length} items): <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div>GST Tax: <span className="font-semibold text-slate-900">₹{tax.toLocaleString('en-IN')}</span></div>
                <div className="text-sm font-bold text-[#002C6C]">Total Payable: ₹{totalAmount.toLocaleString('en-IN')}</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#002C6C] hover:bg-[#0066B1] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Creating Order...' : 'Confirm Order Now'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
