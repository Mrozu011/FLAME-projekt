'use client';

import { useState, useEffect } from 'react';
import { activityLogger } from '@/lib/activity-logger';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAdminTranslation } from '@/hooks/useAdminTranslation';
import { AdminTranslationProvider } from '@/hooks/useAdminTranslation';
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

function UsersContent() {
  const { t } = useAdminTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    minOrders: '',
    maxOrders: ''
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThisMonth: 0,
    adminUsers: 0,
    moderatorUsers: 0,
    customerUsers: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          id: '1',
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
        },
        {
          id: '2',
          email: 'sarah.admin@flamestore.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'admin',
          status: 'active',
          registrationDate: '2023-12-01',
          lastLogin: '2024-01-21',
          totalOrders: 0,
          totalSpent: 0,
          phone: '+1 (555) 987-6543'
        },
        {
          id: '3',
          email: 'mike.moderator@flamestore.com',
          firstName: 'Mike',
          lastName: 'Chen',
          role: 'moderator',
          status: 'active',
          registrationDate: '2023-11-15',
          lastLogin: '2024-01-19',
          totalOrders: 2,
          totalSpent: 399.98,
          phone: '+1 (555) 456-7890'
        },
        {
          id: '4',
          email: 'emma.wilson@example.com',
          firstName: 'Emma',
          lastName: 'Wilson',
          role: 'customer',
          status: 'inactive',
          registrationDate: '2024-01-10',
          lastLogin: '2024-01-12',
          totalOrders: 1,
          totalSpent: 89.99,
          phone: '+1 (555) 321-0987'
        },
        {
          id: '5',
          email: 'david.brown@example.com',
          firstName: 'David',
          lastName: 'Brown',
          role: 'customer',
          status: 'suspended',
          registrationDate: '2023-10-20',
          lastLogin: '2024-01-05',
          totalOrders: 8,
          totalSpent: 2149.92,
          phone: '+1 (555) 654-3210'
        },
        {
          id: '6',
          email: 'lisa.garcia@example.com',
          firstName: 'Lisa',
          lastName: 'Garcia',
          role: 'customer',
          status: 'active',
          registrationDate: '2024-01-18',
          lastLogin: '2024-01-21',
          totalOrders: 3,
          totalSpent: 549.97,
          phone: '+1 (555) 789-0123'
        },
        {
          id: '7',
          email: 'robert.smith@example.com',
          firstName: 'Robert',
          lastName: 'Smith',
          role: 'customer',
          status: 'active',
          registrationDate: '2023-12-05',
          lastLogin: '2024-01-20',
          totalOrders: 12,
          totalSpent: 3245.67,
          phone: '+1 (555) 111-2222'
        },
        {
          id: '8',
          email: 'maria.rodriguez@example.com',
          firstName: 'Maria',
          lastName: 'Rodriguez',
          role: 'customer',
          status: 'active',
          registrationDate: '2024-01-08',
          lastLogin: '2024-01-19',
          totalOrders: 7,
          totalSpent: 1876.43,
          phone: '+1 (555) 333-4444'
        },
        {
          id: '9',
          email: 'alex.moderator@flamestore.com',
          firstName: 'Alex',
          lastName: 'Turner',
          role: 'moderator',
          status: 'active',
          registrationDate: '2023-09-15',
          lastLogin: '2024-01-21',
          totalOrders: 0,
          totalSpent: 0,
          phone: '+1 (555) 555-6666'
        },
        {
          id: '10',
          email: 'jennifer.lee@example.com',
          firstName: 'Jennifer',
          lastName: 'Lee',
          role: 'customer',
          status: 'inactive',
          registrationDate: '2023-11-22',
          lastLogin: '2023-12-15',
          totalOrders: 4,
          totalSpent: 892.15,
          phone: '+1 (555) 777-8888'
        }
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);

      // Calculate stats
      const totalUsers = mockUsers.length;
      const activeUsers = mockUsers.filter(u => u.status === 'active').length;
      const newThisMonth = mockUsers.filter(u => new Date(u.registrationDate) >= new Date('2024-01-01')).length;
      const adminUsers = mockUsers.filter(u => u.role === 'admin').length;
      const moderatorUsers = mockUsers.filter(u => u.role === 'moderator').length;
      const customerUsers = mockUsers.filter(u => u.role === 'customer').length;

      setStats({
        totalUsers,
        activeUsers,
        newThisMonth,
        adminUsers,
        moderatorUsers,
        customerUsers
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm)
      );
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(user => user.registrationDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(user => user.registrationDate <= filters.dateTo);
    }

    // Order count filters
    if (filters.minOrders) {
      filtered = filtered.filter(user => user.totalOrders >= parseInt(filters.minOrders));
    }
    if (filters.maxOrders) {
      filtered = filtered.filter(user => user.totalOrders <= parseInt(filters.maxOrders));
    }

    setFilteredUsers(filtered);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;

    const selectedUserObjects = users.filter(user => selectedUsers.includes(user.id));

    switch (action) {
      case 'activate':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'active' as const }
            : user
        ));
        // Log bulk activation
        selectedUserObjects.forEach(user => {
          activityLogger.log(
            'User Activated',
            'user',
            `User ${user.firstName} ${user.lastName} (${user.email}) activated`,
            {
              resourceId: user.id,
              resourceType: 'user',
              changes: { status: { from: user.status, to: 'active' } },
              severity: 'success'
            }
          );
        });
        break;
      case 'deactivate':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'inactive' as const }
            : user
        ));
        // Log bulk deactivation
        selectedUserObjects.forEach(user => {
          activityLogger.log(
            'User Deactivated',
            'user',
            `User ${user.firstName} ${user.lastName} (${user.email}) deactivated`,
            {
              resourceId: user.id,
              resourceType: 'user',
              changes: { status: { from: user.status, to: 'inactive' } },
              severity: 'warning'
            }
          );
        });
        break;
      case 'suspend':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'suspended' as const }
            : user
        ));
        // Log bulk suspension
        selectedUserObjects.forEach(user => {
          activityLogger.log(
            'User Suspended',
            'user',
            `User ${user.firstName} ${user.lastName} (${user.email}) suspended`,
            {
              resourceId: user.id,
              resourceType: 'user',
              changes: { status: { from: user.status, to: 'suspended' } },
              severity: 'warning'
            }
          );
        });
        break;
    }

    setSelectedUsers([]);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'ri-check-line';
      case 'inactive': return 'ri-pause-line';
      case 'suspended': return 'ri-close-line';
      default: return 'ri-question-line';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{t('navigation.users')}</h1>
                <p className="text-gray-600">{t('users.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
              >
                <i className="ri-external-link-line"></i>
                <span className="hidden sm:inline">{t('settings.viewStore')}</span>
                <span className="sm:hidden">Store</span>
              </Link>
              <Link
                href="/admin/users/roles"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
              >
                <i className="ri-shield-user-line"></i>
                <span className="hidden sm:inline">{t('users.manageRoles')}</span>
                <span className="sm:hidden">Roles</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                  <i className="ri-user-line text-blue-600 text-lg lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('users.totalUsers')}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                  <i className="ri-check-line text-green-600 text-lg lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('users.activeUsers')}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                  <i className="ri-user-add-line text-purple-600 text-lg lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('users.newThisMonth')}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                  <i className="ri-admin-line text-red-600 text-lg lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('users.admins')}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                  <i className="ri-shield-user-line text-blue-600 text-lg lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('users.moderators')}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.moderatorUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                  <i className="ri-user-heart-line text-green-600 text-lg lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('users.customers')}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.customerUsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6 lg:mb-8">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">{t('common.filters')}</h2>
            </div>
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('users.role')}</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="">{t('users.allRoles')}</option>
                    <option value="admin">{t('users.admin')}</option>
                    <option value="moderator">{t('users.moderator')}</option>
                    <option value="customer">{t('users.customer')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.status')}</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="">{t('users.allStatus')}</option>
                    <option value="active">{t('users.active')}</option>
                    <option value="inactive">{t('users.inactive')}</option>
                    <option value="suspended">{t('users.suspended')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.search')}</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder={t('users.searchPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('users.registrationDate')}</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-2 sm:space-y-0">
                <button
                  onClick={() => setFilters({
                    role: '',
                    status: '',
                    search: '',
                    dateFrom: '',
                    dateTo: '',
                    minOrders: '',
                    maxOrders: ''
                  })}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  {t('common.clearFilters')}
                </button>
                <div className="text-sm text-gray-600">
                  {t('users.showing')} {filteredUsers.length} {t('common.of')} {users.length} {t('navigation.users').toLowerCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-800">
                    {selectedUsers.length} {t('users.selected')}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      {t('users.activate')}
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate')}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors whitespace-nowrap"
                    >
                      {t('users.deactivate')}
                    </button>
                    <button
                      onClick={() => handleBulkAction('suspend')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors whitespace-nowrap"
                    >
                      {t('users.suspend')}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {t('users.clearSelection')}
                </button>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.user')}
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.role')}
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.status')}
                    </th>
                    <th className="hidden md:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.registration')}
                    </th>
                    <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.lastLogin')}
                    </th>
                    <th className="hidden md:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('navigation.orders')}
                    </th>
                    <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.totalSpent')}
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-gray-600 font-medium text-sm">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {t(`users.${user.role}`)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          <i className={`${getStatusIcon(user.status)} mr-1`}></i>
                          {t(`users.${user.status}`)}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 lg:px-6 py-4 text-sm text-gray-900">
                        {new Date(user.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="hidden lg:table-cell px-4 lg:px-6 py-4 text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="hidden md:table-cell px-4 lg:px-6 py-4 text-sm text-gray-900">
                        {user.totalOrders}
                      </td>
                      <td className="hidden lg:table-cell px-4 lg:px-6 py-4 text-sm text-gray-900">
                        ${user.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title={t('common.view')}
                          >
                            <i className="ri-eye-line"></i>
                          </Link>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            title={t('common.edit')}
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            title={t('common.delete')}
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

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-12">
                <i className="ri-user-line text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('users.noUsersFound')}</h3>
                <p className="text-gray-500">{t('users.tryAdjustingFilters')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <AdminTranslationProvider>
      <UsersContent />
    </AdminTranslationProvider>
  );
}