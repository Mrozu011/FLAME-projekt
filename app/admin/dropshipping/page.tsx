'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { aliExpressAPI } from '@/lib/aliexpress-api';

interface ImportedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  reviews: number;
  category: string;
  stock: number;
  supplier: string;
  selected: boolean;
  customizations?: {
    title?: string;
    price?: number;
    description?: string;
  };
}

export default function DropshippingImport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState<ImportedProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSettings, setImportSettings] = useState({
    priceMultiplier: 1.5,
    autoPublish: false,
    minimumRating: 4.0,
    minimumStock: 10
  });
  const [showCustomization, setShowCustomization] = useState<string | null>(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'women-clothing', label: 'Women\'s Clothing' },
    { value: 'men-clothing', label: 'Men\'s Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'jewelry', label: 'Jewelry & Accessories' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'beauty', label: 'Beauty & Health' }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await aliExpressAPI.searchProducts(
        searchQuery,
        category || undefined,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined
      );

      const transformedResults: ImportedProduct[] = results.map(product => ({
        id: product.productId,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        rating: product.rating,
        reviews: product.reviews,
        category: product.category,
        stock: product.stock,
        supplier: product.supplierInfo.name,
        selected: false
      }));

      setSearchResults(transformedResults);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === searchResults.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(searchResults.map(p => p.id));
    }
  };

  const handleCustomizeProduct = (productId: string, customizations: any) => {
    setSearchResults(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, customizations }
          : product
      )
    );
    setShowCustomization(null);
  };

  const handleImportSelected = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to import');
      return;
    }

    setIsImporting(true);
    try {
      const customizations: Record<string, any> = {};
      
      searchResults.forEach(product => {
        if (selectedProducts.includes(product.id) && product.customizations) {
          customizations[product.id] = product.customizations;
        }
      });

      const results = await aliExpressAPI.bulkImportProducts(selectedProducts, customizations);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      alert(`Import completed! ${successCount} products imported successfully, ${failCount} failed.`);
      
      // Reset selections
      setSelectedProducts([]);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSettingsUpdate = (newSettings: typeof importSettings) => {
    setImportSettings(newSettings);
    aliExpressAPI.updateSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dropshipping Import</h1>
                <p className="text-sm text-gray-500">Import products from AliExpress</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleImportSelected}
                  disabled={isImporting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isImporting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-download-line"></i>
                      <span>Import Selected ({selectedProducts.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search & Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Products</h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Query
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., wireless headphones"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-search-line"></i>
                      <span>Search</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Import Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Multiplier
                  </label>
                  <input
                    type="number"
                    value={importSettings.priceMultiplier}
                    onChange={(e) => handleSettingsUpdate({
                      ...importSettings,
                      priceMultiplier: parseFloat(e.target.value)
                    })}
                    step="0.1"
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Multiply supplier price by this factor
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <input
                    type="number"
                    value={importSettings.minimumRating}
                    onChange={(e) => handleSettingsUpdate({
                      ...importSettings,
                      minimumRating: parseFloat(e.target.value)
                    })}
                    step="0.1"
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    value={importSettings.minimumStock}
                    onChange={(e) => handleSettingsUpdate({
                      ...importSettings,
                      minimumStock: parseInt(e.target.value)
                    })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importSettings.autoPublish}
                      onChange={(e) => handleSettingsUpdate({
                        ...importSettings,
                        autoPublish: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Auto-publish imported products</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {searchResults.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === searchResults.length}
                          onChange={handleSelectAll}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Select All ({searchResults.length} products)
                        </span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      {selectedProducts.length} selected
                    </p>
                  </div>
                </div>
              )}

              {searchResults.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isSearching ? 'Searching...' : 'No products found'}
                  </h3>
                  <p className="text-gray-500">
                    {isSearching ? 'Please wait while we search AliExpress...' : 'Try adjusting your search terms or filters'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {searchResults.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={product.images[0] || '/placeholder-image.jpg'}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleProductSelect(product.id)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </div>
                        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium">
                          ⭐ {product.rating} ({product.reviews})
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                          {product.customizations?.title || product.title}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${product.customizations?.price || product.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Stock: {product.stock}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500">
                            {product.supplier}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setShowCustomization(product.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                          >
                            <i className="ri-edit-line"></i>
                            <span>Customize</span>
                          </button>
                          <button
                            onClick={() => handleProductSelect(product.id)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              selectedProducts.includes(product.id)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {selectedProducts.includes(product.id) ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Product</h3>
            
            {(() => {
              const product = searchResults.find(p => p.id === showCustomization);
              if (!product) return null;

              const [customTitle, setCustomTitle] = useState(product.customizations?.title || product.title);
              const [customPrice, setCustomPrice] = useState(product.customizations?.price || product.price);
              const [customDescription, setCustomDescription] = useState(product.customizations?.description || '');

              const handleSave = () => {
                handleCustomizeProduct(product.id, {
                  title: customTitle,
                  price: customPrice,
                  description: customDescription
                });
              };

              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add custom description..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowCustomization(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}