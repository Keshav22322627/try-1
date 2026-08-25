// India Hyundai Power - Contact & Dealer Inquiry Page

import React, { useState } from 'react';
import Footer from '../components/Footer.jsx';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        <div className="bg-[#002C6C] text-white py-12 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-2">
            <h1 className="text-3xl font-black">Contact India Hyundai Power</h1>
            <p className="text-xs text-blue-200">Get in touch for battery sales, dealership authorization, or warranty customer support.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                <h3 className="font-bold text-lg text-slate-900 border-b pb-3">Corporate Contact Details</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#0066B1] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Head Office Address</strong>
                      <span className="text-slate-500">India Hyundai Power Corporate Tower, GT Road, Ludhiana, Punjab 141001</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#0066B1] flex-shrink-0" />
                    <div>
                      <strong className="block text-slate-900">Toll-Free Support Helpline</strong>
                      <span className="text-slate-500">1800-HYUNDAI (4986324)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#0066B1] flex-shrink-0" />
                    <div>
                      <strong className="block text-slate-900">Official Email</strong>
                      <span className="text-slate-500">support@hyundaipower.in</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-7">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="font-bold text-xl text-slate-900">Inquiry Sent Successfully!</h3>
                    <p className="text-xs text-slate-500">Our regional Sales Head or nearest Dealer representative will respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-900">Send an Inquiry</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Inquiry Purpose</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
                      >
                        <option value="General Inquiry">General Product Inquiry</option>
                        <option value="Dealership Authorization">Apply for Hyundai Dealership</option>
                        <option value="Bulk Commercial Order">Bulk Corporate/Fleet Battery Order</option>
                        <option value="Warranty Claim">Warranty Registration / Claim</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Your Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0066B1]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#002C6C] hover:bg-[#0066B1] text-white font-bold py-3 px-6 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
