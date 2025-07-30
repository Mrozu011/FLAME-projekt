
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { activityLogger } from '@/lib/activity-logger';
import PriceDisplay from '@/components/PriceDisplay';

export default function CreateProduct() {
  const router = useRouter();
  const { t, language, changeLanguage } = useTranslation();
  const { currency, format } = useCurrency();
  
  const [productType, setProductType] = useState('our');
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    comparePrice: '',
    sku: '',
    stock: '',
    weight: '',
    dimensions: '',
    materials: '',
    tags: '',
    images: [],
    variants: [],
    brand: '',
    warranty: '',
    origin: '',
    careInstructions: []
  });

  const [languageVersions, setLanguageVersions] = useState({
    en: { name: '', description: '' },
    pl: { name: '', description: '' },
    it: { name: '', description: '' },
    pt: { name: '', description: '' },
    fr: { name: '', description: '' },
    de: { name: '', description: '' }
  });

  const [dropshipData, setDropshipData] = useState({
    supplierName: '',
    supplierUrl: '',
    supplierPrice: '',
    shippingCost: '',
    processingTime: '',
    apiEndpoint: ''
  });

  const [imageData, setImageData] = useState({
    uploadedImages: [],
    uploadProgress: {},
    mainImageIndex: 0
  });

  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [careInstructions, setCareInstructions] = useState([]);
  const [newCareInstruction, setNewCareInstruction] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = {
    women: {
      name: 'Women',
      subcategories: {
        dresses: 'Dresses',
        tops: 'Tops',
        bottoms: 'Bottoms',
        outerwear: 'Outerwear',
        shoes: 'Shoes',
        accessories: 'Accessories'
      }
    },
    men: {
      name: 'Men',
      subcategories: {
        shirts: 'Shirts',
        pants: 'Pants',
        jackets: 'Jackets',
        shoes: 'Shoes',
        accessories: 'Accessories'
      }
    },
    accessories: {
      name: 'Accessories',
      subcategories: {
        bags: 'Bags',
        jewelry: 'Jewelry',
        watches: 'Watches',
        eyewear: 'Eyewear',
        belts: 'Belts'
      }
    }
  };

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', 'One Size'];
  const availableColors = ['Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Brown', 'Beige', 'Pink', 'Purple', 'Yellow', 'Silver', 'Gold'];

  // Sync current language data with language versions
  useEffect(() => {
    setLanguageVersions(prev => ({
      ...prev,
      [language]: {
        name: formData.name,
        description: formData.description
      }
    }));
  }, [formData.name, formData.description, language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageVersionChange = (lang, field, value) => {
    setLanguageVersions(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleDropshipChange = (e) => {
    const { name, value } = e.target;
    setDropshipData(prev => ({ 
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        const newImage = {
          id: Date.now() + index,
          name: file.name,
          url: imageUrl,
          file: file
        };

        setImageData(prev => ({
          ...prev,
          uploadedImages: [...prev.uploadedImages, newImage]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImageData(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter(img => img.id !== imageId),
      mainImageIndex: prev.mainImageIndex >= prev.uploadedImages.length - 1 ? 0 : prev.mainImageIndex
    }));
  };

  const setMainImage = (index) => {
    setImageData(prev => ({
      ...prev,
      mainImageIndex: index
    }));
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const newImage = {
        id: Date.now(),
        name: `Image ${imageData.uploadedImages.length + 1}`,
        url: url,
        file: null
      };
      setImageData(prev => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, newImage]
      }));
    }
  };

  const handleSizeToggle = (size) => {
    setSizeOptions(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleColorToggle = (color) => {
    setColorOptions(prev => 
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const addCareInstruction = () => {
    if (newCareInstruction.trim()) {
      setCareInstructions(prev => [...prev, newCareInstruction.trim()]);
      setNewCareInstruction('');
    }
  };

  const removeCareInstruction = (index) => {
    setCareInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const showNotification = (message, type) => {
    setSubmitStatus({ type, message });
    setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (imageData.uploadedImages.length === 0) {
      showNotification('Please upload at least one product image', 'error');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const productId = Date.now().toString();
      
      // Create product data with language versions
      const productData = {
        id: productId,
        ...formData,
        sizes: sizeOptions,
        colors: colorOptions,
        careInstructions: careInstructions,
        languageVersions: languageVersions,
        currency: currency,
        images: imageData.uploadedImages.map(img => img.url),
        mainImageIndex: imageData.mainImageIndex,
        productType: productType,
        dropshipData: productType === 'dropship' ? dropshipData : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage for demo
      const existingProducts = JSON.parse(localStorage.getItem('flame-products') || '[]');
      existingProducts.push(productData);
      localStorage.setItem('flame-products', JSON.stringify(existingProducts));

      // Log product creation
      activityLogger.logProductCreate(productId, formData.name);
      
      // Dispatch events for real-time updates
      window.dispatchEvent(new CustomEvent('productCreated', { detail: productData }));
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
      window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency } }));
      
      showNotification('Product created successfully and is now live on the website!', 'success');
      
      // Reset form after successful creation
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating product:', error);
      activityLogger.logSystemError('Product creation failed', formData.name);
      showNotification('Failed to create product. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderProductPreview = () => {
    const currentLangData = languageVersions[language];
    const displayName = currentLangData.name || formData.name;
    const displayDescription = currentLangData.description || formData.description;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        
        <div className="space-y-4">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {imageData.uploadedImages.length > 0 ? (
              <img
                src={imageData.uploadedImages[imageData.mainImageIndex]?.url || imageData.uploadedImages[0]?.url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <i className="ri-image-line text-4xl"></i>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {language.toUpperCase()} • {currency}
              </span>
              {formData.category && (
                <span className="text-sm text-gray-500">
                  {categories[formData.category]?.name}
                </span>
              )}
            </div>

            <h4 className="text-xl font-bold text-gray-900">
              {displayName || 'Product Name'}
            </h4>

            <p className="text-gray-600 text-sm">
              {displayDescription || 'Product description...'}
            </p>

            <div className="flex items-center space-x-3">
              {formData.price && (
                <PriceDisplay
                  price={parseFloat(formData.price)}
                  originalPrice={formData.comparePrice ? parseFloat(formData.comparePrice) : undefined}
                  className="text-2xl font-bold"
                />
              )}
            </div>

            {/* Sizes */}
            {sizeOptions.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Sizes:</span>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <span key={size} className="px-3 py-1 border border-gray-300 rounded text-sm">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colorOptions.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Colors:</span>
                <div className="flex space-x-2">
                  {colorOptions.map(color => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {formData.stock && (
              <div className="flex items-center space-x-2">
                <i className="ri-checkbox-circle-fill text-green-500"></i>
                <span className="text-sm text-green-600">
                  In Stock ({formData.stock} available)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
                <p className="text-sm text-gray-600">
                  Language: {language.toUpperCase()} • Currency: {currency}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <i className="ri-eye-line"></i>
                <span>{previewMode ? 'Hide' : 'Show'} Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
            submitStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <div className="flex items-center">
              <i className={`${
                submitStatus.type === 'success' ? 'ri-check-circle-line' : 
                submitStatus.type === 'error' ? 'ri-error-warning-line' : 
                'ri-loader-4-line animate-spin'
              } mr-2`}></i>
              {submitStatus.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form id="product-create-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Product Type Selection */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Type</h3>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="our"
                      checked={productType === 'our'}
                      onChange={(e) => setProductType(e.target.value)}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-900 font-medium">Our Product</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="dropship"
                      checked={productType === 'dropship'}
                      onChange={(e) => setProductType(e.target.value)}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-900 font-medium">Dropshipping Product</span>
                  </label>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('general')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'general'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      General Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('images')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'images'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Images
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('variants')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'variants'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Variants
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('languages')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'languages'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Languages
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'details'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Details
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* General Info Tab */}
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            maxLength={100}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter product name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SKU *
                          </label>
                          <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleInputChange}
                            maxLength={50}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter SKU code"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          maxLength={1000}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Enter product description"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                            required
                          >
                            <option value="">Select Category</option>
                            {Object.entries(categories).map(([key, category]) => (
                              <option key={key} value={key}>{category.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subcategory
                          </label>
                          <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                            disabled={!formData.category}
                          >
                            <option value="">Select Subcategory</option>
                            {formData.category && Object.entries(categories[formData.category]?.subcategories || {}).map(([key, name]) => (
                              <option key={key} value={key}>{name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price ({currency}) *
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compare Price ({currency})
                          </label>
                          <input
                            type="number"
                            name="comparePrice"
                            value={formData.comparePrice}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {productType === 'our' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Stock Quantity *
                            </label>
                            <input
                              type="number"
                              name="stock"
                              value={formData.stock}
                              onChange={handleInputChange}
                              min="0"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleInputChange}
                              step="0.01"
                              min="0"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === 'images' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                        <button
                          type="button"
                          onClick={addImageUrl}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <i className="ri-add-line"></i>
                          <span>Add Image URL</span>
                        </button>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-4"></i>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">Upload Product Images</h4>
                        <p className="text-gray-500 mb-4">
                          Upload multiple images to showcase your product from different angles
                        </p>
                        <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                          <i className="ri-upload-line mr-2"></i>
                          Choose Images
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported formats: JPG, PNG, GIF (Max size: 5MB each)
                        </p>
                      </div>

                      {imageData.uploadedImages.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">
                            Uploaded Images ({imageData.uploadedImages.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imageData.uploadedImages.map((image, index) => (
                              <div key={image.id} className="relative group">
                                <div className={`relative border-2 rounded-lg overflow-hidden ${
                                  index === imageData.mainImageIndex ? 'border-blue-500' : 'border-gray-200'
                                }`}>
                                  <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-32 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => setMainImage(index)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                        title="Set as main image"
                                      >
                                        <i className="ri-image-line text-gray-700"></i>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeImage(image.id)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                        title="Remove image"
                                      >
                                        <i className="ri-delete-bin-line text-red-600"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 text-center">
                                  <p className="text-xs text-gray-600 truncate">{image.name}</p>
                                  {index === imageData.mainImageIndex && (
                                    <p className="text-xs text-blue-600 font-medium">Main Image</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Variants Tab */}
                  {activeTab === 'variants' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                          {availableSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                sizeOptions.includes(size)
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Selected: {sizeOptions.join(', ') || 'None'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Available Colors</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {availableColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => handleColorToggle(color)}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                                colorOptions.includes(color)
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                              <span>{color}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Selected: {colorOptions.join(', ') || 'None'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Languages Tab */}
                  {activeTab === 'languages' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <i className="ri-information-line text-blue-600 mr-2"></i>
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">Language Synchronization</p>
                            <p>Product content will be automatically translated and synchronized across all language versions when published.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {availableLanguages.map((lang) => (
                          <div
                            key={lang.code}
                            className={`border rounded-lg p-4 ${
                              lang.code === language ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center mb-3">
                              <span className="text-lg mr-2">{lang.flag}</span>
                              <h4 className="font-medium text-gray-900">{lang.name}</h4>
                              {lang.code === language && (
                                <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Current
                                </span>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Product Name
                                </label>
                                <input
                                  type="text"
                                  value={languageVersions[lang.code]?.name || ''}
                                  onChange={(e) => handleLanguageVersionChange(lang.code, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Product name in ${lang.name}`}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={languageVersions[lang.code]?.description || ''}
                                  onChange={(e) => handleLanguageVersionChange(lang.code, 'description', e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                  placeholder={`Product description in ${lang.name}`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brand
                          </label>
                          <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Brand name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Materials
                          </label>
                          <input
                            type="text"
                            name="materials"
                            value={formData.materials}
                            onChange={handleInputChange}
                            placeholder="e.g., Cotton, Polyester, Leather"
                            maxLength={100}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dimensions
                          </label>
                          <input
                            type="text"
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleInputChange}
                            placeholder="e.g., 10 x 5 x 3 cm"
                            maxLength={50}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Origin
                          </label>
                          <input
                            type="text"
                            name="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                            placeholder="e.g., Germany, Italy"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty
                        </label>
                        <input
                          type="text"
                          name="warranty"
                          value={formData.warranty}
                          onChange={handleInputChange}
                          placeholder="e.g., 2 years"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Care Instructions
                        </label>
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newCareInstruction}
                              onChange={(e) => setNewCareInstruction(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCareInstruction())}
                              placeholder="Add care instruction..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={addCareInstruction}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {careInstructions.length > 0 && (
                            <div className="space-y-2">
                              {careInstructions.map((instruction, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                  <i className="ri-check-line text-green-500"></i>
                                  <span className="flex-1 text-sm text-gray-700">{instruction}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeCareInstruction(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <i className="ri-close-line"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dropshipping Information */}
              {productType === 'dropship' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Dropshipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name *</label>
                      <input
                        type="text"
                        name="supplierName"
                        value={dropshipData.supplierName}
                        onChange={handleDropshipChange}
                        maxLength={100}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter supplier name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supplier URL *</label>
                      <input
                        type="url"
                        name="supplierUrl"
                        value={dropshipData.supplierUrl}
                        onChange={handleDropshipChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://supplier.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Price *</label>
                      <input
                        type="number"
                        name="supplierPrice"
                        value={dropshipData.supplierPrice}
                        onChange={handleDropshipChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time (days) *</label>
                      <input
                        type="number"
                        name="processingTime"
                        value={dropshipData.processingTime}
                        onChange={handleDropshipChange}
                        min="1"
                        max="30"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1-30"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link 
                  href="/admin/products" 
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-add-line"></i>
                      <span>Create Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {renderProductPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
