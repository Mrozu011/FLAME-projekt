'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { categoryMapping, getAvailableLanguages, getAvailableCurrencies } from '@/lib/translations';
import Image from 'next/image';

// Dynamic imports for performance with optimized loading
const UserDropdown = dynamic(() => import('./UserDropdown'), { 
  ssr: false,
  loading: () => <div className="w-10 h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
});

// Interfaces
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

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Mega Menu Categories with hierarchical structure
const megaMenuCategories = [
  {
    id: 'women',
    title: 'Kobiety',
    titleEn: 'Women',
    titleIt: 'Donne',
    href: '/women',
    subcategories: [
      { name: 'Sukienki', nameEn: 'Dresses', nameIt: 'Vestiti', href: '/women/dresses' },
      { name: 'Bluzki', nameEn: 'Blouses', nameIt: 'Camicette', href: '/women/blouses' },
      { name: 'Spodnie', nameEn: 'Pants', nameIt: 'Pantaloni', href: '/women/pants' },
      { name: 'Spódnice', nameEn: 'Skirts', nameIt: 'Gonne', href: '/women/skirts' },
      { name: 'Kurtki', nameEn: 'Jackets', nameIt: 'Giacche', href: '/women/jackets' },
      { name: 'Obuwie', nameEn: 'Shoes', nameIt: 'Scarpe', href: '/women/shoes' }
    ]
  },
  {
    id: 'men',
    title: 'Mężczyźni',
    titleEn: 'Men',
    titleIt: 'Uomini',
    href: '/men',
    subcategories: [
      { name: 'Koszule', nameEn: 'Shirts', nameIt: 'Camicie', href: '/men/shirts' },
      { name: 'T-shirty', nameEn: 'T-Shirts', nameIt: 'Magliette', href: '/men/t-shirts' },
      { name: 'Spodnie', nameEn: 'Pants', nameIt: 'Pantaloni', href: '/men/pants' },
      { name: 'Kurtki', nameEn: 'Jackets', nameIt: 'Giacche', href: '/men/jackets' },
      { name: 'Garnitury', nameEn: 'Suits', nameIt: 'Completi', href: '/men/suits' },
      { name: 'Obuwie', nameEn: 'Shoes', nameIt: 'Scarpe', href: '/men/shoes' }
    ]
  },
  {
    id: 'accessories',
    title: 'Akcesoria',
    titleEn: 'Accessories',
    titleIt: 'Accessori',
    href: '/accessories',
    subcategories: [
      { name: 'Torebki', nameEn: 'Handbags', nameIt: 'Borse', href: '/accessories/handbags' },
      { name: 'Szaliki', nameEn: 'Scarves', nameIt: 'Sciarpe', href: '/accessories/scarves' },
      { name: 'Zegarki', nameEn: 'Watches', nameIt: 'Orologi', href: '/accessories/watches' },
      { name: 'Biżuteria', nameEn: 'Jewelry', nameIt: 'Gioielli', href: '/accessories/jewelry' },
      { name: 'Okulary', nameEn: 'Glasses', nameIt: 'Occhiali', href: '/accessories/glasses' },
      { name: 'Paski', nameEn: 'Belts', nameIt: 'Cinture', href: '/accessories/belts' }
    ]
  },
  {
    id: 'sale',
    title: 'Wyprzedaż',
    titleEn: 'Sale',
    titleIt: 'Saldi',
    href: '/sale',
    subcategories: [
      { name: 'Kobiety', nameEn: 'Women', nameIt: 'Donne', href: '/sale/women' },
      { name: 'Mężczyźni', nameEn: 'Men', nameIt: 'Uomini', href: '/sale/men' },
      { name: 'Akcesoria', nameEn: 'Accessories', nameIt: 'Accessori', href: '/sale/accessories' },
      { name: 'Wyprzedaż końcowa', nameEn: 'Final Sale', nameIt: 'Saldi finali', href: '/sale/final' }
    ]
  }
];

