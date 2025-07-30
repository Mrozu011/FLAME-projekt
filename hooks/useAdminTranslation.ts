
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Import translation files
import enTranslations from '@/lib/i18n/locales/en.json';
import plTranslations from '@/lib/i18n/locales/pl.json';

export type SupportedLanguage = 'en' | 'pl';

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  en: enTranslations,
  pl: plTranslations
};

const rtlLanguages: SupportedLanguage[] = []; // Polish is LTR, so empty array

export function AdminTranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('admin-language') as SupportedLanguage;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
      if (Object.keys(translations).includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }

    // Apply language-specific styles if needed
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', rtlLanguages.includes(language) ? 'rtl' : 'ltr');
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('admin-language', lang);
    
    // Apply language attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', rtlLanguages.includes(lang) ? 'rtl' : 'ltr');
    
    // Dispatch event for other components to react to language change
    window.dispatchEvent(new CustomEvent('adminLanguageChange', { detail: { language: lang } }));
  };

  const t = (key: string, params?: Record<string, any>): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if key not found
          value = translations.en;
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              value = key; // Return key if translation not found
              break;
            }
          }
          break;
        }
      }

      if (typeof value !== 'string') {
        return key;
      }

      // Replace parameters in translation
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }

      return value;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  const isRTL = rtlLanguages.includes(language);

  return React.createElement(
    TranslationContext.Provider,
    { value: { language, setLanguage, t, isRTL } },
    children
  );
}

export function useAdminTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useAdminTranslation must be used within an AdminTranslationProvider');
  }
  return context;
}

// Helper hook for quick translation access
export function useT() {
  const { t } = useAdminTranslation();
  return t;
}

// Language switcher component
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useAdminTranslation();

  const languages = [
    { code: 'en' as SupportedLanguage, name: 'English', flag: '🇺🇸' },
    { code: 'pl' as SupportedLanguage, name: 'Polski', flag: '🇵🇱' }
  ];

  return React.createElement(
    'div',
    { className: `relative ${className}` },
    React.createElement(
      'select',
      {
        value: language,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value as SupportedLanguage),
        className: "appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      },
      ...languages.map((lang) => 
        React.createElement(
          'option',
          { key: lang.code, value: lang.code },
          `${lang.flag} ${lang.name}`
        )
      )
    ),
    React.createElement(
      'div',
      { className: "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" },
      React.createElement('i', { className: "ri-arrow-down-s-line text-gray-400" })
    )
  );
}

// Pluralization helper
export function usePluralization() {
  const { language } = useAdminTranslation();

  const plural = (count: number, singular: string, plural?: string, genitive?: string): string => {
    if (language === 'pl') {
      // Polish pluralization rules
      if (count === 1) {
        return singular;
      } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return plural || singular;
      } else {
        return genitive || plural || singular;
      }
    } else {
      // English pluralization
      return count === 1 ? singular : (plural || singular + 's');
    }
  };

  return { plural };
}

// Format number according to language locale
export function useNumberFormat() {
  const { language } = useAdminTranslation();

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    const locale = language === 'pl' ? 'pl-PL' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(number);
  };

  const formatCurrency = (amount: number, currency = 'USD'): string => {
    const locale = language === 'pl' ? 'pl-PL' : 'en-US';
    const currencyCode = language === 'pl' ? 'PLN' : currency;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const locale = language === 'pl' ? 'pl-PL' : 'en-US';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(dateObj);
  };

  const formatRelativeTime = (date: Date | string): string => {
    const locale = language === 'pl' ? 'pl-PL' : 'en-US';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    // Use Intl.RelativeTimeFormat if available
    if ('RelativeTimeFormat' in Intl) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      
      if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
      } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      } else {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
      }
    }

    // Fallback for older browsers
    if (diffInSeconds < 60) {
      return language === 'pl' ? 'przed chwilą' : 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return language === 'pl' ? `${minutes} min temu` : `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return language === 'pl' ? `${hours}h temu` : `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return language === 'pl' ? `${days} dni temu` : `${days}d ago`;
    }
  };

  return { formatNumber, formatCurrency, formatDate, formatRelativeTime };
}
