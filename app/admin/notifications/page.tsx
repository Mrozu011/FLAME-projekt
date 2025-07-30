
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { notificationService, Notification, NotificationRule, NotificationSettings } from '@/lib/notification-service';

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'rules' | 'settings'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getSettings());
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<NotificationRule>>({
    name: '',
    type: 'stock',
    condition: {
      field: 'quantity',
      operator: 'less_than',
      value: 5
    },
    active: true,
    priority: 'medium'
  });

  useEffect(() => {
    loadData();
    
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await notificationService.checkForNewNotifications();
      setNotifications(notificationService.getNotifications());
      setRules(notificationService.getRules());
      setSettings(notificationService.getSettings());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'mark_read':
        selectedNotifications.forEach(id => notificationService.markAsRead(id));
        break;
      case 'delete':
        selectedNotifications.forEach(id => notificationService.deleteNotification(id));
        break;
      case 'snooze':
        selectedNotifications.forEach(id => notificationService.snoozeNotification(id, 60));
        break;
    }
    setSelectedNotifications([]);
  };

  const handleCreateRule = () => {
    if (newRule.name && newRule.type && newRule.condition) {
      notificationService.addRule(newRule as Omit<NotificationRule, 'id' | 'createdAt'>);
      setNewRule({
        name: '',
        type: 'stock',
        condition: {
          field: 'quantity',
          operator: 'less_than',
          value: 5
        },
        active: true,
        priority: 'medium'
      });
      setShowRuleForm(false);
      setRules(notificationService.getRules());
    }
  };

  const handleUpdateRule = (id: string, updates: Partial<NotificationRule>) => {
    notificationService.updateRule(id, updates);
    setRules(notificationService.getRules());
  };

  const handleDeleteRule = (id: string) => {
    notificationService.deleteRule(id);
    setRules(notificationService.getRules());
  };

  const handleUpdateSettings = (updates: Partial<NotificationSettings>) => {
    const newSettings = { ...settings, ...updates };
    notificationService.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesPriority && matchesSearch;
  });

  const statistics = notificationService.getStatistics();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return 'ri-shopping-bag-line';
      case 'return_request':
        return 'ri-arrow-go-back-line';
      case 'stock_warning':
        return 'ri-alert-line';
      case 'payment_failed':
        return 'ri-error-warning-line';
      case 'shipping_delay':
        return 'ri-truck-line';
      default:
        return 'ri-notification-line';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
                <p className="text-gray-600">Manage alerts, rules, and notification settings</p>
              </div>
              <button
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <i className={`ri-refresh-line mr-2 ${isLoading ? 'animate-spin' : ''}`}></i>
                Refresh
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-notification-line text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.unread}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-mail-unread-line text-orange-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.byPriority.urgent || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-alarm-warning-line text-red-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Rules</p>
                    <p className="text-2xl font-bold text-gray-900">{rules.filter(r => r.active).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-settings-3-line text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'notifications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'rules'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Rules
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative">
                      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="new_order">New Orders</option>
                      <option value="return_request">Return Requests</option>
                      <option value="stock_warning">Stock Warnings</option>
                      <option value="payment_failed">Payment Failed</option>
                      <option value="shipping_delay">Shipping Delays</option>
                    </select>
                    
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  
                  {selectedNotifications.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedNotifications.length} selected
                      </span>
                      <button
                        onClick={() => handleBulkAction('mark_read')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Mark Read
                      </button>
                      <button
                        onClick={() => handleBulkAction('snooze')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                      >
                        Snooze
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-lg shadow">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <i className="ri-notification-line text-4xl text-gray-400 mb-4"></i>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                      <p className="text-gray-600">Try adjusting your filters or search query</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-6 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={selectedNotifications.includes(notification.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedNotifications([...selectedNotifications, notification.id]);
                                  } else {
                                    setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </div>
                            
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getPriorityColor(notification.priority)}`}>
                              <i className={`${getNotificationIcon(notification.type)} text-sm`}></i>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                    {notification.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(notification.createdAt)}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              
                              <div className="flex items-center space-x-4 mt-3">
                                {!notification.read && (
                                  <button
                                    onClick={() => notificationService.markAsRead(notification.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => notificationService.snoozeNotification(notification.id, 60)}
                                  className="text-xs text-yellow-600 hover:text-yellow-800 transition-colors"
                                >
                                  Snooze 1h
                                </button>
                                
                                <button
                                  onClick={() => notificationService.deleteNotification(notification.id)}
                                  className="text-xs text-red-600 hover:text-red-800 transition-colors"
                                >
                                  Delete
                                </button>
                                
                                {notification.actionUrl && (
                                  <a
                                    href={notification.actionUrl}
                                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    View details
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Rules</h2>
                  <button
                    onClick={() => setShowRuleForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Rule
                  </button>
                </div>

                {/* Rule Form */}
                {showRuleForm && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Rule</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                        <input
                          type="text"
                          value={newRule.name}
                          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter rule name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={newRule.type}
                          onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="stock">Stock</option>
                          <option value="orders">Orders</option>
                          <option value="returns">Returns</option>
                          <option value="payments">Payments</option>
                          <option value="shipping">Shipping</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                        <input
                          type="text"
                          value={newRule.condition?.field || ''}
                          onChange={(e) => setNewRule({
                            ...newRule,
                            condition: { ...newRule.condition!, field: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., quantity, status"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                        <select
                          value={newRule.condition?.operator || ''}
                          onChange={(e) => setNewRule({
                            ...newRule,
                            condition: { ...newRule.condition!, operator: e.target.value as any }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="less_than">Less than</option>
                          <option value="greater_than">Greater than</option>
                          <option value="equals">Equals</option>
                          <option value="older_than">Older than</option>
                          <option value="contains">Contains</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={newRule.condition?.value || ''}
                          onChange={(e) => setNewRule({
                            ...newRule,
                            condition: { ...newRule.condition!, value: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter value"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={newRule.priority}
                          onChange={(e) => setNewRule({ ...newRule, priority: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowRuleForm(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateRule}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Rule
                      </button>
                    </div>
                  </div>
                )}

                {/* Rules List */}
                <div className="bg-white rounded-lg shadow">
                  <div className="divide-y divide-gray-200">
                    {rules.map((rule) => (
                      <div key={rule.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={rule.active}
                                  onChange={(e) => handleUpdateRule(rule.id, { active: e.target.checked })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                              <p className="text-sm text-gray-600">
                                {rule.type} • {rule.condition.field} {rule.condition.operator} {rule.condition.value}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                                  {rule.priority}
                                </span>
                                {rule.lastTriggered && (
                                  <span className="text-xs text-gray-500">
                                    Last triggered: {formatTimeAgo(rule.lastTriggered)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingRule(rule)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteRule(rule.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable Email Summary</label>
                        <p className="text-sm text-gray-500">Receive daily or weekly email summaries of unhandled alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailSummary.enabled}
                          onChange={(e) => handleUpdateSettings({
                            emailSummary: { ...settings.emailSummary, enabled: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {settings.emailSummary.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                          <select
                            value={settings.emailSummary.frequency}
                            onChange={(e) => handleUpdateSettings({
                              emailSummary: { ...settings.emailSummary, frequency: e.target.value as any }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <input
                            type="time"
                            value={settings.emailSummary.time}
                            onChange={(e) => handleUpdateSettings({
                              emailSummary: { ...settings.emailSummary, time: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={settings.emailSummary.email}
                            onChange={(e) => handleUpdateSettings({
                              emailSummary: { ...settings.emailSummary, email: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="admin@example.com"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Auto Refresh</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable Auto Refresh</label>
                        <p className="text-sm text-gray-500">Automatically check for new notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoRefresh.enabled}
                          onChange={(e) => handleUpdateSettings({
                            autoRefresh: { ...settings.autoRefresh, enabled: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {settings.autoRefresh.enabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refresh Interval (seconds)</label>
                        <input
                          type="number"
                          value={settings.autoRefresh.interval / 1000}
                          onChange={(e) => handleUpdateSettings({
                            autoRefresh: { ...settings.autoRefresh, interval: parseInt(e.target.value) * 1000 }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="5"
                          max="300"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Other Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Sound Notifications</label>
                        <p className="text-sm text-gray-500">Play sound for new notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.soundEnabled}
                          onChange={(e) => handleUpdateSettings({ soundEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Desktop Notifications</label>
                        <p className="text-sm text-gray-500">Show browser notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.desktopNotifications}
                          onChange={(e) => handleUpdateSettings({ desktopNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Notifications</label>
                      <input
                        type="number"
                        value={settings.maxNotifications}
                        onChange={(e) => handleUpdateSettings({ maxNotifications: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="10"
                        max="1000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Auto Mark Read After (hours)</label>
                      <input
                        type="number"
                        value={settings.autoMarkReadAfter / (1000 * 60 * 60)}
                        onChange={(e) => handleUpdateSettings({ autoMarkReadAfter: parseInt(e.target.value) * 1000 * 60 * 60 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="168"
                      />
                      <p className="text-sm text-gray-500 mt-1">Set to 0 to disable auto mark as read</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
