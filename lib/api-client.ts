'use client';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultTimeout = config.timeout || 10000;
    this.defaultRetries = config.retries || 3;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers
    };
    
    this.loadAuthToken();
  }

  private loadAuthToken(): void {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('token');
    }
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async makeRequest<T>(
    url: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      skipAuth = false,
      ...fetchOptions
    } = options;

    let lastError: Error;
    let attempt = 0;

    while (attempt < retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Prepare headers
        const headers = {
          ...this.defaultHeaders,
          ...fetchOptions.headers
        };

        // Add authentication if available and not skipped
        if (!skipAuth && this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        // Make the request
        const response = await fetch(`${this.baseURL}${url}`, {
          ...fetchOptions,
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle different HTTP status codes
        if (response.status === 401) {
          this.handleUnauthorized();
          return {
            success: false,
            error: 'Unauthorized - Please log in again',
            statusCode: 401
          };
        }

        if (response.status === 403) {
          return {
            success: false,
            error: 'Forbidden - Insufficient permissions',
            statusCode: 403
          };
        }

        if (response.status === 404) {
          return {
            success: false,
            error: 'Resource not found',
            statusCode: 404
          };
        }

        if (response.status === 429) {
          // Rate limit exceeded - wait before retry
          const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
          await this.delay(retryAfter * 1000);
          attempt++;
          continue;
        }

        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }

        // Parse response
        let data: T;
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text() as T;
        }

        if (!response.ok) {
          return {
            success: false,
            error: typeof data === 'string' ? data : 'Request failed',
            statusCode: response.status
          };
        }

        return {
          success: true,
          data,
          statusCode: response.status
        };

      } catch (error) {
        lastError = error as Error;
        attempt++;

        // Don't retry on certain errors
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
            statusCode: 408
          };
        }

        if (error.message.includes('Failed to fetch')) {
          console.warn(`Network error on attempt ${attempt}/${retries}:`, error.message);
        } else {
          console.error(`API request error on attempt ${attempt}/${retries}:`, error);
        }

        // Wait before retry with exponential backoff
        if (attempt < retries) {
          const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await this.delay(delayMs);
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Request failed after multiple attempts',
      statusCode: 0
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleUnauthorized(): void {
    this.setAuthToken(null);
    // Dispatch custom event for components to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  // HTTP Methods
  async get<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async patch<T>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: 'DELETE' });
  }

  // Form data upload
  async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.makeRequest<T>(url, {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', { timeout: 5000, retries: 1 });
      return response.success;
    } catch {
      return false;
    }
  }

  // Batch requests
  async batch<T>(requests: Array<{ url: string; method?: string; data?: any }>): Promise<ApiResponse<T[]>> {
    const promises = requests.map(req => 
      this.makeRequest(req.url, {
        method: req.method || 'GET',
        body: req.data ? JSON.stringify(req.data) : undefined
      })
    );

    try {
      const results = await Promise.allSettled(promises);
      const data = results.map(result => 
        result.status === 'fulfilled' ? result.value : { success: false, error: 'Request failed' }
      );

      return {
        success: true,
        data: data as T[]
      };
    } catch (error) {
      return {
        success: false,
        error: 'Batch request failed'
      };
    }
  }
}

// Global instance
export const apiClient = new ApiClient({
  timeout: 15000,
  retries: 3
});

// Hook for React components
export function useApiClient() {
  return apiClient;
}

// Error boundary helper
export function isApiError(error: any): error is ApiResponse {
  return typeof error === 'object' && 'success' in error && error.success === false;
}

// Utility functions
export function handleApiError(error: ApiResponse | Error): string {
  if (isApiError(error)) {
    return error.error || error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Request interceptor type
export type RequestInterceptor = (url: string, options: RequestInit) => RequestInit | Promise<RequestInit>;

// Response interceptor type  
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;