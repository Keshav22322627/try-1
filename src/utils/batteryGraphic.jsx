import React from 'react';

export function BatteryGraphic({ category, chemistry, voltage, capacity, isTopPick, isNew, className = 'w-full h-48' }) {
  // Theme colors per category
  let primaryGlow = '#10B981'; // Emerald
  let accentGradient = ['#10B981', '#06B6D4'];
  let bgGradient = ['#111827', '#0B0F17'];
  let chassisColor = '#1F2937';

  if (category === 'solar') {
    primaryGlow = '#F59E0B'; // Gold/Amber
    accentGradient = ['#F59E0B', '#EF4444'];
    bgGradient = ['#1E1B4B', '#0F172A'];
  } else if (category === 'marine') {
    primaryGlow = '#06B6D4'; // Cyan
    accentGradient = ['#06B6D4', '#3B82F6'];
    bgGradient = ['#0F2537', '#070A10'];
  } else if (category === 'automotive') {
    primaryGlow = '#10B981'; // Emerald
    accentGradient = ['#10B981', '#34D399'];
    bgGradient = ['#18181B', '#09090B'];
  } else if (category === 'industrial') {
    primaryGlow = '#8B5CF6'; // Purple
    accentGradient = ['#8B5CF6', '#EC4899'];
    bgGradient = ['#2E1065', '#0F172A'];
  } else if (category === 'portable') {
    primaryGlow = '#F43F5E'; // Rose
    accentGradient = ['#F43F5E', '#F97316'];
    bgGradient = ['#2A0A18', '#0B0F17'];
  }

  return (
    <div className={`relative flex items-center justify-center p-4 overflow-hidden rounded-xl bg-slate-950/80 border border-slate-800/80 group-hover:border-slate-700 transition-all ${className}`}>
      
      {/* Background Energy Radial Halo */}
      <div 
        className="absolute inset-0 opacity-15 transition-opacity group-hover:opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primaryGlow} 0%, transparent 70%)`
        }}
      />

      {/* SVG Battery Chassis Graphic */}
      <svg viewBox="0 0 300 180" className="w-full h-full max-h-44 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Casing Gradients */}
          <linearGradient id={`chassisGrad-${category}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#070A10" />
          </linearGradient>

          <linearGradient id={`accentBar-${category}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentGradient[0]} />
            <stop offset="100%" stopColor={accentGradient[1]} />
          </linearGradient>

          <linearGradient id="metallicPosts" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`glowFilter-${category}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Battery Main Body Frame */}
        <rect x="35" y="42" width="230" height="118" rx="12" fill={`url(#chassisGrad-${category})`} stroke={primaryGlow} strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* Heat Sink Vent Slots Top/Bottom */}
        <line x1="50" y1="48" x2="250" y2="48" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 3" />
        <line x1="50" y1="152" x2="250" y2="152" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 3" />

        {/* Heavy Terminal Posts */}
        {/* Negative Post (Left) */}
        <rect x="60" y="26" width="28" height="16" rx="4" fill="url(#metallicPosts)" stroke="#475569" strokeWidth="1" />
        <rect x="70" y="32" width="8" height="4" fill="#38BDF8" />
        <circle cx="74" cy="18" r="6" fill="#0284C7" opacity="0.8" />
        <text x="74" y="21" fontSize="11" fontWeight="900" fill="#FFF" textAnchor="middle">-</text>

        {/* Positive Post (Right) */}
        <rect x="212" y="26" width="28" height="16" rx="4" fill="url(#metallicPosts)" stroke="#475569" strokeWidth="1" />
        <rect x="222" y="32" width="8" height="4" fill="#EF4444" />
        <circle cx="226" cy="18" r="6" fill="#DC2626" opacity="0.9" />
        <text x="226" y="21" fontSize="11" fontWeight="900" fill="#FFF" textAnchor="middle">+</text>

        {/* High-Tech Front LED Display Screen */}
        <rect x="55" y="60" width="190" height="40" rx="8" fill="#030712" stroke="#1E293B" strokeWidth="1" />
        
        {/* State of Charge Bar */}
        <g transform="translate(65, 70)">
          <rect x="0" y="0" width="170" height="10" rx="5" fill="#111827" stroke="#1F2937" />
          <rect x="2" y="2" width="135" height="6" rx="3" fill={`url(#accentBar-${category})`} filter={`url(#glowFilter-${category})`} />
          <line x1="34" y1="2" x2="34" y2="8" stroke="#030712" strokeWidth="2" />
          <line x1="68" y1="2" x2="68" y2="8" stroke="#030712" strokeWidth="2" />
          <line x1="102" y1="2" x2="102" y2="8" stroke="#030712" strokeWidth="2" />
          <line x1="136" y1="2" x2="136" y2="8" stroke="#030712" strokeWidth="2" />
        </g>

        {/* Status Telemetry Text */}
        <text x="70" y="93" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono" fill={primaryGlow} letterSpacing="0.5">
          {voltage} NOMINAL
        </text>
        <text x="230" y="93" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono" fill="#94A3B8" textAnchor="end">
          BMS: OK (100%)
        </text>

        {/* VoltCraft Brand Badge Label */}
        <text x="150" y="122" fontSize="12" fontWeight="900" fontFamily="Outfit" fill="#F8FAFC" textAnchor="middle" letterSpacing="1.5">
          VOLTCRAFT PRO
        </text>
        <text x="150" y="136" fontSize="9" fontWeight="600" fontFamily="JetBrains Mono" fill="#64748B" textAnchor="middle">
          {capacity} • {chemistry.split(' ')[0]}
        </text>
      </svg>

      {/* Top Pick / New Badges */}
      {isTopPick && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg font-outfit tracking-wide">
          ★ Flagship Choice
        </span>
      )}
      {isNew && !isTopPick && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg font-outfit tracking-wide">
          ✦ Gen-3 Prismatic
        </span>
      )}
    </div>
  );
}
