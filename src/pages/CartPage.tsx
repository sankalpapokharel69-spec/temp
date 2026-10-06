import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface CartPageProps {
  navigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { 
    cart, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discount, 
    total, 
    promoCode, 
    applyPromoCode, 
    removePromoCode 
  } = useCart();

  const { success, error, info } = useToast();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyPromoCode(couponInput);
    if (ok) {
      success('Promo Code Applied!', 'You received a discount on your order.');
      setCouponInput('');
    } else {
      error('Invalid Promo Code', 'Try using coupon WEBCRAFT10 for 10% off.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Poppins']">
            Your Cart is Currently Empty
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            You haven't added any website templates yet. Discover our curated collection of responsive, high-converting templates.
          </p>
        </div>
        <button
          onClick={() => navigate('#/templates')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition"
        >
          <span>Explore Template Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
            Shopping Cart ({cart.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected website templates before proceeding to payment.
          </p>
        </div>
        <button
          onClick={() => {
            clearCart();
            info('Cart Cleared', 'All items have been removed.');
          }}
          className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ template }) => (
            <div
              key={template.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/30 transition"
            >
              {/* Item Preview & Title */}
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={template.thumbnailUrl}
                  alt={template.title}
                  className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    {template.categoryId}
                  </span>
                  <h3
                    onClick={() => navigate(`#/templates/${template.id}`)}
                    className="text-sm font-bold text-slate-900 dark:text-white truncate hover:text-indigo-600 cursor-pointer"
                  >
                    {template.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{template.pagesCount} pages included</span>
                    <span>•</span>
                    <span>Commercial license</span>
                  </div>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    ${template.price}
                  </span>
                </div>
                <button
                  onClick={() => {
                    removeFromCart(template.id);
                    info('Item Removed', `${template.title} was removed from cart.`);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping button */}
          <div className="pt-2">
            <button
              onClick={() => navigate('#/templates')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue browsing more templates</span>
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6 sticky top-24">
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                Have a coupon or discount code?
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. WEBCRAFT10"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </div>

              {promoCode && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800 mt-2">
                  <span className="font-semibold">Code: {promoCode}</span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-[11px] underline opacity-80 hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-mono font-medium">${subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-${discount}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Tax & Digital Delivery</span>
                <span className="font-medium text-emerald-600">Free ($0.00)</span>
              </div>

              <div className="flex items-baseline justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-base font-extrabold text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-2xl font-mono text-indigo-600 dark:text-indigo-400 font-['Poppins']">
                  ${total}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('#/checkout')}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Manual QR proof verification with 100% money back guarantee</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
