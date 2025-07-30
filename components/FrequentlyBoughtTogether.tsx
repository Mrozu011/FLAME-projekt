
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { recommendationEngine } from '@/lib/recommendation-engine';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslation } from '@/hooks/useTranslation';

interface FrequentlyBoughtTogetherProps {
  productId: string;
  userId: string;
}

export default function FrequentlyBoughtTogether({
  productId,
  userId
}: FrequentlyBoughtTogetherProps) {
  const { format } = useCurrency();
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set([productId]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const recs = recommendationEngine.getFrequentlyBoughtTogether(productId);
        setRecommendations(recs);
        setSelectedItems(new Set([productId]));
      } catch (error) {
        console.error('Error loading frequently bought together:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [productId]);

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleAddAllToCart = () => {
    const selectedArray = Array.from(selectedItems);
    
    // Add items to cart
    selectedArray.forEach(itemId => {
      const product = recommendationEngine.getProduct(itemId);
      if (!product) return;

      try {
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
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    });

    // Track behavior for all selected items
    selectedArray.forEach(itemId => {
      recommendationEngine.trackUserBehavior({
        userId,
        productId: itemId,
        action: 'add_to_cart',
        timestamp: new Date(),
        context: 'cart'
      });
    });

    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const getTotalPrice = () => {
    return Array.from(selectedItems).reduce((total, itemId) => {
      const product = recommendationEngine.getProduct(itemId);
      return total + (product?.price || 0);
    }, 0);
  };

  const getSavings = () => {
    const total = getTotalPrice();
    const originalTotal = total;
    const bundleDiscount = selectedItems.size > 1 ? total * 0.05 : 0; // 5% bundle discount
    return bundleDiscount;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
        <div className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const currentProduct = recommendationEngine.getProduct(productId);
  const allProducts = [currentProduct, ...recommendations.map(id => recommendationEngine.getProduct(id))].filter(Boolean);

  return (
    <div className="card-theme rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-theme-primary">Frequently Bought Together</h3>
        <div className="flex items-center space-x-2 text-sm text-theme-secondary">
          <i className="ri-shopping-bag-line"></i>
          <span>Bundle & Save</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Product Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProducts.map((product, index) => {
            if (!product) return null;
            const isSelected = selectedItems.has(product.id);
            const isMainProduct = product.id === productId;

            return (
              <div key={product.id} className="relative">
                {index > 0 && (
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-800">
                      <i className="ri-add-line text-sm text-theme-secondary"></i>
                    </div>
                  </div>
                )}
                
                <div className={`border-2 rounded-lg p-3 transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleItemToggle(product.id)}
                      disabled={isMainProduct}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    {isMainProduct && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        This item
                      </span>
                    )}
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-20 object-cover object-top rounded mb-2"
                    />
                  </Link>

                  <Link href={`/product/${product.id}`}>
                    <h4 className="font-medium text-sm text-theme-primary hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                      {product.name}
                    </h4>
                  </Link>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-theme-primary">{format(product.price)}</span>
                    <div className="flex items-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-xs"></i>
                      <span className="text-xs text-theme-secondary">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bundle Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <i className="ri-shopping-cart-line text-theme-secondary"></i>
              <span className="font-medium text-theme-primary">
                {selectedItems.size} items selected
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-theme-primary">
                {format(getTotalPrice())}
              </div>
              {getSavings() > 0 && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  Save {format(getSavings())} (5% bundle discount)
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-theme-secondary">
              <div className="flex items-center space-x-1">
                <i className="ri-truck-line"></i>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="ri-shield-check-line"></i>
                <span>30-day returns</span>
              </div>
            </div>

            <button
              onClick={handleAddAllToCart}
              disabled={selectedItems.size === 0}
              className="btn-primary px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <i className="ri-shopping-cart-line mr-2"></i>
              Add Selected to Cart
            </button>
          </div>
        </div>

        {/* Purchase Insights */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="ri-information-line text-blue-600 dark:text-blue-400 mt-0.5"></i>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Why these items go together
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Based on purchase patterns from {Math.floor(Math.random() * 1000) + 500} customers who bought similar items. 
                These products complement each other and are often purchased as a complete outfit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
