import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Star, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Code, 
  FileCode, 
  Clock, 
  Share2, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { Template } from '../types';
import { StorageService } from '../utils/storage';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { TemplateCard } from '../components/TemplateCard';

interface TemplateDetailPageProps {
  templateId: string;
  navigate: (route: string) => void;
  onPreview: (template: Template) => void;
}

export const TemplateDetailPage: React.FC<TemplateDetailPageProps> = ({
  templateId,
  navigate,
  onPreview,
}) => {
  const template = StorageService.getTemplateById(templateId);
  const { addToCart, isInCart } = useCart();
  const { success, info } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Scroll to top when template changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [templateId]);

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Template Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested template could not be located in the catalog.</p>
        <button
          onClick={() => navigate('#/templates')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          Return to All Templates
        </button>
      </div>
    );
  }

  const inCart = isInCart(template.id);
  const gallery = template.gallery && template.gallery.length > 0 ? template.gallery : [template.thumbnailUrl];

  const handleAddToCart = () => {
    if (!inCart) {
      addToCart(template);
      success('Added to Cart', `${template.title} has been added.`);
    }
  };

  const handleBuyNow = () => {
    if (!inCart) addToCart(template);
    navigate('#/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      info('Link Copied', 'Template URL copied to clipboard.');
    }
  };

  // Related templates in same category
  const relatedTemplates = StorageService.getTemplates()
    .filter(t => t.id !== template.id && t.categoryId === template.categoryId)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button onClick={() => navigate('#/')} className="hover:text-indigo-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <button onClick={() => navigate('#/templates')} className="hover:text-indigo-600">Templates</button>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <button onClick={() => navigate(`#/templates?category=${template.categoryId}`)} className="hover:text-indigo-600 capitalize">
          {template.categoryId}
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">{template.title}</span>
      </nav>

      {/* Main Grid: Gallery on Left, Buy Box on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Gallery & In-Depth Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Screenshot Viewer */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md group">
            <img
              src={gallery[activeImageIndex] || template.thumbnailUrl}
              alt={template.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Quick Live Demo Floating Button */}
            <button
              onClick={() => onPreview(template)}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs font-bold shadow-xl backdrop-blur hover:bg-white dark:hover:bg-slate-900 transition hover:scale-105"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Launch Live Interactive Demo</span>
            </button>
          </div>

          {/* Thumbnails row */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Overview & Description */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">
                Template Description & Highlights
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {template.description}
              </p>
            </div>

            {/* Features Checklist */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                What Makes This Template Exceptional
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {template.features.map((feat, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Pages Count</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{template.pagesCount} Prebuilt</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Compatibility</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">HTML5 / CSS3</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Lighthouse</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">98+ Ready</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">License</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Commercial</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Pricing & Conversion Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6 sticky top-24">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {template.categoryId}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Share Template"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
                {template.title}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{template.rating.toFixed(1)}</span>
                <span className="text-slate-400">({template.salesCount} purchases)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">One-time payment</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
                    ${template.price}
                  </span>
                  {template.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${template.originalPrice}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                Instant Delivery
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buy Now (${template.price})</span>
              </button>

              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm border transition ${
                  inCart
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{inCart ? 'Template in Cart' : 'Add to Shopping Cart'}</span>
              </button>

              <button
                onClick={() => onPreview(template)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Open Live Interactive Preview</span>
              </button>
            </div>

            {/* Value Guarantees list */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Instant ZIP file download after payment confirmation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited commercial use for your own or client projects</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Valid W3C HTML5 markup, responsive CSS, & documented JS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Dedicated customer support via our ticket helpdesk</span>
              </div>
            </div>

            {/* Payment Logos Pill */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
              <p className="text-[11px] text-slate-400 mb-1.5">Accepted Checkout Methods:</p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold">
                <span className="text-emerald-600">eSewa QR</span>
                <span>•</span>
                <span className="text-purple-600">Khalti QR</span>
                <span>•</span>
                <span className="text-blue-600">Bank Transfer</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Related Templates Section */}
      {relatedTemplates.length > 0 && (
        <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                More in this category
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins'] mt-1">
                Similar Website Templates
              </h2>
            </div>
            <button
              onClick={() => navigate(`#/templates?category=${template.categoryId}`)}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View all in {template.categoryId}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTemplates.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                onPreview={onPreview}
                navigate={navigate}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
