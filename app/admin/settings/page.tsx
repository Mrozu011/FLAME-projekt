'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAdminTranslation } from '@/hooks/useAdminTranslation';
import { AdminTranslationProvider } from '@/hooks/useAdminTranslation';

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  currency: string;
  timezone: string;
  language: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  shippingFee: number;
  freeShippingMinimum: number;
}

interface AliExpressSettings {
  apiKey: string;
  apiSecret: string;
  connected: boolean;
  autoSync: boolean;
  syncInterval: number;
  priceMultiplier: number;
  categoryMapping: Record<string, string>;
  autoPublish: boolean;
  minimumRating: number;
  minimumStock: number;
}

interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableNotifications: boolean;
}

interface SecuritySettings {
  enableTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requirePasswordSpecialChars: boolean;
  enableCaptcha: boolean;
  ipWhitelist: string[];
}

function SettingsContent() {
  const { t } = useAdminTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Flame Store',
    storeDescription: 'Premium fashion and lifestyle products',
    currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    address: '123 Fashion Street, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@flamestore.com',
    taxRate: 8.5,
    shippingFee: 5.99,
    freeShippingMinimum: 75
  });

  const [aliExpressSettings, setAliExpressSettings] = useState<AliExpressSettings>({
    apiKey: '',
    apiSecret: '',
    connected: false,
    autoSync: true,
    syncInterval: 24,
    priceMultiplier: 1.5,
    categoryMapping: {
      'Women\'s Clothing': 'women',
      'Men\'s Clothing': 'men',
      'Electronics': 'electronics',
      'Home & Garden': 'lifestyle',
      'Jewelry': 'accessories'
    },
    autoPublish: false,
    minimumRating: 4.0,
    minimumStock: 10
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@flamestore.com',
    fromName: 'Flame Store',
    enableNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enableTwoFactor: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requirePasswordSpecialChars: true,
    enableCaptcha: false,
    ipWhitelist: []
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, load from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load saved settings from localStorage or API
      const savedStoreSettings = localStorage.getItem('storeSettings');
      if (savedStoreSettings) {
        setStoreSettings(JSON.parse(savedStoreSettings));
      }

      const savedAliExpressSettings = localStorage.getItem('aliExpressSettings');
      if (savedAliExpressSettings) {
        setAliExpressSettings(JSON.parse(savedAliExpressSettings));
      }

      const savedEmailSettings = localStorage.getItem('emailSettings');
      if (savedEmailSettings) {
        setEmailSettings(JSON.parse(savedEmailSettings));
      }

      const savedSecuritySettings = localStorage.getItem('securitySettings');
      if (savedSecuritySettings) {
        setSecuritySettings(JSON.parse(savedSecuritySettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (settingsType: string, data: any) => {
    setIsSaving(true);
    try {
      // Save to localStorage (in real app, save to API)
      localStorage.setItem(settingsType, JSON.stringify(data));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`${settingsType} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStoreSettingsSave = () => {
    saveSettings('storeSettings', storeSettings);
  };

  const handleAliExpressSave = () => {
    saveSettings('aliExpressSettings', aliExpressSettings);
  };

  const handleEmailSettingsSave = () => {
    saveSettings('emailSettings', emailSettings);
  };

  const handleSecuritySettingsSave = () => {
    saveSettings('securitySettings', securitySettings);
  };

  const testAliExpressConnection = async () => {
    if (!aliExpressSettings.apiKey || !aliExpressSettings.apiSecret) {
      alert('Please enter both API Key and API Secret');
      return;
    }

    setIsLoading(true);
    try {
      // Test connection (simulate API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setAliExpressSettings(prev => ({ ...prev, connected: true }));
      alert('AliExpress connection successful!');
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('Connection test failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async () => {
    if (!emailSettings.smtpServer || !emailSettings.smtpUsername) {
      alert('Please enter SMTP server and username');
      return;
    }

    setIsLoading(true);
    try {
      // Test email connection (simulate)
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Email connection test successful!');
    } catch (error) {
      console.error('Email test failed:', error);
      alert('Email test failed. Please check your settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: t('settings.general'), icon: 'ri-settings-3-line' },
    { id: 'aliexpress', name: 'AliExpress API', icon: 'ri-store-3-line' },
    { id: 'email', name: t('settings.email'), icon: 'ri-mail-line' },
    { id: 'security', name: t('settings.security'), icon: 'ri-shield-check-line' },
    { id: 'backup', name: t('settings.backup'), icon: 'ri-database-line' }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('navigation.settings')}</h1>
                <p className="text-gray-600">{t('settings.subtitle')}</p>
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <i className="ri-external-link-line"></i>
              <span>{t('settings.viewStore')}</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} text-lg`}></i>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('settings.general')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.storeName')}
                        </label>
                        <input
                          type="text"
                          value={storeSettings.storeName}
                          onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.currency')}
                        </label>
                        <select
                          value={storeSettings.currency}
                          onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="PLN">PLN - Polish Zloty</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.storeDescription')}
                        </label>
                        <textarea
                          value={storeSettings.storeDescription}
                          onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={500}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.timezone')}
                        </label>
                        <select
                          value={storeSettings.timezone}
                          onChange={(e) => setStoreSettings({...storeSettings, timezone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Warsaw">Warsaw</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.taxRate')}
                        </label>
                        <input
                          type="number"
                          value={storeSettings.taxRate}
                          onChange={(e) => setStoreSettings({...storeSettings, taxRate: parseFloat(e.target.value)})}
                          step="0.1"
                          min="0"
                          max="50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.contactInfo')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.address')}
                        </label>
                        <textarea
                          value={storeSettings.address}
                          onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={500}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.phone')}
                        </label>
                        <input
                          type="tel"
                          value={storeSettings.phone}
                          onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.email')}
                        </label>
                        <input
                          type="email"
                          value={storeSettings.email}
                          onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.shipping')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.shippingFee')}
                        </label>
                        <input
                          type="number"
                          value={storeSettings.shippingFee}
                          onChange={(e) => setStoreSettings({...storeSettings, shippingFee: parseFloat(e.target.value)})}
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('settings.freeShippingMinimum')}
                        </label>
                        <input
                          type="number"
                          value={storeSettings.freeShippingMinimum}
                          onChange={(e) => setStoreSettings({...storeSettings, freeShippingMinimum: parseFloat(e.target.value)})}
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleStoreSettingsSave}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                    >
                      {isSaving ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          <span>{t('common.saving')}</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-save-line"></i>
                          <span>{t('common.save')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* AliExpress Settings */}
              {activeTab === 'aliexpress' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">AliExpress API Integration</h2>
                      <p className="text-gray-600 mt-1">Connect your AliExpress API to import products automatically</p>
                    </div>
                    {aliExpressSettings.connected && (
                      <div className="flex items-center text-green-600">
                        <i className="ri-check-circle-line mr-2"></i>
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="text"
                        value={aliExpressSettings.apiKey}
                        onChange={(e) => setAliExpressSettings({...aliExpressSettings, apiKey: e.target.value})}
                        placeholder="Enter your AliExpress API Key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Secret
                      </label>
                      <input
                        type="password"
                        value={aliExpressSettings.apiSecret}
                        onChange={(e) => setAliExpressSettings({...aliExpressSettings, apiSecret: e.target.value})}
                        placeholder="Enter your AliExpress API Secret"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={testAliExpressConnection}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                    >
                      {isLoading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-check-line"></i>
                          <span>Test Connection</span>
                        </>
                      )}
                    </button>
                    <Link
                      href="/admin/dropshipping"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                      <i className="ri-download-line"></i>
                      <span>Import Products</span>
                    </Link>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Multiplier
                        </label>
                        <input
                          type="number"
                          value={aliExpressSettings.priceMultiplier}
                          onChange={(e) => setAliExpressSettings({...aliExpressSettings, priceMultiplier: parseFloat(e.target.value)})}
                          step="0.1"
                          min="1"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Multiply AliExpress prices by this factor</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Rating
                        </label>
                        <input
                          type="number"
                          value={aliExpressSettings.minimumRating}
                          onChange={(e) => setAliExpressSettings({...aliExpressSettings, minimumRating: parseFloat(e.target.value)})}
                          step="0.1"
                          min="1"
                          max="5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Stock
                        </label>
                        <input
                          type="number"
                          value={aliExpressSettings.minimumStock}
                          onChange={(e) => setAliExpressSettings({...aliExpressSettings, minimumStock: parseInt(e.target.value)})}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sync Interval (hours)
                        </label>
                        <select
                          value={aliExpressSettings.syncInterval}
                          onChange={(e) => setAliExpressSettings({...aliExpressSettings, syncInterval: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                        >
                          <option value={6}>Every 6 hours</option>
                          <option value={12}>Every 12 hours</option>
                          <option value={24}>Daily</option>
                          <option value={72}>Every 3 days</option>
                          <option value={168}>Weekly</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={aliExpressSettings.autoSync}
                          onChange={(e) => setAliExpressSettings({...aliExpressSettings, autoSync: e.target.checked})}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Auto-sync inventory and prices</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={aliExpressSettings.autoPublish}
                          onChange={(e) => setAliExpressSettings({...aliExpressSettings, autoPublish: e.target.checked})}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Auto-publish imported products</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleAliExpressSave}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                    >
                      {isSaving ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          <span>{t('common.saving')}</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-save-line"></i>
                          <span>{t('common.save')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('settings.email')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Server
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpServer}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={emailSettings.smtpPort}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpUsername}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={emailSettings.smtpPassword}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={emailSettings.fromName}
                          onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={emailSettings.enableNotifications}
                        onChange={(e) => setEmailSettings({...emailSettings, enableNotifications: e.target.checked})}
                        className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Enable email notifications</span>
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={testEmailConnection}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                    >
                      {isLoading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-mail-check-line"></i>
                          <span>Test Email</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleEmailSettingsSave}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                    >
                      {isSaving ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          <span>{t('common.saving')}</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-save-line"></i>
                          <span>{t('common.save')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('settings.security')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                          min="5"
                          max="480"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                          min="3"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Minimum Length
                        </label>
                        <input
                          type="number"
                          value={securitySettings.passwordMinLength}
                          onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                          min="6"
                          max="20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securitySettings.enableTwoFactor}
                          onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securitySettings.requirePasswordSpecialChars}
                          onChange={(e) => setSecuritySettings({...securitySettings, requirePasswordSpecialChars: e.target.checked})}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Require special characters in passwords</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securitySettings.enableCaptcha}
                          onChange={(e) => setSecuritySettings({...securitySettings, enableCaptcha: e.target.checked})}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Enable CAPTCHA on login</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSecuritySettingsSave}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                    >
                      {isSaving ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          <span>{t('common.saving')}</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-save-line"></i>
                          <span>{t('common.save')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('settings.backup')}</h2>
                    <p className="text-gray-600 mb-6">Manage your store data backups and exports</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Automatic Backups</h3>
                        <p className="text-gray-600 text-sm mb-4">Schedule regular backups of your store data</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                          Configure Auto Backup
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Manual Backup</h3>
                        <p className="text-gray-600 text-sm mb-4">Create an immediate backup of all data</p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
                          Create Backup Now
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Export Data</h3>
                        <p className="text-gray-600 text-sm mb-4">Export products, orders, or customer data</p>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                          Export Data
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Restore Data</h3>
                        <p className="text-gray-600 text-sm mb-4">Restore from a previous backup</p>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap">
                          Restore Backup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminTranslationProvider>
      <SettingsContent />
    </AdminTranslationProvider>
  );
}