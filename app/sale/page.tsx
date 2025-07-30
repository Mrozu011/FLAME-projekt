'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import type { Product } from '@/lib/types';

function SalePageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    size: '',
    color: '',
    priceRange: [0, 500],
    rating: 0,
    material: '',
    reviewCount: 0,
    tags: []
  });
  const [sortBy, setSortBy] = useState('discount');
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
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Red'],
      material: '95% Polyester, 5% Elastane',
      isNew: true,
      isOnSale: true,
      discount: 25,
      popularity: 95,
      tags: ['summer', 'elegant', 'bestseller']
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
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Dark Blue', 'Black', 'Light Blue'],
      material: '98% Cotton, 2% Elastane',
      isNew: false,
      isOnSale: true,
      discount: 16,
      popularity: 92,
      tags: ['denim', 'skinny', 'high-waisted']
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
      sizes: ['36', '37', '38', '39', '40', '41'],
      colors: ['Black', 'Brown', 'Tan'],
      material: 'Genuine Leather',
      isNew: false,
      isOnSale: true,
      discount: 20,
      popularity: 91,
      tags: ['leather', 'boots', 'ankle']
    },
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
    },
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
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: mockProducts.length },
    { id: 'women', name: 'Women', count: mockProducts.filter(p => p.category === 'Women').length },
    { id: 'men', name: 'Men', count: mockProducts.filter(p => p.category === 'Men').length },
    { id: 'accessories', name: 'Accessories', count: mockProducts.filter(p => p.category === 'Accessories').length }
  ];

  const discountRanges = [
    { id: 'all', name: 'All Discounts', min: 0, max: 100 },
    { id: '10-20', name: '10% - 20%', min: 10, max: 20 },
    { id: '20-30', name: '20% - 30%', min: 20, max: 30 },
    { id: '30+', name: '30% & Above', min: 30, max: 100 }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    
    // Get URL parameters
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const material = searchParams.get('material');
    
    setFilters(prev => ({
      ...prev,
      category: category || '',
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
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

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
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
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
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default:
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
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
      category: '',
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

  const totalSavings = filteredProducts.reduce((sum, product) => {
    return sum + (product.originalPrice ? product.originalPrice - product.price : 0);
  }, 0);

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
          <span className="text-gray-900 font-medium">Sale</span>
          {filters.category && filters.category !== 'all' && (
            <>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <span className="text-gray-900 font-medium">
                {categories.find(c => c.id === filters.category)?.name}
              </span>
            </>
          )}
        </nav>

        {/* Sale Banner */}
        <div className="mb-8 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <i className="ri-fire-line mr-2"></i>
                Sale
              </h1>
              <p className="text-lg opacity-90">
                Up to 30% off on selected items. Limited time only!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                Save up to ${totalSavings.toFixed(2)}
              </div>
              <p className="text-sm opacity-90">
                Total savings available
              </p>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
                className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  filters.category === category.id || (filters.category === '' && category.id === 'all')
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Discount Range Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Discount</h3>
          <div className="flex flex-wrap gap-2">
            {discountRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => {
                  const filtered = products.filter(p => 
                    p.discount && p.discount >= range.min && p.discount <= range.max
                  );
                  setFilteredProducts(filtered);
                }}
                className="px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition-all whitespace-nowrap"
              >
                {range.name}
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
              category="Sale"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} on sale
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
                    className="text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 pr-8"
                  >
                    <option value="discount">Highest Discount</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="newest">Newest</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.subcategory || filters.size || filters.color || filters.material || filters.rating > 0) && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.category && filters.category !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {categories.find(c => c.id === filters.category)?.name}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                        className="ml-2 text-red-600 hover:text-red-800"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No sale items found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check back later for new deals
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors whitespace-nowrap"
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

export default function SalePage() {
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
      <SalePageContent />
    </Suspense>
  );
}
