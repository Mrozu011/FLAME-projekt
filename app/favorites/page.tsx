'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import RecommendationSection from '@/components/RecommendationSection';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  sizes?: string[];
  colors?: string[];
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { format } = useCurrency();

  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('flame-favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setFavoriteItems(favorites);
      } else {
        // Demo data for showcase
        const demoFavorites: FavoriteItem[] = [
          {
            id: '1',
            name: 'Premium Silk Blouse',
            price: 89.99,
            originalPrice: 109.99,
            discount: 18,
            image: 'https://readdy.ai/api/search-image?query=elegant%20silk%20blouse%20white%20premium%20fashion%20women%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo%20luxury%20fabric&width=400&height=500&seq=fav-silk-blouse-1&orientation=portrait',
            category: 'Women',
            rating: 4.8,
            reviews: 124,
            inStock: true,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['White', 'Black', 'Navy', 'Cream']
          },
          {
            id: '2',
            name: 'Designer Leather Jacket',
            price: 299.99,
            originalPrice: 399.99,
            discount: 25,
            image: 'https://readdy.ai/api/search-image?query=black%20leather%20jacket%20premium%20fashion%20designer%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo%20luxury%20outerwear&width=400&height=500&seq=fav-leather-jacket-2&orientation=portrait',
            category: 'Men',
            rating: 4.9,
            reviews: 89,
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'Brown', 'Navy']
          },
          {
            id: '3',
            name: 'Cashmere Sweater',
            price: 159.99,
            originalPrice: 199.99,
            discount: 20,
            image: 'https://readdy.ai/api/search-image?query=cashmere%20sweater%20beige%20premium%20fashion%20knitwear%20studio%20photography%20clean%20white%20background%20professional%20product%20photo%20luxury%20yarn&width=400&height=500&seq=fav-cashmere-sweater-3&orientation=portrait',
            category: 'Women',
            rating: 4.7,
            reviews: 156,
            inStock: true,
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Beige', 'Gray', 'Black', 'Cream']
          },
          {
            id: '4',
            name: 'Premium Denim Jeans',
            price: 129.99,
            image: 'https://readdy.ai/api/search-image?query=premium%20denim%20jeans%20dark%20blue%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo%20quality%20cotton&width=400&height=500&seq=fav-denim-jeans-4&orientation=portrait',
            category: 'Men',
            rating: 4.6,
            reviews: 203,
            inStock: true,
            sizes: ['30', '32', '34', '36', '38'],
            colors: ['Dark Blue', 'Black', 'Light Blue']
          },
          {
            id: '5',
            name: 'Elegant Evening Dress',
            price: 199.99,
            originalPrice: 279.99,
            discount: 29,
            image: 'https://readdy.ai/api/search-image?query=elegant%20evening%20dress%20black%20premium%20fashion%20formal%20wear%20studio%20photography%20clean%20white%20background%20professional%20product%20photo%20luxury%20fabric&width=400&height=500&seq=fav-evening-dress-5&orientation=portrait',
            category: 'Women',
            rating: 4.9,
            reviews: 67,
            inStock: false,
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Black', 'Navy', 'Burgundy']
          },
          {
            id: '6',
            name: 'Luxury Watch',
            price: 399.99,
            originalPrice: 499.99,
            discount: 20,
            image: 'https://readdy.ai/api/search-image?query=luxury%20watch%20silver%20premium%20fashion%20accessory%20studio%20photography%20clean%20white%20background%20professional%20product%20photo%20timepiece&width=400&height=500&seq=fav-luxury-watch-6&orientation=portrait',
            category: 'Accessories',
            rating: 4.8,
            reviews: 234,
            inStock: true,
            sizes: ['One Size'],
            colors: ['Silver', 'Gold', 'Rose Gold']
          }
        ];
        setFavoriteItems(demoFavorites);
        localStorage.setItem('flame-favorites', JSON.stringify(demoFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (item: FavoriteItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: item.sizes?.[0] || 'M',
      color: item.colors?.[0] || 'Default',
      category: item.category,
    };

    try {
      const savedCart = localStorage.getItem('flame-cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = cartItems.findIndex((cItem: any) =>
        cItem.id === item.id && cItem.size === cartItem.size && cItem.color === cartItem.color
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

  const handleRemoveFromFavorites = (itemId: string) => {
    try {
      const updatedFavorites = favoriteItems.filter((item) => item.id !== itemId);
      setFavoriteItems(updatedFavorites);
      localStorage.setItem('flame-favorites', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleMoveToWishlist = (itemId: string) => {
    // Placeholder for wishlist functionality
    console.log('Move to wishlist:', itemId);
  };

  const getSortedAndFilteredItems = () => {
    let items = [...favoriteItems];

    // Filter
    if (filterBy !== 'all') {
      items = items.filter((item) => {
        switch (filterBy) {
          case 'inStock':
            return item.inStock;
          case 'onSale':
            return item.discount && item.discount > 0;
          case 'women':
            return item.category.toLowerCase() === 'women';
          case 'men':
            return item.category.toLowerCase() === 'men';
          case 'accessories':
            return item.category.toLowerCase() === 'accessories';
          default:
            return true;
        }
      });
    }

    // Sort
    items.sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default:
          return 0;
      }
    });

    return items;
  };

  const filteredItems = getSortedAndFilteredItems();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-primary transition-theme">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary transition-theme">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-theme-primary mb-2">
                {t('favorites')}
              </h1>
              <p className="text-theme-secondary">
                {favoriteItems.length === 0
                  ? t('noFavorites')
                  : `${favoriteItems.length} ${favoriteItems.length === 1 ? 'item' : 'items'} in your favorites`}
              </p>
            </div>
            
            {favoriteItems.length > 0 && (
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-theme-secondary text-theme-primary'
                        : 'text-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    <i className="ri-grid-line text-lg"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-colors ${
                      viewMode === 'list'
                        ? 'bg-theme-secondary text-theme-primary'
                        : 'text-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    <i className="ri-list-unordered text-lg"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filters and Sort */}
          {favoriteItems.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-theme-secondary border border-theme-primary rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-theme-secondary">Filter:</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="px-3 py-1 input-theme rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                  >
                    <option value="all">All Items</option>
                    <option value="inStock">In Stock</option>
                    <option value="onSale">On Sale</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-theme-secondary">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 input-theme rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                    <option value="rating">Rating</option>
                    <option value="discount">Discount</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-theme-secondary">
                Showing {filteredItems.length} of {favoriteItems.length} items
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {favoriteItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8">
              <img
                src="https://readdy.ai/api/search-image?query=empty%20heart%20icon%20favorites%20wishlist%20illustration%20minimalist%20design%20clean%20simple%20line%20art%20style%20modern%20e-commerce%20website%20empty%20state%20vector%20graphic&width=128&height=128&seq=empty-favorites-illustration&orientation=squarish"
                alt="Empty favorites illustration"
                className="w-full h-full object-contain opacity-60"
              />
            </div>
            <h2 className="text-2xl font-semibold text-theme-primary mb-4">
              {t('noFavorites')}
            </h2>
            <p className="text-theme-secondary mb-8 max-w-md mx-auto">
              {t('noFavoritesDesc')}
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 btn-primary rounded-lg transition-colors whitespace-nowrap"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <>
            {/* Product Grid/List */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`card-theme rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <Link href={`/product/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full object-cover object-top transition-transform duration-300 group-hover:scale-105 ${
                          viewMode === 'list' ? 'h-48' : 'h-64'
                        }`}
                      />
                    </Link>
                    
                    {/* Stock Status */}
                    {!item.inStock && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {item.discount && item.discount > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        -{item.discount}%
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleRemoveFromFavorites(item.id)}
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <i className="ri-heart-fill text-sm"></i>
                      </button>
                    </div>
                  </div>

                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <Link href={`/product/${item.id}`}>
                          <h3 className="text-lg font-semibold text-theme-primary hover:text-blue-600 transition-colors cursor-pointer">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-theme-tertiary mb-2">{item.category}</p>
                        
                        {/* Rating */}
                        {item.rating && (
                          <div className="flex items-center space-x-1 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`ri-star-${i < Math.floor(item.rating!) ? 'fill' : 'line'} text-yellow-400 text-sm`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-sm text-theme-tertiary">
                              ({item.reviews})
                            </span>
                          </div>
                        )}
                        
                        {/* Price */}
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-lg font-semibold text-theme-primary">
                            {format(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-theme-tertiary line-through">
                              {format(item.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        {/* Sizes and Colors */}
                        {viewMode === 'list' && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.sizes && item.sizes.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-theme-tertiary">Sizes:</span>
                                {item.sizes.slice(0, 3).map((size, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-theme-secondary border border-theme-primary rounded text-xs"
                                  >
                                    {size}
                                  </span>
                                ))}
                                {item.sizes.length > 3 && (
                                  <span className="text-xs text-theme-tertiary">+{item.sizes.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col' : ''}`}>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className={`flex items-center justify-center px-4 py-2 btn-primary rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            viewMode === 'list' ? 'text-sm' : ''
                          }`}
                        >
                          <i className="ri-shopping-cart-line mr-2"></i>
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        
                        <button
                          onClick={() => handleRemoveFromFavorites(item.id)}
                          className={`flex items-center justify-center px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap cursor-pointer ${
                            viewMode === 'list' ? 'text-sm' : ''
                          }`}
                        >
                          <i className="ri-heart-fill mr-2"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk Actions */}
            {favoriteItems.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-theme-secondary border border-theme-primary rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      favoriteItems.forEach(item => {
                        if (item.inStock) {
                          handleAddToCart(item);
                        }
                      });
                    }}
                    className="flex items-center px-4 py-2 btn-primary rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    Add All to Cart
                  </button>
                  
                  <button
                    onClick={() => {
                      setFavoriteItems([]);
                      localStorage.removeItem('flame-favorites');
                      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
                    }}
                    className="flex items-center px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Clear All
                  </button>
                </div>
                
                <div className="text-sm text-theme-secondary">
                  {favoriteItems.filter(item => item.inStock).length} items available
                </div>
              </div>
            )}
          </>
        )}

        {/* Recommendations */}
        {favoriteItems.length > 0 && (
          <section className="mt-16">
            <RecommendationSection
              title="You Might Also Like"
              userId={localStorage.getItem('user-id') || 'guest'}
              context={{ 
                type: 'favorites', 
                favoriteItems: favoriteItems.map(item => item.id) 
              }}
              limit={8}
              showReasons={true}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}