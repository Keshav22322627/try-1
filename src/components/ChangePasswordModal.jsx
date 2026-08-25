// India Hyundai Power - Change Own Password Modal

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { X, Lock, Key, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ChangePasswordModal({ onClose }) {
  const { currentUser, updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!newPassword || newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Password must be at least 4 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation password do not match.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePassword(newPassword);
      setMessage({ type: 'success', text: `Success! Password updated for ${currentUser?.name}.` });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        if (onClose) onClose();
      }, 1800);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-100 font-sans animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#0066B1]" /> Change My Password
            </h3>
            <p className="text-xs text-slate-400">
              Account: <strong className="text-slate-700">{currentUser?.name}</strong> ({currentUser?.role})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Rule Infobox */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-2xl text-[11px] font-medium flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0066B1] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Self-Service Password Policy:</strong> You are authorized to change <u>only your own password</u> ({currentUser?.email}). You cannot modify passwords for other system users.
          </span>
        </div>

        {/* Alert Feedback */}
        {message.text && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-medium">
          
          <div>
            <label className="font-bold text-slate-700 block mb-1">Registered Email</label>
            <input
              type="text"
              disabled
              value={currentUser?.email || ''}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">New Password *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-10 py-2 focus:ring-2 focus:ring-[#0066B1] font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Confirm New Password *</label>
            <div className="relative">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-10 py-2 focus:ring-2 focus:ring-[#0066B1] font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-2.5 bg-[#002C6C] hover:bg-[#0066B1] text-white font-bold rounded-xl text-xs shadow transition flex items-center justify-center gap-1"
            >
              <Key className="w-3.5 h-3.5" /> Update My Password
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
