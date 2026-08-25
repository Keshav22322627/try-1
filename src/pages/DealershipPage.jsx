import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  PackageCheck
} from 'lucide-react';

export function DealershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    firmName: '',
    city: '',
    state: 'Haryana',
    businessType: 'battery_shop',
    monthlyVolume: '25_100',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
          Factory Direct Partnership
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-outfit text-slate-900">
          Become an India Hyundai Power Authorized Dealer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Manufactured in-house by <strong>Shivam Industries</strong> in Jind, Haryana. Direct factory margins, no middlemen, 60-month warranty backed straight by the factory team.
        </p>
      </div>

      {/* Why Dealers Choose Us Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="electrent-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black font-mono">
            01
          </div>
          <h3 className="font-extrabold font-outfit text-slate-900 text-sm">Direct Factory Margins</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct supply from factory. No distributor cuts — maximum profit margin per battery unit for dealers.
          </p>
        </div>

        <div className="electrent-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black font-mono">
            02
          </div>
          <h3 className="font-extrabold font-outfit text-slate-900 text-sm">Direct After-Sale Service</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Warranty claims handled directly by the Jind manufacturing plant team. Fast customer resolution without hassle.
          </p>
        </div>

        <div className="electrent-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black font-mono">
            03
          </div>
          <h3 className="font-extrabold font-outfit text-slate-900 text-sm">Make in India & ISO Certified</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            100% in-house spine casting, assembly, formation & testing at Rohtak Road Jind unit (ISO 9001:2015 Certified).
          </p>
        </div>

        <div className="electrent-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black font-mono">
            04
          </div>
          <h3 className="font-extrabold font-outfit text-slate-900 text-sm">Full Branding Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Storefront flex boards, digital marketing leads, promotional hoardings, and technical catalogue support.
          </p>
        </div>

      </div>

      {/* Dealership Requirements & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Factory Contact & Criteria (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>What We Look For in Dealers</span>
            </h3>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>A shop or godown in your area</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Experience in battery shop, electricals, or new to trade</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Ability to hold initial stock (25 to 100+ units opening order)</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400 font-mono">
              <p className="flex items-center gap-2 text-slate-200 font-bold">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Factory Contact: +91 92151 67400</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Shivamindustries0707@gmail.com</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Shivam Industries, Opp. New Anaj Mandi, Raghu Nagar, Rohtak Road, Jind-126102, Haryana</span>
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-950 space-y-2">
            <h4 className="font-extrabold font-outfit text-sm">Target Dealer Expansion Regions</h4>
            <p className="text-xs leading-relaxed text-emerald-800">
              Haryana, Punjab, Delhi NCR, Rajasthan, Uttar Pradesh & Pan-India. Call <strong>92151 67400</strong> for instant phone inquiry.
            </p>
          </div>

        </div>

        {/* Right Column: Interactive Dealership Application Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="electrent-card p-6 bg-white space-y-5">
            <div>
              <h3 className="text-xl font-extrabold font-outfit text-slate-900">
                Apply for Factory Dealership
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below. Our sales manager will contact you the same day with price lists and margin slabs.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-extrabold font-outfit">Application Submitted!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Thank you <strong>{formData.fullName}</strong>. Our factory sales executive will call you shortly at <strong>{formData.phone}</strong> with wholesale price catalogs for {formData.city}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 font-outfit">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ramesh Verma"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 font-outfit">Mobile Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 9215167400"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 font-outfit">Firm / Shop Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Verma Battery Store"
                      value={formData.firmName}
                      onChange={e => setFormData({ ...formData, firmName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 font-outfit">City & State *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Karnal, Haryana"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 font-outfit">Current Business</label>
                    <select 
                      value={formData.businessType}
                      onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="battery_shop">Existing Battery Shop</option>
                      <option value="electricals">Electricals Store</option>
                      <option value="solar_installer">Solar Systems Installer</option>
                      <option value="new_trade">New to Battery Trade</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 font-outfit">Monthly Stock Requirement</label>
                    <select 
                      value={formData.monthlyVolume}
                      onChange={e => setFormData({ ...formData, monthlyVolume: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="under_25">Under 25 Units</option>
                      <option value="25_100">25 to 100 Units</option>
                      <option value="100_plus">100+ Units</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 font-outfit">Message / Preferred Models</label>
                  <textarea 
                    rows="3" 
                    placeholder="Tell us which models (IHP23036, IHP25036, IHP28036, IHP30036 or LiFePO4 PowerWall) you want to stock..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 rounded-lg bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs font-outfit uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Dealership Application</span>
                </button>

              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
