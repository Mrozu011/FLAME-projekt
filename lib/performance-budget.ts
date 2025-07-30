// Performance budget monitoring and enforcement

interface PerformanceBudget {
  // Core Web Vitals thresholds
  lcp: number; // Largest Contentful Paint (ms)
  fcp: number; // First Contentful Paint (ms)
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay (ms)
  ttfb: number; // Time to First Byte (ms)
  
  // Resource budgets
  totalJSSize: number; // KB
  totalCSSSize: number; // KB
  totalImageSize: number; // KB
  totalFontSize: number; // KB
  
  // Network budgets
  totalRequests: number;
  criticalRequests: number;
  
  // Custom metrics
  interactionReadiness: number; // ms
  routeChangeTime: number; // ms
}

// Default performance budgets (aggressive for optimal UX)
const DEFAULT_BUDGET: PerformanceBudget = {
  // Core Web Vitals - targeting 75th percentile "Good" ratings
  lcp: 2500,  // Good: ≤ 2.5s
  fcp: 1800,  // Good: ≤ 1.8s  
  cls: 0.1,   // Good: ≤ 0.1
  fid: 100,   // Good: ≤ 100ms
  ttfb: 800,  // Good: ≤ 0.8s
  
  // Resource budgets for fast loading
  totalJSSize: 300,    // 300KB gzipped JS
  totalCSSSize: 50,    // 50KB gzipped CSS
  totalImageSize: 500, // 500KB total images per page
  totalFontSize: 100,  // 100KB total fonts
  
  // Network efficiency
  totalRequests: 50,     // Maximum requests per page
  criticalRequests: 10,  // Critical path requests
  
  // Custom UX metrics
  interactionReadiness: 3000, // Time until interactive
  routeChangeTime: 200,       // Client-side navigation speed
};

class PerformanceBudgetMonitor {
  private static instance: PerformanceBudgetMonitor;
  private budget: PerformanceBudget;
  private currentMetrics: Partial<PerformanceBudget> = {};
  private violations: Array<{
    metric: string;
    expected: number;
    actual: number;
    timestamp: number;
    severity: 'warning' | 'critical';
  }> = [];

  private constructor(customBudget?: Partial<PerformanceBudget>) {
    this.budget = { ...DEFAULT_BUDGET, ...customBudget };
    this.initializeMonitoring();
  }

  static getInstance(customBudget?: Partial<PerformanceBudget>): PerformanceBudgetMonitor {
    if (!PerformanceBudgetMonitor.instance) {
      PerformanceBudgetMonitor.instance = new PerformanceBudgetMonitor(customBudget);
    }
    return PerformanceBudgetMonitor.instance;
  }

  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor route changes
    this.observeRouteChanges();
    
    // Monitor interaction readiness
    this.observeInteractionReadiness();
    
