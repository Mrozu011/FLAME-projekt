
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PriceDisplay from './PriceDisplay';
import type { Product } from '@/lib/types';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
}

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize modal mounted state
  useEffect(() => {
    setIsModalMounted(true);
  }, []);

  // Reset modal state when opened
  useEffect(() => {
    if (!isModalMounted) return;

    if (isOpen && product) {
      const sizes = getProductSizes(product);
      const colors = getProductColors(product);

      // Set default selections
      setSelectedSize(sizes[0] || '');
      setSelectedColor(colors[0] || '');
      setQuantity(1);
      setCurrentImageIndex(0);
      setAddedToCart(false);

      // Check if product is favorited
      const checkFavorites = () => {
        try {
          const savedFavorites = localStorage.getItem('flame-favorites');
          if (savedFavorites) {
            const favorites = JSON.parse(savedFavorites);
            setIsFavorited(favorites.some((item: any) => item.id === product.id));
          } else {
            setIsFavorited(false);
          }
        } catch (error) {
          console.error('Error checking favorites:', error);
          setIsFavorited(false);
        }
      };

      checkFavorites();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, product, isModalMounted]);

  useEffect(() => {
    if (!isModalMounted) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isModalMounted]);

  const getProductSizes = (product: Product) => {
    if (product.sizes) return product.sizes;
    // Default sizes based on category
    if (product.category === 'Women' || product.category === 'Men') {
      return ['XS', 'S', 'M', 'L', 'XL'];
    }
    return ['One Size'];
  };

  const getProductColors = (product: Product) => {
    if (product.colors) return product.colors;
    // Default colors
    return ['Black', 'White', 'Gray'];
  };

  const getProductImages = (product: Product) => {
    if (product.images && product.images.length > 1) {
      return product.images;
    }
    return [product.image];
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#DC2626',
      'blue': '#2563EB',
      'navy': '#1E3A8A',
      'green': '#059669',
      'yellow': '#EAB308',
      'pink': '#EC4899',
      'purple': '#7C3AED',
      'gray': '#6B7280',
      'brown': '#92400E',
      'beige': '#F5F5DC',
      'cream': '#F5F5DC',
      'tan': '#D2B48C',
      'light blue': '#3B82F6',
      'dark blue': '#1E40AF',
      'burgundy': '#7F1D1D'
    };
    return colorMap[color.toLowerCase()] || '#6B7280';
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
        ))}
        {hasHalfStar && <i className="ri-star-half-fill text-yellow-400 text-sm"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={i} className="ri-star-line text-gray-300 text-sm"></i>
        ))}
      </div>
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isModalMounted) return;

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor
      };

      const savedCart = localStorage.getItem('flame-cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = cartItems.findIndex((item: any) =>
        item.id === product.id && item.size === selectedSize && item.color === selectedColor
      );

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push(cartItem);
      }

      localStorage.setItem('flame-cart', JSON.stringify(cartItems));

      // Use setTimeout to ensure state updates happen after the current execution
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }, 0);

      // Call parent handler if provided
      if (onAddToCart) {
        onAddToCart(product, selectedSize, selectedColor);
      }

      // Show success feedback
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isModalMounted) return;

    try {
      const savedFavorites = localStorage.getItem('flame-favorites');
      let favoriteItems = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (!isFavorited) {
        const favoriteItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        };
        favoriteItems.push(favoriteItem);
        setIsFavorited(true);
      } else {
        favoriteItems = favoriteItems.filter((item: any) => item.id !== product.id);
        setIsFavorited(false);
      }

      localStorage.setItem('flame-favorites', JSON.stringify(favoriteItems));

      // Use setTimeout to ensure state updates happen after the current execution
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('favoriteUpdated'));
      }, 0);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    const images = getProductImages(product);
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    } else {
      setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }
  };

  const getProductDescription = () => {
    if (product.description) return product.description;

    // Generate description based on product info
    let description = `Premium quality ${product.name.toLowerCase()} from our ${product.category.toLowerCase()} collection. `;

    if (product.material) {
      description += `Made from ${product.material.toLowerCase()} for ultimate comfort and durability. `;
    }

    if (product.isNew) {
      description += 'Part of our latest arrivals featuring contemporary design. ';
    }

    if (product.tags && product.tags.length > 0) {
      description += `Perfect for ${product.tags.join(', ')} occasions. `;
    }

    description += 'Available in multiple sizes and colors to suit your style.';

    return description;
  };

  const getStockStatus = () => {
    if (product.stockStatus) {
      switch (product.stockStatus) {
        case 'in-stock': return { text: 'In Stock', color: 'text-green-600', icon: 'ri-checkbox-circle-fill' };
        case 'low-stock': return { text: 'Low Stock', color: 'text-yellow-600', icon: 'ri-error-warning-fill' };
        case 'out-of-stock': return { text: 'Out of Stock', color: 'text-red-600', icon: 'ri-close-circle-fill' };
      }
    }
    return { text: 'In Stock', color: 'text-green-600', icon: 'ri-checkbox-circle-fill' };
  };

  // Don't render until component is mounted
  if (!isOpen || !product || !isModalMounted) return null;

  const images = getProductImages(product);
  const sizes = getProductSizes(product);
  const colors = getProductColors(product);
  const stockStatus = getStockStatus();
  const isOutOfStock = product.stockStatus === 'out-of-stock';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative card-theme rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-theme"
        role="dialog"
        aria-labelledby="quick-view-title"
        aria-describedby="quick-view-description"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-theme-secondary hover:bg-theme-tertiary rounded-full flex items-center justify-center text-theme-secondary hover:text-theme-primary transition-all shadow-sm"
          aria-label="Close quick view"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-theme-secondary flex items-center justify-center p-6">
            <div className="relative w-full max-w-md">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />

              {/* Product Badges - Positioned as overlay on image */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
                {product.isNew && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                    New
                  </span>
                )}
                {product.isOnSale && product.discount && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-theme-primary hover:bg-theme-secondary rounded-full flex items-center justify-center shadow-sm transition-all"
                    aria-label="Previous image"
                  >
                    <i className="ri-arrow-left-s-line text-theme-primary"></i>
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-theme-primary hover:bg-theme-secondary rounded-full flex items-center justify-center shadow-sm transition-all"
                    aria-label="Next image"
                  >
                    <i className="ri-arrow-right-s-line text-theme-primary"></i>
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-theme-primary' : 'bg-theme-tertiary'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h2 id="quick-view-title" className="text-2xl font-bold text-theme-primary mb-2">
                  {product.name}
                </h2>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-theme-secondary">({product.reviewCount} reviews)</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${stockStatus.color}`}>
                    <i className={`${stockStatus.icon} text-sm`}></i>
                    <span className="text-sm font-medium">{stockStatus.text}</span>
                  </div>
                </div>
                <p className="text-theme-secondary text-sm">{product.category} • {product.subcategory}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  className="text-2xl"
                />
                {product.discount && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <div id="quick-view-description">
                <p className="text-theme-secondary text-sm leading-relaxed">
                  {getProductDescription()}
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Size: {selectedSize}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 border rounded text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-theme-primary bg-theme-primary text-theme-primary'
                          : 'border-theme-primary text-theme-secondary hover:border-theme-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Color: {selectedColor}
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-theme-primary shadow-md'
                          : 'border-theme-primary hover:border-theme-primary'
                      }`}
                      style={{ backgroundColor: getColorStyle(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-theme-primary rounded hover:bg-theme-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <i className="ri-subtract-line text-theme-primary"></i>
                  </button>
                  <span className="w-12 text-center font-medium text-theme-primary">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-theme-primary rounded hover:bg-theme-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <i className="ri-add-line text-theme-primary"></i>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all whitespace-nowrap ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : isOutOfStock
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'btn-primary'
                    }`}
                  >
                    {addedToCart ? (
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-check-line"></i>
                        <span>Added to Cart</span>
                      </div>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  <button
                    onClick={handleFavoriteToggle}
                    className={`w-12 h-12 flex items-center justify-center border rounded-lg transition-all ${
                      isFavorited
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-theme-primary hover:border-theme-primary'
                    }`}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <i className={`${isFavorited ? 'ri-heart-fill' : 'ri-heart-line'} text-lg`}></i>
                  </button>
                </div>

                {/* View Full Details Link */}
                <a
                  href={`/product/${product.id}`}
                  className="block w-full py-3 px-6 text-center btn-secondary rounded-lg font-medium transition-colors whitespace-nowrap"
                  onClick={onClose}
                >
                  View Full Details
                </a>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-theme-secondary text-theme-secondary px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
