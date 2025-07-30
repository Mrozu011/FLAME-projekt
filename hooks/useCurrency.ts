
'use client';

import { useState, useEffect, useCallback } from 'react';
import { convertPrice, formatPrice, getExchangeRates, getCurrencySymbol } from '@/lib/translations';

export const useCurrency = () => {
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState(getExchangeRates());
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isMounted) return;
    
    const savedCurrency = localStorage.getItem('flame-currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, [isClient, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    // Listen for currency changes from other components
    const handleCurrencyChange = (event: any) => {
      if (event.detail && event.detail.currency) {
        setCurrency(event.detail.currency);
        setForceUpdate(prev => prev + 1); // Force re-render
      }
    };

    const handleCurrencyUpdate = () => {
      setForceUpdate(prev => prev + 1); // Force re-render
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    document.addEventListener('currencyUpdate', handleCurrencyUpdate);

    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
      document.removeEventListener('currencyUpdate', handleCurrencyUpdate);
    };
  }, [isMounted]);

  const changeCurrency = useCallback((newCurrency: string) => {
    if (!isMounted) return;
    
    setCurrency(newCurrency);
    setForceUpdate(prev => prev + 1); // Force immediate re-render
    
    if (isClient) {
      localStorage.setItem('flame-currency', newCurrency);
      
      // Trigger global currency update
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('currencyChanged', { 
          detail: { currency: newCurrency } 
        }));
      }, 0);
    }
  }, [isClient, isMounted]);

  const convertAndFormat = useCallback((price: number, fromCurrency: string = 'USD') => {
    const convertedPrice = convertPrice(price, fromCurrency, currency);
    return formatPrice(convertedPrice, currency);
  }, [currency, forceUpdate]);

  const convertAmount = useCallback((amount: number, fromCurrency: string = 'USD') => {
    return convertPrice(amount, fromCurrency, currency);
  }, [currency, forceUpdate]);

  const getSymbol = useCallback(() => {
    return getCurrencySymbol(currency);
  }, [currency, forceUpdate]);

  const format = useCallback((amount: number) => {
    return formatPrice(amount, currency);
  }, [currency, forceUpdate]);

  return {
    currency,
    changeCurrency,
    convertAndFormat,
    convertAmount,
    getSymbol,
    format,
    exchangeRates,
    isClient,
    isMounted,
    forceUpdate // Include this to trigger re-renders when needed
  };
};
