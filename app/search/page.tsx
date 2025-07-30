'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { useTranslation } from '@/hooks/useTranslation';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  tags: string[];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    inStock: false
  });

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Elegant Summer Dress',
      price: 89.99,
      originalPrice: 120.00,
      image: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20fashion%20photography%2C%20model%20wearing%20stylish%20dress%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=dress-search-1&orientation=portrait',
      category: 'Women',
      subcategory: 'Dresses',
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isOnSale: true,
      discount: 25,
      tags: ['summer', 'dress', 'elegant', 'casual', 'formal', 'sleeveless']
    },
    {
      id: '2',
      name: 'Classic White Blouse',
      price: 45.99,
      image: 'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20fashion%20photography%2C%20professional%20business%20attire%2C%20model%20wearing%20elegant%20shirt%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=blouse-search-1&orientation=portrait',
      category: 'Women',
      subcategory: 'Tops',
      rating: 4.8,
      reviewCount: 95,
      isNew: false,
      isOnSale: false,
      tags: ['white', 'blouse', 'classic', 'professional', 'business', 'cotton']
    },
    {
      id: '3',
      name: 'Leather Jacket',
      price: 199.99,
      image: 'https://readdy.ai/api/search-image?query=black%20leather%20jacket%20men%20fashion%20photography%2C%20stylish%20outerwear%2C%20model%20wearing%20jacket%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=jacket-search-1&orientation=portrait',
      category: 'Men',
      subcategory: 'Outerwear',
      rating: 4.6,
      reviewCount: 76,
      isNew: false,
      isOnSale: false,
      tags: ['leather', 'jacket', 'black', 'outerwear', 'casual', 'cool']
    },
    {
      id: '4',
      name: 'Designer Handbag',
      price: 149.99,
      image: 'https://readdy.ai/api/search-image?query=designer%20handbag%20luxury%20fashion%20accessory%2C%20premium%20leather%20bag%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=bag-search-1&orientation=portrait',
      category: 'Accessories',
      subcategory: 'Bags',
      rating: 4.7,
      reviewCount: 142,
      isNew: true,
      isOnSale: false,
      tags: ['handbag', 'luxury', 'designer', 'leather', 'accessories', 'premium']
    },
    {
      id: '5',
      name: 'Casual Sneakers',
      price: 79.99,
      image: 'https://readdy.ai/api/search-image?query=casual%20sneakers%20men%20fashion%20photography%2C%20comfortable%20shoes%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=sneakers-search-1&orientation=portrait',
      category: 'Men',
      subcategory: 'Shoes',
      rating: 4.4,
      reviewCount: 89,
      isNew: false,
      isOnSale: true,
      discount: 15,
      tags: ['sneakers', 'casual', 'comfortable', 'shoes', 'sporty', 'everyday']
    },
    {
      id: '6',
      name: 'Silk Scarf',
      price: 35.99,
      image: 'https://readdy.ai/api/search-image?query=silk%20scarf%20luxury%20fashion%20accessory%2C%20colorful%20pattern%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=scarf-search-1&orientation=portrait',
      category: 'Accessories',
      subcategory: 'Scarves',
      rating: 4.3,
      reviewCount: 64,
      isNew: false,
      isOnSale: false,
      tags: ['silk', 'scarf', 'luxury', 'pattern', 'colorful', 'accessories']
    },
    {
      id: '7',
      name: 'Formal Suit',
      price: 299.99,
      image: 'https://readdy.ai/api/search-image?query=formal%20suit%20men%20fashion%20photography%2C%20professional%20business%20attire%2C%20model%20wearing%20suit%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=suit-search-1&orientation=portrait',
      category: 'Men',
      subcategory: 'Suits',
      rating: 4.9,
      reviewCount: 156,
      isNew: true,
      isOnSale: false,
      tags: ['suit', 'formal', 'business', 'professional', 'elegant', 'tailored']
    },
    {
      id: '8',
      name: 'Casual Jeans',
      price: 69.99,
      originalPrice: 89.99,
      image: 'https://readdy.ai/api/search-image?query=casual%20jeans%20fashion%20photography%2C%20denim%20pants%2C%20model%20wearing%20jeans%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=jeans-search-1&orientation=portrait',
      category: 'Women',
      subcategory: 'Pants',
      rating: 4.2,
      reviewCount: 203,
      isNew: false,
      isOnSale: true,
      discount: 22,
      tags: ['jeans', 'casual', 'denim', 'comfortable', 'everyday', 'versatile']
    }
  ];

  useEffect(() => {
    const searchProducts = () => {
      setLoading(true);
      
      let filtered = mockProducts;
      
      if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        filtered = mockProducts.filter(product => {
          const matchesName = product.name.toLowerCase().includes(lowerQuery);
          const matchesCategory = product.category.toLowerCase().includes(lowerQuery);
          const matchesSubcategory = product.subcategory.toLowerCase().includes(lowerQuery);
          const matchesTags = product.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
          const matchesHashtag = lowerQuery.startsWith('#') && product.tags.some(tag => 
            tag.toLowerCase().includes(lowerQuery.slice(1))
          );
          
          return matchesName || matchesCategory || matchesSubcategory || matchesTags || matchesHashtag;
        });
      }

      // Apply filters
      if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category);
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
      }

      if (filters.inStock) {
        // Assume all products are in stock for demo
        filtered = filtered.filter(() => true);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'relevance':
        default:
          // Keep original order for relevance
          break;
      }

      setProducts(filtered);
      setLoading(false);
    };

    searchProducts();
  }, [query, sortBy, filters]);

  const handleFilterChange = (filterType: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      inStock: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('searchResults') || 'Search Results'}
          </h1>
          {query && (
            <p className="text-gray-600">
              {products.length} {t('resultsFor') || 'results for'} "{query}"
            </p>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('allCategories') || 'All Categories'}</option>
              <option value="Women">{t('women') || 'Women'}</option>
              <option value="Men">{t('men') || 'Men'}</option>
              <option value="Accessories">{t('accessories') || 'Accessories'}</option>
            </select>

            {/* Price Range Filter */}
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('allPrices') || 'All Prices'}</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-500">$200 - $500</option>
            </select>

            {/* In Stock Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('inStockOnly') || 'In Stock Only'}</span>
            </label>

            {/* Clear Filters */}
            {(filters.category || filters.priceRange || filters.inStock) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t('clearFilters') || 'Clear Filters'}
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{t('sortBy') || 'Sort by'}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">{t('relevance') || 'Relevance'}</option>
              <option value="price-low">{t('priceLowToHigh') || 'Price: Low to High'}</option>
              <option value="price-high">{t('priceHighToLow') || 'Price: High to Low'}</option>
              <option value="rating">{t('rating') || 'Rating'}</option>
              <option value="newest">{t('newest') || 'Newest'}</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('noResults') || 'No Results Found'}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('noResultsDescription') || 'Try adjusting your search terms or filters'}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('goBack') || 'Go Back'}
            </button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}