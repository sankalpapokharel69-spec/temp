import React, { useState } from 'react';
import { 
  CreditCard, 
  Upload, 
  Save, 
  RotateCcw, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Smartphone,
  Eye,
  Info
} from 'lucide-react';
import { StorageService, INITIAL_PAYMENT_SETTINGS } from '../../utils/storage';
import { PaymentSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminPaymentSettings: React.FC = () => {
  const { success, info } = useToast();
  const [settings, setSettings] = useState<PaymentSettings>(() => StorageService.getPaymentSettings());
  const [activeTab, setActiveTab] = useState<'esewa' | 'khalti' | 'bank'>('esewa');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.savePaymentSettings(settings);
    window.dispatchEvent(new Event('webcraft_payment_settings_updated'));
    success(
      'Payment Settings Saved!',
      'Your eSewa, Khalti, and Bank details are updated and live on the checkout page.'
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset payment settings to initial defaults?')) {
      setSettings(INITIAL_PAYMENT_SETTINGS);
      StorageService.savePaymentSettings(INITIAL_PAYMENT_SETTINGS);
      window.dispatchEvent(new Event('webcraft_payment_settings_updated'));
      info('Reset Complete', 'Default payment gateway settings restored.');
    }
  };

  const handleQrUpload = (method: 'esewa' | 'khalti' | 'bank', file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setSettings(prev => ({
        ...prev,
        [method]: {
          ...prev[method],
          qrUrl: dataUrl,
        },
      }));
      success('QR Screenshot Uploaded', `Custom QR image set for ${method.toUpperCase()}.`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">
              Payment Gateway & QR Details
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Checkout Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your merchant receiver accounts for eSewa, Khalti, and Direct Bank Transfer QR.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('esewa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'esewa'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>eSewa Wallet & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('khalti')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'khalti'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Khalti Wallet & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'bank'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Bank Transfer & Fonepay</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Settings Form (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          
          {/* TAB 1: ESEWA */}
          {activeTab === 'esewa' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    eS
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    eSewa Merchant Details
                  </h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.esewa.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      esewa: { ...settings.esewa, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Enable eSewa in Checkout</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    eSewa ID / Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.esewa.id}
                    onChange={(e) => setSettings({
                      ...settings,
                      esewa: { ...settings.esewa, id: e.target.value }
                    })}
                    placeholder="e.g. 9801234567 or merchant@esewa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Account / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.esewa.accountName}
                    onChange={(e) => setSettings({
                      ...settings,
                      esewa: { ...settings.esewa, accountName: e.target.value }
                    })}
                    placeholder="e.g. WebCraft Studio Pvt. Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  eSewa QR Image URL or Upload Custom QR
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.esewa.qrUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      esewa: { ...settings.esewa, qrUrl: e.target.value }
                    })}
                    placeholder="https://api.qrserver.com/... or paste image URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQrUpload('esewa', e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Payment Instructions for Customer
                </label>
                <textarea
                  rows={3}
                  value={settings.esewa.instructions}
                  onChange={(e) => setSettings({
                    ...settings,
                    esewa: { ...settings.esewa, instructions: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 2: KHALTI */}
          {activeTab === 'khalti' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-bold text-sm">
                    Kh
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Khalti Digital Wallet Details
                  </h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.khalti.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      khalti: { ...settings.khalti, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Enable Khalti in Checkout</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Khalti ID / Registered Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.khalti.id}
                    onChange={(e) => setSettings({
                      ...settings,
                      khalti: { ...settings.khalti, id: e.target.value }
                    })}
                    placeholder="e.g. 9801234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Account / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.khalti.accountName}
                    onChange={(e) => setSettings({
                      ...settings,
                      khalti: { ...settings.khalti, accountName: e.target.value }
                    })}
                    placeholder="e.g. WebCraft Studio Nepal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Khalti QR Image URL or Upload Custom QR
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.khalti.qrUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      khalti: { ...settings.khalti, qrUrl: e.target.value }
                    })}
                    placeholder="Paste Khalti QR URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQrUpload('khalti', e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Payment Instructions for Customer
                </label>
                <textarea
                  rows={3}
                  value={settings.khalti.instructions}
                  onChange={(e) => setSettings({
                    ...settings,
                    khalti: { ...settings.khalti, instructions: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 3: BANK DETAILS */}
          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-bold text-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Direct Bank Transfer & Fonepay QR
                  </h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.bank.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank: { ...settings.bank, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Enable Bank in Checkout</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.bank.bankName}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank: { ...settings.bank, bankName: e.target.value }
                    })}
                    placeholder="e.g. Nabil Bank Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.bank.accountName}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank: { ...settings.bank, accountName: e.target.value }
                    })}
                    placeholder="e.g. WebCraft Studio Pvt. Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.bank.accountNumber}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank: { ...settings.bank, accountNumber: e.target.value }
                    })}
                    placeholder="e.g. 01201017500123"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Branch / SWIFT Code
                  </label>
                  <input
                    type="text"
                    value={settings.bank.branch}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank: { ...settings.bank, branch: e.target.value }
                    })}
                    placeholder="e.g. Kathmandu Branch (SWIFT: NARBNPKA)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Fonepay / Bank QR Code Image URL or Screenshot
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.bank.qrUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank: { ...settings.bank, qrUrl: e.target.value }
                    })}
                    placeholder="Paste Fonepay / Bank QR Image URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQrUpload('bank', e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Payment Instructions for Customer
                </label>
                <textarea
                  rows={3}
                  value={settings.bank.instructions}
                  onChange={(e) => setSettings({
                    ...settings,
                    bank: { ...settings.bank, instructions: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* Submit Save Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Changes take effect immediately across all customer checkout sessions.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Settings</span>
            </button>
          </div>

        </div>

        {/* Right: Live Customer Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4 sticky top-24">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Customer Checkout Preview</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-600">
                {activeTab.toUpperCase()}
              </span>
            </div>

            {/* Live QR Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="bg-white p-3 rounded-xl shadow-sm inline-block border border-slate-200">
                <img
                  src={settings[activeTab].qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=webcraft'}
                  alt="QR Preview"
                  className="w-36 h-36 mx-auto object-contain rounded-lg"
                />
              </div>

              <div className="text-xs space-y-1">
                {activeTab === 'bank' ? (
                  <>
                    <strong className="block text-slate-900 dark:text-white text-sm">
                      {settings.bank.bankName}
                    </strong>
                    <span className="text-slate-500 block">
                      A/C: <code className="font-mono font-bold text-slate-800 dark:text-slate-200">{settings.bank.accountNumber}</code>
                    </span>
                    <span className="text-[11px] text-slate-400 block">{settings.bank.accountName}</span>
                  </>
                ) : (
                  <>
                    <strong className="block text-slate-900 dark:text-white text-sm">
                      {activeTab === 'esewa' ? 'eSewa' : 'Khalti'} ID:
                    </strong>
                    <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                      {settings[activeTab].id}
                    </code>
                    <span className="text-[11px] text-slate-400 block">{settings[activeTab].accountName}</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 text-[11px] text-indigo-900 dark:text-indigo-300 leading-relaxed">
              <Info className="w-3.5 h-3.5 inline mr-1 text-indigo-600" />
              Customers scanning this QR code in checkout will see your exact business credentials and pay directly into your account.
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
