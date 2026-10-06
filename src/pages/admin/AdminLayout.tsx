import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingBag, 
  Users, 
  Mail, 
  FolderTree, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../utils/storage';

interface AdminLayoutProps {
  currentRoute: string;
  navigate: (route: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentRoute, navigate, children }) => {
  const { user, isAdmin, quickLoginAs } = useAuth();

  // If not admin, show access guard
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins']">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The WebCraft Studio administrator backoffice is restricted to accounts with role=admin.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
          <p className="font-bold mb-1">Administrator Privileges Required</p>
          <p className="text-slate-600 dark:text-slate-400">Please sign in with your authorized platform administrator credentials to unlock backoffice management.</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('#/login')}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
          >
            Go to Admin Sign In
          </button>
          <button
            onClick={() => navigate('#/')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Count unread messages for badge
  const unreadMessagesCount = StorageService.getMessages().filter(m => m.status === 'unread').length;
  const pendingOrdersCount = StorageService.getOrders().filter(o => o.status === 'Pending').length;

  const navItems = [
    { label: 'Dashboard', route: '#/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Templates Manager', route: '#/admin/templates', icon: <Layers className="w-4 h-4" /> },
    { 
      label: 'Orders Manager', 
      route: '#/admin/orders', 
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null 
    },
    { 
      label: 'Payment Gateway Details', 
      route: '#/admin/payments', 
      icon: <CreditCard className="w-4 h-4" /> 
    },
    { 
      label: 'Inbox & Tickets', 
      route: '#/admin/messages', 
      icon: <Mail className="w-4 h-4" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null 
    },
    { label: 'Categories Manager', route: '#/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { label: 'Customers List', route: '#/admin/customers', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('#/')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
            title="Return to Public Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WebCraft Backoffice</span>
            </span>
          </div>
        </div>

        {/* Admin user info */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden md:inline">Logged in as: <strong>{user?.name}</strong></span>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}&backgroundColor=6366f1`}
            alt={user?.name}
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
          />
        </div>
      </header>

      {/* Main Admin Body: Subnav + Content */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        
        {/* Horizontal Navigation Pills */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {navItems.map(item => {
            const isSelected = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Page Content */}
        <div className="w-full">
          {children}
        </div>

      </div>

    </div>
  );
};
