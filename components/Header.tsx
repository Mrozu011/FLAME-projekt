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

// Memoized product data function
const getLocalizedProducts = (language: string) => {
  const baseProducts = [
    { id: '1', category: 'Women', subcategory: 'Dresses', tags: ['summer', 'elegant', 'casual'] },
    { id: '2', category: 'Women', subcategory: 'Tops', tags: ['white', 'classic', 'business'] },
    { id: '3', category: 'Men', subcategory: 'Outerwear', tags: ['leather', 'jacket', 'casual'] },
    { id: '4', category: 'Accessories', subcategory: 'Bags', tags: ['handbag', 'luxury', 'designer'] },
    { id: '5', category: 'Men', subcategory: 'Shoes', tags: ['sneakers', 'casual', 'comfortable'] },
    { id: '6', category: 'Accessories', subcategory: 'Scarves', tags: ['silk', 'luxury', 'colorful'] },
    { id: '7', category: 'Men', subcategory: 'Suits', tags: ['formal', 'business', 'elegant'] },
    { id: '8', category: 'Women', subcategory: 'Pants', tags: ['jeans', 'casual', 'denim'] }
  ];

  const productNames: Record<string, Record<string, string>> = {
    en: {
      '1': 'Elegant Summer Dress',
      '2': 'Classic White Blouse',
      '3': 'Leather Jacket',
      '4': 'Designer Handbag',
      '5': 'Casual Sneakers',
      '6': 'Silk Scarf',
      '7': 'Formal Suit',
      '8': 'Casual Jeans'
    },
    de: {
      '1': 'Elegantes Sommerkleid',
      '2': 'Klassische Weiße Bluse',
      '3': 'Lederjacke',
      '4': 'Designer Handtasche',
      '5': 'Lässige Sneakers',
      '6': 'Seidenschal',
      '7': 'Formeller Anzug',
      '8': 'Lässige Jeans'
    },
    fr: {
      '1': 'Robe d\'Été Élégante',
      '2': 'Blouse Blanche Classique',
      '3': 'Veste en Cuir',
      '4': 'Sac à Main de Créateur',
      '5': 'Baskets Décontractées',
      '6': 'Écharpe en Soie',
      '7': 'Costume Formel',
      '8': 'Jean Décontracté'
    },
    pl: {
      '1': 'Elegancka Letnia Sukienka',
      '2': 'Klasyczna Biała Bluzka',
      '3': 'Skórzana Kurtka',
      '4': 'Designerska Torebka',
      '5': 'Casualowe Sneakersy',
      '6': 'Jedwabny Szalik',
      '7': 'Formalny Garnitur',
      '8': 'Casualowe Jeansy'
    },
    it: {
      '1': 'Vestito Estivo Elegante',
      '2': 'Blusa Bianca Classica',
      '3': 'Giacca di Pelle',
      '4': 'Borsa di Design',
      '5': 'Sneakers Casual',
      '6': 'Sciarpa di Seta',
      '7': 'Completo Formale',
      '8': 'Jeans Casual'
    },
    pt: {
      '1': 'Vestido de Verão Elegante',
      '2': 'Blusa Branca Clássica',
      '3': 'Jaqueta de Couro',
      '4': 'Bolsa de Grife',
      '5': 'Tênis Casual',
      '6': 'Lenço de Seda',
      '7': 'Terno Formal',
      '8': 'Jeans Casual'
    }
  };

  return baseProducts.map(product => ({ ...product, name: productNames[language]?.[product.id] || productNames.en[product.id] }));
};

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isHeaderMounted, setIsHeaderMounted] = useState(false);

  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [searchInputVisible, setSearchInputVisible] = useState(false);
  const [hoverTimeouts, setHoverTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Memoized search suggestions with performance optimization
  const searchSuggestions = useMemo(() => {
    if (!isHeaderMounted || !isHydrated || debouncedSearchQuery.length === 0) return [];

    const localizedProducts = getLocalizedProducts(language);
    const categories = categoryMapping[language] || categoryMapping.en;
    const suggestions: string[] = [];

    // Use requestIdleCallback for non-critical processing
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        localizedProducts.forEach(product => {
          if (product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
            suggestions.push(product.name);
          }
        });
      });
    } else {
      localizedProducts.forEach(product => {
        if (product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
          suggestions.push(product.name);
        }
      });
    }

    Object.values(categories).forEach((category: any) => {
      if (category.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
        suggestions.push(category.name);
      }

      (Object.values(category.subcategories) as string[]).forEach((subcategory: string) => {
        if (subcategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
          suggestions.push(subcategory);
        }
      });
    });

    const commonTerms: Record<string, string[]> = {
      en: ['dress', 'shirt', 'shoes', 'bag', 'jacket', 'jeans', 'suit', 'accessories'],
      de: ['kleid', 'hemd', 'schuhe', 'tasche', 'jacke', 'jeans', 'anzug', 'accessoires'],
      fr: ['robe', 'chemise', 'chaussures', 'sac', 'veste', 'jean', 'costume', 'accessoires'],
      pl: ['sukienka', 'koszula', 'buty', 'torba', 'kurtka', 'dżinsy', 'garnitur', 'akcesoria'],
      it: ['vestito', 'camicia', 'scarpe', 'borsa', 'giacca', 'jeans', 'completo', 'accessori'],
      pt: ['vestido', 'camisa', 'sapatos', 'bolsa', 'jaqueta', 'jeans', 'terno', 'acessórios']
    };

    const terms = commonTerms[language] || commonTerms.en;
    terms.forEach(term => {
      if (term.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) && !suggestions.includes(term)) {
        suggestions.push(term.charAt(0).toUpperCase() + term.slice(1));
      }
    });

    return suggestions.slice(0, 5);
  }, [debouncedSearchQuery, language, isHeaderMounted, isHydrated]);

  // Memoized computed values for performance
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const favoriteCount = useMemo(() => favoriteItems.length, [favoriteItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  // Refs for hover management
  const searchRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Performance-optimized initialization
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

        applyThemeToElements(initialTheme === 'dark');
      } catch (error) {
        console.error('Theme initialization error:', error);
      }
    };

    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initializeTheme);
    } else {
      setTimeout(initializeTheme, 0);
    }

    // Prefetch critical routes on component mount
    const criticalRoutes = ['/', '/women', '/men', '/accessories', '/sale', '/cart', '/login'];
    criticalRoutes.forEach(route => prefetchRoute(route));

    return () => {
      setIsHeaderMounted(false);
    };
  }, [prefetchRoute]);

  // Optimized theme application with minimal DOM manipulation
  const applyThemeToElements = useCallback((isDark: boolean) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const body = document.body;
    const html = document.documentElement;

    // Batch DOM operations to prevent multiple reflows
    requestAnimationFrame(() => {
      if (isDark) {
        body.style.setProperty('--bg-primary', '#111827');
        body.style.setProperty('--text-primary', '#F9FAFB');
        html.style.colorScheme = 'dark';
      } else {
        body.style.setProperty('--bg-primary', '#FFFFFF');
        body.style.setProperty('--text-primary', '#111827');
        html.style.colorScheme = 'light';
      }

      // Trigger reflow only once after all changes
      const themeElements = document.querySelectorAll('[class*="theme"], [class*="bg-"], [class*="bg-"], [class*="text-"]');
      themeElements.forEach(element => {
        (element as HTMLElement).offsetHeight; // Trigger reflow
      });
    });
  }, []);

  // Optimized hover timeout management
  const clearHoverTimeout = useCallback((element: string) => {
    if (hoverTimeouts[element]) {
      clearTimeout(hoverTimeouts[element]);
      setHoverTimeouts((prev) => {
        const { [element]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, [hoverTimeouts]);

  const setHoverTimeout = useCallback((element: string, callback: () => void, delay: number) => {
    clearHoverTimeout(element);
    const timeout = setTimeout(callback, delay);
    setHoverTimeouts((prev) => ({ ...prev, [element]: timeout }));
  }, [clearHoverTimeout]);

  // Optimized mega menu handlers with prefetching
  const handleMegaMenuEnter = useCallback(() => {
    if (!isHeaderMounted) return;
    clearHoverTimeout('megamenu');
    setHoveredElement('megamenu');
    
    // Prefetch category routes on hover
    ['/women', '/men', '/accessories', '/sale'].forEach(route => prefetchRoute(route));
  }, [isHeaderMounted, clearHoverTimeout, prefetchRoute]);

  const handleMegaMenuLeave = useCallback(() => {
    if (!isHeaderMounted) return;
    setHoverTimeout('megamenu', () => {
      setHoveredElement((current) => (current === 'megamenu' ? null : current));
    }, 300);
  }, [isHeaderMounted, setHoverTimeout]);

  // Optimized search handlers
  const handleSearchEnter = useCallback(() => {
    if (!isHeaderMounted) return;
    clearHoverTimeout('search');
    setHoveredElement('search');
    setSearchInputVisible(true);
    
    // Prefetch search route
    prefetchRoute('/search');
  }, [isHeaderMounted, clearHoverTimeout, prefetchRoute]);

  const handleSearchLeave = useCallback(() => {
    if (!isHeaderMounted) return;
    setHoverTimeout('search', () => {
      setHoveredElement((current) => (current === 'search' ? null : current));
      setSearchInputVisible(false);
    }, 200);
  }, [isHeaderMounted, setHoverTimeout]);

  // Optimized theme toggle with immediate UI feedback
  const toggleTheme = useCallback(() => {
    if (!isHeaderMounted || typeof window === 'undefined' || typeof document === 'undefined') return;

    const newTheme = isDarkMode ? 'light' : 'dark';
    const newIsDark = !isDarkMode;

    // Immediate state update for responsive UI
    setIsDarkMode(newIsDark);

    // Batch DOM operations
    requestAnimationFrame(() => {
      const html = document.documentElement;
      
      html.classList.toggle('dark', newIsDark);
      html.setAttribute('data-theme', newTheme);
      
      localStorage.setItem('flame-theme', newTheme);
      applyThemeToElements(newIsDark);
      
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
  }, [isDarkMode, isHeaderMounted, applyThemeToElements]);

  // Memoized mega menu categories with route prefetching
  const megaMenuCategories = useMemo(() => {
    if (!isHydrated) return [];

    const categories = categoryMapping[language] || categoryMapping.en;

    return [
      {
        title: categories.women.name,
        items: Object.entries(categories.women.subcategories).map(
          ([key, name]) => ({
            name,
            href: `/women?subcategory=${key}`,
          })
        ),
      },
      {
        title: categories.men.name,
        items: Object.entries(categories.men.subcategories).map(
          ([key, name]) => ({
            name,
            href: `/men?subcategory=${key}`,
          })
        ),
      },
      {
        title: categories.accessories.name,
        items: Object.entries(categories.accessories.subcategories).map(
          ([key, name]) => ({
            name,
            href: `/accessories?subcategory=${key}`,
          })
        ),
      },
      {
        title: categories.sale.name,
        items: [
          {
            name: categories.sale.subcategories.newArrivals,
            href: '/sale?filter=new',
          },
          {
            name: categories.sale.subcategories.bestSellers,
            href: '/sale?filter=bestsellers',
          },
          {
            name: categories.sale.subcategories.discounts,
            href: '/sale?filter=discounts',
          },
          { name: 'Clearance', href: '/sale?clearance=true' },
        ],
      },
    ];
  }, [language, isHydrated]);

  // Memoized theme styles to prevent recalculation
  const themeStyles = useMemo(() => ({
    header: isDarkMode
      ? 'bg-gray-900 border-gray-700 text-white'
      : 'bg-white border-gray-200 text-gray-900',
    dropdown: isDarkMode
      ? 'bg-gray-800 border-gray-600'
      : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textTertiary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
  }), [isDarkMode]);

  // Optimized search submission with client-side routing
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setHoveredElement(null);
      setSearchInputVisible(false);
      
      // Use router.push for client-side navigation (SPA behavior)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  // Optimized suggestion click with immediate navigation
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setHoveredElement(null);
    setSearchInputVisible(false);
    
    // Immediate navigation without waiting
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  }, [router]);

  // Enhanced Link component with prefetching
  const OptimizedLink = useCallback(({ href, children, onClick, ...props }: any) => (
    <Link
      href={href}
      {...props}
      onMouseEnter={() => prefetchRoute(href)}
      onClick={(e) => {
        if (onClick) onClick(e);
        // Close mobile menu immediately for responsiveness
        setIsMenuOpen(false);
      }}
    >
      {children}
    </Link>
  ), [prefetchRoute]);

  const languages = getAvailableLanguages();
  const currencies = getAvailableCurrencies();

  // Performance-optimized loading state
  if (!isHeaderMounted) {
    return (
      <header className="sticky top-0 z-50 border-b shadow-sm bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded"></div>
            <div className="flex items-center space-x-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-50 border-b shadow-sm transition-all duration-200 will-change-transform ${themeStyles.header}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            ref={logoRef}
            className="flex items-center"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="cursor-pointer">
              <OptimizedLink href="/" className="flex items-center space-x-3">
                <span
                  className={`text-2xl font-bold ${themeStyles.text}`}
                  style={{ fontFamily: 'Pacifico, serif' }}
                >
                  Flame
                </span>
              </OptimizedLink>
            </div>

            <div
              className="relative ml-3 cursor-pointer"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className={`${themeStyles.textSecondary} hover:${themeStyles.text} transition-colors`}
                >
                  <g fill="currentColor">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const row = Math.floor(i / 3);
                      const col = i % 3;
                      return (
                        <rect
                          key={i}
                          x={2 + col * 7}
                          y={2 + row * 7}
                          width="5"
                          height="5"
                          rx="0.5"
                        />
                      );
                    })}
                  </g>
                </svg>
              </div>
            </div>

            {/* Optimized Mega Menu with better performance */}
            {hoveredElement === 'megamenu' && (
              <div
                ref={megaMenuRef}
                className={`fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-5xl rounded-lg shadow-2xl border z-50 transition-all duration-200 ease-out ${themeStyles.dropdown}`}
                style={{
                  left: '50vw',
                  transform: 'translateX(-50%)',
                  maxWidth: '1200px',
                  width: '90vw',
                  backdropFilter: 'blur(16px)',
                  willChange: 'transform, opacity'
                }}
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              >
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {megaMenuCategories.map((category, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className={`font-bold text-lg border-b pb-2 ${themeStyles.text} ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                          {category.title}
                        </h3>
                        <ul className="space-y-3">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <OptimizedLink
                                href={item.href}
                                className={`block py-1 transition-all duration-200 hover:translate-x-2 transform hover:font-medium ${themeStyles.textSecondary} hover:${themeStyles.text}`}
                                onClick={() => setHoveredElement(null)}
                              >
                                {item.name}
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

          <div className="flex items-center space-x-4">
            {/* Optimized Search with debouncing */}
            <div
              ref={searchRef}
              className="relative flex items-center"
              onMouseEnter={handleSearchEnter}
              onMouseLeave={handleSearchLeave}
            >
              <div
                className={`absolute right-0 transition-all duration-300 ease-out z-10 ${
                  searchInputVisible
                    ? 'transform translate-x-0 opacity-100 visible'
                    : 'transform translate-x-full opacity-0 invisible pointer-events-none'
                }`}
                style={{ width: '320px', right: '40px' }}
              >
                <form 
                  onSubmit={handleSearchSubmit}
                  className="flex items-center shadow-lg"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className={`w-full px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className={`px-3 py-2 border border-l-0 rounded-r-lg transition-colors ${isDarkMode ? 'bg-gray-600 border-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-600'}`}
                  >
                    <i className="ri-search-line text-xl"></i>
                  </button>
                </form>
              </div>

              <button className={`relative z-20 w-10 h-10 flex items-center justify-center transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text}`}>
                <i className="ri-search-line text-xl"></i>
              </button>

              {/* Optimized Search Suggestions */}
              {hoveredElement === 'search' && searchSuggestions.length > 0 && (
                <div
                  className={`absolute top-full right-0 mt-2 w-80 rounded-lg shadow-lg z-50 border ${themeStyles.dropdown}`}
                  style={{ backdropFilter: 'blur(16px)', willChange: 'opacity, transform' }}
                  onMouseEnter={handleSearchEnter}
                  onMouseLeave={handleSearchLeave}
                >
                  <div className="p-2">
                    <div className={`text-xs mb-2 px-3 ${themeStyles.textTertiary}`}>
                      Popular searches
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left px-3 py-2 transition-colors rounded ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover}`}
                      >
                        <i className={`ri-search-line mr-2 ${themeStyles.textTertiary}`}></i>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Optimized Theme Toggle with immediate feedback */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text}`}
              aria-label="Toggle theme"
            >
              <i className={`${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'} text-xl`}></i>
            </button>

            <UserDropdown />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text}`}
              aria-label="Toggle mobile menu"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Optimized Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t py-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="space-y-2">
              {['women', 'men', 'accessories', 'sale'].map((item) => (
                <OptimizedLink
                  key={item}
                  href={`/${item}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${themeStyles.textSecondary} hover:${themeStyles.text} ${themeStyles.hover} ${item === 'sale' ? 'text-red-600 hover:text-red-700' : ''}`}
                >
                  <span suppressHydrationWarning={true}>{t(item)}</span>
                </OptimizedLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}