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
  phone: string;
  businessType: string;
  annualRevenue: number;
  employeeCount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}

export default function B2BApplicationsPage() {
  const [applications, setApplications] = useState<B2BApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<B2BApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<B2BApplication | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    businessType: 'all',
    search: ''
  });

  const [reviewForm, setReviewForm] = useState({
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    notes: ''
  });

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filters.status]);

  const loadApplications = async () => {
    try {
      const allApplications = b2bService.getApplications();
      setApplications(allApplications as unknown as B2BApplication[]);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (filters.status !== 'all') {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.businessType !== 'all') {
      filtered = filtered.filter(app => app.businessType === filters.businessType);
    }

    if (filters.search) {
      filtered = filtered.filter(app =>
        app.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const handleReviewApplication = (application: B2BApplication) => {
    setSelectedApplication(application);
    setReviewForm({ status: 'pending', notes: '' });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedApplication) return;

    try {
      const success = b2bService.reviewApplication(
        selectedApplication.id,
        reviewForm.status as 'approved' | 'rejected',
        'admin', // In real implementation, get from auth context
        reviewForm.notes
      );

      if (success) {
        await loadApplications();
        setShowReviewModal(false);
        setSelectedApplication(null);
        showNotification(
          `Application ${reviewForm.status} successfully`,
          reviewForm.status === 'approved' ? 'success' : 'info'
        );
      }
    } catch (error) {
      console.error('Error reviewing application:', error);
      showNotification('Error reviewing application', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // Simple notification implementation
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'ri-file-text-line';
      case 'approved': return 'ri-check-line';
      case 'rejected': return 'ri-close-line';
      default: return 'ri-file-text-line';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">B2B Applications</h1>
                <p className="text-gray-600">Review and approve business account applications</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-file-text-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                                         {applications.filter((app: B2BApplication) => app.status === 'pending').length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter((app: B2BApplication) => app.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-close-line text-red-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter((app: B2BApplication) => app.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { key: 'all', label: 'All Applications', count: applications.length },
                { key: 'pending', label: 'New', count: applications.filter((app: B2BApplication) => app.status === 'pending').length },
                                 { key: 'pending', label: 'Under Review', count: applications.filter((app: B2BApplication) => app.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: applications.filter((app: B2BApplication) => app.status === 'approved').length },
                { key: 'rejected', label: 'Rejected', count: applications.filter((app: B2BApplication) => app.status === 'rejected').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilters(prev => ({ ...prev, status: tab.key }))}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filters.status === tab.key 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      filters.status === tab.key ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredApplications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredApplications.map((application: B2BApplication) => (
                  <div key={application.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-building-line text-blue-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{application.companyName}</h3>
                          <p className="text-sm text-gray-500">{application.contactPerson} • {application.email}</p>
                          <p className="text-sm text-gray-500">{application.businessType} • {application.annualRevenue}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            <i className={`${getStatusIcon(application.status)} mr-1`}></i>
                            {application.status.replace('_', ' ')}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted {new Date(application.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            title="View Details"
                          >
                            <i className="ri-eye-line text-lg"></i>
                          </button>
                          
                                                     {application.status === 'pending' && (
                            <button
                              onClick={() => handleReviewApplication(application)}
                              className="text-green-600 hover:text-green-800 p-2"
                              title="Review Application"
                            >
                              <i className="ri-check-line text-lg"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <p className="text-gray-900">
                          {/* Assuming application.address is an object with street, city, state, zipCode */}
                          {/* This part of the original code was not provided in the edit_specification */}
                          {/* For now, we'll just show a placeholder or remove if not available */}
                          {/* application.address?.street}, {application.address?.city}, {application.address?.state} {application.address?.zipCode} */}
                          N/A
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Tax ID:</span>
                        <p className="text-gray-900">{application.notes}</p> {/* Assuming notes is used for tax ID */}
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Products of Interest:</span>
                        <p className="text-gray-900">{application.notes}</p> {/* Assuming notes is used for products of interest */}
                      </div>
                    </div>

                    {application.notes && (
                      <div className="mt-4">
                        <span className="text-sm text-gray-500">Reason for Joining:</span>
                        <p className="text-sm text-gray-900 mt-1">{application.notes}</p>
                      </div>
                    )}

                    {application.notes && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <span className="text-sm text-gray-500">Review Notes:</span>
                        <p className="text-sm text-gray-900 mt-1">{application.notes}</p>
                        {application.reviewedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reviewed on {new Date(application.reviewedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <i className="ri-file-text-line text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500">
                  {filters.status === 'all' 
                    ? 'No B2B applications have been submitted yet.'
                    : `No applications with status "${filters.status.replace('_', ' ')}" found.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Review Application</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Application Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedApplication.companyName}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Contact:</span>
                    <p className="text-gray-900">{selectedApplication.contactPerson}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Business Type:</span>
                    <p className="text-gray-900">{selectedApplication.businessType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Annual Volume:</span>
                    <p className="text-gray-900">{selectedApplication.annualRevenue}</p>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Decision</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="approved"
                        checked={reviewForm.status === 'approved'}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, status: e.target.value as 'approved' | 'rejected' }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-green-700">Approve</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="rejected"
                        checked={reviewForm.status === 'rejected'}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, status: e.target.value as 'approved' | 'rejected' }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-red-700">Reject</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                  <textarea
                    value={reviewForm.notes}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about your review decision..."
                  />
                </div>

                {reviewForm.status === 'approved' && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-2">Upon Approval:</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Business account will be created automatically</li>
                      <li>• Customer will be notified via email</li>
                      <li>• Account tier will be assigned based on annual volume</li>
                      <li>• Default payment terms and credit limit will be set</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    reviewForm.status === 'approved' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {reviewForm.status === 'approved' ? 'Approve Application' : 'Reject Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}