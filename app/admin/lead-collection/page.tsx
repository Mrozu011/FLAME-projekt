'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeadCollectionPage() {
  const [activeTab, setActiveTab] = useState('forms');
  const [leadForms, setLeadForms] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    fields: [],
    settings: {
      enableNotifications: true,
      redirectUrl: '',
      thankYouMessage: 'Thank you for your interest! We will contact you soon.'
    }
  });

  useEffect(() => {
    // Load existing forms and leads
    const mockForms = [
      {
        id: 1,
        name: 'Newsletter Signup',
        title: 'Subscribe to Our Newsletter',
        description: 'Stay updated with our latest products and offers',
        fields: ['email', 'name'],
        submissions: 156,
        conversionRate: 8.5,
        status: 'active',
        created: '2024-01-10'
      },
      {
        id: 2,
        name: 'Contact Form',
        title: 'Get In Touch',
        description: 'Have questions? We\'d love to hear from you',
        fields: ['name', 'email', 'phone', 'message'],
        submissions: 89,
        conversionRate: 12.3,
        status: 'active',
        created: '2024-01-08'
      },
      {
        id: 3,
        name: 'Product Inquiry',
        title: 'Request Product Information',
        description: 'Get detailed information about our products',
        fields: ['name', 'email', 'product', 'message'],
        submissions: 45,
        conversionRate: 15.2,
        status: 'draft',
        created: '2024-01-05'
      }
    ];

    const mockLeads = [
      {
        id: 1,
        formId: 1,
        formName: 'Newsletter Signup',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        message: 'Interested in your latest fashion collection',
        product: 'Premium Headphones',
        source: 'Homepage',
        status: 'new',
        priority: 'high',
        submittedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        formId: 2,
        formName: 'Contact Form',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 987-6543',
        message: 'Question about shipping times and returns policy',
        source: 'Contact Page',
        status: 'contacted',
        priority: 'medium',
        submittedAt: '2024-01-14T14:15:00Z'
      },
      {
        id: 3,
        formId: 3,
        formName: 'Product Inquiry',
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1 (555) 456-7890',
        message: 'Looking for bulk purchase options for corporate gifts',
        product: 'Wireless Speaker',
        source: 'Product Page',
        status: 'qualified',
        priority: 'high',
        submittedAt: '2024-01-13T09:20:00Z'
      }
    ];

    setLeadForms(mockForms);
    setLeads(mockLeads);
  }, []);

  const handleCreateForm = () => {
    const newForm = {
      id: Date.now(),
      name: formData.name,
      title: formData.title,
      description: formData.description,
      fields: formData.fields,
      submissions: 0,
      conversionRate: 0,
      status: 'draft',
      created: new Date().toISOString().split('T')[0]
    };

    setLeadForms([...leadForms, newForm]);
    setFormData({
      name: '',
      title: '',
      description: '',
      fields: [],
      settings: {
        enableNotifications: true,
        redirectUrl: '',
        thankYouMessage: 'Thank you for your interest! We will contact you soon.'
      }
    });
    setShowCreateForm(false);
  };

  const handleLeadStatusUpdate = (leadId, newStatus) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus }
        : lead
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return priorityConfig[priority] || 'bg-gray-100 text-gray-800';
  };

  const getFormStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lead Collection</h1>
                <p className="text-sm text-gray-500">Manage lead forms and customer inquiries</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <i className="ri-add-line mr-2"></i>
              Create Lead Form
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-form-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{leadForms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-add-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-notification-line text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leads.filter(lead => lead.status === 'new').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-trophy-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">12.3%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('forms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'forms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lead Forms
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Leads
              </button>
            </nav>
          </div>

          {/* Forms Tab */}
          {activeTab === 'forms' && (
            <div className="p-6">
              <div className="space-y-6">
                {leadForms.map((form) => (
                  <div key={form.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{form.name}</h3>
                        <p className="text-sm text-gray-600">{form.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormStatusBadge(form.status)}`}>
                          {form.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="ri-edit-line"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{form.submissions}</div>
                        <div className="text-sm text-gray-600">Total Submissions</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{form.conversionRate}%</div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{form.fields.length}</div>
                        <div className="text-sm text-gray-600">Form Fields</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {form.fields.map((field) => (
                        <span key={field} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {field}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Created: {form.created}</span>
                      <div className="flex items-center space-x-2">
                        <button className="text-green-600 hover:text-green-800 text-sm">
                          <i className="ri-eye-line mr-1"></i>
                          View Submissions
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <i className="ri-code-line mr-1"></i>
                          Get Embed Code
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <i className="ri-user-line text-gray-600"></i>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-500">{lead.email}</div>
                              {lead.phone && (
                                <div className="text-sm text-gray-500">{lead.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.formName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowLeadModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                            <button
                              onClick={() => handleLeadStatusUpdate(lead.id, 'contacted')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Contacted"
                            >
                              <i className="ri-phone-line"></i>
                            </button>
                            <button
                              className="text-purple-600 hover:text-purple-900"
                              title="Convert to Customer"
                            >
                              <i className="ri-user-add-line"></i>
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
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Lead Form</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Newsletter Signup"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Subscribe to Our Newsletter"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the form purpose"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Fields</label>
                <div className="grid grid-cols-2 gap-2">
                  {['name', 'email', 'phone', 'message', 'company', 'product'].map((field) => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.fields.includes(field)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, fields: [...formData.fields, field] });
                          } else {
                            setFormData({ ...formData, fields: formData.fields.filter(f => f !== field) });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
                <textarea
                  value={formData.settings.thankYouMessage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    settings: { ...formData.settings, thankYouMessage: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.settings.enableNotifications}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    settings: { ...formData.settings, enableNotifications: e.target.checked }
                  })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Enable email notifications for new submissions</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Create Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Name:</strong> {selectedLead.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {selectedLead.email}
                    </p>
                    {selectedLead.phone && (
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {selectedLead.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Lead Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Form:</strong> {selectedLead.formName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Source:</strong> {selectedLead.source}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Submitted:</strong> {formatDate(selectedLead.submittedAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedLead.product && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Product Interest</h4>
                  <p className="text-sm text-gray-600">{selectedLead.product}</p>
                </div>
              )}
              
              {selectedLead.message && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{selectedLead.message}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(selectedLead.priority)}`}>
                    {selectedLead.priority}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLeadStatusUpdate(selectedLead.id, 'contacted')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 whitespace-nowrap"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => handleLeadStatusUpdate(selectedLead.id, 'qualified')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                  >
                    Mark as Qualified
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}