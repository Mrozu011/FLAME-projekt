
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';

interface CampaignContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  textColor: string;
  imageUrl: string;
  position: string;
}

interface Campaign {
  id: number;
  name: string;
  type: string;
  content: CampaignContent;
  status: 'active' | 'inactive' | 'draft';
  targetAudience: string[];
  startDate: string;
  endDate: string;
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
}

interface CampaignForm {
  name: string;
  type: string;
  content: CampaignContent;
  status: 'active' | 'inactive' | 'draft';
  targetAudience: string[];
  startDate: string;
  endDate: string;
  budget: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [form, setForm] = useState<CampaignForm>({
    name: '',
    type: 'banner',
    content: {
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imageUrl: '',
      position: 'center'
    },
    status: 'draft',
    targetAudience: [],
    startDate: '',
    endDate: '',
    budget: 0
  });

  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const campaignTypes = [
    { id: 'banner', name: 'Banner', icon: 'ri-layout-top-line', description: 'Top/bottom banner display' },
    { id: 'popup', name: 'Popup', icon: 'ri-window-line', description: 'Modal popup overlay' },
    { id: 'notification', name: 'Notification', icon: 'ri-notification-line', description: 'Notification bar' },
    { id: 'hero', name: 'Hero Message', icon: 'ri-image-line', description: 'Homepage hero section' },
    { id: 'sidebar', name: 'Sidebar', icon: 'ri-sidebar-unfold-line', description: 'Side panel display' }
  ];

  const targetPages = [
    { id: 'homepage', name: 'Homepage' },
    { id: 'products', name: 'Product Pages' },
    { id: 'category', name: 'Category Pages' },
    { id: 'cart', name: 'Cart Page' },
    { id: 'checkout', name: 'Checkout Page' },
    { id: 'profile', name: 'User Profile' },
    { id: 'all', name: 'All Pages' }
  ];

  const userTypes = [
    { id: 'all', name: 'All Users' },
    { id: 'new', name: 'New Visitors' },
    { id: 'returning', name: 'Returning Customers' },
    { id: 'registered', name: 'Registered Users' },
    { id: 'guest', name: 'Guest Users' }
  ];

  const categories = [
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports & Outdoors' }
  ];

