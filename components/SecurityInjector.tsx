
'use client';

import { useEffect } from 'react';
import { errorHandler } from '@/lib/error-handler';

export default function SecurityInjector() {
  useEffect(() => {
    let isComponentMounted = true;
    
    const initializeSecurity = async () => {
      try {
        if (!isComponentMounted) return;

        // Enhanced security headers check with error handling
        const checkSecurityHeaders = () => {
          try {
            // Content Security Policy
            if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
              const csp = document.createElement('meta');
              csp.httpEquiv = 'Content-Security-Policy';
              csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:;";
              document.head.appendChild(csp);
            }

            // X-Content-Type-Options
            if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
              const xcto = document.createElement('meta');
              xcto.httpEquiv = 'X-Content-Type-Options';
              xcto.content = 'nosniff';
              document.head.appendChild(xcto);
            }

            // X-Frame-Options
            if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
              const xfo = document.createElement('meta');
              xfo.httpEquiv = 'X-Frame-Options';
              xfo.content = 'DENY';
              document.head.appendChild(xfo);
            }
          } catch (error) {
            errorHandler.handleError(error, 'security-headers-setup');
          }
        };

        // Rate limiting with better error handling
        const setupRateLimit = () => {
          try {
            const requests = new Map();
            const originalFetch = window.fetch;

            window.fetch = async (...args) => {
              try {
                const url = typeof args[0] === 'string' ? args[0] : args[0].url;
                const now = Date.now();
                const requestKey = `${url}_${Math.floor(now / 60000)}`; // Per minute

                if (requests.has(requestKey)) {
                  const count = requests.get(requestKey);
                  if (count > 100) { // 100 requests per minute limit
                    throw new Error('Rate limit exceeded');
                  }
                  requests.set(requestKey, count + 1);
                } else {
                  requests.set(requestKey, 1);
                }

                return await originalFetch.apply(window, args);
              } catch (error) {
                errorHandler.handleApiError(error, typeof args[0] === 'string' ? args[0] : 'unknown-url');
                throw error;
              }
            };
          } catch (error) {
            errorHandler.handleError(error, 'rate-limit-setup');
          }
        };

        // Input sanitization with error handling
        const sanitizeInputs = () => {
          try {
            const sanitizeValue = (value: string): string => {
              return value
                .replace(/[<>'"]/g, (char) => {
                  const entities: Record<string, string> = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;'
                  };
                  return entities[char] || char;
                })
                .trim();
            };

            // Monitor form inputs
            document.addEventListener('input', (event) => {
              try {
                const target = event.target as HTMLInputElement;
                if (target && (target.type === 'text' || target.type === 'email' || target.tagName === 'TEXTAREA')) {
                  const sanitized = sanitizeValue(target.value);
                  if (sanitized !== target.value) {
                    target.value = sanitized;
                  }
                }
              } catch (error) {
                errorHandler.handleError(error, 'input-sanitization');
              }
            });
          } catch (error) {
            errorHandler.handleError(error, 'input-sanitization-setup');
          }
        };

        // DOM protection with error handling
        const protectDOM = () => {
          try {
            // Prevent some common DOM manipulation attacks
            const observer = new MutationObserver((mutations) => {
              try {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                      if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        // Remove potentially dangerous attributes
                        ['onload', 'onerror', 'onclick', 'onmouseover'].forEach(attr => {
                          if (element.hasAttribute(attr)) {
                            element.removeAttribute(attr);
                          }
                        });
                      }
                    });
                  }
                });
              } catch (error) {
                errorHandler.handleError(error, 'dom-mutation-observer');
              }
            });

            if (isComponentMounted) {
              observer.observe(document.body, {
                childList: true,
                subtree: true
              });

              // Cleanup function
              return () => {
                observer.disconnect();
              };
            }
          } catch (error) {
            errorHandler.handleError(error, 'dom-protection-setup');
          }
        };

        // Session security with error handling
        const setupSessionSecurity = () => {
          try {
            // Clear sensitive data on page unload
            const cleanup = () => {
              try {
                // Clear any temporary auth tokens
                sessionStorage.removeItem('temp_token');
                sessionStorage.removeItem('temp_data');
              } catch (error) {
                errorHandler.handleError(error, 'session-cleanup');
              }
            };

            window.addEventListener('beforeunload', cleanup);
            window.addEventListener('pagehide', cleanup);

            // Check for session hijacking attempts
            const checkSession = () => {
              try {
                const userAgent = navigator.userAgent;
                const storedUA = sessionStorage.getItem('user_agent');
                
                if (storedUA && storedUA !== userAgent) {
                  errorHandler.logError('Potential session hijacking detected', 'security-check');
                  // Could implement additional security measures here
                }
                
                sessionStorage.setItem('user_agent', userAgent);
              } catch (error) {
                errorHandler.handleError(error, 'session-check');
              }
            };

            checkSession();
            
            // Return cleanup function
            return () => {
              window.removeEventListener('beforeunload', cleanup);
              window.removeEventListener('pagehide', cleanup);
            };
          } catch (error) {
            errorHandler.handleError(error, 'session-security-setup');
          }
        };

        // Initialize all security features
        if (isComponentMounted) {
          checkSecurityHeaders();
          setupRateLimit();
          sanitizeInputs();
          const domCleanup = protectDOM();
          const sessionCleanup = setupSessionSecurity();

          // Return combined cleanup function
          return () => {
            isComponentMounted = false;
            if (domCleanup) domCleanup();
            if (sessionCleanup) sessionCleanup();
          };
        }

      } catch (error) {
        errorHandler.handleError(error, 'security-injector-init');
      }
    };

    // Initialize security with proper error handling
    const securityCleanup = initializeSecurity();

    // Cleanup on unmount
    return () => {
      isComponentMounted = false;
      if (securityCleanup && typeof securityCleanup === 'function') {
        try {
          securityCleanup();
        } catch (error) {
          errorHandler.handleError(error, 'security-cleanup');
        }
      }
    };
  }, []);

  return null;
}
