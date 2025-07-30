'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { b2bService } from '@/lib/b2b-service';
import Link from 'next/link';

interface B2BApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  status: string;
  submittedAt: Date;
}

interface B2BOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  orderDate: Date;
}

interface BusinessAccount {
  id: string;
  companyName: string;
  tier: string;
  status: string;
  createdAt: Date;
}

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  totalOrders: number;
  totalRevenue: number;
  activeAccounts: number;
  averageOrderValue: number;
}

export default function B2BDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeAccounts: 0,
    averageOrderValue: 0
  });
  const [recentApplications, setRecentApplications] = useState<B2BApplication[]>([]);
  const [recentOrders, setRecentOrders] = useState<B2BOrder[]>([]);
  const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = b2bService.getB2BStats();
      const applications = b2bService.getApplications();
      const orders = b2bService.getWholesaleOrders();
      const accounts = b2bService.getBusinessAccounts();

      setStats(dashboardStats as unknown as DashboardStats);
      setRecentApplications(applications as unknown as B2BApplication[]);
      setRecentOrders(orders as unknown as B2BOrder[]);
      setBusinessAccounts(accounts as unknown as BusinessAccount[]);
    } catch (error) {
      console.error('Error loading B2B dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading B2B dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">B2B Management</h1>
            <p className="text-gray-600">Manage business accounts, wholesale orders, and pricing</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-building-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Business Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeAccounts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-file-text-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-shopping-cart-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wholesale Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wholesale Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link
              href="/admin/b2b/applications"
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <i className="ri-file-add-line text-2xl text-gray-400 mb-2"></i>
              <h3 className="text-sm font-medium text-gray-900">Review Applications</h3>
              <p className="text-xs text-gray-500">Approve new B2B accounts</p>
            </Link>

            <Link
              href="/admin/b2b/accounts"
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <i className="ri-building-2-line text-2xl text-gray-400 mb-2"></i>
              <h3 className="text-sm font-medium text-gray-900">Manage Accounts</h3>
              <p className="text-xs text-gray-500">Edit business accounts</p>
            </Link>

            <Link
              href="/admin/b2b/pricing"
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <i className="ri-price-tag-3-line text-2xl text-gray-400 mb-2"></i>
              <h3 className="text-sm font-medium text-gray-900">Pricing Lists</h3>
              <p className="text-xs text-gray-500">Manage B2B pricing</p>
            </Link>

            <Link
              href="/admin/b2b/orders"
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              <i className="ri-truck-line text-2xl text-gray-400 mb-2"></i>
              <h3 className="text-sm font-medium text-gray-900">Wholesale Orders</h3>
              <p className="text-xs text-gray-500">Track bulk orders</p>
            </Link>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                  <Link
                    href="/admin/b2b/applications"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application: B2BApplication) => (
                      <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="ri-building-line text-blue-600"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{application.companyName}</p>
                            <p className="text-sm text-gray-500">{application.contactPerson}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status.replace('_', ' ')}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent applications</p>
                )}
              </div>
            </div>

            {/* Recent Wholesale Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Wholesale Orders</h2>
                  <Link
                    href="/admin/b2b/orders"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order: B2BOrder) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="ri-shopping-cart-line text-green-600"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{order.customerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.total.toLocaleString()}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent orders</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Accounts Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Business Accounts</h2>
              <Link
                href="/admin/b2b/accounts"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View all accounts
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessAccounts.map((account: BusinessAccount) => (
                <div key={account.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(account.tier)}`}>
                      {account.tier.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                      {account.status}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{account.companyName}</h3>
                  <p className="text-sm text-gray-600 mb-3">Business Account</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">{account.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href={`/admin/b2b/accounts/${account.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value</h3>
              <p className="text-3xl font-bold text-blue-600">${stats.averageOrderValue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">Wholesale orders only</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Accounts</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeAccounts}</p>
              <p className="text-sm text-gray-500 mt-2">Currently active</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Rate</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalApplications > 0 
                  ? Math.round((stats.pendingApplications / stats.totalApplications) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-500 mt-2">Pending applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}