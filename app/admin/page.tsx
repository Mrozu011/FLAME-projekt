'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardCharts from '@/components/admin/DashboardCharts';
import NotificationCenter from '@/components/admin/NotificationCenter';
import { useAdminTranslation, useNumberFormat } from '@/hooks/useAdminTranslation';
import { AdminTranslationProvider } from '@/hooks/useAdminTranslation';

function AdminDashboardContent() {
  const { t } = useAdminTranslation();
  const { formatCurrency, formatNumber, formatRelativeTime } = useNumberFormat();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    todayOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    lifetimeRevenue: 0,
    todayVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    conversionRate: 0
  });

  const [analyticsData, setAnalyticsData] = useState<{
    revenueData: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    ordersByStatus: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    topProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
    }>;
    trafficData: Array<{
      date: string;
      visitors: number;
      pageViews: number;
      bounceRate: number;
    }>;
    userGrowthData: Array<{
      month: string;
      users: number;
      newUsers: number;
    }>;
  }>({
    revenueData: [],
    ordersByStatus: [],
    topProducts: [],
    trafficData: [],
    userGrowthData: []
  });

  const [recentOrders, setRecentOrders] = useState<Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: string;
    message: string;
    time: string;
  }>>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange, customDateRange]);

  const loadDashboardData = () => {
    const mockData = {
      totalOrders: 1247,
      totalRevenue: 89534.67,
      totalCustomers: 892,
      totalProducts: 156,
      pendingOrders: 23,
      lowStockItems: 8,
      todayOrders: 15,
      todayRevenue: 2840.30,
      monthlyRevenue: 45230.85,
      lifetimeRevenue: 234567.89,
      todayVisitors: 1234,
      bounceRate: 32.5,
      avgSessionDuration: 245,
      conversionRate: 3.2
    };

    const mockAnalytics = {
      revenueData: [
        { date: '2024-01-01', revenue: 4200, orders: 24 },
        { date: '2024-01-02', revenue: 3800, orders: 19 },
        { date: '2024-01-03', revenue: 5100, orders: 31 },
        { date: '2024-01-04', revenue: 4600, orders: 28 },
        { date: '2024-01-05', revenue: 3900, orders: 22 },
        { date: '2024-01-06', revenue: 6200, orders: 35 },
        { date: '2024-01-07', revenue: 5800, orders: 33 }
      ],
      ordersByStatus: [
        { status: t('orders.statusPaid') || 'Paid', count: 145, percentage: 65 },
        { status: t('orders.statusPending') || 'Pending', count: 23, percentage: 10 },
        { status: t('orders.statusShipped') || 'Shipped', count: 34, percentage: 15 },
        { status: t('orders.statusReturned') || 'Returned', count: 12, percentage: 5 },
        { status: t('orders.statusCancelled') || 'Cancelled', count: 11, percentage: 5 }
      ],
      topProducts: [
        { name: 'Premium Leather Jacket', sales: 89, revenue: 12450 },
        { name: 'Designer Silk Dress', sales: 67, revenue: 9380 },
        { name: 'Wireless Earbuds Pro', sales: 134, revenue: 8040 },
        { name: 'Organic Cotton T-Shirt', sales: 156, revenue: 7020 },
        { name: 'Sports Running Shoes', sales: 78, revenue: 6240 }
      ],
      trafficData: [
        { date: '2024-01-01', visitors: 1200, pageViews: 3400, bounceRate: 34 },
        { date: '2024-01-02', visitors: 980, pageViews: 2890, bounceRate: 38 },
        { date: '2024-01-03', visitors: 1450, pageViews: 4100, bounceRate: 29 },
        { date: '2024-01-04', visitors: 1320, pageViews: 3680, bounceRate: 31 },
        { date: '2024-01-05', visitors: 1100, pageViews: 3200, bounceRate: 35 },
        { date: '2024-01-06', visitors: 1680, pageViews: 4890, bounceRate: 27 },
        { date: '2024-01-07', visitors: 1560, pageViews: 4320, bounceRate: 30 }
      ],
      userGrowthData: [
        { month: 'Jul', users: 234, newUsers: 45 },
        { month: 'Aug', users: 289, newUsers: 67 },
        { month: 'Sep', users: 356, newUsers: 89 },
        { month: 'Oct', users: 445, newUsers: 112 },
        { month: 'Nov', users: 567, newUsers: 134 },
        { month: 'Dec', users: 698, newUsers: 156 },
        { month: 'Jan', users: 892, newUsers: 189 }
      ]
    };

    const mockRecentOrders = [
      { id: 'FL001', customer: 'John Smith', amount: 299.99, status: 'processing', date: '2024-01-15' },
      { id: 'FL002', customer: 'Sarah Johnson', amount: 149.50, status: 'shipped', date: '2024-01-14' },
      { id: 'FL003', customer: 'Mike Chen', amount: 89.99, status: 'delivered', date: '2024-01-13' },
      { id: 'FL004', customer: 'Emma Wilson', amount: 199.99, status: 'pending', date: '2024-01-12' },
      { id: 'FL005', customer: 'David Brown', amount: 79.99, status: 'cancelled', date: '2024-01-11' }
    ];

    const mockRecentActivity = [
      { type: 'order', message: t('notifications.newOrder') + ' #FL001', time: '2 minutes ago' },
      { type: 'product', message: t('notifications.lowStock') + ' "Wireless Headphones"', time: '15 minutes ago' },
      { type: 'customer', message: t('notifications.customerRegistered'), time: '1 hour ago' },
      { type: 'system', message: t('notifications.backupCompleted'), time: '2 hours ago' },
      { type: 'order', message: t('orders.statusShipped') + ' #FL002', time: '3 hours ago' }
    ];

    setDashboardData(mockData);
    setAnalyticsData(mockAnalytics);
    setRecentOrders(mockRecentOrders);
    setRecentActivity(mockRecentActivity);
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    if (range !== 'custom') {
      setShowCustomDatePicker(false);
    } else {
      setShowCustomDatePicker(true);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (format === 'csv') {
        const csvData = generateCSVData();
        downloadFile(csvData, 'dashboard-analytics.csv', 'text/csv');
      } else if (format === 'excel') {
        const excelData = generateExcelData();
        downloadFile(excelData, 'dashboard-analytics.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSVData = () => {
    const headers = [t('common.date'), t('dashboard.revenue'), t('dashboard.orders'), 'Visitors', t('dashboard.conversionRate')];
    const rows = analyticsData.revenueData.map(item => [
      item.date,
      item.revenue,
      item.orders,
      analyticsData.trafficData.find(t => t.date === item.date)?.visitors || 0,
      dashboardData.conversionRate
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\\n');
  };

  const generateExcelData = () => {
    return 'Excel data would be generated here';
  };

  const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const getActivityIcon = (type: string) => {
    const iconConfig: Record<string, string> = {
      order: '📦',
      product: '🛍️',
      customer: '👤',
      system: '⚙️'
    };
    return iconConfig[type] || '📋';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            <h1 className="text-lg font-semibold text-gray-900">{t('navigation.dashboard')}</h1>
            <NotificationCenter />
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header with Time Range Selector */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
                <p className="text-sm lg:text-base text-gray-600">{t('dashboard.subtitle')}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Notification Center for Desktop */}
                {!isMobile && (
                  <NotificationCenter />
                )}

                {/* Time Range Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <label className="text-sm font-medium text-gray-700">{t('dashboard.timeRange')}:</label>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="7d">{t('dashboard.last7Days')}</option>
                    <option value="30d">{t('dashboard.last30Days')}</option>
                    <option value="90d">{t('dashboard.last90Days')}</option>
                    <option value="1y">{t('dashboard.lastYear')}</option>
                    <option value="custom">{t('dashboard.customRange')}</option>
                  </select>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                    className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    {isExporting ? (
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                    ) : (
                      <i className="ri-file-text-line mr-2"></i>
                    )}
                    <span className="hidden sm:inline">{t('dashboard.exportCsv')}</span>
                    <span className="sm:hidden">CSV</span>
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    disabled={isExporting}
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    {isExporting ? (
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                    ) : (
                      <i className="ri-file-excel-2-line mr-2"></i>
                    )}
                    <span className="hidden sm:inline">{t('dashboard.exportExcel')}</span>
                    <span className="sm:hidden">Excel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Date Range Picker */}
            {showCustomDatePicker && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.startDate')}</label>
                    <input
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.endDate')}</label>
                    <input
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={loadDashboardData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 self-end"
                  >
                    {t('common.apply')}
                  </button>
                </div>
              </div>
            )}

            {/* Revenue Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">{t('dashboard.todayRevenue')}</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-green-600">{formatCurrency(dashboardData.todayRevenue)}</p>
                    <p className="text-xs lg:text-sm text-gray-500">+12.5% {t('dashboard.fromYesterday')}</p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-dollar-circle-line text-green-600 text-lg lg:text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">{t('dashboard.monthlyRevenue')}</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-blue-600">{formatCurrency(dashboardData.monthlyRevenue)}</p>
                    <p className="text-xs lg:text-sm text-gray-500">+8.3% {t('dashboard.fromLastMonth')}</p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-calendar-line text-blue-600 text-lg lg:text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6 md:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">{t('dashboard.lifetimeRevenue')}</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-purple-600">{formatCurrency(dashboardData.lifetimeRevenue)}</p>
                    <p className="text-xs lg:text-sm text-gray-500">{t('dashboard.allTime')}</p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-line-chart-line text-purple-600 text-lg lg:text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic & Performance Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 lg:mb-0 lg:mr-4">
                    <i className="ri-eye-line text-orange-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">{t('dashboard.todayVisitors')}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatNumber(dashboardData.todayVisitors)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 lg:mb-0 lg:mr-4">
                    <i className="ri-cursor-line text-red-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">{t('dashboard.bounceRate')}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardData.bounceRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 lg:mb-0 lg:mr-4">
                    <i className="ri-time-line text-indigo-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">{t('dashboard.avgSession')}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatDuration(dashboardData.avgSessionDuration)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3 lg:mb-0 lg:mr-4">
                    <i className="ri-shopping-cart-line text-teal-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">{t('dashboard.conversionRate')}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardData.conversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-6 lg:mb-8">
              <DashboardCharts
                analyticsData={analyticsData}
                timeRange={selectedTimeRange}
              />
            </div>

            {/* Top Products and Order Status */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">{t('dashboard.topProducts')}</h2>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    {analyticsData.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs lg:text-sm font-bold text-blue-600">#{index + 1}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{product.name}</p>
                            <p className="text-xs lg:text-sm text-gray-600">{product.sales} {t('dashboard.units')}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-medium text-gray-900 text-sm lg:text-base">{formatCurrency(product.revenue)}</p>
                          <p className="text-xs lg:text-sm text-gray-500">{t('dashboard.revenue')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders by Status */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">{t('dashboard.ordersByStatus')}</h2>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    {analyticsData.ordersByStatus.map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div
                            className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0 ${
                              status.status === 'Paid' || status.status.includes('Zapłacone') ? 'bg-green-500' :
                                status.status === 'Pending' || status.status.includes('Oczekuje') ? 'bg-yellow-500' :
                                  status.status === 'Shipped' || status.status.includes('Wysłane') ? 'bg-blue-500' :
                                    status.status === 'Returned' || status.status.includes('Zwrócone') ? 'bg-orange-500' :
                                      'bg-red-500'
                            }`}
                          ></div>
                          <span className="font-medium text-gray-900 text-sm lg:text-base">{status.status}</span>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-4">
                          <span className="text-xs lg:text-sm text-gray-600">{status.count} {t('dashboard.orders')}</span>
                          <div className="w-16 lg:w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                status.status === 'Paid' || status.status.includes('Zapłacone') ? 'bg-green-500' :
                                  status.status === 'Pending' || status.status.includes('Oczekuje') ? 'bg-yellow-500' :
                                    status.status === 'Shipped' || status.status.includes('Wysłane') ? 'bg-blue-500' :
                                      status.status === 'Returned' || status.status.includes('Zwrócone') ? 'bg-orange-500' :
                                        'bg-red-500'
                              }`}
                              style={{ width: `${status.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs lg:text-sm font-medium text-gray-900">{status.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders and Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900">{t('dashboard.recentOrders')}</h2>
                    <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                      {t('dashboard.viewAll')}
                    </Link>
                  </div>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="ri-shopping-bag-line text-blue-600 text-sm lg:text-base"></i>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm lg:text-base">#{order.id}</p>
                            <p className="text-xs lg:text-sm text-gray-600 truncate">{order.customer}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-medium text-gray-900 text-sm lg:text-base">{formatCurrency(order.amount)}</p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {t(`orders.status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`) || order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i
                            className={`${getActivityIcon(activity.type)} text-gray-600 text-xs lg:text-sm`}
                          ></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm lg:text-base text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            <button
              className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <i className="ri-add-line text-xl"></i>
            </button>
            {/* Quick Actions Menu */}
            <div className="absolute bottom-16 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 hidden">
              <Link href="/admin/products/create" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                <i className="ri-box-3-line mr-3"></i>
                {t('products.addProduct')}
              </Link>
              <Link href="/admin/orders" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                <i className="ri-shopping-bag-line mr-3"></i>
                {t('dashboard.viewAll')} {t('navigation.orders')}
              </Link>
              <Link href="/admin/support" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                <i className="ri-customer-service-line mr-3"></i>
                {t('navigation.support')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminTranslationProvider>
      <AdminDashboardContent />
    </AdminTranslationProvider>
  );
}
