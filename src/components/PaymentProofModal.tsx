import React from 'react';
import { X, ExternalLink, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface PaymentProofModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange?: (status: Order['status']) => void;
  isAdmin?: boolean;
}

export const PaymentProofModal: React.FC<PaymentProofModalProps> = ({
  order,
  onClose,
  onStatusChange,
  isAdmin = false,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Payment Verification Details
            </h3>
            <p className="text-xs text-slate-500">Order ID: #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block">Customer</span>
              <strong className="text-slate-800 dark:text-slate-200">{order.customerName}</strong>
              <span className="text-[11px] text-slate-400 block truncate">{order.customerEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Amount</span>
              <strong className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                ${order.totalAmount}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Method</span>
              <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {order.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Status</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                order.status === 'Paid' || order.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : order.status === 'Rejected'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {order.status}
              </span>
            </div>
            {order.paymentRef && (
              <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block">Transaction Reference / ID</span>
                <code className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                  {order.paymentRef}
                </code>
              </div>
            )}
            {order.notes && (
              <div className="col-span-2">
                <span className="text-slate-400 block">Customer Note</span>
                <p className="text-slate-600 dark:text-slate-300 italic">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Payment Proof Receipt Image */}
          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Uploaded Payment Slip / Receipt:
            </span>
            {order.paymentProofUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img
                  src={order.paymentProofUrl}
                  alt="Payment receipt proof"
                  className="w-full max-h-72 object-contain mx-auto"
                />
                <a
                  href={order.paymentProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-medium backdrop-blur transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size</span>
                </a>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs">
                No screenshot uploaded. Reference ID was provided directly.
              </div>
            )}
          </div>

        </div>

        {/* Footer / Admin Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>

          {isAdmin && onStatusChange && (
            <div className="flex items-center gap-2">
              {order.status !== 'Paid' && (
                <button
                  onClick={() => {
                    onStatusChange('Paid');
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve & Mark Paid</span>
                </button>
              )}

              {order.status === 'Pending' && (
                <button
                  onClick={() => {
                    onStatusChange('Rejected');
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition"
                >
                  Reject Proof
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
