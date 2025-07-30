
'use client';

import { getExchangeRates, formatPrice, convertPrice } from './translations';

export class CurrencyManager {
  private static instance: CurrencyManager;
  private currentCurrency: string = 'USD';
  private listeners: (() => void)[] = [];
  private exchangeRates: Record<string, number> = getExchangeRates();
  private isInitialized: boolean = false;

  private constructor() {
    // Don't initialize immediately - wait for client-side
  }

  private initializeClientSide() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.currentCurrency = localStorage.getItem('flame-currency') || 'USD';
    this.isInitialized = true;
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      this.updatePricesOnPage();
    }, 0);
  }

  static getInstance(): CurrencyManager {
    if (!CurrencyManager.instance) {
      CurrencyManager.instance = new CurrencyManager();
    }
    return CurrencyManager.instance;
  }

  getCurrentCurrency(): string {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.initializeClientSide();
    }
    return this.currentCurrency;
  }

  setCurrency(currency: string): void {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.initializeClientSide();
    }
    
    if (this.currentCurrency !== currency) {
      this.currentCurrency = currency;
      if (typeof window !== 'undefined') {
        localStorage.setItem('flame-currency', currency);
        
        // Use setTimeout to ensure state updates happen after current execution
        setTimeout(() => {
          this.updatePricesOnPage();
          this.notifyListeners();
        }, 0);
      }
    }
  }

  addCurrencyChangeListener(listener: () => void): void {
    this.listeners.push(listener);
  }

  removeCurrencyChangeListener(listener: () => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in currency change listener:', error);
      }
    });
  }

  convertAndFormat(price: number, fromCurrency: string = 'USD'): string {
    const convertedPrice = convertPrice(price, fromCurrency, this.currentCurrency);
    return formatPrice(convertedPrice, this.currentCurrency);
  }

  convertAmount(amount: number, fromCurrency: string = 'USD'): number {
    return convertPrice(amount, fromCurrency, this.currentCurrency);
  }

  private updatePricesOnPage(): void {
    if (typeof window === 'undefined') return;
    
    // Use requestAnimationFrame to ensure DOM updates happen at the right time
    requestAnimationFrame(() => {
      // Update price elements
      const priceElements = document.querySelectorAll('[data-price]');
      
      priceElements.forEach((element) => {
        const originalPrice = parseFloat(element.getAttribute('data-price') || '0');
        const fromCurrency = element.getAttribute('data-currency') || 'USD';
        
        if (originalPrice > 0) {
          const convertedPrice = this.convertAndFormat(originalPrice, fromCurrency);
          element.textContent = convertedPrice;
        }
      });

      // Update original price elements
      const originalPriceElements = document.querySelectorAll('[data-original-price]');
      
      originalPriceElements.forEach((element) => {
        const originalPrice = parseFloat(element.getAttribute('data-original-price') || '0');
        const fromCurrency = element.getAttribute('data-currency') || 'USD';
        
        if (originalPrice > 0) {
          const convertedPrice = this.convertAndFormat(originalPrice, fromCurrency);
          element.textContent = convertedPrice;
        }
      });

      // Update cart total elements
      const cartTotalElements = document.querySelectorAll('[data-cart-total]');
      
      cartTotalElements.forEach((element) => {
        const totalPrice = parseFloat(element.getAttribute('data-cart-total') || '0');
        const fromCurrency = element.getAttribute('data-currency') || 'USD';
        
        if (totalPrice > 0) {
          const convertedPrice = this.convertAndFormat(totalPrice, fromCurrency);
          element.textContent = convertedPrice;
        }
      });

      // Update shipping elements
      const shippingElements = document.querySelectorAll('[data-shipping]');
      
      shippingElements.forEach((element) => {
        const shippingCost = parseFloat(element.getAttribute('data-shipping') || '0');
        const fromCurrency = element.getAttribute('data-currency') || 'USD';
        
        if (shippingCost > 0) {
          const convertedPrice = this.convertAndFormat(shippingCost, fromCurrency);
          element.textContent = convertedPrice;
        }
      });

      // Trigger custom event for React components
      window.dispatchEvent(new CustomEvent('currencyChanged', { 
        detail: { currency: this.currentCurrency } 
      }));
    });
  }

  // Manual trigger for price updates
  public updateAllPrices(): void {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.initializeClientSide();
    }
    this.updatePricesOnPage();
  }

  // Get current currency's free shipping threshold
  public getFreeShippingThreshold(): number {
    const baseThreshold = 50; // USD
    return this.convertAmount(baseThreshold, 'USD');
  }

  // Format price without conversion
  public formatPrice(price: number): string {
    return formatPrice(price, this.currentCurrency);
  }
}

export const currencyManager = CurrencyManager.getInstance();
