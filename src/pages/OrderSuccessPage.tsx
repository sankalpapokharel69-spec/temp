import React from 'react';
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, Download, Package } from 'lucide-react';
import { StorageService } from '../utils/storage';

interface OrderSuccessPageProps {
  navigate: (route: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ navigate }) => {
  // Parse orderId from hash (e.g. #/order-success?orderId=ORD-123456)
  const hash = window.location.hash;
  const queryIndex = hash.indexOf('?');
  let orderId = '';
  if (queryIndex !== -1) {
    const params = new URLSearchParams(hash.substring(queryIndex));
    orderId = params.get('orderId') || '';
  }

  const orders = StorageService.getOrders();
  const order = orders.find(o => o.id === orderId) || orders[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-8">
      
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-50 dark:ring-emerald-900/30">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
          Thank you for your order!
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Your order <span className="font-mono font-bold text-slate-900 dark:text-white">{order?.id || orderId}</span> has been received and is queued for verification.
        </p>
      </div>

      {/* Order Status Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-left space-y-4 max-w-xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Total Amount Paid</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              ${order?.totalAmount || 0}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Current Status</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{order?.status || 'Pending'}</span>
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 space-y-2">
          <p>
            • Your payment proof and transaction reference (<code className="font-bold text-slate-700 dark:text-slate-300">{order?.paymentRef || 'Submitted'}</code>) have been forwarded to the admin review queue.
          </p>
          <p>
            • Once approved, you can immediately download the complete source code ZIP archive from your <strong className="text-indigo-600">My Account & Orders</strong> dashboard.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('#/account')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02]"
        >
          <Package className="w-4 h-4" />
          <span>View in My Account & Orders</span>
        </button>

        <button
          onClick={() => navigate('#/templates')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
