// India Hyundai Power - Orders & Sales Master Management

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService } from '../../services/dbService.js';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Search, Filter, Truck, CheckCircle2, XCircle, Clock, Eye, Shield, Edit, X, Plus, Trash2,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, DollarSign
} from 'lucide-react';

export default function OrdersManagement() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [actionMessage, setActionMessage] = useState('');

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  const [paymentFilter, setPaymentFilter] = useState('ALL'); // 'ALL' | 'UNPAID' | 'PARTIAL' | 'PAID'
  
  // Sorting States
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount' | 'client' | 'status' | 'id'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Delivery Order Modal State
  const [editingOrder, setEditingOrder] = useState(null);
  const [deliveryData, setDeliveryData] = useState({
    deliveryStatus: 'PENDING_DISPATCH',
    courierPartner: 'VRL Logistics',
    trackingNumber: '',
    dispatchDate: '',
    expectedDeliveryDate: '',
    deliveryAddress: '',
    driverPhone: ''
  });

  // Delivery Partners Admin Management Modal State
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
    areaName: 'Punjab Region'
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadData = useCallback(async () => {
    setOrders(dbStore.getOrdersForUser(currentUser));
    const partners = await dbService.getDeliveryPartners();
    setDeliveryPartners(partners || []);
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!isAdmin) {
      alert('Unauthorized: Order confirmation, denial, and status changes are strictly restricted to Administrators.');
      return;
    }

    try {
      await dbService.updateOrderStatus(orderId, newStatus, currentUser);
      setActionMessage(`Order ${orderId} status set to "${newStatus}".`);
      setTimeout(() => setActionMessage(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenDeliveryModal = (order) => {
    setEditingOrder(order);
    setDeliveryData({
      deliveryStatus: order.deliveryStatus || 'PENDING_DISPATCH',
      courierPartner: order.courierPartner || 'VRL Logistics',
      trackingNumber: order.trackingNumber || '',
      dispatchDate: order.dispatchDate ? order.dispatchDate.split('T')[0] : new Date().toISOString().split('T')[0],
      expectedDeliveryDate: order.expectedDeliveryDate ? order.expectedDeliveryDate.split('T')[0] : '',
      deliveryAddress: order.deliveryAddress || '',
      driverPhone: order.driverPhone || ''
    });
  };

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Unauthorized: Updating delivery dispatches is strictly restricted to Administrators.');
      return;
    }

    try {
      await dbService.updateDeliveryStatus(editingOrder.id, deliveryData, currentUser);
      setActionMessage(`Updated delivery tracking for Order ${editingOrder.id}!`);
      setEditingOrder(null);
      setTimeout(() => setActionMessage(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddPartnerSubmit = async (e) => {
    e.preventDefault();
    if (!newPartner.name) return;

    try {
      await dbService.addDeliveryPartner(newPartner, currentUser);
      setActionMessage(`Added new delivery partner "${newPartner.name}"!`);
      setShowPartnerModal(false);
      setNewPartner({ name: '', phone: '', vehicleNumber: '', areaName: 'Punjab Region' });
      setTimeout(() => setActionMessage(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePartner = async (partnerId, partnerName) => {
    if (!isAdmin) return;
    try {
      await dbService.deleteDeliveryPartner(partnerId, currentUser);
      setActionMessage(`Removed Delivery Partner "${partnerName}".`);
      setTimeout(() => setActionMessage(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message);
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
    setStatusFilter('ALL');
    setPaymentFilter('ALL');
    setSortBy('date');
    setSortOrder('desc');
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.dealerName?.toLowerCase().includes(q) ||
        o.areaName?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q)
      );
    }

    // Order Status Filter
    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.orderStatus === statusFilter);
    }

    // Payment Status Filter
    if (paymentFilter !== 'ALL') {
      result = result.filter(o => o.paymentStatus === paymentFilter);
    }

    // Sorting
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
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy, sortOrder]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || paymentFilter !== 'ALL' || sortBy !== 'date' || sortOrder !== 'desc';

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
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Orders & Sales Master Ledger</h1>
          <p className="text-xs text-slate-500">
            {isAdmin 
              ? 'Administrator Controls: Confirm/Deny orders, manage courier delivery logistics, and add/remove delivery partners.'
              : 'Read-Only View: View order timeline and status updates for your assigned territory.'}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setShowPartnerModal(true)}
            className="bg-[#002C6C] hover:bg-[#001D4A] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-cyan-400" /> Manage Delivery Partners
          </button>
        ) : (
          <div className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Order Approval & Delivery: Admin Restricted</span>
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* FILTER & SORTING BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <label className="font-bold text-slate-600 block mb-1">Search Orders:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Order ID, Client, Dealer, Tracking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Order Status Filter */}
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

          {/* Payment Status Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Payment Ledger Status:</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="UNPAID">UNPAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
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
                <option value="client">Client Name (A-Z)</option>
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

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">{renderSortHeader('Order ID', 'id')}</th>
                <th className="p-3">{renderSortHeader('Date', 'date')}</th>
                <th className="p-3">{renderSortHeader('Client / Dealer', 'client')}</th>
                <th className="p-3">Area</th>
                <th className="p-3">{renderSortHeader('Total Amount', 'amount')}</th>
                <th className="p-3">Payment</th>
                <th className="p-3">{renderSortHeader('Order Status & Decision', 'status')}</th>
                <th className="p-3">Delivery & Logistics</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400 italic">
                    No orders match your current filter settings. Click "Reset All Filters" above to view all records.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#002C6C]">{o.id}</td>
                    <td className="p-3 text-slate-500">{new Date(o.orderDate || Date.now()).toLocaleDateString('en-IN')}</td>
                    <td className="p-3">
                      <div className="font-extrabold text-slate-900">{o.clientName}</div>
                      {o.dealerName && <div className="text-[11px] text-slate-500 font-normal">Dealer: {o.dealerName}</div>}
                    </td>
                    <td className="p-3 text-slate-600 font-semibold">{o.areaName || 'India'}</td>
                    <td className="p-3 font-extrabold text-slate-900 text-sm">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        o.paymentStatus === 'PARTIAL' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {o.paymentStatus || 'UNPAID'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          o.orderStatus === 'CONFIRMED' || o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          o.orderStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          o.orderStatus === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {o.orderStatus}
                        </span>

                        {/* Admin Decision Actions */}
                        {isAdmin && o.orderStatus === 'PENDING' && (
                          <div className="flex gap-1.5 pt-1">
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[10px] shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'CANCELLED')}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded text-[10px] shadow-sm"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="font-bold text-slate-800">{o.deliveryStatus || 'PENDING_DISPATCH'}</div>
                        {o.trackingNumber && (
                          <div className="font-mono text-slate-500">AWB: {o.trackingNumber} ({o.courierPartner})</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenDeliveryModal(o)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1.5 rounded-lg text-xs transition inline-flex items-center gap-1 border border-slate-300"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#0066B1]" /> Dispatch
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Delivery Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">Dispatch & Logistics - {editingOrder.id}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveDelivery} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dispatch Status</label>
                <select
                  value={deliveryData.deliveryStatus}
                  onChange={(e) => setDeliveryData({ ...deliveryData, deliveryStatus: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2 font-bold"
                >
                  <option value="PENDING_DISPATCH">PENDING_DISPATCH</option>
                  <option value="PROCESSING_WAREHOUSE">PROCESSING_WAREHOUSE</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={deliveryData.courierPartner}
                  onChange={(e) => setDeliveryData({ ...deliveryData, courierPartner: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">AWB Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. VRL-PB-99120"
                  value={deliveryData.trackingNumber}
                  onChange={(e) => setDeliveryData({ ...deliveryData, trackingNumber: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setEditingOrder(null)} className="w-1/2 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-[#002C6C] text-white font-extrabold rounded-xl shadow">Save Dispatch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Manage Delivery Partners Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">Manage Delivery Partners & Carriers</h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {/* List existing */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase">Registered Carrier Roster</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {deliveryPartners.map(p => (
                  <div key={p.id} className="bg-slate-50 p-2.5 rounded-xl border flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{p.name} ({p.phone})</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.vehicleNumber} • {p.areaName}</div>
                    </div>
                    <button
                      onClick={() => handleDeletePartner(p.id, p.name)}
                      className="text-rose-600 hover:text-rose-800 p-1 font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add new partner form */}
            <form onSubmit={handleAddPartnerSubmit} className="border-t pt-3 space-y-3 text-xs">
              <h4 className="font-bold text-xs text-[#002C6C] uppercase">+ Add New Delivery Partner</h4>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Driver / Carrier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Singh (VRL Logistics)"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle / Reg No.</label>
                  <input
                    type="text"
                    placeholder="PB-10-CZ-9911 (Bolero Maxi)"
                    value={newPartner.vehicleNumber}
                    onChange={(e) => setNewPartner({ ...newPartner, vehicleNumber: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow">
                Add Carrier Partner
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