  useEffect(() => {
    const mockCampaigns = [
      {
        id: 1,
        name: 'Summer Sale Banner',
        type: 'banner',
        content: {
          title: 'Summer Sale - Up to 50% Off!',
          subtitle: 'Limited time offer on summer collection',
          buttonText: 'Shop Now',
          buttonLink: '/sale',
          backgroundColor: '#F59E0B',
          textColor: '#FFFFFF',
          imageUrl: 'https://readdy.ai/api/search-image?query=summer%20sale%20banner%20with%20vibrant%20colors%20and%20modern%20design%2C%20featuring%20summer%20products%20and%20promotional%20text%2C%20clean%20professional%20layout%20with%20bright%20background&width=1200&height=300&seq=banner1&orientation=landscape',
          position: 'top'
        },
        targeting: {
          pages: ['homepage', 'products'],
          userTypes: ['all'],
          categories: ['men', 'women']
        },
        schedule: {
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          timezone: 'UTC',
          showTimes: {
            enabled: true,
            startTime: '09:00',
            endTime: '21:00'
          }
        },
        priority: 'high',
        active: true,
        displayRules: {
          showOnce: false,
          dismissible: true,
          autoHide: {
            enabled: false,
            seconds: 10
          }
        },
        stats: {
          impressions: 15432,
          clicks: 892,
          conversions: 156
        },
        createdAt: '2024-05-15T10:00:00Z',
        updatedAt: '2024-05-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'New Collection Popup',
        type: 'popup',
        content: {
          title: 'New Fall Collection is Here!',
          subtitle: 'Be the first to discover our latest arrivals',
          buttonText: 'Explore Collection',
          buttonLink: '/collections/fall-2024',
          backgroundColor: '#1F2937',
          textColor: '#F9FAFB',
          imageUrl: 'https://readdy.ai/api/search-image?query=fall%20fashion%20collection%20popup%20design%20with%20elegant%20styling%2C%20featuring%20autumn%20colors%20and%20modern%20clothing%20items%2C%20professional%20product%20photography%20with%20clean%20background&width=600&height=400&seq=popup1&orientation=landscape',
          position: 'center'
        },
        targeting: {
          pages: ['homepage'],
          userTypes: ['new'],
          categories: []
        },
        schedule: {
          startDate: '2024-09-01',
          endDate: '2024-11-30',
          timezone: 'UTC',
          showTimes: {
            enabled: false,
            startTime: '09:00',
            endTime: '17:00'
          }
        },
        priority: 'normal',
        active: false,
        displayRules: {
          showOnce: true,
          dismissible: true,
          autoHide: {
            enabled: true,
            seconds: 15
          }
        },
        stats: {
          impressions: 8654,
          clicks: 432,
          conversions: 89
        },
        createdAt: '2024-08-20T14:30:00Z',
        updatedAt: '2024-08-20T14:30:00Z'
      },
      {
        id: 3,
        name: 'Free Shipping Notification',
        type: 'notification',
        content: {
          title: 'Free Shipping on Orders Over $99',
          subtitle: 'Limited time offer - Don\'t miss out!',
          buttonText: 'Learn More',
          buttonLink: '/shipping',
          backgroundColor: '#10B981',
          textColor: '#FFFFFF',
          imageUrl: '',
          position: 'top'
        },
        targeting: {
          pages: ['cart', 'checkout'],
          userTypes: ['all'],
          categories: []
        },
        schedule: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          timezone: 'UTC',
          showTimes: {
            enabled: false,
            startTime: '09:00',
            endTime: '17:00'
          }
        },
        priority: 'low',
        active: true,
        displayRules: {
          showOnce: false,
          dismissible: true,
          autoHide: {
            enabled: false,
            seconds: 10
          }
        },
        stats: {
          impressions: 23456,
          clicks: 1234,
          conversions: 345
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    setCampaigns(mockCampaigns as unknown as Campaign[]);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const keys = name.split('.');
      setForm(prev => {
        const updated = { ...prev };
        let current = updated;

        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return updated;
      });
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].includes(value)
          ? prev[section][field].filter(item => item !== value)
          : [...prev[section][field], value]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Saving campaign...' });

    // Validation
    if (!form.name || !form.content.title) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (form.content.title.length > 100) {
      setSubmitStatus({ type: 'error', message: 'Title cannot exceed 100 characters.' });
      return;
    }

    if (form.content.subtitle.length > 500) {
      setSubmitStatus({ type: 'error', message: 'Subtitle cannot exceed 500 characters.' });
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('name', form.name);
      formData.append('type', form.type);
      formData.append('title', form.content.title);
      formData.append('subtitle', form.content.subtitle);
      formData.append('buttonText', form.content.buttonText);
      formData.append('buttonLink', form.content.buttonLink);
      formData.append('backgroundColor', form.content.backgroundColor);
      formData.append('textColor', form.content.textColor);
      formData.append('imageUrl', form.content.imageUrl);
      formData.append('position', form.content.position);
      formData.append('targetPages', form.targetAudience.join(','));
      formData.append('targetUserTypes', form.targetAudience.join(','));
      formData.append('targetCategories', form.targetAudience.join(','));
      formData.append('startDate', form.startDate);
      formData.append('endDate', form.endDate);
      formData.append('timezone', 'UTC'); // Mock timezone
      formData.append('showTimesEnabled', 'false'); // Mock showTimesEnabled
      formData.append('startTime', '09:00'); // Mock startTime
      formData.append('endTime', '17:00'); // Mock endTime
      formData.append('priority', 'normal'); // Mock priority
      formData.append('active', 'true'); // Mock active
      formData.append('showOnce', 'false'); // Mock showOnce
      formData.append('dismissible', 'true'); // Mock dismissible
      formData.append('autoHideEnabled', 'false'); // Mock autoHideEnabled
      formData.append('autoHideSeconds', '10'); // Mock autoHideSeconds
      formData.append('editMode', 'false'); // Mock editMode

      if (selectedCampaign) {
        formData.append('campaignId', selectedCampaign.id.toString());
      }

      const response = await fetch('https://readdy.ai/api/form/d24787mb5t8jehpp9vsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Campaign saved successfully!' });

        if (selectedCampaign) {
          setCampaigns(campaigns.map(campaign =>
            campaign.id === selectedCampaign.id
              ? { ...campaign, ...form, updatedAt: new Date().toISOString() }
              : campaign
          ));
        } else {
          const newCampaign: Campaign = {
            id: Date.now(),
            name: form.name,
            type: form.type,
            content: form.content,
            status: 'draft', // Mock status
            targetAudience: form.targetAudience,
            startDate: form.startDate,
            endDate: form.endDate,
            budget: 0, // Mock budget
            impressions: 0,
            clicks: 0,
            conversions: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setCampaigns([...campaigns, newCampaign]);
        }

        setTimeout(() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedCampaign(null);
          resetForm();
          setSubmitStatus({ type: '', message: '' });
        }, 2000);
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to save campaign. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      type: 'banner',
      content: {
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        imageUrl: '',
        position: 'center'
      },
      status: 'draft',
      targetAudience: [],
      startDate: '',
      endDate: '',
      budget: 0
    });
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setForm(campaign);
    setShowCreateModal(true); // Changed to showCreateModal
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    }
  };

  const toggleActive = (id) => {
    setCampaigns(campaigns.map(campaign =>
      campaign.id === id
        ? { ...campaign, active: !campaign.active, updatedAt: new Date().toISOString() }
        : campaign
    ));
  };

  const duplicateCampaign = (campaign) => {
    const duplicated: Campaign = {
      ...campaign,
      id: Date.now(),
      name: `${campaign.name} (Copy)`,
      status: 'draft', // Mock status
      targetAudience: [], // Mock targetAudience
      startDate: '', // Mock startDate
      endDate: '', // Mock endDate
      budget: 0, // Mock budget
      impressions: 0,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCampaigns([...campaigns, duplicated]);
  };

  const getTypeIcon = (type) => {
    const typeConfig = campaignTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : 'ri-layout-line';
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      banner: 'bg-blue-100 text-blue-800',
      popup: 'bg-purple-100 text-purple-800',
      notification: 'bg-green-100 text-green-800',
      hero: 'bg-orange-100 text-orange-800',
      sidebar: 'bg-gray-100 text-gray-800'
    };
    return typeConfig[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: 'bg-red-100 text-red-800',
      normal: 'bg-gray-100 text-gray-800',
      low: 'bg-green-100 text-green-800'
    };
    return priorityConfig[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (active) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getFilteredCampaigns = () => {
    return campaigns.filter(campaign => {
      if (filter === 'banners') return campaign.type === 'banner';
      if (filter === 'popups') return campaign.type === 'popup';
      if (filter === 'notifications') return campaign.type === 'notification';
      if (filter === 'active') return campaign.status === 'active';
      if (filter === 'scheduled') {
        const now = new Date();
        return new Date(campaign.startDate) > now;
      }
      return true;
    });
  };

  const getCampaignStats = () => {
    return {
      total: campaigns.length,
      active: campaigns.filter(c => c.status === 'active').length,
      banners: campaigns.filter(c => c.type === 'banner').length,
      popups: campaigns.filter(c => c.type === 'popup').length,
      notifications: campaigns.filter(c => c.type === 'notification').length,
      totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
      totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0)
    };
  };

  const stats = getCampaignStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campaign Manager</h1>
                <p className="text-sm text-gray-500">Create and schedule promotional banners, popups, and notifications</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedCampaign(null);
                resetForm();
                setShowCreateModal(true);
                setShowEditModal(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center"
            >
              <i className="ri-add-line mr-2"></i>
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-megaphone-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-play-circle-line text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-eye-line text-purple-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImpressions.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-mouse-line text-orange-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[ 
                { id: 'all', label: 'All Campaigns', count: stats.total },
                { id: 'banners', label: 'Banners', count: stats.banners },
                { id: 'popups', label: 'Popups', count: stats.popups },
                { id: 'notifications', label: 'Notifications', count: stats.notifications },
                { id: 'active', label: 'Active', count: stats.active }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${ 
                    filter === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Campaigns Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Targeting</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredCampaigns().map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <i className={`${getTypeIcon(campaign.type)} text-blue-600`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.content.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(campaign.type)}`}>
                        {campaign.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{campaign.targeting.pages.length} pages</div>
                        <div className="text-xs text-gray-500">
                          {campaign.targeting.userTypes.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{campaign.schedule.startDate}</div>
                        <div className="text-xs text-gray-500">to {campaign.schedule.endDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{campaign.stats.impressions.toLocaleString()} views</div>
                        <div className="text-xs text-gray-500">
                          {campaign.stats.clicks} clicks • {campaign.stats.conversions} conversions
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(campaign.active)}`}>
                          {campaign.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(campaign.priority)}`}>
                          {campaign.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(campaign)}
                          className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                          title="Edit"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => duplicateCampaign(campaign)}
                          className="text-green-600 hover:text-green-900 w-8 h-8 flex items-center justify-center"
                          title="Duplicate"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                        <button
                          onClick={() => toggleActive(campaign.id)}
                          className={`${campaign.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} w-8 h-8 flex items-center justify-center`}
                          title={campaign.active ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`ri-${campaign.active ? 'pause' : 'play'}-circle-line`}></i>
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
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

        {/* Promotions Link */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Need discount codes for your campaigns?</h3>
              <p className="text-sm opacity-90">Create and manage promotional codes to boost your campaign performance</p>
            </div>
            <Link
              href="/admin/promotions"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center"
            >
              <i className="ri-coupon-line mr-2"></i>
              Manage Promotions
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h3>

            {submitStatus.message && (
              <div className={`mb-4 p-3 rounded-lg ${ 
                submitStatus.type === 'success' ? 'bg-green-50 text-green-800' :
                  submitStatus.type === 'error' ? 'bg-red-50 text-red-800' :
                    'bg-blue-50 text-blue-800'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form id="campaign-form" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type *</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      {campaignTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Content</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="content.title"
                      value={form.content.title}
                      onChange={handleFormChange}
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">{form.content.title.length}/100 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <textarea
                      name="content.subtitle"
                      value={form.content.subtitle}
                      onChange={handleFormChange}
                      rows={2}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{form.content.subtitle.length}/500 characters</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        name="content.buttonText"
                        value={form.content.buttonText}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                      <input
                        type="url"
                        name="content.buttonLink"
                        value={form.content.buttonLink}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                      <input
                        type="color"
                        name="content.backgroundColor"
                        value={form.content.backgroundColor}
                        onChange={handleFormChange}
                        className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                      <input
                        type="color"
                        name="content.textColor"
                        value={form.content.textColor}
                        onChange={handleFormChange}
                        className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <select
                        name="content.position"
                        value={form.content.position}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                      >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="center">Center</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      name="content.imageUrl"
                      value={form.content.imageUrl}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Targeting */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Targeting</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Pages</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {targetPages.map((page) => (
                        <label key={page.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.targetAudience.includes(page.id)}
                            onChange={() => handleArrayChange('targetAudience', 'pages', page.id)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{page.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Types</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {userTypes.map((userType) => (
                        <label key={userType.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.targetAudience.includes(userType.id)}
                            onChange={() => handleArrayChange('targetAudience', 'userTypes', userType.id)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{userType.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.targetAudience.includes(category.id)}
                            onChange={() => handleArrayChange('targetAudience', 'categories', category.id)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Schedule</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="schedule.showTimes.enabled"
                        checked={false} // Mock showTimesEnabled
                        onChange={() => {}}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Enable time restrictions</span>
                    </label>
                  </div>
                  {/* {form.schedule.showTimes.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          name="schedule.showTimes.startTime"
                          value={form.schedule.showTimes.startTime}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          name="schedule.showTimes.endTime"
                          value={form.schedule.showTimes.endTime}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Display Rules */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Display Rules</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                              <select
                          name="priority"
                          value="normal"
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                        >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="displayRules.showOnce"
                        checked={false} // Mock showOnce
                        onChange={() => {}}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Show only once per user</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="displayRules.dismissible"
                        checked={false} // Mock dismissible
                        onChange={() => {}}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Allow users to dismiss</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="displayRules.autoHide.enabled"
                        checked={false} // Mock autoHideEnabled
                        onChange={() => {}}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Auto-hide after</span>
                      {/* {form.displayRules.autoHide.enabled && (
                        <input
                          type="number"
                          name="displayRules.autoHide.seconds"
                          value={form.displayRules.autoHide.seconds}
                          onChange={handleFormChange}
                          min="1"
                          max="60"
                          className="ml-2 w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      )} */}
                      <span className="text-sm text-gray-700 ml-1">seconds</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                                  <input
                    type="checkbox"
                    name="active"
                    checked={form.status === 'active'}
                    onChange={() => {}}
                    className="mr-2"
                  />
                <label className="text-sm text-gray-700">Active (campaign will be displayed)</label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedCampaign(null);
                    resetForm();
                    setSubmitStatus({ type: '', message: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
                  disabled={submitStatus.type === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus.type === 'loading'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 flex items-center"
                >
                  {submitStatus.type === 'loading' ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      {selectedCampaign ? 'Update' : 'Create'} Campaign
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
