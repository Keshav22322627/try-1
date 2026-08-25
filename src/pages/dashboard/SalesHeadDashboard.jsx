// India Hyundai Power - Sales Head Dashboard

import React, { useState, useEffect, useMemo } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Briefcase, Users, Store, DollarSign, ShoppingBag, MapPin, CheckCircle2, AlertCircle,
  Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function SalesHeadDashboard() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Search & Sorting Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('id'); // 'id' | 'client' | 'amount' | 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  useEffect(() => {
    setOrders(dbStore.getOrdersForUser(currentUser));
    setUsers(dbStore.getUsersForUser(currentUser));
  }, [currentUser]);

  const areaRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const areaPaid = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const areaPending = orders.reduce((sum, o) => sum + (o.amountPending || 0), 0);

  const salesPersonsInRegion = users.filter(u => u.role === 'SALES_PERSON');
  const dealersInRegion = users.filter(u => u.role === 'DEALER');

  const salesPersonPerfData = salesPersonsInRegion.map(sp => {
    const spOrders = orders.filter(o => o.salesPersonId === sp.id);
    const spRev = spOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { name: sp.name.split(' ')[0], revenue: spRev, ordersCount: spOrders.length };
  });

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
    setSortBy('id');
    setSortOrder('desc');
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.salesPersonName?.toLowerCase().includes(q) ||
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

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || sortBy !== 'id' || sortOrder !== 'desc';

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
      <div className="bg-gradient-to-r from-[#002C6C] to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-400/20 text-cyan-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-cyan-400/30">
            REGION-SCOPED SALES HEAD PANEL
          </span>
          <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {currentUser?.areaName}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Sales Head Control Center</h1>
        <p className="text-xs sm:text-sm text-blue-200">
          Supervising sales representatives, dealers, and order fulfillment in {currentUser?.areaName}.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Region Revenue</div>
          <div className="text-2xl font-black text-[#002C6C]">₹{areaRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400">{orders.length} Area Orders</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Payments Collected</div>
          <div className="text-2xl font-black text-emerald-700">₹{areaPaid.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-bold">Cleared Ledger</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Pending Payments</div>
          <div className="text-2xl font-black text-rose-600">₹{areaPending.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-rose-500 font-bold">Follow-up Required</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Team Size</div>
          <div className="text-2xl font-black text-slate-900">{salesPersonsInRegion.length} <span className="text-xs font-normal text-slate-400">Reps</span></div>
          <div className="text-[11px] text-slate-500">{dealersInRegion.length} Active Dealers</div>
        </div>

      </div>

      {/* Sales Person Performance Comparison */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-bold text-slate-900 text-base">Sales Person Performance in {currentUser?.areaName}</h3>
          <p className="text-xs text-slate-400">Total revenue generated by field representatives</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesPersonPerfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
              <Bar dataKey="revenue" fill="#0066B1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Region Orders Table with Filter & Sorting */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="border-b pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Region Orders & Delivery Tracker</h3>
          <span className="text-xs text-slate-400 font-medium">Assigned Territory Orders</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Order ID, Client, Rep, Dealer..."
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
                <th className="p-3">Sales Person</th>
                <th className="p-3">Dealer</th>
                <th className="p-3">{renderSortHeader('Total Amount', 'amount')}</th>
                <th className="p-3">Pending Balance</th>
                <th className="p-3">{renderSortHeader('Delivery Status', 'status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                    No orders match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#002C6C]">{o.id}</td>
                    <td className="p-3 font-bold">{o.clientName}</td>
                    <td className="p-3 text-slate-600">{o.salesPersonName}</td>
                    <td className="p-3 text-slate-600">{o.dealerName}</td>
                    <td className="p-3 font-extrabold text-slate-900">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-rose-600 font-bold">₹{o.amountPending?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.deliveryStatus === 'DELIVERED' || o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        o.deliveryStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {o.deliveryStatus || o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
