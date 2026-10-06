import React from 'react';
import { Layers, ShieldCheck, Zap, Heart, Mail, CheckCircle, ExternalLink } from 'lucide-react';
import { StorageService } from '../utils/storage';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const categories = StorageService.getCategories();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      
      {/* Top Value Banner */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 py-8 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Instant ZIP Delivery</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download production-ready source code immediately upon payment verification.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Clean & Zero-Bloat Code</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Semantic HTML5, CSS3, and vanilla JavaScript. 100% Lighthouse score ready.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Commercial License Included</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Use freely for client projects, businesses, or personal portfolios.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-md">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Poppins']">
                WebCraft<span className="text-indigo-600 dark:text-indigo-400">Studio</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              The premier marketplace for handcrafted, performance-obsessed website templates. Built specifically for freelancers, agencies, and ambitious founders.
            </p>

            {/* Accepted Payments Pill */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Supported Payment Methods
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  eSewa QR
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Khalti QR
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  Bank Transfer / QR
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  USD ($) Accepted
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`#/templates?category=${cat.id}`)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('#/templates')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Templates
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/support')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ & Documentation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/account')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  My Downloads
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Static Hosting Notice */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Deployment & Host
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Designed for Cloudflare Pages, Workers D1 & R2, GitHub Pages, and Render. Hash-routed for zero 404s.
            </p>
            <div className="space-y-2 text-xs">
              <span className="block text-slate-400">Version 2.4.0 (Production)</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                D1 & Worker API Active
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} WebCraft Studio Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('#/support')} className="hover:underline">Licensing Terms</button>
            <button onClick={() => navigate('#/about')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => navigate('#/contact')} className="hover:underline">Helpdesk</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
