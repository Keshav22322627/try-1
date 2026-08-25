import React from 'react';
import { BatteryFinder } from '../components/BatteryFinder';

export function BatteryFinderPage({ onAddToCart, onQuickView, compareItems, onToggleCompare }) {
  return (
    <div className="py-6 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-black font-outfit text-slate-900">
          Smart Battery Finder Wizard
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Answer 3 quick fitment questions to discover the exact lithium battery pack and system voltage match for your vehicle or solar setup.
        </p>
      </div>

      <BatteryFinder 
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
        compareItems={compareItems}
        onToggleCompare={onToggleCompare}
      />
    </div>
  );
}
