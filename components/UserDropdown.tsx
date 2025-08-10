'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { useOptimizedState, useRoutePrefetch } from '@/hooks/usePerformanceOptimization';
import { getAvailableLanguages, getAvailableCurrencies } from '@/lib/translations';

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

// Memoized dropdown item component for better performance
const DropdownItem = memo(function DropdownItem({ 
  href, 
  icon, 
  children, 
  onClick,
  prefetch = true,
  className = ""
}: {
  href?: string;
  icon: string;
  children: React.ReactNode;
  onClick?: () => void;
  prefetch?: boolean;
  className?: string;
}) {
  const { prefetchRoute } = useRoutePrefetch();
  
  const handleMouseEnter = useCallback(() => {
    if (href && prefetch) {
      prefetchRoute(href);
    }
  }, [href, prefetch, prefetchRoute]);

  const content = (
    <div 
      className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
    >
      <i className={`${icon} text-gray-500 dark:text-gray-400`}></i>
      <span className="text-gray-700 dark:text-gray-300">{children}</span>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : content;
});

const UserDropdown = memo(function UserDropdown() {
  const router = useRouter();
  const { t, language, changeLanguage, isHydrated } = useTranslation();
  const { currency, changeCurrency, format, isMounted } = useCurrency();
  const { prefetchRoute } = useRoutePrefetch();

  // Optimized state management
  const [userSession, setUserSession] = useOptimizedState<UserSession | null>(null);
  const [isDarkMode, setIsDarkMode] = useOptimizedState(false);
  const [cartItems, setCartItems] = useOptimizedState<CartItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useOptimizedState<FavoriteItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useOptimizedState(false);
  const [activeDropdown, setActiveDropdown] = useOptimizedState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Performance-optimized initialization
  useEffect(() => {
    const initializeUserData = () => {
      try {
        // Check for user session
        const savedSession = localStorage.getItem('flame-user-session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          if (new Date(session.expiresAt) > new Date()) {
            setUserSession(session);
          } else {
            localStorage.removeItem('flame-user-session');
          }
        }

        // Load theme
        const savedTheme = localStorage.getItem('flame-theme');
        setIsDarkMode(savedTheme === 'dark');

        // Load cart items
        const savedCart = localStorage.getItem('flame-cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }

        // Load favorites
        const savedFavorites = localStorage.getItem('flame-favorites');
        if (savedFavorites) {
          setFavoriteItems(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    // Use requestIdleCallback for non-critical initialization
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initializeUserData);
      } else {
        setTimeout(initializeUserData, 0);
      }
    }
  }, [setUserSession, setIsDarkMode, setCartItems, setFavoriteItems]);

  // Optimized cart and favorites update listeners
  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const savedCart = localStorage.getItem('flame-cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    };

    const handleFavoritesUpdate = () => {
      try {
        const savedFavorites = localStorage.getItem('flame-favorites');
        if (savedFavorites) {
          setFavoriteItems(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    };

    const handleThemeChange = (event: CustomEvent) => {
      setIsDarkMode(event.detail.theme === 'dark');
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, [setCartItems, setFavoriteItems, setIsDarkMode]);

  // Optimized outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveDropdown(null);
      }
    };

    if (isDropdownOpen && typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside, { passive: true });
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [isDropdownOpen, setIsDropdownOpen, setActiveDropdown]);

  // Memoized computed values
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favoriteCount = favoriteItems.length;
  const languages = getAvailableLanguages();
  const currencies = getAvailableCurrencies();

  // Optimized handlers
  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
    setActiveDropdown(null);
    
    // Prefetch common routes when dropdown opens
    if (!isDropdownOpen) {
      const commonRoutes = ['/profile', '/cart', '/favorites', '/order-history'];
      commonRoutes.forEach(route => prefetchRoute(route, 100));
    }
  }, [isDropdownOpen, setIsDropdownOpen, setActiveDropdown, prefetchRoute]);

  const handleSubDropdownToggle = useCallback((dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  }, [activeDropdown, setActiveDropdown]);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    changeLanguage(newLanguage);
    setActiveDropdown(null);
    setIsDropdownOpen(false);
  }, [changeLanguage, setActiveDropdown, setIsDropdownOpen]);

  const handleCurrencyChange = useCallback((newCurrency: string) => {
    changeCurrency(newCurrency);
    setActiveDropdown(null);
    setIsDropdownOpen(false);
  }, [changeCurrency, setActiveDropdown, setIsDropdownOpen]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('flame-user-session');
    setUserSession(null);
    setIsDropdownOpen(false);
    router.push('/');
  }, [setUserSession, setIsDropdownOpen, router]);

  const handleNavigate = useCallback((path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  }, [setIsDropdownOpen, router]);

  // Quick theme toggle for compact panel
  const handleThemeQuickToggle = useCallback(() => {
    try {
      const html = document.documentElement;
      const isCurrentlyDark = html.classList.contains('dark');
      const newTheme = isCurrentlyDark ? 'light' : 'dark';
      html.classList.toggle('dark', !isCurrentlyDark);
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    } catch (e) {
      // no-op
    }
  }, []);

  // Performance-optimized rendering condition
  if (!isMounted || !isHydrated) {
    return (
      <div className="w-10 h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main User Button */}
      <button
        onClick={handleDropdownToggle}
        className="flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="User menu"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          {userSession ? (
            <span className="text-white text-sm font-medium">
              {userSession.user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <i className="ri-user-line text-white text-sm"></i>
          )}
        </div>

        {/* Cart Badge */}
        {cartItemCount > 0 && (
          <div className="relative">
            <i className="ri-shopping-cart-line text-xl text-gray-600 dark:text-gray-400"></i>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          </div>
        )}

        {/* Favorites Badge */}
        {favoriteCount > 0 && (
          <div className="relative">
            <i className="ri-heart-line text-xl text-gray-600 dark:text-gray-400"></i>
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {favoriteCount > 99 ? '99+' : favoriteCount}
            </span>
          </div>
        )}

        <i className={`ri-arrow-down-s-line text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="py-2">
            {/* User Info Section */}
            {userSession ? (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {userSession.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {userSession.user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userSession.user.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-gray-600 dark:text-gray-400"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t('guest')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('notLoggedIn')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('cartItems')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{cartItemCount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">{t('favorites')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{favoriteCount}</span>
              </div>
            </div>

            {/* Compact Quick Settings */}
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleThemeQuickToggle}
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Theme"
                >
                  <i className="ri-contrast-2-line text-gray-700 dark:text-gray-200"></i>
                  <span className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">Theme</span>
                </button>
                <button
                  onClick={() => handleLanguageChange('pl')}
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Language"
                >
                  <i className="ri-translate-2 text-gray-700 dark:text-gray-200"></i>
                  <span className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">Polish</span>
                </button>
                <button
                  onClick={() => handleCurrencyChange('EUR')}
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Currency"
                >
                  <i className="ri-money-euro-circle-line text-gray-700 dark:text-gray-200"></i>
                  <span className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">EUR</span>
                </button>
              </div>
            </div>

            {/* Main Menu Items */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              {userSession ? (
                <>
                  <DropdownItem href="/profile" icon="ri-user-line">
                    {t('profile')}
                  </DropdownItem>
                  <DropdownItem href="/order-history" icon="ri-file-list-line">
                    {t('orderHistory')}
                  </DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem href="/login" icon="ri-login-box-line">
                    {t('login')}
                  </DropdownItem>
                  <DropdownItem href="/register" icon="ri-user-add-line">
                    {t('register')}
                  </DropdownItem>
                </>
              )}
              
              <DropdownItem href="/cart" icon="ri-shopping-cart-line">
                {t('cart')} {cartItemCount > 0 && <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">{cartItemCount}</span>}
              </DropdownItem>
              
              <DropdownItem href="/favorites" icon="ri-heart-line">
                {t('favorites')} {favoriteCount > 0 && <span className="ml-2 bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">{favoriteCount}</span>}
              </DropdownItem>
            </div>

            {/* Language Selector */}
            <div>
              <button
                onClick={() => handleSubDropdownToggle('language')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-global-line text-gray-500 dark:text-gray-400"></i>
                  <span className="text-gray-700 dark:text-gray-300">{t('language')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {language}
                  </span>
                  <i className={`ri-arrow-right-s-line text-gray-400 transition-transform ${activeDropdown === 'language' ? 'rotate-90' : ''}`}></i>
                </div>
              </button>
              
              {activeDropdown === 'language' && (
                <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-8 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        language === lang.code
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <i className="ri-check-line text-blue-600 dark:text-blue-400"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div>
              <button
                onClick={() => handleSubDropdownToggle('currency')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-money-dollar-circle-line text-gray-500 dark:text-gray-400"></i>
                  <span className="text-gray-700 dark:text-gray-300">{t('currency')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {currency}
                  </span>
                  <i className={`ri-arrow-right-s-line text-gray-400 transition-transform ${activeDropdown === 'currency' ? 'rotate-90' : ''}`}></i>
                </div>
              </button>
              
              {activeDropdown === 'currency' && (
                <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencyChange(curr.code)}
                      className={`w-full flex items-center justify-between px-8 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        currency === curr.code
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{curr.name}</span>
                        <span className="text-xs text-gray-400">({curr.symbol})</span>
                      </div>
                      {currency === curr.code && (
                        <i className="ri-check-line text-blue-600 dark:text-blue-400"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Support & Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <DropdownItem href="/support" icon="ri-customer-service-line">
                {t('support')}
              </DropdownItem>
              
              <DropdownItem href="/faq" icon="ri-question-line">
                {t('help')}
              </DropdownItem>
            </div>

            {/* Logout */}
            {userSession && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <DropdownItem 
                  icon="ri-logout-box-line" 
                  onClick={handleLogout}
                  prefetch={false}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {t('logout')}
                </DropdownItem>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default UserDropdown;