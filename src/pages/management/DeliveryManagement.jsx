// India Hyundai Power - Delivery & Logistics Control Module

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService } from '../../services/dbService.js';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Truck, User, Phone, CheckCircle2, MapPin, Clock, Plus, Trash2, Shield, X, Search, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function DeliveryManagement() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState([]);
  const [actionSuccess, setActionSuccess] = useState('');

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING_DISPATCH' | 'PROCESSING_WAREHOUSE' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  const [agentFilter, setAgentFilter] = useState('ALL');
  
  // Sorting States
  const [sortBy, setSortBy] = useState('id'); // 'id' | 'client' | 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Modal State
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
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
    setDeliveryPersonnel(partners || []);
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssignAgent = async (orderId, agentId) => {
    if (!isAdmin) {
      alert('Unauthorized: Assigning delivery agents is strictly restricted to Administrators.');
      return;
    }

    try {
      const agent = deliveryPersonnel.find(p => p.id === agentId);
      await dbService.updateDeliveryStatus(orderId, {
        deliveryPersonId: agentId,
        deliveryPersonName: agent ? agent.name : '',
        deliveryPersonPhone: agent ? agent.phone : ''
      }, currentUser);

      setActionSuccess(`Assigned Order ${orderId} to agent ${agent ? agent.name : 'Unassigned'}!`);
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    if (!isAdmin) {
      alert('Unauthorized: Updating delivery dispatches is strictly restricted to Administrators.');
      return;
    }

    try {
      await dbService.updateDeliveryStatus(orderId, { deliveryStatus: newStatus }, currentUser);
      setActionSuccess(`Order ${orderId} dispatch status set to "${newStatus}"!`);
      setTimeout(() => setActionSuccess(''), 4000);
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
      setActionSuccess(`Added new delivery partner "${newPartner.name}"!`);
      setShowAddPartnerModal(false);
      setNewPartner({ name: '', phone: '', vehicleNumber: '', areaName: 'Punjab Region' });
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePartner = async (partnerId, partnerName) => {
    if (!isAdmin) return;
    try {
      await dbService.deleteDeliveryPartner(partnerId, currentUser);
      setActionSuccess(`Removed delivery partner "${partnerName}".`);
      setTimeout(() => setActionSuccess(''), 4000);
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
    setDeliveryStatusFilter('ALL');
    setAgentFilter('ALL');
    setSortBy('id');
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
        o.deliveryAddress?.toLowerCase().includes(q) ||
        o.deliveryPersonName?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q)
      );
    }

    // Delivery Status filter
    if (deliveryStatusFilter !== 'ALL') {
      result = result.filter(o => (o.deliveryStatus || 'PENDING_DISPATCH') === deliveryStatusFilter);
    }

    // Agent filter
    if (agentFilter !== 'ALL') {
      result = result.filter(o => o.deliveryPersonId === agentFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'client':
          valA = (a.clientName || '').toLowerCase();
          valB = (b.clientName || '').toLowerCase();
          break;
        case 'status':
          valA = (a.deliveryStatus || '').toLowerCase();
          valB = (b.deliveryStatus || '').toLowerCase();
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
  }, [orders, searchQuery, deliveryStatusFilter, agentFilter, sortBy, sortOrder]);

  const hasActiveFilters = searchQuery !== '' || deliveryStatusFilter !== 'ALL' || agentFilter !== 'ALL' || sortBy !== 'id' || sortOrder !== 'desc';

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
          <h1 className="text-2xl font-black text-slate-900">Delivery & Logistics Control</h1>
          <p className="text-xs text-slate-500">
            {isAdmin 
              ? 'Administrator Controls: Add or remove delivery partners, assign dispatches, and manage logistics.'
              : 'Read-Only View: Track active vehicle dispatches and live order delivery status.'}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setShowAddPartnerModal(true)}
            className="bg-[#002C6C] hover:bg-[#001D4A] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Add New Delivery Partner
          </button>
        ) : (
          <div className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Delivery Management: Restricted to Admin</span>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Delivery Personnel Roster Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Active Delivery Fleet Roster ({deliveryPersonnel.length})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryPersonnel.length === 0 ? (
            <div className="col-span-3 bg-white p-6 rounded-2xl text-center text-xs text-slate-400 font-medium">
              No delivery partners registered. Click "Add New Delivery Partner" above.
            </div>
          ) : (
            deliveryPersonnel.map(dp => (
              <div key={dp.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative group hover:border-[#0066B1] transition">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0066B1]" /> {dp.name}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      {dp.status || 'ACTIVE'}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeletePartner(dp.id, dp.name)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1 rounded-lg text-xs font-bold transition border border-rose-200"
                        title={`Remove ${dp.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 font-medium">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Phone className="w-3 h-3 text-slate-400" /> {dp.phone}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Vehicle: {dp.vehicleNumber}</div>
                  <div className="text-[11px] text-[#002C6C] font-bold">Region: {dp.areaName}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FILTER & SORTING BAR FOR DISPATCH TABLE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <label className="font-bold text-slate-600 block mb-1">Search Dispatch:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Order ID, Client, Address, Agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Delivery Status Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Delivery Dispatch Status:</label>
            <select
              value={deliveryStatusFilter}
              onChange={(e) => setDeliveryStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Delivery Statuses</option>
              <option value="PENDING_DISPATCH">PENDING_DISPATCH</option>
              <option value="PROCESSING_WAREHOUSE">PROCESSING_WAREHOUSE</option>
              <option value="IN_TRANSIT">IN_TRANSIT</option>
              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
          </div>

          {/* Agent Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Assigned Delivery Agent:</label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Agents</option>
              {deliveryPersonnel.map(dp => (
                <option key={dp.id} value={dp.id}>{dp.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-medium border-t border-slate-100 text-slate-500">
          <div>
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> dispatches
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

      {/* Delivery Assignments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-bold text-slate-900 text-base">Active Orders Dispatch & Delivery Assignment</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">{renderSortHeader('Order ID', 'id')}</th>
                <th className="p-3">{renderSortHeader('Client', 'client')}</th>
                <th className="p-3">Delivery Address</th>
                <th className="p-3">Assigned Delivery Agent</th>
                <th className="p-3">{renderSortHeader('Current Status', 'status')}</th>
                <th className="p-3 text-right">Dispatch Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium italic">
                    No active dispatches match your filter criteria. Click "Reset All Filters" above.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#002C6C]">{o.id}</td>
                    <td className="p-3 font-bold text-slate-900">{o.clientName}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{o.deliveryAddress || 'Dealer Premises'}</td>
                    <td className="p-3">
                      {isAdmin ? (
                        <select
                          value={o.deliveryPersonId || ''}
                          onChange={(e) => handleAssignAgent(o.id, e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                        >
                          <option value="">Select Agent...</option>
                          {deliveryPersonnel.map(dp => (
                            <option key={dp.id} value={dp.id}>{dp.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-bold text-slate-800">{o.deliveryPersonName || 'Unassigned'}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        o.deliveryStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        o.deliveryStatus === 'IN_TRANSIT' || o.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'bg-cyan-100 text-cyan-800 border-cyan-300' :
                        'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {o.deliveryStatus || 'PENDING_DISPATCH'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {isAdmin && (
                        <select
                          value={o.deliveryStatus || 'PENDING_DISPATCH'}
                          onChange={(e) => handleUpdateDeliveryStatus(o.id, e.target.value)}
                          className="bg-white border border-slate-300 rounded-lg p-1.5 text-[11px] font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                        >
                          <option value="PENDING_DISPATCH">PENDING_DISPATCH</option>
                          <option value="PROCESSING_WAREHOUSE">PROCESSING_WAREHOUSE</option>
                          <option value="IN_TRANSIT">IN_TRANSIT</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Delivery Partner Modal */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">Add New Delivery Partner</h3>
              <button onClick={() => setShowAddPartnerModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddPartnerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Driver / Partner Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurmeet Ram"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={newPartner.phone}
                  onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vehicle / Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. PB-10-CZ-4482 (Tata Ace)"
                  value={newPartner.vehicleNumber}
                  onChange={(e) => setNewPartner({ ...newPartner, vehicleNumber: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowAddPartnerModal(false)} className="w-1/2 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-[#002C6C] text-white font-extrabold rounded-xl shadow">Add Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
