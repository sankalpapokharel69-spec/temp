import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Copy, 
  Check, 
  ArrowLeft,
  Sparkles,
  Lock,
  Globe,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { StorageService, CURRENCY_LIST } from '../utils/storage';
import { PaymentMethod, PaymentSettings, CurrencyCode } from '../types';

interface CheckoutPageProps {
  navigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const { success, error, info } = useToast();

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => StorageService.getPaymentSettings());
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('NPR');

  // Listen for admin updates to payment settings
  useEffect(() => {
    const handleSettingsUpdate = () => {
      setPaymentSettings(StorageService.getPaymentSettings());
    };
    window.addEventListener('webcraft_payment_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('webcraft_payment_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+977 ');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Pick initially enabled method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() => {
    const initial = StorageService.getPaymentSettings();
    if (initial.esewa?.enabled) return 'esewa';
    if (initial.khalti?.enabled) return 'khalti';
    if (initial.bank?.enabled) return 'bank_qr';
    return 'esewa';
  });

  // Automatically adjust if selected method gets disabled by admin
  useEffect(() => {
    if (paymentMethod === 'esewa' && !paymentSettings.esewa?.enabled) {
      if (paymentSettings.khalti?.enabled) setPaymentMethod('khalti');
      else if (paymentSettings.bank?.enabled) setPaymentMethod('bank_qr');
    } else if (paymentMethod === 'khalti' && !paymentSettings.khalti?.enabled) {
      if (paymentSettings.esewa?.enabled) setPaymentMethod('esewa');
      else if (paymentSettings.bank?.enabled) setPaymentMethod('bank_qr');
    } else if (paymentMethod === 'bank_qr' && !paymentSettings.bank?.enabled) {
      if (paymentSettings.esewa?.enabled) setPaymentMethod('esewa');
      else if (paymentSettings.khalti?.enabled) setPaymentMethod('khalti');
    }
  }, [paymentSettings, paymentMethod]);

  const [paymentRef, setPaymentRef] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Currency calculations
  const currentRate = paymentSettings.exchangeRates?.[selectedCurrency] || 1;
  const convertedTotal = Number((total * currentRate).toFixed(selectedCurrency === 'JPY' ? 0 : 2));
  const currencyInfo = CURRENCY_LIST.find(c => c.code === selectedCurrency) || CURRENCY_LIST[0];

  // Specific Nepali Rupee (NPR) calculation for local wallets
  const nprRate = paymentSettings.exchangeRates?.['NPR'] || 134.50;
  const nprTotal = Number((total * nprRate).toFixed(2));

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-2">Please add a template to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('#/templates')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          Browse Templates
        </button>
      </div>
    );
  }

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      info('Copied!', `${text} copied to clipboard.`);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('File Too Large', 'Please upload a receipt screenshot under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofUrl(reader.result as string);
        success('Receipt Uploaded', 'Payment screenshot proof attached successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      error('Missing Information', 'Please provide your full name and valid email address.');
      return;
    }
    if (!paymentRef.trim() && !paymentProofUrl) {
      error('Proof Required', 'Please either enter your Transaction Reference ID or upload a screenshot slip.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        templateId: item.template.id,
        templateTitle: item.template.title,
        price: item.template.price,
        thumbnailUrl: item.template.thumbnailUrl,
        category: item.template.categoryId,
      }));

      const newOrder = StorageService.createOrder({
        userId: user ? user.id : 'usr_guest_' + Date.now().toString(36),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        totalAmount: total,
        currency: selectedCurrency,
        convertedAmount: convertedTotal,
        conversionRate: currentRate,
        status: 'Pending',
        paymentMethod,
        paymentProofUrl: paymentProofUrl || '',
        paymentRef: paymentRef.trim(),
        notes: orderNotes.trim(),
        items: orderItems,
      });

      // Clear the cart
      clearCart();
      success('Order Placed Successfully!', `Order #${newOrder.id} has been received.`);
      
      // Navigate to order confirmation
      navigate(`#/order-success?orderId=${newOrder.id}`);
    } catch (err: any) {
      error('Submission Error', err.message || 'Failed to submit order. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('#/cart')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
            Checkout & Payment Instructions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete your purchase using our verified local digital wallets or bank QR payment.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <Lock className="w-4 h-4" />
          <span>256-Bit Encrypted Order</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Customer details & Payment Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Customer Information */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
              1. Customer & Delivery Contact
            </h3>
            <p className="text-xs text-slate-500">
              The template ZIP download link and order invoice will be linked to this email address.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+977 9800000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Project Notes (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Need assistance with setup or custom license"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                2. Select Payment Method
              </h3>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Amount: ${total} USD
              </span>
            </div>

            {/* Multi-Country Currency Converter */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-blue-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Multi-Country Price Converter
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      View and pay in your local currency: {currencyInfo.name} ({currencyInfo.code})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-400">Live Rate:</span>
                  <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    1 USD = {currentRate} {selectedCurrency}
                  </span>
                </div>
              </div>

              {/* Currency Select Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CURRENCY_LIST.map((curr) => {
                  const isSelected = selectedCurrency === curr.code;
                  return (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setSelectedCurrency(curr.code)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </button>
                  );
                })}
              </div>

              {/* Display Converted Total */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-950 text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Converted Payable Total:
                </span>
                <span className="font-extrabold text-sm sm:text-base text-indigo-600 dark:text-indigo-400 font-mono">
                  {currencyInfo.symbol} {convertedTotal.toLocaleString()} {currencyInfo.code}
                  {selectedCurrency !== 'USD' && (
                    <span className="text-[11px] font-normal text-slate-400 ml-1.5">
                      (${total} USD)
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Methods Tabs */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                disabled={!paymentSettings.esewa?.enabled}
                onClick={() => setPaymentMethod('esewa')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition ${
                  !paymentSettings.esewa?.enabled
                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800'
                    : paymentMethod === 'esewa'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-emerald-600">eSewa</span>
                  {!paymentSettings.esewa?.enabled && <span className="text-[9px] text-slate-400 font-semibold">(Off)</span>}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">Wallet / QR</span>
              </button>

              <button
                type="button"
                disabled={!paymentSettings.khalti?.enabled}
                onClick={() => setPaymentMethod('khalti')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition ${
                  !paymentSettings.khalti?.enabled
                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800'
                    : paymentMethod === 'khalti'
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-100 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-purple-600">Khalti</span>
                  {!paymentSettings.khalti?.enabled && <span className="text-[9px] text-slate-400 font-semibold">(Off)</span>}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">Wallet / QR</span>
              </button>

              <button
                type="button"
                disabled={!paymentSettings.bank?.enabled}
                onClick={() => setPaymentMethod('bank_qr')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition ${
                  !paymentSettings.bank?.enabled
                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800'
                    : paymentMethod === 'bank_qr'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-blue-600">Bank QR</span>
                  {!paymentSettings.bank?.enabled && <span className="text-[9px] text-slate-400 font-semibold">(Off)</span>}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">Direct Transfer</span>
              </button>
            </div>

            {/* Dynamic Payment QR & Details Box */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              
              {paymentMethod === 'esewa' && (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Visual QR Code Generator */}
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 shrink-0 text-center">
                    <img
                      src={paymentSettings.esewa.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=esewa:${paymentSettings.esewa.id}?amount=`}
                      alt="eSewa QR Code"
                      className="w-36 h-36 mx-auto rounded-lg object-contain"
                    />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mt-1.5">
                      Scan via eSewa App
                    </span>
                  </div>

                  <div className="space-y-2 text-xs flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      eSewa Transfer Details
                    </h4>
                    <p className="text-slate-500 leading-relaxed">
                      {paymentSettings.esewa.instructions || '1. Open your eSewa app and scan the QR code, or transfer directly to the eSewa ID below.'}
                    </p>

                    {/* Exact Payable Amount in Nepali Rupees */}
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold block">
                          Amount to Send via eSewa (NPR):
                        </span>
                        <strong className="text-emerald-900 dark:text-emerald-100 font-mono text-sm sm:text-base">
                          रू {nprTotal.toLocaleString()} NPR
                        </strong>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          (${total} USD @ 1 USD = {nprRate} NPR)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(nprTotal.toString(), 'esewa_amt')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition"
                        title="Copy exact amount in NPR"
                      >
                        {copiedKey === 'esewa_amt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'esewa_amt' ? 'Copied' : 'Copy NPR'}</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">eSewa ID:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs">
                          {paymentSettings.esewa.id}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentSettings.esewa.id, 'esewa_id')}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                        title="Copy eSewa ID"
                      >
                        {copiedKey === 'esewa_id' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Name:</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs">
                          {paymentSettings.esewa.accountName}
                        </strong>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">Verified Merchant</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'khalti' && (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 shrink-0 text-center">
                    <img
                      src={paymentSettings.khalti.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=khalti:${paymentSettings.khalti.id}?amount=`}
                      alt="Khalti QR Code"
                      className="w-36 h-36 mx-auto rounded-lg object-contain"
                    />
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mt-1.5">
                      Scan via Khalti App
                    </span>
                  </div>

                  <div className="space-y-2 text-xs flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Khalti Digital Wallet Details
                    </h4>
                    <p className="text-slate-500 leading-relaxed">
                      {paymentSettings.khalti.instructions || '1. Open your Khalti app, tap Scan & Pay, or send funds directly to the registered ID below.'}
                    </p>

                    {/* Exact Payable Amount in Nepali Rupees */}
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-purple-800 dark:text-purple-300 font-semibold block">
                          Amount to Send via Khalti (NPR):
                        </span>
                        <strong className="text-purple-900 dark:text-purple-100 font-mono text-sm sm:text-base">
                          रू {nprTotal.toLocaleString()} NPR
                        </strong>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 block mt-0.5">
                          (${total} USD @ 1 USD = {nprRate} NPR)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(nprTotal.toString(), 'khalti_amt')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-xs transition"
                        title="Copy exact amount in NPR"
                      >
                        {copiedKey === 'khalti_amt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'khalti_amt' ? 'Copied' : 'Copy NPR'}</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Khalti ID:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs">
                          {paymentSettings.khalti.id}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentSettings.khalti.id, 'khalti_id')}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                      >
                        {copiedKey === 'khalti_id' ? <Check className="w-4 h-4 text-purple-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Name:</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs">
                          {paymentSettings.khalti.accountName}
                        </strong>
                      </div>
                      <span className="text-[10px] font-bold text-purple-600">Verified Khalti</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_qr' && (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 shrink-0 text-center">
                    <img
                      src={paymentSettings.bank.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=fonespay:bank_transfer_webcraft_studio'}
                      alt="Bank Fonepay QR Code"
                      className="w-36 h-36 mx-auto rounded-lg object-contain"
                    />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mt-1.5">
                      Fonepay / Mobile Banking QR
                    </span>
                  </div>

                  <div className="space-y-2 text-xs flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Direct Bank Wire / Mobile Banking
                    </h4>
                    <p className="text-slate-500 leading-relaxed">
                      {paymentSettings.bank.instructions || 'Scan using any mobile banking app or deposit directly to:'}
                    </p>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Bank Name:</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs">{paymentSettings.bank.bankName}</strong>
                      </div>
                      {paymentSettings.bank.branch && (
                        <span className="text-[10px] text-slate-400">{paymentSettings.bank.branch}</span>
                      )}
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Number:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs">
                          {paymentSettings.bank.accountNumber}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentSettings.bank.accountNumber, 'ac_num')}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                      >
                        {copiedKey === 'ac_num' ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Holder:</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs">
                          {paymentSettings.bank.accountName}
                        </strong>
                      </div>
                      {paymentSettings.bank.swiftCode && (
                        <span className="text-[10px] font-mono text-slate-400">SWIFT: {paymentSettings.bank.swiftCode}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* 3. Transaction Proof & Reference Input */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                3. Upload Proof & Transaction Reference
              </h4>
              <p className="text-xs text-slate-500">
                After completing the transfer in your payment app, upload the screenshot slip or enter your transaction reference number.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Transaction Reference ID / Number *
                </label>
                <input
                  type="text"
                  required
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. ESW-9988221, KHLT-102938, or Bank Voucher #"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Attach Screenshot of Payment Slip (Optional but accelerates approval)
                </label>

                {paymentProofUrl ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={paymentProofUrl}
                        alt="Proof preview"
                        className="w-16 h-12 object-cover rounded-lg border border-emerald-300"
                      />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          Payment Slip Attached
                        </span>
                        <span className="text-[11px] text-emerald-600 block">Screenshot ready for admin verification</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPaymentProofUrl('')}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Click to upload payment receipt screenshot
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, or JPEG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Checkout Summary & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6 sticky top-24">
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
              Order Summary ({cart.length} Templates)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ template }) => (
                <div key={template.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <img
                      src={template.thumbnailUrl}
                      alt={template.title}
                      className="w-10 h-8 rounded-lg object-cover shrink-0"
                    />
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {template.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 shrink-0">
                    ${template.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Total box */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold block">
                  Total Payable Amount
                </span>
                <span className="text-[11px] text-slate-400">All taxes & lifetime updates included</span>
              </div>
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                ${total}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Submit Order & Payment Proof</span>
                </>
              )}
            </button>

            {/* Workflow Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>How Verification Works:</span>
              </div>
              <p>
                1. Once you submit, our administration team confirms the payment proof with the bank/wallet record.
              </p>
              <p>
                2. As soon as the order status changes to <strong>Paid</strong>, you can instantly download the template ZIP file from your <strong>My Account</strong> dashboard!
              </p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
