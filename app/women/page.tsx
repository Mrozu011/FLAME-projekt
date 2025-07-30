
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory: string;
  size: string[];
  colors: string[];
  material: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  popularity: number;
  tags: string[];
}

function WomenPageContent() {
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
      id: '1',
      name: 'Elegant Summer Dress',
      price: 89.99,
      originalPrice: 120.00,
      image: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20fashion%20photography%2C%20model%20wearing%20stylish%20dress%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=dress-1&orientation=portrait',
      rating: 4.5,
      reviewCount: 128,
      category: 'Women',
      subcategory: 'Dresses',
      size: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Red'],
      material: '95% Polyester, 5% Elastane',
      isNew: true,
      isOnSale: true,
      discount: 25,
      popularity: 95,
      tags: ['summer', 'elegant', 'bestseller']
    },
    {
      id: '2',
      name: 'Classic White Blouse',
      price: 45.99,
      image: 'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20fashion%20photography%2C%20professional%20business%20attire%2C%20model%20wearing%20elegant%20shirt%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=blouse-1&orientation=portrait',
      rating: 4.8,
      reviewCount: 95,
      category: 'Women',
      subcategory: 'Tops',
      size: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Light Blue', 'Pink'],
      material: '70% Cotton, 30% Polyester',
      isNew: false,
      isOnSale: false,
      popularity: 88,
      tags: ['classic', 'professional', 'cotton']
    },
    {
      id: '3',
      name: 'High-Waisted Skinny Jeans',
      price: 79.99,
      originalPrice: 95.00,
      image: 'https://readdy.ai/api/search-image?query=high%20waisted%20skinny%20jeans%20fashion%20photography%2C%20model%20wearing%20denim%20pants%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=jeans-1&orientation=portrait',
      rating: 4.3,
      reviewCount: 156,
      category: 'Women',
      subcategory: 'Jeans',
      size: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Dark Blue', 'Black', 'Light Blue'],
      material: '98% Cotton, 2% Elastane',
      isNew: false,
      isOnSale: true,
      discount: 16,
      popularity: 92,
      tags: ['denim', 'skinny', 'high-waisted']
    },
    {
      id: '4',
      name: 'Cashmere Cardigan',
      price: 149.99,
      image: 'https://readdy.ai/api/search-image?query=cashmere%20cardigan%20fashion%20photography%2C%20luxury%20knit%20sweater%2C%20model%20wearing%20elegant%20cardigan%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=cardigan-1&orientation=portrait',
      rating: 4.9,
      reviewCount: 67,
      category: 'Women',
      subcategory: 'Tops',
      size: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Black', 'Navy'],
      material: '100% Cashmere',
      isNew: true,
      isOnSale: false,
      popularity: 85,
      tags: ['luxury', 'cashmere', 'new']
    },
    {
      id: '5',
      name: 'Floral Print Skirt',
      price: 65.99,
      image: 'https://readdy.ai/api/search-image?query=floral%20print%20skirt%20fashion%20photography%2C%20model%20wearing%20elegant%20skirt%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=skirt-1&orientation=portrait',
      rating: 4.2,
      reviewCount: 89,
      category: 'Women',
      subcategory: 'Skirts',
      size: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Pink', 'Blue', 'Green'],
      material: '100% Polyester',
      isNew: false,
      isOnSale: false,
      popularity: 78,
      tags: ['floral', 'print', 'summer']
    },
    {
      id: '6',
      name: 'Leather Ankle Boots',
      price: 199.99,
      originalPrice: 250.00,
      image: 'https://readdy.ai/api/search-image?query=leather%20ankle%20boots%20fashion%20photography%2C%20women%20shoes%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=boots-1&orientation=portrait',
      rating: 4.7,
      reviewCount: 134,
      category: 'Women',
      subcategory: 'Shoes',
      size: ['36', '37', '38', '39', '40', '41'],
      colors: ['Black', 'Brown', 'Tan'],
      material: 'Genuine Leather',
      isNew: false,
      isOnSale: true,
      discount: 20,
      popularity: 91,
      tags: ['leather', 'boots', 'ankle']
    }
  ];

  const subcategories = [
    { id: 'all', name: 'All Products', count: mockProducts.length },
    { id: 'dresses', name: 'Dresses', count: mockProducts.filter(p => p.subcategory === 'Dresses').length },
    { id: 'tops', name: 'Tops', count: mockProducts.filter(p => p.subcategory === 'Tops').length },
    { id: 'jeans', name: 'Jeans', count: mockProducts.filter(p => p.subcategory === 'Jeans').length },
    { id: 'skirts', name: 'Skirts', count: mockProducts.filter(p => p.subcategory === 'Skirts').length },
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
        product.subcategory.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }

    if (filters.size) {
      filtered = filtered.filter(product => 
        product.size.includes(filters.size)
      );
    }

    if (filters.color) {
      filtered = filtered.filter(product => 
        product.colors.some(color => 
          color.toLowerCase().includes(filters.color.toLowerCase())
        )
      );
    }

    if (filters.material) {
      filtered = filtered.filter(product => 
        product.material.toLowerCase().includes(filters.material.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Review count filter
    if (filters.reviewCount > 0) {
      filtered = filtered.filter(product => product.reviewCount >= filters.reviewCount);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(product => 
        filters.tags.some(tag => product.tags.includes(tag))
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
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.popularity - a.popularity);
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
          <span className="text-gray-900 font-medium">Women</span>
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
            Women's Fashion
            {filters.subcategory && filters.subcategory !== 'all' && (
              <span className="text-2xl text-gray-600 ml-2">
                - {subcategories.find(s => s.id === filters.subcategory)?.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our curated collection of women's fashion. From elegant dresses to comfortable everyday wear.
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
              category="Women"
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

export default function WomenPage() {
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
      <WomenPageContent />
    </Suspense>
  );
}
