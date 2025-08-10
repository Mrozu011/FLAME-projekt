
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuickViewModal from './QuickViewModal';
import PriceDisplay from './PriceDisplay';
import type { Product } from '@/lib/types';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

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
        setFavorites([...favorites, productId]);
      } else {
        favoriteItems = favoriteItems.filter((item: any) => item.id !== productId);
        setFavorites(favorites.filter(id => id !== productId));
      }

      localStorage.setItem('flame-favorites', JSON.stringify(favoriteItems));
      window.dispatchEvent(new CustomEvent('favoriteUpdated'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isGridMounted) return;

    try {
      const userSession = localStorage.getItem('flame-user-session');
      if (!userSession) {
        router.push('/login');
        return;
      }

      const savedCart = localStorage.getItem('flame-cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];

      const existingItem = cartItems.find((item: any) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          category: product.category
        };
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
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const getStockStatusColor = (status: string) => {
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

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#EF4444',
      'blue': '#3B82F6',
      'green': '#10B981',
      'yellow': '#F59E0B',
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
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="product-card animate-pulse">
            <div className="product-image bg-gray-200"></div>
            <div className="product-content">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <>
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 aspect-square md:aspect-auto relative overflow-hidden bg-gray-100">
                  <Link href={`/product/${product.id}/${toSlug(product.name)}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                  </Link>

                  {/* Product Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                    {product.isNew && (
                      <span className="product-badge badge-new">New</span>
                    )}
                    {product.isOnSale && (
                      <span className="product-badge badge-sale">Sale</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <button
                      onClick={(e) => handleFavoriteToggle(e, product.id)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors pointer-events-auto ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <i className={`${favorites.includes(product.id) ? 'ri-heart-fill' : 'ri-heart-line'} text-lg`}></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuickView(product);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors pointer-events-auto"
                    >
                      <i className="ri-eye-line text-lg"></i>
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Link href={`/product/${product.id}/${toSlug(product.name)}`}>
                      <h3 className="product-title text-xl group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="text-right">
                      <PriceDisplay
                        price={product.price}
                        originalPrice={product.originalPrice}
                        className="text-xl font-bold"
                      />
                      {product.discount && (
                        <span className="badge-sale inline-block mt-1">-{product.discount}%</span>
                      )}
                    </div>
                  </div>

                  {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-500">
                        {product.rating} ({product.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Category: {product.category}</span>
                    <span className={`text-sm font-medium ${getStockStatusColor(product.stockStatus || 'in-stock')}`}>
                      {getStockStatusText(product.stockStatus || 'in-stock')}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Colors:</span>
                        <div className="flex gap-2">
                          {product.colors.slice(0, 5).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: getColorStyle(color) }}
                              title={color}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-sm text-gray-500">+{product.colors.length - 5}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Sizes:</span>
                        <div className="flex gap-2">
                          {product.sizes.slice(0, 5).map((size, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                              title={size}
                            >
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 5 && (
                            <span className="text-sm text-gray-500">+{product.sizes.length - 5}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={(product.stockStatus || 'in-stock') === 'out-of-stock'}
                    className={`btn ${
                      (product.stockStatus || 'in-stock') === 'out-of-stock'
                        ? 'btn-secondary opacity-50 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {(product.stockStatus || 'in-stock') === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 group">
            <div className="relative">
              <Link href={`/product/${product.id}/${toSlug(product.name)}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                </div>
              </Link>

              {/* Product Badges */}
              {product.isNew && (
                <span className="product-badge badge-new pointer-events-none">New</span>
              )}
              {product.isOnSale && (
                <span className="product-badge badge-sale pointer-events-none" style={{ top: product.isNew ? '3rem' : 'var(--spacing-md)' }}>
                  Sale
                </span>
              )}

              {/* Hover Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button
                  onClick={(e) => handleFavoriteToggle(e, product.id)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors pointer-events-auto ${
                    favorites.includes(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Dodaj do ulubionych"
                >
                  <i className={`${favorites.includes(product.id) ? 'ri-heart-fill' : 'ri-heart-line'} text-lg`}></i>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickView(product);
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors pointer-events-auto"
                  title="Podgląd"
                >
                  <i className="ri-eye-line text-lg"></i>
                </button>
              </div>

              {/* Quick View Button - Bottom */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickView(product);
                  }}
                  className="btn btn-secondary w-full pointer-events-auto"
                >
                  Quick View
                </button>
              </div>
            </div>

            <div className="p-4">
              <Link href={`/product/${product.id}/${toSlug(product.name)}`}>
                <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mt-1 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-500">
                    {product.rating} ({product.reviewCount || 0})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between mb-3">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  className="text-lg font-bold"
                />
                {product.discount && (
                  <span className="badge-sale text-xs">-{product.discount}%</span>
                )}
              </div>

              {/* Category and Stock Status */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span className="truncate">{product.category}</span>
                <span className={`font-medium ${getStockStatusColor(product.stockStatus || 'in-stock')}`}>
                  {getStockStatusText(product.stockStatus || 'in-stock')}
                </span>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: getColorStyle(color) }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Sizes:</span>
                    <div className="flex gap-1">
                      {product.sizes.slice(0, 4).map((size, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                          title={size}
                        >
                          {size}
                        </span>
                      ))}
                      {product.sizes.length > 4 && (
                        <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={(product.stockStatus || 'in-stock') === 'out-of-stock'}
                className={`btn w-full rounded-2xl ${
                  (product.stockStatus || 'in-stock') === 'out-of-stock'
                    ? 'btn-secondary opacity-50 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {(product.stockStatus || 'in-stock') === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
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
