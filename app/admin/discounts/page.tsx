'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DiscountRule {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bundle' | 'free_shipping';
  value: number;
  bundlePrice?: number;
  conditions: {
    minOrderValue?: number;
    maxOrderValue?: number;
    productIds?: string[];
    categoryIds?: string[];
    customerGroups?: string[];
    usageLimit?: number;
    oneTimeUse?: boolean;
  };
  active: boolean;
  priority: number;
  validFrom: Date;
  validTo: Date;
  usageCount: number;
  usageLimit?: number;
  createdAt: Date;
}

interface Stats {
  totalRules: number;
  activeRules: number;
  expiredRules: number;
  totalUsage: number;
  totalSavings: number;
  conversionRate: number;
}

export default function DiscountsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRules: 0,
    activeRules: 0,
    expiredRules: 0,
    totalUsage: 0,
    totalSavings: 0,
    conversionRate: 0
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRule, setSelectedRule] = useState<DiscountRule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDiscountData();
  }, []);

  const loadDiscountData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRules: DiscountRule[] = [
        {
          id: 'rule-1',
          name: 'Summer Sale 2024',
          description: '20% off all summer collection items',
          type: 'percentage',
          value: 20,
          conditions: {
            minOrderValue: 100,
            categoryIds: ['summer-collection']
          },
          active: true,
          priority: 1,
          validFrom: new Date('2024-06-01'),
          validTo: new Date('2024-08-31'),
          usageCount: 145,
          usageLimit: 1000,
          createdAt: new Date('2024-05-15')
        },
        {
          id: 'rule-2',
          name: 'New Customer Discount',
          description: '$10 off first purchase',
          type: 'fixed',
          value: 10,
          conditions: {
            minOrderValue: 50,
            customerGroups: ['new-customers']
          },
          active: true,
          priority: 2,
          validFrom: new Date('2024-01-01'),
          validTo: new Date('2024-12-31'),
          usageCount: 89,
          createdAt: new Date('2024-01-01')
        },
        {
          id: 'rule-3',
          name: 'Free Shipping Weekend',
          description: 'Free shipping on all orders',
          type: 'free_shipping',
          value: 0,
          conditions: {
            minOrderValue: 25
          },
          active: false,
          priority: 3,
          validFrom: new Date('2024-01-05'),
          validTo: new Date('2024-01-07'),
          usageCount: 234,
          createdAt: new Date('2024-01-04')
        }
      ];

      setRules(mockRules);
      
      // Calculate stats
      const totalRules = mockRules.length;
      const activeRules = mockRules.filter(rule => rule.active).length;
      const expiredRules = mockRules.filter(rule => rule.validTo < new Date()).length;
      const totalUsage = mockRules.reduce((sum, rule) => sum + rule.usageCount, 0);
      
      setStats({
        totalRules,
        activeRules,
        expiredRules,
        totalUsage,
        totalSavings: 12450,
        conversionRate: 15.8
      });
    } catch (error) {
      console.error('Error loading discount data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRule = (ruleId: string) => {
    console.log('Testing rule:', ruleId);
    // Add test logic here
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this discount rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fixed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'bundle':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'free_shipping':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDiscountTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'ri-percent-line';
      case 'fixed':
        return 'ri-money-dollar-circle-line';
      case 'bundle':
        return 'ri-gift-line';
      case 'free_shipping':
        return 'ri-truck-line';
      default:
        return 'ri-price-tag-3-line';
    }
  };

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discount Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage discount rules, promotions, and pricing strategies
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap"
            >
              <i className="ri-add-line"></i>
              <span>Create Rule</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <i className="ri-price-tag-3-line text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rules</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <i className="ri-check-line text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Rules</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-red-600 dark:text-red-400 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Expired Rules</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.expiredRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <i className="ri-bar-chart-line text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
                { id: 'rules', label: 'Rules', icon: 'ri-price-tag-3-line' },
                { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' },
                { id: 'settings', label: 'Settings', icon: 'ri-settings-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Active Discount Rules</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search rules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap"
                  >
                    <i className="ri-add-line"></i>
                    <span>Create Rule</span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredRules.map((rule) => (
                    <div key={rule.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{rule.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDiscountTypeColor(rule.type)}`}>
                              <i className={`${getDiscountTypeIcon(rule.type)} mr-1`}></i>
                              {rule.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rule.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {rule.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{rule.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Discount:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {rule.type === 'percentage' ? `${rule.value}%` :
                                  rule.type === 'fixed' ? `$${rule.value}` :
                                    rule.type === 'bundle' ? `$${rule.bundlePrice}` : 'Free Shipping'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Priority:</span>
                              <p className="font-medium text-gray-900 dark:text-white">{rule.priority}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Usage:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {rule.usageCount}{rule.usageLimit ? `/${rule.usageLimit}` : ''}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Valid Until:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {rule.validTo.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleTestRule(rule.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Test Rule"
                          >
                            <i className="ri-play-line text-lg"></i>
                          </button>
                          <button
                            onClick={() => handleToggleRule(rule.id)}
                            className={`p-2 transition-colors ${
                              rule.active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-green-600'
                            }`}
                            title={rule.active ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`${rule.active ? 'ri-pause-line' : 'ri-play-line'} text-lg`}></i>
                          </button>
                          <button
                            onClick={() => setSelectedRule(rule)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Rule"
                          >
                            <i className="ri-edit-line text-lg"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Rule"
                          >
                            <i className="ri-delete-bin-line text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.totalSavings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Customer Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.conversionRate}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalUsage}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Redemptions</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Discount Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">Analytics features coming soon...</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Discount Settings</h3>
                <p className="text-gray-600 dark:text-gray-400">Settings configuration coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}