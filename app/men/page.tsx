
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import type { Product } from '@/lib/types';

function MenPageContent() {
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

  const mockProducts: Product[] = [
    {
      id: '7',
      name: 'Classic Denim Jacket',
      price: 89.99,
      originalPrice: 110.00,
      image: 'https://readdy.ai/api/search-image?query=classic%20denim%20jacket%20men%20fashion%20photography%2C%20model%20wearing%20stylish%20jacket%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-jacket-1&orientation=portrait',
      rating: 4.6,
      reviewCount: 142,
      category: 'Men',
      subcategory: 'Jackets',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Blue', 'Black', 'Light Blue'],
      material: '100% Cotton Denim',
      isNew: false,
      isOnSale: true,
      discount: 18,
      popularity: 93,
      tags: ['denim', 'classic', 'casual']
    },
    {
      id: '8',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      image: 'https://readdy.ai/api/search-image?query=premium%20cotton%20t-shirt%20men%20fashion%20photography%2C%20model%20wearing%20basic%20tee%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-tshirt-1&orientation=portrait',
      rating: 4.8,
      reviewCount: 256,
      category: 'Men',
      subcategory: 'T-Shirts',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Navy', 'Gray'],
      material: '100% Organic Cotton',
      isNew: true,
      isOnSale: false,
      popularity: 98,
      tags: ['cotton', 'basic', 'organic', 'bestseller']
    },
    {
      id: '9',
      name: 'Slim Fit Chinos',
      price: 79.99,
      image: 'https://readdy.ai/api/search-image?query=slim%20fit%20chinos%20men%20fashion%20photography%2C%20model%20wearing%20tailored%20pants%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-chinos-1&orientation=portrait',
      rating: 4.4,
      reviewCount: 189,
      category: 'Men',
      subcategory: 'Pants',
      sizes: ['30', '32', '34', '36', '38'],
      colors: ['Khaki', 'Navy', 'Black', 'Olive'],
      material: '97% Cotton, 3% Elastane',
      isNew: false,
      isOnSale: false,
      popularity: 87,
      tags: ['chinos', 'slim-fit', 'cotton']
    },
    {
      id: '10',
      name: 'Wool Blend Sweater',
      price: 119.99,
      originalPrice: 150.00,
      image: 'https://readdy.ai/api/search-image?query=wool%20blend%20sweater%20men%20fashion%20photography%2C%20model%20wearing%20knit%20pullover%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-sweater-1&orientation=portrait',
      rating: 4.7,
      reviewCount: 98,
      category: 'Men',
      subcategory: 'Sweaters',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Charcoal', 'Navy', 'Burgundy'],
      material: '60% Wool, 40% Acrylic',
      isNew: true,
      isOnSale: true,
      discount: 20,
      popularity: 85,
      tags: ['wool', 'warm', 'new']
    },
    {
      id: '11',
      name: 'Casual Button-Down Shirt',
      price: 59.99,
      image: 'https://readdy.ai/api/search-image?query=casual%20button%20down%20shirt%20men%20fashion%20photography%2C%20model%20wearing%20dress%20shirt%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-shirt-1&orientation=portrait',
      rating: 4.5,
      reviewCount: 167,
      category: 'Men',
      subcategory: 'Shirts',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Blue', 'Pink', 'Gray'],
      material: '100% Cotton',
      isNew: false,
      isOnSale: false,
      popularity: 82,
      tags: ['cotton', 'button-down', 'casual']
    },
    {
      id: '12',
      name: 'Leather Oxford Shoes',
      price: 249.99,
      originalPrice: 299.99,
      image: 'https://readdy.ai/api/search-image?query=leather%20oxford%20shoes%20men%20fashion%20photography%2C%20dress%20shoes%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-shoes-1&orientation=portrait',
      rating: 4.9,
      reviewCount: 73,
      category: 'Men',
      subcategory: 'Shoes',
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['Black', 'Brown', 'Tan'],
      material: 'Genuine Leather',
      isNew: false,
      isOnSale: true,
      discount: 17,
      popularity: 89,
      tags: ['leather', 'oxford', 'formal']
    }
  ];

  const subcategories = [
    { id: 'all', name: 'All Products', count: mockProducts.length },
    { id: 'jackets', name: 'Jackets', count: mockProducts.filter(p => p.subcategory === 'Jackets').length },
    { id: 't-shirts', name: 'T-Shirts', count: mockProducts.filter(p => p.subcategory === 'T-Shirts').length },
    { id: 'pants', name: 'Pants', count: mockProducts.filter(p => p.subcategory === 'Pants').length },
    { id: 'sweaters', name: 'Sweaters', count: mockProducts.filter(p => p.subcategory === 'Sweaters').length },
    { id: 'shirts', name: 'Shirts', count: mockProducts.filter(p => p.subcategory === 'Shirts').length },
    { id: 'shoes', name: 'Shoes', count: mockProducts.filter(p => p.subcategory === 'Shoes').length }
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
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
          <i className="ri-arrow-right-s-line text-gray-400"></i>
          <span className="text-gray-900 font-medium">Men</span>
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
            Men's Fashion
            {filters.subcategory && filters.subcategory !== 'all' && (
              <span className="text-2xl text-gray-600 ml-2">
                - {subcategories.find(s => s.id === filters.subcategory)?.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our premium collection of men's fashion. Quality clothing for the modern man.
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
              category="Men"
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

export default function MenPage() {
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
      <MenPageContent />
    </Suspense>
  );
}