export default function Header() {
  const router = useRouter();
  const { t, language, changeLanguage } = useTranslation();
  const { currency, changeCurrency, format } = useCurrency();
  
  // State management
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileUserPanelOpen, setIsMobileUserPanelOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Refs
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    
    // Apply theme immediately
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Load user session
    const savedSession = localStorage.getItem('flame-user-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (new Date(session.expiresAt) > new Date()) {
          setUserSession(session);
        } else {
          localStorage.removeItem('flame-user-session');
        }
      } catch (error) {
        console.error('Error loading user session:', error);
      }
    }
    
    // Load cart items
    const savedCart = localStorage.getItem('flame-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem('flame-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Localized mega menu categories
  const localizedMegaMenuCategories = useMemo(() => {
    return megaMenuCategories.map(category => ({
      ...category,
      displayTitle: language === 'en' ? category.titleEn : language === 'it' ? category.titleIt : category.title,
      subcategories: category.subcategories.map(sub => ({
        ...sub,
        displayName: language === 'en' ? sub.nameEn : language === 'it' ? sub.nameIt : sub.name
      }))
    }));
  }, [language]);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  }, [isDarkMode]);

  // Search functionality
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  }, [searchTerm, router]);

  // Mega menu handlers
  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setIsMegaMenuOpen(true);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 100);
  }, []);

  // Cart functions
  const removeFromCart = useCallback((itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('flame-cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }, [cartItems]);

  // Favorites functions
  const removeFromFavorites = useCallback((itemId: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== itemId);
    setFavorites(updatedFavorites);
    localStorage.setItem('flame-favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new CustomEvent('favoriteUpdated'));
  }, [favorites]);

  // Calculate totals
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favoriteCount = favorites.length;
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Available languages and currencies
  const availableLanguages = getAvailableLanguages();
  const availableCurrencies = getAvailableCurrencies();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container-view">
        {/* Main Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Left Side - Logo & Menu */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                FLAME
              </div>
            </Link>
            
            {/* 3x3 Cube Menu Icon */}
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
              aria-label="Menu"
            >
              <div className="grid grid-cols-3 gap-1 w-6 h-6">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 h-1.5 bg-current rounded-sm"
                  />
                ))}
              </div>
            </button>
          </div>

          {/* Right Side - Utility Icons */}
          <div className="flex items-center space-x-1">
            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <i className="ri-search-line text-xl"></i>
                </button>
                
                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <form onSubmit={handleSearchSubmit}>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('search.placeholder')}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                    </form>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <i className={isDarkMode ? 'ri-sun-line text-xl' : 'ri-moon-line text-xl'}></i>
              </button>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Language"
                >
                  <i className="ri-global-line text-xl"></i>
                </button>
                
                {isLanguageOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          language === lang.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        <span className="mr-3 text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Currency"
                >
                  <span className="text-sm font-medium">{currency}</span>
                </button>
                
                {isCurrencyOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {availableCurrencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          changeCurrency(curr.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          currency === curr.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        <span className="mr-2">{curr.symbol}</span>
                        <span>{curr.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Favorites */}
              <div className="relative">
                <button
                  onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative"
                  aria-label="Favorites"
                >
                  <i className="ri-heart-line text-xl"></i>
                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </button>
                
                {isFavoritesOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {t('favorites.title')}
                    </h3>
                    {favorites.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        {t('favorites.empty')}
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {favorites.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {format(item.price)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromFavorites(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                        {favorites.length > 3 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{favorites.length - 3} więcej
                          </p>
                        )}
                        <Link
                          href="/favorites"
                          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          onClick={() => setIsFavoritesOpen(false)}
                        >
                          Zobacz wszystkie
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative"
                  aria-label="Cart"
                >
                  <i className="ri-shopping-bag-line text-xl"></i>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                
                {isCartOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {t('cart.title')}
                    </h3>
                    {cartItems.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        {t('cart.empty')}
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {cartItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.size && `Rozmiar: ${item.size}`}
                                {item.color && `, Kolor: ${item.color}`}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.quantity}x {format(item.price)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                        {cartItems.length > 3 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{cartItems.length - 3} więcej
                          </p>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">Razem:</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {format(cartTotal)}
                            </span>
                          </div>
                          <Link
                            href="/cart"
                            className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Zobacz koszyk
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User */}
              <UserDropdown />
            </div>

            {/* Mobile Search Icon */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Search"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
            </div>

            {/* Mobile User Panel Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileUserPanelOpen(!isMobileUserPanelOpen)}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative"
                aria-label="User menu"
              >
                <i className="ri-user-line text-xl"></i>
                {(cartItemCount > 0 || favoriteCount > 0) && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 w-2 h-2 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile User Panel */}
        {isMobileUserPanelOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="px-4 py-4 space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                >
                  <i className={isDarkMode ? 'ri-sun-line' : 'ri-moon-line'}></i>
                  <span className="text-sm">{isDarkMode ? 'Jasny' : 'Ciemny'}</span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm w-full"
                  >
                    <i className="ri-global-line"></i>
                    <span className="text-sm">{language.toUpperCase()}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <button
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm w-full"
                  >
                    <span className="text-sm font-medium">{currency}</span>
                  </button>
                </div>

                <Link
                  href="/favorites"
                  className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm relative"
                  onClick={() => setIsMobileUserPanelOpen(false)}
                >
                  <i className="ri-heart-line"></i>
                  <span className="text-sm">Ulubione</span>
                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </Link>
              </div>

              <Link
                href="/cart"
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                onClick={() => setIsMobileUserPanelOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-shopping-bag-line"></i>
                  <span className="text-sm">Koszyk</span>
                </div>
                <div className="flex items-center space-x-2">
                  {cartItemCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="text-sm font-medium">{format(cartTotal)}</span>
                </div>
              </Link>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                {userSession ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Zalogowany jako {userSession.user.name}
                    </p>
                    <Link
                      href="/profile"
                      className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                      onClick={() => setIsMobileUserPanelOpen(false)}
                    >
                      Mój profil
                    </Link>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link
                      href="/login"
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      onClick={() => setIsMobileUserPanelOpen(false)}
                    >
                      Zaloguj
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 border border-blue-600 text-blue-600 dark:text-blue-400 text-center py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                      onClick={() => setIsMobileUserPanelOpen(false)}
                    >
                      Rejestracja
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mega Menu */}
        {isMegaMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700 z-40"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="container-view py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {localizedMegaMenuCategories.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <Link
                      href={category.href}
                      className="block text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      {category.displayTitle}
                    </Link>
                    <ul className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            onClick={() => setIsMegaMenuOpen(false)}
                          >
                            {sub.displayName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Language Dropdown for Mobile */}
        {isLanguageOpen && (
          <div className="lg:hidden absolute right-4 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsLanguageOpen(false);
                  setIsMobileUserPanelOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  language === lang.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Currency Dropdown for Mobile */}
        {isCurrencyOpen && (
          <div className="lg:hidden absolute right-4 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {availableCurrencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  changeCurrency(curr.code);
                  setIsCurrencyOpen(false);
                  setIsMobileUserPanelOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currency === curr.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="mr-2">{curr.symbol}</span>
                <span>{curr.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}