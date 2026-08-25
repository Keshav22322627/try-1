import React from 'react';
import { CoreTradeIn } from '../components/CoreTradeIn';

export function TradeInPage({ onApplyTradeInCredit }) {
  return (
    <div className="py-6 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-black font-outfit text-slate-900">
          Core Battery Exchange & Recycling Program
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Recycle old spent lead-acid or AGM batteries safely. We provide a free prepaid shipping box & return label and credit your order instantly!
        </p>
      </div>

      <CoreTradeIn onApplyTradeInCredit={onApplyTradeInCredit} />
    </div>
  );
}
