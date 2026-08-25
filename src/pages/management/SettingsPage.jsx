import React, { useState } from 'react';
import { dbStore } from '../../data/dbStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ChangePasswordModal from '../../components/ChangePasswordModal.jsx';
import { Settings, RefreshCw, ShieldAlert, Database, Key, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all records to default India Hyundai Power seed demo data?')) {
      dbStore.resetDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System & Database Settings</h1>
          <p className="text-xs text-slate-500">Configure global portal parameters, security policies, and personal account security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        
        {/* Account Security Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-[#0066B1]" /> Account Security
            </h3>
            <p className="text-xs text-slate-400">Manage credentials for <strong className="text-slate-700">{currentUser?.name}</strong> ({currentUser?.role})</p>
          </div>

          <div className="space-y-3 text-xs text-slate-600 font-medium">
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-2xl text-[11px] font-medium flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0066B1] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Self-Service Rule:</strong> Any logged-in user can change their own password. You cannot change passwords for other users.
              </span>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-[#002C6C] hover:bg-[#0066B1] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center justify-center gap-2 transition"
            >
              <Key className="w-4 h-4" /> Change My Password
            </button>
          </div>
        </div>

        {/* Database Maintenance Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0066B1]" /> System Maintenance
            </h3>
            <p className="text-xs text-slate-400">Re-initialize database with clean catalog and seed roles.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-3 text-xs text-amber-900 font-medium">
            <div className="font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Reset Seed Data
            </div>
            <p className="text-[11px]">
              Restores clean catalog products, territory hierarchy, and default role profiles.
            </p>
            <button
              onClick={handleResetData}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" /> Reset Database
            </button>
          </div>
        </div>

      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

