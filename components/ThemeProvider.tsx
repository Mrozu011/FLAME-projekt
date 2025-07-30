'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    // Theme script with error handling and caching
    const themeScript = `
      (function() {
        try {
          const setTheme = (theme) => {
            const root = document.documentElement;
            const isDark = theme === 'dark';
            root.classList.toggle('dark', isDark);
            root.setAttribute('data-theme', theme);
            root.style.colorScheme = theme;
          };
          
          const stored = localStorage.getItem('theme');
          const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(stored || (systemDark ? 'dark' : 'light'));
        } catch (e) {
          document.documentElement.classList.remove('dark');
        }
      })();
    `;

    // Execute theme script
    const script = document.createElement('script');
    script.innerHTML = themeScript;
    document.head.appendChild(script);

    // Service Worker for production caching
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(() => console.log('SW registered'))
          .catch(() => console.log('SW failed'));
      });
    }

    // Performance monitoring - production only
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', Math.round(entry.startTime) + 'ms');
              }
              if (entry.entryType === 'first-input') {
                console.log('FID:', Math.round(entry.processingStart - entry.startTime) + 'ms');
              }
            });
          });
          try {
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
            observer.observe({ type: 'first-input', buffered: true });
          } catch (e) {}
        }
      });
    }

    // Development error reporting - minimal
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('error', e => console.error('Error:', e.message, e.filename, e.lineno));
      window.addEventListener('unhandledrejection', e => console.error('Promise rejection:', e.reason));
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
} 