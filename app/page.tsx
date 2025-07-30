
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
const RecommendationSection = lazy(() => import('@/components/RecommendationSection'));
const PersonalizedHomepage = lazy(() => import('@/components/PersonalizedHomepage'));

// Loading skeletons
const SliderSkeleton = () => (
  <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 dark:bg-gray-800 animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero Banner Slider */}
        <LazySection>
          <Suspense fallback={<SliderSkeleton />}>
            <MainSlider />
          </Suspense>
        </LazySection>

        {/* Featured Products Section */}
        <LazySection className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container-view">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'pl' ? 'Produkty polecane' : language === 'en' ? 'Featured Products' : 'Prodotti in evidenza'}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === 'pl' 
                  ? 'Odkryj nasze najlepsze produkty wybrane specjalnie dla Ciebie' 
                  : language === 'en' 
                  ? 'Discover our best products selected especially for you' 
                  : 'Scopri i nostri migliori prodotti selezionati appositamente per te'
                }
              </p>
            </div>
            
            {/* Products Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={featuredProducts} />
            </Suspense>

            {/* Results Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'pl' 
                  ? `Wyniki: ${featuredProducts.length} produktów` 
                  : language === 'en' 
                  ? `Results: ${featuredProducts.length} products` 
                  : `Risultati: ${featuredProducts.length} prodotti`
                }
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'pl' ? 'Strona 1 z 1' : language === 'en' ? 'Page 1 of 1' : 'Pagina 1 di 1'}
              </div>
            </div>
          </div>
        </LazySection>

        {/* Personalized Homepage - Lazy loaded */}
        <LazySection className="py-16 bg-gray-50 dark:bg-gray-800">
          <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg mx-4"></div>}>
            <PersonalizedHomepage defaultProducts={featuredProducts} />
          </Suspense>
        </LazySection>

        {/* Recommendations - Lazy loaded */}
        <LazySection className="py-16 bg-white dark:bg-gray-900">
          <Suspense fallback={<div className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4"></div>}>
            <RecommendationSection 
              title={language === 'pl' ? 'Polecane dla Ciebie' : language === 'en' ? 'Recommended for You' : 'Consigliato per te'} 
              userId="guest" 
              context={{ type: 'homepage' }} 
            />
          </Suspense>
        </LazySection>

        {/* Newsletter Section */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900">
          <div className="container-view text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {language === 'pl' ? 'Bądź na bieżąco' : language === 'en' ? 'Stay Updated' : 'Rimani aggiornato'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {language === 'pl' 
                ? 'Zapisz się do naszego newslettera i otrzymuj ekskluzywne oferty oraz informacje o nowościach' 
                : language === 'en' 
                ? 'Subscribe to our newsletter and receive exclusive offers and news about new products'
                : 'Iscriviti alla nostra newsletter e ricevi offerte esclusive e notizie sui nuovi prodotti'
              }
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder={language === 'pl' ? 'Twój adres email' : language === 'en' ? 'Your email address' : 'Il tuo indirizzo email'}
                  className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-white/50 text-gray-900"
                  disabled={subscribeStatus === 'loading'}
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="btn-primary rounded-none rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscribeStatus === 'loading' ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    language === 'pl' ? 'Zapisz się' : language === 'en' ? 'Subscribe' : 'Iscriviti'
                  )}
                </button>
              </div>
              
              {subscribeMessage && (
                <p className={`mt-3 text-sm ${
                  subscribeStatus === 'success' ? 'text-green-100' : 'text-red-100'
                }`}>
                  {subscribeMessage}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container-view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-truck-line text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Darmowa Dostawa' : language === 'en' ? 'Free Shipping' : 'Spedizione Gratuita'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'pl' 
                    ? 'Od 199 zł' 
                    : language === 'en' 
                    ? 'From $50+' 
                    : 'Da €45+'
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-award-line text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Gwarancja Jakości' : language === 'en' ? 'Quality Guarantee' : 'Garanzia di Qualità'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'pl' 
                    ? '100% zadowolenia' 
                    : language === 'en' 
                    ? '100% satisfaction' 
                    : '100% soddisfazione'
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-customer-service-line text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Wsparcie 24/7' : language === 'en' ? '24/7 Support' : 'Supporto 24/7'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'pl' 
                    ? 'Zawsze dostępni' 
                    : language === 'en' 
                    ? 'Always available' 
                    : 'Sempre disponibile'
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-arrow-go-back-line text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Łatwe Zwroty' : language === 'en' ? 'Easy Returns' : 'Resi Facili'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'pl' 
                    ? '30 dni na zwrot' 
                    : language === 'en' 
                    ? '30-day returns' 
                    : 'Resi entro 30 giorni'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
