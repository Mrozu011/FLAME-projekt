'use client';

import { useEffect, useState } from 'react';
import { trackingService } from '@/lib/tracking-service';

export default function TrackingInjector() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeTracking = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Load tracking settings
        const settings = await trackingService.getSettings();
        
        if (!isMounted) return;

        // Inject scripts based on settings
        await injectTrackingScripts(settings);
        
        // Initialize tracking service
        await trackingService.initializeTracking();
        
        // Track initial page view
        await trackingService.trackPageView(
          window.location.href,
          document.title
        );
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing tracking:', error);
      }
    };

    initializeTracking();

    return () => {
      isMounted = false;
    };
  }, []);

  // Track page changes for SPA navigation
  useEffect(() => {
    if (!isInitialized) return;

    const handlePageChange = () => {
      trackingService.trackPageView(
        window.location.href,
        document.title
      );
    };

    // Listen for navigation events
    window.addEventListener('popstate', handlePageChange);
    
    // Track programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handlePageChange, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(handlePageChange, 0);
    };

    return () => {
      window.removeEventListener('popstate', handlePageChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isInitialized]);

  return null;
}

async function injectTrackingScripts(settings: any) {
  if (typeof document === 'undefined') return;

  // Remove existing tracking scripts
  const existingScripts = document.querySelectorAll('[data-tracking-script]');
  existingScripts.forEach(script => script.remove());

  // Inject Google Analytics
  if (settings.googleAnalytics.enabled && settings.googleAnalytics.trackingId) {
    await injectGoogleAnalytics(settings.googleAnalytics.trackingId);
  }

  // Inject Facebook Pixel
  if (settings.facebookPixel.enabled && settings.facebookPixel.pixelId) {
    await injectFacebookPixel(settings.facebookPixel.pixelId);
  }

  // Inject TikTok Pixel
  if (settings.tiktokPixel.enabled && settings.tiktokPixel.pixelId) {
    await injectTikTokPixel(settings.tiktokPixel.pixelId);
  }
}

function injectGoogleAnalytics(trackingId: string): Promise<void> {
  return new Promise((resolve) => {
    // Google Analytics 4 script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    gaScript.setAttribute('data-tracking-script', 'google-analytics');
    
    gaScript.onload = () => {
      // Google Analytics configuration
      const gaConfigScript = document.createElement('script');
      gaConfigScript.setAttribute('data-tracking-script', 'google-analytics-config');
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}', {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true
        });
      `;
      document.head.appendChild(gaConfigScript);
      resolve();
    };
    
    gaScript.onerror = () => {
      console.error('Failed to load Google Analytics script');
      resolve();
    };
    
    document.head.appendChild(gaScript);
  });
}

function injectFacebookPixel(pixelId: string): Promise<void> {
  return new Promise((resolve) => {
    const fbScript = document.createElement('script');
    fbScript.setAttribute('data-tracking-script', 'facebook-pixel');
    fbScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbScript);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
    noscript.setAttribute('data-tracking-script', 'facebook-pixel-noscript');
    document.head.appendChild(noscript);
    
    resolve();
  });
}

function injectTikTokPixel(pixelId: string): Promise<void> {
  return new Promise((resolve) => {
    const tiktokScript = document.createElement('script');
    tiktokScript.setAttribute('data-tracking-script', 'tiktok-pixel');
    tiktokScript.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(tiktokScript);
    resolve();
  });
}