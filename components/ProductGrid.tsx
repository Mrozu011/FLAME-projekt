
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuickViewModal from './QuickViewModal';
import PriceDisplay from './PriceDisplay';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductGrid({ products, onQuickView, viewMode = 'grid' }: ProductGridProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isGridMounted, setIsGridMounted] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    setIsGridMounted(true);
  }, []);

  useEffect(() => {
    if (!isGridMounted) return;

    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('flame-favorites');
        if (savedFavorites) {
          const favoriteItems = JSON.parse(savedFavorites);
          setFavorites(favoriteItems.map((item: any) => item.id));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();

    const handleFavoriteUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('favoriteUpdated', handleFavoriteUpdate);

    return () => {
      window.removeEventListener('favoriteUpdated', handleFavoriteUpdate);
    };
  }, [isGridMounted]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="ri-star-fill text-yellow-400 text-xs"></i>
        ))}
        {hasHalfStar && <i key="half" className="ri-star-half-fill text-yellow-400 text-xs"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="ri-star-line text-gray-300 text-xs"></i>
        ))}
      </div>
    );
  };

  const handleFavoriteToggle = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isGridMounted) return;

    try {
      const userSession = localStorage.getItem('flame-user-session');
      if (!userSession) {
        router.push('/login');
        return;
      }

      const savedFavorites = localStorage.getItem('flame-favorites');
      let favoriteItems = savedFavorites ? JSON.parse(savedFavorites) : [];

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const isFavorited = favorites.includes(productId);

      if (!isFavorited) {
        const favoriteItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        };
        favoriteItems.push(favoriteItem);
        setFavorites(prev => [...prev, productId]);
      } else {
        favoriteItems = favoriteItems.filter((item: any) => item.id !== productId);
        setFavorites(prev => prev.filter(id => id !== productId));
      }

      localStorage.setItem('flame-favorites', JSON.stringify(favoriteItems));
      window.dispatchEvent(new Event('favoriteUpdated'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isGridMounted) return;

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: product.sizes?.[0] || 'One Size',
        color: product.colors?.[0] || 'Default'
      };

      const savedCart = localStorage.getItem('flame-cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = cartItems.findIndex((item: any) => 
        item.id === product.id && item.size === cartItem.size && item.color === cartItem.color
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
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const getStockStatusColor = (status?: string) => {
    switch (status) {
      case 'in-stock':
        return 'text-green-600';
      case 'low-stock':
        return 'text-yellow-600';
      case 'out-of-stock':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStockStatusText = (status?: string) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return 'Available';
    }
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#DC2626',
      'blue': '#2563EB',
      'navy': '#1E3A8A',
      'green': '#059669',
      'yellow': '#EAB308',
      'pink': '#EC4899',
      'purple': '#7C3AED',
      'gray': '#6B7280',
      'brown': '#92400E',
      'beige': '#F5F5DC',
      'cream': '#F5F5DC',
      'tan': '#D2B48C',
      'light blue': '#3B82F6',
      'dark blue': '#1E40AF',
      'burgundy': '#7F1D1D',
      'silver': '#9CA3AF',
      'gold': '#F59E0B'
    };
    return colorMap[color.toLowerCase()] || '#6B7280';
  };

  if (!isGridMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <>
        <div className="space-y-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="w-48 h-48 flex-shrink-0 bg-gray-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Product Labels */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {product.isNew && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Sale
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleFavoriteToggle(e, product.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className={`${favorites.includes(product.id) ? 'ri-heart-fill' : 'ri-heart-line'} text-sm`}></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickView(product);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <i className="ri-eye-line text-sm"></i>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <PriceDisplay
                      price={product.price}
                      originalPrice={product.originalPrice}
                      className="text-lg font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {product.rating && (
                    <>
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-500">
                        {product.rating} ({product.reviewCount || 0} reviews)
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Category: {product.category}</span>
                  <span className={`text-sm font-medium ${getStockStatusColor(product.stockStatus)}`}>
                    {getStockStatusText(product.stockStatus)}
                  </span>
                </div>

                {/* Selectable Options */}
                <div className="space-y-2 mb-4">
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Colors:</span>
                      <div className="flex space-x-1">
                        {product.colors.slice(0, 5).map((color, index) => (
                          <div
                            key={index}
                            className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: getColorStyle(color) }}
                            title={color}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 5}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Sizes:</span>
                      <div className="flex space-x-1">
                        {product.sizes.slice(0, 5).map((size, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                            title={size}
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 5 && (
                          <span className="text-xs text-gray-500 ml-1">+{product.sizes.length - 5}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {product.discount && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      product.stockStatus === 'out-of-stock'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            isOpen={isQuickViewOpen}
            onClose={handleCloseQuickView}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative"
          >
            <Link href={`/product/${product.id}`} className="block">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />

                {/* Product Labels */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                  {product.isNew && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Sale
                    </span>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => handleFavoriteToggle(e, product.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className={`${favorites.includes(product.id) ? 'ri-heart-fill' : 'ri-heart-line'} text-sm`}></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickView(product);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Quick View"
                  >
                    <i className="ri-eye-line text-sm"></i>
                  </button>
                </div>

                {/* Quick View Button - Bottom Center */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickView(product);
                    }}
                    className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm whitespace-nowrap"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </Link>

            <div className="p-4 space-y-3">
                              <Link href={`/product/${product.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center space-x-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-500">
                      {product.rating} ({product.reviewCount || 0})
                    </span>
                  </div>
                )}

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PriceDisplay
                    price={product.price}
                    originalPrice={product.originalPrice}
                    className="text-xl font-bold"
                  />
                </div>
                {product.discount && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Category and Stock Status */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="truncate">{product.category}</span>
                <span className={`font-medium ${getStockStatusColor(product.stockStatus)}`}>
                  {getStockStatusText(product.stockStatus)}
                </span>
              </div>

              {/* Selectable Options */}
              <div className="space-y-2">
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Colors:</span>
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: getColorStyle(color) }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Sizes:</span>
                    <div className="flex space-x-1">
                      {product.sizes.slice(0, 4).map((size, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                          title={size}
                        >
                          {size}
                        </span>
                      ))}
                      {product.sizes.length > 4 && (
                        <span className="text-xs text-gray-500 ml-1">+{product.sizes.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(e, product);
                }}
                disabled={product.stockStatus === 'out-of-stock'}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  product.stockStatus === 'out-of-stock'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-95'
                }`}
              >
                {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
        />
      )}
    </>
  );
}
