import React, { useState } from 'react';
import { RotateCcw, Check, Sparkles, Recycle, ArrowRight, ShieldCheck } from 'lucide-react';

export function CoreTradeIn({ onApplyTradeInCredit }) {
  const [selectedBatteryType, setSelectedBatteryType] = useState('agm');
  const [copiedCode, setCopiedCode] = useState(false);

  const batteryOptions = [
    { id: 'lead_auto', label: 'Standard Automotive Lead-Acid (Group 24/35/48)', rebate: 25 },
    { id: 'agm', label: 'Heavy Duty AGM Battery (Group 49 / H8 / 31)', rebate: 35 },
    { id: 'marine', label: '12V 100Ah - 200Ah Deep Cycle Marine Battery', rebate: 45 },
    { id: 'solar', label: '48V Solar Wall or Server Rack Battery Module', rebate: 80 }
  ];

  const currentSelection = batteryOptions.find(b => b.id === selectedBatteryType) || batteryOptions[0];

  const handleApplyCredit = () => {
    onApplyTradeInCredit(currentSelection.rebate);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <section id="tradein-estimator" className="py-12 px-4 sm:px-6 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl border border-emerald-500/30 p-6 sm:p-10 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 shadow-2xl relative overflow-hidden">
          
          {/* Background Glow Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Info Column (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Recycle className="w-3.5 h-3.5" />
                <span>Eco-Recycle Core Exchange Program</span>
              </div>

              <h2 className="text-3xl font-extrabold font-outfit text-white">
                Turn Your Old Battery into <br />
                <span className="text-emerald-400">Up to $80 Instant Rebate</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Send us your old spent lead-acid, AGM, or lithium battery. We provide a prepaid shipping box & return label. We safely recycle 99% of raw materials and credit your card immediately!
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-400 font-mono">1. Select Battery</span>
                  <span className="text-xs font-bold text-slate-200">Choose Type</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-400 font-mono">2. Get Label</span>
                  <span className="text-xs font-bold text-slate-200">Free Prepaid Box</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-400 font-mono">3. Get Credit</span>
                  <span className="text-xs font-bold text-emerald-400">Instant Refund</span>
                </div>
              </div>
            </div>

            {/* Right Estimator Card (6 cols) */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 space-y-5">
                <h3 className="text-base font-bold font-outfit text-slate-100 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  <span>Estimate Old Battery Return Value</span>
                </h3>

                <div className="space-y-2">
                  {batteryOptions.map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => setSelectedBatteryType(opt.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedBatteryType === opt.id 
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-medium">{opt.label}</span>
                      <span className="text-xs font-extrabold font-mono text-emerald-400">-${opt.rebate} Credit</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Trade-In Credit</span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">-${currentSelection.rebate}.00</span>
                  </div>

                  <button 
                    onClick={handleApplyCredit}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-slate-950" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
                    <span>{copiedCode ? 'Rebate Applied to Cart!' : 'Apply Credit to Order'}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
