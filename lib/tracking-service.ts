interface TrackingSettings {
  googleAnalytics: {
    enabled: boolean;
    trackingId: string;
    measurementId: string;
    status: 'success' | 'error' | 'pending' | 'inactive';
    lastUpdated?: string;
  };
  facebookPixel: {
    enabled: boolean;
    pixelId: string;
    accessToken?: string;
    status: 'success' | 'error' | 'pending' | 'inactive';
    lastUpdated?: string;
  };
  tiktokPixel: {
    enabled: boolean;
    pixelId: string;
    accessToken?: string;
    status: 'success' | 'error' | 'pending' | 'inactive';
    lastUpdated?: string;
  };
  events: {
    pageView: boolean;
    addToCart: boolean;
    purchase: boolean;
    beginCheckout: boolean;
    search: boolean;
    viewContent: boolean;
    addToWishlist: boolean;
    signUp: boolean;
    login: boolean;
  };
}

interface TrackingEvent {
  eventName: string;
  eventData: {
    [key: string]: any;
  };
  timestamp: string;
  platform: 'ga' | 'fb' | 'tiktok' | 'all';
}

interface EcommerceEvent {
  transaction_id?: string;
  value?: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
  content_ids?: string[];
  content_type?: string;
  content_name?: string;
  search_string?: string;
  user_data?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  };
}

