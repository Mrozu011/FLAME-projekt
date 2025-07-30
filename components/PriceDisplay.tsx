'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  fromCurrency?: string;
  className?: string;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceDisplay({
  price,
  originalPrice,
  fromCurrency = 'USD',
  className = '',
  showCurrency = true,
  size = 'md'
}: PriceDisplayProps) {
  const { format, convertAmount, currency, forceUpdate } = useCurrency();
  const [displayPrice, setDisplayPrice] = useState('');
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState('');

  useEffect(() => {
    // Update prices when currency changes or component mounts
    const updatePrices = () => {
      if (price > 0) {
        const converted = convertAmount(price, fromCurrency);
        setDisplayPrice(format(converted));
      }

      if (originalPrice && originalPrice > 0) {
        const convertedOriginal = convertAmount(originalPrice, fromCurrency);
        setDisplayOriginalPrice(format(convertedOriginal));
      }
    };

    updatePrices();

    // Listen for currency changes
    const handleCurrencyChange = () => {
      updatePrices();
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    document.addEventListener('currencyUpdate', handleCurrencyChange);

    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
      document.removeEventListener('currencyUpdate', handleCurrencyChange);
    };
  }, [price, originalPrice, fromCurrency, format, convertAmount, currency, forceUpdate]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className={`price-display ${className}`}>
      <span 
        className={`font-semibold text-theme-primary ${getSizeClasses()}`}
        data-price={price}
        data-currency={fromCurrency}
      >
        {displayPrice}
      </span>
      
      {originalPrice && originalPrice > price && (
        <span 
          className={`ml-2 text-theme-tertiary line-through ${getSizeClasses()}`}
          data-original-price={originalPrice}
          data-currency={fromCurrency}
        >
          {displayOriginalPrice}
        </span>
      )}
    </div>
  );
}