// India Hyundai Power - Website Hero Component

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Award, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-[#001D4A] via-[#002C6C] to-[#00529B] text-white overflow-hidden py-16 lg:py-24">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Next-Gen 3D Tall Tubular & Calcium-Silver Technology</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-sans">
              Power That Keeps <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-200 to-emerald-400">
                India Moving
              </span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore reliable Hyundai Power battery solutions engineered for peak performance, extreme longevity, and unshakeable energy backup for homes, vehicles, and commercial applications.
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 text-xs sm:text-sm pt-2">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Up to 72 Months Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Zero Maintenance Sealed Grid</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>High Cold Cranking Amps (CCA)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Pan-India Service & Support</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-lg hover:shadow-cyan-500/20 transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                Shop Batteries Now <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/order-tracking"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full text-sm backdrop-blur-md border border-white/20 transition flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-cyan-400" /> Track Order Status
              </Link>
            </div>

          </div>

          {/* Right Product Graphic Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden group">
              
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                60M Warranty
              </div>

              <img
                src="https://images.unsplash.com/photo-1558441719-6745088737a0?auto=format&fit=crop&q=80&w=800"
                alt="Hyundai Solaria Inverter Battery"
                className="w-full h-64 object-cover rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-500"
              />

              <div className="mt-5 space-y-2">
                <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Featured Flagship Series</div>
                <h3 className="text-xl font-bold text-white">Hyundai Solaria 150Ah Tall Tubular</h3>
                <p className="text-xs text-slate-300">
                  Engineered with 3D tubular plates for uninterrupted 6+ hours backup during deep power cuts.
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <span className="text-xs text-slate-400 block">Offer Price</span>
                    <span className="text-2xl font-black text-white">₹15,490</span>
                    <span className="text-xs text-slate-400 line-through ml-2">₹19,500</span>
                  </div>
                  <Link
                    to="/shop"
                    className="bg-white text-[#002C6C] hover:bg-slate-100 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
