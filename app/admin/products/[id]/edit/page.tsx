
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory: string;
  stock: number;
  weight: number;
  images: string[];
  mainImageIndex: number;
  tags: string[];
  sizes: string[];
  colors: string[];
  [key: string]: any; // Allow for additional dynamic properties
}

interface ProductVersion {
  id: string;
  timestamp: Date;
  action: string;
  changes: { [key: string]: { old: any; new: any } };
  user: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [productHistory, setProductHistory] = useState<ProductVersion[]>([]);
  const [undoHistory, setUndoHistory] = useState<Product[]>([]);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

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

  const predefinedTags = [
    'new-arrival', 'bestseller', 'on-sale', 'featured', 'discontinued',
    'premium', 'eco-friendly', 'limited-edition', 'seasonal', 'trending',
    'classic', 'modern', 'vintage', 'casual', 'formal', 'summer', 'winter',
    'spring', 'autumn', 'cotton', 'leather', 'denim', 'silk', 'wool'
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'];
  const availableColors = ['Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Brown', 'Beige', 'Pink', 'Purple', 'Yellow'];

  useEffect(() => {
    loadProduct();
    loadProductHistory();
    setAvailableTags(predefinedTags);
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);

      const mockProduct: Product = {
        id: params.id,
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with active noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
        sku: 'FL-WH-001',
        price: 149.99,
        originalPrice: 199.99,
        category: 'electronics',
        subcategory: 'audio',
        stock: 45,
        weight: 0.5,
        dimensions: '20 x 18 x 8 cm',
        materials: 'Plastic, Metal, Foam',
        tags: ['premium', 'wireless', 'noise-cancelling', 'bestseller'],
        images: [
          'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20product%20photography%2C%20modern%20headphones%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20high%20quality%20audio%20equipment&width=600&height=600&seq=headphones-edit-1&orientation=squarish',
          'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20side%20view%2C%20modern%20headphones%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20high%20quality%20audio%20equipment&width=600&height=600&seq=headphones-edit-2&orientation=squarish',
          'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20back%20view%2C%20modern%20headphones%2C%20clean%20white%20background%2C%20professional%20product%20shot%2C%20high%20quality%20audio%20equipment&width=600&height=600&seq=headphones-edit-3&orientation=squarish'
        ],
        mainImageIndex: 0,
        sizes: ['One Size'],
        colors: ['Black', 'White', 'Silver'],
        isActive: true,
        stockStatus: 'in-stock',
        qualityScore: 95,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      };

      setProduct(mockProduct);
      setOriginalProduct(JSON.parse(JSON.stringify(mockProduct)));
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProductHistory = async () => {
    const mockHistory: ProductVersion[] = [
      {
        id: '1',
        timestamp: new Date('2024-01-20T14:30:00Z'),
        action: 'Updated price',
        changes: {
          price: { old: 169.99, new: 149.99 },
          originalPrice: { old: 199.99, new: 199.99 }
        },
        user: 'admin@flamestore.com'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-18T09:15:00Z'),
        action: 'Added new image',
        changes: {
          images: { old: ['image1.jpg', 'image2.jpg'], new: ['image1.jpg', 'image2.jpg', 'image3.jpg'] }
        },
        user: 'admin@flamestore.com'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-16T16:45:00Z'),
        action: 'Updated description',
        changes: {
          description: {
            old: 'High-quality wireless headphones with active noise cancellation.',
            new: 'High-quality wireless headphones with active noise cancellation and premium sound quality. Perfect for music lovers and professionals.'
          }
        },
        user: 'admin@flamestore.com'
      }
    ];

    setProductHistory(mockHistory);
  };

  const validateField = useCallback((field: string, value: any): string | null => {
    switch (field) {
      case 'name':
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        if (value.length > 100) {
          return 'Name cannot exceed 100 characters';
        }
        break;

      case 'price':
        if (!value || isNaN(Number(value)) || parseFloat(String(value)) <= 0) {
          return 'Price must be a valid positive number';
        }
        break;

      case 'originalPrice':
        if (value && (isNaN(Number(value)) || parseFloat(String(value)) <= 0)) {
          return 'Original price must be a valid positive number';
        }
        if (value && product?.price && parseFloat(String(value)) <= product.price) {
          return 'Original price should be higher than current price';
        }
        break;

      case 'stock':
        if (!value || isNaN(Number(value)) || parseInt(String(value)) < 0) {
          return 'Stock must be a valid non-negative number';
        }
        break;

      case 'weight':
        if (value && (isNaN(Number(value)) || parseFloat(String(value)) <= 0)) {
          return 'Weight must be a valid positive number';
        }
        break;

      case 'sku':
        if (!value || value.trim().length < 3) {
          return 'SKU must be at least 3 characters long';
        }
        if (!/^[A-Z0-9-]+$/.test(value)) {
          return 'SKU can only contain uppercase letters, numbers, and hyphens';
        }
        break;

      case 'description':
        if (!value || value.trim().length < 10) {
          return 'Description must be at least 10 characters long';
        }
        if (value.length > 1000) {
          return 'Description cannot exceed 1000 characters';
        }
        break;
    }
    return null;
  }, [product]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    if (undoHistory.length >= 3) {
      setUndoHistory(prev => prev.slice(1));
    }
    setUndoHistory(prev => [...prev, JSON.parse(JSON.stringify(product))]);

    setProduct((prev: Product | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });

    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  }, [product, validateField, undoHistory]);

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;

    const newImages = [...product!.images];
    const draggedImage = newImages[draggedImageIndex];

    newImages.splice(draggedImageIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    let newMainImageIndex = product!.mainImageIndex;
    if (draggedImageIndex === product!.mainImageIndex) {
      newMainImageIndex = dropIndex;
    } else if (draggedImageIndex < product!.mainImageIndex && dropIndex >= product!.mainImageIndex) {
      newMainImageIndex = product!.mainImageIndex - 1;
    } else if (draggedImageIndex > product!.mainImageIndex && dropIndex <= product!.mainImageIndex) {
      newMainImageIndex = product!.mainImageIndex + 1;
    }

    handleFieldChange('images', newImages);
    handleFieldChange('mainImageIndex', newMainImageIndex);
    setDraggedImageIndex(null);
  };

  const removeImage = (index: number) => {
    const newImages = product!.images.filter((_, i) => i !== index);
    const newMainImageIndex = index === product!.mainImageIndex ? 0 :
                              index < product!.mainImageIndex ? product!.mainImageIndex - 1 :
                              product!.mainImageIndex;

    handleFieldChange('images', newImages);
    handleFieldChange('mainImageIndex', Math.min(newMainImageIndex, newImages.length - 1));
  };

  const setMainImage = (index: number) => {
    handleFieldChange('mainImageIndex', index);
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      handleFieldChange('images', [...product!.images, url]);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !product!.tags.includes(newTag.trim())) {
      handleFieldChange('tags', [...product!.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFieldChange('tags', product!.tags.filter(tag => tag !== tagToRemove));
  };

  const togglePredefinedTag = (tag: string) => {
    if (product!.tags.includes(tag)) {
      removeTag(tag);
    } else {
      handleFieldChange('tags', [...product!.tags, tag]);
    }
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = product!.sizes.includes(size)
      ? product!.sizes.filter(s => s !== size)
      : [...product!.sizes, size];
    handleFieldChange('sizes', newSizes);
  };

  const handleColorToggle = (color: string) => {
    const newColors = product!.colors.includes(color)
      ? product!.colors.filter(c => c !== color)
      : [...product!.colors, color];
    handleFieldChange('colors', newColors);
  };

  const undoLastAction = () => {
    if (undoHistory.length > 0) {
      const lastState = undoHistory[undoHistory.length - 1];
      setProduct(lastState);
      setUndoHistory(prev => prev.slice(0, -1));
      setValidationErrors({});
    }
  };

  const saveProduct = async () => {
    const errors: ValidationErrors = {};
    Object.keys(product!).forEach(field => {
      const error = validateField(field, product![field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitStatus({ type: 'error', message: 'Please fix validation errors before saving.' });
      return;
    }

    setIsSaving(true);
    setSubmitStatus({ type: 'loading', message: 'Saving product...' });

    try {
      const formData = new URLSearchParams();
      formData.append('productId', product!.id);
      formData.append('name', product!.name);
      formData.append('description', product!.description);
      formData.append('sku', product!.sku);
      formData.append('price', product!.price.toString());
      formData.append('originalPrice', product!.originalPrice?.toString() || '');
      formData.append('category', product!.category);
      formData.append('subcategory', product!.subcategory);
      formData.append('stock', product!.stock.toString());
      formData.append('weight', product!.weight?.toString() || '');
      formData.append('dimensions', product!.dimensions || '');
      formData.append('materials', product!.materials || '');
      formData.append('tags', JSON.stringify(product!.tags));
      formData.append('images', JSON.stringify(product!.images));
      formData.append('mainImageIndex', product!.mainImageIndex.toString());
      formData.append('sizes', JSON.stringify(product!.sizes));
      formData.append('colors', JSON.stringify(product!.colors));
      formData.append('isActive', product!.isActive.toString());
      formData.append('action', 'update');

      const changes: Record<string, { old: unknown; new: unknown }> = {};
      Object.keys(product!).forEach(key => {
        if (JSON.stringify(product![key as keyof Product]) !== JSON.stringify(originalProduct![key as keyof Product])) {
          changes[key] = {
            old: originalProduct![key as keyof Product],
            new: product![key as keyof Product]
          };
        }
      });

      if (Object.keys(changes).length > 0) {
        formData.append('changes', JSON.stringify(changes));
      }

      const response = await fetch('https://readdy.ai/api/form/d23nuo1f1a4cjoidbrrg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Product updated successfully!' });

        if (Object.keys(changes).length > 0) {
          const newHistoryEntry: ProductVersion = {
            id: Date.now().toString(),
            timestamp: new Date(),
            action: 'Updated product',
            changes,
            user: 'admin@flamestore.com'
          };
          setProductHistory(prev => [newHistoryEntry, ...prev]);
        }

        setOriginalProduct(JSON.parse(JSON.stringify(product)));
        setUndoHistory([]);
        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 3000);
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to update product. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatChangeValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value?.toString() || 'Empty';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-600 mb-4"></i>
          <p className="text-gray-600">Product not found</p>
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-800">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-600">
                  ID: {product.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={undoLastAction}
                disabled={undoHistory.length === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <i className="ri-arrow-go-back-line"></i>
                <span>Undo ({undoHistory.length})</span>
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <i className="ri-eye-line"></i>
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              <button
                onClick={saveProduct}
                disabled={isSaving || Object.keys(validationErrors).some(key => validationErrors[key])}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : submitStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
            <div className="flex items-center">
              <i className={`${submitStatus.type === 'success' ? 'ri-check-circle-line' : submitStatus.type === 'error' ? 'ri-error-warning-line' : 'ri-loader-4-line animate-spin'} mr-2`}></i>
              {submitStatus.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'general'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'images'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setActiveTab('variants')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'variants'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Variants
                  </button>
                  <button
                    onClick={() => setActiveTab('tags')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'tags'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Tags
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'history'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    History
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <i className={`ri-${product.isActive ? 'eye' : 'eye-off'}-line text-xl ${product.isActive ? 'text-green-600' : 'text-gray-400'}`}></i>
                        <div>
                          <h3 className="font-medium text-gray-900">Product Visibility</h3>
                          <p className="text-sm text-gray-600">
                            Product is currently {product.isActive ? 'active' : 'inactive'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFieldChange('isActive', !product.isActive)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          product.isActive ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            product.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter product name"
                        />
                        {validationErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU *
                        </label>
                        <input
                          type="text"
                          value={product.sku}
                          onChange={(e) => handleFieldChange('sku', e.target.value.toUpperCase())}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.sku ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter SKU code"
                        />
                        {validationErrors.sku && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.sku}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={product.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          validationErrors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter product description"
                      />
                      <div className="flex justify-between items-center mt-1">
                        {validationErrors.description && (
                          <p className="text-sm text-red-600">{validationErrors.description}</p>
                        )}
                        <p className="text-xs text-gray-500 ml-auto">
                          {product.description.length}/1000 characters
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price *
                        </label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleFieldChange('price', e.target.value)}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                        {validationErrors.price && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Original Price
                        </label>
                        <input
                          type="number"
                          value={product.originalPrice || ''}
                          onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.originalPrice ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                        {validationErrors.originalPrice && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.originalPrice}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={product.category}
                          onChange={(e) => handleFieldChange('category', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                        >
                          <option value="">Select Category</option>
                          {Object.entries(categories).map(([key, category]) => (
                            <option key={key} value={key}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory
                        </label>
                        <select
                          value={product.subcategory}
                          onChange={(e) => handleFieldChange('subcategory', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          disabled={!product.category}
                        >
                          <option value="">Select Subcategory</option>
                          {product.category && Object.entries(categories[product.category as keyof typeof categories]?.subcategories || {}).map(([key, name]) => (
                            <option key={key} value={key}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleFieldChange('stock', e.target.value)}
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.stock ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0"
                        />
                        {validationErrors.stock && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.stock}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={product.weight || ''}
                          onChange={(e) => handleFieldChange('weight', e.target.value)}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.weight ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                        {validationErrors.weight && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.weight}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={product.dimensions || ''}
                          onChange={(e) => handleFieldChange('dimensions', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 10 x 5 x 3 cm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Materials
                      </label>
                      <input
                        type="text"
                        value={product.materials || ''}
                        onChange={(e) => handleFieldChange('materials', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Cotton, Polyester, Leather"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                      <button
                        onClick={addImageUrl}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <i className="ri-add-line"></i>
                        <span>Add Image</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleImageDragStart(e, index)}
                          onDragOver={handleImageDragOver}
                          onDrop={(e) => handleImageDrop(e, index)}
                          className={`relative group border-2 rounded-lg overflow-hidden cursor-move ${
                            index === product.mainImageIndex ? 'border-blue-500' : 'border-gray-200'
                          } ${draggedImageIndex === index ? 'opacity-50' : ''}`}
                        >
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />

                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                              <button
                                onClick={() => setMainImage(index)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                title="Set as main image"
                              >
                                <i className="ri-image-line text-gray-700"></i>
                              </button>
                              <button
                                onClick={() => removeImage(index)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                title="Remove image"
                              >
                                <i className="ri-delete-bin-line text-red-600"></i>
                              </button>
                            </div>
                          </div>

                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-900 text-white rounded-full text-xs font-medium">
                              {index + 1}
                            </span>
                          </div>

                          {index === product.mainImageIndex && (
                            <div className="absolute top-2 right-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                                Main
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <i className="ri-information-line text-blue-600 mr-2"></i>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Image Management Tips:</p>
                          <ul className="mt-1 list-disc list-inside space-y-1">
                            <li>Drag and drop images to reorder them</li>
                            <li>Click the image icon to set as main image</li>
                            <li>Main image appears first in product listings</li>
                            <li>Recommended image size: 800x800 pixels</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeToggle(size)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                              product.sizes.includes(size)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Selected: {product.sizes.join(', ') || 'None'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Available Colors</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorToggle(color)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                              product.colors.includes(color)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Selected: {product.colors.join(', ') || 'None'}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'tags' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Current Tags</label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          placeholder="Add custom tag..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={addTag}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Predefined Tags</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {predefinedTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => togglePredefinedTag(tag)}
                            className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
                              product.tags.includes(tag)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Version History</h3>
                      <div className="space-y-4">
                        {productHistory.map((version) => (
                          <div key={version.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <i className="ri-time-line text-gray-500"></i>
                                <span className="font-medium text-gray-900">{version.action}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {version.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">By: {version.user}</p>

                            {Object.keys(version.changes).length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Changes:</h4>
                                <div className="space-y-2">
                                  {Object.entries(version.changes).map(([field, change]) => (
                                    <div key={field} className="text-sm">
                                      <span className="font-medium text-gray-700 capitalize">{field}:</span>
                                      <div className="ml-4 mt-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-red-600">- {formatChangeValue(change.old)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-green-600">+ {formatChangeValue(change.new)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product.images[product.mainImageIndex] || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <p>SKU: {product.sku}</p>
                        <p>Category: {product.category}</p>
                        {product.materials && <p>Materials: {product.materials}</p>}
                      </div>

                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {product.sizes.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Sizes:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((size, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.colors.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Colors:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.colors.map((color, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs"
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
