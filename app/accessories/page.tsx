
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import type { Product } from '@/lib/types';

function AccessoriesPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    subcategory: '',
    size: '',
    color: '',
    priceRange: [0, 500],
    rating: 0,
    material: '',
    reviewCount: 0,
    tags: []
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);

  const mockProducts: Product[] = useMemo(() => [
    {
      id: '13',
      name: 'Leather Crossbody Bag',
      price: 129.99,
      originalPrice: 160.00,
      image: 'https://readdy.ai/api/search-image?query=leather%20crossbody%20bag%20fashion%20photography%2C%20luxury%20handbag%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=bag-1&orientation=portrait',
      rating: 4.7,
      reviewCount: 203,
      category: 'Accessories',
      subcategory: 'Bags',
      sizes: ['One Size'],
      colors: ['Black', 'Brown', 'Tan', 'Burgundy'],
      material: 'Genuine Leather',
      isNew: false,
      isOnSale: true,
      discount: 19,
      popularity: 92,
      tags: ['leather', 'crossbody', 'luxury']
    },
    {
      id: '14',
      name: 'Silk Scarf',
      price: 49.99,
      image: 'https://readdy.ai/api/search-image?query=silk%20scarf%20fashion%20photography%2C%20elegant%20accessory%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=scarf-1&orientation=portrait',
      rating: 4.5,
      reviewCount: 156,
      category: 'Accessories',
      subcategory: 'Scarves',
      sizes: ['One Size'],
      colors: ['Pink', 'Blue', 'Green', 'Purple'],
      material: '100% Silk',
      isNew: true,
      isOnSale: false,
      popularity: 78,
      tags: ['silk', 'elegant', 'new']
    },
    {
      id: '15',
      name: 'Classic Sunglasses',
      price: 89.99,
      originalPrice: 120.00,
      image: 'https://readdy.ai/api/search-image?query=classic%20sunglasses%20fashion%20photography%2C%20designer%20eyewear%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=sunglasses-1&orientation=portrait',
      rating: 4.8,
      reviewCount: 267,
      category: 'Accessories',
      subcategory: 'Eyewear',
      sizes: ['One Size'],
      colors: ['Black', 'Brown', 'Gold'],
      material: 'Acetate Frame',
      isNew: false,
      isOnSale: true,
      discount: 25,
      popularity: 95,
      tags: ['sunglasses', 'classic', 'bestseller']
    },
    {
      id: '16',
      name: 'Minimalist Watch',
      price: 199.99,
      image: 'https://readdy.ai/api/search-image?query=minimalist%20watch%20fashion%20photography%2C%20modern%20timepiece%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=watch-1&orientation=portrait',
      rating: 4.9,
      reviewCount: 134,
      category: 'Accessories',
      subcategory: 'Watches',
      sizes: ['One Size'],
      colors: ['Silver', 'Gold', 'Black'],
      material: 'Stainless Steel',
      isNew: true,
      isOnSale: false,
      popularity: 88,
      tags: ['minimalist', 'watch', 'steel']
    },
    {
      id: '17',
      name: 'Wool Beanie',
      price: 24.99,
      image: 'https://readdy.ai/api/search-image?query=wool%20beanie%20fashion%20photography%2C%20winter%20hat%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=beanie-1&orientation=portrait',
      rating: 4.3,
      reviewCount: 89,
      category: 'Accessories',
      subcategory: 'Hats',
      sizes: ['One Size'],
      colors: ['Gray', 'Black', 'Navy', 'Beige'],
      material: '100% Wool',
      isNew: false,
      isOnSale: false,
      popularity: 71,
      tags: ['wool', 'beanie', 'winter']
    },
    {
      id: '18',
      name: 'Statement Necklace',
      price: 79.99,
      originalPrice: 95.00,
      image: 'https://readdy.ai/api/search-image?query=statement%20necklace%20fashion%20photography%2C%20elegant%20jewelry%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=necklace-1&orientation=portrait',
      rating: 4.6,
      reviewCount: 178,
      category: 'Accessories',
      subcategory: 'Jewelry',
      sizes: ['One Size'],
      colors: ['Gold', 'Silver', 'Rose Gold'],
      material: 'Plated Metal',
      isNew: false,
      isOnSale: true,
      discount: 16,
      popularity: 83,
      tags: ['statement', 'jewelry', 'elegant']
    }
  ], []);

  const subcategories = [
    { id: 'all', name: 'All Products', count: mockProducts.length },
    { id: 'bags', name: 'Bags', count: mockProducts.filter(p => p.subcategory === 'Bags').length },
    { id: 'scarves', name: 'Scarves', count: mockProducts.filter(p => p.subcategory === 'Scarves').length },
    { id: 'eyewear', name: 'Eyewear', count: mockProducts.filter(p => p.subcategory === 'Eyewear').length },
    { id: 'watches', name: 'Watches', count: mockProducts.filter(p => p.subcategory === 'Watches').length },
    { id: 'hats', name: 'Hats', count: mockProducts.filter(p => p.subcategory === 'Hats').length },
    { id: 'jewelry', name: 'Jewelry', count: mockProducts.filter(p => p.subcategory === 'Jewelry').length }
  ];

  useEffect(() => {
    setProducts(mockProducts);

    // Get URL parameters
    const subcategory = searchParams.get('subcategory');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const material = searchParams.get('material');

    setFilters(prev => ({
      ...prev,
      subcategory: subcategory || '',
      size: size || '',
      color: color || '',
      material: material || ''
    }));

    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.subcategory && filters.subcategory !== 'all') {
      filtered = filtered.filter(product => 
        product.subcategory?.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }

    if (filters.size) {
      filtered = filtered.filter(product => 
        product.sizes?.includes(filters.size)
      );
    }

    if (filters.color) {
      filtered = filtered.filter(product => 
        product.colors?.some(color => 
          color.toLowerCase().includes(filters.color.toLowerCase())
        )
      );
    }

    if (filters.material) {
      filtered = filtered.filter(product => 
        product.material?.toLowerCase().includes(filters.material.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => (product.rating || 0) >= filters.rating);
    }

    // Review count filter
    if (filters.reviewCount > 0) {
      filtered = filtered.filter(product => (product.reviewCount || 0) >= filters.reviewCount);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(product => 
        filters.tags.some(tag => product.tags?.includes(tag))
      );
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
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters, sortBy]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  const clearFilters = () => {
    setFilters({
      subcategory: '',
      size: '',
      color: '',
      priceRange: [0, 500],
      rating: 0,
      material: '',
      reviewCount: 0,
      tags: []
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
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-8 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <i className="ri-arrow-right-s-line text-gray-400"></i>
          <span className="text-gray-900 font-medium">Accessories</span>
          {filters.subcategory && filters.subcategory !== 'all' && (
            <>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <span className="text-gray-900 font-medium">
                {subcategories.find(s => s.id === filters.subcategory)?.name}
              </span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accessories
            {filters.subcategory && filters.subcategory !== 'all' && (
              <span className="text-2xl text-gray-600 ml-2">
                - {subcategories.find(s => s.id === filters.subcategory)?.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your look with our curated selection of premium accessories. From bags to jewelry, find the perfect finishing touch.
          </p>
        </div>

        {/* Subcategory Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => setFilters(prev => ({ ...prev, subcategory: subcategory.id }))}
                className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  filters.subcategory === subcategory.id || (filters.subcategory === '' && subcategory.id === 'all')
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {subcategory.name} ({subcategory.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <CategoryFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              products={products}
              category="Accessories"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
              
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Toggle */}
                <button className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <i className="ri-filter-3-line mr-2"></i>
                  Filters
                </button>
                
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black pr-8"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.subcategory || filters.size || filters.color || filters.material || filters.rating > 0) && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.subcategory && filters.subcategory !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {subcategories.find(s => s.id === filters.subcategory)?.name}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, subcategory: '' }))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  )}
                  {filters.size && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Size: {filters.size}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, size: '' }))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  )}
                  {filters.color && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Color: {filters.color}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, color: '' }))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  )}
                  {filters.material && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Material: {filters.material}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, material: '' }))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  )}
                  {filters.rating > 0 && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {filters.rating}+ Stars
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} />

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-search-line text-gray-400 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function AccessoriesPage() {
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
      <AccessoriesPageContent />
    </Suspense>
  );
}
