
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslation } from '@/hooks/useTranslation';

interface Recommendation {
  productId: string;
  score: number;
  confidence: number;
  type: 'behavioral' | 'collaborative' | 'popularity' | 'category';
  reasons: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface RecommendationSectionProps {
  title: string;
  userId: string;
  context: {
    type: 'homepage' | 'product_page' | 'cart' | 'category' | 'search';
    currentProductId?: string;
    currentCategory?: string;
    cartItems?: string[];
    searchQuery?: string;
  };
  limit?: number;
  showReasons?: boolean;
}

// Mock recommendation engine
const mockRecommendationEngine = {
  getRecommendations: (userId: string, context: any, limit: number): Recommendation[] => {
    const mockRecommendations: Recommendation[] = [
      {
        productId: '1',
        score: 0.95,
        confidence: 0.88,
        type: 'behavioral',
        reasons: ['Based on your browsing history', 'Similar to items you viewed']
      },
      {
        productId: '2',
        score: 0.87,
        confidence: 0.75,
        type: 'collaborative',
        reasons: ['Users like you also bought this', 'Trending in your area']
      },
      {
        productId: '3',
        score: 0.82,
        confidence: 0.69,
        type: 'popularity',
        reasons: ['Popular this week', 'High customer ratings']
      },
      {
        productId: '4',
        score: 0.78,
        confidence: 0.65,
        type: 'category',
        reasons: ['From your favorite category', 'New arrivals']
      }
    ];
    
    return mockRecommendations.slice(0, limit);
  },
  
  getProduct: (productId: string): Product | null => {
    const mockProducts: { [key: string]: Product } = {
      '1': {
        id: '1',
        name: 'Elegant Summer Dress',
        price: 89.99,
        image: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20fashion%20photography%2C%20model%20wearing%20stylish%20dress%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=rec-1&orientation=portrait',
        category: 'Women',
        rating: 4.8
      },
      '2': {
        id: '2',
        name: 'Classic White Blouse',
        price: 45.99,
        image: 'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20fashion%20photography%2C%20professional%20business%20attire%2C%20model%20wearing%20elegant%20shirt%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=rec-2&orientation=portrait',
        category: 'Women',
        rating: 4.6
      },
      '3': {
        id: '3',
        name: 'Casual Denim Jacket',
        price: 79.99,
        image: 'https://readdy.ai/api/search-image?query=casual%20denim%20jacket%20fashion%20photography%2C%20stylish%20jean%20jacket%2C%20model%20wearing%20denim%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=rec-3&orientation=portrait',
        category: 'Men',
        rating: 4.4
      },
      '4': {
        id: '4',
        name: 'Stylish Handbag',
        price: 129.99,
        image: 'https://readdy.ai/api/search-image?query=stylish%20handbag%20fashion%20photography%2C%20luxury%20leather%20bag%2C%20elegant%20purse%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=rec-4&orientation=portrait',
        category: 'Accessories',
        rating: 4.9
      }
    };
    
    return mockProducts[productId] || null;
  },
  
  trackUserBehavior: (behavior: any) => {
    // Mock behavior tracking
    console.log('Tracking user behavior:', behavior);
  }
};

export default function RecommendationSection({
  title,
  userId,
  context,
  limit = 8,
  showReasons = false
}: RecommendationSectionProps) {
  const { format } = useCurrency();
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const recs = mockRecommendationEngine.getRecommendations(userId, context, limit);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [userId, context, limit]);

  const handleProductClick = useCallback((productId: string) => {
    mockRecommendationEngine.trackUserBehavior({
      userId,
      productId,
      action: 'view',
      timestamp: new Date(),
      context: context.type
    });
  }, [userId, context.type]);

  const handleAddToCart = useCallback((productId: string) => {
    mockRecommendationEngine.trackUserBehavior({
      userId,
      productId,
      action: 'add_to_cart',
      timestamp: new Date(),
      context: context.type
    });
    
    // Add to cart functionality
    try {
      const product = mockRecommendationEngine.getProduct(productId);
      if (!product) return;

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: 'M',
        color: 'Default',
        category: product.category
      };

      const savedCart = localStorage.getItem('flame-cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      const existingItemIndex = cartItems.findIndex((item: any) => 
        item.id === product.id && item.size === 'M' && item.color === 'Default'
      );

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push(cartItem);
      }

      localStorage.setItem('flame-cart', JSON.stringify(cartItems));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [userId, context.type]);

  const handleAddToWishlist = useCallback((productId: string) => {
    mockRecommendationEngine.trackUserBehavior({
      userId,
      productId,
      action: 'add_to_wishlist',
      timestamp: new Date(),
      context: context.type
    });
    
    // Add to wishlist functionality
    try {
      const product = mockRecommendationEngine.getProduct(productId);
      if (!product) return;

      const savedFavorites = localStorage.getItem('flame-favorites');
      const favoriteItems = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      const favoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      };

      if (!favoriteItems.find((item: any) => item.id === product.id)) {
        favoriteItems.push(favoriteItem);
        localStorage.setItem('flame-favorites', JSON.stringify(favoriteItems));
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  }, [userId, context.type]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'behavioral':
        return 'ri-user-heart-line';
      case 'collaborative':
        return 'ri-team-line';
      case 'popularity':
        return 'ri-fire-line';
      case 'category':
        return 'ri-price-tag-3-line';
      default:
        return 'ri-star-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral':
        return 'text-blue-500';
      case 'collaborative':
        return 'text-green-500';
      case 'popularity':
        return 'text-orange-500';
      case 'category':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-theme-primary">{title}</h2>
        <div className="flex items-center space-x-2 text-sm text-theme-secondary">
          <i className="ri-robot-line"></i>
          <span>AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.map((recommendation) => {
          const product = mockRecommendationEngine.getProduct(recommendation.productId);
          if (!product) return null;

          return (
            <div
              key={recommendation.productId}
              className="group card-theme rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <Link href={`/product/${product.id}`} onClick={() => handleProductClick(product.id)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* Recommendation Type Badge */}
                <div className="absolute top-2 left-2">
                  <div className={`w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md ${getTypeColor(recommendation.type)}`}>
                    <i className={`${getTypeIcon(recommendation.type)} text-sm`}></i>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="absolute top-2 right-2">
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {Math.round(recommendation.confidence * 100)}%
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToWishlist(product.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <i className="ri-heart-line text-sm text-theme-primary"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <i className="ri-shopping-cart-line text-sm text-theme-primary"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Link href={`/product/${product.id}`} onClick={() => handleProductClick(product.id)}>
                  <h3 className="font-semibold text-theme-primary group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-theme-secondary mb-2">{product.category}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-theme-primary">{format(product.price)}</span>
                  <div className="flex items-center space-x-1">
                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                    <span className="text-sm text-theme-secondary">{product.rating}</span>
                  </div>
                </div>

                {/* Recommendation Reasons */}
                {showReasons && recommendation.reasons.length > 0 && (
                  <div className="mb-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        <i className="ri-lightbulb-line mr-1"></i>
                        {recommendation.reasons[0]}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommendation Score */}
                <div className="flex items-center justify-between text-xs text-theme-tertiary">
                  <span className="capitalize">{recommendation.type} match</span>
                  <span>{Math.round(recommendation.score * 100)}% score</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {recommendations.length === limit && (
        <div className="text-center mt-8">
          <button className="btn-secondary px-6 py-2 rounded-lg transition-colors cursor-pointer">
            Show More Recommendations
          </button>
        </div>
      )}
    </div>
  );
}
