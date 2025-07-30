
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SizeGuide from './SizeGuide';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  isOnSale?: boolean;
  discount?: number;
  lowestPrice30Days?: number;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  images: string[];
}

interface ProductInfoProps {
  product: any;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  productName: string;
}

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  loginTime: string;
  expiresAt: string;
}

export default function ProductInfo({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  productName
}: ProductInfoProps) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isInfoMounted, setIsInfoMounted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const currencies: Record<string, Currency> = {
    USD: { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.85, name: 'Euro' },
    PLN: { code: 'PLN', symbol: 'zł', rate: 4.40, name: 'Polish Złoty' },
    JPY: { code: 'JPY', symbol: '¥', rate: 110, name: 'Japanese Yen' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.73, name: 'British Pound' }
  };

  useEffect(() => {
    setIsInfoMounted(true);
  }, []);

  useEffect(() => {
    if (!isInfoMounted) return;

    const loadSavedData = () => {
      try {
        const savedCurrency = localStorage.getItem('flame-currency') || 'USD';
        const savedSession = localStorage.getItem('flame-user-session');
        const savedFavorites = localStorage.getItem('flame-favorites');

        setCurrentCurrency(savedCurrency);

        if (savedSession) {
          const session = JSON.parse(savedSession);
          const now = new Date().toISOString();
          if (session.expiresAt && session.expiresAt > now) {
            setUserSession(session);
          } else {
            localStorage.removeItem('flame-user-session');
          }
        }

        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          setIsFavorited(favorites.some((item: any) => item.id === product.id));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        setCurrentCurrency('USD');
        setUserSession(null);
        setIsFavorited(false);
      }
    };

    loadSavedData();
  }, [product.id, isInfoMounted]);

  const convertPrice = (price: number) => {
    const rate = currencies[currentCurrency].rate;
    return price * rate;
  };

  const formatPrice = (price: number) => {
    const currency = currencies[currentCurrency];
    const convertedPrice = convertPrice(price);

    if (currentCurrency === 'PLN') {
      return `${convertedPrice.toFixed(2).replace('.', ',')} ${currency.symbol}`;
    } else if (currentCurrency === 'JPY') {
      return `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    } else {
      return `${currency.symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  const renderStars = (rating: number) => {
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

  const handleFavoriteToggle = () => {
    if (!isInfoMounted) return;

    if (!userSession) {
      router.push('/login');
      return;
    }

    try {
      const savedFavorites = localStorage.getItem('flame-favorites');
      let favoriteItems = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (!isFavorited) {
        const favoriteItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        };
        favoriteItems.push(favoriteItem);
        setIsFavorited(true);
      } else {
        favoriteItems = favoriteItems.filter((item: any) => item.id !== product.id);
        setIsFavorited(false);
      }

      localStorage.setItem('flame-favorites', JSON.stringify(favoriteItems));

      window.dispatchEvent(new Event('favoriteUpdated'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = () => {
    if (!isInfoMounted) return;

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
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

      window.dispatchEvent(new CustomEvent('cartUpdated'));

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
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
      'camel': '#C19A6B',
      'light blue': '#3B82F6',
      'burgundy': '#7F1D1D',
      'silver': '#C0C0C0'
    };
    return colorMap[color.toLowerCase()] || '#6B7280';
  };

  const getFreeShippingThreshold = () => {
    return currentCurrency === 'PLN' ? 250 / currencies.PLN.rate : 50;
  };

  const getProductCategory = () => {
    const name = product.name.toLowerCase();
    if (name.includes('shoe') || name.includes('sneaker') || name.includes('boot')) {
      return 'shoes';
    }
    return 'clothing';
  };

  const getDeliveryEstimate = () => {
    return product?.deliveryType === 'own-stock' ? '2-5 days' : '9-12 days';
  };

  const getStockDisplay = () => {
    if (!product) return '';
    return product.inStock ? 'In Stock' : 'Out of Stock';
  };

  const isVariantAvailable = (size: string, color: string) => {
    return product?.inStock;
  };

  if (!isInfoMounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
          </div>
          <span className="text-sm text-gray-500">SKU: {product.id}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
              -{product.discount}%
            </span>
          )}
        </div>
        {product.lowestPrice30Days && (
          <p className="text-sm text-gray-600">
            Lowest price in the last 30 days: {formatPrice(product.lowestPrice30Days)}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center space-x-2 ${
            product.inStock ? 'text-green-600' : 'text-red-600'
          }`}
        >
          <i
            className={`${product.inStock ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'
            } text-sm`}
          ></i>
          <span className="text-sm font-medium">{getStockDisplay()}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <i className="ri-truck-line text-sm"></i>
          <span className="text-sm">Delivery: {getDeliveryEstimate()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Color</label>
          <div className="flex space-x-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                disabled={!isVariantAvailable(selectedSize, color)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  selectedColor === color
                    ? 'border-black'
                    : 'border-gray-300'
                } ${
                  !isVariantAvailable(selectedSize, color)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-gray-400'
                }`}
                style={{ backgroundColor: getColorStyle(color) }}
                title={color}
              >
                {!isVariantAvailable(selectedSize, color) && (
                  <i className="ri-close-line text-white text-sm"></i>
                )}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">Selected: {selectedColor}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Size</label>
          <div className="grid grid-cols-6 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={!isVariantAvailable(size, selectedColor)}
                className={`px-3 py-2 border rounded text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                } ${
                  !isVariantAvailable(size, selectedColor)
                    ? 'opacity-50 cursor-not-allowed line-through'
                    : ''
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSizeGuide(true)}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 cursor-pointer"
          >
            Size Guide
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <i className="ri-subtract-line"></i>
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <i className="ri-add-line"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 py-3 px-6 rounded font-medium transition-all whitespace-nowrap ${
              addedToCart
                ? 'bg-green-600 text-white'
                : !product.inStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
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
            className={`w-12 h-12 flex items-center justify-center border rounded transition-all ${
              isFavorited
                ? 'border-yellow-500 bg-yellow-50 text-yellow-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <i className={`${isFavorited ? 'ri-star-fill' : 'ri-star-line'} text-xl`}></i>
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className={`w-full py-3 px-6 rounded font-medium transition-all whitespace-nowrap ${
            !product.inStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Buy Now
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex items-center space-x-2">
          <i className="ri-shield-check-line text-green-500"></i>
          <span className="text-sm text-gray-700">100% Authentic Products</span>
        </div>
        <div className="flex items-center space-x-2">
          <i className="ri-refresh-line text-blue-500"></i>
          <span className="text-sm text-gray-700">30-Day Return Policy</span>
        </div>
        <div className="flex items-center space-x-2">
          <i className="ri-truck-line text-purple-500"></i>
          <span className="text-sm text-gray-700">
            Free Shipping on Orders Over {formatPrice(getFreeShippingThreshold())}
          </span>
        </div>
      </div>

      <SizeGuide
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        productCategory={getProductCategory()}
      />
    </div>
  );
}
