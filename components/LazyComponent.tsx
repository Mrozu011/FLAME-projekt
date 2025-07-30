'use client';

import { useState, useEffect, useRef, ReactNode, ComponentType } from 'react';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  className?: string;
}

// Generic lazy loader for any component
export function LazyComponent({
  children,
  fallback = null,
  rootMargin = '50px 0px',
  threshold = 0.01,
  triggerOnce = true,
  delay = 0,
  className = ''
}: LazyComponentProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsIntersecting(true);
            }, delay);
          } else {
            setIsIntersecting(true);
          }

          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [rootMargin, threshold, triggerOnce, delay]);

  useEffect(() => {
    if (isIntersecting) {
      // Small delay to ensure smooth loading
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isIntersecting]);

  return (
    <div ref={elementRef} className={className}>
      {isLoaded ? children : fallback}
    </div>
  );
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
  options?: Omit<LazyComponentProps, 'children' | 'fallback'>
) {
  return function LazyWrappedComponent(props: P) {
    return (
      <LazyComponent fallback={fallback} {...options}>
        <Component {...props} />
      </LazyComponent>
    );
  };
}

// Lazy section component for page sections
interface LazySectionProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
  skeleton?: ReactNode;
  fadeIn?: boolean;
}

export function LazySection({
  children,
  className = '',
  minHeight = '200px',
  skeleton,
  fadeIn = true
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.01
      }
    );

    observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const defaultSkeleton = (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={`${className} ${fadeIn && isVisible ? 'animate-fade-in' : ''}`}
      style={{ minHeight }}
    >
      {isVisible ? children : (skeleton || defaultSkeleton)}
    </section>
  );
}

// Lazy grid for product/content grids
interface LazyGridProps {
  children: ReactNode[];
  itemsPerBatch?: number;
  delay?: number;
  className?: string;
  itemClassName?: string;
}

export function LazyGrid({
  children,
  itemsPerBatch = 6,
  delay = 100,
  className = '',
  itemClassName = ''
}: LazyGridProps) {
  const [visibleItems, setVisibleItems] = useState(itemsPerBatch);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || visibleItems >= children.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleItems(prev => Math.min(prev + itemsPerBatch, children.length));
            setIsLoading(false);
          }, delay);
        }
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01
      }
    );

    // Observe the last visible item
    const lastItem = grid.children[visibleItems - 1] as HTMLElement;
    if (lastItem) observer.observe(lastItem);

    return () => {
      if (lastItem) observer.unobserve(lastItem);
    };
  }, [visibleItems, children.length, itemsPerBatch, delay, isLoading]);

  return (
    <div ref={gridRef} className={className}>
      {children.slice(0, visibleItems).map((child, index) => (
        <div key={index} className={`${itemClassName} animate-fade-in-up`} style={{ animationDelay: `${(index % itemsPerBatch) * 50}ms` }}>
          {child}
        </div>
      ))}
      
      {isLoading && (
        <div className="col-span-full flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}