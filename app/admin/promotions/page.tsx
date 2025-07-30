'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromotionsManagement() {
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [promotionForm, setPromotionForm] = useState({
    code: '',
    name: '',
    type: 'percentage',
    value: '',
    conditions: {
      minOrderValue: '',
      validCategories: [],
      firstTimeOnly: false,
      validProducts: []
    },
    usageLimits: {
      totalUses: '',
      perUserLimit: '',
      enabled: true
    },
    validFrom: '',
    validUntil: '',
    active: true,
    description: '',
    priority: 'normal'
  });

  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [bulkActions, setBulkActions] = useState([]);

  const categories = [
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports & Outdoors' }
  ];

  const products = [
    { id: 1, name: 'Premium Wireless Headphones', category: 'electronics' },
    { id: 2, name: 'Organic Cotton T-Shirt', category: 'men' },
    { id: 3, name: 'Wireless Charging Pad', category: 'electronics' },
    { id: 4, name: 'Eco-Friendly Water Bottle', category: 'accessories' },
    { id: 5, name: 'Bluetooth Speaker', category: 'electronics' }
  ];

  useEffect(() => {
    const mockPromotions = [
      {
        id: 1,
        code: 'SUMMER25',
        name: 'Summer Sale 2024',
        type: 'percentage',
        value: 25,
        conditions: {
          minOrderValue: 75,
          validCategories: ['men', 'women'],
          firstTimeOnly: false,
          validProducts: []
        },
        usageLimits: {
          totalUses: 1000,
          perUserLimit: 1,
          enabled: true
        },
        validFrom: '2024-06-01',
        validUntil: '2024-08-31',
        active: true,
        description: 'Summer collection discount',
        priority: 'high',
        usageCount: 234,
        createdAt: '2024-05-15T10:00:00Z',
        updatedAt: '2024-05-15T10:00:00Z'
      },
      {
        id: 2,
        code: 'NEWUSER10',
        name: 'New Customer Welcome',
        type: 'fixed',
        value: 10,
        conditions: {
          minOrderValue: 50,
          validCategories: [],
          firstTimeOnly: true,
          validProducts: []
        },
        usageLimits: {
          totalUses: '',
          perUserLimit: 1,
          enabled: true
        },
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        active: true,
        description: 'Welcome discount for new customers',
        priority: 'normal',
        usageCount: 567,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        code: 'FREESHIP99',
        name: 'Free Shipping Promo',
        type: 'shipping',
        value: 0,
        conditions: {
          minOrderValue: 99,
          validCategories: [],
          firstTimeOnly: false,
          validProducts: []
        },
        usageLimits: {
          totalUses: 500,
          perUserLimit: '',
          enabled: true
        },
        validFrom: '2024-01-01',
        validUntil: '2024-06-30',
        active: false,
        description: 'Free shipping on orders over $99',
        priority: 'low',
        usageCount: 123,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-03-15T14:30:00Z'
      },
      {
        id: 4,
        code: 'ELECTRONICS20',
        name: 'Electronics Flash Sale',
        type: 'percentage',
        value: 20,
        conditions: {
          minOrderValue: 100,
          validCategories: ['electronics'],
          firstTimeOnly: false,
          validProducts: [1, 3, 5]
        },
        usageLimits: {
          totalUses: 200,
          perUserLimit: 2,
          enabled: true
        },
        validFrom: '2024-07-01',
        validUntil: '2024-07-07',
        active: true,
        description: 'Limited time electronics sale',
        priority: 'high',
        usageCount: 45,
        createdAt: '2024-06-25T09:00:00Z',
        updatedAt: '2024-06-25T09:00:00Z'
      }
    ];

    setPromotions(mockPromotions);
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPromotionForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setPromotionForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCategoryChange = (categoryId) => {
    setPromotionForm(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        validCategories: prev.conditions.validCategories.includes(categoryId)
          ? prev.conditions.validCategories.filter(id => id !== categoryId)
          : [...prev.conditions.validCategories, categoryId]
      }
    }));
  };

  const handleProductChange = (productId) => {
    setPromotionForm(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        validProducts: prev.conditions.validProducts.includes(productId)
          ? prev.conditions.validProducts.filter(id => id !== productId)
          : [...prev.conditions.validProducts, productId]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Saving promotion...' });

    // Validation
    if (!promotionForm.code || !promotionForm.name) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (promotionForm.type !== 'shipping' && (!promotionForm.value || promotionForm.value <= 0)) {
      setSubmitStatus({ type: 'error', message: 'Please provide a valid discount value.' });
      return;
    }

    if (promotionForm.type === 'percentage' && promotionForm.value > 100) {
      setSubmitStatus({ type: 'error', message: 'Percentage discount cannot exceed 100%.' });
      return;
    }

    if (promotionForm.description.length > 500) {
      setSubmitStatus({ type: 'error', message: 'Description cannot exceed 500 characters.' });
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('code', promotionForm.code);
      formData.append('name', promotionForm.name);
      formData.append('type', promotionForm.type);
      formData.append('value', promotionForm.value);
      formData.append('minOrderValue', promotionForm.conditions.minOrderValue);
      formData.append('validCategories', promotionForm.conditions.validCategories.join(','));
      formData.append('firstTimeOnly', promotionForm.conditions.firstTimeOnly ? 'true' : 'false');
      formData.append('validProducts', promotionForm.conditions.validProducts.join(','));
      formData.append('totalUses', promotionForm.usageLimits.totalUses);
      formData.append('perUserLimit', promotionForm.usageLimits.perUserLimit);
      formData.append('usageLimitsEnabled', promotionForm.usageLimits.enabled ? 'true' : 'false');
      formData.append('validFrom', promotionForm.validFrom);
      formData.append('validUntil', promotionForm.validUntil);
      formData.append('active', promotionForm.active ? 'true' : 'false');
      formData.append('description', promotionForm.description);
      formData.append('priority', promotionForm.priority);
      formData.append('editMode', editingPromotion ? 'true' : 'false');
      
      if (editingPromotion) {
        formData.append('promotionId', editingPromotion.id.toString());
      }

      const response = await fetch('https://readdy.ai/api/form/d24cprpf1a4cjoidbs0g', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Promotion saved successfully!' });

        if (editingPromotion) {
          setPromotions(promotions.map(promo =>
            promo.id === editingPromotion.id
              ? { ...promo, ...promotionForm, updatedAt: new Date().toISOString() }
              : promo
          ));
        } else {
          const newPromotion = {
            id: Date.now(),
            ...promotionForm,
            usageCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setPromotions([...promotions, newPromotion]);
        }

        setTimeout(() => {
          setShowModal(false);
          setEditingPromotion(null);
          resetForm();
          setSubmitStatus({ type: '', message: '' });
        }, 2000);
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to save promotion. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    }
  };

  const resetForm = () => {
    setPromotionForm({
      code: '',
      name: '',
      type: 'percentage',
      value: '',
      conditions: {
        minOrderValue: '',
        validCategories: [],
        firstTimeOnly: false,
        validProducts: []
      },
      usageLimits: {
        totalUses: '',
        perUserLimit: '',
        enabled: true
      },
      validFrom: '',
      validUntil: '',
      active: true,
      description: '',
      priority: 'normal'
    });
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setPromotionForm({
      code: promotion.code,
      name: promotion.name,
      type: promotion.type,
      value: promotion.value,
      conditions: promotion.conditions,
      usageLimits: promotion.usageLimits,
      validFrom: promotion.validFrom,
      validUntil: promotion.validUntil,
      active: promotion.active,
      description: promotion.description,
      priority: promotion.priority
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(promo => promo.id !== id));
    }
  };

  const toggleActive = (id) => {
    setPromotions(promotions.map(promo =>
      promo.id === id
        ? { ...promo, active: !promo.active, updatedAt: new Date().toISOString() }
        : promo
    ));
  };

  const duplicatePromotion = (promotion) => {
    const duplicated = {
      ...promotion,
      id: Date.now(),
      code: `${promotion.code}_COPY`,
      name: `${promotion.name} (Copy)`,
      usageCount: 0,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPromotions([...promotions, duplicated]);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage': return 'ri-percent-line';
      case 'fixed': return 'ri-money-dollar-circle-line';
      case 'shipping': return 'ri-truck-line';
      default: return 'ri-discount-percent-line';
    }
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      percentage: 'bg-blue-100 text-blue-800',
      fixed: 'bg-green-100 text-green-800',
      shipping: 'bg-purple-100 text-purple-800'
    };
    return typeConfig[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: 'bg-red-100 text-red-800',
      normal: 'bg-gray-100 text-gray-800',
      low: 'bg-green-100 text-green-800'
    };
    return priorityConfig[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (active) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatValue = (promotion) => {
    if (promotion.type === 'percentage') return `${promotion.value}%`;
    if (promotion.type === 'fixed') return `$${promotion.value}`;
    if (promotion.type === 'shipping') return 'Free Shipping';
    return promotion.value;
  };

  const getUsageProgress = (promotion) => {
    if (!promotion.usageLimits.totalUses) return 0;
    return Math.min((promotion.usageCount / promotion.usageLimits.totalUses) * 100, 100);
  };

  const filteredPromotions = promotions.filter(promo => {
    if (activeTab === 'active') return promo.active;
    if (activeTab === 'inactive') return !promo.active;
    if (activeTab === 'expired') {
      const now = new Date();
      return new Date(promo.validUntil) < now;
    }
    return true;
  });

  const getPromotionStats = () => {
    const now = new Date();
    return {
      total: promotions.length,
      active: promotions.filter(p => p.active).length,
      inactive: promotions.filter(p => !p.active).length,
      expired: promotions.filter(p => new Date(p.validUntil) < now).length,
      totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0)
    };
  };

  const stats = getPromotionStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Promotions Management</h1>
                <p className="text-sm text-gray-500">Create and manage discount codes and promotional campaigns</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center"
            >
              <i className="ri-add-line mr-2"></i>
              Create Promotion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-coupon-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-check-circle-line text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-pause-circle-line text-red-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-time-line text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-user-line text-purple-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Uses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'active', label: 'Active', count: stats.active },
                { id: 'inactive', label: 'Inactive', count: stats.inactive },
                { id: 'expired', label: 'Expired', count: stats.expired },
                { id: 'all', label: 'All', count: stats.total }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Promotions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conditions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <i className={`${getTypeIcon(promotion.type)} text-blue-600`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{promotion.name}</div>
                          <div className="text-sm text-gray-500 font-mono">{promotion.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(promotion.type)}`}>
                        {promotion.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{formatValue(promotion)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion.conditions.minOrderValue && (
                          <div>Min: ${promotion.conditions.minOrderValue}</div>
                        )}
                        {promotion.conditions.firstTimeOnly && (
                          <div className="text-xs text-blue-600">First-time only</div>
                        )}
                        {promotion.conditions.validCategories.length > 0 && (
                          <div className="text-xs text-purple-600">
                            {promotion.conditions.validCategories.length} categories
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion.usageCount} / {promotion.usageLimits.totalUses || '∞'}
                      </div>
                      {promotion.usageLimits.totalUses && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${getUsageProgress(promotion)}%` }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{promotion.validUntil}</div>
                      <div className={`text-xs ${new Date(promotion.validUntil) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
                        {new Date(promotion.validUntil) < new Date() ? 'Expired' : 'Valid'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(promotion.active)}`}>
                          {promotion.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(promotion.priority)}`}>
                          {promotion.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(promotion)}
                          className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                          title="Edit"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => duplicatePromotion(promotion)}
                          className="text-green-600 hover:text-green-900 w-8 h-8 flex items-center justify-center"
                          title="Duplicate"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                        <button
                          onClick={() => toggleActive(promotion.id)}
                          className={`${promotion.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} w-8 h-8 flex items-center justify-center`}
                          title={promotion.active ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`ri-${promotion.active ? 'pause' : 'play'}-circle-line`}></i>
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:text-red-900 w-8 h-8 flex items-center justify-center"
                          title="Delete"
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
        </div>

        {/* Campaign Manager Link */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Need to promote your deals?</h3>
              <p className="text-sm opacity-90">Create banners and homepage messages to showcase your active promotions</p>
            </div>
            <Link
              href="/admin/campaigns"
              className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center"
            >
              <i className="ri-megaphone-line mr-2"></i>
              Campaign Manager
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </h3>

            {submitStatus.message && (
              <div className={`mb-4 p-3 rounded-lg ${
                submitStatus.type === 'success' ? 'bg-green-50 text-green-800' :
                  submitStatus.type === 'error' ? 'bg-red-50 text-red-800' :
                    'bg-blue-50 text-blue-800'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form id="promotion-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={promotionForm.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code *</label>
                    <input
                      type="text"
                      name="code"
                      value={promotionForm.code}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      style={{ textTransform: 'uppercase' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Discount Type & Value */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Discount Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                    <select
                      name="type"
                      value={promotionForm.type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      <option value="percentage">Percentage Discount</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="shipping">Free Shipping</option>
                    </select>
                  </div>
                  {promotionForm.type !== 'shipping' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Value * {promotionForm.type === 'percentage' ? '(%)' : '($)'}
                      </label>
                      <input
                        type="number"
                        name="value"
                        value={promotionForm.value}
                        onChange={handleFormChange}
                        step={promotionForm.type === 'percentage' ? '1' : '0.01'}
                        min="0"
                        max={promotionForm.type === 'percentage' ? '100' : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Conditions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Conditions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value ($)</label>
                    <input
                      type="number"
                      name="conditions.minOrderValue"
                      value={promotionForm.conditions.minOrderValue}
                      onChange={handleFormChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={promotionForm.priority}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="conditions.firstTimeOnly"
                      checked={promotionForm.conditions.firstTimeOnly}
                      onChange={handleFormChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">First-time customers only</span>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Categories</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={promotionForm.conditions.validCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Products</label>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={promotionForm.conditions.validProducts.includes(product.id)}
                          onChange={() => handleProductChange(product.id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Usage Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Uses</label>
                    <input
                      type="number"
                      name="usageLimits.totalUses"
                      value={promotionForm.usageLimits.totalUses}
                      onChange={handleFormChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                    <input
                      type="number"
                      name="usageLimits.perUserLimit"
                      value={promotionForm.usageLimits.perUserLimit}
                      onChange={handleFormChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Validity Period</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
                    <input
                      type="date"
                      name="validFrom"
                      value={promotionForm.validFrom}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
                    <input
                      type="date"
                      name="validUntil"
                      value={promotionForm.validUntil}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={promotionForm.description}
                  onChange={handleFormChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Internal description for this promotion"
                />
                <p className="text-xs text-gray-500 mt-1">{promotionForm.description.length}/500 characters</p>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={promotionForm.active}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Active (promotion will be available for use)</label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPromotion(null);
                    resetForm();
                    setSubmitStatus({ type: '', message: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
                  disabled={submitStatus.type === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus.type === 'loading'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 flex items-center"
                >
                  {submitStatus.type === 'loading' ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      {editingPromotion ? 'Update' : 'Create'} Promotion
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}