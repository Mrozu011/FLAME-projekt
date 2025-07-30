
// Ultra-optimized performance monitoring and optimization utilities

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
  tti: number; // Time to Interactive
}

export interface PerformanceBudget {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
  bundleSize: number;
  imageSize: number;
}

// Performance budgets for different page types
export const PERFORMANCE_BUDGETS: Record<string, PerformanceBudget> = {
  homepage: { fcp: 1500, lcp: 2500, cls: 0.1, fid: 100, ttfb: 600, bundleSize: 500000, imageSize: 1000000 },
  product: { fcp: 1800, lcp: 2800, cls: 0.1, fid: 100, ttfb: 800, bundleSize: 600000, imageSize: 2000000 },
  admin: { fcp: 2000, lcp: 3000, cls: 0.1, fid: 100, ttfb: 1000, bundleSize: 800000, imageSize: 1500000 }
};

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private budget: PerformanceBudget;
  private alerts: string[] = [];

  private constructor() {
    this.budget = this.getBudgetForPage();
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.initializeResourceMonitoring();
      this.optimizeExistingResources();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private getBudgetForPage(): PerformanceBudget {
    if (typeof window === 'undefined') return PERFORMANCE_BUDGETS.homepage;
    
    const path = window.location.pathname;
    if (path.includes('/admin')) return PERFORMANCE_BUDGETS.admin;
    if (path.includes('/product')) return PERFORMANCE_BUDGETS.product;
    return PERFORMANCE_BUDGETS.homepage;
  }

  private initializeObservers(): void {
    // Combined observer for paint metrics
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.name) {
          case 'first-contentful-paint':
            this.metrics.fcp = entry.startTime;
            this.checkBudget('fcp', entry.startTime);
            break;
          case 'first-meaningful-paint':
            this.metrics.fmp = entry.startTime;
            break;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // LCP Observer
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.checkBudget('lcp', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS Observer with session tracking
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];
    
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
          
          if (!firstSessionEntry || entry.startTime - lastSessionEntry.startTime > 1000 || entry.startTime - firstSessionEntry.startTime > 5000) {
            sessionValue = entry.value;
            sessionEntries = [entry];
          } else {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          }
          
          clsValue = Math.max(sessionValue, clsValue);
        }
      }
      this.metrics.cls = clsValue;
      this.checkBudget('cls', clsValue);
    }).observe({ type: 'layout-shift', buffered: true });

    // FID Observer
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.checkBudget('fid', this.metrics.fid);
      }
    }).observe({ type: 'first-input', buffered: true });

    // Navigation timing for TTFB and TTI
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === window.location.href) {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
          this.checkBudget('ttfb', this.metrics.ttfb);
          
          // Approximate TTI calculation
          this.metrics.tti = navEntry.domContentLoadedEventEnd - navEntry.navigationStart;
        }
      }
    }).observe({ type: 'navigation', buffered: true });
  }

  private initializeResourceMonitoring(): void {
    // Monitor resource loading
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Alert on slow resources
        if (resource.duration > 3000) {
          this.addAlert(`Slow resource: ${resource.name} (${Math.round(resource.duration)}ms)`);
        }
        
        // Monitor large images
        if (resource.name.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
          if (resource.transferSize > this.budget.imageSize) {
            this.addAlert(`Large image: ${resource.name} (${Math.round(resource.transferSize / 1024)}KB)`);
          }
        }
      }
    }).observe({ type: 'resource', buffered: true });
  }

  private optimizeExistingResources(): void {
    // Optimize images already in DOM
    this.optimizeImages();
    
    // Defer non-critical scripts
    this.deferNonCriticalScripts();
    
    // Preconnect to critical domains
    this.preconnectCriticalDomains();
    
    // Enable resource compression hints
    this.enableCompressionHints();
  }

  private checkBudget(metric: keyof PerformanceBudget, value: number): void {
    const budgetValue = this.budget[metric];
    if (value > budgetValue) {
      this.addAlert(`Performance budget exceeded: ${metric} (${Math.round(value)} > ${budgetValue})`);
    }
  }

  private addAlert(message: string): void {
    this.alerts.push(message);
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚡ Performance Alert: ${message}`);
    }
  }

  // Optimized image loading
  private optimizeImages(): void {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach((img: HTMLImageElement) => {
      img.dataset.optimized = 'true';
      
      // Add loading and decoding attributes
      if (!img.loading) img.loading = 'lazy';
      if (!img.decoding) img.decoding = 'async';
      
      // Convert to WebP if supported and not already WebP
      if ('createImageBitmap' in window && !img.src.includes('.webp')) {
        const originalSrc = img.src;
        if (originalSrc.includes('readdy.ai/api/search-image')) {
          const url = new URL(originalSrc);
          url.searchParams.set('format', 'webp');
          url.searchParams.set('quality', '80');
          img.src = url.toString();
        }
      }
    });
  }

  // Defer non-critical scripts
  private deferNonCriticalScripts(): void {
    const scripts = document.querySelectorAll('script[src]:not([data-critical]):not([defer]):not([async])');
    
    scripts.forEach((script: HTMLScriptElement) => {
      if (!script.src.includes('googleapis.com') && !script.src.includes('gtm')) {
        script.defer = true;
      }
    });
  }

  // Preconnect to critical domains
  private preconnectCriticalDomains(): void {
    const criticalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://readdy.ai',
      'https://cdn.jsdelivr.net'
    ];

    criticalDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"][rel="preconnect"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      }
    });
  }

  // Enable compression hints
  private enableCompressionHints(): void {
    // Add accept-encoding header hint
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'SET_COMPRESSION',
            compression: ['br', 'gzip']
          });
        }
      });
    }
  }

  // Advanced lazy loading with intersection observer
  lazyLoadWithPriority(selector: string = 'img[data-src], iframe[data-src], video[data-src]'): void {
    if (typeof window === 'undefined') return;

    const elements = document.querySelectorAll(selector);
    
    if ('IntersectionObserver' in window) {
      // High priority observer for above-the-fold content
      const highPriorityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target as HTMLElement, 'high');
            highPriorityObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px',
        threshold: 0.1
      });

      // Low priority observer for below-the-fold content
      const lowPriorityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target as HTMLElement, 'low');
            lowPriorityObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });

      elements.forEach((element, index) => {
        // First 3 elements get high priority
        if (index < 3) {
          highPriorityObserver.observe(element);
        } else {
          lowPriorityObserver.observe(element);
        }
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      elements.forEach(element => {
        this.loadElement(element as HTMLElement, 'high');
      });
    }
  }

  private loadElement(element: HTMLElement, priority: 'high' | 'low'): void {
    if (element.dataset.loaded) return;

    const src = element.dataset.src;
    if (!src) return;

    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      img.loading = priority === 'high' ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.src = src;
    } else if (element.tagName === 'IFRAME') {
      const iframe = element as HTMLIFrameElement;
      iframe.loading = 'lazy';
      iframe.src = src;
    } else if (element.tagName === 'VIDEO') {
      const video = element as HTMLVideoElement;
      video.src = src;
      video.load();
    }

    element.dataset.loaded = 'true';
    delete element.dataset.src;
  }

  // Resource prefetching with priority
  prefetchResource(href: string, as: string, priority: 'high' | 'low' = 'low'): void {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = priority === 'high' ? 'preload' : 'prefetch';
    link.href = href;
    link.as = as;
    
    if (priority === 'high') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  }

  // Critical CSS inlining with optimization
  inlineCriticalCSS(css: string): void {
    if (typeof document === 'undefined') return;

    // Minify CSS
    const minifiedCSS = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
      .trim();

    const style = document.createElement('style');
    style.setAttribute('data-critical', 'true');
    style.textContent = minifiedCSS;
    
    // Insert before first stylesheet
    const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
    if (firstStylesheet) {
      document.head.insertBefore(style, firstStylesheet);
    } else {
      document.head.appendChild(style);
    }
  }

  // Bundle optimization
  optimizeBundle(): void {
    // Code splitting hints for webpack
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle optimization hints:', {
        'Split admin routes': 'Use dynamic imports for admin pages',
        'Lazy load components': 'Use React.lazy for heavy components',
        'Tree shake unused code': 'Remove unused imports and functions',
        'Minimize dependencies': 'Use lighter alternatives where possible'
      });
    }
  }

  // Memory optimization
  optimizeMemory(): void {
    if (typeof window === 'undefined') return;

    // Clean up event listeners on page change
    const cleanup = () => {
      // Remove all custom event listeners
      const elements = document.querySelectorAll('[data-listeners]');
      elements.forEach(element => {
        element.removeAttribute('data-listeners');
      });
    };

    // Listen for page navigation
    window.addEventListener('beforeunload', cleanup);
    
    // Garbage collection hints (if available)
    if ('gc' in window && typeof window.gc === 'function') {
      setTimeout(() => {
        try {
          window.gc();
        } catch (e) {
          // Ignore errors
        }
      }, 5000);
    }
  }

  // Get performance report
  getPerformanceReport(): {
    metrics: Partial<PerformanceMetrics>;
    budget: PerformanceBudget;
    alerts: string[];
    score: number;
  } {
    const score = this.calculatePerformanceScore();
    
    return {
      metrics: { ...this.metrics },
      budget: { ...this.budget },
      alerts: [...this.alerts],
      score
    };
  }

  private calculatePerformanceScore(): number {
    let score = 100;
    let checks = 0;

    Object.entries(this.budget).forEach(([key, budgetValue]) => {
      const metricValue = this.metrics[key as keyof PerformanceMetrics];
      if (metricValue !== undefined && key !== 'bundleSize' && key !== 'imageSize') {
        checks++;
        if (metricValue > budgetValue) {
          const penalty = Math.min(30, (metricValue - budgetValue) / budgetValue * 50);
          score -= penalty;
        }
      }
    });

    return Math.max(0, Math.round(score));
  }
}

// Service Worker with advanced caching
export const registerAdvancedServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/advanced-sw.js');
      
      // Update service worker when new version available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Notify user of update
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  }
};

// Font optimization with variable fonts
export class FontOptimizer {
  private static loadedFonts: Set<string> = new Set();

  static async loadFont(fontFamily: string, weights: string[] = ['400'], display = 'swap'): Promise<void> {
    if (typeof document === 'undefined') return;

    const fontKey = `${fontFamily}-${weights.join(',')}`;
    if (this.loadedFonts.has(fontKey)) return;

    // Use variable font if available
    const isVariableFont = weights.length > 2 || weights.some(w => w.includes(':'));
    const weightParam = isVariableFont ? 'wght@100..900' : `wght@${weights.join(';')}`;
    
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:${weightParam}&display=${display}`;
    
    // Preload font with high priority
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'style';
    link.onload = () => {
      link.onload = null;
      link.rel = 'stylesheet';
    };
    
    document.head.appendChild(link);
    this.loadedFonts.add(fontKey);
  }

  static optimizeWebFonts(): void {
    // Add font-display: swap to all font faces
    document.fonts.ready.then(() => {
      document.fonts.forEach(font => {
        // This will be handled by CSS font-display property
      });
    });

    // Preload critical font subsets
    const criticalFonts = [
      { family: 'Inter', weights: ['400', '500', '600'], subset: 'latin' },
      { family: 'Pacifico', weights: ['400'], subset: 'latin' }
    ];

    criticalFonts.forEach(({ family, weights }) => {
      this.loadFont(family, weights);
    });
  }
}

// Initialize comprehensive performance optimization
export const initializeAdvancedPerformance = (): void => {
  if (typeof window !== 'undefined') {
    const monitor = PerformanceMonitor.getInstance();
    
    // Initialize all optimizations
    requestIdleCallback(() => {
      monitor.lazyLoadWithPriority();
      monitor.optimizeBundle();
      monitor.optimizeMemory();
      FontOptimizer.optimizeWebFonts();
    });

    // Register advanced service worker
    registerAdvancedServiceWorker();

    // Performance reporting (development only)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const report = monitor.getPerformanceReport();
        console.log('🚀 Performance Report:', report);
      }, 5000);
    }
  }
};
