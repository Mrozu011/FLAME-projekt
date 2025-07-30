
'use client';

import { useState, useEffect } from 'react';
import { i18n } from '@/lib/i18n';

export const useTranslation = () => {
  const [language, setLanguage] = useState('en'); // Always start with 'en' to prevent hydration mismatch
  const [isHydrated, setIsHydrated] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Only after hydration, get the actual language from localStorage
    setIsHydrated(true);
    const actualLanguage = i18n.getCurrentLanguage();
    setLanguage(actualLanguage);

    const handleLanguageChange = () => {
      const newLanguage = i18n.getCurrentLanguage();
      setLanguage(newLanguage);
      setForceUpdate(prev => prev + 1); // Force re-render
    };

    // Listen for both internal and external language changes
    i18n.addLanguageChangeListener(handleLanguageChange);
    
    // Listen for custom events from header
    const handleLanguageUpdate = () => {
      handleLanguageChange();
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    document.addEventListener('languageUpdate', handleLanguageUpdate);

    return () => {
      i18n.removeLanguageChangeListener(handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
      document.removeEventListener('languageUpdate', handleLanguageUpdate);
    };
  }, []);

  const t = (key: string, params?: Record<string, string | number>) => {
    // During SSR and before hydration, always use English to prevent mismatch
    if (!isHydrated) {
      return i18n.t(key, params, 'en');
    }
    return i18n.t(key, params);
  };

  const changeLanguage = (lang: string) => {
    i18n.setLanguage(lang);
    setForceUpdate(prev => prev + 1); // Force immediate re-render
  };

  return {
    t,
    language: isHydrated ? language : 'en', // Always return 'en' during SSR
    changeLanguage,
    isHydrated,
    forceUpdate // Include this to trigger re-renders when needed
  };
};
