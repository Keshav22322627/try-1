// India Hyundai Power - Multi-Payment Ledger & Pending Money Management Engine

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  DollarSign, Search, Plus, CheckCircle2, AlertCircle, Calendar, CreditCard, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function PaymentsManagement() {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  // Sorting States
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount' | 'client' | 'order'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Payment Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Bank Transfer (NEFT)');
  const [payRef, setPayRef] = useState('');

  const loadData = useCallback(() => {
    setPayments(dbStore.getPaymentsForUser(currentUser));
    const userOrders = dbStore.getOrdersForUser(currentUser);
    setOrders(userOrders);
    if (userOrders.length > 0) setSelectedOrderId(userOrders[0].id);
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderId || !payAmount) return;

    try {
      dbStore.recordPayment({
        orderId: selectedOrderId,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        transactionRef: payRef || `TXN-${Date.now().toString().slice(-6)}`,
        notes: `Recorded by ${currentUser?.name}`
      }, currentUser);

      setShowModal(false);
      setPayAmount('');
      setPayRef('');
      loadData();
    } catch (err) {
      alert(err.message || 'Error recording payment');
    }
  };

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
    setMethodFilter('ALL');
    setSortBy('date');
    setSortOrder('desc');
  };

  const grandTotalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const grandTotalPending = orders.reduce((sum, o) => sum + o.amountPending, 0);

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.id?.toLowerCase().includes(q) ||
        p.orderId?.toLowerCase().includes(q) ||
        p.clientName?.toLowerCase().includes(q) ||
        p.dealerName?.toLowerCase().includes(q) ||
        p.transactionRef?.toLowerCase().includes(q)
      );
    }

    // Payment Method filter
    if (methodFilter !== 'ALL') {
      result = result.filter(p => (p.paymentMethod || '').includes(methodFilter));
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'amount':
          valA = a.amount || 0;
          valB = b.amount || 0;
          break;
        case 'client':
          valA = (a.clientName || '').toLowerCase();
          valB = (b.clientName || '').toLowerCase();
          break;
        case 'order':
          valA = (a.orderId || '').toLowerCase();
          valB = (b.orderId || '').toLowerCase();
          break;
        case 'date':
        default:
          valA = new Date(a.date || 0).getTime();
          valB = new Date(b.date || 0).getTime();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [payments, searchQuery, methodFilter, sortBy, sortOrder]);

  const hasActiveFilters = searchQuery !== '' || methodFilter !== 'ALL' || sortBy !== 'date' || sortOrder !== 'desc';

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
      
      {currentUser?.role === 'ADMIN' && (
        <div className="bg-purple-50 border border-purple-200 text-purple-900 p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-sm">
          <DollarSign className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span><strong>Executive Read-Only Audit Access:</strong> Admin can view all payments across India but cannot record or alter operational payment transactions. Only Sales Persons and Sales Heads can enter payments.</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payments & Pending Money Ledger</h1>
          <p className="text-xs text-slate-500">
            Multi-payment tracking per order: Total Amount = Product + Tax - Discount. Multi-payment history logs.
          </p>
        </div>

        {['SALES_PERSON', 'SALES_HEAD'].includes(currentUser?.role) && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Record New Payment Transaction
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Money Received (Cleared)</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹{grandTotalPaid.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Outstanding Balance Pending</span>
            <div className="text-2xl font-black text-rose-600 mt-1">₹{grandTotalPending.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTER & SORTING BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <label className="font-bold text-slate-600 block mb-1">Search Payment Ledger:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Order ID, Client, Dealer, Ref #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Payment Method:</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="NEFT">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="Cash">Cash Deposit</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Sort Control */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Sort Payments By:</label>
            <div className="flex gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
              >
                <option value="date">Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})</option>
                <option value="amount">Amount ({sortOrder === 'desc' ? 'High → Low' : 'Low → High'})</option>
                <option value="client">Client Name (A-Z)</option>
                <option value="order">Order ID</option>
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
            Showing <strong>{filteredPayments.length}</strong> of <strong>{payments.length}</strong> payment transactions
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

      {/* Payments History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Payment ID</th>
                <th className="p-3">{renderSortHeader('Order ID', 'order')}</th>
                <th className="p-3">{renderSortHeader('Client / Dealer', 'client')}</th>
                <th className="p-3">{renderSortHeader('Date & Time', 'date')}</th>
                <th className="p-3">Method & Ref #</th>
                <th className="p-3">{renderSortHeader('Amount Paid', 'amount')}</th>
                <th className="p-3">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 italic">
                    No payment records match your current filter settings.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-400 font-bold">{p.id}</td>
                    <td className="p-3 font-mono font-bold text-[#002C6C]">{p.orderId}</td>
                    <td className="p-3">
                      <div className="font-extrabold text-slate-900">{p.clientName}</div>
                      {p.dealerName && <div className="text-[11px] text-slate-500 font-normal">Dealer: {p.dealerName}</div>}
                    </td>
                    <td className="p-3 text-slate-500 font-mono">
                      {new Date(p.date).toLocaleDateString('en-IN')} {new Date(p.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{p.paymentMethod}</div>
                      <div className="text-[11px] font-mono text-slate-500">Ref: {p.transactionRef}</div>
                    </td>
                    <td className="p-3 font-extrabold text-emerald-700 text-sm">₹{p.amount?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-slate-600 font-semibold">{p.recordedBy || 'System'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <h3 className="font-bold text-base text-slate-900 border-b pb-2">Record Payment Transaction</h3>
            
            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Order</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2 font-mono font-bold"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.clientName} (Pending: ₹{o.amountPending?.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2 text-sm font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2 font-medium"
                >
                  <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI / QR Code">UPI / QR Code</option>
                  <option value="Cash Deposit">Cash Deposit</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Transaction Ref / UTR / Cheque #</label>
                <input
                  type="text"
                  placeholder="e.g. UTR99812401"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="w-1/2 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow">Submit Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