export class TrackingService {
  private settings: TrackingSettings;
  private isInitialized = false;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeTracking();
  }

  private getDefaultSettings(): TrackingSettings {
    return {
      googleAnalytics: {
        enabled: false,
        trackingId: '',
        measurementId: '',
        status: 'inactive'
      },
      facebookPixel: {
        enabled: false,
        pixelId: '',
        status: 'inactive'
      },
      tiktokPixel: {
        enabled: false,
        pixelId: '',
        status: 'inactive'
      },
      events: {
        pageView: true,
        addToCart: true,
        purchase: true,
        beginCheckout: true,
        search: true,
        viewContent: true,
        addToWishlist: true,
        signUp: true,
        login: true
      }
    };
  }

  async getSettings(): Promise<TrackingSettings> {
    try {
      const savedSettings = localStorage.getItem('flame-tracking-settings');
      if (savedSettings) {
        this.settings = { ...this.getDefaultSettings(), ...JSON.parse(savedSettings) };
      }
      return this.settings;
    } catch (error) {
      console.error('Error loading tracking settings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveSettings(settings: TrackingSettings): Promise<void> {
    try {
      this.settings = settings;
      localStorage.setItem('flame-tracking-settings', JSON.stringify(settings));
      
      // Reinitialize tracking with new settings
      await this.initializeTracking();
      
      // Update head scripts
      this.updateHeadScripts();
    } catch (error) {
      console.error('Error saving tracking settings:', error);
      throw error;
    }
  }

  public async initializeTracking(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      await this.getSettings();
      
      // Initialize Google Analytics
      if (this.settings.googleAnalytics.enabled && this.settings.googleAnalytics.trackingId) {
        await this.initializeGoogleAnalytics();
      }
      
      // Initialize Facebook Pixel
      if (this.settings.facebookPixel.enabled && this.settings.facebookPixel.pixelId) {
        await this.initializeFacebookPixel();
      }
      
      // Initialize TikTok Pixel
      if (this.settings.tiktokPixel.enabled && this.settings.tiktokPixel.pixelId) {
        await this.initializeTikTokPixel();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing tracking:', error);
    }
  }

  private updateHeadScripts(): void {
    if (typeof document === 'undefined') return;

    // Remove existing tracking scripts
    const existingScripts = document.querySelectorAll('[data-tracking-script]');
    existingScripts.forEach(script => script.remove());

    // Add Google Analytics
    if (this.settings.googleAnalytics.enabled && this.settings.googleAnalytics.trackingId) {
      this.injectGoogleAnalyticsScript();
    }

    // Add Facebook Pixel
    if (this.settings.facebookPixel.enabled && this.settings.facebookPixel.pixelId) {
      this.injectFacebookPixelScript();
    }

    // Add TikTok Pixel
    if (this.settings.tiktokPixel.enabled && this.settings.tiktokPixel.pixelId) {
      this.injectTikTokPixelScript();
    }
  }

  private injectGoogleAnalyticsScript(): void {
    const trackingId = this.settings.googleAnalytics.trackingId;
    
    // Google Analytics 4 script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    gaScript.setAttribute('data-tracking-script', 'google-analytics');
    document.head.appendChild(gaScript);

    // Google Analytics configuration
    const gaConfigScript = document.createElement('script');
    gaConfigScript.setAttribute('data-tracking-script', 'google-analytics-config');
    gaConfigScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    `;
    document.head.appendChild(gaConfigScript);
  }

  private injectFacebookPixelScript(): void {
    const pixelId = this.settings.facebookPixel.pixelId;
    
    const fbScript = document.createElement('script');
    fbScript.setAttribute('data-tracking-script', 'facebook-pixel');
    fbScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbScript);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
    document.head.appendChild(noscript);
  }

  private injectTikTokPixelScript(): void {
    const pixelId = this.settings.tiktokPixel.pixelId;
    
    const tiktokScript = document.createElement('script');
    tiktokScript.setAttribute('data-tracking-script', 'tiktok-pixel');
    tiktokScript.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(tiktokScript);
  }

  private async initializeGoogleAnalytics(): Promise<void> {
    if (typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('config', this.settings.googleAnalytics.trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  }

  private async initializeFacebookPixel(): Promise<void> {
    if (typeof window === 'undefined' || !window.fbq) return;

    try {
      window.fbq('init', this.settings.facebookPixel.pixelId);
      window.fbq('track', 'PageView');
    } catch (error) {
      console.error('Error initializing Facebook Pixel:', error);
    }
  }

  private async initializeTikTokPixel(): Promise<void> {
    if (typeof window === 'undefined' || !window.ttq) return;

    try {
      window.ttq.load(this.settings.tiktokPixel.pixelId);
      window.ttq.page();
    } catch (error) {
      console.error('Error initializing TikTok Pixel:', error);
    }
  }

  // Test connection methods
  async testGoogleAnalytics(trackingId: string): Promise<{success: boolean; error?: string}> {
    if (typeof document === 'undefined') {
      return { success: false, error: 'Document not available' };
    }
    
    try {
      if (!trackingId || !trackingId.startsWith('G-')) {
        return { success: false, error: 'Invalid tracking ID format' };
      }

      // Test by checking if gtag is available after script injection
      const testScript = document.createElement('script');
      testScript.async = true;
      testScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      
      return new Promise((resolve) => {
        testScript.onload = () => {
          document.head.removeChild(testScript);
          resolve({ success: true });
        };
        
        testScript.onerror = () => {
          document.head.removeChild(testScript);
          resolve({ success: false, error: 'Failed to load Google Analytics script' });
        };
        
        document.head.appendChild(testScript);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          document.head.removeChild(testScript);
          resolve({ success: false, error: 'Connection timeout' });
        }, 10000);
      });
    } catch (error) {
      return { success: false, error: (error as any).message };
    }
  }

  async testFacebookPixel(pixelId: string): Promise<{success: boolean; error?: string}> {
    if (typeof document === 'undefined') {
      return { success: false, error: 'Document not available' };
    }
    
    try {
      if (!pixelId || pixelId.length < 10) {
        return { success: false, error: 'Invalid pixel ID format' };
      }

      // Test by trying to load Facebook pixel script
      const testScript = document.createElement('script');
      testScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
      
      return new Promise((resolve) => {
        testScript.onload = () => {
          document.head.removeChild(testScript);
          resolve({ success: true });
        };
        
        testScript.onerror = () => {
          document.head.removeChild(testScript);
          resolve({ success: false, error: 'Failed to load Facebook Pixel script' });
        };
        
        document.head.appendChild(testScript);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          document.head.removeChild(testScript);
          resolve({ success: false, error: 'Connection timeout' });
        }, 10000);
      });
    } catch (error) {
      return { success: false, error: (error as any).message };
    }
  }

  async testTikTokPixel(pixelId: string): Promise<{success: boolean; error?: string}> {
    if (typeof document === 'undefined') {
      return { success: false, error: 'Document not available' };
    }
    
    try {
      if (!pixelId || pixelId.length < 10) {
        return { success: false, error: 'Invalid pixel ID format' };
      }

      // Test by trying to load TikTok pixel script
      const testScript = document.createElement('script');
      testScript.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + pixelId + '&lib=ttq';
      
      return new Promise((resolve) => {
        testScript.onload = () => {
          document.head.removeChild(testScript);
          resolve({ success: true });
        };
        
        testScript.onerror = () => {
          document.head.removeChild(testScript);
          resolve({ success: false, error: 'Failed to load TikTok Pixel script' });
        };
        
        document.head.appendChild(testScript);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          document.head.removeChild(testScript);
          resolve({ success: false, error: 'Connection timeout' });
        }, 10000);
      });
    } catch (error) {
      return { success: false, error: (error as any).message };
    }
  }

  // Event tracking methods
  async trackEvent(eventName: string, eventData: EcommerceEvent = {}, platform: 'ga' | 'fb' | 'tiktok' | 'all' = 'all'): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeTracking();
    }

    const event: TrackingEvent = {
      eventName,
      eventData,
      timestamp: new Date().toISOString(),
      platform
    };

    try {
      if (platform === 'all' || platform === 'ga') {
        await this.trackGoogleAnalyticsEvent(eventName, eventData);
      }
      
      if (platform === 'all' || platform === 'fb') {
        await this.trackFacebookEvent(eventName, eventData);
      }
      
      if (platform === 'all' || platform === 'tiktok') {
        await this.trackTikTokEvent(eventName, eventData);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  private async trackGoogleAnalyticsEvent(eventName: string, eventData: EcommerceEvent): Promise<void> {
    if (!this.settings.googleAnalytics.enabled || typeof window === 'undefined' || !window.gtag) return;

    try {
      const gaEventName = this.mapEventNameForGA(eventName);
      const gaEventData = this.mapEventDataForGA(eventData);

      window.gtag('event', gaEventName, gaEventData);
    } catch (error) {
      console.error('Error tracking Google Analytics event:', error);
    }
  }

  private async trackFacebookEvent(eventName: string, eventData: EcommerceEvent): Promise<void> {
    if (!this.settings.facebookPixel.enabled || typeof window === 'undefined' || !window.fbq) return;

    try {
      const fbEventName = this.mapEventNameForFB(eventName);
      const fbEventData = this.mapEventDataForFB(eventData);

      window.fbq('track', fbEventName, fbEventData);
    } catch (error) {
      console.error('Error tracking Facebook event:', error);
    }
  }

  private async trackTikTokEvent(eventName: string, eventData: EcommerceEvent): Promise<void> {
    if (!this.settings.tiktokPixel.enabled || typeof window === 'undefined' || !window.ttq) return;

    try {
      const tiktokEventName = this.mapEventNameForTikTok(eventName);
      const tiktokEventData = this.mapEventDataForTikTok(eventData);

      window.ttq.track(tiktokEventName, tiktokEventData);
    } catch (error) {
      console.error('Error tracking TikTok event:', error);
    }
  }

  // Event name mapping methods
  private mapEventNameForGA(eventName: string): string {
    const mapping: Record<string, string> = {
      'page_view': 'page_view',
      'add_to_cart': 'add_to_cart',
      'purchase': 'purchase',
      'begin_checkout': 'begin_checkout',
      'search': 'search',
      'view_item': 'view_item',
      'add_to_wishlist': 'add_to_wishlist',
      'sign_up': 'sign_up',
      'login': 'login'
    };
    return mapping[eventName] || eventName;
  }

  private mapEventNameForFB(eventName: string): string {
    const mapping: Record<string, string> = {
      'page_view': 'PageView',
      'add_to_cart': 'AddToCart',
      'purchase': 'Purchase',
      'begin_checkout': 'InitiateCheckout',
      'search': 'Search',
      'view_item': 'ViewContent',
      'add_to_wishlist': 'AddToWishlist',
      'sign_up': 'CompleteRegistration',
      'login': 'Login'
    };
    return mapping[eventName] || eventName;
  }

  private mapEventNameForTikTok(eventName: string): string {
    const mapping: Record<string, string> = {
      'page_view': 'PageView',
      'add_to_cart': 'AddToCart',
      'purchase': 'PlaceAnOrder',
      'begin_checkout': 'InitiateCheckout',
      'search': 'Search',
      'view_item': 'ViewContent',
      'add_to_wishlist': 'AddToWishlist',
      'sign_up': 'CompleteRegistration',
      'login': 'Login'
    };
    return mapping[eventName] || eventName;
  }

  // Event data mapping methods
  private mapEventDataForGA(eventData: EcommerceEvent): any {
    const mapped: any = {};
    
    if (eventData.transaction_id) mapped.transaction_id = eventData.transaction_id;
    if (eventData.value) mapped.value = eventData.value;
    if (eventData.currency) mapped.currency = eventData.currency;
    if (eventData.items) mapped.items = eventData.items;
    if (eventData.search_string) mapped.search_term = eventData.search_string;
    
    return mapped;
  }

  private mapEventDataForFB(eventData: EcommerceEvent): any {
    const mapped: any = {};
    
    if (eventData.value) mapped.value = eventData.value;
    if (eventData.currency) mapped.currency = eventData.currency;
    if (eventData.content_ids) mapped.content_ids = eventData.content_ids;
    if (eventData.content_type) mapped.content_type = eventData.content_type;
    if (eventData.content_name) mapped.content_name = eventData.content_name;
    if (eventData.search_string) mapped.search_string = eventData.search_string;
    
    return mapped;
  }

  private mapEventDataForTikTok(eventData: EcommerceEvent): any {
    const mapped: any = {};
    
    if (eventData.value) mapped.value = eventData.value;
    if (eventData.currency) mapped.currency = eventData.currency;
    if (eventData.content_ids) mapped.content_ids = eventData.content_ids;
    if (eventData.content_type) mapped.content_type = eventData.content_type;
    if (eventData.content_name) mapped.content_name = eventData.content_name;
    if (eventData.search_string) mapped.query = eventData.search_string;
    
    return mapped;
  }

  // Convenience methods for common eCommerce events
  async trackPageView(page_location?: string, page_title?: string): Promise<void> {
    if (!this.settings.events.pageView) return;

    await this.trackEvent('page_view', {
      ...(page_location && { page_location }),
      ...(page_title && { page_title })
    } as any);
  }

  async trackAddToCart(item: any, value?: number, currency: string = 'USD'): Promise<void> {
    if (!this.settings.events.addToCart) return;

    await this.trackEvent('add_to_cart', {
      currency,
      value: value || item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity || 1,
        price: item.price
      }],
      content_ids: [item.id],
      content_type: 'product',
      content_name: item.name
    });
  }

  async trackPurchase(transactionId: string, value: number, currency: string = 'USD', items: any[] = []): Promise<void> {
    if (!this.settings.events.purchase) return;

    await this.trackEvent('purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      })),
      content_ids: items.map(item => item.id),
      content_type: 'product'
    });
  }

  async trackBeginCheckout(value: number, currency: string = 'USD', items: any[] = []): Promise<void> {
    if (!this.settings.events.beginCheckout) return;

    await this.trackEvent('begin_checkout', {
      value,
      currency,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      })),
      content_ids: items.map(item => item.id),
      content_type: 'product'
    });
  }

  async trackSearch(searchTerm: string): Promise<void> {
    if (!this.settings.events.search) return;

    await this.trackEvent('search', {
      search_string: searchTerm
    });
  }

  async trackViewContent(item: any): Promise<void> {
    if (!this.settings.events.viewContent) return;

    await this.trackEvent('view_item', {
      currency: 'USD',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: 1,
        price: item.price
      }],
      content_ids: [item.id],
      content_type: 'product',
      content_name: item.name
    });
  }

  async trackAddToWishlist(item: any): Promise<void> {
    if (!this.settings.events.addToWishlist) return;

    await this.trackEvent('add_to_wishlist', {
      currency: 'USD',
      value: item.price,
      content_ids: [item.id],
      content_type: 'product',
      content_name: item.name
    });
  }

  async trackSignUp(method?: string): Promise<void> {
    if (!this.settings.events.signUp) return;

    await this.trackEvent('sign_up', {
      method: method || 'email'
    } as any);
  }

  async trackLogin(method?: string): Promise<void> {
    if (!this.settings.events.login) return;

    await this.trackEvent('login', {
      method: method || 'email'
    } as any);
  }
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    ttq: any;
    dataLayer: any[];
  }
}

export const trackingService = new TrackingService();