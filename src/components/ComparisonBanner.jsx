import React from 'react';
import { CheckCircle2, XCircle, Zap, ShieldCheck, Clock, Award } from 'lucide-react';

export function ComparisonBanner() {
  return (
    <section className="py-12 px-4 sm:px-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Technology Comparison
          </span>
          <h2 className="text-3xl font-black font-outfit text-slate-900">
            Standard Local Batteries vs India Hyundai Power Extreme Tubular & Lithium ESS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Why dealers and customers across North India choose Shivam Industries (Jind) manufactured inverter batteries.
          </p>
        </div>

        {/* Side-by-Side Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Old Standard Local Battery Card */}
          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold font-outfit text-lg text-slate-800">Standard Unorganized Battery</span>
              <span className="bg-red-100 text-red-700 font-bold text-xs px-2.5 py-1 rounded-full font-mono">
                No Factory Backing
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span><strong>Short Warranty:</strong> 12 to 24 months with difficult warranty replacement claim process</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span><strong>Re-cycled Scrap Lead:</strong> High grid corrosion and frequent acid water topping</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span><strong>Middleman Cuts:</strong> High local agent margins with zero factory direct pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span><strong>Premature Failure:</strong> Low back-up duration during peak Indian summer outages</span>
              </li>
            </ul>
          </div>

          {/* India Hyundai Power Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-emerald-500 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-extrabold font-outfit text-lg text-white">India Hyundai Power</span>
              <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full font-mono uppercase">
                ★ 60 Month Warranty
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>60 Month Factory Guarantee:</strong> Backed directly by Shivam Industries, Jind manufacturing plant</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>99.99% Pure Lead Grid:</strong> High acid volume design with minimal water topping requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Factory Direct Price:</strong> Direct supply from factory with zero distributor markup</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>ISO 9001:2015 Quality:</strong> Die-cast hybrid tubular plates for maximum backup hours</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
