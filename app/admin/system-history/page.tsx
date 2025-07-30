
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { activityLogger, ActivityLog, ActivityLogFilter } from '@/lib/activity-logger';

export default function SystemHistoryPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const [filters, setFilters] = useState<ActivityLogFilter>({
    adminName: '',
    actionType: '',
    dateFrom: '',
    dateTo: '',
    severity: '',
    search: ''
  });

  const itemsPerPage = 25;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [currentPage, filters]);

  const loadLogs = () => {
    setLoading(true);
    try {
      const result = activityLogger.getLogs(filters, currentPage, itemsPerPage);
      setLogs(result.logs);
      setTotalLogs(result.total);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const statistics = activityLogger.getStats();
      setStats(statistics);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleFilterChange = (key: keyof ActivityLogFilter, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      adminName: '',
      actionType: '',
      dateFrom: '',
      dateTo: '',
      severity: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csvData = activityLogger.exportLogs(filters);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('Activity logs exported successfully', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLogs = () => {
    activityLogger.clearLogs();
    loadLogs();
    loadStats();
    setShowClearModal(false);
    showNotification('Activity logs cleared successfully', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="${type === 'success' ? 'ri-check-circle-line' : type === 'error' ? 'ri-error-warning-line' : 'ri-information-line'} mr-2"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  };

  const getActionTypeColor = (type: string) => {
    const colors = {
      login: 'bg-green-100 text-green-800',
      logout: 'bg-gray-100 text-gray-800',
      product: 'bg-blue-100 text-blue-800',
      order: 'bg-purple-100 text-purple-800',
      user: 'bg-yellow-100 text-yellow-800',
      discount: 'bg-orange-100 text-orange-800',
      system: 'bg-red-100 text-red-800',
      settings: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityIcon = (severity: string) => {
    const icons = {
      info: 'ri-information-line',
      success: 'ri-check-circle-line',
      warning: 'ri-alert-line',
      error: 'ri-error-warning-line'
    };
    return icons[severity as keyof typeof icons] || 'ri-information-line';
  };

  const getActionTypeIcon = (type: string) => {
    const icons = {
      login: 'ri-login-circle-line',
      logout: 'ri-logout-circle-line',
      product: 'ri-box-3-line',
      order: 'ri-shopping-bag-line',
      user: 'ri-user-line',
      discount: 'ri-coupon-line',
      system: 'ri-settings-3-line',
      settings: 'ri-settings-line'
    };
    return icons[type as keyof typeof icons] || 'ri-information-line';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const totalPages = Math.ceil(totalLogs / itemsPerPage);

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
            <h1 className="text-lg font-semibold text-gray-900">System History</h1>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-50"
            >
              <i className={`${isExporting ? 'ri-loader-4-line animate-spin' : 'ri-download-line'} text-xl`}></i>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">System History</h1>
                <p className="text-sm lg:text-base text-gray-600">Track all admin activities and system events</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {isExporting ? (
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                  ) : (
                    <i className="ri-download-line mr-2"></i>
                  )}
                  Export CSV
                </button>
                <button
                  onClick={() => setShowClearModal(true)}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line mr-2"></i>
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <i className="ri-file-list-line text-blue-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">Total Logs</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <i className="ri-calendar-line text-green-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">Today</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.today || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <i className="ri-calendar-2-line text-purple-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">This Week</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.thisWeek || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <i className="ri-error-warning-line text-orange-600 text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">Errors</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.bySeverity?.error || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 lg:mb-8">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search actions or descriptions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                    <input
                      type="text"
                      value={filters.adminName}
                      onChange={(e) => handleFilterChange('adminName', e.target.value)}
                      placeholder="Filter by admin name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                    <select
                      value={filters.actionType}
                      onChange={(e) => handleFilterChange('actionType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
                    >
                      <option value="">All Actions</option>
                      <option value="login">Login</option>
                      <option value="logout">Logout</option>
                      <option value="product">Product</option>
                      <option value="order">Order</option>
                      <option value="user">User</option>
                      <option value="discount">Discount</option>
                      <option value="system">System</option>
                      <option value="settings">Settings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                    <select
                      value={filters.severity}
                      onChange={(e) => handleFilterChange('severity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
                    >
                      <option value="">All Severities</option>
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 space-y-2 sm:space-y-0">
                  <button
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Clear All Filters
                  </button>
                  <div className="text-sm text-gray-600">
                    Showing {logs.length} of {totalLogs} logs
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading activity logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="ri-file-list-line text-gray-400 text-4xl mb-4"></i>
                  <p className="text-gray-600">No activity logs found</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  {isMobile ? (
                    <div className="divide-y divide-gray-200">
                      {logs.map((log) => {
                        const timestamp = formatTimestamp(log.timestamp);
                        return (
                          <div key={log.id} className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getSeverityColor(log.severity)}`}>
                                <i className={`${getSeverityIcon(log.severity)} text-sm`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionTypeColor(log.actionType)}`}>
                                    <i className={`${getActionTypeIcon(log.actionType)} mr-1`}></i>
                                    {log.actionType}
                                  </span>
                                  <span className="text-xs text-gray-500">{timestamp.relative}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">{log.action}</p>
                                <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">{log.adminName}</span>
                                  <button
                                    onClick={() => {
                                      setSelectedLog(log);
                                      setShowDetails(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Desktop Table Layout */
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {logs.map((log) => {
                            const timestamp = formatTimestamp(log.timestamp);
                            return (
                              <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div>{timestamp.date}</div>
                                  <div className="text-xs text-gray-500">{timestamp.time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{log.adminName}</div>
                                  <div className="text-xs text-gray-500">{log.adminId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{log.action}</div>
                                  {log.resourceId && (
                                    <div className="text-xs text-gray-500">ID: {log.resourceId}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionTypeColor(log.actionType)}`}>
                                    <i className={`${getActionTypeIcon(log.actionType)} mr-1`}></i>
                                    {log.actionType}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{log.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                                    <i className={`${getSeverityIcon(log.severity)} mr-1`}></i>
                                    {log.severity}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => {
                                      setSelectedLog(log);
                                      setShowDetails(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Activity Log Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">ID:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedLog.id}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Admin:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedLog.adminName} ({selectedLog.adminId})</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Action:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedLog.action}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getActionTypeColor(selectedLog.actionType)}`}>
                        <i className={`${getActionTypeIcon(selectedLog.actionType)} mr-1`}></i>
                        {selectedLog.actionType}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Severity:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getSeverityColor(selectedLog.severity)}`}>
                        <i className={`${getSeverityIcon(selectedLog.severity)} mr-1`}></i>
                        {selectedLog.severity}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Timestamp:</span>
                      <span className="text-sm text-gray-900 ml-2">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Technical Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">IP Address:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedLog.ipAddress || 'N/A'}</span>
                    </div>
                    {selectedLog.resourceId && (
                      <div>
                        <span className="text-sm text-gray-600">Resource ID:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedLog.resourceId}</span>
                      </div>
                    )}
                    {selectedLog.resourceType && (
                      <div>
                        <span className="text-sm text-gray-600">Resource Type:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedLog.resourceType}</span>
                      </div>
                    )}
                    {selectedLog.userAgent && (
                      <div>
                        <span className="text-sm text-gray-600">User Agent:</span>
                        <span className="text-sm text-gray-900 ml-2 break-all">{selectedLog.userAgent}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLog.description}</p>
              </div>

              {selectedLog.changes && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Changes</h4>
                  <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedLog.changes, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clear Logs Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <i className="ri-error-warning-line text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Clear All Logs</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to clear all activity logs? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Clear Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
