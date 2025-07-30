'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExpandableSection from './ExpandableSection';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  size?: string;
  color?: string;
  images?: string[];
  adminReply?: {
    message: string;
    adminName: string;
    date: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export default function ProductReviews({ productId, rating, reviewCount }: ProductReviewsProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(0);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    size: '',
    color: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockReviews: Review[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah M.',
      rating: 5,
      title: 'Perfect dress for summer!',
      comment: 'I absolutely love this dress. The fabric is light and comfortable, perfect for hot summer days. The fit is exactly as described and the color is beautiful.',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      size: 'M',
      color: 'Navy',
      adminReply: {
        message: 'Thank you so much for your wonderful review! We\'re thrilled to hear that you love the dress. Your feedback about the comfort and fit is invaluable to us and other customers.',
        adminName: 'Customer Support Team',
        date: '2024-01-16'
      }
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jennifer L.',
      rating: 4,
      title: 'Great quality but runs small',
      comment: 'Beautiful dress with excellent quality fabric. However, it runs a bit small, so I would recommend sizing up. The color is vibrant and the style is very elegant.',
      date: '2024-01-10',
      verified: true,
      helpful: 8,
      size: 'L',
      color: 'Red'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Maria R.',
      rating: 5,
      title: 'Exceeded expectations!',
      comment: 'This dress exceeded all my expectations. The quality is amazing for the price, and it looks exactly like the photos. Highly recommend!',
      date: '2024-01-08',
      verified: true,
      helpful: 15,
      size: 'S',
      color: 'Black'
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Amanda K.',
      rating: 3,
      title: 'Good but not great',
      comment: 'The dress is decent but not as flattering as I hoped. The material feels a bit cheap and the color was slightly different from the photo.',
      date: '2024-01-05',
      verified: true,
      helpful: 3,
      size: 'M',
      color: 'Navy'
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'Lisa Chen',
      rating: 4,
      title: 'Love the style!',
      comment: 'Really love the style of this dress. It\'s perfect for both casual and semi-formal occasions. The fabric is comfortable and the fit is good.',
      date: '2024-01-03',
      verified: true,
      helpful: 7,
      size: 'M',
      color: 'Black'
    }
  ];

  useEffect(() => {
    setReviews(mockReviews);
    
    // Check if user is logged in and has purchased
    const userSession = localStorage.getItem('flame-user-session');
    if (userSession) {
      setIsLoggedIn(true);
      // Mock check for purchase history
      setHasPurchased(true);
    }
  }, [productId]);

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            disabled={!interactive}
          >
            <i className={`text-sm ${
              star <= rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'
            }`}></i>
          </button>
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  const getFilteredReviews = () => {
    let filtered = reviews;
    
    if (filterRating > 0) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'highest':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return filtered.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return filtered.sort((a, b) => b.helpful - a.helpful);
      default:
        return filtered;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (!hasPurchased) {
      setSubmitStatus({ type: 'error', message: 'Only verified purchasers can write reviews' });
      return;
    }

    if (newReview.rating === 0 || !newReview.title.trim() || !newReview.comment.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: 'loading', message: 'Submitting your review...' });

    try {
      const formData = new URLSearchParams();
      formData.append('productId', productId);
      formData.append('rating', newReview.rating.toString());
      formData.append('title', newReview.title);
      formData.append('comment', newReview.comment);
      formData.append('size', newReview.size);
      formData.append('color', newReview.color);
      formData.append('userId', 'current-user-id');
      formData.append('userName', 'Current User');
      formData.append('action', 'submitReview');

      const response = await fetch('https://readdy.ai/api/form/product-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        const reviewData: Review = {
          id: Date.now().toString(),
          userId: 'current-user-id',
          userName: 'Current User',
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
          date: new Date().toISOString().split('T')[0],
          verified: true,
          helpful: 0,
          size: newReview.size,
          color: newReview.color
        };

        setReviews(prev => [reviewData, ...prev]);
        setNewReview({ rating: 0, title: '', comment: '', size: '', color: '' });
        setShowReviewForm(false);
        setSubmitStatus({ type: 'success', message: 'Your review has been submitted successfully!' });
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to submit review. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('reviewId', reviewId);
      formData.append('action', 'markHelpful');

      const response = await fetch('https://readdy.ai/api/form/product-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful: review.helpful + 1 }
            : review
        ));
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const ratingDistribution = getRatingDistribution();
  const filteredReviews = getFilteredReviews();

  return (
    <ExpandableSection
      title={`Reviews (${reviewCount})`}
      content={
        <div className="space-y-6">
          {submitStatus.message && (
            <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : submitStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
              <div className="flex items-center">
                <i className={`${submitStatus.type === 'success' ? 'ri-check-circle-line' : submitStatus.type === 'error' ? 'ri-error-warning-line' : 'ri-loader-4-line animate-spin'} mr-2`}></i>
                {submitStatus.message}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{rating}</div>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {renderStars(rating)}
                  </div>
                  <div className="text-sm text-gray-600">Based on {reviewCount} reviews</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {ratingDistribution.map((count, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm w-4">{5 - index}</span>
                    <i className="ri-star-line text-yellow-400 text-sm"></i>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors mb-4 whitespace-nowrap"
              >
                Write a Review
              </button>
              
              {showReviewForm && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  {!isLoggedIn ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Please log in to write a review</p>
                      <button 
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Log In
                      </button>
                    </div>
                  ) : !hasPurchased ? (
                    <div className="text-center">
                      <p className="text-gray-600">Only verified purchasers can write reviews</p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                        <div className="flex items-center space-x-2">
                          {renderStars(newReview.rating, true, (rating) => setNewReview(prev => ({ ...prev, rating })))}
                          <span className="text-sm text-gray-600 ml-2">
                            {newReview.rating > 0 ? `${newReview.rating} star${newReview.rating > 1 ? 's' : ''}` : 'Select rating'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                          type="text"
                          value={newReview.title}
                          onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Give your review a title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review *</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                          placeholder="Share your thoughts about this product"
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {newReview.comment.length}/500 characters
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Size (Optional)</label>
                          <input
                            type="text"
                            value={newReview.size}
                            onChange={(e) => setNewReview(prev => ({ ...prev, size: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="e.g., M, L, XL"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color (Optional)</label>
                          <input
                            type="text"
                            value={newReview.color}
                            onChange={(e) => setNewReview(prev => ({ ...prev, color: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="e.g., Black, Navy, Red"
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setNewReview({ rating: 0, title: '', comment: '', size: '', color: '' });
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black pr-8"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter by rating:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black pr-8"
              >
                <option value="0">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-gray-600"></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{review.userName}</h4>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            <i className="ri-shield-check-line mr-1"></i>Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{formatDate(review.date)}</span>
                        {review.size && <span>Size: {review.size}</span>}
                        {review.color && <span>Color: {review.color}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                {review.adminReply && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-customer-service-line text-blue-600"></i>
                      <span className="text-sm font-medium text-blue-800">Response from {review.adminReply.adminName}</span>
                      <span className="text-xs text-blue-600">• {formatDate(review.adminReply.date)}</span>
                    </div>
                    <p className="text-sm text-blue-700">{review.adminReply.message}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleHelpfulClick(review.id)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <i className="ri-thumb-up-line"></i>
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <i className="ri-flag-line mr-1"></i>Report
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <i className="ri-star-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 mb-4">No reviews found matching your criteria.</p>
              <button
                onClick={() => {
                  setSortBy('newest');
                  setFilterRating(0);
                }}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                View All Reviews
              </button>
            </div>
          )}
        </div>
      }
    />
  );
}