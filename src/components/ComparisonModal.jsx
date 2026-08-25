import React from 'react';
import { X, SlidersHorizontal, Trash2, Zap, ShoppingBag } from 'lucide-react';
import { BatteryGraphic } from '../utils/batteryGraphic';
import { formatPrice, calculateDollarsPerWh, calculateWh } from '../utils/formatters';

export function ComparisonModal({ compareItems, onRemoveFromCompare, onClose, onAddToCart, currency = 'USD' }) {
  if (!compareItems || compareItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold font-outfit text-white">Side-by-Side Spec Comparison</h2>
            <span className="text-xs text-slate-400 font-mono">({compareItems.length} Models Selected)</span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 text-xs font-mono text-slate-400 uppercase w-48">Spec Property</th>
                {compareItems.map(item => (
                  <th key={item.id} className="p-3 text-center min-w-[200px] relative group">
                    <button 
                      onClick={() => onRemoveFromCompare(item.id)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="h-32 mb-2">
                      <BatteryGraphic 
                        category={item.category}
                        chemistry={item.chemistry}
                        voltage={item.voltage}
                        capacity={item.capacity}
                      />
                    </div>

                    <p className="font-bold font-outfit text-xs text-slate-100 line-clamp-1">{item.name}</p>
                    <p className="text-[11px] font-mono text-emerald-400 font-bold">{formatPrice(item.price, currency)}</p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs">
              {/* Voltage Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Nominal Voltage</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center font-bold text-slate-200 font-mono">
                    {item.voltage}
                  </td>
                ))}
              </tr>

              {/* Energy Wh Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Stored Energy (Wh)</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center font-bold text-emerald-400 font-mono">
                    {calculateWh(item.voltage, item.capacity)} Wh
                  </td>
                ))}
              </tr>

              {/* $/Wh Efficiency Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Energy Value ($/Wh)</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center font-bold text-amber-400 font-mono">
                    {calculateDollarsPerWh(item.price, item.voltage, item.capacity)}
                  </td>
                ))}
              </tr>

              {/* Cell Chemistry Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Cell Chemistry</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center text-slate-300">
                    {item.chemistry.split(' ')[0]}
                  </td>
                ))}
              </tr>

              {/* Cycle Life Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Cycle Life</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center font-bold text-cyan-400 font-mono">
                    {item.cycleLife}
                  </td>
                ))}
              </tr>

              {/* Max Continuous Amps Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Max Discharge Current</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center text-slate-200 font-mono">
                    {item.maxDischarge.split('/')[0]}
                  </td>
                ))}
              </tr>

              {/* Weight Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Weight</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center text-slate-300">
                    {item.weight}
                  </td>
                ))}
              </tr>

              {/* Core Trade-In Credit Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Trade-In Rebate</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center text-emerald-400 font-mono font-bold">
                    {item.coreRebate > 0 ? `-$${item.coreRebate}` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Action Buttons Row */}
              <tr>
                <td className="p-3 font-mono text-slate-400">Buy Direct</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center">
                    <button 
                      onClick={() => {
                        onAddToCart(item);
                        onClose();
                      }}
                      className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
