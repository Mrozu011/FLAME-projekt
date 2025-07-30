
// Enhanced error handler with better logging and debugging capabilities
class ErrorHandlerService {
  private errorQueue: any[] = [];
  private isProcessing = false;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(event.reason, 'unhandled-promise');
        event.preventDefault();
      });

      // Handle global JavaScript errors
      window.addEventListener('error', (event) => {
        this.handleError(new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`), 'global-error');
      });

      // Handle React error boundaries
      window.addEventListener('react-error', (event) => {
        this.handleError((event as any).detail, 'react-error');
      });
    }
  }

  handleError(error: any, context?: string, metadata?: any) {
    try {
      const errorInfo = {
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        context: context || 'unknown',
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'N/A',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
        metadata: metadata || {},
        id: this.generateErrorId()
      };

      // Log to console in development only
      if (process.env.NODE_ENV === 'development') {
        console.group(`🔴 Error ${errorInfo.id}`);
        console.error('Message:', errorInfo.message);
        console.error('Context:', errorInfo.context);
        console.error('Stack:', errorInfo.stack);
        console.error('Metadata:', errorInfo.metadata);
        console.groupEnd();
      }

      // Queue error for processing
      this.queueError(errorInfo);

    } catch (handlingError) {
      // Fallback error handling to prevent infinite loops
      console.error('Error in error handler:', handlingError);
    }
  }

  handleApiError(error: any, endpoint?: string) {
    const apiError = {
      ...error,
      endpoint,
      type: 'api-error',
      status: error.status || 'unknown',
      response: error.response || null
    };

    this.handleError(apiError, 'api-error', { endpoint });
    
    // Return a user-friendly error message
    return {
      success: false,
      error: this.getUserFriendlyMessage(apiError),
      code: apiError.status || 'UNKNOWN_ERROR'
    };
  }

  private queueError(errorInfo: any) {
    this.errorQueue.push(errorInfo);
    
    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  private async processErrorQueue() {
    if (this.errorQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;

    while (this.errorQueue.length > 0) {
      const errorInfo = this.errorQueue.shift();
      
      try {
        await this.processError(errorInfo);
      } catch (processingError) {
        console.error('Failed to process error:', processingError);
      }
    }

    this.isProcessing = false;
  }

  private async processError(errorInfo: any) {
    // Store error locally
    this.storeErrorLocally(errorInfo);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      await this.sendErrorToMonitoring(errorInfo);
    }
  }

  private storeErrorLocally(errorInfo: any) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push(errorInfo);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
          errors.splice(0, errors.length - 50);
        }
        
        localStorage.setItem('app_errors', JSON.stringify(errors));
      }
    } catch (storageError) {
      console.warn('Failed to store error locally:', storageError);
    }
  }

  private async sendErrorToMonitoring(errorInfo: any, retryCount = 0) {
    try {
      if (typeof window === 'undefined') return;

      // Simulated monitoring service call
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (sendError) {
      if (retryCount < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.sendErrorToMonitoring(errorInfo, retryCount + 1);
      }
      console.warn('Failed to send error to monitoring service after retries:', sendError);
    }
  }

  private getUserFriendlyMessage(error: any): string {
    if (error.status === 404) return 'Requested resource not found';
    if (error.status === 500) return 'Internal server error occurred';
    if (error.status === 403) return 'Access denied';
    if (error.status === 401) return 'Authentication required';
    if (error.code === 'NETWORK_ERROR') return 'Network connection error';
    if (error.message?.includes('fetch')) return 'Network request failed';
    
    return 'An unexpected error occurred';
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  logError(message: string, context?: string, metadata?: any) {
    const error = new Error(message);
    this.handleError(error, context, metadata);
  }

  // Enhanced fetch wrapper with error handling
  async safeFetch(url: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        this.handleError(timeoutError, 'fetch-timeout', { url, options });
        throw timeoutError;
      }

      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.safeFetch(url, options, retryCount + 1);
      }

      this.handleApiError(error, url);
      throw error;
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return (
      error.code === 'NETWORK_ERROR' ||
      (error.status && error.status >= 500) ||
      error.name === 'TypeError' // Often network-related
    );
  }

  // Get stored errors for debugging
  getStoredErrors(): any[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(localStorage.getItem('app_errors') || '[]');
      }
    } catch (error) {
      console.warn('Failed to retrieve stored errors:', error);
    }
    return [];
  }

  // Clear stored errors
  clearStoredErrors(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('app_errors');
      }
    } catch (error) {
      console.warn('Failed to clear stored errors:', error);
    }
  }

  // Report error statistics
  getErrorStatistics() {
    const errors = this.getStoredErrors();
    const stats = {
      total: errors.length,
      byContext: {} as Record<string, number>,
      byHour: {} as Record<string, number>,
      recent: errors.slice(-10)
    };

    errors.forEach(error => {
      // Count by context
      const context = error.context || 'unknown';
      stats.byContext[context] = (stats.byContext[context] || 0) + 1;

      // Count by hour
      const hour = new Date(error.timestamp).getHours();
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
const errorHandler = new ErrorHandlerService();

// Enhanced console error override for better error capture
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Only log to our system if it's not already processed
    if (!args.some(arg => typeof arg === 'string' && arg.includes('Error Report'))) {
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      errorHandler.handleError(
        new Error(errorMessage),
        'console-error',
        { originalArgs: args }
      );
    }
    
    // Call original console.error in development
    if (process.env.NODE_ENV === 'development') {
      originalConsoleError.apply(console, args);
    }
  };
}

export { errorHandler };
export default errorHandler;
