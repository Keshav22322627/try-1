import React, { useState } from 'react';
import { 
  Sparkles, 
  Car, 
  Sun, 
  Anchor, 
  Zap, 
  BatteryCharging, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

export function BatteryFinder({ onAddToCart, onQuickView, compareItems, onToggleCompare }) {
  const [step, setStep] = useState(1);
  const [application, setApplication] = useState('solar');
  const [voltageReq, setVoltageReq] = useState('48V');
  const [chemistryReq, setChemistryReq] = useState('LiFePO4');

  // Filter recommendations based on user selections
  const matches = PRODUCTS.map(product => {
    let score = 70;
    
    // Category match
    if (product.category === application) score += 20;
    
    // Voltage match
    if (product.voltage.toLowerCase().includes(voltageReq.toLowerCase())) score += 10;
    
    // Chemistry match
    if (product.chemistry.toLowerCase().includes(chemistryReq.toLowerCase())) score += 10;

    return { ...product, matchScore: Math.min(100, score) };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div id="battery-finder" className="py-12 px-4 sm:px-6 bg-slate-950/80 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Fitment Matchmaker</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
            Smart Battery Finder Wizard
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Answer 3 quick questions to discover the exact battery pack, voltage match, and chemistry for your vehicle, solar array, or marine setup.
          </p>
        </div>

        {/* Wizard Card Container */}
        <div className="glass-panel rounded-2xl border border-slate-700/80 p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
          
          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 mb-8 border-b border-slate-800 pb-6">
            <button 
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                step === 1 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${step === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</div>
              <div>
                <p className="text-xs font-bold font-outfit">Step 1</p>
                <p className="text-[11px] opacity-80">Application</p>
              </div>
            </button>

            <button 
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                step === 2 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${step === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</div>
              <div>
                <p className="text-xs font-bold font-outfit">Step 2</p>
                <p className="text-[11px] opacity-80">Voltage & Specs</p>
              </div>
            </button>

            <button 
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                step === 3 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${step === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</div>
              <div>
                <p className="text-xs font-bold font-outfit">Step 3</p>
                <p className="text-[11px] opacity-80">Matches</p>
              </div>
            </button>
          </div>

          {/* STEP 1: Application Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-outfit text-slate-100 flex items-center gap-2">
                What are you looking to power?
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { id: 'tubular', label: 'Inverter & Tall Tubular', icon: Zap, desc: '60M warranty tubular batteries' },
                  { id: 'inverter', label: 'Sine Wave Inverters', icon: Sliders, desc: '1100VA - 2500VA Inverters' },
                  { id: 'automotive', label: 'Car & SUV Batteries', icon: Car, desc: 'High CCA starter batteries' },
                  { id: 'solar', label: 'Solar & Lithium ESS', icon: Sun, desc: '48V/51.2V Inverter Storage' },
                  { id: 'twowheeler', label: 'Bike & Scooter VRLA', icon: RotateCcw, desc: 'Spill-proof motorcycle batteries' }
                ].map(item => {
                  const IconComponent = item.icon;
                  const isSelected = application === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setApplication(item.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <p className="text-sm font-bold font-outfit text-slate-100">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2"
                >
                  <span>Next: Select Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Voltage & Chemistry Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-outfit text-slate-100">
                Select System Voltage & Preferred Chemistry
              </h3>

              <div className="space-y-4">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Target Operating Voltage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['12V', '24V', '48V', '36V'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setVoltageReq(v)}
                      className={`p-3 rounded-xl border text-center font-bold font-mono text-sm transition-all ${
                        voltageReq === v 
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {v} System
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Battery Cell Chemistry Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'LiFePO4', label: 'LiFePO4 (Lithium Iron Phosphate)', desc: '10x lifespan, ultra-safe, lightweight' },
                    { id: 'AGM', label: 'Advanced AGM (Absorbent Glass Mat)', desc: 'High cranking amps for winter ignition' },
                    { id: 'NMC', label: 'NMC / Lithium Ion', desc: 'Maximum energy density per lb' }
                  ].map(c => (
                    <div 
                      key={c.id}
                      onClick={() => setChemistryReq(c.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        chemistryReq === c.id 
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-100">{c.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800"
                >
                  Back
                </button>

                <button 
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2"
                >
                  <span>See Top Compatible Matches</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Recommended Matches Grid */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-outfit text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Top Compatible Battery Matches</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Filter set to: <strong className="text-emerald-400">{application}</strong> • <strong className="text-cyan-400">{voltageReq}</strong> • <strong className="text-slate-200">{chemistryReq}</strong>
                  </p>
                </div>

                <button 
                  onClick={() => setStep(1)}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.slice(0, 3).map(product => (
                  <div key={product.id} className="relative">
                    <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg">
                      {product.matchScore}% Match
                    </div>
                    <ProductCard 
                      product={product}
                      onAddToCart={onAddToCart}
                      onQuickView={onQuickView}
                      isCompared={compareItems.some(i => i.id === product.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
