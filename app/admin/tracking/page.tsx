'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { trackingService } from '@/lib/tracking-service';

interface TrackingSettings {
  googleAnalytics: {
    enabled: boolean;
    trackingId: string;
    measurementId: string;
    status: 'success' | 'error' | 'pending' | 'inactive';
    lastUpdated?: string;
  };
  facebookPixel: {
    enabled: boolean;
    pixelId: string;
    accessToken?: string;
    status: 'success' | 'error' | 'pending' | 'inactive';
    lastUpdated?: string;
  };
  tiktokPixel: {
    enabled: boolean;
    pixelId: string;
    accessToken?: string;
    status: 'success' | 'error' | 'pending' | 'inactive';
    lastUpdated?: string;
  };
  events: {
    pageView: boolean;
    addToCart: boolean;
    purchase: boolean;
    beginCheckout: boolean;
    search: boolean;
    viewContent: boolean;
    addToWishlist: boolean;
    signUp: boolean;
    login: boolean;
  };
}

export default function TrackingPage() {
  const [settings, setSettings] = useState<TrackingSettings>({
    googleAnalytics: {
      enabled: false,
      trackingId: '',
      measurementId: '',
      status: 'inactive'
    },
    facebookPixel: {
      enabled: false,
      pixelId: '',
      status: 'inactive'
    },
    tiktokPixel: {
      enabled: false,
      pixelId: '',
      status: 'inactive'
    },
    events: {
      pageView: true,
      addToCart: true,
      purchase: true,
      beginCheckout: true,
      search: true,
      viewContent: true,
      addToWishlist: true,
      signUp: true,
      login: true
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [activeTab, setActiveTab] = useState('google-analytics');
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const savedSettings = await trackingService.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading tracking settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus(null);
      
      // Validate settings
      if (settings.googleAnalytics.enabled && !settings.googleAnalytics.trackingId) {
        throw new Error('Google Analytics tracking ID is required');
      }
      
      if (settings.facebookPixel.enabled && !settings.facebookPixel.pixelId) {
        throw new Error('Facebook Pixel ID is required');
      }
      
      if (settings.tiktokPixel.enabled && !settings.tiktokPixel.pixelId) {
        throw new Error('TikTok Pixel ID is required');
      }

      // Update status to pending for enabled platforms
      const updatedSettings = { ...settings };
      if (updatedSettings.googleAnalytics.enabled) {
        updatedSettings.googleAnalytics.status = 'pending';
      }
      if (updatedSettings.facebookPixel.enabled) {
        updatedSettings.facebookPixel.status = 'pending';
      }
      if (updatedSettings.tiktokPixel.enabled) {
        updatedSettings.tiktokPixel.status = 'pending';
      }

      await trackingService.saveSettings(updatedSettings);
      
      // Test connections
      await testConnections();
      
      setSaveStatus('success');
      
      // Update last updated timestamps
      const now = new Date().toISOString();
      if (settings.googleAnalytics.enabled) {
        updatedSettings.googleAnalytics.lastUpdated = now;
      }
      if (settings.facebookPixel.enabled) {
        updatedSettings.facebookPixel.lastUpdated = now;
      }
      if (settings.tiktokPixel.enabled) {
        updatedSettings.tiktokPixel.lastUpdated = now;
      }
      
      setSettings(updatedSettings);
      
    } catch (error) {
      console.error('Error saving tracking settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnections = async () => {
    const results: {[key: string]: any} = {};
    
    if (settings.googleAnalytics.enabled) {
      try {
        const gaResult = await trackingService.testGoogleAnalytics(settings.googleAnalytics.trackingId);
        results.googleAnalytics = gaResult;
        setSettings(prev => ({
          ...prev,
          googleAnalytics: {
            ...prev.googleAnalytics,
            status: gaResult.success ? 'success' : 'error'
          }
        }));
      } catch (error) {
        results.googleAnalytics = { success: false, error: error.message };
        setSettings(prev => ({
          ...prev,
          googleAnalytics: {
            ...prev.googleAnalytics,
            status: 'error'
          }
        }));
      }
    }

    if (settings.facebookPixel.enabled) {
      try {
        const fbResult = await trackingService.testFacebookPixel(settings.facebookPixel.pixelId);
        results.facebookPixel = fbResult;
        setSettings(prev => ({
          ...prev,
          facebookPixel: {
            ...prev.facebookPixel,
            status: fbResult.success ? 'success' : 'error'
          }
        }));
      } catch (error) {
        results.facebookPixel = { success: false, error: error.message };
        setSettings(prev => ({
          ...prev,
          facebookPixel: {
            ...prev.facebookPixel,
            status: 'error'
          }
        }));
      }
    }

    if (settings.tiktokPixel.enabled) {
      try {
        const tiktokResult = await trackingService.testTikTokPixel(settings.tiktokPixel.pixelId);
        results.tiktokPixel = tiktokResult;
        setSettings(prev => ({
          ...prev,
          tiktokPixel: {
            ...prev.tiktokPixel,
            status: tiktokResult.success ? 'success' : 'error'
          }
        }));
      } catch (error) {
        results.tiktokPixel = { success: false, error: error.message };
        setSettings(prev => ({
          ...prev,
          tiktokPixel: {
            ...prev.tiktokPixel,
            status: 'error'
          }
        }));
      }
    }

    setTestResults(results);
  };

  const handleTestConnection = async (platform: string) => {
    try {
      let result;
      
      switch (platform) {
        case 'google-analytics':
          result = await trackingService.testGoogleAnalytics(settings.googleAnalytics.trackingId);
          setSettings(prev => ({
            ...prev,
            googleAnalytics: {
              ...prev.googleAnalytics,
              status: result.success ? 'success' : 'error'
            }
          }));
          break;
        case 'facebook-pixel':
          result = await trackingService.testFacebookPixel(settings.facebookPixel.pixelId);
          setSettings(prev => ({
            ...prev,
            facebookPixel: {
              ...prev.facebookPixel,
              status: result.success ? 'success' : 'error'
            }
          }));
          break;
        case 'tiktok-pixel':
          result = await trackingService.testTikTokPixel(settings.tiktokPixel.pixelId);
          setSettings(prev => ({
            ...prev,
            tiktokPixel: {
              ...prev.tiktokPixel,
              status: result.success ? 'success' : 'error'
            }
          }));
          break;
      }
      
      setTestResults(prev => ({ ...prev, [platform]: result }));
    } catch (error) {
      console.error(`Error testing ${platform}:`, error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <i className="ri-check-circle-fill text-green-500 text-xl"></i>;
      case 'error':
        return <i className="ri-close-circle-fill text-red-500 text-xl"></i>;
      case 'pending':
        return <i className="ri-loader-4-line animate-spin text-yellow-500 text-xl"></i>;
      default:
        return <i className="ri-question-circle-line text-gray-400 text-xl"></i>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'pending':
        return 'Testing...';
      default:
        return 'Inactive';
    }
  };

  const handleEventToggle = (event: string) => {
    setSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: !prev.events[event]
      }
    }));
  };

  const tabs = [
    { id: 'google-analytics', name: 'Google Analytics', icon: 'ri-google-line' },
    { id: 'facebook-pixel', name: 'Facebook Pixel', icon: 'ri-facebook-line' },
    { id: 'tiktok-pixel', name: 'TikTok Pixel', icon: 'ri-tiktok-line' },
    { id: 'events', name: 'Event Tracking', icon: 'ri-pulse-line' }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-loader-4-line animate-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Loading tracking settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tracking & Marketing</h1>
              <p className="text-gray-600">
                Manage third-party analytics and marketing integrations for your store
              </p>
            </div>

            {/* Status Banner */}
            {saveStatus && (
              <div className={`mb-6 p-4 rounded-lg ${
                saveStatus === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <i className={`${
                    saveStatus === 'success' ? 'ri-check-circle-fill text-green-500' : 'ri-close-circle-fill text-red-500'
                  } text-xl mr-3`}></i>
                  <span className={`${
                    saveStatus === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {saveStatus === 'success' 
                      ? 'Tracking settings saved successfully!' 
                      : 'Error saving tracking settings. Please try again.'}
                  </span>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Google Analytics Tab */}
              {activeTab === 'google-analytics' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Google Analytics</h2>
                      <p className="text-gray-600">Track website traffic and user behavior with Google Analytics 4</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(settings.googleAnalytics.status)}
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(settings.googleAnalytics.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.googleAnalytics.enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            googleAnalytics: {
                              ...prev.googleAnalytics,
                              enabled: e.target.checked,
                              status: e.target.checked ? 'inactive' : 'inactive'
                            }
                          }))}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Google Analytics</span>
                      </label>
                    </div>

                    {settings.googleAnalytics.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tracking ID (GA4)
                          </label>
                          <input
                            type="text"
                            value={settings.googleAnalytics.trackingId}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              googleAnalytics: {
                                ...prev.googleAnalytics,
                                trackingId: e.target.value
                              }
                            }))}
                            placeholder="G-XXXXXXXXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Find your GA4 Measurement ID in Google Analytics → Admin → Data Streams
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Measurement ID (Optional)
                          </label>
                          <input
                            type="text"
                            value={settings.googleAnalytics.measurementId}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              googleAnalytics: {
                                ...prev.googleAnalytics,
                                measurementId: e.target.value
                              }
                            }))}
                            placeholder="G-XXXXXXXXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleTestConnection('google-analytics')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Test Connection
                          </button>
                          {settings.googleAnalytics.lastUpdated && (
                            <span className="text-sm text-gray-500">
                              Last updated: {new Date(settings.googleAnalytics.lastUpdated).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {testResults.googleAnalytics && (
                          <div className={`p-4 rounded-lg ${
                            testResults.googleAnalytics.success 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            <p className={`text-sm ${
                              testResults.googleAnalytics.success ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {testResults.googleAnalytics.success 
                                ? 'Connection successful! Analytics tracking is active.' 
                                : `Connection failed: ${testResults.googleAnalytics.error}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Facebook Pixel Tab */}
              {activeTab === 'facebook-pixel' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Facebook Pixel</h2>
                      <p className="text-gray-600">Track conversions and optimize Facebook ad campaigns</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(settings.facebookPixel.status)}
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(settings.facebookPixel.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.facebookPixel.enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            facebookPixel: {
                              ...prev.facebookPixel,
                              enabled: e.target.checked,
                              status: e.target.checked ? 'inactive' : 'inactive'
                            }
                          }))}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Facebook Pixel</span>
                      </label>
                    </div>

                    {settings.facebookPixel.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pixel ID
                          </label>
                          <input
                            type="text"
                            value={settings.facebookPixel.pixelId}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              facebookPixel: {
                                ...prev.facebookPixel,
                                pixelId: e.target.value
                              }
                            }))}
                            placeholder="123456789012345"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Find your Pixel ID in Facebook Ads Manager → Events Manager → Data Sources
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Access Token (Optional)
                          </label>
                          <input
                            type="text"
                            value={settings.facebookPixel.accessToken || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              facebookPixel: {
                                ...prev.facebookPixel,
                                accessToken: e.target.value
                              }
                            }))}
                            placeholder="EAAxxxxxxxxxxxxxxx"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Optional: For server-side event tracking and conversions API
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleTestConnection('facebook-pixel')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Test Connection
                          </button>
                          {settings.facebookPixel.lastUpdated && (
                            <span className="text-sm text-gray-500">
                              Last updated: {new Date(settings.facebookPixel.lastUpdated).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {testResults.facebookPixel && (
                          <div className={`p-4 rounded-lg ${
                            testResults.facebookPixel.success 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            <p className={`text-sm ${
                              testResults.facebookPixel.success ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {testResults.facebookPixel.success 
                                ? 'Connection successful! Facebook Pixel is active.' 
                                : `Connection failed: ${testResults.facebookPixel.error}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TikTok Pixel Tab */}
              {activeTab === 'tiktok-pixel' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">TikTok Pixel</h2>
                      <p className="text-gray-600">Track conversions and optimize TikTok ad campaigns</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(settings.tiktokPixel.status)}
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(settings.tiktokPixel.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.tiktokPixel.enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            tiktokPixel: {
                              ...prev.tiktokPixel,
                              enabled: e.target.checked,
                              status: e.target.checked ? 'inactive' : 'inactive'
                            }
                          }))}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable TikTok Pixel</span>
                      </label>
                    </div>

                    {settings.tiktokPixel.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pixel ID
                          </label>
                          <input
                            type="text"
                            value={settings.tiktokPixel.pixelId}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              tiktokPixel: {
                                ...prev.tiktokPixel,
                                pixelId: e.target.value
                              }
                            }))}
                            placeholder="C4A7XXXXXXXXXXXXXXXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Find your Pixel ID in TikTok Ads Manager → Assets → Events → Web Events
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Access Token (Optional)
                          </label>
                          <input
                            type="text"
                            value={settings.tiktokPixel.accessToken || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              tiktokPixel: {
                                ...prev.tiktokPixel,
                                accessToken: e.target.value
                              }
                            }))}
                            placeholder="xxxxxxxxxxxxxxxxxxxx"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Optional: For server-side event tracking and enhanced conversions
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleTestConnection('tiktok-pixel')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Test Connection
                          </button>
                          {settings.tiktokPixel.lastUpdated && (
                            <span className="text-sm text-gray-500">
                              Last updated: {new Date(settings.tiktokPixel.lastUpdated).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {testResults.tiktokPixel && (
                          <div className={`p-4 rounded-lg ${
                            testResults.tiktokPixel.success 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            <p className={`text-sm ${
                              testResults.tiktokPixel.success ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {testResults.tiktokPixel.success 
                                ? 'Connection successful! TikTok Pixel is active.' 
                                : `Connection failed: ${testResults.tiktokPixel.error}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Tracking Tab */}
              {activeTab === 'events' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Tracking</h2>
                    <p className="text-gray-600">
                      Configure which eCommerce events to track across all enabled platforms
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(settings.events).map(([eventKey, enabled]) => (
                        <div key={eventKey} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {eventKey.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {getEventDescription(eventKey)}
                            </p>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleEventToggle(eventKey)}
                              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 mb-1">Event Tracking Information</h4>
                          <p className="text-sm text-blue-800">
                            These events will be automatically tracked across all enabled platforms. 
                            Standard eCommerce events help optimize ad performance and provide better analytics insights.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getEventDescription(eventKey: string): string {
  const descriptions = {
    pageView: 'Track when users visit pages',
    addToCart: 'Track when items are added to cart',
    purchase: 'Track completed purchases',
    beginCheckout: 'Track when checkout process starts',
    search: 'Track search queries',
    viewContent: 'Track product page views',
    addToWishlist: 'Track items added to wishlist',
    signUp: 'Track user registrations',
    login: 'Track user logins'
  };
  
  return descriptions[eventKey] || 'Track user interactions';
}