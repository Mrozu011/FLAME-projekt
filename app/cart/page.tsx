
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { discountEngine } from '@/lib/discount-engine';
import RecommendationSection from '@/components/RecommendationSection';
import { recommendationEngine } from '@/lib/recommendation-engine';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  category: string;
}

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  freeShippingThreshold: number;
  name: string;
}

interface ShippingRegion {
  code: string;
  name: string;
  currency: string;
  shippingCost: number;
  deliveryDays: string;
}

interface DiscountApplication {
  ruleId: string;
  ruleName: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bundle';
  discountAmount: number;
  message: string;
  appliedToItems?: string[];
  originalTotal?: number;
  newTotal?: number;
}

interface DiscountResult {
  appliedDiscounts: DiscountApplication[];
  subtotal: number;
  discountTotal: number;
  finalTotal: number;
  freeShipping: boolean;
  messages: string[];
  almostQualified: {
    ruleId: string;
    message: string;
    requirement: string;
  }[];
}

export default function CartPage() {
  const { t } = useTranslation();
  const { currency, format, convertAmount } = useCurrency();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentRegion, setCurrentRegion] = useState('US');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percentage: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discountResults, setDiscountResults] = useState<DiscountResult | null>(null);
  const [showDiscountDetails, setShowDiscountDetails] = useState(false);

  const currencies: Record<string, Currency> = {
    USD: { code: 'USD', symbol: '$', rate: 1, freeShippingThreshold: 50, name: 'US Dollar' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.85, freeShippingThreshold: 50, name: 'Euro' },
    PLN: { code: 'PLN', symbol: 'zł', rate: 4.40, freeShippingThreshold: 250, name: 'Polish Złoty' },
    JPY: { code: 'JPY', symbol: '¥', rate: 110, freeShippingThreshold: 5000, name: 'Japanese Yen' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.73, freeShippingThreshold: 50, name: 'British Pound' }
  };

  const shippingRegions: Record<string, ShippingRegion> = {
    US: { code: 'US', name: 'United States', currency: 'USD', shippingCost: 9.99, deliveryDays: '3-5 business days' },
    EU: { code: 'EU', name: 'European Union', currency: 'EUR', shippingCost: 8.50, deliveryDays: '5-7 business days' },
    PL: { code: 'PL', name: 'Poland', currency: 'PLN', shippingCost: 19.99, deliveryDays: '2-4 business days' },
    JP: { code: 'JP', name: 'Japan', currency: 'JPY', shippingCost: 1200, deliveryDays: '7-10 business days' },
    GB: { code: 'GB', name: 'United Kingdom', currency: 'GBP', shippingCost: 7.99, deliveryDays: '4-6 business days' }
  };

  const validPromoCodes = [
    { code: 'SAVE5', percentage: 5 },
    { code: 'SAVE10', percentage: 10 },
    { code: 'WELCOME5', percentage: 5 },
    { code: 'FIRST10', percentage: 10 },
    { code: 'DISCOUNT5', percentage: 5 }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('flame-cart');
    const savedRegion = localStorage.getItem('flame-region');

    const detectUserRegion = () => {
      try {
        const userLocale = navigator.language || 'en-US';
        const countryCode = userLocale.split('-')[1]?.toUpperCase();

        if (countryCode === 'PL') {
          return 'PL';
        } else if (['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT'].includes(countryCode)) {
          return 'EU';
        } else if (countryCode === 'JP') {
          return 'JP';
        } else if (countryCode === 'GB') {
          return 'GB';
        }
        return 'US';
      } catch {
        return 'US';
      }
    };

    const defaultRegion = detectUserRegion();
    const regionCode = savedRegion || defaultRegion;

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      const demoItems: CartItem[] = [
        {
          id: '1',
          name: 'Premium Silk Blouse',
          price: 89.99,
          image: 'https://readdy.ai/api/search-image?query=elegant%20silk%20blouse%20white%20premium%20fashion%20women%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=silk-blouse-1&orientation=portrait',
          quantity: 1,
          size: 'M',
          color: 'White',
          category: 'Women'
        },
        {
          id: '2',
          name: 'Designer Leather Jacket',
          price: 299.99,
          image: 'https://readdy.ai/api/search-image?query=black%20leather%20jacket%20premium%20fashion%20designer%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=leather-jacket-2&orientation=portrait',
          quantity: 1,
          size: 'L',
          color: 'Black',
          category: 'Men'
        },
        {
          id: '3',
          name: 'Cashmere Sweater',
          price: 159.99,
          image: 'https://readdy.ai/api/search-image?query=cashmere%20sweater%20beige%20premium%20fashion%20knitwear%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=cashmere-sweater-3&orientation=portrait',
          quantity: 2,
          size: 'S',
          color: 'Beige',
          category: 'Women'
        },
        {
          id: '4',
          name: 'Premium Denim Jeans',
          price: 129.99,
          image: 'https://readdy.ai/api/search-image?query=premium%20denim%20jeans%20dark%20blue%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=denim-jeans-4&orientation=portrait',
          quantity: 1,
          size: '32',
          color: 'Dark Blue',
          category: 'Men'
        }
      ];
      setCartItems(demoItems);
      localStorage.setItem('flame-cart', JSON.stringify(demoItems));
    }

    setCurrentRegion(regionCode);
    setIsLoading(false);

    const userId = localStorage.getItem('user-id') || 'guest';
    recommendationEngine.trackUserBehavior({
      userId,
      productId: 'cart',
      action: 'view',
      timestamp: new Date(),
      context: 'cart'
    });
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const discountCartItems = cartItems.map(item => ({ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: item.quantity, 
        category: (item.category || '').toLowerCase()
      }));

      const results = discountEngine.calculateDiscounts(discountCartItems, 'regular');
      setDiscountResults(results);
    }
  }, [cartItems]);

  const updateCartStorage = (items: CartItem[]) => {
    localStorage.setItem('flame-cart', JSON.stringify(items));
  };

  const handleRegionChange = (regionCode: string) => {
    setCurrentRegion(regionCode);
    localStorage.setItem('flame-region', regionCode);
  };

  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const validCode = validPromoCodes.find(code => code.code.toUpperCase() === promoCode.toUpperCase());

    if (validCode) {
      setAppliedDiscount(validCode);
      setPromoCode('');
    } else {
      alert(t('invalidPromoCode'));
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  const updateQuantity = (itemKey: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item => {
      const currentKey = `${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;
      return currentKey === itemKey ? { ...item, quantity: newQuantity } : item;
    });
    setCartItems(updatedItems);
    updateCartStorage(updatedItems);
  };

  const removeItem = (itemKey: string) => {
    const updatedItems = cartItems.filter(item => {
      const currentKey = `${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;
      return currentKey !== itemKey;
    });
    setCartItems(updatedItems);
    updateCartStorage(updatedItems);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscount = () => {
    let discount = 0;

    if (appliedDiscount) {
      discount += (getSubtotal() * appliedDiscount.percentage) / 100;
    }

    if (discountResults) {
      discount += discountResults.discountTotal;
    }

    return discount;
  };

  const getSubtotalAfterDiscount = () => {
    return getSubtotal() - getDiscount();
  };

  const getShippingCost = () => {
    const subtotalAfterDiscount = getSubtotalAfterDiscount();
    const currencyData = currencies[currency];
    const convertedThreshold = convertAmount(currencyData.freeShippingThreshold, currencyData.code);

    if (discountResults?.freeShipping) {
      return 0;
    }

    if (subtotalAfterDiscount >= convertedThreshold) {
      return 0;
    }

    const region = shippingRegions[currentRegion];
    return convertAmount(region.shippingCost, region.currency);
  };

  const getTax = () => {
    return getSubtotalAfterDiscount() * 0.08;
  };

  const getTotal = () => {
    return getSubtotalAfterDiscount() + getShippingCost() + getTax();
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getFreeShippingThreshold = () => {
    const currencyData = currencies[currency];
    return convertAmount(currencyData.freeShippingThreshold, currencyData.code);
  };

  const getRemainingForFreeShipping = () => {
    const threshold = getFreeShippingThreshold();
    const remaining = threshold - getSubtotalAfterDiscount();
    return Math.max(0, remaining);
  };

  const getEstimatedDeliveryDate = () => {
    const region = shippingRegions[currentRegion];
    const today = new Date();
    const deliveryDate = new Date(today);

    const daysToAdd = region.deliveryDays.includes('3-5') ? 5 :
                      region.deliveryDays.includes('2-4') ? 4 :
                      region.deliveryDays.includes('5-7') ? 7 : 10;

    deliveryDate.setDate(today.getDate() + daysToAdd);
    return deliveryDate.toLocaleDateString(currentRegion === 'PL' ? 'pl-PL' : 'en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-primary transition-theme">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary transition-theme">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-theme-primary mb-2">{t('shoppingCart')}</h1>
          <p className="text-theme-secondary">
            {cartItems.length === 0 ? t('cartEmpty') : `${getItemCount()} ${t('language') === 'pl' ? 'produktów w koszyku' : 'items in your cart'}`}
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <label className="text-sm font-medium text-theme-secondary">{t('shippingRegion')}:</label>
          <select
            value={currentRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="px-3 py-2 input-theme rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            {Object.entries(shippingRegions).map(([code, region]) => (
              <option key={code} value={code}>
                {region.name} ({currencies[region.currency].symbol})
              </option>
            ))}
          </select>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-32 h-32 mx-auto mb-8">
              <img 
                src="https://readdy.ai/api/search-image?query=empty%20shopping%20cart%20illustration%20minimalist%20design%20clean%20simple%20line%20art%20style%20modern%20e-commerce%20website%20empty%20state%20vector%20graphic&width=128&height=128&seq=empty-cart-illustration&orientation=squarish"
                alt="Empty cart illustration"
                className="w-full h-full object-contain opacity-60"
              />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-theme-primary mb-4">{t('cartEmpty')}</h2>
            <p className="text-theme-secondary mb-8 max-w-md mx-auto">{t('cartEmptyDesc')}</p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 btn-primary rounded-lg transition-colors whitespace-nowrap"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <div className="card-theme rounded-lg overflow-hidden">
                <div className="px-4 md:px-6 py-4 bg-theme-secondary border-b border-theme-primary">
                  <h2 className="text-lg font-semibold text-theme-primary">{t('language') === 'pl' ? 'Produkty w koszyku' : 'Cart Items'}</h2>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`} className="p-4 md:p-6 hover-theme-bg transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-20 h-24 md:w-24 md:h-32 object-cover rounded-lg object-top"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                              <h3 className="text-base md:text-lg font-medium text-theme-primary mb-1">{item.name}</h3>
                              <p className="text-sm text-theme-tertiary mb-2">{item.category}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-theme-secondary">
                                {item.size && (
                                  <span>{t('size')}: <span className="font-medium">{item.size}</span></span>
                                )}
                                {item.color && (
                                  <span>{t('color')}: <span className="font-medium">{item.color}</span></span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(`${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`)}
                              className="w-8 h-8 flex items-center justify-center text-theme-tertiary hover:text-red-500 transition-colors"
                            >
                              <i className="ri-close-line text-xl"></i>
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-theme-secondary">{t('quantity')}:</span>
                              <div className="flex items-center border border-theme-secondary rounded-lg">
                                <button
                                  onClick={() => updateQuantity(`${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center text-theme-secondary hover:text-theme-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <i className="ri-subtract-line"></i>
                                </button>
                                <span className="px-3 py-1 text-sm font-medium text-theme-primary min-w-12 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(`${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-theme-secondary hover:text-theme-primary transition-colors"
                                >
                                  <i className="ri-add-line"></i>
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-theme-secondary">{format(item.price)} {t('language') === 'pl' ? 'za sztukę' : 'each'}</p>
                              <p className="text-lg font-semibold text-theme-primary">
                                {format(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 space-y-3 sm:space-y-0">
                <Link 
                  href="/"
                  className="inline-flex items-center px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  {t('continueShopping')}
                </Link>

                <button className="inline-flex items-center px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors">
                  <i className="ri-heart-line mr-2"></i>
                  {t('language') === 'pl' ? 'Zapisz na później' : 'Save for Later'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card-theme rounded-lg p-4 md:p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-theme-primary mb-4">{t('orderSummary')}</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-theme-secondary">{t('subtotal')} ({getItemCount()} {t('language') === 'pl' ? 'produktów' : 'items'})</span>
                    <span className="font-medium text-theme-primary">{format(getSubtotal())}</span>
                  </div>

                  {discountResults && discountResults.appliedDiscounts.length > 0 && (
                    <div className="space-y-2">
                      {discountResults.appliedDiscounts.map((discount, index) => (
                        <div key={index} className="flex justify-between items-center text-green-600 dark:text-green-400">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{discount.ruleName}</span>
                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                              {discount.type === 'percentage' ? `${discount.discountAmount}% OFF` : 
                               discount.type === 'fixed' ? `$${discount.discountAmount} OFF` : 
                               discount.type === 'bundle' ? 'BUNDLE' : 'FREE SHIPPING'}
                            </span>
                          </div>
                          <span className="font-medium">
                            {discount.type === 'free_shipping' ? 'FREE' : `-${format(discount.discountAmount)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {appliedDiscount && (
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{t('discount')} ({appliedDiscount.code})</span>
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                          {appliedDiscount.percentage}% OFF
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">-{format((getSubtotal() * appliedDiscount.percentage) / 100)}</span>
                        <button
                          onClick={removeDiscount}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <i className="ri-close-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-theme-secondary">{t('shipping')}</span>
                    <span className="font-medium text-theme-primary">
                      {getShippingCost() === 0 ? (
                        <span className="text-green-600 dark:text-green-400">{t('language') === 'pl' ? 'DARMOWA' : 'FREE'}</span>
                      ) : (
                        format(getShippingCost())
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-theme-secondary">{t('tax')}</span>
                    <span className="font-medium text-theme-primary">{format(getTax())}</span>
                  </div>

                  <div className="border-t border-theme-primary pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-theme-primary">{t('total')}</span>
                      <span className="text-lg font-semibold text-theme-primary">
                        {format(getTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                {discountResults && discountResults.almostQualified.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {discountResults.almostQualified.map((item, index) => (
                      <div key={index} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                        <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                          <i className="ri-gift-line mr-1"></i>
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-6">
                  <form onSubmit={handlePromoCodeSubmit} className="space-y-3">
                    <label className="block text-sm font-medium text-theme-secondary">{t('promoCode')}</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder={t('enterPromoCode')}
                        className="flex-1 px-3 py-2 input-theme rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 btn-secondary rounded-md transition-colors text-sm whitespace-nowrap"
                      >
                        {t('apply')}
                      </button>
                    </div>
                  </form>

                  {appliedDiscount && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                        <i className="ri-check-line mr-1"></i>
                        {appliedDiscount.percentage}% {t('discountApplied')} "{appliedDiscount.code}"
                      </p>
                    </div>
                  )}

                  {discountResults && (discountResults.appliedDiscounts.length > 0 || discountResults.almostQualified.length > 0) && (
                    <div className="mt-3">
                      <button
                        onClick={() => setShowDiscountDetails(!showDiscountDetails)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                      >
                        <i className={`ri-${showDiscountDetails ? 'arrow-up' : 'arrow-down'}-line mr-1`}></i>
                        {showDiscountDetails ? 'Hide' : 'Show'} discount details
                      </button>
                      
                      {showDiscountDetails && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="text-sm font-medium text-theme-primary mb-2">Active Discount Rules:</h4>
                          {discountResults.appliedDiscounts.map((discount, index) => (
                            <div key={index} className="text-sm text-theme-secondary mb-1">
                              • {discount.message}
                            </div>
                          ))}
                          {discountResults.messages.map((message, index) => (
                            <div key={index} className="text-sm text-green-600 dark:text-green-400 mb-1">
                              • {message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {getShippingCost() > 0 && getRemainingForFreeShipping() > 0 && !discountResults?.freeShipping && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <i className="ri-information-line mr-1"></i>
                      <span className="font-medium">
                        {t('freeShippingThreshold', { amount: format(getRemainingForFreeShipping()) })}
                      </span>
                    </p>
                    <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(((getSubtotalAfterDiscount() / getFreeShippingThreshold()) * 100), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="bg-theme-secondary border border-theme-primary rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-theme-secondary">
                    <i className="ri-truck-line text-theme-tertiary"></i>
                    <span>{t('estimatedDelivery')}: <span className="font-medium">{getEstimatedDeliveryDate()}</span></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-theme-tertiary mt-1">
                    <i className="ri-time-line text-theme-tertiary"></i>
                    <span>{shippingRegions[currentRegion].deliveryDays}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/checkout"
                    className="w-full btn-primary py-3 px-4 rounded-lg transition-colors text-center font-medium block whitespace-nowrap"
                  >
                    {t('checkout')}
                  </Link>

                  <button className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors font-medium whitespace-nowrap">
                    <i className="ri-paypal-line mr-2"></i>
                    PayPal Express
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-theme-primary">
                  <div className="flex items-center justify-center space-x-4 text-sm text-theme-tertiary">
                    <div className="flex items-center">
                      <i className="ri-shield-check-line mr-1"></i>
                      {t('secureCheckout')}
                    </div>
                    <div className="flex items-center">
                      <i className="ri-truck-line mr-1"></i>
                      {t('language') === 'pl' ? 'Darmowe zwroty' : 'Free returns'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <section className="mt-12">
            <RecommendationSection
              title="Complete Your Look"
              userId={localStorage.getItem('user-id') || 'guest'}
              context={{ 
                type: 'cart', 
                cartItems: cartItems.map(item => item.id) 
              }}
              limit={6}
              showReasons={true}
            />
          </section>
        )}

        <section className="mt-12">
          <RecommendationSection
            title="Recently Viewed"
            userId={localStorage.getItem('user-id') || 'guest'}
            context={{ type: 'homepage' }}
            limit={8}
            showReasons={false}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
