import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Layers, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Eye, 
  ArrowUpRight, 
  Plus, 
  FileText,
  CreditCard 
} from 'lucide-react';
import { StorageService } from '../../utils/storage';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';
import { PaymentProofModal } from '../../components/PaymentProofModal';

interface AdminDashboardProps {
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { success } = useToast();
  
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);

  const templates = StorageService.getTemplates();
  const users = StorageService.getUsers();
  const messages = StorageService.getMessages();

  // Metrics
  const totalSales = orders
    .filter(o => o.status === 'Paid' || o.status === 'Completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const unreadMessages = messages.filter(m => m.status === 'unread');

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const updated = StorageService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(StorageService.getOrders());
      success('Order Updated', `Order #${orderId} marked as ${newStatus}. Customer download access updated.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            ${totalSales}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Verified Paid Sales</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {orders.length}
          </p>
          <span className="text-[11px] text-amber-500 font-medium">{pendingOrders.length} pending verification</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Templates</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {templates.length}
          </p>
          <span className="text-[11px] text-slate-400">Active catalog items</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {users.length}
          </p>
          <span className="text-[11px] text-slate-400">Registered users</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inbox / Tickets</span>
            <Mail className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {messages.length}
          </p>
          <span className="text-[11px] text-rose-500 font-medium">{unreadMessages.length} unread messages</span>
        </div>

      </div>

      {/* 2. QUICK ACTIONS BAR */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Poppins']">
            Backoffice Shortcuts
          </h3>
          <p className="text-xs text-slate-400">Perform immediate catalog updates and order audits.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('#/admin/templates')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Template</span>
          </button>

          <button
            onClick={() => navigate('#/admin/orders')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Review Pending Orders ({pendingOrders.length})</span>
          </button>

          <button
            onClick={() => navigate('#/admin/payments')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <CreditCard className="w-4 h-4 text-emerald-500" />
            <span>Payment Gateways (eSewa / Khalti / Bank)</span>
          </button>

          <button
            onClick={() => navigate('#/admin/messages')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Check Inbox ({unreadMessages.length})</span>
          </button>
        </div>
      </div>

      {/* 3. RECENT ORDERS TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-500">Live order queue from store checkouts.</p>
          </div>
          <button
            onClick={() => navigate('#/admin/orders')}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Templates</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Method</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Proof Slip</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4">
                    <strong className="text-slate-800 dark:text-slate-200 block">{order.customerName}</strong>
                    <span className="text-[11px] text-slate-400">{order.customerEmail}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                      {order.items.map(i => i.templateTitle).join(', ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer ${
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedProofOrder(order)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-[11px]"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Slip</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'Paid')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition"
                      >
                        Approve
                      </button>
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
