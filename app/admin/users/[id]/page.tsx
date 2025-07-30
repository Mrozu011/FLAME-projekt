'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [params.id]);

  const loadUserData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: params.id as string,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
        status: 'active',
        registrationDate: '2024-01-15',
        lastLogin: '2024-01-20',
        totalOrders: 5,
        totalSpent: 1299.99,
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
          zipCode: '10001'
        }
      };

      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'FL001',
          date: '2024-01-20',
          status: 'delivered',
          total: 299.99,
          items: 3
        },
        {
          id: '2',
          orderNumber: 'FL002',
          date: '2024-01-18',
          status: 'shipped',
          total: 199.99,
          items: 2
        },
        {
          id: '3',
          orderNumber: 'FL003',
          date: '2024-01-15',
          status: 'processing',
          total: 89.99,
          items: 1
        }
      ];

      const mockActivityLogs: ActivityLog[] = [
        {
          id: '1',
          action: 'Login',
          details: 'User logged in successfully',
          timestamp: '2024-01-20 14:30:00',
          ipAddress: '192.168.1.100'
        },
        {
          id: '2',
          action: 'Order Placed',
          details: 'Order #FL001 placed for $299.99',
          timestamp: '2024-01-20 14:25:00',
          ipAddress: '192.168.1.100'
        },
        {
          id: '3',
          action: 'Profile Updated',
          details: 'Updated shipping address',
          timestamp: '2024-01-19 16:45:00',
          ipAddress: '192.168.1.100'
        },
        {
          id: '4',
          action: 'Login',
          details: 'User logged in successfully',
          timestamp: '2024-01-19 16:30:00',
          ipAddress: '192.168.1.100'
        }
      ];

      setUser(mockUser);
      setOrders(mockOrders);
      setActivityLogs(mockActivityLogs);
      setLoading(false);
    }, 1000);
  };

  const handleRoleChange = (newRole: string) => {
    if (user) {
      setUser({ ...user, role: newRole as any });
      // API call would go here
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (user) {
      setUser({ ...user, status: newStatus as any });
      // API call would go here
    }
  };

  const handleResetPassword = () => {
    // API call to reset password
    setShowResetPasswordModal(false);
    // Show success message
  };

  const handleDeactivateAccount = () => {
    if (user) {
      setUser({ ...user, status: 'inactive' });
      setShowDeactivateModal(false);
      // API call would go here
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-user-line text-6xl text-gray-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
            <Link
              href="/admin/users"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/users"
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetPasswordModal(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <i className="ri-key-line mr-2"></i>
                Reset Password
              </button>
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="ri-user-unfollow-line mr-2"></i>
                Deactivate Account
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-shopping-bag-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{user.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${user.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-calendar-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-time-line text-orange-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Activity Logs
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <p className="text-sm text-gray-900">{user.firstName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <p className="text-sm text-gray-900">{user.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-sm text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                      
                      {user.address ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Street Address</label>
                            <p className="text-sm text-gray-900">{user.address.street}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <p className="text-sm text-gray-900">{user.address.city}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <p className="text-sm text-gray-900">{user.address.country}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                            <p className="text-sm text-gray-900">{user.address.zipCode}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No address information provided</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="customer">Customer</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                    <span className="text-sm text-gray-500">{orders.length} orders</span>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                #{order.orderNumber}
                              </Link>
                              <p className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{order.items} items</p>
                              <p className="text-sm font-medium text-gray-900">${order.total}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Activity Logs</h3>
                    <span className="text-sm text-gray-500">{activityLogs.length} activities</span>
                  </div>

                  <div className="space-y-4">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="ri-time-line text-blue-600 text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">{log.action}</h4>
                            <span className="text-xs text-gray-500">{log.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                          <p className="text-xs text-gray-500 mt-1">IP: {log.ipAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              A password reset link will be sent to the user's email address.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Deactivate Account</h3>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to deactivate this user account? This action can be reversed later.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}