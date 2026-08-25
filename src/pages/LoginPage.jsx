// India Hyundai Power - Portal Login & Specific Authentication

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, UserCheck, Briefcase, Store, User, ArrowRight, Info, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Branding Side */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#001D4A] via-[#002C6C] to-[#0066B1] p-8 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-cyan-400 text-slate-950 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg">
              H
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">INDIA HYUNDAI POWER</h2>
              <p className="text-xs text-blue-200 mt-1">Authorized Portal Authentication</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-blue-100 py-6 border-y border-white/10">
            <p className="font-semibold text-white">Management Access Policy:</p>
            <p className="leading-relaxed">
              The India Hyundai Power management console is strictly restricted to authorized Dealers, Sales Staff, and Administrators.
            </p>
          </div>

          <div className="text-[11px] text-slate-300">
            © India Hyundai Power Portal Security Engine
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
          
          <div>
            <h3 className="text-xl font-bold text-slate-900">Sign In to Account</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your registered email address below.</p>
          </div>

          {redirectMessage && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. yourname@example.com or admin@hyundaipower.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0066B1] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0066B1] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#002C6C] hover:bg-[#0066B1] text-white font-bold py-3 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              Sign In to Portal <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
