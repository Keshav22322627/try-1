// India Hyundai Power - Area & Territory Hierarchy Management Module

import React, { useState, useEffect, useMemo } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { MapPin, Plus, RefreshCw, CheckCircle2, Trash2, Search, Filter, Layers, Building } from 'lucide-react';

const INDIAN_STATES = [
  'Punjab',
  'Haryana',
  'Himachal Pradesh',
  'Delhi NCR',
  'Chandigarh (UT)',
  'Rajasthan',
  'Uttar Pradesh',
  'Jammu & Kashmir',
  'Uttarakhand',
  'Gujarat',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Bihar',
  'Madhya Pradesh'
];

export default function AreasManagement() {
  const { currentUser } = useAuth();
  const [areas, setAreas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  // New Area Modal Form State
  const [newArea, setNewArea] = useState({
    selectedState: 'Punjab',
    type: 'District', // 'State' | 'Region' | 'District' | 'City' | 'Area'
    subName: '',
    code: '',
    customStateName: ''
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    setAreas(dbStore.getAreas());
  }, []);

  const handleCreateArea = (e) => {
    e.preventDefault();

    const stateName = newArea.selectedState === 'OTHER' ? newArea.customStateName : newArea.selectedState;
    const finalName = newArea.type === 'State' 
      ? stateName 
      : `${newArea.subName.trim()} (${stateName})`;

    const created = {
      id: `area-${Date.now()}`,
      name: finalName,
      type: newArea.type,
      stateName: stateName,
      subName: newArea.subName.trim(),
      code: newArea.code || (newArea.subName || stateName).slice(0, 3).toUpperCase(),
      parentId: 'area-in'
    };

    const updated = [...areas, created];
    dbStore.saveAreas(updated);
    dbStore.logActivity('AREA_CREATED', `Created new territory ${created.name} (${created.type})`, currentUser);
    setAreas(updated);
    setShowAddModal(false);
    setNewArea({
      selectedState: 'Punjab',
      type: 'District',
      subName: '',
      code: '',
      customStateName: ''
    });
    setActionSuccess(`Added new territory "${created.name}"!`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleDeleteArea = (areaId, areaName) => {
    if (!isAdmin) {
      alert('Unauthorized: Deleting territories is restricted to Administrators.');
      return;
    }
    const updated = dbStore.deleteArea(areaId);
    setAreas(updated);
    setActionSuccess(`Removed territory "${areaName}".`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleCleanTerritories = () => {
    if (!isAdmin) {
      alert('Unauthorized: Cleaning territories is restricted to Administrators.');
      return;
    }
    if (!window.confirm('Clean and reset all territories to standard core Indian hierarchy defaults?')) return;

    const cleaned = dbStore.resetAreas();
    setAreas(cleaned);
    setActionSuccess('Cleaned all territories! Standard core Indian hierarchy restored.');
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // Filtered Territory List
  const filteredAreas = useMemo(() => {
    return areas.filter(a => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = a.name?.toLowerCase().includes(q);
        const matchesCode = a.code?.toLowerCase().includes(q);
        const matchesState = a.stateName?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesState) return false;
      }

      // State Filter
      if (selectedStateFilter !== 'ALL') {
        const isInState = a.name?.includes(selectedStateFilter) || a.stateName === selectedStateFilter;
        if (!isInState) return false;
      }

      // Type Filter
      if (selectedTypeFilter !== 'ALL') {
        if (a.type !== selectedTypeFilter) return false;
      }

      return true;
    });
  }, [areas, searchQuery, selectedStateFilter, selectedTypeFilter]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Territory & Area Hierarchy</h1>
          <p className="text-xs text-slate-500">Configure Indian States and child territories: State &rarr; Region &rarr; District &rarr; City &rarr; Area.</p>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={handleCleanTerritories}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
              title="Reset & Clean All Territories"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" /> Clean All
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#002C6C] hover:bg-[#0066B1] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Territory Level
            </button>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        {/* Search Bar */}
        <div className="relative">
          <label className="font-bold text-slate-600 block mb-1">Search Territory:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, state, short code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* State Filter Dropdown */}
        <div>
          <label className="font-bold text-slate-600 block mb-1">Filter by State:</label>
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
          >
            <option value="ALL">All States</option>
            {INDIAN_STATES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Hierarchy Type Filter */}
        <div>
          <label className="font-bold text-slate-600 block mb-1">Filter by Hierarchy Type:</label>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
          >
            <option value="ALL">All Hierarchy Levels</option>
            <option value="State">State</option>
            <option value="Region">Region</option>
            <option value="District">District</option>
            <option value="City">City</option>
            <option value="Area">Area</option>
          </select>
        </div>

      </div>

      {/* Territory Cards Grid */}
      {filteredAreas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold">No territories match your selected state or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredAreas.map(a => (
            <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative hover:border-[#0066B1] transition">
              
              {/* Type Badge & Code */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  a.type === 'State' ? 'bg-purple-100 text-purple-900 border-purple-200' :
                  a.type === 'Region' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                  a.type === 'District' ? 'bg-cyan-100 text-cyan-900 border-cyan-200' :
                  a.type === 'City' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
                  'bg-slate-100 text-slate-800 border-slate-200'
                }`}>
                  {a.type}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border">{a.code}</span>
                  {isAdmin && a.type !== 'Country' && (
                    <button
                      onClick={() => handleDeleteArea(a.id, a.name)}
                      className="text-rose-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                      title={`Delete ${a.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Territory Name & Details */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-600 flex-shrink-0" /> {a.name}
                </h3>
                {a.stateName && a.type !== 'State' && (
                  <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" /> State: <strong className="text-slate-800">{a.stateName}</strong>
                  </div>
                )}
                <div className="text-[10px] text-slate-400 font-mono pt-1">ID: {a.id}</div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Territory Level Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0066B1]" /> Add Territory Level
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateArea} className="space-y-3.5 text-xs">
              
              {/* Hierarchy Type Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hierarchy Level Type:</label>
                <select
                  value={newArea.type}
                  onChange={(e) => setNewArea({ ...newArea, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                >
                  <option value="State">State</option>
                  <option value="Region">Region</option>
                  <option value="District">District</option>
                  <option value="City">City</option>
                  <option value="Area">Area</option>
                </select>
              </div>

              {/* State Dropdown Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {newArea.type === 'State' ? 'Select State Name:' : 'Select Parent State:'}
                </label>
                <select
                  value={newArea.selectedState}
                  onChange={(e) => setNewArea({ ...newArea, selectedState: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
                >
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                  <option value="OTHER">-- Other / Custom State --</option>
                </select>
              </div>

              {/* Custom State Input if OTHER selected */}
              {newArea.selectedState === 'OTHER' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Enter State Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Telangana, Goa, Assam"
                    value={newArea.customStateName}
                    onChange={(e) => setNewArea({ ...newArea, customStateName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                  />
                </div>
              )}

              {/* Sub-Territory Name (For Region, District, City, Area) */}
              {newArea.type !== 'State' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {newArea.type} Name (under {newArea.selectedState === 'OTHER' ? newArea.customStateName || 'State' : newArea.selectedState}):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${newArea.type === 'Region' ? 'North Region' : newArea.type === 'District' ? 'Ludhiana District' : newArea.type === 'City' ? 'Jalandhar City' : 'Model Town'}`}
                    value={newArea.subName}
                    onChange={(e) => setNewArea({ ...newArea, subName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0066B1]"
                  />
                </div>
              )}

              {/* Short Code */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Code (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. PB, HR, JAL, LDH"
                  value={newArea.code}
                  onChange={(e) => setNewArea({ ...newArea, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono uppercase focus:ring-2 focus:ring-[#0066B1]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-xl text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#002C6C] text-white font-extrabold rounded-xl shadow hover:bg-[#0066B1] transition"
                >
                  Create Territory
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
