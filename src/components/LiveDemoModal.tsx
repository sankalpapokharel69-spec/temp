import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  ShoppingBag, 
  Check, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Template } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface LiveDemoModalProps {
  template: Template | null;
  onClose: () => void;
  navigate: (route: string) => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({ template, onClose, navigate }) => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const { addToCart, isInCart } = useCart();
  const { success } = useToast();

  if (!template) return null;

  const inCart = isInCart(template.id);

  const handleAddToCart = () => {
    if (!inCart) {
      addToCart(template);
      success('Added to cart!', `${template.title} has been added.`);
    }
  };

  const handleBuyNow = () => {
    if (!inCart) addToCart(template);
    onClose();
    navigate('#/checkout');
  };

  // Device width mapping
  const deviceWidthClass = {
    desktop: 'w-full max-w-full h-full',
    tablet: 'w-[768px] h-[92%] border-x-8 border-t-8 border-b-8 border-slate-700 rounded-3xl shadow-2xl overflow-hidden',
    mobile: 'w-[375px] h-[92%] border-x-8 border-t-8 border-b-8 border-slate-700 rounded-3xl shadow-2xl overflow-hidden',
  }[device];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        
        {/* Left: Template info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h3 className="text-sm font-semibold text-white max-w-xs md:max-w-md truncate">
              {template.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="capitalize">{template.categoryId}</span>
              <span>•</span>
              <span>{template.pagesCount} Pre-built Pages</span>
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              device === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              device === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              device === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs text-slate-400 line-through">${template.originalPrice || template.price + 20}</span>
            <span className="text-sm font-bold text-emerald-400">${template.price}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              inCart
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Buy Now (${template.price})</span>
          </button>
        </div>

      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto bg-slate-900/60 p-2 sm:p-6 flex items-center justify-center">
        <div className={`transition-all duration-300 bg-white shadow-2xl relative ${deviceWidthClass}`}>
          
          {/* Simulated Template Interactive Webpage */}
          <div className="w-full h-full overflow-y-auto bg-white text-slate-900">
            
            {/* Template Header Preview */}
            <header className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="font-['Poppins'] font-bold text-lg text-slate-900 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                <span>{template.title.split(' ')[0]}</span>
                <span className="text-indigo-600">Demo</span>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
                <a href="#demo-home" className="text-indigo-600">Overview</a>
                <a href="#demo-features" className="hover:text-slate-900">Features</a>
                <a href="#demo-gallery" className="hover:text-slate-900">Gallery</a>
                <a href="#demo-specs" className="hover:text-slate-900">Tech Specs</a>
              </div>
              <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                Interactive Preview
              </div>
            </header>

            {/* Template Hero Banner */}
            <section id="demo-home" className="relative py-16 px-6 lg:px-12 bg-gradient-to-b from-indigo-50/60 to-white text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-4">
                ★ 4.9/5 Rating ({template.salesCount}+ Sales)
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-['Poppins'] max-w-3xl mx-auto leading-tight">
                {template.title}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {template.shortDesc}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-700 transition"
                >
                  Download Source Code (${template.price})
                </button>
                <a
                  href="#demo-features"
                  className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
                >
                  Explore Included Pages ({template.pagesCount})
                </a>
              </div>

              {/* Hero Image Showcase */}
              <div className="mt-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 max-w-4xl mx-auto">
                <img
                  src={template.thumbnailUrl}
                  alt={template.title}
                  className="w-full h-auto object-cover max-h-[460px]"
                />
              </div>
            </section>

            {/* Template Features Section */}
            <section id="demo-features" className="py-14 px-6 lg:px-12 bg-slate-50/70 border-t border-slate-200">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-slate-900">
                    What’s Included in This Template
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Crafted with zero frameworks, clean CSS variables, and modular vanilla JavaScript.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {template.features.map((feat, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{feat}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Tested for cross-browser support and WCAG accessibility.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Template Gallery Screenshots */}
            <section id="demo-gallery" className="py-12 px-6 lg:px-12 bg-white">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold font-['Poppins'] text-slate-900 mb-6">
                  Page Layouts & Responsive Views
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {template.gallery.map((img, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        src={img}
                        alt={`Screen ${i + 1}`}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[11px] text-white font-medium">Layout View 0{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Template Technical Specs Section */}
            <section id="demo-specs" className="py-12 px-6 lg:px-12 bg-slate-900 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl font-bold text-amber-400 font-['Poppins']">{template.pagesCount}</div>
                    <div className="text-xs text-slate-400 mt-1">Ready-to-use Pages</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl font-bold text-emerald-400 font-['Poppins']">100%</div>
                    <div className="text-xs text-slate-400 mt-1">Responsive Design</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl font-bold text-indigo-400 font-['Poppins']">&lt; 15 KB</div>
                    <div className="text-xs text-slate-400 mt-1">Lightweight Core</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl font-bold text-pink-400 font-['Poppins']">Commercial</div>
                    <div className="text-xs text-slate-400 mt-1">License Included</div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs text-slate-400 mb-4">
                    Ready to build? Purchase now to receive the full ZIP package with source code and documentation.
                  </p>
                  <button
                    onClick={handleBuyNow}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/40"
                  >
                    Get {template.title} for ${template.price}
                  </button>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>

    </div>
  );
};
