
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { activityLogger } from '@/lib/activity-logger';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  type: string;
  status: string;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  description?: string;
  variants?: Array<{
    id: number;
    name: string;
    price: number;
    stock: number;
  }>;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
  is3DEnabled?: boolean;
  threeDModelUrl?: string;
  qualityScore?: number;
}

interface UploadingProduct {
  id: number;
  name: string;
  progress: number;
}

export default function ProductManagement() {
  const { t, language, changeLanguage } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState<UploadingProduct | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const itemsPerPage = 12;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'women', label: 'Women' },
    { value: 'men', label: 'Men' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const stockFilters = [
    { value: 'all', label: 'All Stock Status' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Status' },
    { value: 'new-arrival', label: 'New Arrival' },
    { value: 'bestseller', label: 'Bestseller' },
    { value: 'on-sale', label: 'On Sale' },
    { value: 'discontinued', label: 'Discontinued' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
    { value: 'price_asc', label: 'Price Low to High' },
    { value: 'price_desc', label: 'Price High to Low' },
    { value: 'stock_asc', label: 'Stock Low to High' },
    { value: 'stock_desc', label: 'Stock High to Low' },
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' }
  ];

  const productStatuses = {
    'new-arrival': {
      label: 'New Arrival',
      color: 'bg-blue-100 text-blue-800',
      icon: 'ri-fire-line'
    },
    'bestseller': {
      label: 'Bestseller',
      color: 'bg-green-100 text-green-800',
      icon: 'ri-trophy-line'
    },
    'on-sale': {
      label: 'On Sale',
      color: 'bg-red-100 text-red-800',
      icon: 'ri-price-tag-line'
    },
    'discontinued': {
      label: 'Discontinued',
      color: 'bg-gray-100 text-gray-800',
      icon: 'ri-stop-circle-line'
    },
    'featured': {
      label: 'Featured',
      color: 'bg-purple-100 text-purple-800',
      icon: 'ri-star-line'
    }
  };

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        sku: 'FL-WH-001',
        price: 149.99,
        stock: 45,
        type: 'our',
        status: 'active',
        category: 'electronics',
        images: ['https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20product%20photography%2C%20modern%20headphones%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20high%20quality%20audio%20equipment&width=300&height=300&seq=headphones-1&orientation=squarish'],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        tags: ['new-arrival', 'bestseller'],
        stockStatus: 'in-stock',
        qualityScore: 95
      },
      {
        id: 2,
        name: 'Designer Leather Jacket',
        sku: 'FL-LJ-002',
        price: 299.99,
        stock: 12,
        type: 'our',
        status: 'active',
        category: 'men',
        images: ['https://readdy.ai/api/search-image?query=designer%20leather%20jacket%20men%20fashion%20photography%2C%20black%20leather%20jacket%2C%20professional%20product%20photography%2C%20clean%20background%2C%20modern%20menswear&width=300&height=300&seq=jacket-1&orientation=squarish'],
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
        tags: ['featured', 'on-sale'],
        stockStatus: 'low-stock',
        qualityScore: 88
      },
      {
        id: 3,
        name: 'Smart Fitness Watch',
        sku: 'FL-FW-003',
        price: 199.99,
        stock: 0,
        type: 'dropship',
        status: 'out_of_stock',
        category: 'electronics',
        images: ['https://readdy.ai/api/search-image?query=smart%20fitness%20watch%20product%20photography%2C%20modern%20smartwatch%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20wearable%20technology&width=300&height=300&seq=watch-1&orientation=squarish'],
        createdAt: '2024-01-08',
        updatedAt: '2024-01-08',
        tags: ['new-arrival'],
        stockStatus: 'out-of-stock',
        qualityScore: 92
      },
      {
        id: 4,
        name: 'Organic Cotton T-Shirt',
        sku: 'FL-CT-004',
        price: 29.99,
        stock: 156,
        type: 'our',
        status: 'active',
        category: 'women',
        images: ['https://readdy.ai/api/search-image?query=organic%20cotton%20t-shirt%20women%20fashion%20photography%2C%20basic%20white%20tee%2C%20professional%20product%20photography%2C%20clean%20background%2C%20sustainable%20clothing&width=300&height=300&seq=tshirt-1&orientation=squarish'],
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        tags: ['bestseller', 'on-sale'],
        stockStatus: 'in-stock',
        qualityScore: 90
      },
      {
        id: 5,
        name: 'Bluetooth Speaker',
        sku: 'FL-BS-005',
        price: 89.99,
        stock: 23,
        type: 'dropship',
        status: 'active',
        category: 'electronics',
        images: ['https://readdy.ai/api/search-image?query=bluetooth%20speaker%20product%20photography%2C%20modern%20wireless%20speaker%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20portable%20audio%20device&width=300&height=300&seq=speaker-1&orientation=squarish'],
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12',
        tags: ['featured'],
        stockStatus: 'in-stock',
        qualityScore: 85
      },
      {
        id: 6,
        name: 'Eco-Friendly Water Bottle',
        sku: 'FL-WB-006',
        price: 24.99,
        stock: 87,
        type: 'our',
        status: 'active',
        category: 'lifestyle',
        images: ['https://readdy.ai/api/search-image?query=eco-friendly%20water%20bottle%20product%20photography%2C%20sustainable%20bottle%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20reusable%20water%20bottle&width=300&height=300&seq=bottle-1&orientation=squarish'],
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18',
        tags: ['new-arrival', 'bestseller'],
        stockStatus: 'in-stock',
        qualityScore: 87
      },
      {
        id: 7,
        name: 'Wireless Charging Pad',
        sku: 'FL-CP-007',
        price: 39.99,
        stock: 5,
        type: 'dropship',
        status: 'low_stock',
        category: 'electronics',
        images: ['https://readdy.ai/api/search-image?query=wireless%20charging%20pad%20product%20photography%2C%20modern%20charging%20pad%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20wireless%20charger&width=300&height=300&seq=charger-1&orientation=squarish'],
        createdAt: '2024-01-05',
        updatedAt: '2024-01-05',
        tags: ['on-sale'],
        stockStatus: 'low-stock',
        qualityScore: 82
      },
      {
        id: 8,
        name: 'Minimalist Backpack',
        sku: 'FL-BP-008',
        price: 79.99,
        stock: 34,
        type: 'our',
        status: 'active',
        category: 'accessories',
        images: ['https://readdy.ai/api/search-image?query=minimalist%20backpack%20product%20photography%2C%20modern%20backpack%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20stylish%20bag&width=300&height=300&seq=backpack-1&orientation=squarish'],
        createdAt: '2024-01-22',
        updatedAt: '2024-01-22',
        tags: ['featured', 'new-arrival'],
        stockStatus: 'in-stock',
        qualityScore: 93
      },
      {
        id: 9,
        name: 'Summer Floral Dress',
        sku: 'FL-SD-009',
        price: 89.99,
        stock: 28,
        type: 'our',
        status: 'active',
        category: 'women',
        images: ['https://readdy.ai/api/search-image?query=summer%20floral%20dress%20women%20fashion%20photography%2C%20elegant%20dress%2C%20professional%20product%20photography%2C%20clean%20background%2C%20summer%20fashion&width=300&height=300&seq=dress-1&orientation=squarish'],
        createdAt: '2024-01-25',
        updatedAt: '2024-01-25',
        tags: ['bestseller', 'on-sale'],
        stockStatus: 'in-stock',
        qualityScore: 89
      },
      {
        id: 10,
        name: 'Classic Sunglasses',
        sku: 'FL-SG-010',
        price: 59.99,
        stock: 67,
        type: 'our',
        status: 'active',
        category: 'accessories',
        images: ['https://readdy.ai/api/search-image?query=classic%20sunglasses%20product%20photography%2C%20designer%20sunglasses%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20fashion%20eyewear&width=300&height=300&seq=sunglasses-1&orientation=squarish'],
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14',
        tags: ['featured'],
        stockStatus: 'in-stock',
        qualityScore: 86
      },
      {
        id: 11,
        name: 'Vintage Denim Jacket',
        sku: 'FL-VJ-011',
        price: 120.00,
        stock: 0,
        type: 'our',
        status: 'discontinued',
        category: 'men',
        images: ['https://readdy.ai/api/search-image?query=vintage%20denim%20jacket%20men%20fashion%20photography%2C%20classic%20jacket%2C%20professional%20product%20photography%2C%20clean%20background%2C%20retro%20menswear&width=300&height=300&seq=vintage-jacket-1&orientation=squarish'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        tags: ['discontinued'],
        stockStatus: 'out-of-stock',
        qualityScore: 75
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    if (filterStock !== 'all') {
      filtered = filtered.filter(product => {
        if (filterStock === 'in_stock') return product.stock > 10;
        if (filterStock === 'low_stock') return product.stock > 0 && product.stock <= 10;
        if (filterStock === 'out_of_stock') return product.stock === 0;
        return true;
      });
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(product => product.tags?.includes(filterStatus) || false);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'stock_asc':
          return a.stock - b.stock;
        case 'stock_desc':
          return b.stock - a.stock;
        case 'created_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'created_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStock, filterStatus, sortBy, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleDeleteProduct = (product: Product): void => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      activityLogger.logProductDelete(product.id.toString(), product.name);
    }
  };

  const handleToggleProduct = (product: Product): void => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, status: newStatus } : p
    ));

    activityLogger.log(
      newStatus === 'active' ? 'Product Activated' : 'Product Deactivated',
      'product',
      `Product "${product.name}" ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      {
        resourceId: product.id.toString(),
        resourceType: 'product',
        changes: { status: { from: product.status, to: newStatus } },
        severity: 'info'
      }
    );
  };

  const handleUpload3D = (product: Product): void => {
    setUploadingProduct({
      id: product.id,
      name: product.name,
      progress: 0
    });
    setShowUploadModal(true);
    setUploadProgress(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file) return;

    const allowedTypes = ['.glb', '.gltf', '.usdz', '.obj'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension) return;

    if (!allowedTypes.includes(fileExtension)) {
      alert('Please upload a valid 3D model file (.glb, .gltf, .usdz, or .obj)');
      return;
    }

    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (uploadingProduct) {
            setProducts(prevProducts =>
              prevProducts.map(p =>
                p.id === uploadingProduct.id
                  ? { ...p, modelFile: file.name }
                  : p
              )
            );
          }
          setShowUploadModal(false);
          setUploadingProduct(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const remove3DModel = (productId: number): void => {
    setProducts(products.map(p =>
      p.id === (productId)
        ? { ...p, modelFile: null }
        : p
    ));
  };

  const toggleProductStatus = (productId: number, status: string): void => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? {
              ...p,
              tags: p.tags?.includes(status)
                ? p.tags.filter(tag => tag !== status)
                : [...(p.tags || []), status]
            }
          : p
      )
    );
  };

  const getStatusBadge = (product: Product): string => {
    if (product.stock === 0) {
      return 'bg-red-100 text-red-800';
    } else if (product.stock <= 10) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (product: Product): string => {
    if (product.stock === 0) {
      return 'Out of Stock';
    } else if (product.stock <= 10) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };

  const getTypeBadge = (type: string): string => {
    return type === 'our' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getQualityBadge = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStock('all');
    setFilterStatus('all');
    setSortBy('name');
  };

  const removeProduct = (productId: number): void => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} of {products.length} products
              </div>
              <Link
                href="/admin/products/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {stockFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {statusFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={resetFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-refresh-line mr-2"></i>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Products Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {currentItems.map((product) => (
                  <div key={product.id} className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Enhanced Product Labels */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.tags?.map((tag) => {
                          const statusConfig = productStatuses[tag as keyof typeof productStatuses];
                          return statusConfig ? (
                            <span key={tag} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                              <i className={`${statusConfig.icon} mr-1`}></i>
                              {statusConfig.label}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {/* Additional Labels */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {product.type === 'dropship' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                            <i className="ri-truck-line mr-1"></i>Dropshipping
                          </span>
                        )}
                      </div>

                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            title="Edit Product"
                          >
                            <i className="ri-edit-line text-gray-700"></i>
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            title="Delete Product"
                          >
                            <i className="ri-delete-bin-line text-red-600"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Product Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(product.type)}`}>
                          {product.type === 'our' ? 'Our' : 'Dropship'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(product)}`}>
                          {getStatusText(product)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Stock: {product.stock}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityBadge(product.qualityScore || 0)}`}>
                          Quality: {product.qualityScore || 0}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Category: {product.category}</span>
                        <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Status Management */}
                      <div className="flex items-center justify-between border-t pt-3">
                        <div className="flex items-center space-x-2">
                          {Object.entries(productStatuses).map(([key, status]) => (
                            <button
                              key={key}
                              onClick={() => toggleProductStatus(product.id, key)}
                              className={`p-1 rounded-full text-xs transition-colors ${
                                product.tags?.includes(key)
                                  ? status.color
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                              title={status.label}
                            >
                              <i className={status.icon}></i>
                            </button>
                          ))}
                        </div>

                        {/* 3D Model Actions */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleUpload3D(product)}
                              className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1"
                            >
                              <i className="ri-upload-cloud-line"></i>
                              <span>Upload File</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{` `}
                          <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of{` `}
                          <span className="font-medium">{filteredProducts.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="ri-arrow-left-s-line"></i>
                          </button>
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === i + 1
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="ri-arrow-right-s-line"></i>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Product File</h3>
            <p className="text-gray-600 mb-4">
              Upload a file for "{uploadingProduct?.name}"
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                type="file"
                accept="*"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                All file formats supported (Max size: 50MB)
              </p>
            </div>

            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadingProduct(null);
                  setUploadProgress(0);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap"
                disabled={uploadProgress > 0 && uploadProgress < 100}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (productToDelete) {
                    handleDeleteProduct(productToDelete);
                    setShowDeleteModal(false);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
