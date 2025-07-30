'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { b2bService } from '@/lib/b2b-service';
import Link from 'next/link';

interface BusinessAccount {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  status: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  businessType: string;
  taxExempt: boolean;
  paymentTerms: string;
  creditLimit: number;
  minimumOrderValue: number;
  discountPercentage: number;
  specialPricing: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EditForm {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  taxExempt: boolean;
  paymentTerms: 'net30' | 'net15' | 'net45' | 'net60';
  creditLimit: number;
  minimumOrderValue: number;
  discountPercentage: number;
  specialPricing: boolean;
  notes: string;
}

interface Filters {
  status: string;
  tier: string;
  search: string;
}

export default function B2BAccountsPage() {
  const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<BusinessAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BusinessAccount | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    tier: 'all',
    search: ''
  });

  const [editForm, setEditForm] = useState<EditForm>({
    tier: 'bronze',
    taxExempt: false,
    paymentTerms: 'net30',
    creditLimit: 0,
    minimumOrderValue: 0,
    discountPercentage: 0,
    specialPricing: false,
    notes: ''
  });

  useEffect(() => {
    loadBusinessAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [businessAccounts, filters]);

  const loadBusinessAccounts = async () => {
    try {
      const accounts = b2bService.getBusinessAccounts();
      setBusinessAccounts(accounts as BusinessAccount[]);
    } catch (error) {
      console.error('Error loading business accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = [...businessAccounts];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((account: BusinessAccount) => account.status === filters.status);
    }

    // Tier filter
    if (filters.tier !== 'all') {
      filtered = filtered.filter((account: BusinessAccount) => account.tier === filters.tier);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((account: BusinessAccount) => 
        account.companyName.toLowerCase().includes(searchTerm) ||
        account.contactPerson.toLowerCase().includes(searchTerm) ||
        account.email.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredAccounts(filtered);
  };

  const handleEditAccount = (account: BusinessAccount) => {
    setSelectedAccount(account);
    setEditForm({
      tier: account.tier,
      taxExempt: account.taxExempt,
      paymentTerms: account.paymentTerms as 'net30' | 'net15' | 'net45' | 'net60',
      creditLimit: account.creditLimit,
      minimumOrderValue: account.minimumOrderValue,
      discountPercentage: account.discountPercentage,
      specialPricing: account.specialPricing,
      notes: account.notes
    });
    setShowEditModal(true);
  };

  const handleSaveAccount = async () => {
    if (!selectedAccount) return;

    try {
      const success = b2bService.updateBusinessAccount(selectedAccount.id, editForm);
      
      if (success) {
        await loadBusinessAccounts();
        setShowEditModal(false);
        setSelectedAccount(null);
        showNotification('Account updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      showNotification('Error updating account', 'error');
    }
  };

  const generateCatalog = async (accountId: string) => {
    try {
      const csvData = b2bService.generateB2BCatalog(accountId, 'csv');
      downloadFile(csvData, 'b2b-catalog.csv', 'text/csv');
      showNotification('Catalog downloaded successfully', 'success');
    } catch (error) {
      console.error('Error generating catalog:', error);
      showNotification('Error generating catalog', 'error');
    }
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

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
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
            <p className="text-gray-600">Loading business accounts...</p>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/b2b"
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Business Accounts</h1>
                <p className="text-gray-600">Manage B2B customer accounts and settings</p>
              </div>
            </div>
            
            <Link
              href="/admin/b2b/accounts/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-add-line mr-2"></i>
              Add Account
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-building-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{businessAccounts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {businessAccounts.filter((acc: BusinessAccount) => acc.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-vip-crown-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Premium Tiers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {businessAccounts.filter((acc: BusinessAccount) => acc.tier === 'gold' || acc.tier === 'platinum').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-money-dollar-circle-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Credit Limit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${businessAccounts.reduce((sum: number, acc: BusinessAccount) => sum + acc.creditLimit, 0).toLocaleString()}
                  </p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
                  <select
                    value={filters.tier}
                    onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Tiers</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search by company, contact, or email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account: BusinessAccount) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <i className="ri-building-line text-blue-600"></i>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{account.companyName}</div>
                            <div className="text-sm text-gray-500">{account.businessType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{account.contactPerson}</div>
                        <div className="text-sm text-gray-500">{account.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(account.tier)}`}>
                          {account.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                          {account.status}
                        </span>
                        {account.taxExempt && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Tax Exempt
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${account.creditLimit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.discountPercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditAccount(account)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Account"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          
                          <Link
                            href={`/admin/b2b/accounts/${account.id}`}
                            className="text-purple-600 hover:text-purple-900"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </Link>
                          
                          <button
                            onClick={() => generateCatalog(account.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Download Catalog"
                          >
                            <i className="ri-download-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAccounts.length === 0 && (
              <div className="p-12 text-center">
                <i className="ri-building-line text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
                <p className="text-gray-500">
                  {filters.search || filters.status !== 'all' || filters.tier !== 'all'
                    ? 'No accounts match your current filters.'
                    : 'No business accounts have been created yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Account Modal */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Business Account</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedAccount.companyName}</h4>
                <p className="text-sm text-gray-600">{selectedAccount.contactPerson} • {selectedAccount.email}</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Tier</label>
                    <select
                      value={editForm.tier}
                      onChange={(e) => setEditForm({ ...editForm, tier: e.target.value as 'bronze' | 'silver' | 'gold' | 'platinum' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                    <select
                      value={editForm.paymentTerms}
                      onChange={(e) => setEditForm({ ...editForm, paymentTerms: e.target.value as 'net30' | 'net15' | 'net45' | 'net60' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="net30">Net 30</option>
                      <option value="net15">Net 15</option>
                      <option value="net45">Net 45</option>
                      <option value="net60">Net 60</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Limit ($)</label>
                    <input
                      type="number"
                      value={editForm.creditLimit}
                      onChange={(e) => setEditForm({ ...editForm, creditLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value ($)</label>
                    <input
                      type="number"
                      value={editForm.minimumOrderValue}
                      onChange={(e) => setEditForm({ ...editForm, minimumOrderValue: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.discountPercentage}
                    onChange={(e) => setEditForm({ ...editForm, discountPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.taxExempt}
                      onChange={(e) => setEditForm({ ...editForm, taxExempt: e.target.checked })}
                      className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Tax Exempt</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.specialPricing}
                      onChange={(e) => setEditForm({ ...editForm, specialPricing: e.target.checked })}
                      className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Special Pricing</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about this account..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAccount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}