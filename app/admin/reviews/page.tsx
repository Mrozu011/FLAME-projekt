
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
  flagged: boolean;
  flagReason?: string;
  adminReply?: {
    message: string;
    adminName: string;
    date: string;
  };
  helpfulCount: number;
  reportCount: number;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState(0);
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingToReview, setReplyingToReview] = useState<Review | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const itemsPerPage = 10;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 2, label: '2 Stars' },
    { value: 1, label: '1 Star' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' }
  ];

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterAndSortReviews();
  }, [reviews, searchTerm, filterStatus, filterRating, filterProduct, filterDate, sortBy]);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const mockReviews: Review[] = [
        {
          id: '1',
          productId: '1',
          productName: 'Elegant Summer Dress',
          productImage: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20product%20photo&width=100&height=100&seq=review-product-1&orientation=squarish',
          userId: 'user1',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.j@email.com',
          rating: 5,
          title: 'Perfect dress for summer!',
          comment: 'I absolutely love this dress! The fabric is so comfortable and the fit is perfect. The color is exactly as shown in the photos. Highly recommend!',
          date: '2024-01-20T10:30:00Z',
          status: 'approved',
          isVerifiedPurchase: true,
          isFeatured: true,
          flagged: false,
          helpfulCount: 24,
          reportCount: 0
        },
        {
          id: '2',
          productId: '2',
          productName: 'Classic White Blouse',
          productImage: 'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20product%20photo&width=100&height=100&seq=review-product-2&orientation=squarish',
          userId: 'user2',
          userName: 'Emma Wilson',
          userEmail: 'emma.w@email.com',
          rating: 4,
          title: 'Great quality blouse',
          comment: 'Nice blouse with good quality fabric. The fit is as expected but the sizing runs a bit small. Overall happy with the purchase.',
          date: '2024-01-19T14:15:00Z',
          status: 'approved',
          isVerifiedPurchase: true,
          isFeatured: false,
          flagged: false,
          helpfulCount: 12,
          reportCount: 0
        },
        {
          id: '3',
          productId: '1',
          productName: 'Elegant Summer Dress',
          productImage: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20product%20photo&width=100&height=100&seq=review-product-3&orientation=squarish',
          userId: 'user3',
          userName: 'Anonymous User',
          userEmail: 'user3@email.com',
          rating: 1,
          title: 'Terrible quality',
          comment: 'This dress is absolutely terrible! The fabric is cheap and the stitching is poor. Do not waste your money on this garbage!',
          date: '2024-01-18T16:45:00Z',
          status: 'pending',
          isVerifiedPurchase: false,
          isFeatured: false,
          flagged: true,
          flagReason: 'Inappropriate language',
          helpfulCount: 2,
          reportCount: 5
        },
        {
          id: '4',
          productId: '2',
          productName: 'Classic White Blouse',
          productImage: 'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20product%20photo&width=100&height=100&seq=review-product-4&orientation=squarish',
          userId: 'user4',
          userName: 'Lisa Chen',
          userEmail: 'lisa.c@email.com',
          rating: 3,
          title: 'Average product',
          comment: 'The blouse is okay but nothing special. The material feels decent but the buttons are a bit cheap. Price is fair for what you get.',
          date: '2024-01-17T09:20:00Z',
          status: 'approved',
          isVerifiedPurchase: true,
          isFeatured: false,
          flagged: false,
          helpfulCount: 8,
          reportCount: 0,
          adminReply: {
            message: 'Thank you for your feedback! We appreciate your honest review and will take your comments about the buttons into consideration for future improvements.',
            adminName: 'Support Team',
            date: '2024-01-17T15:30:00Z'
          }
        },
        {
          id: '5',
          productId: '1',
          productName: 'Elegant Summer Dress',
          productImage: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20product%20photo&width=100&height=100&seq=review-product-5&orientation=squarish',
          userId: 'user5',
          userName: 'Maria Rodriguez',
          userEmail: 'maria.r@email.com',
          rating: 4,
          title: 'Beautiful dress',
          comment: 'Really beautiful dress with great attention to detail. The only issue is that it wrinkles easily, but overall very satisfied with my purchase.',
          date: '2024-01-16T11:45:00Z',
          status: 'approved',
          isVerifiedPurchase: true,
          isFeatured: false,
          flagged: false,
          helpfulCount: 18,
          reportCount: 0
        },
        {
          id: '6',
          productId: '3',
          productName: 'Smart Fitness Watch',
          productImage: 'https://readdy.ai/api/search-image?query=smart%20fitness%20watch%20product%20photo&width=100&height=100&seq=review-product-6&orientation=squarish',
          userId: 'user6',
          userName: 'John Smith',
          userEmail: 'john.s@email.com',
          rating: 2,
          title: 'Disappointing experience',
          comment: 'The watch looks nice but the battery life is much shorter than advertised. Also had issues with the heart rate monitor accuracy.',
          date: '2024-01-15T13:30:00Z',
          status: 'pending',
          isVerifiedPurchase: true,
          isFeatured: false,
          flagged: false,
          helpfulCount: 5,
          reportCount: 0
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReviews = () => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(review => review.status === filterStatus);
    }

    if (filterRating > 0) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    if (filterProduct !== 'all') {
      filtered = filtered.filter(review => review.productId === filterProduct);
    }

    if (filterDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (filterDate) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      if (filterDate !== 'all') {
        filtered = filtered.filter(review => new Date(review.date) >= filterDate);
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpfulCount - a.helpfulCount;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`text-sm ${
              star <= rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setSubmitStatus({ type: 'loading', message: 'Updating review status...' });

      const formData = new URLSearchParams();
      formData.append('reviewId', reviewId);
      formData.append('status', newStatus);
      formData.append('action', 'updateStatus');

      const response = await fetch('https://readdy.ai/api/form/reviews-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setReviews(prev => prev.map(review =>
          review.id === reviewId ? { ...review, status: newStatus } : review
        ));
        setSubmitStatus({ type: 'success', message: `Review ${newStatus} successfully!` });
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to update review status.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error occurred.' });
    }

    setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
  };

  const handleFeaturedToggle = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const formData = new URLSearchParams();
      formData.append('reviewId', reviewId);
      formData.append('isFeatured', (!review.isFeatured).toString());
      formData.append('action', 'toggleFeatured');

      const response = await fetch('https://readdy.ai/api/form/reviews-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setReviews(prev => prev.map(rev =>
          rev.id === reviewId ? { ...rev, isFeatured: !rev.isFeatured } : rev
        ));
        setSubmitStatus({
          type: 'success',
          message: `Review ${review.isFeatured ? 'removed from' : 'added to'} featured reviews!`
        });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to update featured status.' });
    }

    setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
  };

  const handleReplySubmit = async () => {
    if (!replyingToReview || !replyMessage.trim()) return;

    try {
      setSubmitStatus({ type: 'loading', message: 'Submitting reply...' });

      const formData = new URLSearchParams();
      formData.append('reviewId', replyingToReview.id);
      formData.append('replyMessage', replyMessage);
      formData.append('adminName', 'Support Team');
      formData.append('action', 'addReply');

      const response = await fetch('https://readdy.ai/api/form/reviews-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        const adminReply = {
          message: replyMessage,
          adminName: 'Support Team',
          date: new Date().toISOString()
        };

        setReviews(prev => prev.map(review =>
          review.id === replyingToReview.id
            ? { ...review, adminReply }
            : review
        ));

        setShowReplyModal(false);
        setReplyingToReview(null);
        setReplyMessage('');
        setSubmitStatus({ type: 'success', message: 'Reply submitted successfully!' });
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to submit reply.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error occurred.' });
    }

    setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedReviews.length === 0) return;

    try {
      setSubmitStatus({ type: 'loading', message: `Processing ${action} for selected reviews...` });

      const formData = new URLSearchParams();
      formData.append('reviewIds', JSON.stringify(selectedReviews));
      formData.append('bulkAction', action);
      formData.append('action', 'bulkUpdate');

      const response = await fetch('https://readdy.ai/api/form/reviews-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        if (action === 'delete') {
          setReviews(prev => prev.filter(review => !selectedReviews.includes(review.id)));
        } else {
          setReviews(prev => prev.map(review =>
            selectedReviews.includes(review.id)
              ? { ...review, status: action === 'approve' ? 'approved' : 'rejected' }
              : review
          ));
        }

        setSelectedReviews([]);
        setSubmitStatus({ type: 'success', message: `${action} completed successfully!` });
      } else {
        setSubmitStatus({ type: 'error', message: `Failed to ${action} selected reviews.` });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error occurred.' });
    }

    setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterRating(0);
    setFilterProduct('all');
    setFilterDate('all');
    setSortBy('newest');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const uniqueProducts = [...new Set(reviews.map(r => ({ id: r.productId, name: r.productName })))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredReviews.length} of {reviews.length} reviews
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                  {reviews.filter(r => r.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : submitStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
            <div className="flex items-center">
              <i className={`${submitStatus.type === 'success' ? 'ri-check-circle-line' : submitStatus.type === 'error' ? 'ri-error-warning-line' : 'ri-loader-4-line animate-spin'} mr-2`}></i>
              {submitStatus.message}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search reviews, products, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="all">All Products</option>
                {uniqueProducts.map((product, index) => (
                  <option key={`product-${product.id}-${index}`} value={product.id}>{product.name}</option>
                ))}
              </select>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={resetFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-refresh-line mr-2"></i>Reset
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReviews.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-blue-800">
                  {selectedReviews.length} review{selectedReviews.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    <i className="ri-check-line mr-1"></i>Approve
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    <i className="ri-close-line mr-1"></i>Reject
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>Delete
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedReviews([])}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-star-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentItems.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReviews([...selectedReviews, review.id]);
                        } else {
                          setSelectedReviews(selectedReviews.filter(id => id !== review.id));
                        }
                      }}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />

                    <div className="flex-shrink-0">
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{review.title}</h3>
                          {renderStars(review.rating)}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(review.status)}`}>
                            {review.status}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <i className="ri-shield-check-line mr-1"></i>Verified Purchase
                            </span>
                          )}
                          {review.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <i className="ri-star-line mr-1"></i>Featured
                            </span>
                          )}
                          {review.flagged && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <i className="ri-flag-line mr-1"></i>Flagged
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">
                          Product: <Link href={`/product/${review.productId}`} className="text-blue-600 hover:text-blue-800">{review.productName}</Link>
                        </p>
                        <p className="text-sm text-gray-600">
                          By: {review.userName} ({review.userEmail})
                        </p>
                      </div>

                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      {review.adminReply && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className="ri-customer-service-line text-blue-600"></i>
                            <span className="text-sm font-medium text-blue-800">Admin Reply</span>
                            <span className="text-xs text-blue-600">• {formatDate(review.adminReply.date)}</span>
                          </div>
                          <p className="text-sm text-blue-700">{review.adminReply.message}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <i className="ri-thumb-up-line mr-1"></i>
                            {review.helpfulCount} helpful
                          </span>
                          {review.reportCount > 0 && (
                            <span className="flex items-center text-red-600">
                              <i className="ri-error-warning-line mr-1"></i>
                              {review.reportCount} reports
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {review.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(review.id, 'approved')}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                <i className="ri-check-line mr-1"></i>Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(review.id, 'rejected')}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                <i className="ri-close-line mr-1"></i>Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleFeaturedToggle(review.id)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              review.isFeatured
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <i className="ri-star-line mr-1"></i>
                            {review.isFeatured ? 'Remove Featured' : 'Feature'}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingToReview(review);
                              setShowReplyModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            <i className="ri-reply-line mr-1"></i>Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{` `}
                      <span className="font-medium">{Math.min(indexOfLastItem, filteredReviews.length)}</span> of{` `}
                      <span className="font-medium">{filteredReviews.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && replyingToReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply to Review</h3>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900">{replyingToReview.title}</h4>
                {renderStars(replyingToReview.rating)}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                By: {replyingToReview.userName} • {formatDate(replyingToReview.date)}
              </p>
              <p className="text-gray-700">{replyingToReview.comment}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Write your reply to this review..."
              />
              <p className="text-xs text-gray-500 mt-1">
                This reply will be visible to all customers on the product page
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyingToReview(null);
                  setReplyMessage('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={!replyMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
