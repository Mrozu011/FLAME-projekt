
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import GDPRConsent from '@/components/GDPRConsent';
import PersonalizationProvider from '@/components/PersonalizationProvider';
import SecurityInjector from '@/components/SecurityInjector';
import TrackingInjector from '@/components/TrackingInjector';
import ErrorBoundary from '@/components/ErrorBoundary';
import ChatbotWidget from '@/components/ChatbotWidget';
import ThemeProvider from '@/components/ThemeProvider';
import { AdminTranslationProvider } from '@/hooks/useAdminTranslation';

// Optimized font loading with minimal subset and preload
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://flamestore.com'),
  title: 'Flame Store - Premium Fashion & Lifestyle',
  description: 'Discover premium fashion and lifestyle products with personalized shopping experience',
  keywords: 'fashion, clothing, lifestyle, premium, shopping, ecommerce',
  authors: [{ name: 'Flame Store Team' }],
  creator: 'Flame Store',
  publisher: 'Flame Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flamestore.com',
    siteName: 'Flame Store',
    title: 'Flame Store - Premium Fashion & Lifestyle',
    description: 'Discover premium fashion and lifestyle products with personalized shopping experience',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Flame Store',
        type: 'image/webp'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flame Store - Premium Fashion & Lifestyle',
    description: 'Discover premium fashion and lifestyle products with personalized shopping experience',
    images: ['/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
  other: {
    'performance-budget': 'true'
  }
};

// Minimal loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Ultra-compressed critical CSS
const criticalCSS = `
  :root{--font-inter:${inter.style.fontFamily}}
  *{box-sizing:border-box}
  html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
  body{font-family:var(--font-inter),system-ui,sans-serif;line-height:1.6;margin:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  .performance-optimized{contain:layout style paint}
  .theme-transition{transition:background-color .2s,color .2s,border-color .2s}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Critical performance hints - order matters */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://readdy.ai" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        
        {/* Security and viewport */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1;mode=block" />
        
        {/* Preload icons with deferred loading */}
        <link 
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" 
          as="style"
        />
        <noscript>
          <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet" />
        </noscript>
        
        {/* Inline critical CSS for zero-delay rendering */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        
        {/* Theme color optimization */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Critical route prefetching */}
        <link rel="prefetch" href="/" />
        <link rel="prefetch" href="/cart" />
      </head>
      <body 
        className={`${inter.className} antialiased theme-transition performance-optimized`} 
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <AdminTranslationProvider>
            <PersonalizationProvider>
              <ThemeProvider />
              <Suspense fallback={<LoadingFallback />}>
                <TrackingInjector />
                <SecurityInjector />
                
                {/* Main Application Layout */}
                <div className="min-h-screen flex flex-col">
                  {children}
                </div>
                
                {/* Lazy load non-critical components with lower priority */}
                <Suspense fallback={null}>
                  <ChatbotWidget />
                </Suspense>
                <Suspense fallback={null}>
                  <GDPRConsent />
                </Suspense>
              </Suspense>
            </PersonalizationProvider>
          </AdminTranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
