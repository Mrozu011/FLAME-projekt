
'use client';

import { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LazySection } from '@/components/LazyComponent';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Product } from '@/lib/types';

// Declare gtag for Google Analytics
declare global {
  function gtag(...args: any[]): void;
}

// Dynamic import to avoid SSR issues
const initializeAdvancedPerformance = () => {
  if (typeof window !== 'undefined') {
    import('@/lib/performance').then(({ initializeAdvancedPerformance: init }) => {
      init();
    });
  }
};

// Lazy load non-critical components
const MainSlider = lazy(() => import('@/components/MainSlider'));
const ProductGrid = lazy(() => import('@/components/ProductGrid'));

// Loading skeletons
const SliderSkeleton = () => (
  <div className="relative h-[380px] md:h-[480px] lg:h-[560px] bg-gray-100 dark:bg-gray-800 animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="product-grid">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="product-card animate-pulse">
        <div className="product-image bg-gray-200"></div>
        <div className="product-content space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function HomePage() {
  const { language } = useTranslation();
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // Initialize performance optimizations
  useEffect(() => {
    const initPerf = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initializeAdvancedPerformance);
      } else {
        setTimeout(initializeAdvancedPerformance, 0);
      }
    };

    initPerf();
  }, []);

  // Newsletter subscription handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscribeEmail.trim()) {
      setSubscribeStatus('error');
      setSubscribeMessage(language === 'pl' ? 'Wprowadź adres email' : language === 'en' ? 'Enter email address' : 'Inserisci indirizzo email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) {
      setSubscribeStatus('error');
      setSubscribeMessage(language === 'pl' ? 'Nieprawidłowy adres email' : language === 'en' ? 'Invalid email address' : 'Indirizzo email non valido');
      return;
    }

    setSubscribeStatus('loading');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store subscription locally
      if (typeof window !== 'undefined') {
        const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        const updatedSubscriptions = [...existingSubscriptions, subscribeEmail];
        localStorage.setItem('newsletter_subscribers', JSON.stringify(updatedSubscriptions));
      }
      
      // Track subscription event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_subscribe', {
          email: subscribeEmail
        });
      }
      
      setSubscribeStatus('success');
      setSubscribeMessage(language === 'pl' ? 'Dziękujemy za subskrypcję!' : language === 'en' ? 'Thank you for subscribing!' : 'Grazie per l\'iscrizione!');
      setSubscribeEmail('');
      
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage(language === 'pl' ? 'Błąd subskrypcji. Spróbuj ponownie.' : language === 'en' ? 'Subscription failed. Please try again.' : 'Iscrizione fallita. Riprova.');
    }
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setSubscribeStatus('idle');
      setSubscribeMessage('');
    }, 5000);
  };

  // Featured products data with proper typing for Product interface
  const featuredProducts: Product[] = [
    {
      id: '1',
      name: language === 'pl' ? 'Elegancka Letnia Sukienka' : language === 'en' ? 'Elegant Summer Dress' : 'Vestito Estivo Elegante',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.8,
      reviewCount: 156,
      category: 'Women',
      subcategory: 'Dresses',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Pink', 'White', 'Black'],
      material: 'Premium Cotton',
      isNew: true,
      isOnSale: true,
      discount: 25,
      popularity: 95,
      tags: ['summer', 'elegant', 'casual'],
      stockStatus: 'in-stock' as const,
      has3DModel: true
    },
    {
      id: '2',
      name: language === 'pl' ? 'Klasyczna Biała Bluzka' : language === 'en' ? 'Classic White Blouse' : 'Camicetta Bianca Classica',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.6,
      reviewCount: 203,
      category: 'Women',
      subcategory: 'Tops',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['White', 'Cream', 'Light Blue'],
      material: 'Silk Blend',
      isNew: false,
      isOnSale: false,
      popularity: 88,
      tags: ['classic', 'business', 'elegant'],
      stockStatus: 'in-stock' as const,
      has3DModel: true
    },
    {
      id: '3',
      name: language === 'pl' ? 'Skórzana Kurtka' : language === 'en' ? 'Leather Jacket' : 'Giacca di Pelle',
      price: 799.99,
      originalPrice: 1199.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.9,
      reviewCount: 89,
      category: 'Men',
      subcategory: 'Outerwear',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Brown', 'Navy'],
      material: 'Genuine Leather',
      isNew: false,
      isOnSale: true,
      discount: 33,
      popularity: 92,
      tags: ['leather', 'jacket', 'casual'],
      stockStatus: 'in-stock' as const,
      has3DModel: true
    },
    {
      id: '4',
      name: language === 'pl' ? 'Designerska Torebka' : language === 'en' ? 'Designer Handbag' : 'Borsa di Design',
      price: 459.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.7,
      reviewCount: 134,
      category: 'Accessories',
      subcategory: 'Bags',
      sizes: ['One Size'],
      colors: ['Black', 'Brown', 'Tan'],
      material: 'Premium Leather',
      isNew: true,
      isOnSale: false,
      popularity: 85,
      tags: ['handbag', 'luxury', 'designer'],
      stockStatus: 'in-stock' as const,
      has3DModel: true
    }
  ];

  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero Banner Slider */}
        <LazySection>
          <Suspense fallback={<SliderSkeleton />}>
            <MainSlider />
          </Suspense>
        </LazySection>

        {/* Featured Products Section */}
        <LazySection className="section pt-10 pb-12 bg-white dark:bg-gray-900">
          <div className="container">
            {/* Products Grid (exactly 4 tiles on desktop) */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={featuredProducts} />
            </Suspense>

            {/* Info Tiles - single row */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <i className="ri-truck-line text-lg text-blue-600 dark:text-blue-400"></i>
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {language === 'pl' ? 'Darmowa dostawa' : language === 'en' ? 'Free Shipping' : 'Spedizione gratuita'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {language === 'pl' ? 'Przy zamówieniach od 199 zł' : language === 'en' ? 'On orders over $50' : 'Per ordini oltre €45'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <i className="ri-star-smile-line text-lg text-amber-600 dark:text-amber-400"></i>
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {language === 'pl' ? 'Polecane' : language === 'en' ? 'Recommended' : 'Consigliati'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {language === 'pl' ? 'Top wybory klientów' : language === 'en' ? 'Top picks by customers' : 'Scelte migliori dei clienti'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <i className="ri-shield-check-line text-lg text-emerald-600 dark:text-emerald-400"></i>
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {language === 'pl' ? 'Najlepsza jakość' : language === 'en' ? 'Best Quality' : 'Qualità migliore'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {language === 'pl' ? 'Sprawdzone materiały i wykonanie' : language === 'en' ? 'Trusted materials and craft' : 'Materiali e fattura affidabili'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <i className="ri-customer-service-2-line text-lg text-purple-600 dark:text-purple-400"></i>
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {language === 'pl' ? 'Wsparcie 24/7' : language === 'en' ? '24/7 Support' : 'Supporto 24/7'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {language === 'pl' ? 'Szybka pomoc zawsze' : language === 'en' ? 'Fast help, anytime' : 'Assistenza rapida, sempre'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LazySection>
      </main>
      
      <Footer />
    </>
  );
}
