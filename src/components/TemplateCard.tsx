import React from 'react';
import { Eye, ShoppingBag, Check, Star, Layers, Sparkles } from 'lucide-react';
import { Template } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  navigate: (route: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPreview, navigate }) => {
  const { addToCart, isInCart } = useCart();
  const { success } = useToast();
  const inCart = isInCart(template.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inCart) {
      addToCart(template);
      success('Added to Cart', `${template.title} was added to your cart.`);
    }
  };

  return (
    <div
      onClick={() => navigate(`#/templates/${template.id}`)}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail + Overlays */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={template.thumbnailUrl}
          alt={template.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Tag */}
        {template.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-md shadow-amber-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}

        {/* Pages badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[11px] font-medium">
          <Layers className="w-3 h-3 text-indigo-400" />
          <span>{template.pagesCount} Pages</span>
        </div>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-slate-100 transition hover:scale-105"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Live Demo</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition hover:scale-105 ${
              inCart
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {template.categoryId}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{template.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({template.salesCount} sold)</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {template.title}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {template.shortDesc}
          </p>
        </div>

        {/* Footer Pricing & Buy */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              ${template.price}
            </span>
            {template.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${template.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template);
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Live Demo"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-xl transition ${
                inCart
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
              }`}
              title={inCart ? 'Item in cart' : 'Add to cart'}
            >
              {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
