// India Hyundai Power - Dashboard Layout Component

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { dbStore } from '../data/dbStore.js';
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';
import {
  LayoutDashboard, ShoppingBag, DollarSign, Users, MapPin, Package, Truck, FileText, Bell,
  Settings, LogOut, Menu, X, Shield, ChevronRight, Store, AlertCircle, Clock, Key, AlertTriangle
} from 'lucide-react';

export default function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const notifs = dbStore.getNotifications();
  const unreadCount = notifs.filter(n => !n.read).length;

  if (!currentUser || currentUser.role === 'CLIENT') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Authorized Access Required</h2>
          <p className="text-xs text-slate-500">The management dashboard is strictly restricted to authorized Dealers, Sales Staff, and Administrators.</p>
          <Link to="/login" className="inline-block bg-[#002C6C] text-white px-6 py-2.5 rounded-xl font-bold text-xs">
            Go to Portal Login
          </Link>
        </div>
      </div>
    );
  }

  // Navigation Links Visibility Matrix per Role
  const navItems = [
    { label: 'My Orders & Tracking', path: '/dashboard', icon: Truck, roles: ['DEALER'] },
    { label: 'My Complaints & Claims', path: '/dashboard/complaints', icon: AlertTriangle, roles: ['DEALER'] },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'Dealer Complaints & Service', path: '/dashboard/complaints', icon: AlertTriangle, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'Orders & Sales', path: '/dashboard/orders', icon: ShoppingBag, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'Payments & Ledger', path: '/dashboard/payments', icon: DollarSign, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'Deliveries & Logistics', path: '/dashboard/deliveries', icon: Truck, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'User Directory', path: '/dashboard/users', icon: Users, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'Products Inventory', path: '/dashboard/products', icon: Package, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'Territories & Areas', path: '/dashboard/areas', icon: MapPin, roles: ['ADMIN', 'SALES_HEAD'] },
    { label: 'Reports & Analytics', path: '/dashboard/reports', icon: FileText, roles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON'] },
    { label: 'System Settings', path: '/dashboard/settings', icon: Settings, roles: ['ADMIN'] }
  ];

  const allowedNav = navItems.filter(item => item.roles.includes(currentUser.role));

  const roleColors = {
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
    SALES_HEAD: 'bg-blue-100 text-blue-800 border-blue-300',
    SALES_PERSON: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    DEALER: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 font-black flex items-center justify-center text-base">
                H
              </div>
              <div className="hidden sm:block">
                <div className="font-extrabold text-sm tracking-tight text-white leading-none">INDIA HYUNDAI POWER</div>
                <div className="text-[10px] text-blue-300 font-mono">Management Console</div>
              </div>
            </Link>
          </div>

          {/* Area & Role Indicators */}
          <div className="flex items-center gap-3">
            
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Area: <strong className="text-white">{currentUser.areaName}</strong></span>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${roleColors[currentUser.role]}`}>
              {currentUser.role}
            </span>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 rounded-full text-xs font-semibold transition"
              title="Log Out of Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full relative transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-slate-900 animate-ping"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{notifs.length} System Alerts</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifs.map(n => (
                      <div key={n.id} className="pt-2 first:pt-0 space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar, Change Password & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-slate-400 hover:text-cyan-400 p-1 flex items-center gap-1 transition"
                title="Change My Password"
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-slate-400 hover:text-rose-400 p-1"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-200 flex flex-col justify-between`}>
          
          <div className="p-4 space-y-6">
            
            {/* User Profile Mini Summary */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 flex items-center gap-3">
              <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-600" />
              <div className="min-w-0">
                <div className="font-bold text-white text-xs truncate">{currentUser.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono font-semibold">{currentUser.role}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.areaName}</div>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1">
              {allowedNav.map(item => {
                const IconComp = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#0066B1] text-white shadow-md'
                        : 'hover:bg-slate-800 hover:text-white text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </Link>
                );
              })}
            </nav>

          </div>

          {/* Sidebar Footer Link */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <Link
              to="/shop"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition border border-slate-700"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Public E-Store
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition border border-rose-900/50"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" /> Log Out
            </button>
          </div>

        </aside>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
