// India Hyundai Power - Executive Command Dashboard

import React, { useState, useEffect, useMemo } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Users, ShoppingBag, DollarSign, MapPin, Award, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCw,
  Search, Filter, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [payments, setPayments] = useState([]);

  // Table Filter & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('id'); // 'id' | 'client' | 'amount' | 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  useEffect(() => {
    setOrders(dbStore.getOrders());
    setUsers(dbStore.getUsers());
    setAreas(dbStore.getAreas());
    setPayments(dbStore.getPayments());
  }, []);

  // Summary Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = orders.reduce((sum, o) => sum + (o.amountPending || 0), 0);

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'PENDING').length;
  const deliveredOrdersCount = orders.filter(o => o.orderStatus === 'DELIVERED' || o.deliveryStatus === 'DELIVERED').length;

  const salesHeadsCount = users.filter(u => u.role === 'SALES_HEAD').length;
  const salesPersonsCount = users.filter(u => u.role === 'SALES_PERSON').length;
  const dealersCount = users.filter(u => u.role === 'DEALER').length;

  const monthlyData = [
    { month: 'Apr', revenue: 1450000, orders: 12 },
    { month: 'May', revenue: 2100000, orders: 18 },
    { month: 'Jun', revenue: 1850000, orders: 15 },
    { month: 'Jul', revenue: 2900000, orders: 24 },
    { month: 'Aug', revenue: totalRevenue, orders: orders.length }
  ];

  const paymentBreakdown = [
    { name: 'Received', value: totalReceived, color: '#059669' },
    { name: 'Pending', value: totalPending, color: '#E11D48' }
  ];

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

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.dealerName?.toLowerCase().includes(q) ||
        o.areaName?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.orderStatus === statusFilter || o.deliveryStatus === statusFilter);
    }

    // Sort
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
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#002C6C] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-400/20 text-cyan-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-cyan-400/30">
              NATIONAL EXECUTIVE CONTROL
            </span>
            <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Pan-India Scope
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">System Administrator Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time analytics for battery sales, revenue collections, regional staff hierarchy, and dealer performance.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/dashboard/reports"
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" /> Download Reports
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Gross Sales Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066B1] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> +14.2% vs last month
          </div>
        </div>

        {/* Collections Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Payments Cleared</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">₹{totalReceived.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 font-medium">Bank NEFT, UPI & Cash Deposits</div>
        </div>

        {/* Pending Money */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Outstanding Ledger</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">₹{totalPending.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-rose-500 font-semibold">Active dealer & client credit</div>
        </div>

        {/* Orders Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Orders Status</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{orders.length} <span className="text-xs font-normal text-slate-400">Total</span></div>
          <div className="text-[11px] text-slate-500 flex items-center gap-3">
            <span className="text-amber-600 font-bold">{pendingOrdersCount} Pending</span>
            <span className="text-emerald-600 font-bold">{deliveredOrdersCount} Delivered</span>
          </div>
        </div>

      </div>

      {/* Network Personnel Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Sales Heads</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{salesHeadsCount} Active</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Sales Persons</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{salesPersonsCount} Active</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Authorized Dealers</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{dealersCount} Active</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Users</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{users.length} Active Users</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales & Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Revenue Trend (INR)</h3>
              <p className="text-xs text-slate-400">Nationwide growth over last 5 months</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0066B1] bg-blue-50 px-2.5 py-1 rounded-lg">Pan-India</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
                <Area type="monotone" dataKey="revenue" stroke="#002C6C" fill="#0066B1" fillOpacity={0.15} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Collections Breakdown Pie */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-base">Payment Recovery Ratio</h3>
            <p className="text-xs text-slate-400">Cleared vs Outstanding</p>
          </div>

          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentBreakdown} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={4}>
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-xl text-emerald-900 font-bold">
              <span>Received (Cleared):</span>
              <span>₹{totalReceived.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center bg-rose-50 p-2 rounded-xl text-rose-900 font-bold">
              <span>Pending Collection:</span>
              <span>₹{totalPending.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Table with Filter & Sorting */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">All-India Orders Ledger</h3>
            <p className="text-xs text-slate-400">Search, filter, and sort orders in real-time</p>
          </div>
          
          <Link to="/dashboard/orders" className="text-xs font-bold text-[#0066B1] hover:underline flex items-center gap-1">
            Open Full Orders Manager <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Order ID, Client, Dealer, Area..."
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
                <th className="p-3">Area</th>
                <th className="p-3">{renderSortHeader('Total Amount', 'amount')}</th>
                <th className="p-3">Paid / Pending</th>
                <th className="p-3">{renderSortHeader('Status', 'status')}</th>
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
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#002C6C]">{o.id}</td>
                    <td className="p-3 font-bold">{o.clientName}</td>
                    <td className="p-3">{o.dealerName}</td>
                    <td className="p-3 text-slate-500">{o.areaName}</td>
                    <td className="p-3 font-extrabold text-slate-900">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold">₹{o.amountPaid?.toLocaleString('en-IN')}</span> /{' '}
                      <span className="text-rose-600 font-bold">₹{o.amountPending?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        o.orderStatus === 'DELIVERED' || o.deliveryStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        o.orderStatus === 'CANCELLED' || o.deliveryStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        o.orderStatus === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {o.deliveryStatus === 'DELIVERED' ? 'DELIVERED' : o.orderStatus}
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
