// India Hyundai Power - Website Header Component

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingBag, Search, Menu, X, Shield, ChevronDown, MapPin, Truck, Phone, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm font-sans">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 text-slate-300 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" /> Authorized India Hyundai Power Distributor
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Pan-India Dealer Network (1,200+ Outlets)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+911800123456" className="flex items-center gap-1 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-blue-400" /> Toll-Free: 1800-HYUNDAI
            </a>
            <Link to="/order-tracking" className="hidden sm:flex items-center gap-1 text-blue-400 hover:underline">
              <Truck className="w-3.5 h-3.5" /> Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-[#002C6C] to-[#0066B1] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="font-black text-xl tracking-tighter">H</span>
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-[#002C6C] flex items-center gap-1.5 leading-none">
                INDIA HYUNDAI POWER
              </div>
              <div className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase mt-0.5">
                Tubular & Automotive Battery Solutions
              </div>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search car, inverter, motorcycle batteries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0066B1] focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button type="submit" className="hidden"></button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-700">
            <Link to="/" className="hover:text-[#0066B1] transition">Home</Link>
            <Link to="/shop" className="hover:text-[#0066B1] transition">Shop</Link>
            <Link to="/shop?category=inverter-solar-batteries" className="hover:text-[#0066B1] transition">Inverter</Link>
            <Link to="/about" className="hover:text-[#0066B1] transition">About Us</Link>
            <Link to="/contact" className="hover:text-[#0066B1] transition">Contact</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-[#0066B1] hover:bg-slate-100 rounded-full transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#0066B1] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Account / Dashboard Button */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full text-xs font-semibold text-slate-800 transition"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-white"
                    />
                    <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-semibold text-slate-900 text-sm">{currentUser.name}</div>
                        <div className="text-xs text-blue-600 font-mono font-medium">{currentUser.role}</div>
                        <div className="text-[11px] text-slate-400 truncate">{currentUser.areaName}</div>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#0066B1]"
                      >
                        <Truck className="w-4 h-4 text-cyan-600" /> {currentUser.role === 'CLIENT' ? 'Track My Orders' : 'Go to Dashboard'}
                      </Link>

                      <div className="border-t border-slate-100 mt-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-[#002C6C] hover:bg-[#0066B1] text-white px-4 py-2 rounded-full text-xs font-semibold transition shadow-sm"
                >
                  Log In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search batteries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>
          <div className="flex flex-col gap-2 font-medium text-slate-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Shop All Batteries</Link>
            <Link to="/order-tracking" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Track Order</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Contact</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#0066B1] font-bold">Management Dashboard</Link>
          </div>
        </div>
      )}
    </header>
  );
}
