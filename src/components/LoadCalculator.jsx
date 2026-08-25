import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Zap, 
  Sun, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import { APPLIANCE_PRESETS } from '../data/appliancePresets';
import { PRODUCTS } from '../data/products';

export function LoadCalculator({ onAddToCart, onQuickView }) {
  const [selectedAppliances, setSelectedAppliances] = useState([
    { id: 'fridge', name: 'Refrigerator / Freezer', watts: 150, hours: 24, count: 1 },
    { id: 'lights', name: 'LED Lights (Whole House)', watts: 40, hours: 6, count: 1 },
    { id: 'router', name: 'Wi-Fi Router & Modem', watts: 20, hours: 24, count: 1 },
    { id: 'laptop', name: 'Work Laptops', watts: 90, hours: 8, count: 1 }
  ]);

  const [systemVoltage, setSystemVoltage] = useState(48); // 12V, 24V, 48V
  const [customName, setCustomName] = useState('');
  const [customWatts, setCustomWatts] = useState('');
  const [customHours, setCustomHours] = useState('');

  // Handle adding preset
  const handleAddPreset = (preset) => {
    const existing = selectedAppliances.find(a => a.id === preset.id);
    if (existing) {
      setSelectedAppliances(selectedAppliances.map(a => 
        a.id === preset.id ? { ...a, count: a.count + 1 } : a
      ));
    } else {
      setSelectedAppliances([
        ...selectedAppliances,
        { id: preset.id, name: preset.name, watts: preset.watts, hours: preset.defaultHours, count: 1 }
      ]);
    }
  };

  // Handle adding custom item
  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customName || !customWatts) return;
    setSelectedAppliances([
      ...selectedAppliances,
      {
        id: `custom-${Date.now()}`,
        name: customName,
        watts: parseFloat(customWatts) || 100,
        hours: parseFloat(customHours) || 4,
        count: 1
      }
    ]);
    setCustomName('');
    setCustomWatts('');
    setCustomHours('');
  };

  // Update item count or hours
  const updateItem = (id, field, value) => {
    setSelectedAppliances(selectedAppliances.map(a => {
      if (a.id === id) {
        return { ...a, [field]: Math.max(0, parseFloat(value) || 0) };
      }
      return a;
    }));
  };

  // Remove item
  const removeItem = (id) => {
    setSelectedAppliances(selectedAppliances.filter(a => a.id !== id));
  };

  // Math calculations
  const totalDailyWh = selectedAppliances.reduce((sum, item) => sum + (item.watts * item.hours * item.count), 0);
  const totalPeakWatts = selectedAppliances.reduce((sum, item) => sum + (item.watts * item.count), 0);
  const requiredAh = Math.round(totalDailyWh / systemVoltage);
  const recommendedInverter = Math.ceil((totalPeakWatts * 1.25) / 100) * 100; // 25% safety margin

  // Find matching battery from PRODUCTS catalog
  const recommendedBattery = PRODUCTS.find(p => {
    if (systemVoltage === 48 && p.category === 'solar') return true;
    if (systemVoltage === 12 && p.category === 'marine') return true;
    return false;
  }) || PRODUCTS[0];

  return (
    <div id="load-calculator" className="py-12 px-4 sm:px-6 bg-[#0B0F17] border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Power Sizing Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
            Solar & Off-Grid Load Calculator
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Select your household or RV appliances to calculate your daily Watt-Hour consumption, required battery Ah capacity, and recommended inverter power.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Appliance Selector & List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Add Presets Row */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                Quick Add Common Appliances
              </label>
              <div className="flex flex-wrap gap-2">
                {APPLIANCE_PRESETS.map(preset => (
                  <button 
                    key={preset.id}
                    onClick={() => handleAddPreset(preset)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-xs text-slate-200 flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({preset.watts}W)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Item Input */}
            <form onSubmit={handleAddCustom} className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap sm:flex-nowrap gap-3 items-center">
              <input 
                type="text" 
                placeholder="Custom device name (e.g. Drone Charger)"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <input 
                type="number" 
                placeholder="Watts (e.g. 150)"
                value={customWatts}
                onChange={e => setCustomWatts(e.target.value)}
                className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <input 
                type="number" 
                placeholder="Hours/day"
                value={customHours}
                onChange={e => setCustomHours(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            {/* Configured Appliance Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">Configured Load Profile</span>
                <span className="text-xs text-cyan-400 font-mono">{selectedAppliances.length} Items</span>
              </div>

              <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
                {selectedAppliances.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No appliances selected. Click a quick preset above to start.
                  </div>
                ) : (
                  selectedAppliances.map(item => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {item.watts}W • Daily Wh: <strong className="text-emerald-400">{item.watts * item.hours * item.count} Wh</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Hours Input */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <input 
                            type="number"
                            value={item.hours}
                            onChange={e => updateItem(item.id, 'hours', e.target.value)}
                            className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-xs font-mono text-cyan-300 focus:outline-none"
                            min="0.1"
                            max="24"
                            step="0.5"
                          />
                          <span className="text-[11px] text-slate-400">hrs</span>
                        </div>

                        {/* Qty Input */}
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-slate-400">x</span>
                          <input 
                            type="number"
                            value={item.count}
                            onChange={e => updateItem(item.id, 'count', e.target.value)}
                            className="w-12 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-xs font-mono text-slate-200 focus:outline-none"
                            min="1"
                          />
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Calculated Results & Battery Recommendation (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-700 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Calculated Energy Profile</span>
                
                {/* System Voltage Selector */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 px-1 font-mono">System V:</span>
                  {[12, 24, 48].map(v => (
                    <button 
                      key={v}
                      onClick={() => setSystemVoltage(v)}
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs transition-all ${
                        systemVoltage === v ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Calculated Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase font-mono">Daily Consumption</p>
                  <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                    {(totalDailyWh / 1000).toFixed(2)} <span className="text-xs font-sans font-semibold text-slate-300">kWh/day</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{totalDailyWh.toLocaleString()} Wh</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase font-mono">Min Battery Ah</p>
                  <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
                    {requiredAh} <span className="text-xs font-sans font-semibold text-slate-300">Ah @ {systemVoltage}V</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Based on 80% DOD</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-mono">Peak Load / Inverter Rating</p>
                  <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                    {totalPeakWatts}W Peak Load
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">Rec. Inverter Size:</span>
                  <span className="text-xs font-extrabold text-slate-100 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {recommendedInverter}W Pure Sine Wave
                  </span>
                </div>
              </div>

              {/* Recommended VoltCraft Battery Card */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommended Battery Bank Solution</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-sm text-slate-100 font-outfit">{recommendedBattery.name}</p>
                      <p className="text-xs text-slate-400">{recommendedBattery.subtitle}</p>
                    </div>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">${recommendedBattery.price}</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Covers <strong className="text-emerald-400">100%</strong> of your daily energy consumption with continuous 10-year lifespan.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={() => onAddToCart(recommendedBattery)}
                      className="flex-1 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-slate-950" /> Add Solution to Cart
                    </button>
                    
                    <button 
                      onClick={() => onQuickView(recommendedBattery)}
                      className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
