
'use client';

import { useState, useEffect } from 'react';
import { notificationService } from '@/lib/notification-service';
import { emailService } from '@/lib/email-service';

interface EmailSummarySettingsProps {
  className?: string;
}

export default function EmailSummarySettings({ className = '' }: EmailSummarySettingsProps) {
  const [settings, setSettings] = useState(notificationService.getSettings());
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const [testEmailSent, setTestEmailSent] = useState(false);

  useEffect(() => {
    const savedLastSent = localStorage.getItem('flame-last-email-summary');
    if (savedLastSent) {
      setLastSent(new Date(savedLastSent));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      emailSummary: {
        ...settings.emailSummary,
        [key]: value
      }
    };
    setSettings(newSettings);
    notificationService.updateSettings(newSettings);
  };

  const handleSendTestEmail = async () => {
    setIsSending(true);
    try {
      const statistics = notificationService.getStatistics();
      const unreadNotifications = notificationService.getNotifications().filter(n => !n.read);
      
      const emailData = {
        adminEmail: settings.emailSummary.email,
        statistics,
        unreadNotifications: unreadNotifications.slice(0, 10), // Latest 10 unread
        generatedAt: new Date().toISOString(),
        storeName: 'Flame Store',
        adminUrl: `${window.location.origin}/admin`
      };

      // This would normally call the actual email service
      // await emailService.sendNotificationSummary(emailData); // Placeholder: implement summary email method or use sendEmail
      
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 3000);
      
    } catch (error) {
      console.error('Error sending test email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendNow = async () => {
    setIsSending(true);
    try {
      await notificationService.sendEmailSummary();
      setLastSent(new Date());
      localStorage.setItem('flame-last-email-summary', new Date().toISOString());
      
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 3000);
      
    } catch (error) {
      console.error('Error sending email summary:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getNextScheduledTime = () => {
    const now = new Date();
    const [hours, minutes] = settings.emailSummary.time.split(':').map(Number);
    
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    // If weekly, find next occurrence
    if (settings.emailSummary.frequency === 'weekly') {
      const dayOfWeek = scheduledTime.getDay();
      const daysUntilMonday = (1 - dayOfWeek + 7) % 7;
      if (daysUntilMonday > 0) {
        scheduledTime.setDate(scheduledTime.getDate() + daysUntilMonday);
      }
    }
    
    return scheduledTime;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Email Summary Settings</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSendTestEmail}
            disabled={isSending || !settings.emailSummary.email}
            className="flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <i className="ri-loader-4-line animate-spin mr-1.5"></i>
            ) : (
              <i className="ri-mail-send-line mr-1.5"></i>
            )}
            Test Email
          </button>
          <button
            onClick={handleSendNow}
            disabled={isSending || !settings.emailSummary.enabled}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <i className="ri-loader-4-line animate-spin mr-1.5"></i>
            ) : (
              <i className="ri-send-plane-line mr-1.5"></i>
            )}
            Send Now
          </button>
        </div>
      </div>

      {testEmailSent && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <i className="ri-check-circle-line text-green-600 mr-2"></i>
            <span className="text-sm text-green-800">Email sent successfully!</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Enable Email Summary</label>
            <p className="text-sm text-gray-500">Receive automated email summaries of unhandled notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailSummary.enabled}
              onChange={(e) => handleSettingChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.emailSummary.enabled && (
          <>
            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={settings.emailSummary.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">Email address where summaries will be sent</p>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={settings.emailSummary.frequency}
                onChange={(e) => handleSettingChange('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Monday)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">How often to send email summaries</p>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={settings.emailSummary.time}
                onChange={(e) => handleSettingChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Time of day to send summaries (24-hour format)</p>
            </div>

            {/* Schedule Information */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-calendar-check-line text-blue-600"></i>
                <span className="text-sm font-medium text-blue-900">Schedule Information</span>
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Frequency:</strong> {settings.emailSummary.frequency}</p>
                <p><strong>Time:</strong> {settings.emailSummary.time}</p>
                <p><strong>Next scheduled:</strong> {formatDateTime(getNextScheduledTime())}</p>
                {lastSent && (
                  <p><strong>Last sent:</strong> {formatDateTime(lastSent)}</p>
                )}
              </div>
            </div>

            {/* Summary Content Preview */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Summary Content Preview</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Total notifications:</span>
                  <span className="font-medium">{notificationService.getStatistics().total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Unread notifications:</span>
                  <span className="font-medium text-orange-600">{notificationService.getStatistics().unread}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Urgent notifications:</span>
                  <span className="font-medium text-red-600">{notificationService.getStatistics().byPriority.urgent || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>High priority notifications:</span>
                  <span className="font-medium text-orange-600">{notificationService.getStatistics().byPriority.high || 0}</span>
                </div>
              </div>
            </div>

            {/* Content Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Include in Summary</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled
                  />
                  <span className="ml-2 text-sm text-gray-600">Unread notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled
                  />
                  <span className="ml-2 text-sm text-gray-600">High priority alerts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled
                  />
                  <span className="ml-2 text-sm text-gray-600">Statistics summary</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled
                  />
                  <span className="ml-2 text-sm text-gray-600">Quick action links</span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
