// India Hyundai Power - Dealer Order Tracking & Placement Portal

import React, { useState, useEffect, useMemo } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import {
  Truck, CheckCircle2, MapPin, Phone, Search, Clock, PackageCheck, AlertCircle, Plus, Info, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function DealerDashboard() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  
  // Search, Filter & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount' | 'status' | 'id'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  useEffect(() => {
    setOrders(dbStore.getOrdersForUser(currentUser));
  }, [currentUser]);

  const totalPurchase = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPaid = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const totalPending = orders.reduce((sum, o) => sum + (o.amountPending || 0), 0);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSortBy('date');
    setSortOrder('desc');
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.clientPhone?.includes(q) ||
        o.deliveryAddress?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.orderStatus === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'amount':
          valA = a.totalAmount || 0;
          valB = b.totalAmount || 0;
          break;
        case 'status':
          valA = (a.orderStatus || '').toLowerCase();
          valB = (b.orderStatus || '').toLowerCase();
          break;
        case 'id':
          valA = (a.id || '').toLowerCase();
          valB = (b.id || '').toLowerCase();
          break;
        case 'date':
        default:
          valA = new Date(a.orderDate || 0).getTime();
          valB = new Date(b.orderDate || 0).getTime();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || sortBy !== 'date' || sortOrder !== 'desc';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002C6C] via-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-400/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-400/30">
              AUTHORIZED DEALER PORTAL
            </span>
            <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {currentUser?.businessName || currentUser?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Dealer Order & Delivery Tracking</h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            GSTIN: {currentUser?.gstin || '03AAAAA0000A1Z5'} • Territory: {currentUser?.areaName}
          </p>
        </div>

        <Link
          to="/shop"
          className="bg-white hover:bg-slate-100 text-[#002C6C] font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-emerald-600" /> Place New Battery Order
        </Link>
      </div>

      {/* Dealer Complaints Block */}
      <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white p-6 rounded-3xl shadow-md space-y-4 border border-rose-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-300 rounded-xl font-bold border border-rose-500/30">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Dealer Service & Battery Complaints</h3>
              <p className="text-xs text-rose-200">File customer claims and view staff personnel assigned to your dealership.</p>
            </div>
          </div>

          <Link
            to="/dashboard/complaints"
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> File / View All Complaints
          </Link>
        </div>

        {/* Complaints Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {dbStore.getComplaintsForUser(currentUser).slice(0, 2).map(c => (
            <div key={c.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-400">{c.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  c.status === 'RESOLVED' || c.status === 'REPLACED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  c.status === 'ASSIGNED' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="font-bold text-white text-xs">{c.batteryModel}</div>
              <div className="text-slate-300 text-[11px]">Client: {c.clientName} ({c.clientPhone})</div>
              <div className="border-t border-slate-700/80 pt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Assigned Person:</span>
                <span className="font-bold text-cyan-300">
                  {c.assignedPersonName ? `${c.assignedPersonName} (${c.assignedPersonPhone || ''})` : 'Awaiting Staff Assignment'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Purchase Volume</div>
          <div className="text-2xl font-black text-slate-900">₹{totalPurchase.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 font-mono">{orders.length} total orders</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Cleared Payments</div>
          <div className="text-2xl font-black text-emerald-700">₹{totalPaid.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-bold">Bank NEFT / Cash Received</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Pending Balance</div>
          <div className="text-2xl font-black text-rose-600">₹{totalPending.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-rose-500 font-bold">Outstanding credit balance</div>
        </div>
      </div>

      {/* FILTER & SORTING BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <label className="font-bold text-slate-600 block mb-1">Search Orders:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Order ID, Client, Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Order Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Order Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Sort Control */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Sort Orders By:</label>
            <div className="flex gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
              >
                <option value="date">Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})</option>
                <option value="amount">Total Amount ({sortOrder === 'desc' ? 'High → Low' : 'Low → High'})</option>
                <option value="status">Order Status</option>
                <option value="id">Order ID</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                className="px-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-slate-700 hover:bg-slate-200 transition text-[11px]"
                title="Toggle Ascending / Descending"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-medium border-t border-slate-100 text-slate-500">
          <div>
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> total orders
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

      {/* Orders Dispatch & Live Tracking List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="border-b pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Your Dealership Orders & Live Delivery Stage</h3>
          <span className="text-xs text-slate-400 font-medium">Real-Time Courier Updates</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">No Orders Found</div>
            <p className="text-xs text-slate-400">No orders match your filter criteria. Click "Reset All Filters".</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(o => {
              const stages = [
                { id: 'PENDING', label: 'Order Placed (Pending)' },
                { id: 'CONFIRMED', label: 'Admin Confirmed' },
                { id: 'PROCESSING', label: 'Processing & Pack' },
                { id: 'SHIPPED', label: 'Shipped / In Transit' },
                { id: 'DELIVERED', label: 'Delivered' }
              ];

              const currentStageIndex = stages.findIndex(s => s.id === o.orderStatus);

              return (
                <div key={o.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                    <div>
                      <div className="font-black text-[#002C6C] text-lg">{o.id}</div>
                      <div className="text-xs text-slate-400 font-medium">
                        Order Date: {new Date(o.orderDate || Date.now()).toLocaleDateString('en-IN')} • Client/Recipient: <strong className="text-slate-700">{o.clientName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                        o.orderStatus === 'CONFIRMED' || o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        o.orderStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        o.orderStatus === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {o.orderStatus === 'PENDING' ? 'PENDING ADMIN APPROVAL' : o.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Stage Timeline Visual */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Live Delivery Stage Timeline:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {stages.map((stage, idx) => {
                        const isDone = idx <= (currentStageIndex >= 0 ? currentStageIndex : 0);
                        return (
                          <div
                            key={stage.id}
                            className={`p-2.5 rounded-xl border text-center transition ${
                              isDone ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="text-[9px] uppercase tracking-wider font-mono">Stage {idx + 1}</div>
                            <div className="text-[11px] mt-0.5 leading-tight">{stage.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery & Items Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <Truck className="w-4 h-4 text-[#0066B1]" /> Dispatch & Logistics Partner
                      </div>
                      <div className="text-slate-700 font-medium">
                        Delivery Agent: <strong className="text-slate-900">{o.deliveryPersonName || 'Assigning Delivery Agent...'}</strong>
                      </div>
                      <div className="text-slate-600">
                        Delivery Address: <span className="font-medium text-slate-800">{o.deliveryAddress}</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] pt-1 border-t">
                        Expected Delivery: {o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString('en-IN') : 'TBD'}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-900 text-xs">Items & Ledger Breakdown</div>
                      <ul className="space-y-1 text-slate-600">
                        {o.items?.map((item, idx) => (
                          <li key={idx} className="font-medium text-slate-800">• {item.productName} ({item.quantity} Qty)</li>
                        ))}
                      </ul>
                      <div className="pt-2 border-t space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Total Amount:</span>
                          <span>₹{o.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Amount Paid:</span>
                          <span>₹{o.amountPaid?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-rose-600 font-bold">
                          <span>Pending Balance:</span>
                          <span>₹{o.amountPending?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
