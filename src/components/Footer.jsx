// India Hyundai Power - Footer Component

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 font-sans pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-xl">
                H
              </div>
              <span className="font-black text-xl text-white tracking-tight">INDIA HYUNDAI POWER</span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India Hyundai Power is a leading distributor of high-capacity tubular inverter batteries, automotive sealed batteries, motorcycle VRLA cells, and heavy-duty commercial energy solutions across India.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Genuine Certified Hyundai Power Warranty
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-cyan-400 transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-cyan-400 transition">All Battery Products</Link></li>
              <li><Link to="/order-tracking" className="hover:text-cyan-400 transition">Track Your Order</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition">About Company</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact & Support</Link></li>
              <li><Link to="/dashboard" className="text-blue-400 hover:underline flex items-center gap-1 font-semibold">Dealer / Staff Portal <ArrowUpRight className="w-3 h-3" /></Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Product Series</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?category=automotive-batteries" className="hover:text-cyan-400 transition">Automotive Batteries</Link></li>
              <li><Link to="/shop?category=inverter-solar-batteries" className="hover:text-cyan-400 transition">Inverter Tubular Batteries</Link></li>
              <li><Link to="/shop?category=two-wheeler-batteries" className="hover:text-cyan-400 transition">Two-Wheeler VRLA</Link></li>
              <li><Link to="/shop?category=commercial-batteries" className="hover:text-cyan-400 transition">Commercial Truck & Tractor</Link></li>
              <li><Link to="/shop?category=industrial-power-solutions" className="hover:text-cyan-400 transition">Industrial UPS Batteries</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Corporate Office</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>India Hyundai Power Corporate Tower, GT Road, Ludhiana, Punjab 141001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Toll-Free: 1800-HYUNDAI (4986324)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>support@hyundaipower.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} INDIA HYUNDAI POWER. All rights reserved. Registered Trademark.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Dealer Network</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
