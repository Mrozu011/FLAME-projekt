'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { categoryMapping, getAvailableLanguages, getAvailableCurrencies } from '@/lib/translations';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        (document.querySelector('[aria-label="Search"]') as HTMLButtonElement | null)?.focus?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

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
    }, 120);
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
    <header className="header relative">
      {/* Top Bar */}
      <div className="top-bar hidden md:block">
        <div className="top-bar-container">
          <div className="flex items-center gap-6 text-xs">
            <Link href="/faq" className="hover:underline">
              {language === 'pl' ? 'Pomoc' : language === 'it' ? 'Aiuto' : 'Help'}
            </Link>
            <Link href="/about" className="hover:underline">
              {language === 'pl' ? 'O nas' : language === 'it' ? 'Chi siamo' : 'About'}
            </Link>
            <Link href="/contact" className="hover:underline">
              {language === 'pl' ? 'Kontakt' : language === 'it' ? 'Contatto' : 'Contact'}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900"
              aria-label="Language"
            >
              <i className="ri-global-line" />
              <span className="uppercase">{language}</span>
              <i className="ri-arrow-down-s-line" />
            </button>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900"
              aria-label="Currency"
            >
              <span className="font-medium">{currency}</span>
              <i className="ri-arrow-down-s-line" />
            </button>
          </div>
        </div>
      </div>

      <div className="header-container" style={{minHeight: 'var(--header-height)'}}>
        {/* Left Side - Logo & Menu Cube */}
        <div className="header-left">
          {/* Logo */}
          <Link href="/" className="logo" onMouseEnter={handleMegaMenuEnter} onMouseLeave={handleMegaMenuLeave} onFocus={handleMegaMenuEnter} onBlur={(e) => {
            if (!megaMenuRef.current?.contains(e.relatedTarget as Node)) {
              handleMegaMenuLeave();
            }
          }} aria-haspopup="true" aria-expanded={isMegaMenuOpen} aria-controls="mega-menu-panel">
            FLAME
          </Link>
          
          {/* 3x3 Cube Menu Toggle */}
          <button
            className="menu-toggle"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            onFocus={handleMegaMenuEnter}
            onBlur={(e) => {
              if (!megaMenuRef.current?.contains(e.relatedTarget as Node)) {
                handleMegaMenuLeave();
              }
            }}
            aria-label="Menu"
            aria-haspopup="true"
            aria-expanded={isMegaMenuOpen}
            aria-controls="mega-menu-panel"
          >
            <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 h-1 bg-current rounded-sm"
                />
              ))}
            </div>
          </button>
        </div>

        {/* Right Side - Utility Icons */}
        <div className="header-right">
          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Search with hover-to-reveal */}
            <div className="relative" ref={searchWrapperRef} onMouseEnter={() => setIsSearchOpen(true)} onMouseLeave={() => setIsSearchOpen(false)}>
              <button
                className="header-icon focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Search"
                aria-expanded={isSearchOpen}
                aria-controls="desktop-search"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={(e) => {
                  // Close only if focus leaves the search wrapper entirely
                  if (!searchWrapperRef.current?.contains(e.relatedTarget as Node)) {
                    setIsSearchOpen(false);
                  }
                }}
              >
                <i className="ri-search-line text-lg"></i>
              </button>
              <div className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 origin-right overflow-hidden ${isSearchOpen ? 'opacity-100 w-64' : 'opacity-0 w-0'} transition-all duration-200`}> 
                <form onSubmit={handleSearchSubmit} className="flex items-center" id="desktop-search">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className={`w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white`}
                    onFocus={() => setIsSearchOpen(true)}
                    aria-label="Szukaj"
                  />
                </form>
              </div>
            </div>

            {/* Cart (between search and user) */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="header-icon"
                aria-label="Cart"
              >
                <i className="ri-shopping-bag-line text-lg"></i>
                {cartItemCount > 0 && (
                  <span className="badge">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {isCartOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 slide-up">
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
                          className="btn btn-primary w-full text-center"
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

            {/* Theme Toggle (kept accessible) */}
            <button
              onClick={toggleTheme}
              className="header-icon"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <i className={isDarkMode ? 'ri-sun-line text-lg' : 'ri-moon-line text-lg'}></i>
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="header-icon"
              aria-label="Search"
            >
              <i className="ri-search-line text-lg"></i>
            </button>

            {/* Mobile User Panel Toggle */}
            <button
              onClick={() => setIsMobileUserPanelOpen(!isMobileUserPanelOpen)}
              className="header-icon"
              aria-label="User menu"
            >
              <i className="ri-user-line text-lg"></i>
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
                    className="btn btn-primary flex-1 text-center"
                    onClick={() => setIsMobileUserPanelOpen(false)}
                  >
                    Zaloguj
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-outline flex-1 text-center"
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
      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div
            id="mega-menu-panel"
            ref={megaMenuRef}
            role="menu"
            aria-label="Główne kategorie"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            onBlur={(e) => {
              if (!megaMenuRef.current?.contains(e.relatedTarget as Node)) {
                handleMegaMenuLeave();
              }
            }}
          >
            <div className="max-w-6xl w-[90vw] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 px-6 lg:px-8 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {localizedMegaMenuCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <Link
                      href={category.href}
                      className="block text-base font-semibold text-gray-900 dark:text-white hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:underline"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      {category.displayTitle}
                    </Link>
                    <ul className="space-y-1.5">
                      {category.subcategories.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:underline"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Dropdown for Mobile */}
      {isLanguageOpen && (
        <div className="lg:hidden absolute right-4 top-full mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 slide-up">
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
        <div className="lg:hidden absolute right-4 top-full mt-2 w-32 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 slide-up">
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
    </header>
  );
}