'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface ReturnRequest {
  id: string;
  orderNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  originalPrice: number;
  reason: string;
  description: string;
  images: string[];
  status: 'pending' | 'approved' | 'denied' | 'refunded' | 'processing';
  requestDate: string;
  processedDate?: string;
  refundAmount?: number;
  refundMethod?: string;
  refundTransactionId?: string;
  adminNotes?: string;
  priority: 'low' | 'normal' | 'high';
}

export default function ReturnsManagement() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedReturns, setSelectedReturns] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundMethod, setRefundMethod] = useState('original');
  const [adminNotes, setAdminNotes] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    product: '',
    customer: '',
    dateFrom: '',
    dateTo: '',
    priority: ''
  });

  const [stats, setStats] = useState({
    totalReturns: 0,
    pendingReturns: 0,
    approvedReturns: 0,
    deniedReturns: 0,
    refundedReturns: 0,
    totalRefundAmount: 0
  });

  useEffect(() => {
    loadReturns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, returns]);

  const loadReturns = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockReturns: ReturnRequest[] = [
        {
          id: 'RET001',
          orderNumber: 'FL001',
          orderId: 'FL001',
          customerId: 'user123',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          productId: 'PWH001',
          productName: 'Premium Wireless Headphones',
          productSku: 'PWH-001',
          quantity: 1,
          originalPrice: 149.99,
          reason: 'defective',
          description: 'Left speaker stopped working after 2 weeks of use',
          images: [
            'https://readdy.ai/api/search-image?query=broken%20wireless%20headphones%20with%20visible%20damage%2C%20product%20return%20documentation%20photo&width=200&height=200&seq=return1&orientation=squarish',
            'https://readdy.ai/api/search-image?query=defective%20headphone%20speaker%20close-up%20showing%20damage%2C%20warranty%20claim%20photo&width=200&height=200&seq=return2&orientation=squarish'
          ],
          status: 'pending',
          requestDate: '2024-01-20T10:30:00Z',
          priority: 'high'
        },
        {
          id: 'RET002',
          orderNumber: 'FL002',
          orderId: 'FL002',
          customerId: 'user456',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@example.com',
          productId: 'OCT003',
          productName: 'Organic Cotton T-Shirt',
          productSku: 'OCT-003',
          quantity: 2,
          originalPrice: 29.99,
          reason: 'size',
          description: 'Ordered Medium but need Large size',
          images: [],
          status: 'approved',
          requestDate: '2024-01-19T14:15:00Z',
          processedDate: '2024-01-20T09:00:00Z',
          priority: 'normal'
        },
        {
          id: 'RET003',
          orderNumber: 'FL003',
          orderId: 'FL003',
          customerId: 'user789',
          customerName: 'Mike Chen',
          customerEmail: 'mike@example.com',
          productId: 'BTS005',
          productName: 'Bluetooth Speaker',
          productSku: 'BTS-005',
          quantity: 1,
          originalPrice: 89.99,
          reason: 'different',
          description: 'Product description said it was waterproof but it is not',
          images: [
            'https://readdy.ai/api/search-image?query=bluetooth%20speaker%20water%20damage%2C%20misleading%20product%20description%20evidence%20photo&width=200&height=200&seq=return3&orientation=squarish'
          ],
          status: 'refunded',
          requestDate: '2024-01-18T16:45:00Z',
          processedDate: '2024-01-19T11:30:00Z',
          refundAmount: 89.99,
          refundMethod: 'Credit Card',
          refundTransactionId: 'ref_1234567890',
          adminNotes: 'Full refund issued due to misleading product description',
          priority: 'high'
        },
        {
          id: 'RET004',
          orderNumber: 'FL004',
          orderId: 'FL004',
          customerId: 'user101',
          customerName: 'Emma Wilson',
          customerEmail: 'emma@example.com',
          productId: 'SFW006',
          productName: 'Smart Fitness Watch',
          productSku: 'SFW-006',
          quantity: 1,
          originalPrice: 199.99,
          reason: 'changed',
          description: 'Changed my mind, found a better deal elsewhere',
          images: [],
          status: 'denied',
          requestDate: '2024-01-17T12:00:00Z',
          processedDate: '2024-01-18T08:30:00Z',
          adminNotes: 'Denied - return window expired and no defect found',
          priority: 'low'
        },
        {
          id: 'RET005',
          orderNumber: 'FL005',
          orderId: 'FL005',
          customerId: 'user202',
          customerName: 'David Brown',
          customerEmail: 'david@example.com',
          productId: 'WM007',
          productName: 'Wireless Mouse',
          productSku: 'WM-007',
          quantity: 1,
          originalPrice: 79.99,
          reason: 'damaged',
          description: 'Arrived with broken scroll wheel',
          images: [
            'https://readdy.ai/api/search-image?query=damaged%20wireless%20mouse%20with%20broken%20scroll%20wheel%2C%20shipping%20damage%20documentation&width=200&height=200&seq=return4&orientation=squarish'
          ],
          status: 'processing',
          requestDate: '2024-01-21T09:15:00Z',
          priority: 'normal'
        }
      ];

      setReturns(mockReturns);
      setFilteredReturns(mockReturns);

      // Calculate stats
      const totalReturns = mockReturns.length;
      const pendingReturns = mockReturns.filter(r => r.status === 'pending').length;
      const approvedReturns = mockReturns.filter(r => r.status === 'approved').length;
      const deniedReturns = mockReturns.filter(r => r.status === 'denied').length;
      const refundedReturns = mockReturns.filter(r => r.status === 'refunded').length;
      const totalRefundAmount = mockReturns
        .filter(r => r.status === 'refunded')
        .reduce((sum, r) => sum + (r.refundAmount || 0), 0);

      setStats({
        totalReturns,
        pendingReturns,
        approvedReturns,
        deniedReturns,
        refundedReturns,
        totalRefundAmount
      });

      setLoading(false);
    }, 1000);
  };

  const applyFilters = () => {
    let filtered = [...returns];

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.product) {
      filtered = filtered.filter(r => 
        r.productName.toLowerCase().includes(filters.product.toLowerCase()) ||
        r.productSku.toLowerCase().includes(filters.product.toLowerCase())
      );
    }

    if (filters.customer) {
      filtered = filtered.filter(r => 
        r.customerName.toLowerCase().includes(filters.customer.toLowerCase()) ||
        r.customerEmail.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(r => r.requestDate >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(r => r.requestDate <= filters.dateTo);
    }

    if (filters.priority) {
      filtered = filtered.filter(r => r.priority === filters.priority);
    }

    setFilteredReturns(filtered);
  };

  const handleStatusUpdate = async (returnId: string, newStatus: string, notes?: string) => {
    const updatedReturns = returns.map(r => 
      r.id === returnId 
        ? { 
            ...r, 
            status: newStatus as any, 
            processedDate: new Date().toISOString(),
            adminNotes: notes || r.adminNotes
          }
        : r
    );

    setReturns(updatedReturns);
    showNotification(`Return ${returnId} status updated to ${newStatus}`, 'success');
  };

  const handleRefundApproval = async () => {
    if (!selectedReturn) return;

    try {
      // Simulate payment gateway integration
      const refundResponse = await processRefund({
        returnId: selectedReturn.id,
        amount: parseFloat(refundAmount),
        method: refundMethod,
        originalOrderId: selectedReturn.orderId
      });

      const updatedReturns = returns.map(r => 
        r.id === selectedReturn.id 
          ? { 
              ...r, 
              status: 'refunded' as const,
              processedDate: new Date().toISOString(),
              refundAmount: parseFloat(refundAmount),
              refundMethod: refundMethod,
              refundTransactionId: refundResponse.transactionId,
              adminNotes: adminNotes
            }
          : r
      );

      setReturns(updatedReturns);
      setShowRefundModal(false);
      setSelectedReturn(null);
      setRefundAmount('');
      setAdminNotes('');
      
      showNotification(`Refund of $${refundAmount} processed successfully`, 'success');
    } catch (error) {
      showNotification('Failed to process refund', 'error');
    }
  };

  const processRefund = async (refundData: any) => {
    // Simulate payment gateway API call
    return new Promise<{ transactionId: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId: 'ref_' + Math.random().toString(36).substr(2, 9)
        });
      }, 1500);
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedReturns.length === 0) return;

    switch (action) {
      case 'approve':
        selectedReturns.forEach(id => handleStatusUpdate(id, 'approved'));
        break;
      case 'deny':
        selectedReturns.forEach(id => handleStatusUpdate(id, 'denied'));
        break;
      case 'priority-high':
        const highPriorityReturns = returns.map(r => 
          selectedReturns.includes(r.id) ? { ...r, priority: 'high' as const } : r
        );
        setReturns(highPriorityReturns);
        break;
    }

    setSelectedReturns([]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'ri-time-line';
      case 'approved': return 'ri-check-line';
      case 'denied': return 'ri-close-line';
      case 'refunded': return 'ri-money-dollar-circle-line';
      case 'processing': return 'ri-loader-4-line';
      default: return 'ri-question-line';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-gray-100 text-gray-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonDisplay = (reason: string) => {
    const reasons = {
      'defective': 'Defective Item',
      'size': 'Wrong Size',
      'different': 'Different from Description',
      'damaged': 'Damaged in Shipping',
      'changed': 'Changed Mind',
      'other': 'Other'
    };
    return reasons[reason as keyof typeof reasons] || reason;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading returns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Returns & Refunds</h1>
              <p className="text-gray-600">Manage return requests and process refunds</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/returns/settings"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <i className="ri-settings-3-line mr-2"></i>
                Settings
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <i className="ri-download-line mr-2"></i>
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-file-list-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Returns</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvedReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-close-line text-red-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Denied</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.deniedReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Refunded</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.refundedReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-wallet-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Refunds</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRefundAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                    <option value="refunded">Refunded</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                  <input
                    type="text"
                    value={filters.product}
                    onChange={(e) => setFilters(prev => ({ ...prev, product: e.target.value }))}
                    placeholder="Search by product name or SKU..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                  <input
                    type="text"
                    value={filters.customer}
                    onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
                    placeholder="Search by customer name or email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setFilters({
                    status: '', product: '', customer: '', dateFrom: '', dateTo: '', priority: ''
                  })}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </button>
                <div className="text-sm text-gray-600">
                  Showing {filteredReturns.length} of {returns.length} returns
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReturns.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-800">
                    {selectedReturns.length} return{selectedReturns.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBulkAction('approve')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <i className="ri-check-line mr-1"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => handleBulkAction('deny')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <i className="ri-close-line mr-1"></i>
                      Deny
                    </button>
                    <button
                      onClick={() => handleBulkAction('priority-high')}
                      className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                    >
                      <i className="ri-flag-line mr-1"></i>
                      High Priority
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReturns([])}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Returns Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedReturns.length === filteredReturns.length}
                        onChange={(e) => setSelectedReturns(
                          e.target.checked ? filteredReturns.map(r => r.id) : []
                        )}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReturns.map((returnRequest) => (
                    <tr key={returnRequest.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedReturns.includes(returnRequest.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReturns([...selectedReturns, returnRequest.id]);
                            } else {
                              setSelectedReturns(selectedReturns.filter(id => id !== returnRequest.id));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{returnRequest.id}</div>
                        <div className="text-sm text-gray-500">Order: {returnRequest.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{returnRequest.customerName}</div>
                        <div className="text-sm text-gray-500">{returnRequest.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{returnRequest.productName}</div>
                        <div className="text-sm text-gray-500">SKU: {returnRequest.productSku}</div>
                        <div className="text-sm text-gray-500">Qty: {returnRequest.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getReasonDisplay(returnRequest.reason)}</div>
                        {returnRequest.images.length > 0 && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-image-line mr-1"></i>
                            {returnRequest.images.length} image{returnRequest.images.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${returnRequest.originalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(returnRequest.status)}`}>
                          <i className={`${getStatusIcon(returnRequest.status)} mr-1`}></i>
                          {returnRequest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(returnRequest.priority)}`}>
                          {returnRequest.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(returnRequest.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedReturn(returnRequest);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          {returnRequest.status === 'approved' && (
                            <button
                              onClick={() => {
                                setSelectedReturn(returnRequest);
                                setRefundAmount(returnRequest.originalPrice.toString());
                                setShowRefundModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 w-8 h-8 flex items-center justify-center"
                              title="Process Refund"
                            >
                              <i className="ri-money-dollar-circle-line"></i>
                            </button>
                          )}
                          {returnRequest.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(returnRequest.id, 'approved')}
                                className="text-green-600 hover:text-green-900 w-8 h-8 flex items-center justify-center"
                                title="Approve"
                              >
                                <i className="ri-check-line"></i>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(returnRequest.id, 'denied')}
                                className="text-red-600 hover:text-red-900 w-8 h-8 flex items-center justify-center"
                                title="Deny"
                              >
                                <i className="ri-close-line"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Return Details Modal */}
      {showDetailModal && selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Return Details - #{selectedReturn.id}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedReturn.customerName}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedReturn.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Order:</span>
                    <span className="text-sm text-gray-900 ml-2">#{selectedReturn.orderNumber}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Product Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Product:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedReturn.productName}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">SKU:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedReturn.productSku}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedReturn.quantity}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Original Price:</span>
                    <span className="text-sm text-gray-900 ml-2">${selectedReturn.originalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Return Details</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Reason:</span>
                  <span className="text-sm text-gray-900 ml-2">{getReasonDisplay(selectedReturn.reason)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Description:</span>
                  <p className="text-sm text-gray-900 mt-1">{selectedReturn.description}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getStatusColor(selectedReturn.status)}`}>
                    <i className={`${getStatusIcon(selectedReturn.status)} mr-1`}></i>
                    {selectedReturn.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Request Date:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {new Date(selectedReturn.requestDate).toLocaleDateString()}
                  </span>
                </div>
                {selectedReturn.processedDate && (
                  <div>
                    <span className="text-sm text-gray-600">Processed Date:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {new Date(selectedReturn.processedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {selectedReturn.images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedReturn.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Return evidence ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedReturn.refundAmount && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Refund Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Refund Amount:</span>
                    <span className="text-sm text-gray-900 ml-2">${selectedReturn.refundAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Refund Method:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedReturn.refundMethod}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Transaction ID:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedReturn.refundTransactionId}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedReturn.adminNotes && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Admin Notes</h4>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedReturn.adminNotes}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              {selectedReturn.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedReturn.id, 'approved');
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedReturn.id, 'denied');
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Deny
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Process Refund</h3>
              <button
                onClick={() => setShowRefundModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    max={selectedReturn.originalPrice}
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Maximum: ${selectedReturn.originalPrice.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Method
                </label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="original">Original Payment Method</option>
                  <option value="store-credit">Store Credit</option>
                  <option value="bank-transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional notes about the refund..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRefundApproval}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}