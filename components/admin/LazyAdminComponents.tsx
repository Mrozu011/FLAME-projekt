'use client';

import { lazy, Suspense, ComponentType } from 'react';

// Loading fallback component
const AdminLoadingFallback = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

// Minimal loading for components
const ComponentLoadingFallback = ({ height = '200px' }: { height?: string }) => (
  <div className="bg-white rounded-lg shadow animate-pulse" style={{ height }}>
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Lazy load admin components for better performance
export const LazyDashboardCharts = lazy(() => 
  import('./DashboardCharts').then(module => ({ default: module.default }))
);

export const LazyNotificationCenter = lazy(() => 
  import('./NotificationCenter').then(module => ({ default: module.default }))
);

export const LazyEmailSummarySettings = lazy(() => 
  import('./EmailSummarySettings').then(module => ({ default: module.default }))
);

// Wrapper components with Suspense
export const DashboardChartsWithSuspense = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback height="400px" />}>
    <LazyDashboardCharts {...props} />
  </Suspense>
);

export const NotificationCenterWithSuspense = (props: any) => (
  <Suspense fallback={<div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>}>
    <LazyNotificationCenter {...props} />
  </Suspense>
);

export const EmailSummarySettingsWithSuspense = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback height="300px" />}>
    <LazyEmailSummarySettings {...props} />
  </Suspense>
);

// HOC for lazy loading any admin component
export function withAdminLazyLoading<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <ComponentLoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Code splitting for different admin sections
export const LazyOrderManagement = lazy(() => 
  import('../../app/admin/orders/page').then(module => ({ default: module.default }))
);

export const LazyProductManagement = lazy(() => 
  import('../../app/admin/products/page').then(module => ({ default: module.default }))
);

export const LazyUserManagement = lazy(() => 
  import('../../app/admin/users/page').then(module => ({ default: module.default }))
);

export const LazyAnalytics = lazy(() => 
  import('../../app/admin/analytics/page').catch(() => 
    // Fallback if analytics page doesn't exist
    import('./DashboardCharts').then(module => ({ default: module.default }))
  )
);

// Admin route components with lazy loading
export const AdminRoutes = {
  orders: withAdminLazyLoading(
    () => import('../../app/admin/orders/page'),
    <AdminLoadingFallback message="Loading orders..." />
  ),
  products: withAdminLazyLoading(
    () => import('../../app/admin/products/page'),
    <AdminLoadingFallback message="Loading products..." />
  ),
  users: withAdminLazyLoading(
    () => import('../../app/admin/users/page'),
    <AdminLoadingFallback message="Loading users..." />
  ),
  notifications: withAdminLazyLoading(
    () => import('../../app/admin/notifications/page'),
    <AdminLoadingFallback message="Loading notifications..." />
  ),
  discounts: withAdminLazyLoading(
    () => import('../../app/admin/discounts/page'),
    <AdminLoadingFallback message="Loading discounts..." />
  )
};

// Performance monitoring for admin components
export const withPerformanceMonitoring = <P extends object>(
  Component: ComponentType<P>,
  componentName: string
) => {
  return function MonitoredComponent(props: P) {
    const startTime = performance.now();
    
    const onMount = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
        
        if (renderTime > 100) {
          console.warn(`⚠️ ${componentName} slow render detected`);
        }
      }
    };
    
    return <Component {...props} ref={onMount} />;
  };
};

// Optimized data fetching hook for admin components
export const useOptimizedAdminData = (
  endpoint: string,
  options: {
    cacheTime?: number;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  } = {}
) => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 2 * 60 * 1000,  // 2 minutes
    refetchOnWindowFocus = false
  } = options;

  // This would integrate with your data fetching library
  // For now, returning a mock structure
  return {
    data: null,
    isLoading: true,
    error: null,
    refetch: () => {},
    invalidate: () => {}
  };
};

export default {
  DashboardChartsWithSuspense,
  NotificationCenterWithSuspense,
  EmailSummarySettingsWithSuspense,
  AdminRoutes,
  withAdminLazyLoading,
  withPerformanceMonitoring
};