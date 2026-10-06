import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiveDemoModal } from './components/LiveDemoModal';
import { Template } from './types';

// Public Pages
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { TemplateDetailPage } from './pages/TemplateDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SupportPage } from './pages/SupportPage';
import { AuthPages } from './pages/AuthPages';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTemplates } from './pages/admin/AdminTemplates';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPaymentSettings } from './pages/admin/AdminPaymentSettings';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminCustomers } from './pages/admin/AdminCustomers';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash || '#/';
  });

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!window.location.hash) {
      window.location.hash = '#/';
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  const handleOpenPreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  // Route parser
  const renderRoute = () => {
    const route = currentRoute.split('?')[0];

    // Admin Routes
    if (route.startsWith('#/admin')) {
      return (
        <AdminLayout currentRoute={route} navigate={navigate}>
          {route === '#/admin' && <AdminDashboard navigate={navigate} />}
          {route === '#/admin/templates' && <AdminTemplates navigate={navigate} onPreview={handleOpenPreview} />}
          {route === '#/admin/orders' && <AdminOrders />}
          {route === '#/admin/payments' && <AdminPaymentSettings />}
          {route === '#/admin/messages' && <AdminMessages />}
          {route === '#/admin/categories' && <AdminCategories />}
          {route === '#/admin/customers' && <AdminCustomers />}
        </AdminLayout>
      );
    }

    // Public Pages inside default storefront layout
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar currentRoute={currentRoute} navigate={navigate} />

        <main className="flex-1">
          {/* Home */}
          {(route === '#/' || route === '') && (
            <HomePage navigate={navigate} onPreview={handleOpenPreview} />
          )}

          {/* Templates Catalog */}
          {route === '#/templates' && (
            <TemplatesPage navigate={navigate} onPreview={handleOpenPreview} />
          )}

          {/* Template Detail */}
          {route.startsWith('#/templates/') && (
            <TemplateDetailPage
              templateId={route.replace('#/templates/', '')}
              navigate={navigate}
              onPreview={handleOpenPreview}
            />
          )}

          {/* Cart & Checkout */}
          {route === '#/cart' && <CartPage navigate={navigate} />}
          {route === '#/checkout' && <CheckoutPage navigate={navigate} />}
          {route === '#/order-success' && <OrderSuccessPage navigate={navigate} />}

          {/* Account */}
          {route === '#/account' && <AccountPage navigate={navigate} />}

          {/* Content Pages */}
          {route === '#/about' && <AboutPage navigate={navigate} />}
          {route === '#/contact' && <ContactPage />}
          {route === '#/support' && <SupportPage />}

          {/* Authentication */}
          {route === '#/login' && <AuthPages mode="login" navigate={navigate} />}
          {route === '#/register' && <AuthPages mode="register" navigate={navigate} />}
          {route === '#/forgot-password' && <AuthPages mode="forgot" navigate={navigate} />}
        </main>

        <Footer navigate={navigate} />
      </div>
    );
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            {renderRoute()}

            {/* Global Live Interactive Demo Modal */}
            <LiveDemoModal
              template={previewTemplate}
              onClose={handleClosePreview}
              navigate={navigate}
            />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
