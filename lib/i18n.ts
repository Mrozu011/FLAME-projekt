
import { translations } from './translations';

export class I18nManager {
  private currentLanguage: string = 'en';
  private listeners: (() => void)[] = [];
  private isClient: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isClient = true;
      this.initializeLanguage();
    }
  }

  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('flame-language');
    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      if (this.isLanguageSupported(browserLanguage)) {
        this.currentLanguage = browserLanguage;
      }
    }
  }

  private isLanguageSupported(language: string): boolean {
    return Object.keys(translations).includes(language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(language: string): void {
    if (this.isLanguageSupported(language) && language !== this.currentLanguage) {
      this.currentLanguage = language;
      
      if (this.isClient) {
        localStorage.setItem('flame-language', language);
        this.updatePageContent();
      }
      
      this.notifyListeners();
    }
  }

  private updatePageContent(): void {
    // Force immediate DOM update
    requestAnimationFrame(() => {
      // Update all elements with data-translate attribute
      const elements = document.querySelectorAll('[data-translate]');
      elements.forEach((element) => {
        const key = element.getAttribute('data-translate');
        if (key) {
          const translation = this.t(key);
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            (element as HTMLInputElement).placeholder = translation;
          } else {
            element.textContent = translation;
          }
        }
      });

      // Update page title
      const titleElement = document.querySelector('title');
      if (titleElement && titleElement.hasAttribute('data-translate')) {
        const key = titleElement.getAttribute('data-translate');
        if (key) {
          titleElement.textContent = this.t(key);
        }
      }

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && metaDescription.hasAttribute('data-translate')) {
        const key = metaDescription.getAttribute('data-translate');
        if (key) {
          metaDescription.setAttribute('content', this.t(key));
        }
      }

      // Force re-render of all React components that use translations
      const event = new CustomEvent('languageChanged', { 
        detail: { language: this.currentLanguage } 
      });
      
      // Dispatch multiple times to ensure all components receive the event
      window.dispatchEvent(event);
      
      setTimeout(() => {
        window.dispatchEvent(event);
        document.dispatchEvent(new Event('languageUpdate'));
      }, 10);
      
      setTimeout(() => {
        window.dispatchEvent(event);
      }, 50);
    });
  }

  t(key: string, params?: Record<string, string | number>, forceLanguage?: string): string {
    const targetLanguage = forceLanguage || this.currentLanguage;
    const keys = key.split('.');
    let value: any = translations[targetLanguage];
    
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
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }
    
    return value;
  }

  getAvailableLanguages(): Array<{code: string, name: string, nativeName: string}> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'pl', name: 'Polish', nativeName: 'Polski' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' }
    ];
  }

  addLanguageChangeListener(listener: () => void): void {
    this.listeners.push(listener);
  }

  removeLanguageChangeListener(listener: () => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in language change listener:', error);
      }
    });
  }

  // Method to get localized product data with real-time updates
  getLocalizedProduct(product: any): any {
    if (!product) return product;
    
    return {
      ...product,
      name: this.t(`products.${product.id}.name`) || product.name,
      description: this.t(`products.${product.id}.description`) || product.description,
      shortDescription: this.t(`products.${product.id}.shortDescription`) || product.shortDescription,
      features: product.features?.map((feature: string, index: number) => 
        this.t(`products.${product.id}.features.${index}`) || feature
      ) || product.features,
      specifications: product.specifications ? Object.entries(product.specifications).reduce((acc, [key, value]) => {
        acc[this.t(`products.${product.id}.specifications.${key}`) || key] = value;
        return acc;
      }, {} as Record<string, any>) : product.specifications
    };
  }

  // Method to get localized category data
  getLocalizedCategory(category: string): string {
    return this.t(`categories.${category}`) || category;
  }

  // Method to get localized subcategory data
  getLocalizedSubcategory(category: string, subcategory: string): string {
    return this.t(`categories.${category}.subcategories.${subcategory}`) || subcategory;
  }

  // Method to format dates according to locale
  formatDate(date: Date): string {
    if (!this.isClient) return date.toISOString();
    
    return new Intl.DateTimeFormat(this.currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  // Method to format numbers according to locale
  formatNumber(number: number): string {
    if (!this.isClient) return number.toString();
    
    return new Intl.NumberFormat(this.currentLanguage).format(number);
  }
}

export const i18n = new I18nManager();
