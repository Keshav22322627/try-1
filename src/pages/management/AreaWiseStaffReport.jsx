// India Hyundai Power - Region / State-Wise Staff Management Report

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { dbService } from '../../services/dbService.js';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Users, MapPin, ChevronDown, ChevronUp, Download, Search, Filter, 
  Shield, UserCheck, Mail, Phone, ArrowUpDown, User, Building, Layers
} from 'lucide-react';

export default function AreaWiseStaffReport() {
  const { currentUser } = useAuth();
  const [areaData, setAreaData] = useState([]);
  const [areasList, setAreasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAreas, setExpandedAreas] = useState({});
  
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('STAFF_ONLY'); // 'STAFF_ONLY' | 'SALES_HEAD' | 'SALES_PERSON' | 'ALL'
  const [territoryTypeFilter, setTerritoryTypeFilter] = useState('ALL'); // 'ALL' | 'State' | 'Region' | 'Country'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'role' | 'area'

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dbService.getAreaWiseStaffAndDealers(currentUser);
      const areas = dbStore.getAreas();
      setAreaData(data || []);
      setAreasList(areas || []);

      // Expand all by default
      const initialExpanded = {};
      (data || []).forEach(a => { initialExpanded[a.areaId] = true; });
      setExpandedAreas(initialExpanded);
    } catch (error) {
      console.error('Error loading area-wise staff data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleArea = (areaId) => {
    setExpandedAreas(prev => ({
      ...prev,
      [areaId]: !prev[areaId]
    }));
  };

  // Export CSV Spreadsheet of Staff
  const exportCSV = () => {
    let headers = ['Region / State', 'Territory Type', 'Role', 'Staff Name', 'Email', 'Phone', 'Assigned Sales Head', 'Status'];
    let rows = [];

    processedAreaData.forEach(area => {
      area.staffMembers.forEach(user => {
        rows.push([
          `"${area.areaName}"`,
          `"${area.areaType}"`,
          user.role === 'SALES_HEAD' ? 'Sales Head' : user.role === 'SALES_PERSON' ? 'Sales Person' : user.role,
          `"${user.name}"`,
          user.email,
          user.phone,
          `"${user.salesHeadName || '-'}"`,
          user.status
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `India_Hyundai_Power_Region_State_Staff_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process Area & Staff Data strictly for Region / State wise staff output
  const processedAreaData = useMemo(() => {
    return areaData.map(area => {
      // Find area object from areas list to get type (State/Region/Country)
      const areaMeta = areasList.find(a => a.id === area.areaId || a.name === area.areaName);
      const areaType = areaMeta?.type || 'Region / State';

      // Gather staff members based on staffRoleFilter
      let staff = [];
      if (staffRoleFilter === 'STAFF_ONLY' || staffRoleFilter === 'ALL' || staffRoleFilter === 'SALES_HEAD') {
        staff = [...staff, ...area.salesHeads.map(u => ({ ...u, role: 'SALES_HEAD' }))];
      }
      if (staffRoleFilter === 'STAFF_ONLY' || staffRoleFilter === 'ALL' || staffRoleFilter === 'SALES_PERSON') {
        staff = [...staff, ...area.salesPersons.map(u => ({ ...u, role: 'SALES_PERSON' }))];
      }
      if (staffRoleFilter === 'ALL' || staffRoleFilter === 'DEALER') {
        staff = [...staff, ...area.dealers.map(u => ({ ...u, role: 'DEALER' }))];
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        staff = staff.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          (u.businessName && u.businessName.toLowerCase().includes(q))
        );
      }

      // Sort staff
      staff.sort((a, b) => {
        if (sortBy === 'role') {
          return a.role.localeCompare(b.role);
        } else {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        }
      });

      return {
        ...area,
        areaType,
        staffMembers: staff,
        salesHeadsCount: area.salesHeads.length,
        salesPersonsCount: area.salesPersons.length,
        totalStaffCount: area.salesHeads.length + area.salesPersons.length
      };
    }).filter(area => {
      // Territory Type Filter
      if (territoryTypeFilter !== 'ALL') {
        return area.areaType.toLowerCase() === territoryTypeFilter.toLowerCase();
      }
      return true;
    });
  }, [areaData, areasList, searchQuery, staffRoleFilter, territoryTypeFilter, sortBy]);

  // Overall summary metrics
  const totalRegionsCount = processedAreaData.length;
  const grandTotalStaff = processedAreaData.reduce((sum, a) => sum + a.totalStaffCount, 0);
  const totalSalesHeads = processedAreaData.reduce((sum, a) => sum + a.salesHeadsCount, 0);
  const totalSalesPersons = processedAreaData.reduce((sum, a) => sum + a.salesPersonsCount, 0);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SALES_HEAD':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-[#002C6C] text-[11px] font-extrabold rounded-full border border-blue-200 inline-flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-600" /> Sales Head
          </span>
        );
      case 'SALES_PERSON':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-extrabold rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-600" /> Sales Person
          </span>
        );
      case 'DEALER':
        return (
          <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-[11px] font-extrabold rounded-full border border-purple-200 inline-flex items-center gap-1">
            <Building className="w-3 h-3 text-purple-600" /> Dealer
          </span>
        );
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[11px] font-bold rounded-full">{role}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-300">Active</span>;
      case 'INACTIVE':
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-full border border-slate-300">Inactive</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-extrabold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Region & State-Wise Staff Report</h2>
          <p className="text-xs text-slate-500">Exclusively displays assigned Sales Heads and Sales Persons organized by Region and State territory.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-[#002C6C] hover:bg-[#0066B1] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-300" /> Export Staff CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium block">Total Regions / States</span>
          <span className="text-xl font-black text-[#002C6C]">{totalRegionsCount}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium block">Total Field Staff</span>
          <span className="text-xl font-black text-slate-900">{grandTotalStaff}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium block">Regional Sales Heads</span>
          <span className="text-xl font-black text-blue-700">{totalSalesHeads}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium block">Area Sales Persons</span>
          <span className="text-xl font-black text-emerald-700">{totalSalesPersons}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="no-print bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        
        {/* Search by Staff Name / Email / Phone */}
        <div className="relative">
          <label className="font-bold text-slate-600 block mb-1">Search Staff Member:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Staff Name, Email, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Staff Role Filter */}
        <div>
          <label className="font-bold text-slate-600 block mb-1">Staff Role Scope:</label>
          <select
            value={staffRoleFilter}
            onChange={(e) => setStaffRoleFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
          >
            <option value="STAFF_ONLY">Staff Only (Sales Heads & Sales Persons)</option>
            <option value="SALES_HEAD">Sales Heads Only</option>
            <option value="SALES_PERSON">Sales Persons Only</option>
            <option value="ALL">All Accounts (Include Dealers)</option>
          </select>
        </div>

        {/* Territory Type Filter */}
        <div>
          <label className="font-bold text-slate-600 block mb-1">Territory Level:</label>
          <select
            value={territoryTypeFilter}
            onChange={(e) => setTerritoryTypeFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
          >
            <option value="ALL">All Territory Levels</option>
            <option value="Region">Regions Only</option>
            <option value="State">States Only</option>
            <option value="Country">Country Level</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="font-bold text-slate-600 block mb-1">Sort Staff By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
          >
            <option value="name">Staff Member Name (A-Z)</option>
            <option value="role">Role Hierarchy (Sales Head → Person)</option>
          </select>
        </div>

      </div>

      {/* Region / State Wise Staff Data */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002C6C]" />
        </div>
      ) : processedAreaData.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold">No staff members found matching your search or territory filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {processedAreaData.map((area) => {
            const isExpanded = expandedAreas[area.areaId];
            
            return (
              <div key={area.areaId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                
                {/* Region / State Accordion Header */}
                <button
                  onClick={() => toggleArea(area.areaId)}
                  className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 hover:bg-slate-100 transition border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#002C6C]/10 text-[#002C6C] rounded-xl font-bold">
                      <MapPin className="w-5 h-5 text-[#002C6C]" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{area.areaName}</h3>
                        <span className="bg-blue-50 text-[#002C6C] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-blue-200">
                          {area.areaType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {area.salesHeadsCount} Sales Head • {area.salesPersonsCount} Sales Person ({area.staffMembers.length} Staff Displayed)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      {area.salesHeadsCount} Sales Heads
                    </span>
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {area.salesPersonsCount} Sales Persons
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Region / State Staff Table */}
                {isExpanded && area.staffMembers.length > 0 && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-y border-slate-200">
                          <tr>
                            <th className="p-3">Staff Profile</th>
                            <th className="p-3">Staff Name</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Region / State Territory</th>
                            <th className="p-3">Contact Email & Phone</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {area.staffMembers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                              <td className="p-3">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'; }}
                                />
                              </td>
                              <td className="p-3">
                                <div className="font-extrabold text-slate-900 text-sm">{user.name}</div>
                                <div className="text-[10px] font-mono text-slate-400">ID: {user.id}</div>
                              </td>
                              <td className="p-3">{getRoleBadge(user.role)}</td>
                              <td className="p-3">
                                <div className="font-bold text-[#002C6C]">{area.areaName}</div>
                                <div className="text-[10px] text-slate-400">{area.areaType}</div>
                              </td>
                              <td className="p-3">
                                <div className="space-y-0.5 text-xs text-slate-700">
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <span>{user.email}</span>
                                  </div>
                                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{user.phone}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">{getStatusBadge(user.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {isExpanded && area.staffMembers.length === 0 && (
                  <div className="p-6 text-center text-slate-500 text-xs italic">
                    No staff members assigned to {area.areaName} matching current filter options.
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}