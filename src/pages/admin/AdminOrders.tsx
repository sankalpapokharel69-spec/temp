import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ExternalLink, 
  Filter 
} from 'lucide-react';
import { StorageService } from '../../utils/storage';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';
import { PaymentProofModal } from '../../components/PaymentProofModal';

export const AdminOrders: React.FC = () => {
  const { success, info } = useToast();
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const handleStatusChange = (orderId: string, newStatus: Order['status'], adminNotes?: string) => {
    const updated = StorageService.updateOrderStatus(orderId, newStatus, adminNotes);
    if (updated) {
      setOrders(StorageService.getOrders());
      success(
        'Status Updated',
        `Order #${orderId} marked as ${newStatus}. ${
          newStatus === 'Paid' ? 'Customer can now download the template ZIP!' : ''
        }`
      );
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
      const matchRef = (o.paymentRef || '').toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchRef) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">
            Customer Orders & Payment Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review uploaded eSewa/Khalti slips and approve orders to unlock template ZIP downloads.
          </p>
        </div>

        {/* Filter by status & search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, email, ref..."
              className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Pending">Pending ({orders.filter(o => o.status === 'Pending').length})</option>
            <option value="Paid">Paid ({orders.filter(o => o.status === 'Paid').length})</option>
            <option value="Completed">Completed ({orders.filter(o => o.status === 'Completed').length})</option>
            <option value="Rejected">Rejected ({orders.filter(o => o.status === 'Rejected').length})</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Templates</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Method</th>
                <th className="px-6 py-3 font-semibold">Reference</th>
                <th className="px-6 py-3 font-semibold">Receipt Slip</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    #{order.id}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <strong className="text-slate-900 dark:text-white block">{order.customerName}</strong>
                    <span className="text-[11px] text-slate-400 block truncate">{order.customerEmail}</span>
                    {order.customerPhone && (
                      <span className="text-[10px] text-slate-400 block">{order.customerPhone}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.items.length} Template{order.items.length > 1 ? 's' : ''}
                    </span>
                    <ul className="text-[11px] text-slate-400 space-y-0.5 mt-0.5 max-w-[200px] truncate">
                      {order.items.map((i, idx) => (
                        <li key={idx} className="truncate">• {i.templateTitle}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 font-bold font-mono text-slate-900 dark:text-white text-sm">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">
                    {order.paymentRef || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedProofOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View Proof</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${
                        order.status === 'Paid' || order.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                          : order.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusChange(order.id, 'Paid')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'Rejected')}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Modal */}
      <PaymentProofModal
        order={selectedProofOrder}
        onClose={() => setSelectedProofOrder(null)}
        isAdmin={true}
        onStatusChange={(status) => {
          if (selectedProofOrder) {
            handleStatusChange(selectedProofOrder.id, status);
          }
        }}
      />

    </div>
  );
};
