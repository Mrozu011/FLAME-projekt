'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { securityService, SecuritySettings } from '@/lib/security-service';

export default function SecuritySettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    require2FA: true,
    autoBlock: true,
    emailAlerts: true,
    alertEmail: 'security@flamestore.com',
    rateLimits: {
      api: 60,
      checkout: 10,
      registration: 5
    },
    suspiciousActivityThresholds: {
      failedCheckouts: 3,
      cartManipulation: 2,
      orderVolume: 10,
      newUserOrderValue: 1000
    }
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const currentSettings = securityService.getSettings();
    setSettings(currentSettings);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      securityService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedSettingChange = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof SecuritySettings],
        [key]: value
      }
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <i className="ri-menu-line text-xl"></i>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Security Settings</h1>
            <div className="w-10"></div>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Security Settings</h1>
              <p className="text-gray-600">Configure security parameters and thresholds</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Login Security */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Login Security</h3>
                  <p className="text-sm text-gray-600">Configure login attempt limits and account lockout settings</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Login Attempts
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Number of failed attempts before account lockout</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1440"
                        value={settings.lockoutDuration}
                        onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">How long to lock out after failed attempts</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Require Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('require2FA', !settings.require2FA)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.require2FA ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                          settings.require2FA ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Rate Limiting */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Rate Limiting</h3>
                  <p className="text-sm text-gray-600">Configure API rate limits and request thresholds</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Requests per Minute
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={settings.rateLimits.api}
                        onChange={(e) => handleNestedSettingChange('rateLimits', 'api', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Checkout Attempts per Hour
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={settings.rateLimits.checkout}
                        onChange={(e) => handleNestedSettingChange('rateLimits', 'checkout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registrations per Hour
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.rateLimits.registration}
                        onChange={(e) => handleNestedSettingChange('rateLimits', 'registration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Suspicious Activity Detection */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Suspicious Activity Detection</h3>
                  <p className="text-sm text-gray-600">Configure thresholds for detecting suspicious behavior</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Failed Checkout Attempts
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={settings.suspiciousActivityThresholds.failedCheckouts}
                        onChange={(e) => handleNestedSettingChange('suspiciousActivityThresholds', 'failedCheckouts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Number of failed checkouts before flagging</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cart Manipulation Attempts
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={settings.suspiciousActivityThresholds.cartManipulation}
                        onChange={(e) => handleNestedSettingChange('suspiciousActivityThresholds', 'cartManipulation', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Suspicious cart modifications before flagging</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Volume Threshold
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={settings.suspiciousActivityThresholds.orderVolume}
                        onChange={(e) => handleNestedSettingChange('suspiciousActivityThresholds', 'orderVolume', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Orders per hour before flagging</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New User Order Value ($)
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="10000"
                        value={settings.suspiciousActivityThresholds.newUserOrderValue}
                        onChange={(e) => handleNestedSettingChange('suspiciousActivityThresholds', 'newUserOrderValue', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Order value threshold for new users</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Automated Actions</h3>
                  <p className="text-sm text-gray-600">Configure automatic responses to security threats</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Auto-Block Suspicious IPs</h4>
                      <p className="text-xs text-gray-500">Automatically block IPs that trigger security rules</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('autoBlock', !settings.autoBlock)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.autoBlock ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                          settings.autoBlock ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Security Alerts</h4>
                      <p className="text-xs text-gray-500">Send email notifications for critical security events</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('emailAlerts', !settings.emailAlerts)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.emailAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                          settings.emailAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.emailAlerts && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Alert Email
                      </label>
                      <input
                        type="email"
                        value={settings.alertEmail}
                        onChange={(e) => handleSettingChange('alertEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="security@flamestore.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email address to receive security alerts</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    saved ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </div>
                  ) : saved ? (
                    <div className="flex items-center">
                      <i className="ri-check-line mr-2"></i>
                      Saved!
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <i className="ri-save-line mr-2"></i>
                      Save Settings
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}