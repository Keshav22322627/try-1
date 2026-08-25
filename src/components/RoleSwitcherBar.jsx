// India Hyundai Power - Demo Quick Role Switcher Bar

import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldCheck, UserCheck, Briefcase, Store, User, Layers } from 'lucide-react';

export default function RoleSwitcherBar() {
  const { currentUser, users, switchUser } = useAuth();

  const roleConfigs = [
    { role: 'ADMIN', label: 'Admin', icon: ShieldCheck, userId: 'usr-admin', color: 'bg-purple-600' },
    { role: 'SALES_HEAD', label: 'Sales Head', icon: Briefcase, userId: 'usr-sh-pb', color: 'bg-blue-600' },
    { role: 'SALES_PERSON', label: 'Sales Person', icon: UserCheck, userId: 'usr-sp-ldh', color: 'bg-cyan-600' },
    { role: 'DEALER', label: 'Dealer', icon: Store, userId: 'usr-dealer-ldh', color: 'bg-emerald-600' }
  ];

  return (
    <div className="no-print bg-slate-900 text-white py-2 px-3 sm:px-6 text-xs border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono text-[11px] font-bold border border-blue-500/30">
            <Layers className="w-3.5 h-3.5" /> LIVE DEMO ROLE SWITCHER
          </span>
          <span className="hidden sm:inline text-slate-400">| Active User:</span>
          <span className="font-semibold text-white flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {currentUser?.name} ({currentUser?.role})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full">
          <span className="text-slate-400 hidden xl:inline text-[11px]">Switch Role:</span>
          {roleConfigs.map(item => {
            const Icon = item.icon;
            const isActive = currentUser?.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => switchUser(item.userId)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  isActive
                    ? `${item.color} text-white shadow-sm ring-2 ring-white/20 font-bold scale-105`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title={`Switch active perspective to ${item.label}`}
              >
                <Icon className="w-3 h-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
