// India Hyundai Power - Website Home Page

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Footer from '../components/Footer.jsx';
import { dbStore } from '../data/dbStore.js';
import {
  Car, Zap, Bike, Truck, Server, ShieldCheck, Award, ThumbsUp, Users, MapPin, ArrowRight,
  TrendingUp, RefreshCw, Clock, CheckCircle2, ChevronRight, Phone
} from 'lucide-react';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const products = dbStore.getProducts();
  const categories = dbStore.getCategories();
  const navigate = useNavigate();

  const iconMap = {
    Car: Car,
    Zap: Zap,
    Bike: Bike,
    Truck: Truck,
    Server: Server
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Hero Banner */}
      <Hero />

      {/* Product Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#0066B1] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Hyundai Energy Portfolios
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002C6C] tracking-tight">
            Explore Battery Categories
          </h2>
          <p className="text-slate-600 text-sm">
            High performance battery solutions tailored for automobiles, domestic inverter systems, two-wheelers, and commercial fleets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Zap;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="hyundai-card group bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0066B1] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#002C6C] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0066B1] transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#002C6C]">
                  <span>View Category Products</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0066B1] uppercase tracking-widest">
                Authorized Dealer Inventory
              </span>
              <h2 className="text-3xl font-black text-[#002C6C]">
                Top Selling Batteries
              </h2>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0066B1] hover:underline"
            >
              View Full Catalog (5 Models) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => navigate(`/product/${p.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose India Hyundai Power */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-[#002C6C]">Why Choose India Hyundai Power</h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Engineered for high charge efficiency, thermal resistance, and long backup times across Indian conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066B1] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Long Warranty Protection</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Up to 60 to 72 months comprehensive warranty coverage with hassle-free free replacement terms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">3D Tall Tubular Grid</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thick corrosion-resistant plates engineered specifically for deep discharge recovery and high current backup.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Pan-India Dealer Network</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Over 1,200 authorized dealers, sales heads, and delivery personnel in Punjab, Haryana, Delhi NCR, and nationwide.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Express Door Delivery</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Same-day or 24-hour express delivery and battery fitment assistance right at your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-[#002C6C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-blue-800/50">
            <div className="space-y-1 p-4">
              <div className="text-4xl font-black text-cyan-400">250+</div>
              <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">Battery Models</div>
            </div>

            <div className="space-y-1 p-4">
              <div className="text-4xl font-black text-cyan-400">1,200+</div>
              <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">Authorized Dealers</div>
            </div>

            <div className="space-y-1 p-4">
              <div className="text-4xl font-black text-cyan-400">50,000+</div>
              <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">Happy Customers</div>
            </div>

            <div className="space-y-1 p-4">
              <div className="text-4xl font-black text-cyan-400">15+</div>
              <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-[#002C6C]">What Our Customers Say</h2>
          <p className="text-xs text-slate-500 mt-1">Trusted by homeowners, fleet operators, and industrial units across India.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 text-xs">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed font-serif italic">
              "We installed Hyundai Solaria 200Ah in our Amritsar logistics warehouse. Power cuts last 4-5 hours here, but the battery runs our heavy lighting and computers without any drop!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#002C6C] font-bold text-xs flex items-center justify-center">S</div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Simranjit Kaur</div>
                <div className="text-[10px] text-slate-400">Owner, Freight Logistics</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 text-xs">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed font-serif italic">
              "Ordered Hyundai Enercell 65Ah for my SUV through Ludhiana Power Hub dealer. Delivered in 3 hours with full warranty registration!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">R</div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Rajesh Kumar</div>
                <div className="text-[10px] text-slate-400">Mall Road, Ludhiana</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 text-xs">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed font-serif italic">
              "As an authorized dealer in Ludhiana Central, India Hyundai Power's dealer panel makes ordering stock, tracking deliveries, and managing client ledger payments super effortless."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">S</div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Sunil Aggarwal</div>
                <div className="text-[10px] text-slate-400">Authorized Hyundai Dealer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">Need Battery Advice or Dealer Inquiry?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Contact our dedicated support team or locate your nearest authorized Hyundai Power dealer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-[#0066B1] hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-full text-xs transition">
              Contact Sales Team
            </Link>
            <a href="tel:1800123456" className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3.5 rounded-full text-xs border border-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" /> Call 1800-HYUNDAI
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