    // Report violations periodically
    setInterval(() => this.reportViolations(), 10000);
  }

  private observeWebVitals(): void {
    if (!('PerformanceObserver' in window)) return;

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.checkMetric('lcp', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.checkMetric('fcp', entry.startTime);
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.checkMetric('cls', clsValue);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        this.checkMetric('fid', fid);
      }
    }).observe({ type: 'first-input', buffered: true });

    // Time to First Byte
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === window.location.href) {
          const ttfb = (entry as any).responseStart - (entry as any).requestStart;
          this.checkMetric('ttfb', ttfb);
        }
      }
    }).observe({ type: 'navigation', buffered: true });
  }

  private observeResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    new PerformanceObserver((list) => {
      let totalJS = 0, totalCSS = 0, totalImages = 0, totalFonts = 0;
      let totalRequests = 0, criticalRequests = 0;

      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        totalRequests++;

        // Classify as critical if loaded early
        if (resource.startTime < 2000) {
          criticalRequests++;
        }

        // Categorize by resource type
        const transferSize = resource.transferSize || 0;
        
        if (resource.name.includes('.js') || resource.initiatorType === 'script') {
          totalJS += transferSize / 1024; // Convert to KB
        } else if (resource.name.includes('.css') || resource.initiatorType === 'css') {
          totalCSS += transferSize / 1024;
        } else if (['img', 'image'].includes(resource.initiatorType) || 
                   /\.(jpg|jpeg|png|gif|webp|svg)/.test(resource.name)) {
          totalImages += transferSize / 1024;
        } else if (resource.name.includes('font') || /\.(woff|woff2|ttf|otf)/.test(resource.name)) {
          totalFonts += transferSize / 1024;
        }
      }

      this.checkMetric('totalJSSize', totalJS);
      this.checkMetric('totalCSSSize', totalCSS);
      this.checkMetric('totalImageSize', totalImages);
      this.checkMetric('totalFontSize', totalFonts);
      this.checkMetric('totalRequests', totalRequests);
      this.checkMetric('criticalRequests', criticalRequests);

    }).observe({ type: 'resource', buffered: true });
  }

  private observeRouteChanges(): void {
    let routeChangeStart = Date.now();

    // Monitor client-side navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      routeChangeStart = Date.now();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      routeChangeStart = Date.now();
      return originalReplaceState.apply(this, args);
    };

    // Measure route change completion
    const observer = new MutationObserver(() => {
      if (Date.now() - routeChangeStart > 50) { // Debounce
        const routeChangeTime = Date.now() - routeChangeStart;
        this.checkMetric('routeChangeTime', routeChangeTime);
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: false 
    });
  }

  private observeInteractionReadiness(): void {
    let interactionStart: number;

    // Monitor when interactions become responsive
    const checkInteractionReadiness = () => {
      interactionStart = performance.now();
      
      requestIdleCallback(() => {
        const readiness = performance.now() - interactionStart;
        this.checkMetric('interactionReadiness', readiness);
      });
    };

    window.addEventListener('load', checkInteractionReadiness);
    
    // Also check after major DOM changes
    let domChangeTimeout: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(domChangeTimeout);
      domChangeTimeout = setTimeout(checkInteractionReadiness, 500);
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  private checkMetric(metric: keyof PerformanceBudget, value: number): void {
    this.currentMetrics[metric] = value;
    const budgetValue = this.budget[metric];
    
    if (value > budgetValue) {
      const violation = {
        metric,
        expected: budgetValue,
        actual: value,
        timestamp: Date.now(),
        severity: this.getSeverity(metric, value, budgetValue)
      };

      this.violations.push(violation);
      
      // Log critical violations immediately
      if (violation.severity === 'critical') {
        this.reportViolation(violation);
      }
    }
  }

  private getSeverity(metric: string, actual: number, expected: number): 'warning' | 'critical' {
    const ratio = actual / expected;
    
    // Critical violations (>50% over budget)
    if (ratio > 1.5) return 'critical';
    
    // Critical metrics that should never exceed budget significantly
    if (['cls', 'fid', 'routeChangeTime'].includes(metric) && ratio > 1.2) {
      return 'critical';
    }
    
    return 'warning';
  }

  private reportViolation(violation: typeof this.violations[0]): void {
    const message = `Performance Budget Violation: ${violation.metric}
    Expected: ${violation.expected}
    Actual: ${violation.actual.toFixed(2)}
    Severity: ${violation.severity}`;

    if (violation.severity === 'critical') {
      console.error(message);
    } else {
      console.warn(message);
    }

    // Send to analytics (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_violation', {
        event_category: 'Performance',
        event_label: violation.metric,
        value: Math.round(violation.actual),
        custom_map: {
          expected_value: violation.expected,
          severity: violation.severity
        }
      });
    }
  }

  private reportViolations(): void {
    if (this.violations.length === 0) return;

    const recentViolations = this.violations.filter(
      v => Date.now() - v.timestamp < 10000
    );

    if (recentViolations.length > 0) {
      console.group('Performance Budget Report');
      recentViolations.forEach(violation => {
        this.reportViolation(violation);
      });
      console.groupEnd();
    }

    // Clear old violations
    this.violations = this.violations.filter(
      v => Date.now() - v.timestamp < 60000
    );
  }

  // Public API
  getCurrentMetrics(): Partial<PerformanceBudget> {
    return { ...this.currentMetrics };
  }

  getBudget(): PerformanceBudget {
    return { ...this.budget };
  }

  getViolations(): typeof this.violations {
    return [...this.violations];
  }

  updateBudget(newBudget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...newBudget };
  }

  // Generate Lighthouse-style performance score
  getPerformanceScore(): number {
    const weights = {
      fcp: 10,
      lcp: 25,
      cls: 25,
      fid: 25,
      ttfb: 15
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([metric, weight]) => {
      const current = this.currentMetrics[metric as keyof PerformanceBudget];
      const budget = this.budget[metric as keyof PerformanceBudget];
      
      if (current !== undefined) {
        const score = Math.max(0, Math.min(100, 100 - ((current - budget) / budget) * 100));
        totalScore += score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  // Export performance report
  exportReport(): {
    score: number;
    metrics: Partial<PerformanceBudget>;
    budget: PerformanceBudget;
    violations: typeof this.violations;
    recommendations: string[];
  } {
    const score = this.getPerformanceScore();
    const recommendations: string[] = [];

    // Generate recommendations based on violations
    this.violations.forEach(violation => {
      switch (violation.metric) {
        case 'lcp':
          recommendations.push('Optimize image loading and reduce server response times');
          break;
        case 'fcp':
          recommendations.push('Minimize render-blocking resources');
          break;
        case 'cls':
          recommendations.push('Avoid layout shifts by setting image dimensions');
          break;
        case 'fid':
          recommendations.push('Reduce JavaScript execution time');
          break;
        case 'totalJSSize':
          recommendations.push('Implement code splitting and tree shaking');
          break;
        case 'totalRequests':
          recommendations.push('Combine resources and use HTTP/2 server push');
          break;
        case 'routeChangeTime':
          recommendations.push('Optimize client-side routing performance');
          break;
      }
    });

    return {
      score,
      metrics: this.getCurrentMetrics(),
      budget: this.getBudget(),
      violations: this.getViolations(),
      recommendations: [...new Set(recommendations)]
    };
  }
}

// Export singleton and utilities
export const performanceBudget = PerformanceBudgetMonitor.getInstance();

export const initializePerformanceBudget = (customBudget?: Partial<PerformanceBudget>) => {
  return PerformanceBudgetMonitor.getInstance(customBudget);
};

export const getPerformanceReport = () => {
  return performanceBudget.exportReport();
};

// React hook for performance monitoring
export const usePerformanceBudget = () => {
  const getMetrics = () => performanceBudget.getCurrentMetrics();
  const getScore = () => performanceBudget.getPerformanceScore();
  const getReport = () => performanceBudget.exportReport();
  
  return {
    getMetrics,
    getScore,
    getReport,
  };
};