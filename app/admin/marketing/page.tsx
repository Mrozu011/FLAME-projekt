'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { emailMarketingService } from '@/lib/email-marketing-service';
import { useTranslation } from '@/hooks/useTranslation';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  templateId?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  stats: {
    sent: number;
    delivered: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  };
  createdAt: string;
  updatedAt: string;
  language: string;
  segmentIds: string[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  language: string;
  category: 'newsletter' | 'promotional' | 'transactional';
  createdAt: string;
  updatedAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
  segments: string[];
  customFields: Record<string, any>;
}

export default function MarketingEmail() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState({
    mailchimp: { connected: false, lastSync: null },
    brevo: { connected: false, lastSync: null }
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'campaign' | 'template' | 'settings' | 'export'>('campaign');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalCampaigns: 0,
    averageOpenRate: 0,
    averageClickRate: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campaignData, templateData, subscriberData, integrationData, statsData] = await Promise.all([
        emailMarketingService.getCampaigns(),
        emailMarketingService.getTemplates(),
        emailMarketingService.getSubscribers(),
        emailMarketingService.getIntegrationStatus(),
        emailMarketingService.getStats()
      ]);

      setCampaigns(campaignData);
      setTemplates(templateData);
      setSubscribers(subscriberData);
      setIntegrationStatus(integrationData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading marketing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setModalType('campaign');
    setShowModal(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setModalType('campaign');
    setShowModal(true);
  };

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        await emailMarketingService.deleteCampaign(id);
        setCampaigns(campaigns.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleSendCampaign = async (id: string) => {
    if (confirm('Are you sure you want to send this campaign now?')) {
      try {
        await emailMarketingService.sendCampaign(id);
        await loadData();
      } catch (error) {
        console.error('Error sending campaign:', error);
      }
    }
  };

  const handleDuplicateCampaign = async (campaign: Campaign) => {
    try {
      const duplicated = await emailMarketingService.duplicateCampaign(campaign.id);
      setCampaigns([...campaigns, duplicated]);
    } catch (error) {
      console.error('Error duplicating campaign:', error);
    }
  };

  const handleExportSubscribers = async (format: 'csv' | 'mailchimp' | 'brevo') => {
    try {
      if (format === 'csv') {
        const blob = await emailMarketingService.exportSubscribers('csv');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        await emailMarketingService.syncWithPlatform(format);
        await loadData();
      }
    } catch (error) {
      console.error('Error exporting subscribers:', error);
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setModalType('template');
    setShowModal(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setModalType('template');
    setShowModal(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await emailMarketingService.deleteTemplate(id);
        setTemplates(templates.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketing & Email</h1>
                <p className="text-sm text-gray-500">Manage newsletter campaigns and email marketing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setModalType('export');
                  setShowModal(true);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap flex items-center"
              >
                <i className="ri-download-line mr-2"></i>
                Export
              </button>
              <button
                onClick={handleCreateCampaign}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center"
              >
                <i className="ri-add-line mr-2"></i>
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-user-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-user-star-line text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-mail-line text-purple-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-eye-line text-orange-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(stats.averageOpenRate)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-cursor-line text-indigo-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(stats.averageClickRate)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-trending-up-line text-teal-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyGrowth > 0 ? '+' : ''}{formatPercentage(stats.monthlyGrowth)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-mail-line text-yellow-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mailchimp</p>
                  <p className="text-sm text-gray-500">
                    {integrationStatus.mailchimp.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${integrationStatus.mailchimp.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <button
                  onClick={() => {
                    setModalType('settings');
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Configure
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-mail-send-line text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Brevo (Sendinblue)</p>
                  <p className="text-sm text-gray-500">
                    {integrationStatus.brevo.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${integrationStatus.brevo.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <button
                  onClick={() => {
                    setModalType('settings');
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'campaigns', label: 'Campaigns', icon: 'ri-mail-line', count: campaigns.length },
                { id: 'templates', label: 'Templates', icon: 'ri-file-text-line', count: templates.length },
                { id: 'subscribers', label: 'Subscribers', icon: 'ri-user-line', count: subscribers.length },
                { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line', count: null }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'campaigns' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
                  <button
                    onClick={handleCreateTemplate}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap flex items-center"
                  >
                    <i className="ri-file-add-line mr-2"></i>
                    Create Template
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <i className="ri-mail-line text-blue-600"></i>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-sm text-gray-500">{campaign.subject}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.recipients.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>Opens: {formatPercentage(campaign.stats.openRate)}</div>
                              <div className="text-xs text-gray-500">
                                Clicks: {formatPercentage(campaign.stats.clickRate)} • Bounces: {formatPercentage(campaign.stats.bounceRate)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.sentAt ? formatDate(campaign.sentAt) : 
                             campaign.scheduledAt ? formatDate(campaign.scheduledAt) : 
                             formatDate(campaign.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditCampaign(campaign)}
                                className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDuplicateCampaign(campaign)}
                                className="text-green-600 hover:text-green-900 w-8 h-8 flex items-center justify-center"
                                title="Duplicate"
                              >
                                <i className="ri-file-copy-line"></i>
                              </button>
                              {campaign.status === 'draft' && (
                                <button
                                  onClick={() => handleSendCampaign(campaign.id)}
                                  className="text-purple-600 hover:text-purple-900 w-8 h-8 flex items-center justify-center"
                                  title="Send Now"
                                >
                                  <i className="ri-send-plane-line"></i>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                className="text-red-600 hover:text-red-900 w-8 h-8 flex items-center justify-center"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="ri-file-text-line text-purple-600"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-500">{template.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                            title="Edit"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-900 w-8 h-8 flex items-center justify-center"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        <p className="font-medium">{template.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">Language: {template.language}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {formatDate(template.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleExportSubscribers('csv')}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap flex items-center"
                    >
                      <i className="ri-file-download-line mr-2"></i>
                      Export CSV
                    </button>
                    <button
                      onClick={() => handleExportSubscribers('mailchimp')}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors whitespace-nowrap flex items-center"
                      disabled={!integrationStatus.mailchimp.connected}
                    >
                      <i className="ri-mail-line mr-2"></i>
                      Sync Mailchimp
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscriber</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscribers.slice(0, 50).map((subscriber) => (
                        <tr key={subscriber.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <i className="ri-user-line text-gray-600"></i>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {subscriber.firstName} {subscriber.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{subscriber.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subscriber.status === 'active' ? 'bg-green-100 text-green-800' :
                              subscriber.status === 'unsubscribed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {subscriber.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {subscriber.language}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {subscriber.segments.join(', ') || 'None'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(subscriber.subscribedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                                title="View Details"
                              >
                                <i className="ri-eye-line"></i>
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 w-8 h-8 flex items-center justify-center"
                                title="Unsubscribe"
                              >
                                <i className="ri-user-unfollow-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Email Analytics</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Campaign Performance</h4>
                    <div className="space-y-4">
                      {campaigns.slice(0, 5).map((campaign) => (
                        <div key={campaign.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(campaign.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-900">
                              {formatPercentage(campaign.stats.openRate)} open rate
                            </div>
                            <div className="text-xs text-gray-500">
                              {campaign.stats.clicks} clicks
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Subscriber Growth</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">This month</span>
                        <span className="text-sm font-medium text-gray-900">+{Math.floor(stats.totalSubscribers * 0.15)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last month</span>
                        <span className="text-sm font-medium text-gray-900">+{Math.floor(stats.totalSubscribers * 0.12)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Growth rate</span>
                        <span className="text-sm font-medium text-green-600">+{formatPercentage(stats.monthlyGrowth)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {modalType === 'campaign' && (
              <CampaignModal 
                campaign={selectedCampaign}
                templates={templates}
                onClose={() => setShowModal(false)}
                onSave={loadData}
              />
            )}
            {modalType === 'template' && (
              <TemplateModal 
                template={selectedTemplate}
                onClose={() => setShowModal(false)}
                onSave={loadData}
              />
            )}
            {modalType === 'settings' && (
              <SettingsModal 
                onClose={() => setShowModal(false)}
                onSave={loadData}
              />
            )}
            {modalType === 'export' && (
              <ExportModal 
                onClose={() => setShowModal(false)}
                onExport={handleExportSubscribers}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Components
function CampaignModal({ campaign, templates, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    content: campaign?.content || '',
    templateId: campaign?.templateId || '',
    language: campaign?.language || 'en',
    scheduleType: campaign?.scheduledAt ? 'scheduled' : 'immediate',
    scheduledAt: campaign?.scheduledAt || '',
    segmentIds: campaign?.segmentIds || []
  });
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (campaign) {
        await emailMarketingService.updateCampaign(campaign.id, formData);
      } else {
        await emailMarketingService.createCampaign(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {campaign ? 'Edit Campaign' : 'Create New Campaign'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
          <select
            value={formData.templateId}
            onChange={(e) => setFormData({...formData, templateId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.language})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
          <div className="border border-gray-300 rounded-md">
            <div className="border-b border-gray-300 p-3 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowEditor(!showEditor)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {showEditor ? 'Hide Editor' : 'Show WYSIWYG Editor'}
              </button>
            </div>
            {showEditor ? (
              <div className="p-4">
                <div className="mb-4 space-x-2">
                  <button type="button" className="px-3 py-1 bg-gray-200 rounded text-sm">Bold</button>
                  <button type="button" className="px-3 py-1 bg-gray-200 rounded text-sm">Italic</button>
                  <button type="button" className="px-3 py-1 bg-gray-200 rounded text-sm">Link</button>
                  <button type="button" className="px-3 py-1 bg-gray-200 rounded text-sm">Image</button>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your email content here..."
                />
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={8}
                className="w-full px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your email content here..."
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Send Options</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="scheduleType"
                value="immediate"
                checked={formData.scheduleType === 'immediate'}
                onChange={(e) => setFormData({...formData, scheduleType: e.target.value})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Send immediately</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="scheduleType"
                value="scheduled"
                checked={formData.scheduleType === 'scheduled'}
                onChange={(e) => setFormData({...formData, scheduleType: e.target.value})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Schedule for later</span>
            </label>
          </div>
          {formData.scheduleType === 'scheduled' && (
            <div className="mt-2">
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'Saving...' : (campaign ? 'Update' : 'Create')} Campaign
          </button>
        </div>
      </form>
    </div>
  );
}

function TemplateModal({ template, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    content: template?.content || '',
    language: template?.language || 'en',
    category: template?.category || 'newsletter'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (template) {
        await emailMarketingService.updateTemplate(template.id, formData);
      } else {
        await emailMarketingService.createTemplate(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {template ? 'Edit Template' : 'Create New Template'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="newsletter">Newsletter</option>
              <option value="promotional">Promotional</option>
              <option value="transactional">Transactional</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your template content here..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'Saving...' : (template ? 'Update' : 'Create')} Template
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingsModal({ onClose, onSave }) {
  const [settings, setSettings] = useState({
    mailchimp: {
      apiKey: '',
      listId: '',
      enabled: false
    },
    brevo: {
      apiKey: '',
      listId: '',
      enabled: false
    },
    autoTranslation: {
      enabled: false,
      service: 'google'
    }
  });
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const handleTest = async (platform) => {
    setLoading(true);
    try {
      const result = await emailMarketingService.testIntegration(platform, settings[platform]);
      setTestResults({...testResults, [platform]: result});
    } catch (error) {
      console.error('Error testing integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await emailMarketingService.saveSettings(settings);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Mailchimp Integration</h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.mailchimp.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    mailchimp: {...settings.mailchimp, enabled: e.target.checked}
                  })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Enable Mailchimp integration</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={settings.mailchimp.apiKey}
                onChange={(e) => setSettings({
                  ...settings,
                  mailchimp: {...settings.mailchimp, apiKey: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Mailchimp API key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">List ID</label>
              <input
                type="text"
                value={settings.mailchimp.listId}
                onChange={(e) => setSettings({
                  ...settings,
                  mailchimp: {...settings.mailchimp, listId: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Mailchimp list ID"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleTest('mailchimp')}
                disabled={loading}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors whitespace-nowrap"
              >
                Test Connection
              </button>
              {testResults.mailchimp && (
                <span className={`text-sm ${testResults.mailchimp.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.mailchimp.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Brevo (Sendinblue) Integration</h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.brevo.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    brevo: {...settings.brevo, enabled: e.target.checked}
                  })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Enable Brevo integration</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={settings.brevo.apiKey}
                onChange={(e) => setSettings({
                  ...settings,
                  brevo: {...settings.brevo, apiKey: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Brevo API key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">List ID</label>
              <input
                type="text"
                value={settings.brevo.listId}
                onChange={(e) => setSettings({
                  ...settings,
                  brevo: {...settings.brevo, listId: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Brevo list ID"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleTest('brevo')}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Test Connection
              </button>
              {testResults.brevo && (
                <span className={`text-sm ${testResults.brevo.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.brevo.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Auto-Translation Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoTranslation.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    autoTranslation: {...settings.autoTranslation, enabled: e.target.checked}
                  })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Enable automatic translation</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Translation Service</label>
              <select
                value={settings.autoTranslation.service}
                onChange={(e) => setSettings({
                  ...settings,
                  autoTranslation: {...settings.autoTranslation, service: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="google">Google Translate</option>
                <option value="deepl">DeepL</option>
                <option value="azure">Azure Translator</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ExportModal({ onClose, onExport }) {
  const [exportType, setExportType] = useState('csv');
  const [includeFields, setIncludeFields] = useState({
    email: true,
    name: true,
    subscribeDate: true,
    language: true,
    segments: true,
    customFields: false
  });

  const handleExport = () => {
    onExport(exportType, includeFields);
    onClose();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Subscribers</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="csv"
                checked={exportType === 'csv'}
                onChange={(e) => setExportType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">CSV File</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="mailchimp"
                checked={exportType === 'mailchimp'}
                onChange={(e) => setExportType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Sync to Mailchimp</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="brevo"
                checked={exportType === 'brevo'}
                onChange={(e) => setExportType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Sync to Brevo</span>
            </label>
          </div>
        </div>

        {exportType === 'csv' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include Fields</label>
            <div className="space-y-2">
              {Object.entries(includeFields).map(([field, checked]) => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setIncludeFields({...includeFields, [field]: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}