'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { categoryMapping, getAvailableLanguages, getAvailableCurrencies } from '@/lib/translations';

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
      { name: 'Kobiety -50%', nameEn: 'Women -50%', nameIt: 'Donne -50%', href: '/sale/women' },
      { name: 'Mężczyźni -50%', nameEn: 'Men -50%', nameIt: 'Uomini -50%', href: '/sale/men' },
      { name: 'Akcesoria -30%', nameEn: 'Accessories -30%', nameIt: 'Accessori -30%', href: '/sale/accessories' },
      { name: 'Ostatnie sztuki', nameEn: 'Last Pieces', nameIt: 'Ultimi Pezzi', href: '/sale/last-pieces' },
      { name: 'Wyprzedaż końcowa', nameEn: 'Final Sale', nameIt: 'Saldo Finale', href: '/sale/final' }
    ]
  }
];

// Optimized Link component with prefetching
const OptimizedLink = ({ href, children, className, onClick, onMouseEnter }: any) => (
  <Link
    href={href}
    className={className}
    onClick={onClick}
    onMouseEnter={() => {
      // Prefetch on hover for better performance
      if (onMouseEnter) onMouseEnter();
    }}
    prefetch={true}
  >
    {children}
  </Link>
);

// Debounced search hook
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Route prefetching utility
const usePrefetch = () => {
  const router = useRouter();
  const prefetchedRoutes = useRef(new Set<string>());

  const prefetchRoute = useCallback((href: string) => {
    if (prefetchedRoutes.current.has(href)) return;
    
    prefetchedRoutes.current.add(href);
    router.prefetch(href);
  }, [router]);

  return { prefetchRoute };
};

