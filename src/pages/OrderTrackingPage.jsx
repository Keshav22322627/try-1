// India Hyundai Power - Visual Order Tracking Page

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dbStore } from '../data/dbStore.js';
import Footer from '../components/Footer.jsx';
import { Search, Truck, CheckCircle2, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState(searchParams.get('orderId') || 'ORD-2025-1002');
  const [matchedOrder, setMatchedOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback((idToSearch) => {
    setSearched(true);
    const orders = dbStore.getOrders();
    const cleanQuery = (idToSearch || '').trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === cleanQuery || o.clientPhone.includes(cleanQuery));
    setMatchedOrder(found || null);
  }, []);

  useEffect(() => {
    handleSearch(orderIdInput);
  }, [handleSearch, orderIdInput]);

  const stages = [
    { key: 'PENDING', label: 'Placed & Awaiting Admin Approval', icon: Clock },
    { key: 'CONFIRMED', label: 'Approved & Confirmed by Admin', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Warehouse Processing', icon: PackageCheck },
    { key: 'SHIPPED', label: 'Dispatched & In Transit', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered to Customer', icon: CheckCircle2 }
  ];

  const getStageIndex = (status) => {
    if (status === 'DELIVERED') return 4;
    if (status === 'SHIPPED' || status === 'IN_TRANSIT') return 3;
    if (status === 'PROCESSING') return 2;
    if (status === 'CONFIRMED') return 1;
    return 0; // PENDING
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        
        {/* Banner */}
        <div className="bg-[#002C6C] text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="bg-blue-500/20 text-cyan-300 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-400/30">
              Live Logistics Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">Track Order & Delivery Status</h1>
            <p className="text-xs sm:text-sm text-blue-200">
              Enter your Order ID (e.g. ORD-2025-1002) or registered phone number to view live dispatch progress.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xl flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (ORD-2025-1002)..."
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <button
              onClick={() => handleSearch(orderIdInput)}
              className="bg-[#002C6C] hover:bg-[#0066B1] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition"
            >
              Track Now
            </button>
          </div>
        </div>

        {/* Tracking Result View */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          
          {!matchedOrder ? (
            searched && (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3 shadow-sm">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="font-bold text-slate-900 text-base">No Order Found matching "{orderIdInput}"</h3>
                <p className="text-xs text-slate-500">Please verify your Order ID or Client Phone Number and try again.</p>
              </div>
            )
          ) : (
            <div className="space-y-8">
              
              {/* Order Info Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{matchedOrder.id}</h2>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        matchedOrder.orderStatus === 'DELIVERED' || matchedOrder.orderStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        matchedOrder.orderStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                        matchedOrder.orderStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {matchedOrder.orderStatus === 'PENDING' ? 'AWAITING ADMIN DECISION' : matchedOrder.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Placed on {new Date(matchedOrder.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Order Value</span>
                    <span className="text-2xl font-black text-[#002C6C]">₹{matchedOrder.totalAmount.toLocaleString('en-IN')}</span>
                    <div className="text-xs text-emerald-600 font-bold">
                      Paid: ₹{matchedOrder.amountPaid.toLocaleString('en-IN')} | Pending: ₹{matchedOrder.amountPending.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* 4-Stage Timeline Visual */}
                <div className="py-6">
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    
                    {stages.map((stage, idx) => {
                      const currentStageIdx = getStageIndex(matchedOrder.orderStatus);
                      const isPassed = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      const IconComp = stage.icon;

                      return (
                        <div key={stage.key} className="flex md:flex-col items-center gap-3 relative z-10 flex-1">
                          
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white transition-all shadow-md ${
                            isPassed
                              ? (isCurrent ? 'bg-[#0066B1] ring-4 ring-blue-100 scale-110' : 'bg-emerald-600')
                              : 'bg-slate-200 text-slate-400'
                          }`}>
                            <IconComp className="w-6 h-6" />
                          </div>

                          <div className="text-left md:text-center space-y-0.5">
                            <div className={`text-xs font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                              {stage.label}
                            </div>
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full inline-block">
                                Current Status
                              </span>
                            )}
                          </div>

                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Details Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
                  
                  {/* Shipping & Dealer Details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#0066B1]" /> Dispatch & Destination
                    </h4>
                    <p><span className="text-slate-500">Customer:</span> <strong className="text-slate-900">{matchedOrder.clientName}</strong></p>
                    <p><span className="text-slate-500">Fulfilling Dealer:</span> <strong className="text-slate-900">{matchedOrder.dealerName}</strong></p>
                    <p><span className="text-slate-500">Delivery Address:</span> {matchedOrder.deliveryAddress}</p>
                    <p><span className="text-slate-500">Expected ETA:</span> {new Date(matchedOrder.expectedDeliveryDate).toLocaleDateString('en-IN')}</p>
                  </div>

                  {/* Delivery Agent Details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#0066B1]" /> Assigned Delivery Partner
                    </h4>
                    <p><span className="text-slate-500">Agent Name:</span> <strong className="text-slate-900">{matchedOrder.deliveryPersonName || 'Assigning...'}</strong></p>
                    <p><span className="text-slate-500">Delivery Status:</span> <span className="font-bold text-blue-700">{matchedOrder.deliveryStatus}</span></p>
                    <p><span className="text-slate-500">Support Helpline:</span> +91 1800-HYUNDAI</p>
                  </div>

                </div>

                {/* Items Summary */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Order Items ({matchedOrder.items.length})</h4>
                  <div className="divide-y divide-slate-100 border rounded-2xl overflow-hidden text-xs">
                    {matchedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center bg-white">
                        <div>
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">Qty: {item.quantity} x ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="font-extrabold text-[#002C6C]">₹{item.totalPrice.toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
