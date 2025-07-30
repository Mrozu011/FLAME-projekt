'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Debounce hook for input optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll/resize events
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

// Optimized state update hook to prevent unnecessary re-renders
export function useOptimizedState<T>(
  initialState: T,
  equalityFn?: (prev: T, next: T) => boolean
) {
  const [state, setState] = useState<T>(initialState);
  const prevStateRef = useRef<T>(initialState);

  const setOptimizedState = useCallback((newState: T | ((prevState: T) => T)) => {
    const nextState = typeof newState === 'function' 
      ? (newState as (prevState: T) => T)(prevStateRef.current)
      : newState;

    const shouldUpdate = equalityFn 
      ? !equalityFn(prevStateRef.current, nextState)
      : prevStateRef.current !== nextState;

    if (shouldUpdate) {
      prevStateRef.current = nextState;
      setState(nextState);
    }
  }, [equalityFn]);

  return [state, setOptimizedState] as const;
}

// Route prefetching hook
export function useRoutePrefetch() {
  const prefetchedRoutes = useRef(new Set<string>());
  const prefetchTimeouts = useRef(new Map<string, NodeJS.Timeout>());

  const prefetchRoute = useCallback((href: string, delay = 0) => {
    if (prefetchedRoutes.current.has(href)) return;

    const timeout = setTimeout(() => {
      prefetchedRoutes.current.add(href);
      
      // Create prefetch link
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
      
      // Also prefetch DNS for external resources
      if (href.startsWith('http')) {
        const dnsLink = document.createElement('link');
        dnsLink.rel = 'dns-prefetch';
        dnsLink.href = new URL(href).origin;
        document.head.appendChild(dnsLink);
      }
      
      prefetchTimeouts.current.delete(href);
    }, delay);

    prefetchTimeouts.current.set(href, timeout);
  }, []);

  const cancelPrefetch = useCallback((href: string) => {
    const timeout = prefetchTimeouts.current.get(href);
    if (timeout) {
      clearTimeout(timeout);
      prefetchTimeouts.current.delete(href);
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup timeouts on unmount
      prefetchTimeouts.current.forEach(timeout => clearTimeout(timeout));
      prefetchTimeouts.current.clear();
    };
  }, []);

  return { prefetchRoute, cancelPrefetch };
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, options.threshold, options.rootMargin, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Performance metrics tracking
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    fcp?: number;
    lcp?: number;
    cls?: number;
    fid?: number;
    ttfb?: number;
  }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'layout-shift':
            const layoutEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!layoutEntry.hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cls: (prev.cls || 0) + layoutEntry.value 
              }));
            }
            break;
          case 'first-input':
            const fidEntry = entry as PerformanceEntry & { processingStart: number };
            setMetrics(prev => ({ 
              ...prev, 
              fid: fidEntry.processingStart - entry.startTime 
            }));
            break;
          case 'navigation':
            const navEntry = entry as PerformanceEntry & { responseStart: number; requestStart: number };
            setMetrics(prev => ({ 
              ...prev, 
              ttfb: navEntry.responseStart - navEntry.requestStart 
            }));
            break;
        }
      });
    });

    // Observe different performance entry types
    try {
      observer.observe({ type: 'paint', buffered: true });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'layout-shift', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'navigation', buffered: true });
    } catch (e) {
      console.warn('Performance observer not supported:', e);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return metrics;
}

// Optimized event listener hook
export function useOptimizedEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: Element | Window | null = null,
  options: AddEventListenerOptions = {}
) {
  const savedHandler = useRef(handler);
  const savedOptions = useRef(options);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    savedOptions.current = options;
  }, [options]);

  useEffect(() => {
    const targetElement = element ?? window;
    if (!targetElement?.addEventListener) return;

    const eventListener = (event: Event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, eventListener, savedOptions.current);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, savedOptions.current);
    };
  }, [eventName, element]);
}

// Memory-efficient list rendering hook
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(visibleStart, visibleEnd + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    visibleStart,
    visibleEnd,
    handleScroll,
  };
}

// State batch update hook for preventing multiple re-renders
export function useBatchedUpdates() {
  const [updates, setUpdates] = useState<Array<() => void>>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((updateFn: () => void) => {
    setUpdates(prev => [...prev, updateFn]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setUpdates(currentUpdates => {
        currentUpdates.forEach(fn => fn());
        return [];
      });
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchUpdate;
}