export default function Header() {
  const router = useRouter();
  const { t, language, changeLanguage, isHydrated } = useTranslation();
  const { currency, changeCurrency, format, isMounted } = useCurrency();
  const { prefetchRoute } = usePrefetch();

  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isHeaderMounted, setIsHeaderMounted] = useState(false);

  // Mega menu state
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [megaMenuTimeout, setMegaMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Other dropdowns state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // Mobile user panel state
  const [isMobileUserPanelOpen, setIsMobileUserPanelOpen] = useState(false);

  // Refs for dropdowns
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Memoized computed values for performance
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const favoriteCount = useMemo(() => favoriteItems.length, [favoriteItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  // Get localized mega menu categories
  const localizedMegaMenuCategories = useMemo(() => {
    return megaMenuCategories.map(category => ({
      ...category,
      title: language === 'pl' ? category.title : language === 'en' ? category.titleEn : category.titleIt,
      subcategories: category.subcategories.map(sub => ({
        ...sub,
        name: language === 'pl' ? sub.name : language === 'en' ? sub.nameEn : sub.nameIt
      }))
    }));
  }, [language]);

  // Theme styles based on dark mode
  const themeStyles = useMemo(() => ({
    bg: isDarkMode ? 'bg-gray-900' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textTertiary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    dropdown: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  }), [isDarkMode]);

  // Mega menu handlers
  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeout) {
      clearTimeout(megaMenuTimeout);
      setMegaMenuTimeout(null);
    }
    setIsMegaMenuOpen(true);
  }, [megaMenuTimeout]);

  const handleMegaMenuLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150); // Small delay to prevent flicker
    setMegaMenuTimeout(timeout);
  }, []);

  // Initialize theme and mount state
  useEffect(() => {
    setIsHeaderMounted(true);

    const initializeTheme = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      
      try {
        const savedTheme = localStorage.getItem('flame-theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;

        const html = document.documentElement;
        if (initialTheme === 'dark') {
          html.classList.add('dark');
          html.setAttribute('data-theme', 'dark');
          setIsDarkMode(true);
        } else {
          html.classList.remove('dark');
          html.setAttribute('data-theme', 'light');
          setIsDarkMode(false);
        }
      } catch (error) {
        console.error('Theme initialization error:', error);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(initializeTheme);
    } else {
      setTimeout(initializeTheme, 0);
    }

    // Load user session
    try {
      const session = localStorage.getItem('flame-user-session');
      if (session) {
        const parsedSession = JSON.parse(session);
        if (new Date(parsedSession.expiresAt) > new Date()) {
          setUserSession(parsedSession);
        } else {
          localStorage.removeItem('flame-user-session');
        }
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    }

    // Load cart and favorites
    try {
      const savedCart = localStorage.getItem('flame-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

      const savedFavorites = localStorage.getItem('flame-favorites');
      if (savedFavorites) {
        setFavoriteItems(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading cart/favorites:', error);
    }

    return () => {
      setIsHeaderMounted(false);
      if (megaMenuTimeout) {
        clearTimeout(megaMenuTimeout);
      }
    };
  }, [megaMenuTimeout]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const html = document.documentElement;
    const newTheme = isDarkMode ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      setIsDarkMode(true);
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      setIsDarkMode(false);
    }

    try {
      localStorage.setItem('flame-theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [isDarkMode]);

  // Search handlers
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  // Cart handlers
  const handleRemoveFromCart = useCallback((productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    try {
      localStorage.setItem('flame-cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }, [cartItems]);

  // Favorites handlers
  const handleRemoveFromFavorites = useCallback((productId: string) => {
    const updatedFavorites = favoriteItems.filter(item => item.id !== productId);
    setFavoriteItems(updatedFavorites);
    try {
      localStorage.setItem('flame-favorites', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new CustomEvent('favoriteUpdated'));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  }, [favoriteItems]);

  if (!isHeaderMounted) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex space-x-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${themeStyles.bg} ${themeStyles.border} border-b sticky top-0 z-50 transition-all duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mega Menu Trigger */}
          <div className="flex items-center space-x-4">
            <div
              ref={logoRef}
              className="relative flex items-center space-x-3"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              {/* Cube Icon (3x3 grid) */}
              <div className={`w-8 h-8 grid grid-cols-3 gap-0.5 cursor-pointer ${themeStyles.textSecondary} hover:${themeStyles.text} transition-colors`}>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 ${isDarkMode ? 'bg-gray-400 hover:bg-white' : 'bg-gray-600 hover:bg-gray-900'} transition-colors`}
                  ></div>
                ))}
              </div>

              {/* Flame Logo */}
              <OptimizedLink href="/" className={`text-2xl font-bold ${themeStyles.text} hover:opacity-80 transition-opacity`}>
                <span style={{ fontFamily: 'Pacifico, serif' }}>FLAME</span>
              </OptimizedLink>
            </div>

            {/* Mega Menu */}
            {isMegaMenuOpen && (
              <div
                ref={megaMenuRef}
                className={`absolute top-full left-0 right-0 ${themeStyles.dropdown} shadow-2xl border-t-4 border-blue-500 z-50`}
                style={{ 
                  marginTop: '0px',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)'
                }}
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              >
                <div className="max-w-7xl mx-auto p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {localizedMegaMenuCategories.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <OptimizedLink
                          href={category.href}
                          className={`block font-bold text-lg ${themeStyles.text} hover:text-blue-500 border-b ${themeStyles.border} pb-2 transition-colors`}
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          {category.title}
                        </OptimizedLink>
                        <ul className="space-y-3">
                          {category.subcategories.map((subcategory, index) => (
                            <li key={index}>
                              <OptimizedLink
                                href={subcategory.href}
                                className={`block py-1 transition-all duration-200 hover:translate-x-2 transform hover:font-medium ${themeStyles.textSecondary} hover:${themeStyles.text} hover:text-blue-500`}
                                onClick={() => setIsMegaMenuOpen(false)}
                              >
                                {subcategory.name}
                              </OptimizedLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`}
                aria-label="Search"
              >
                <i className="ri-search-line text-xl"></i>
              </button>

              {isSearchOpen && (
                <div className={`absolute top-full right-0 mt-2 w-80 ${themeStyles.dropdown} rounded-lg shadow-lg border z-50`}>
                  <form onSubmit={handleSearchSubmit} className="p-4">
                    <div className="flex">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchPlaceholder') || 'Search products...'}
                        className={`flex-1 px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                      >
                        <i className="ri-search-line"></i>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`}
              aria-label="Toggle theme"
            >
              <i className={`${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'} text-xl`}></i>
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`}
                aria-label="Language"
              >
                <i className="ri-global-line text-xl"></i>
              </button>

              {isLanguageOpen && (
                <div className={`absolute top-full right-0 mt-2 w-40 ${themeStyles.dropdown} rounded-lg shadow-lg border z-50`}>
                  <div className="py-2">
                    {getAvailableLanguages().map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 transition-colors ${
                          language === lang.code 
                            ? `${themeStyles.text} bg-blue-50 dark:bg-blue-900/20` 
                            : `${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`
                        }`}
                      >
                        {lang.flag} {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Currency Switcher */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`}
                aria-label="Currency"
              >
                <i className="ri-money-dollar-circle-line text-xl"></i>
              </button>

              {isCurrencyOpen && (
                <div className={`absolute top-full right-0 mt-2 w-32 ${themeStyles.dropdown} rounded-lg shadow-lg border z-50`}>
                  <div className="py-2">
                    {getAvailableCurrencies().map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          changeCurrency(curr.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 transition-colors ${
                          currency === curr.code 
                            ? `${themeStyles.text} bg-blue-50 dark:bg-blue-900/20` 
                            : `${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`
                        }`}
                      >
                        {curr.code} {curr.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Favorites */}
            <div className="relative" ref={favoritesRef}>
              <button
                onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`}
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
                <div className={`absolute top-full right-0 mt-2 w-80 ${themeStyles.dropdown} rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto`}>
                  <div className="p-4">
                    <h3 className={`font-medium ${themeStyles.text} mb-3`}>Ulubione ({favoriteCount})</h3>
                    {favoriteItems.length === 0 ? (
                      <p className={`${themeStyles.textSecondary} text-sm text-center py-4`}>
                        Brak ulubionych produktów
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {favoriteItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className={`${themeStyles.text} text-sm font-medium`}>{item.name}</h4>
                              <p className={`${themeStyles.textSecondary} text-xs`}>
                                {isMounted ? format(item.price) : `${item.price} ${currency}`}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFromFavorites(item.id)}
                              className={`${themeStyles.textSecondary} hover:text-red-500 transition-colors`}
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                        {favoriteItems.length > 3 && (
                          <p className={`${themeStyles.textSecondary} text-xs text-center`}>
                            i {favoriteItems.length - 3} więcej...
                          </p>
                        )}
                        <div className="pt-3 border-t">
                          <OptimizedLink
                            href="/favorites"
                            className="block w-full text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            onClick={() => setIsFavoritesOpen(false)}
                          >
                            Zobacz wszystkie
                          </OptimizedLink>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`}
                aria-label="Cart"
              >
                <i className="ri-shopping-cart-line text-xl"></i>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {isCartOpen && (
                <div className={`absolute top-full right-0 mt-2 w-80 ${themeStyles.dropdown} rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto`}>
                  <div className="p-4">
                    <h3 className={`font-medium ${themeStyles.text} mb-3`}>Koszyk ({cartItemCount})</h3>
                    {cartItems.length === 0 ? (
                      <p className={`${themeStyles.textSecondary} text-sm text-center py-4`}>
                        Koszyk jest pusty
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {cartItems.slice(0, 3).map((item) => (
                          <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className={`${themeStyles.text} text-sm font-medium`}>{item.name}</h4>
                              <p className={`${themeStyles.textSecondary} text-xs`}>
                                {item.size && `Rozmiar: ${item.size}`} {item.color && `Kolor: ${item.color}`}
                              </p>
                              <p className={`${themeStyles.textSecondary} text-xs`}>
                                {item.quantity} x {isMounted ? format(item.price) : `${item.price} ${currency}`}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className={`${themeStyles.textSecondary} hover:text-red-500 transition-colors`}
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                        {cartItems.length > 3 && (
                          <p className={`${themeStyles.textSecondary} text-xs text-center`}>
                            i {cartItems.length - 3} więcej produktów...
                          </p>
                        )}
                        <div className="pt-3 border-t space-y-2">
                          <div className={`flex justify-between ${themeStyles.text} font-medium`}>
                            <span>Suma:</span>
                            <span>{isMounted ? format(cartSubtotal) : `${cartSubtotal.toFixed(2)} ${currency}`}</span>
                          </div>
                          <OptimizedLink
                            href="/cart"
                            className="block w-full text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Zobacz koszyk
                          </OptimizedLink>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <UserDropdown />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text}`}
            >
              <i className="ri-search-line text-xl"></i>
            </button>

            {/* User Icon - Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileUserPanelOpen(!isMobileUserPanelOpen)}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text}`}
            >
              <i className="ri-user-line text-xl"></i>
              {(cartItemCount > 0 || favoriteCount > 0) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount + favoriteCount}
                </span>
              )}
            </button>

            {/* Mobile User Panel */}
            {isMobileUserPanelOpen && (
              <div className={`absolute top-full right-0 mt-2 w-72 ${themeStyles.dropdown} rounded-lg shadow-lg border z-50`}>
                <div className="p-4 space-y-4">
                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMobileUserPanelOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 py-2 px-3 rounded transition-colors ${themeStyles.hover}`}
                  >
                    <i className={`${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'} text-xl ${themeStyles.textSecondary}`}></i>
                    <span className={themeStyles.text}>
                      {isDarkMode ? 'Tryb jasny' : 'Tryb ciemny'}
                    </span>
                  </button>

                  {/* Language */}
                  <div className="space-y-2">
                    <p className={`${themeStyles.textSecondary} text-sm font-medium`}>Język</p>
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailableLanguages().map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setIsMobileUserPanelOpen(false);
                          }}
                          className={`py-2 px-3 text-sm rounded transition-colors ${
                            language === lang.code 
                              ? 'bg-blue-600 text-white' 
                              : `${themeStyles.textSecondary} ${themeStyles.hover}`
                          }`}
                        >
                          {lang.flag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <p className={`${themeStyles.textSecondary} text-sm font-medium`}>Waluta</p>
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailableCurrencies().map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            changeCurrency(curr.code);
                            setIsMobileUserPanelOpen(false);
                          }}
                          className={`py-2 px-3 text-sm rounded transition-colors ${
                            currency === curr.code 
                              ? 'bg-blue-600 text-white' 
                              : `${themeStyles.textSecondary} ${themeStyles.hover}`
                          }`}
                        >
                          {curr.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2 pt-2 border-t">
                    <OptimizedLink
                      href="/favorites"
                      className={`flex items-center justify-between py-2 px-3 rounded transition-colors ${themeStyles.hover}`}
                      onClick={() => setIsMobileUserPanelOpen(false)}
                    >
                      <span className={`${themeStyles.text} flex items-center space-x-3`}>
                        <i className="ri-heart-line text-xl"></i>
                        <span>Ulubione</span>
                      </span>
                      {favoriteCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {favoriteCount}
                        </span>
                      )}
                    </OptimizedLink>

                    <OptimizedLink
                      href="/cart"
                      className={`flex items-center justify-between py-2 px-3 rounded transition-colors ${themeStyles.hover}`}
                      onClick={() => setIsMobileUserPanelOpen(false)}
                    >
                      <span className={`${themeStyles.text} flex items-center space-x-3`}>
                        <i className="ri-shopping-cart-line text-xl"></i>
                        <span>Koszyk</span>
                      </span>
                      {cartItemCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {cartItemCount}
                        </span>
                      )}
                    </OptimizedLink>

                    <OptimizedLink
                      href="/login"
                      className={`flex items-center space-x-3 py-2 px-3 rounded transition-colors ${themeStyles.hover}`}
                      onClick={() => setIsMobileUserPanelOpen(false)}
                    >
                      <i className={`ri-login-box-line text-xl ${themeStyles.textSecondary}`}></i>
                      <span className={themeStyles.text}>
                        {userSession ? 'Profil' : 'Zaloguj się'}
                      </span>
                    </OptimizedLink>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder') || 'Szukaj produktów...'}
                  className={`flex-1 px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="ri-search-line"></i>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}