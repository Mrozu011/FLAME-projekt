// Route optimization and preloading utilities

interface RoutePreloadConfig {
  priority: 'high' | 'medium' | 'low';
  delay?: number;
  conditions?: () => boolean;
}

class RouteOptimizer {
  private static instance: RouteOptimizer;
  private prefetchedRoutes = new Set<string>();
  private preloadTimeouts = new Map<string, NodeJS.Timeout>();
  private routeCache = new Map<string, any>();
  private observer?: IntersectionObserver;

  private constructor() {
    this.initializeLinkObserver();
  }

  static getInstance(): RouteOptimizer {
    if (!RouteOptimizer.instance) {
      RouteOptimizer.instance = new RouteOptimizer();
    }
    return RouteOptimizer.instance;
  }

  // Initialize intersection observer for automatic link prefetching
  private initializeLinkObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = link.getAttribute('href');
            
            if (href && this.shouldPrefetch(href)) {
              this.prefetchRoute(href, { priority: 'low', delay: 100 });
            }
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    // Start observing links after a delay
    setTimeout(() => {
      this.observeLinks();
    }, 2000);
  }

  // Observe all links on the page
  private observeLinks(): void {
    if (!this.observer) return;

    const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    links.forEach((link) => {
      this.observer!.observe(link);
    });
  }

  // Determine if a route should be prefetched
  private shouldPrefetch(href: string): boolean {
    // Skip if already prefetched
    if (this.prefetchedRoutes.has(href)) return false;

    // Skip external links
    if (href.startsWith('http') && !href.includes(window.location.origin)) return false;

    // Skip certain file types
    const skipExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.mp4'];
    if (skipExtensions.some(ext => href.toLowerCase().includes(ext))) return false;

    // Skip anchors and queries for now (could be enhanced)
    if (href.includes('#')) return false;

    return true;
  }

  // Prefetch a route with configuration
  prefetchRoute(href: string, config: RoutePreloadConfig = { priority: 'medium' }): void {
    if (this.prefetchedRoutes.has(href)) return;

    // Check conditions if provided
    if (config.conditions && !config.conditions()) return;

    const delay = config.delay || this.getDelayByPriority(config.priority);

    // Clear existing timeout if any
    const existingTimeout = this.preloadTimeouts.get(href);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      this.executePrefetch(href, config.priority);
      this.preloadTimeouts.delete(href);
    }, delay);

    this.preloadTimeouts.set(href, timeout);
  }

  // Execute the actual prefetching
  private executePrefetch(href: string, priority: 'high' | 'medium' | 'low'): void {
    if (this.prefetchedRoutes.has(href)) return;

    this.prefetchedRoutes.add(href);

    // Create prefetch link
    const link = document.createElement('link');
    link.rel = priority === 'high' ? 'preload' : 'prefetch';
    link.href = href;
    link.as = 'document';

    // Add to head
    document.head.appendChild(link);

    // Also prefetch associated resources
    if (priority === 'high') {
      this.preloadAssociatedResources(href);
    }

    // Cache route metadata
    this.cacheRouteMetadata(href);

    console.log(`Prefetched route: ${href} (${priority} priority)`);
  }

  // Preload resources likely to be needed for a route
  private preloadAssociatedResources(href: string): void {
    const resourceHints = this.getResourceHintsForRoute(href);
    
    resourceHints.forEach(({ type, url }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;
      document.head.appendChild(link);
    });
  }

  // Get resource hints based on route patterns
  private getResourceHintsForRoute(href: string): Array<{ type: string; url: string }> {
    const hints: Array<{ type: string; url: string }> = [];

    // Common resources for all routes
    hints.push(
      { type: 'font', url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' }
    );

    // Route-specific resources
    if (href.includes('/product/')) {
      hints.push(
        { type: 'image', url: 'https://readdy.ai/api/placeholder-product.jpg' },
        { type: 'script', url: '/js/product-viewer.js' }
      );
    } else if (href.includes('/cart') || href.includes('/checkout')) {
      hints.push(
        { type: 'script', url: '/js/payment-sdk.js' },
        { type: 'style', url: '/css/checkout.css' }
      );
    }

    return hints;
  }

  // Cache route metadata for faster navigation
  private cacheRouteMetadata(href: string): void {
    const metadata = {
      href,
      prefetchedAt: Date.now(),
      estimatedLoadTime: this.estimateLoadTime(href),
      dependencies: this.getRouteDependencies(href),
    };

    this.routeCache.set(href, metadata);
  }

  // Estimate load time based on route complexity
  private estimateLoadTime(href: string): number {
    if (href === '/' || href === '/home') return 800;
    if (href.includes('/product/')) return 1200;
    if (href.includes('/checkout')) return 1500;
    if (href.includes('/admin/')) return 2000;
    return 1000; // Default estimate
  }

  // Get dependencies for a route
  private getRouteDependencies(href: string): string[] {
    const dependencies: string[] = [];

    if (href.includes('/product/')) {
      dependencies.push('product-data', 'reviews', 'recommendations');
    } else if (href.includes('/cart')) {
      dependencies.push('cart-items', 'shipping-options', 'payment-methods');
    } else if (href.includes('/checkout')) {
      dependencies.push('user-addresses', 'payment-methods', 'shipping-calculations');
    }

    return dependencies;
  }

  // Get delay based on priority
  private getDelayByPriority(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 0;
      case 'medium': return 100;
      case 'low': return 500;
      default: return 100;
    }
  }

  // Prefetch routes based on user behavior patterns
  prefetchByBehavior(currentRoute: string, userHistory: string[]): void {
    const predictions = this.predictNextRoutes(currentRoute, userHistory);
    
    predictions.forEach((prediction, index) => {
      const priority = index === 0 ? 'high' : index < 3 ? 'medium' : 'low';
      this.prefetchRoute(prediction.route, { 
        priority, 
        delay: index * 200,
        conditions: () => prediction.confidence > 0.3 
      });
    });
  }

  // Predict next routes based on patterns
  private predictNextRoutes(currentRoute: string, userHistory: string[]): Array<{ route: string; confidence: number }> {
    const predictions: Array<{ route: string; confidence: number }> = [];

    // Pattern: Product page -> Cart
    if (currentRoute.includes('/product/')) {
      predictions.push({ route: '/cart', confidence: 0.6 });
      predictions.push({ route: '/checkout', confidence: 0.3 });
    }

    // Pattern: Cart -> Checkout
    if (currentRoute === '/cart') {
      predictions.push({ route: '/checkout', confidence: 0.8 });
      predictions.push({ route: '/login', confidence: 0.4 });
    }

    // Pattern: Category browsing
    if (currentRoute.includes('/women') || currentRoute.includes('/men')) {
      predictions.push({ route: '/accessories', confidence: 0.4 });
      predictions.push({ route: '/sale', confidence: 0.3 });
    }

    // Based on user history frequency
    const routeFrequency = this.analyzeRouteFrequency(userHistory);
    Object.entries(routeFrequency)
      .filter(([route]) => route !== currentRoute)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .forEach(([route, frequency]) => {
        predictions.push({ route, confidence: frequency / userHistory.length });
      });

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  // Analyze route frequency in user history
  private analyzeRouteFrequency(history: string[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    history.forEach(route => {
      frequency[route] = (frequency[route] || 0) + 1;
    });

    return frequency;
  }

  // Preload critical routes immediately
  preloadCriticalRoutes(): void {
    const criticalRoutes = [
      '/',
      '/cart',
      '/login',
      '/register',
      '/women',
      '/men'
    ];

    criticalRoutes.forEach((route, index) => {
      this.prefetchRoute(route, { 
        priority: 'high', 
        delay: index * 50 
      });
    });
  }

  // Clear prefetch cache
  clearPrefetchCache(): void {
    this.prefetchedRoutes.clear();
    this.routeCache.clear();
    this.preloadTimeouts.forEach(timeout => clearTimeout(timeout));
    this.preloadTimeouts.clear();
  }

  // Get cache statistics
  getCacheStats(): {
    prefetchedCount: number;
    cachedRoutes: string[];
    pendingPrefetches: number;
  } {
    return {
      prefetchedCount: this.prefetchedRoutes.size,
      cachedRoutes: Array.from(this.prefetchedRoutes),
      pendingPrefetches: this.preloadTimeouts.size,
    };
  }

  // Cleanup method
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearPrefetchCache();
  }
}

// Export singleton instance
export const routeOptimizer = RouteOptimizer.getInstance();

// Utility functions for components
export const prefetchRoute = (href: string, config?: RoutePreloadConfig) => {
  routeOptimizer.prefetchRoute(href, config);
};

export const preloadCriticalRoutes = () => {
  routeOptimizer.preloadCriticalRoutes();
};

export const prefetchByBehavior = (currentRoute: string, userHistory: string[]) => {
  routeOptimizer.prefetchByBehavior(currentRoute, userHistory);
};

// React hook for route prefetching
export const useRoutePrefetch = () => {
  const prefetch = (href: string, config?: RoutePreloadConfig) => {
    routeOptimizer.prefetchRoute(href, config);
  };

  const preloadCritical = () => {
    routeOptimizer.preloadCriticalRoutes();
  };

  const getCacheStats = () => {
    return routeOptimizer.getCacheStats();
  };

  return {
    prefetch,
    preloadCritical,
    getCacheStats,
  };
};