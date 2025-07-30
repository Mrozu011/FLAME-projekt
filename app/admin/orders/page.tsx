
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { invoiceService } from '@/lib/invoice-service';
import { activityLogger } from '@/lib/activity-logger';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [automationRules, setAutomationRules] = useState({
    emailOnPaid: true,
    autoShippingLabel: true,
    autoOutOfStock: true
  });

  const itemsPerPage = isMobile ? 5 : 10;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const orderStatuses = {
    'pending-payment': {
      label: 'Pending Payment',
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'ri-time-line',
      description: 'Awaiting payment confirmation'
    },
    'paid': {
      label: 'Paid',
      color: 'bg-green-100 text-green-800',
      icon: 'ri-check-line',
      description: 'Payment confirmed'
    },
    'packing': {
      label: 'Packing',
      color: 'bg-blue-100 text-blue-800',
      icon: 'ri-package-line',
      description: 'Order being prepared'
    },
    'shipped': {
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-800',
      icon: 'ri-truck-line',
      description: 'Package in transit'
    },
    'delivered': {
      label: 'Delivered',
      color: 'bg-green-100 text-green-800',
      icon: 'ri-check-double-line',
      description: 'Package delivered'
    },
    'cancelled': {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: 'ri-close-line',
      description: 'Order cancelled'
    }
  };

  const paymentStatuses = {
    'pending': {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'ri-time-line'
    },
    'paid': {
      label: 'Paid',
      color: 'bg-green-100 text-green-800',
      icon: 'ri-check-line'
    },
    'failed': {
      label: 'Failed',
      color: 'bg-red-100 text-red-800',
      icon: 'ri-close-line'
    },
    'refunded': {
      label: 'Refunded',
      color: 'bg-purple-100 text-purple-800',
      icon: 'ri-refund-line'
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'FL001',
          customer: 'John Smith',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          amount: 299.99,
          status: 'packing',
          paymentStatus: 'paid',
          date: '2024-01-15',
          orderDate: '2024-01-15T08:00:00Z',
          items: [
            { id: 1, name: 'Premium Wireless Headphones', quantity: 1, price: 149.99, sku: 'PWH-001' },
            { id: 2, name: 'Wireless Charging Pad', quantity: 1, price: 39.99, sku: 'WCP-002' }
          ],
          shipping: {
            address: '123 Main St, New York, NY 10001',
            method: 'Standard Shipping',
            tracking: 'TRK123456789'
          },
          type: 'our',
          priority: 'normal'
        },
        {
          id: 'FL002',
          customer: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1 (555) 987-6543',
          amount: 149.50,
          status: 'shipped',
          paymentStatus: 'paid',
          date: '2024-01-14',
          orderDate: '2024-01-14T10:30:00Z',
          items: [
            { id: 3, name: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99, sku: 'OCT-003' },
            { id: 4, name: 'Eco-Friendly Water Bottle', quantity: 1, price: 24.99, sku: 'EWB-004' }
          ],
          shipping: {
            address: '456 Oak Ave, Los Angeles, CA 90210',
            method: 'Express Shipping',
            tracking: 'TRK987654321'
          },
          type: 'our',
          priority: 'high'
        },
        {
          id: 'FL003',
          customer: 'Mike Chen',
          email: 'mike@example.com',
          phone: '+1 (555) 456-7890',
          amount: 89.99,
          status: 'delivered',
          paymentStatus: 'paid',
          date: '2024-01-13',
          orderDate: '2024-01-13T14:15:00Z',
          items: [
            { id: 5, name: 'Bluetooth Speaker', quantity: 1, price: 89.99, sku: 'BTS-005' }
          ],
          shipping: {
            address: '789 Pine St, Chicago, IL 60601',
            method: 'Standard Shipping',
            tracking: 'TRK456789123'
          },
          type: 'dropship',
          priority: 'normal'
        },
        {
          id: 'FL004',
          customer: 'Emma Wilson',
          email: 'emma@example.com',
          phone: '+1 (555) 234-5678',
          amount: 199.99,
          status: 'pending-payment',
          paymentStatus: 'pending',
          date: '2024-01-12',
          orderDate: '2024-01-12T16:45:00Z',
          items: [
            { id: 6, name: 'Smart Fitness Watch', quantity: 1, price: 199.99, sku: 'SFW-006' }
          ],
          shipping: {
            address: '321 Elm St, Miami, FL 33101',
            method: 'Express Shipping',
            tracking: ''
          },
          type: 'dropship',
          priority: 'normal'
        },
        {
          id: 'FL005',
          customer: 'David Brown',
          email: 'david@example.com',
          phone: '+1 (555) 345-6789',
          amount: 79.99,
          status: 'cancelled',
          paymentStatus: 'refunded',
          date: '2024-01-11',
          orderDate: '2024-01-11T09:20:00Z',
          items: [
            { id: 7, name: 'Wireless Mouse', quantity: 1, price: 79.99, sku: 'WM-007' }
          ],
          shipping: {
            address: '654 Maple Ave, Seattle, WA 98101',
            method: 'Standard Shipping',
            tracking: ''
          },
          type: 'our',
          priority: 'low'
        }
      ];

      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      let startDate = new Date();

      switch (dateFilter) {
        case 'today':
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          break;
        case 'week':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
      }

      filtered = filtered.filter(order => new Date(order.orderDate) >= startDate);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, dateFilter, orders]);

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowUpdateModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    const oldStatus = selectedOrder.status;

    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, status: newStatus }
        : order
    );
    setOrders(updatedOrders);

    // Log the order status update
    activityLogger.logOrderUpdate(selectedOrder.id, oldStatus, newStatus);

    await applyAutomationRules(selectedOrder, oldStatus, newStatus);

    // Auto-generate invoice when status changes to paid
    if (newStatus === 'paid' && oldStatus !== 'paid') {
      try {
        const invoice = await invoiceService.generateInvoice(selectedOrder);
        activityLogger.log(
          'Invoice Generated',
          'order',
          `Invoice ${invoice.invoiceNumber} generated for order #${selectedOrder.id}`,
          {
            resourceId: selectedOrder.id,
            resourceType: 'order',
            severity: 'success'
          }
        );
        showNotification(`Invoice ${invoice.invoiceNumber} generated successfully`, 'success');
      } catch (error) {
        console.error('Error generating invoice:', error);
        activityLogger.logSystemError('Invoice generation failed', `Order: ${selectedOrder.id}`);
        showNotification('Invoice generation failed', 'error');
      }
    }

    setShowUpdateModal(false);
    setSelectedOrder(null);

    showNotification(`Order ${selectedOrder.id} status updated to "${orderStatuses[newStatus].label}"`, 'success');
  };

  const applyAutomationRules = async (order, oldStatus, newStatus) => {
    // Automation logic here
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-black' :
      'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="${type === 'success' ? 'ri-check-circle-line' : type === 'error' ? 'ri-error-warning-line' : type === 'warning' ? 'ri-alert-line' : 'ri-information-line'} mr-2"></i>
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

  const handleGenerateInvoice = async (order) => {
    try {
      const invoice = await invoiceService.generateInvoice(order);
      showNotification(`Invoice ${invoice.invoiceNumber} generated successfully`, 'success');
      invoiceService.downloadInvoice(invoice);
    } catch (error) {
      console.error('Error generating invoice:', error);
      showNotification('Failed to generate invoice', 'error');
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      'pending-payment': orders.filter(o => o.status === 'pending-payment').length,
      'paid': orders.filter(o => o.status === 'paid').length,
      'packing': orders.filter(o => o.status === 'packing').length,
      'shipped': orders.filter(o => o.status === 'shipped').length,
      'delivered': orders.filter(o => o.status === 'delivered').length,
      'cancelled': orders.filter(o => o.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getOrderStats();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>
            )}
            <div className="flex-1 px-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-sm text-gray-500">Track and manage all customer orders</p>
            </div>
            <div className="flex items-center space-x-2">
              {isMobile && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <i className="ri-filter-line text-xl"></i>
                </button>
              )}
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <i className="ri-download-line mr-2"></i>
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white border-b">
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <i className="ri-file-list-line text-gray-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                    <i className="ri-time-line text-yellow-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Pending</p>
                    <p className="text-lg font-semibold text-gray-900">{stats['pending-payment']}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Paid</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.paid}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <i className="ri-package-line text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Packing</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.packing}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                    <i className="ri-truck-line text-purple-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Shipped</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.shipped}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <i className="ri-check-double-line text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Delivered</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.delivered}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <i className="ri-close-line text-red-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Cancelled</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`bg-white border-b transition-all duration-300 ${showFilters || !isMobile ? 'block' : 'hidden'}`}>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                <input
                  type="text"
                  placeholder="Search by order ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 text-sm"
                >
                  <option value="all">All Orders</option>
                  <option value="pending-payment">Pending Payment</option>
                  <option value="paid">Paid</option>
                  <option value="packing">Packing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 text-sm"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {/* Mobile Card Layout */}
            {isMobile ? (
              <div className="space-y-4">
                {currentItems.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="ri-shopping-bag-line text-blue-600"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">#{order.id}</h3>
                          <p className="text-sm text-gray-500">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.amount}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${orderStatuses[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                          <i className={`${orderStatuses[order.status]?.icon || 'ri-question-line'} mr-1`}></i>
                          {orderStatuses[order.status]?.label || order.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentStatuses[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800'}`}>
                          <i className={`${paymentStatuses[order.paymentStatus]?.icon || 'ri-question-line'} mr-1`}></i>
                          {paymentStatuses[order.paymentStatus]?.label || order.paymentStatus}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.type === 'our' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {order.type === 'our' ? 'Our Stock' : 'Dropship'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateStatus(order)}
                          className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Update Status"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="flex items-center justify-center w-10 h-10 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <i className="ri-eye-line"></i>
                        </Link>
                        <button
                          onClick={() => handleGenerateInvoice(order)}
                          className="flex items-center justify-center w-10 h-10 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                          title="Generate Invoice"
                        >
                          <i className="ri-file-text-line"></i>
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.length} item(s)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop Table Layout */
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                            <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                            <div className="text-sm text-gray-500">{order.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderStatuses[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                              <i className={`${orderStatuses[order.status]?.icon || 'ri-question-line'} mr-1`}></i>
                              {orderStatuses[order.status]?.label || order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatuses[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800'}`}>
                              <i className={`${paymentStatuses[order.paymentStatus]?.icon || 'ri-question-line'} mr-1`}></i>
                              {paymentStatuses[order.paymentStatus]?.label || order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.type === 'our' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                              {order.type === 'our' ? 'Our Stock' : 'Dropship'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUpdateStatus(order)}
                                className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                                title="Update Status"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="text-purple-600 hover:text-purple-900 w-8 h-8 flex items-center justify-center"
                                title="View Details"
                              >
                                <i className="ri-eye-line"></i>
                              </Link>
                              <button
                                onClick={() => handleGenerateInvoice(order)}
                                className="text-green-600 hover:text-green-900 w-8 h-8 flex items-center justify-center"
                                title="Generate Invoice"
                              >
                                <i className="ri-file-text-line"></i>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
            <p className="text-gray-600 mb-4">
              Update status for order #{selectedOrder?.id}
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 pr-8"
            >
              {Object.entries(orderStatuses).map(([key, status]) => (
                <option key={key} value={key}>{status.label}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <i className="ri-filter-line text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
}
