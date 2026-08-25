import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Star, 
  ShoppingBag, 
  Check, 
  Clock, 
  Sliders, 
  Layers, 
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { BatteryGraphic } from '../utils/batteryGraphic';
import { formatPrice } from '../utils/formatters';

export function ProductDetailModal({ product, onClose, onAddToCart, currency = 'USD' }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'specs', 'runtime', 'reviews'
  const [simulatedWattLoad, setSimulatedWattLoad] = useState(500); // 500W test load
  const [includeCoreTradeIn, setIncludeCoreTradeIn] = useState(false);

  if (!product) return null;

  // Calculate estimated runtime hours for simulated load:
  // Wh = Voltage * Ah. Runtime (hrs) = Wh / Simulated Watts * 0.90 efficiency
  const voltageNum = parseFloat(product.voltage) || 12.8;
  const ahNum = parseFloat(product.capacity) || 100;
  const totalWh = Math.round(voltageNum * ahNum);
  const estimatedRuntimeHours = ((totalWh * 0.9) / (simulatedWattLoad || 1)).toFixed(1);

  const finalPrice = includeCoreTradeIn ? Math.max(0, product.price - product.coreRebate) : product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
              {product.voltage} • {product.capacity.split(' ')[0]}
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.id.toUpperCase()}</span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Modal Grid Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Graphic & Core Trade-In Option (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BatteryGraphic 
              category={product.category}
              chemistry={product.chemistry}
              voltage={product.voltage}
              capacity={product.capacity}
              isTopPick={product.isTopPick}
              className="w-full h-56"
            />

            {/* Core Trade-In Toggle Box */}
            {product.coreRebate > 0 && (
              <div 
                onClick={() => setIncludeCoreTradeIn(!includeCoreTradeIn)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  includeCoreTradeIn 
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${includeCoreTradeIn ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-950'}`}>
                      {includeCoreTradeIn && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold font-outfit text-slate-100">Trade-In Old Battery</span>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-emerald-400">Save -${product.coreRebate}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 pl-7">
                  Include prepaid return shipping label to mail back your old battery for instant credit refund.
                </p>
              </div>
            )}

            {/* Price & Purchase Action */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold font-outfit text-white">
                    {formatPrice(finalPrice, currency)}
                  </span>
                  {includeCoreTradeIn && (
                    <span className="text-xs text-emerald-400 font-mono block">Includes ${product.coreRebate} Core Credit</span>
                  )}
                </div>
                <span className="text-xs font-mono text-emerald-400">In Stock • Ships Free</span>
              </div>

              <button 
                onClick={() => {
                  onAddToCart({ ...product, price: finalPrice });
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>Add Battery to Cart</span>
              </button>
            </div>
          </div>

          {/* Right Column: Multi-Tab Info Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold font-outfit text-white">{product.name}</h2>
              <p className="text-xs text-slate-400">{product.subtitle}</p>
            </div>

            {/* Tab Navigation Buttons */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'specs', label: 'Tech Specs' },
                { id: 'runtime', label: 'Runtime Calculator' },
                { id: 'reviews', label: `Reviews (${product.reviewsCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-outfit transition-all ${
                    activeTab === tab.id 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs text-slate-300">
                <p className="leading-relaxed text-slate-300">{product.description}</p>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-100 uppercase font-mono tracking-wider">Key Highlights</h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: TECH SPECS TABLE */}
            {activeTab === 'specs' && (
              <div className="space-y-3 text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Nominal Voltage</td>
                      <td className="py-2 font-semibold text-slate-100 font-mono">{product.voltage}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Rated Capacity</td>
                      <td className="py-2 font-semibold text-slate-100 font-mono">{product.capacity}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Stored Energy (Wh)</td>
                      <td className="py-2 font-semibold text-emerald-400 font-mono">{totalWh} Wh</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Cell Chemistry</td>
                      <td className="py-2 font-semibold text-slate-100">{product.chemistry}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Expected Cycle Life</td>
                      <td className="py-2 font-semibold text-cyan-400 font-mono">{product.cycleLife}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Weight & Size</td>
                      <td className="py-2 text-slate-200">{product.weight} • {product.dimensions}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Max Continuous Current</td>
                      <td className="py-2 text-amber-400 font-mono">{product.maxDischarge}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400 font-mono">Smart BMS Protections</td>
                      <td className="py-2 text-slate-300">{product.bmsFeatures}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: REAL-TIME RUNTIME CALCULATOR */}
            {activeTab === 'runtime' && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <label className="block text-slate-400 font-mono uppercase">
                    Test Electrical Appliance Load (Watts)
                  </label>

                  <div className="flex items-center gap-3">
                    <input 
                      type="range"
                      min="50"
                      max="3000"
                      step="50"
                      value={simulatedWattLoad}
                      onChange={e => setSimulatedWattLoad(Number(e.target.value))}
                      className="flex-1 accent-emerald-400 bg-slate-800"
                    />
                    <span className="font-mono font-bold text-sm text-emerald-400 w-16 text-right">
                      {simulatedWattLoad}W
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-center space-y-2">
                  <p className="text-slate-400 font-mono uppercase">Estimated Continuous Operation Time</p>
                  <p className="text-3xl font-extrabold text-emerald-400 font-mono">
                    {estimatedRuntimeHours} <span className="text-base text-slate-300 font-sans">Hours</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Calculated assuming 90% inverter efficiency on total {totalWh} Wh capacity.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 pb-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-sm text-slate-100 ml-1">{product.rating} / 5.0</span>
                  </div>
                  <span className="text-slate-400">({product.reviewsCount} Verified Customer Reviews)</span>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Marcus T. (Verified Buyer)</span>
                      <span className="text-[10px] text-slate-500">2 days ago</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      "Replaced my 4 heavy lead-acid batteries with this unit on my Victron inverter. Voltage holds steady at 51.2V all day long!"
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Dave K. (RV Off-Grid)</span>
                      <span className="text-[10px] text-slate-500">1 week ago</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      "Bluetooth app connection works great from inside my camper van. Core return credit process was effortless."
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
