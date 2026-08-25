import React from 'react';
import { LoadCalculator } from '../components/LoadCalculator';

export function CalculatorPage({ onAddToCart, onQuickView }) {
  return (
    <div className="py-6 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-black font-outfit text-slate-900">
          Solar & Power Load Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Calculate your exact daily Watt-Hour consumption, required battery Ah bank capacity, and inverter size for home, solar, or RV backup.
        </p>
      </div>

      <LoadCalculator 
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
      />
    </div>
  );
}
