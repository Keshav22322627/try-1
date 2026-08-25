// India Hyundai Power - Executive Reporting & Data Export Engine

import React, { useState, useEffect, useMemo } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Download, Printer, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  RefreshCw, DollarSign, ShoppingBag, MapPin, User, Store
} from 'lucide-react';
import AreaWiseStaffReport from './AreaWiseStaffReport.jsx';

export default function ReportsPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reportType, setReportType] = useState('SALES_SUMMARY'); // 'SALES_SUMMARY' | 'PAYMENT_LEDGER' | 'AREA_WISE_STAFF'

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'THIS_MONTH'
  const [staffFilter, setStaffFilter] = useState('ALL');
  const [dealerFilter, setDealerFilter] = useState('ALL');

  // Sorting States
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount' | 'client' | 'dealer' | 'staff' | 'id' | 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  useEffect(() => {
    setOrders(dbStore.getOrdersForUser(currentUser));
    setPayments(dbStore.getPaymentsForUser(currentUser));
  }, [currentUser]);

  // Extract unique staff members and dealer businesses for filter dropdowns
  const uniqueStaffList = useMemo(() => {
    const names = new Set();
    orders.forEach(o => { if (o.salesPersonName) names.add(o.salesPersonName); });
    payments.forEach(p => { if (p.salesPersonName) names.add(p.salesPersonName); });
    return Array.from(names).sort();
  }, [orders, payments]);

  const uniqueDealerList = useMemo(() => {
    const dealers = new Set();
    orders.forEach(o => { if (o.dealerName) dealers.add(o.dealerName); });
    payments.forEach(p => { if (p.dealerName) dealers.add(p.dealerName); });
    return Array.from(dealers).sort();
  }, [orders, payments]);

  // Handle Header Sorting Click
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDateFilter('ALL');
    setStaffFilter('ALL');
    setDealerFilter('ALL');
    setSortBy('date');
    setSortOrder('desc');
  };

  // Filter & Sort Orders
  const processedOrders = useMemo(() => {
    let result = [...orders];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.dealerName?.toLowerCase().includes(q) ||
        o.salesPersonName?.toLowerCase().includes(q) ||
        o.areaName?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.orderStatus === statusFilter);
    }

    // Staff filter
    if (staffFilter !== 'ALL') {
      result = result.filter(o => o.salesPersonName === staffFilter);
    }

    // Dealer filter
    if (dealerFilter !== 'ALL') {
      result = result.filter(o => o.dealerName === dealerFilter);
    }

    // Date preset filter
    if (dateFilter !== 'ALL') {
      const now = new Date();
      result = result.filter(o => {
        const orderDate = new Date(o.orderDate);
        if (dateFilter === 'LAST_7_DAYS') {
          return (now - orderDate) <= 7 * 86400000;
        } else if (dateFilter === 'LAST_30_DAYS') {
          return (now - orderDate) <= 30 * 86400000;
        } else if (dateFilter === 'THIS_MONTH') {
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'amount':
          valA = a.totalAmount;
          valB = b.totalAmount;
          break;
        case 'client':
          valA = (a.clientName || '').toLowerCase();
          valB = (b.clientName || '').toLowerCase();
          break;
        case 'dealer':
          valA = (a.dealerName || '').toLowerCase();
          valB = (b.dealerName || '').toLowerCase();
          break;
        case 'staff':
          valA = (a.salesPersonName || '').toLowerCase();
          valB = (b.salesPersonName || '').toLowerCase();
          break;
        case 'id':
          valA = (a.id || '').toLowerCase();
          valB = (b.id || '').toLowerCase();
          break;
        case 'status':
          valA = (a.orderStatus || '').toLowerCase();
          valB = (b.orderStatus || '').toLowerCase();
          break;
        case 'date':
        default:
          valA = new Date(a.orderDate).getTime();
          valB = new Date(b.orderDate).getTime();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, searchQuery, statusFilter, dateFilter, staffFilter, dealerFilter, sortBy, sortOrder]);

  // Filter & Sort Payments
  const processedPayments = useMemo(() => {
    let result = [...payments];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.id?.toLowerCase().includes(q) ||
        p.orderId?.toLowerCase().includes(q) ||
        p.clientName?.toLowerCase().includes(q) ||
        p.dealerName?.toLowerCase().includes(q) ||
        p.salesPersonName?.toLowerCase().includes(q) ||
        p.transactionRef?.toLowerCase().includes(q)
      );
    }

    // Payment Method filter
    if (statusFilter !== 'ALL') {
      result = result.filter(p => p.paymentMethod === statusFilter);
    }

    // Staff filter
    if (staffFilter !== 'ALL') {
      result = result.filter(p => p.salesPersonName === staffFilter);
    }

    // Dealer filter
    if (dealerFilter !== 'ALL') {
      result = result.filter(p => p.dealerName === dealerFilter);
    }

    // Date preset filter
    if (dateFilter !== 'ALL') {
      const now = new Date();
      result = result.filter(p => {
        const payDate = new Date(p.paymentDate);
        if (dateFilter === 'LAST_7_DAYS') {
          return (now - payDate) <= 7 * 86400000;
        } else if (dateFilter === 'LAST_30_DAYS') {
          return (now - payDate) <= 30 * 86400000;
        } else if (dateFilter === 'THIS_MONTH') {
          return payDate.getMonth() === now.getMonth() && payDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'amount':
          valA = a.amount;
          valB = b.amount;
          break;
        case 'client':
          valA = (a.clientName || '').toLowerCase();
          valB = (b.clientName || '').toLowerCase();
          break;
        case 'dealer':
          valA = (a.dealerName || '').toLowerCase();
          valB = (b.dealerName || '').toLowerCase();
          break;
        case 'staff':
          valA = (a.salesPersonName || '').toLowerCase();
          valB = (b.salesPersonName || '').toLowerCase();
          break;
        case 'id':
          valA = (a.id || '').toLowerCase();
          valB = (b.id || '').toLowerCase();
          break;
        case 'date':
        default:
          valA = new Date(a.paymentDate).getTime();
          valB = new Date(b.paymentDate).getTime();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [payments, searchQuery, statusFilter, dateFilter, staffFilter, dealerFilter, sortBy, sortOrder]);

  // Export Filtered & Sorted CSV
  const exportCSV = () => {
    let headers = [];
    let rows = [];

    if (reportType === 'SALES_SUMMARY') {
      headers = ['Order ID', 'Date', 'Client', 'Dealer Business', 'Sales Staff', 'Area', 'Total Amount', 'Paid', 'Pending', 'Status'];
      rows = processedOrders.map(o => [
        o.id,
        new Date(o.orderDate).toLocaleDateString('en-IN'),
        `"${o.clientName}"`,
        `"${o.dealerName}"`,
        `"${o.salesPersonName || 'Direct / House'}"`,
        `"${o.areaName}"`,
        o.totalAmount,
        o.amountPaid,
        o.amountPending,
        o.orderStatus
      ]);
    } else {
      headers = ['Payment ID', 'Order ID', 'Client', 'Dealer Business', 'Sales Staff', 'Amount', 'Method', 'Ref No', 'Date'];
      rows = processedPayments.map(p => [
        p.id,
        p.orderId,
        `"${p.clientName}"`,
        `"${p.dealerName}"`,
        `"${p.salesPersonName || 'Direct / House'}"`,
        p.amount,
        p.paymentMethod,
        p.transactionRef,
        new Date(p.paymentDate).toLocaleDateString('en-IN')
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `India_Hyundai_Power_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Financial totals based on filtered datasets
  const totalRev = processedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPaid = processedOrders.reduce((sum, o) => sum + o.amountPaid, 0);
  const totalPending = processedOrders.reduce((sum, o) => sum + o.amountPending, 0);

  const totalPaymentsCollected = processedPayments.reduce((sum, p) => sum + p.amount, 0);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || dateFilter !== 'ALL' || staffFilter !== 'ALL' || dealerFilter !== 'ALL' || sortBy !== 'date' || sortOrder !== 'desc';

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
      
      {/* Top Banner Actions */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Executive Reports & Data Export</h1>
          <p className="text-xs text-slate-500">Filter and sort by Staff Name, Dealer Business, Status, or Date range.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print PDF Report
          </button>
          <button
            onClick={exportCSV}
            className="bg-[#002C6C] hover:bg-[#0066B1] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-300" /> Export CSV Spreadsheet
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Printable Header */}
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <div className="text-xl font-black text-[#002C6C]">INDIA HYUNDAI POWER</div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Official Financial & Operations Audit Report</div>
            <div className="text-[11px] text-slate-400 mt-1">Generated by: {currentUser?.name} ({currentUser?.role}) • Territory: {currentUser?.areaName}</div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
            <div className="font-mono text-[10px] text-slate-400">System Ref: AUDIT-PORTAL-2026</div>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="no-print flex flex-wrap gap-2 border-b pb-4">
          <button
            onClick={() => setReportType('SALES_SUMMARY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              reportType === 'SALES_SUMMARY' ? 'bg-[#002C6C] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Sales & Orders Performance
          </button>
          <button
            onClick={() => setReportType('PAYMENT_LEDGER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              reportType === 'PAYMENT_LEDGER' ? 'bg-[#002C6C] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" /> Payments Collection Ledger
          </button>
          <button
            onClick={() => setReportType('AREA_WISE_STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              reportType === 'AREA_WISE_STAFF' ? 'bg-[#002C6C] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4 text-cyan-400" /> Region & State-Wise Staff
          </button>
        </div>

        {/* FILTER & SORTING CONTROLS BAR */}
        {reportType !== 'AREA_WISE_STAFF' && (
          <div className="no-print bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            
            {/* Search Input Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder={reportType === 'SALES_SUMMARY' ? 'Search Order ID, Client, Dealer Business, Staff Name...' : 'Search Payment ID, Order ID, Client, Dealer Business, Staff Name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              {/* Staff Member Filter */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Sales Staff:
                </label>
                <select
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                >
                  <option value="ALL">All Staff Members</option>
                  {uniqueStaffList.map(staff => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
              </div>

              {/* Dealer Business Filter */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-purple-600" /> Dealer Business:
                </label>
                <select
                  value={dealerFilter}
                  onChange={(e) => setDealerFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                >
                  <option value="ALL">All Dealer Businesses</option>
                  {uniqueDealerList.map(dealer => (
                    <option key={dealer} value={dealer}>{dealer}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-emerald-600" /> {reportType === 'SALES_SUMMARY' ? 'Order Status:' : 'Payment Method:'}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                >
                  <option value="ALL">All {reportType === 'SALES_SUMMARY' ? 'Statuses' : 'Methods'}</option>
                  {reportType === 'SALES_SUMMARY' ? (
                    <>
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </>
                  ) : (
                    <>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </>
                  )}
                </select>
              </div>

              {/* Sort By Field */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-600" /> Sort By:
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                  >
                    <option value="date">Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})</option>
                    <option value="amount">Amount ({sortOrder === 'desc' ? 'High → Low' : 'Low → High'})</option>
                    <option value="staff">Staff Name (A-Z)</option>
                    <option value="dealer">Dealer Business (A-Z)</option>
                    <option value="client">Client Name (A-Z)</option>
                    <option value="id">Reference ID</option>
                    {reportType === 'SALES_SUMMARY' && <option value="status">Order Status</option>}
                  </select>

                  <button
                    onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="px-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 font-mono font-bold text-slate-700 transition text-[11px]"
                    title="Toggle Ascending / Descending"
                  >
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </button>
                </div>
              </div>

            </div>

            {/* Active Filter Indicators & Reset Button */}
            <div className="flex items-center justify-between pt-1 text-[11px] font-medium border-t border-slate-200 text-slate-500">
              <div>
                Showing <strong>{reportType === 'SALES_SUMMARY' ? processedOrders.length : processedPayments.length}</strong> of{' '}
                <strong>{reportType === 'SALES_SUMMARY' ? orders.length : payments.length}</strong> records
                {(staffFilter !== 'ALL' || dealerFilter !== 'ALL') && (
                  <span className="text-[#0066B1] font-bold ml-2">
                    (Filtered by {staffFilter !== 'ALL' ? `Staff: "${staffFilter}"` : ''} {dealerFilter !== 'ALL' ? `Dealer: "${dealerFilter}"` : ''})
                  </span>
                )}
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
        )}

        {/* Financial Highlights */}
        {reportType !== 'AREA_WISE_STAFF' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 block font-medium">Filtered Gross Sales Value</span>
              <span className="text-lg font-black text-[#002C6C]">₹{totalRev.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400 block">{processedOrders.length} Filtered Orders</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">
                {reportType === 'SALES_SUMMARY' ? 'Paid Amount (Confirmed Orders)' : 'Total Collections Recorded'}
              </span>
              <span className="text-lg font-black text-emerald-700">
                ₹{(reportType === 'SALES_SUMMARY' ? totalPaid : totalPaymentsCollected).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">Verified Payments</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Pending Ledger Balance</span>
              <span className="text-lg font-black text-rose-600">₹{totalPending.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-rose-500 font-bold block">Outstanding Balance</span>
            </div>
          </div>
        )}

        {/* Data Table */}
        {reportType !== 'AREA_WISE_STAFF' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-y border-slate-300">
                {reportType === 'SALES_SUMMARY' ? (
                  <tr>
                    <th className="p-3">{renderSortHeader('Order ID', 'id')}</th>
                    <th className="p-3">{renderSortHeader('Date', 'date')}</th>
                    <th className="p-3">{renderSortHeader('Client', 'client')}</th>
                    <th className="p-3">{renderSortHeader('Dealer Business', 'dealer')}</th>
                    <th className="p-3">{renderSortHeader('Sales Staff', 'staff')}</th>
                    <th className="p-3">{renderSortHeader('Total Amount', 'amount')}</th>
                    <th className="p-3">Amount Paid</th>
                    <th className="p-3">Amount Pending</th>
                    <th className="p-3">{renderSortHeader('Status', 'status')}</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-3">{renderSortHeader('Payment ID', 'id')}</th>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">{renderSortHeader('Client', 'client')}</th>
                    <th className="p-3">{renderSortHeader('Dealer Business', 'dealer')}</th>
                    <th className="p-3">{renderSortHeader('Sales Staff', 'staff')}</th>
                    <th className="p-3">{renderSortHeader('Amount', 'amount')}</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Transaction Ref</th>
                    <th className="p-3">{renderSortHeader('Date', 'date')}</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {reportType === 'SALES_SUMMARY' ? (
                  processedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400 italic font-sans">
                        No order records match your selected filters. Click "Reset All Filters" above to view all orders.
                      </td>
                    </tr>
                  ) : (
                    processedOrders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-[#002C6C]">{o.id}</td>
                        <td className="p-3">{new Date(o.orderDate).toLocaleDateString('en-IN')}</td>
                        <td className="p-3 font-bold text-slate-900">{o.clientName}</td>
                        <td className="p-3 text-slate-800 font-bold">{o.dealerName}</td>
                        <td className="p-3 text-blue-900 font-semibold">{o.salesPersonName || 'Direct / House'}</td>
                        <td className="p-3 font-extrabold text-[#002C6C]">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-emerald-700 font-bold">₹{o.amountPaid.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-rose-600 font-bold">₹{o.amountPending.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            o.orderStatus === 'DELIVERED' || o.orderStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            o.orderStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            o.orderStatus === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  processedPayments.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400 italic font-sans">
                        No payment records match your selected filters. Click "Reset All Filters" above to view all payments.
                      </td>
                    </tr>
                  ) : (
                    processedPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-[#002C6C]">{p.id}</td>
                        <td className="p-3 font-mono text-slate-600">{p.orderId}</td>
                        <td className="p-3 font-bold text-slate-900">{p.clientName}</td>
                        <td className="p-3 text-slate-800 font-bold">{p.dealerName}</td>
                        <td className="p-3 text-blue-900 font-semibold">{p.salesPersonName || 'Direct / House'}</td>
                        <td className="p-3 text-emerald-700 font-black">₹{p.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-600 text-[11px]">{p.transactionRef}</td>
                        <td className="p-3">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'AREA_WISE_STAFF' && (
          <AreaWiseStaffReport />
        )}

      </div>

    </div>
  );
}
