// India Hyundai Power - Sales Person Dashboard

import React, { useState, useEffect, useMemo } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  UserCheck, Store, ShoppingBag, DollarSign, Plus, CheckCircle2, AlertCircle,
  Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function SalesPersonDashboard() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('id'); // 'id' | 'client' | 'amount' | 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Payment Recording Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [payRef, setPayRef] = useState('');

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = () => {
    const userOrders = dbStore.getOrdersForUser(currentUser);
    setOrders(userOrders);
    const userList = dbStore.getUsersForUser(currentUser);
    setDealers(userList.filter(u => u.role === 'DEALER'));
    if (userOrders.length > 0) setSelectedOrderId(userOrders[0].id);
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedOrderId || !payAmount) return;
    try {
      dbStore.recordPayment(
        {
          orderId: selectedOrderId,
          amount: Number(payAmount),
          paymentMethod: payMethod,
          transactionRef: payRef || `TXN-SP-${Date.now().toString().slice(-5)}`,
          notes: `Collected by Sales Person ${currentUser?.name}`
        },
        currentUser
      );
      setShowPaymentModal(false);
      setPayAmount('');
      setPayRef('');
      loadData();
    } catch (err) {
      alert(err.message || 'Error recording payment');
    }
  };

  const mySalesTotal = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const myCollectedPaid = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const myPendingTotal = orders.reduce((sum, o) => sum + (o.amountPending || 0), 0);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.dealerName?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.orderStatus === statusFilter || o.deliveryStatus === statusFilter);
    }

    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'amount':
          valA = a.totalAmount || 0;
          valB = b.totalAmount || 0;
          break;
        case 'client':
          valA = (a.clientName || '').toLowerCase();
          valB = (b.clientName || '').toLowerCase();
          break;
        case 'status':
          valA = (a.orderStatus || '').toLowerCase();
          valB = (b.orderStatus || '').toLowerCase();
          break;
        case 'id':
        default:
          valA = (a.id || '').toLowerCase();
          valB = (b.id || '').toLowerCase();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

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
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#002C6C] to-cyan-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-400/20 text-cyan-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-cyan-400/30">
              SALES PERSON FIELD PANEL
            </span>
            <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {currentUser?.areaName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{currentUser?.name} Dashboard</h1>
          <p className="text-xs sm:text-sm text-cyan-100">
            Field Representative for {currentUser?.areaName} • {dealers.length} Authorized Dealers Assigned
          </p>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Record Payment Collected
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">My Sales Volume</div>
          <div className="text-2xl font-black text-[#002C6C]">₹{mySalesTotal.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400">{orders.length} My Managed Orders</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Payments Collected</div>
          <div className="text-2xl font-black text-emerald-700">₹{myCollectedPaid.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-bold">Deposited to Company</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Pending Collections</div>
          <div className="text-2xl font-black text-rose-600">₹{myPendingTotal.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-rose-500 font-bold">Collect from Dealers</div>
        </div>
      </div>

      {/* Orders Table with Filter & Sort */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="border-b pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">My Managed Client Orders</h3>
          <span className="text-xs text-slate-400 font-mono">Territory: {currentUser?.areaName}</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Order ID, Client, Dealer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-1/2 bg-white border border-slate-300 rounded-xl px-2 py-1.5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-1/2 bg-white border border-slate-300 rounded-xl px-2 py-1.5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="id">Order ID</option>
              <option value="amount">Total Amount</option>
              <option value="client">Client Name</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">{renderSortHeader('Order ID', 'id')}</th>
                <th className="p-3">{renderSortHeader('Client', 'client')}</th>
                <th className="p-3">Dealer</th>
                <th className="p-3">{renderSortHeader('Total Amount', 'amount')}</th>
                <th className="p-3">Paid / Pending</th>
                <th className="p-3">{renderSortHeader('Delivery Status', 'status')}</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#002C6C]">{o.id}</td>
                    <td className="p-3 font-bold">{o.clientName}</td>
                    <td className="p-3">{o.dealerName}</td>
                    <td className="p-3 font-extrabold text-slate-900">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold">₹{o.amountPaid?.toLocaleString('en-IN')}</span> /{' '}
                      <span className="text-rose-600 font-bold">₹{o.amountPending?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.deliveryStatus === 'DELIVERED' || o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        o.deliveryStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {o.deliveryStatus || o.orderStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          setShowPaymentModal(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition shadow-sm"
                      >
                        Record Payment
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200 font-sans">
            <h3 className="font-bold text-base text-slate-900 border-b pb-2">Record Client Payment Received</h3>
            
            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Order</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.clientName} (Pending: ₹{o.amountPending?.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Amount Received (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="NEFT">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cash">Cash Deposit</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Transaction Reference / UTR Number</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-881902"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="w-1/2 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow">Submit Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
