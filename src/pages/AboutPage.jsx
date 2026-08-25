// India Hyundai Power - About Us Page

import React from 'react';
import Footer from '../components/Footer.jsx';
import { ShieldCheck, Award, Users, Zap, CheckCircle2, Factory } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        {/* Banner */}
        <div className="bg-[#002C6C] text-white py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-4xl font-black">About India Hyundai Power</h1>
            <p className="text-sm text-blue-200">
              Pioneering long-life tall tubular inverter batteries, automotive silver grid power, and heavy-duty industrial solutions across India.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#0066B1] uppercase tracking-widest">Engineering Trust</span>
              <h2 className="text-3xl font-black text-[#002C6C]">Advanced Energy Storage Technology</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                India Hyundai Power products are engineered using state-of-the-art 3D tubular plate geometry, silver-calcium alloy grid matrices, and ceramic water level indicators designed to minimize maintenance and withstand extreme ambient Indian temperatures.
              </p>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ISO 9001:2015 Quality Manufacturing Assurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Electrolyte Sealed Leak Proof Casing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pan-India Sales Head & Dealer Network</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                alt="Battery Production Factory"
                className="rounded-2xl w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="text-3xl font-black text-[#002C6C]">1,200+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Authorized Dealers</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="text-3xl font-black text-[#002C6C]">250+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Product Models</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="text-3xl font-black text-[#002C6C]">50,000+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Satisfied Clients</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="text-3xl font-black text-[#002C6C]">60M</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Warranty Period</div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
