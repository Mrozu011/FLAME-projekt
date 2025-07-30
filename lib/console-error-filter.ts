// Console error filtering system to prevent spam and improve debugging
class ConsoleErrorFilter {
  private errorCounts = new Map<string, number>();
  private lastErrors = new Map<string, number>();
  private readonly maxSameErrorsPerMinute = 5;
  private readonly cleanupInterval = 60000; // 1 minute
  
  constructor() {
    this.startCleanupTimer();
  }

  private startCleanupTimer() {
    setInterval(() => {
      const now = Date.now();
      // Clean up old error entries
      for (const [key, timestamp] of this.lastErrors.entries()) {
        if (now - timestamp > this.cleanupInterval) {
          this.lastErrors.delete(key);
          this.errorCounts.delete(key);
        }
      }
    }, this.cleanupInterval);
  }

  private getErrorKey(args: any[]): string {
    // Create a unique key for this error type
    return args.map(arg => {
      if (typeof arg === 'string') {
        // Extract the core error message, removing dynamic parts
        return arg
          .replace(/\d{13,}/g, '[timestamp]') // Replace timestamps
          .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[uuid]') // Replace UUIDs
          .replace(/:\d+:\d+/g, ':[line]:[col]') // Replace line:column numbers
          .substring(0, 100); // Limit length
      }
      return String(arg).substring(0, 50);
    }).join('|');
  }

  shouldLogError(args: any[]): boolean {
    const errorKey = this.getErrorKey(args);
    const now = Date.now();
    
    // Check if we've seen this error recently
    const lastSeen = this.lastErrors.get(errorKey) || 0;
    const count = this.errorCounts.get(errorKey) || 0;
    
    // Reset count if it's been more than a minute
    if (now - lastSeen > this.cleanupInterval) {
      this.errorCounts.set(errorKey, 1);
      this.lastErrors.set(errorKey, now);
      return true;
    }
    
    // Check if we're under the limit
    if (count < this.maxSameErrorsPerMinute) {
      this.errorCounts.set(errorKey, count + 1);
      this.lastErrors.set(errorKey, now);
      return true;
    }
    
    // We've hit the limit for this error type
    return false;
  }

  getFilteredStats() {
    return {
      uniqueErrors: this.errorCounts.size,
      totalFiltered: Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0)
    };
  }
}

// Create singleton instance
const consoleFilter = new ConsoleErrorFilter();

// Override console methods with filtering
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args) => {
    // Filter out specific known issues that are not actionable
    const firstArg = String(args[0] || '');
    
    // Skip certain React DevTools warnings in development
    if (process.env.NODE_ENV === 'development') {
      const skipPatterns = [
        'Warning: React has detected a change in the order of Hooks',
        'Warning: Each child in a list should have a unique',
        'Warning: Failed prop type',
        'Download the React DevTools',
      ];
      
      if (skipPatterns.some(pattern => firstArg.includes(pattern))) {
        return originalError.apply(console, args);
      }
    }

    // Skip hydration warnings that are expected
    if (firstArg.includes('Hydration failed') || firstArg.includes('suppressHydrationWarning')) {
      return; // Completely skip these
    }

    // Apply rate limiting
    if (consoleFilter.shouldLogError(args)) {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args) => {
    const firstArg = String(args[0] || '');
    
    // Skip certain warnings that are not actionable
    const skipPatterns = [
      'componentWillReceiveProps has been renamed',
      'componentWillMount has been renamed',
      'A future version of React will render content differently',
    ];
    
    if (skipPatterns.some(pattern => firstArg.includes(pattern))) {
      return;
    }

    if (consoleFilter.shouldLogError(args)) {
      originalWarn.apply(console, args);
    }
  };
}

export { consoleFilter };
export default consoleFilter;