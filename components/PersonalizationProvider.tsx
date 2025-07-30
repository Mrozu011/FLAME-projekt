'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { personalizationEngine } from '@/lib/personalization-engine';

interface PersonalizationContextType {
  personalization: any;
  isLoading: boolean;
  resetPersonalization: () => void;
  updateConsent: (consent: boolean) => void;
  trackBehavior: (action: string, data: any) => void;
  isPersonalizationEnabled: boolean;
  togglePersonalization: (enabled: boolean) => void;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

interface PersonalizationProviderProps {
  children: ReactNode;
}

export default function PersonalizationProvider({ children }: PersonalizationProviderProps) {
  const [personalization, setPersonalization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalizationEnabled, setIsPersonalizationEnabled] = useState(true);
  const [userId, setUserId] = useState<string>('');

  const initializePersonalization = useCallback(async () => {
    try {
      // 获取或创建用户ID
      let currentUserId = localStorage.getItem('user-id') || localStorage.getItem('flame-user-session');
      if (currentUserId && currentUserId.includes('{')) {
        try {
          const session = JSON.parse(currentUserId);
          currentUserId = session.user?.id || generateAnonymousId();
        } catch {
          currentUserId = generateAnonymousId();
        }
      }
      
      if (!currentUserId) {
        currentUserId = generateAnonymousId();
        localStorage.setItem('user-id', currentUserId);
      }
      
      setUserId(currentUserId);

      // 获取个性化设置
      const savedEnabled = localStorage.getItem('personalization-enabled');
      const enabled = savedEnabled ? JSON.parse(savedEnabled) : true;
      setIsPersonalizationEnabled(enabled);

      // 加载个性化数据
      if (enabled) {
        const personalizationData = personalizationEngine.getPersonalization(currentUserId);
        setPersonalization(personalizationData);
        
        // 应用个性化设置
        applyPersonalizationSettings(personalizationData);
      }

      // 跟踪页面访问
      trackBehavior('page_view', {
        page: window.location.pathname,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('个性化初始化失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializePersonalization();
  }, [initializePersonalization]);



  const generateAnonymousId = () => {
    return 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const applyPersonalizationSettings = (data: any) => {
    if (!data) return;

    // 应用主题设置
    if (data.contentConfig.theme !== 'auto') {
      const isDark = data.contentConfig.theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.setAttribute('data-theme', data.contentConfig.theme);
      localStorage.setItem('flame-theme', data.contentConfig.theme);
    }

    // 应用语言设置
    if (data.contentConfig.language !== 'en') {
      localStorage.setItem('flame-language', data.contentConfig.language);
    }

    // 应用货币设置
    if (data.contentConfig.currency !== 'USD') {
      localStorage.setItem('flame-currency', data.contentConfig.currency);
    }

    // 触发个性化应用事件
    window.dispatchEvent(new CustomEvent('personalizationApplied', { 
      detail: data 
    }));
  };

  const resetPersonalization = () => {
    if (userId) {
      personalizationEngine.resetUserPersonalization(userId);
      setPersonalization(null);
      
      // 重置本地存储
      localStorage.removeItem('flame-theme');
      localStorage.removeItem('flame-language');
      localStorage.removeItem('flame-currency');
      localStorage.removeItem('personalization-enabled');
      
      // 重新加载页面以应用默认设置
      window.location.reload();
    }
  };

  const updateConsent = (consent: boolean) => {
    if (userId) {
      // 更新用户档案中的同意状态
      const profile = personalizationEngine.getUserProfile(userId);
      if (profile) {
        profile.gdprConsent = consent;
        profile.consentDate = new Date();
        
        // 如果用户拒绝，清理敏感数据
        if (!consent) {
          personalizationEngine.resetUserPersonalization(userId);
        }
      }
      
      localStorage.setItem('gdpr-consent', JSON.stringify({
        consent,
        date: new Date().toISOString()
      }));
    }
  };

  const trackBehavior = useCallback((action: string, data: any) => {
    if (userId && isPersonalizationEnabled) {
      personalizationEngine.trackBehavior(userId, {
        action: action as any,
        timestamp: new Date(),
        data: {
          ...data,
          deviceType: getDeviceType(),
          sessionId: getSessionId()
        }
      });
    }
  }, [userId, isPersonalizationEnabled]);

  const togglePersonalization = (enabled: boolean) => {
    setIsPersonalizationEnabled(enabled);
    localStorage.setItem('personalization-enabled', JSON.stringify(enabled));
    
    if (enabled) {
      // 重新加载个性化数据
      initializePersonalization();
    } else {
      // 清理个性化数据
      setPersonalization(null);
    }
  };

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('flame-session-id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('flame-session-id', sessionId);
    }
    return sessionId;
  };

  // 设置全局行为跟踪
  useEffect(() => {
    if (!isPersonalizationEnabled) return;

    const handleProductClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const productElement = target.closest('[data-product-id]');
      if (productElement) {
        const productId = productElement.getAttribute('data-product-id');
        trackBehavior('product_view', { productId });
      }
    };

    const handleCategoryClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const categoryElement = target.closest('[data-category]');
      if (categoryElement) {
        const category = categoryElement.getAttribute('data-category');
        trackBehavior('category_browse', { category });
      }
    };

    const handleSearchSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      const searchInput = form.querySelector('input[type="search"], input[type="text"]') as HTMLInputElement;
      if (searchInput && searchInput.value.trim()) {
        trackBehavior('search', { searchQuery: searchInput.value.trim() });
      }
    };

    // 添加事件监听器
    document.addEventListener('click', handleProductClick);
    document.addEventListener('click', handleCategoryClick);
    document.addEventListener('submit', handleSearchSubmit);

    // 监听购物车和收藏夹变化
    const handleCartUpdate = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('flame-cart') || '[]');
        cart.forEach((item: any) => {
          trackBehavior('add_to_cart', { 
            productId: item.id, 
            category: item.category,
            size: item.size 
          });
        });
      } catch (error) {
        console.error('购物车跟踪失败:', error);
      }
    };

    const handleFavoritesUpdate = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('flame-favorites') || '[]');
        favorites.forEach((item: any) => {
          trackBehavior('wishlist_add', { 
            productId: item.id, 
            category: item.category 
          });
        });
      } catch (error) {
        console.error('收藏夹跟踪失败:', error);
      }
    };

    // 监听主题和语言变化
    const handleThemeChange = (event: any) => {
      trackBehavior('theme_change', { theme: event.detail.theme });
    };

    const handleLanguageChange = (event: any) => {
      trackBehavior('language_change', { language: event.detail.language });
    };

    // 添加存储事件监听器
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('languageChanged', handleLanguageChange);

    // 清理事件监听器
    return () => {
      document.removeEventListener('click', handleProductClick);
      document.removeEventListener('click', handleCategoryClick);
      document.removeEventListener('submit', handleSearchSubmit);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [isPersonalizationEnabled, userId, trackBehavior]);

  const value = {
    personalization,
    isLoading,
    resetPersonalization,
    updateConsent,
    trackBehavior,
    isPersonalizationEnabled,
    togglePersonalization
  };

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};