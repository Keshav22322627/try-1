import React, { useState } from 'react';
import { Video, Calendar, Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export function VirtualDemoBanner() {
  const [isBooked, setIsBooked] = useState(false);
  const [demoDate, setDemoDate] = useState('Today, 4:00 PM');

  return (
    <section className="py-10 px-4 sm:px-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-y border-emerald-500/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Text */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/40">
            <Video className="w-3.5 h-3.5" />
            <span>1:1 Live Virtual Consultation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit">
            Book a Free 1:1 Live Virtual Demo with an Energy Specialist
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            See VoltCraft inverters in action live from our testing lab, ask technical load sizing questions, and get custom solution recommendations.
          </p>
        </div>

        {/* Right CTA */}
        <div className="flex-shrink-0">
          {isBooked ? (
            <div className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl font-bold text-xs font-mono flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demo Scheduled for {demoDate}! Check Email</span>
            </div>
          ) : (
            <button 
              onClick={() => setIsBooked(true)}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider font-outfit shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Schedule Free Live Demo</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
