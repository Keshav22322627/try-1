// India Hyundai Power - Complaints & Service Ticket Management Module

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService } from '../../services/dbService.js';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  AlertTriangle, Search, Plus, UserCheck, Shield, CheckCircle2, Clock, MapPin,
  Wrench, Phone, FileText, X, ChevronRight, User, BatteryCharging, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function ComplaintsManagement() {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Sort Controls
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'priority' | 'dealer' | 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // New Complaint Modal State
  const [showFileModal, setShowFileModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    clientName: '',
    clientPhone: '',
    batteryModel: 'Hyundai Solaria 180Ah Tall Tubular Battery',
    orderId: '',
    issueType: 'LOW_BACKUP',
    description: '',
    priority: 'HIGH'
  });

  // Assign Person Modal State
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState('');

  // Update Status Modal State
  const [statusUpdatingComplaint, setStatusUpdatingComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const isDealer = currentUser?.role === 'DEALER';
  const canAssignOrManage = ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'].includes(currentUser?.role);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await dbService.getComplaints(currentUser);
    setComplaints(data || []);

    const allUsers = dbStore.getUsers();
    // Non-dealer staff and sales representatives who can be assigned
    const staff = allUsers.filter(u => ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'].includes(u.role));
    setAssignableUsers(staff);

    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint.clientName || !newComplaint.clientPhone || !newComplaint.description) {
      alert('Please fill in Client Name, Phone, and Problem Description.');
      return;
    }

    try {
      await dbService.createComplaint(newComplaint, currentUser);
      setActionSuccess('Service complaint filed successfully! Staff will assign a representative to your dealership.');
      setShowFileModal(false);
      setNewComplaint({
        clientName: '',
        clientPhone: '',
        batteryModel: 'Hyundai Solaria 180Ah Tall Tubular Battery',
        orderId: '',
        issueType: 'LOW_BACKUP',
        description: '',
        priority: 'HIGH'
      });
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to file complaint');
    }
  };

  const handleAssignPersonSubmit = async (e) => {
    e.preventDefault();
    if (!assigningComplaint || !selectedPersonId) return;

    try {
      const assignedUser = assignableUsers.find(u => u.id === selectedPersonId);
      await dbService.assignComplaintPerson(
        assigningComplaint.id,
        selectedPersonId,
        assignedUser ? assignedUser.name : 'Assigned Staff',
        currentUser
      );

      setActionSuccess(`Assigned complaint ${assigningComplaint.id} to ${assignedUser ? assignedUser.name : 'Staff'}!`);
      setAssigningComplaint(null);
      setSelectedPersonId('');
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to assign representative');
    }
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!statusUpdatingComplaint) return;

    try {
      await dbService.updateComplaintStatus(
        statusUpdatingComplaint.id,
        newStatus,
        resolutionNotes,
        currentUser
      );

      setActionSuccess(`Complaint ${statusUpdatingComplaint.id} status updated to "${newStatus}"!`);
      setStatusUpdatingComplaint(null);
      setResolutionNotes('');
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update complaint status');
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
    setPriorityFilter('ALL');
    setSortBy('date');
    setSortOrder('desc');
  };

  const filteredComplaints = useMemo(() => {
    let result = [...complaints];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c =>
        c.id?.toLowerCase().includes(q) ||
        c.dealerName?.toLowerCase().includes(q) ||
        c.clientName?.toLowerCase().includes(q) ||
        c.batteryModel?.toLowerCase().includes(q) ||
        c.assignedPersonName?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      result = result.filter(c => c.priority === priorityFilter);
    }

    // Sorting
    const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'priority':
          valA = priorityWeight[a.priority] || 0;
          valB = priorityWeight[b.priority] || 0;
          break;
        case 'dealer':
          valA = (a.dealerName || '').toLowerCase();
          valB = (b.dealerName || '').toLowerCase();
          break;
        case 'status':
          valA = (a.status || '').toLowerCase();
          valB = (b.status || '').toLowerCase();
          break;
        case 'date':
        default:
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [complaints, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || sortBy !== 'date' || sortOrder !== 'desc';

  const getPriorityBadgeClass = (pri) => {
    switch (pri) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusBadgeClass = (st) => {
    switch (st) {
      case 'RESOLVED':
      case 'REPLACED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'IN_PROGRESS':
      case 'ASSIGNED':
        return 'bg-[#002C6C]/10 text-[#002C6C] border-[#002C6C]/20';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-rose-400/20 text-rose-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-rose-400/30">
              SERVICE & WARRANTY CLAIMS
            </span>
            <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {isDealer ? 'Dealer Claims Portal' : 'Staff Assignment Console'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Dealer Complaints & Service Tickets</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {isDealer 
              ? 'File battery warranty claims or customer complaints and check assigned service representatives.'
              : 'View complaints filed by dealers, assign field engineers/sales persons to dealers, and resolve issues.'}
          </p>
        </div>

        <button
          onClick={() => setShowFileModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-rose-200" /> File New Battery Complaint
        </button>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* FILTER & SORTING BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <label className="font-bold text-slate-600 block mb-1">Search Tickets:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Complaint ID, Dealer, Customer, Battery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Ticket Status Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Service Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Ticket Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REPLACED">REPLACED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Ticket Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">CRITICAL (Immediate Action)</option>
              <option value="HIGH">HIGH Priority</option>
              <option value="MEDIUM">MEDIUM Priority</option>
              <option value="LOW">LOW Priority</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Sort Tickets By:</label>
            <div className="flex gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
              >
                <option value="date">Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})</option>
                <option value="priority">Priority ({sortOrder === 'desc' ? 'Critical First' : 'Low First'})</option>
                <option value="dealer">Dealer Name (A-Z)</option>
                <option value="status">Ticket Status</option>
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
            Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaints.length}</strong> service complaints
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

      {/* Complaints List Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="border-b pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Complaints Ledger ({filteredComplaints.length})</h3>
          <span className="text-xs text-slate-400 font-medium">
            {canAssignOrManage ? 'All Dealer Requests' : 'Your Dealership Requests'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs font-bold text-slate-400 animate-pulse">Loading service tickets...</div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Complaints Found</h4>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              No registered complaints match your current search or filter. Click below to file a new service ticket.
            </p>
            <button
              onClick={() => setShowFileModal(true)}
              className="bg-[#002C6C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-[#0066B1]"
            >
              File Battery Complaint
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map(c => (
              <div
                key={c.id}
                className="bg-slate-50/70 hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 transition group"
              >
                {/* Top Row: IDs, Priority, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                      {c.id}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${getPriorityBadgeClass(c.priority)}`}>
                      {c.priority} PRIORITY
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                    {c.orderId && (
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        Order Ref: {c.orderId}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Filed: {new Date(c.createdAt).toLocaleDateString('en-IN')} {new Date(c.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Middle Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Dealer & Client Info */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dealer & Customer Details</span>
                    <div className="font-extrabold text-slate-900 text-sm">{c.dealerName}</div>
                    <div className="text-slate-600 font-medium">{c.clientName} ({c.clientPhone})</div>
                  </div>

                  {/* Battery & Problem */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Battery & Issue Reported</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <BatteryCharging className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" /> {c.batteryModel}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{c.description}</p>
                  </div>

                  {/* Assigned Person Block */}
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Service Person</span>
                    {c.assignedPersonName ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-1 text-xs">
                            <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>{c.assignedPersonName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">Status: Active Handler</span>
                        </div>
                        {canAssignOrManage && (
                          <button
                            onClick={() => { setAssigningComplaint(c); setSelectedPersonId(c.assignedPersonId || ''); }}
                            className="text-[10px] font-bold text-[#0066B1] hover:underline"
                          >
                            Reassign
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-rose-600 font-bold text-[11px] italic">Unassigned Staff</span>
                        {canAssignOrManage && (
                          <button
                            onClick={() => { setAssigningComplaint(c); setSelectedPersonId(''); }}
                            className="bg-[#002C6C] text-white px-2.5 py-1 rounded-lg font-bold text-[10px] hover:bg-[#0066B1] shadow-sm"
                          >
                            Assign Representative
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {c.resolutionNotes && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl text-[11px] font-medium flex-1">
                      <strong>Resolution Update:</strong> {c.resolutionNotes}
                    </div>
                  )}

                  {canAssignOrManage && (
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => { setStatusUpdatingComplaint(c); setNewStatus(c.status); setResolutionNotes(c.resolutionNotes || ''); }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 shadow-sm"
                      >
                        <Wrench className="w-3.5 h-3.5 text-cyan-400" /> Update Ticket Status
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* File New Complaint Modal */}
      {showFileModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">File Battery Service / Warranty Complaint</h3>
              <button onClick={() => setShowFileModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleFileComplaintSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer / Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newComplaint.clientName}
                    onChange={(e) => setNewComplaint({ ...newComplaint, clientName: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 00000"
                    value={newComplaint.clientPhone}
                    onChange={(e) => setNewComplaint({ ...newComplaint, clientPhone: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Battery Model / Type</label>
                <select
                  value={newComplaint.batteryModel}
                  onChange={(e) => setNewComplaint({ ...newComplaint, batteryModel: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="Hyundai Solaria 180Ah Tall Tubular Battery">Hyundai Solaria 180Ah Tall Tubular Battery</option>
                  <option value="Hyundai Solaria 150Ah Short Tubular Battery">Hyundai Solaria 150Ah Short Tubular Battery</option>
                  <option value="Hyundai VoltMax 220Ah Heavy Tubular Battery">Hyundai VoltMax 220Ah Heavy Tubular Battery</option>
                  <option value="Hyundai TurboPower 12V 65Ah Automotive Battery">Hyundai TurboPower 12V 65Ah Automotive Battery</option>
                  <option value="Hyundai SolarGrid 200Ah C10 Solar Battery">Hyundai SolarGrid 200Ah C10 Solar Battery</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Order Ref (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-PB-1001"
                    value={newComplaint.orderId}
                    onChange={(e) => setNewComplaint({ ...newComplaint, orderId: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ticket Priority</label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate)</option>
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Description / Battery Defect</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe the battery issue (e.g., low backup time, acid leakage, non-charging)..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowFileModal(false)} className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-rose-600 text-white font-extrabold rounded-xl shadow">File Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Person Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">Assign Representative - {assigningComplaint.id}</h3>
              <button onClick={() => setAssigningComplaint(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAssignPersonSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dealership:</label>
                <div className="p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-800">
                  {assigningComplaint.dealerName} ({assigningComplaint.clientName})
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Field Representative / Engineer:</label>
                <select
                  required
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                >
                  <option value="">-- Select Representative --</option>
                  {assignableUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.replace('_', ' ')}) - {u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setAssigningComplaint(null)} className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-[#002C6C] text-white font-extrabold rounded-xl shadow">Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Ticket Status Modal */}
      {statusUpdatingComplaint && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">Update Service Ticket - {statusUpdatingComplaint.id}</h3>
              <button onClick={() => setStatusUpdatingComplaint(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleStatusUpdateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Ticket Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                >
                  <option value="ASSIGNED">ASSIGNED (Representative Dispatched)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Under Inspection)</option>
                  <option value="RESOLVED">RESOLVED (Repaired / Serviced)</option>
                  <option value="REPLACED">REPLACED (New Battery Provided)</option>
                  <option value="REJECTED">REJECTED (Out of Warranty / Misuse)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Resolution & Service Notes:</label>
                <textarea
                  rows="3"
                  placeholder="Enter details of inspection, repair, or battery replacement..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setStatusUpdatingComplaint(null)} className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl shadow">Update Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
