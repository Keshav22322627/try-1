// India Hyundai Power - User & Role Management Module

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService } from '../../services/dbService.js';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Search, Plus, MapPin, X, Shield, Trash2, CheckCircle2, UserCheck, Key, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';

export default function UsersManagement() {
  const { currentUser, refreshUsers, updatePassword } = useAuth();
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');

  // Sorting
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'role' | 'area' | 'id'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [customPassword, setCustomPassword] = useState('');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'SALES_HEAD',
    areaId: 'area-pb-reg',
    businessName: '',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  });

  const getAllowedRolesToCreate = useCallback(() => {
    switch (currentUser?.role) {
      case 'ADMIN':
        return [
          { value: 'SALES_HEAD', label: 'Sales Head' },
          { value: 'SALES_PERSON', label: 'Sales Person' },
          { value: 'DEALER', label: 'Authorized Dealer' }
        ];
      case 'SALES_HEAD':
        return [
          { value: 'SALES_PERSON', label: 'Sales Person' },
          { value: 'DEALER', label: 'Authorized Dealer' }
        ];
      case 'SALES_PERSON':
        return [
          { value: 'DEALER', label: 'Authorized Dealer' }
        ];
      default:
        return [];
    }
  }, [currentUser]);

  const allowedRoles = getAllowedRolesToCreate();

  const loadData = useCallback(async () => {
    setLoading(true);
    const loadedUsers = await dbService.getUsers(currentUser);
    setUsers(loadedUsers || []);
    setAreas(dbStore.getAreas() || []);
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAddModal = () => {
    if (allowedRoles.length === 0) {
      alert('Your user role is restricted from creating new users.');
      return;
    }
    setNewUser({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: allowedRoles[0].value,
      areaId: currentUser?.areaId || 'area-pb-reg',
      businessName: '',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
    });
    setShowAddModal(true);
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
      await dbService.createUser({
        ...newUser,
        createdById: currentUser?.id,
        createdByName: currentUser?.name
      }, currentUser);

      setActionSuccess(`Successfully created user "${newUser.name}"!`);
      setShowAddModal(false);
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
      if (refreshUsers) refreshUsers();
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  const handleDeleteUserClick = (userObj) => {
    setDeleteConfirmUser(userObj);
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteConfirmUser) return;

    try {
      await dbService.deleteUser(deleteConfirmUser.id, currentUser);
      setActionSuccess(`Removed user "${deleteConfirmUser.name}".`);
      setDeleteConfirmUser(null);
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
      if (refreshUsers) refreshUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleOpenResetPassword = (userObj) => {
    setResetPasswordUser(userObj);
    setCustomPassword('');
  };

  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPasswordUser || !customPassword.trim()) return;

    try {
      await updatePassword(resetPasswordUser.id, customPassword.trim());
      setActionSuccess(`Updated password for ${resetPasswordUser.name} to "${customPassword.trim()}"!`);
      setResetPasswordUser(null);
      setCustomPassword('');
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update password');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('ALL');
    setAreaFilter('ALL');
    setSortBy('name');
    setSortOrder('asc');
  };

  const getAddButtonText = () => {
    switch (currentUser?.role) {
      case 'ADMIN': return 'Add Sales Head / Staff / User';
      case 'SALES_HEAD': return 'Add Sales Person / Dealer';
      case 'SALES_PERSON': return 'Add New Dealer';
      default: return 'Add User';
    }
  };

  const getAreaName = (areaId) => {
    const found = areas.find(a => a.id === areaId);
    return found ? found.name : areaId || 'India';
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.businessName?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== 'ALL') {
      result = result.filter(u => u.role === roleFilter);
    }

    // Area filter
    if (areaFilter !== 'ALL') {
      result = result.filter(u => u.areaId === areaFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'role':
          valA = (a.role || '').toLowerCase();
          valB = (b.role || '').toLowerCase();
          break;
        case 'area':
          valA = getAreaName(a.areaId).toLowerCase();
          valB = getAreaName(b.areaId).toLowerCase();
          break;
        case 'id':
          valA = (a.id || '').toLowerCase();
          valB = (b.id || '').toLowerCase();
          break;
        case 'name':
        default:
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchQuery, roleFilter, areaFilter, sortBy, sortOrder, areas]);

  const hasActiveFilters = searchQuery !== '' || roleFilter !== 'ALL' || areaFilter !== 'ALL' || sortBy !== 'name' || sortOrder !== 'asc';

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
          <h1 className="text-2xl font-black text-slate-900">User & Staff Management</h1>
          <p className="text-xs text-slate-500">Manage Sales Heads, Sales Persons, and Authorized Dealers across India.</p>
        </div>

        {allowedRoles.length > 0 && (
          <button
            onClick={handleOpenAddModal}
            className="bg-[#002C6C] hover:bg-[#001D4A] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> {getAddButtonText()}
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* FILTER & SORTING BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <label className="font-bold text-slate-600 block mb-1">Search User Directory:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, phone, business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Filter by User Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN (System Administrator)</option>
              <option value="SALES_HEAD">SALES_HEAD (Regional Manager)</option>
              <option value="SALES_PERSON">SALES_PERSON (Field Executive)</option>
              <option value="DEALER">DEALER (Authorized Dealer)</option>
              <option value="CLIENT">CLIENT (End Buyer)</option>
            </select>
          </div>

          {/* Territory Area Filter */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Filter by Assigned Territory:</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-[#0066B1]"
            >
              <option value="ALL">All Territories</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-medium border-t border-slate-100 text-slate-500">
          <div>
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> registered accounts
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

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-xs font-bold text-slate-400 animate-pulse">Loading system users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">No Users Found</div>
            <p className="text-xs text-slate-400">No users match your filter settings. Click "Reset All Filters" above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">{renderSortHeader('User Profile', 'name')}</th>
                  <th className="p-3">{renderSortHeader('Role', 'role')}</th>
                  <th className="p-3">{renderSortHeader('Assigned Area', 'area')}</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Business / GSTIN</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                        u.role === 'SALES_HEAD' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        u.role === 'SALES_PERSON' ? 'bg-cyan-100 text-cyan-800 border-cyan-300' :
                        u.role === 'DEALER' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                        <span>{getAreaName(u.areaId)}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 font-mono">{u.phone || 'N/A'}</td>
                    <td className="p-3">
                      {u.businessName ? (
                        <div>
                          <div className="font-bold text-slate-800">{u.businessName}</div>
                          {u.gstin && <div className="text-[10px] text-slate-400 font-mono">GST: {u.gstin}</div>}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenResetPassword(u)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded text-[11px] border border-amber-200 transition flex items-center gap-1"
                          title="Set New Password for User"
                        >
                          <Key className="w-3 h-3 text-amber-600" /> Password
                        </button>
                        {currentUser?.role === 'ADMIN' && u.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUserClick(u)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold p-1 rounded text-[11px] border border-rose-200 transition"
                            title={`Delete ${u.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900">{getAddButtonText()}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address (Login)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh@hyundaipower.in"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-800"
                  >
                    {allowedRoles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Territory</label>
                <select
                  value={newUser.areaId}
                  onChange={(e) => setNewUser({ ...newUser, areaId: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold text-slate-800"
                >
                  {areas.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                  ))}
                </select>
              </div>

              {newUser.role === 'DEALER' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dealer Business / Enterprise Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Battery House & Inverters"
                    value={newUser.businessName}
                    onChange={(e) => setNewUser({ ...newUser, businessName: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono text-emerald-700 font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/2 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-[#002C6C] text-white font-extrabold rounded-xl shadow">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" /> Set Password for {resetPasswordUser.name}
              </h3>
              <button onClick={() => setResetPasswordUser(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">User Account:</label>
                <div className="p-2.5 bg-slate-50 border rounded-xl font-mono text-slate-800">
                  {resetPasswordUser.email} ({resetPasswordUser.role})
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Password:</label>
                <input
                  type="text"
                  required
                  placeholder="Enter new account password..."
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono text-emerald-700 font-bold focus:ring-2 focus:ring-[#0066B1]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-xl text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow transition"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200 animate-in zoom-in-95 font-sans">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-lg text-slate-900">Delete User Account?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete user <strong className="text-slate-900">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
