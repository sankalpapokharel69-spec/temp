import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Package, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ShieldCheck, 
  Key, 
  LifeBuoy, 
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StorageService } from '../utils/storage';
import { Order, Template } from '../types';
import { generateTemplateZip, triggerDownload } from '../utils/zipGenerator';
import { PaymentProofModal } from '../components/PaymentProofModal';

interface AccountPageProps {
  navigate: (route: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { user, updateProfile } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'tickets'>('orders');
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Login Required</h2>
        <p className="text-xs text-slate-500">Please sign in to view your profile, order history, and template ZIP downloads.</p>
        <button
          onClick={() => navigate('#/login')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
        >
          Sign In to Your Account
        </button>
      </div>
    );
  }

  // Get orders belonging to this user or matching their email
  const allOrders = StorageService.getOrders();
  const userOrders = allOrders.filter(
    o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  // Get support tickets submitted by this user
  const allMessages = StorageService.getMessages();
  const userTickets = allMessages.filter(
    m => m.senderEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateProfile(nameInput.trim());
    success('Profile Updated', 'Your display name has been saved.');
  };

  const handleDownloadTemplate = async (templateId: string, orderStatus: Order['status']) => {
    if (orderStatus !== 'Paid' && orderStatus !== 'Completed') {
      error(
        'Payment Verification Pending',
        'Your template ZIP download will automatically unlock once admin verifies the payment receipt.'
      );
      return;
    }

    const template = StorageService.getTemplateById(templateId);
    if (!template) {
      error('Template Unavailable', 'The requested template could not be loaded.');
      return;
    }

    try {
      setDownloadingTemplateId(templateId);
      info('Generating Source Code ZIP...', 'Packaging HTML, CSS, JavaScript, and documentation.');
      
      const zipBlob = await generateTemplateZip(template);
      triggerDownload(zipBlob, `${template.slug || 'template'}-source-code.zip`);
      
      success('Download Started!', `${template.title} ZIP has been generated successfully.`);
    } catch (err: any) {
      error('Download Failed', err.message || 'Could not build template package.');
    } finally {
      setDownloadingTemplateId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner / User Avatar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=6366f1`}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Poppins']">
                {user.name}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={() => navigate('#/admin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition self-start sm:self-center"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Administrator Control Panel</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders & Downloads ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'tickets'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Support History ({userTickets.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                          #{order.id}
                        </span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Paid' || order.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : order.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()} via {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Total</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                          ${order.totalAmount}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedProofOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Slip</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Purchased Items */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Purchased Templates:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => {
                        const isUnlocked = order.status === 'Paid' || order.status === 'Completed';
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.templateTitle}
                              </h4>
                              <span className="text-[11px] text-slate-400">${item.price} • Commercial License</span>
                            </div>

                            <button
                              onClick={() => handleDownloadTemplate(item.templateId, order.status)}
                              disabled={downloadingTemplateId === item.templateId}
                              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                                isUnlocked
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              }`}
                              title={isUnlocked ? 'Download complete ZIP' : 'Awaiting payment verification'}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>
                                {downloadingTemplateId === item.templateId
                                  ? 'Packaging...'
                                  : isUnlocked
                                  ? 'Download ZIP'
                                  : 'Locked (Pending)'}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Verification Note for Pending Orders */}
                  {order.status === 'Pending' && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>
                        Payment reference <strong>{order.paymentRef || 'Submitted'}</strong> is under admin review. Once verified, download buttons turn green!
                      </span>
                    </div>
                  )}

                  {order.adminNotes && (
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-300">
                      <strong>Admin note:</strong> {order.adminNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Orders Found Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't purchased any templates yet. Browse our store to build your next client website.
              </p>
              <button
                onClick={() => navigate('#/templates')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
              >
                Browse Templates
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500">Update your account name and preferences.</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 text-xs sm:text-sm cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
              Your Support Messages & Inquiries
            </h3>
            <button
              onClick={() => navigate('#/support')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
            >
              Open New Ticket
            </button>
          </div>

          {userTickets.length > 0 ? (
            <div className="space-y-3">
              {userTickets.map(t => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white">{t.subject}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.status === 'read' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'bg-amber-100 dark:bg-amber-950 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Submitted on {new Date(t.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-400">
              No support tickets found for your account. Need help? Click 'Open New Ticket'.
            </div>
          )}
        </div>
      )}

      {/* Payment Proof Modal */}
      <PaymentProofModal
        order={selectedProofOrder}
        onClose={() => setSelectedProofOrder(null)}
      />

    </div>
  );
};
