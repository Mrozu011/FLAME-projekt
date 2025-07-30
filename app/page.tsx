
'use client';

import { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OptimizedImage from '@/components/OptimizedImage';
import { LazySection } from '@/components/LazyComponent';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

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

// Minimal loading fallbacks
const SliderSkeleton = () => (
  <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

declare const gtag: (...args: any[]) => void;

// Force client-side rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function Home() {
  const { t, language } = useTranslation();
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  useEffect(() => {
    // Initialize performance optimizations only on client side
    if (typeof window !== 'undefined') {
      initializeAdvancedPerformance();
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscribeEmail || !/\S+@\S+\.\S+/.test(subscribeEmail)) {
      setSubscribeStatus('error');
      setSubscribeMessage(language === 'pl' ? 'Proszę wprowadzić prawidłowy adres email' : language === 'en' ? 'Please enter a valid email address' : 'Per favore inserisci un indirizzo email valido');
      return;
    }

    // Check if already subscribed
    if (typeof window !== 'undefined') {
      const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (existingSubscriptions.includes(subscribeEmail)) {
        setSubscribeStatus('error');
        setSubscribeMessage(language === 'pl' ? 'Ten email jest już zapisany' : language === 'en' ? 'This email is already subscribed' : 'Questa email è già iscritta');
        return;
      }
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

  // Featured products data with proper badges and multilingual support
  const featuredProducts = [
    {
      id: '1',
      name: language === 'pl' ? 'Elegancka Letnia Sukienka' : language === 'en' ? 'Elegant Summer Dress' : 'Vestito Estivo Elegante',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20fashion%20photography%2C%20premium%20clothing%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=dress-1&orientation=portrait',
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
      stockStatus: 'in-stock',
      badges: ['Nowy', '3D', '-25%']
    },
    {
      id: '2',
      name: language === 'pl' ? 'Klasyczna Biała Bluzka' : language === 'en' ? 'Classic White Blouse' : 'Camicetta Bianca Classica',
      price: 189.99,
      image: 'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20fashion%20photography%2C%20premium%20clothing%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=blouse-1&orientation=portrait',
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
      stockStatus: 'in-stock',
      badges: ['3D']
    },
    {
      id: '3',
      name: language === 'pl' ? 'Skórzana Kurtka' : language === 'en' ? 'Leather Jacket' : 'Giacca di Pelle',
      price: 799.99,
      originalPrice: 1199.99,
      image: 'https://readdy.ai/api/search-image?query=leather%20jacket%20fashion%20photography%2C%20premium%20clothing%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=jacket-1&orientation=portrait',
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
      stockStatus: 'in-stock',
      badges: ['3D', '-33%']
    },
    {
      id: '4',
      name: language === 'pl' ? 'Designerska Torebka' : language === 'en' ? 'Designer Handbag' : 'Borsa di Design',
      price: 459.99,
      image: 'https://readdy.ai/api/search-image?query=designer%20handbag%20fashion%20photography%2C%20premium%20accessory%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=bag-1&orientation=portrait',
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
      stockStatus: 'in-stock',
      badges: ['Nowy', '3D']
    },
    {
      id: '5',
      name: language === 'pl' ? 'Casualowe Sneakersy' : language === 'en' ? 'Casual Sneakers' : 'Sneakers Casual',
      price: 229.99,
      originalPrice: 289.99,
      image: 'https://readdy.ai/api/search-image?query=casual%20sneakers%20fashion%20photography%2C%20premium%20footwear%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=sneakers-1&orientation=portrait',
      rating: 4.5,
      reviewCount: 267,
      category: 'Men',
      subcategory: 'Shoes',
      sizes: ['39', '40', '41', '42', '43', '44', '45'],
      colors: ['White', 'Black', 'Gray', 'Navy'],
      material: 'Premium Canvas',
      isNew: false,
      isOnSale: true,
      discount: 21,
      popularity: 78,
      tags: ['sneakers', 'casual', 'comfortable'],
      stockStatus: 'in-stock',
      badges: ['-21%']
    },
    {
      id: '6',
      name: language === 'pl' ? 'Jedwabny Szalik' : language === 'en' ? 'Silk Scarf' : 'Sciarpa di Seta',
      price: 129.99,
      image: 'https://readdy.ai/api/search-image?query=silk%20scarf%20fashion%20photography%2C%20premium%20accessory%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=scarf-1&orientation=portrait',
      rating: 4.8,
      reviewCount: 98,
      category: 'Accessories',
      subcategory: 'Scarves',
      sizes: ['One Size'],
      colors: ['Blue', 'Red', 'Green', 'Purple', 'Gold'],
      material: '100% Silk',
      isNew: true,
      isOnSale: false,
      popularity: 82,
      tags: ['silk', 'luxury', 'colorful'],
      stockStatus: 'in-stock',
      badges: ['Nowy', '3D']
    },
    {
      id: '7',
      name: language === 'pl' ? 'Formalny Garnitur' : language === 'en' ? 'Formal Suit' : 'Completo Formale',
      price: 899.99,
      originalPrice: 1299.99,
      image: 'https://readdy.ai/api/search-image?query=formal%20suit%20fashion%20photography%2C%20premium%20menswear%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=suit-1&orientation=portrait',
      rating: 4.9,
      reviewCount: 156,
      category: 'Men',
      subcategory: 'Suits',
      sizes: ['46', '48', '50', '52', '54'],
      colors: ['Navy', 'Charcoal', 'Black'],
      material: 'Wool Blend',
      isNew: false,
      isOnSale: true,
      discount: 31,
      popularity: 91,
      tags: ['formal', 'business', 'elegant'],
      stockStatus: 'in-stock',
      badges: ['3D', '-31%']
    },
    {
      id: '8',
      name: language === 'pl' ? 'Casualowe Jeansy' : language === 'en' ? 'Casual Jeans' : 'Jeans Casual',
      price: 199.99,
      image: 'https://readdy.ai/api/search-image?query=casual%20jeans%20fashion%20photography%2C%20premium%20denim%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=jeans-1&orientation=portrait',
      rating: 4.4,
      reviewCount: 324,
      category: 'Women',
      subcategory: 'Pants',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black', 'Gray'],
      material: 'Premium Denim',
      isNew: false,
      isOnSale: false,
      popularity: 87,
      tags: ['jeans', 'casual', 'denim'],
      stockStatus: 'in-stock',
      badges: ['3D']
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

        {/* Featured Products Section - "Produkty polecane" */}
        <LazySection className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'pl' ? 'Produkty polecane' : language === 'en' ? 'Featured Products' : 'Prodotti in evidenza'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === 'pl' 
                  ? 'Odkryj nasze najlepsze produkty wybrane specjalnie dla Ciebie' 
                  : language === 'en' 
                  ? 'Discover our best products selected especially for you' 
                  : 'Scopri i nostri migliori prodotti selezionati appositamente per te'
                }
              </p>
            </div>
            
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={featuredProducts} />
            </Suspense>
          </div>
        </LazySection>

        {/* Personalized Homepage - Lazy loaded */}
        <LazySection className="py-16">
          <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4"></div>}>
            <PersonalizedHomepage defaultProducts={featuredProducts} />
          </Suspense>
        </LazySection>

        {/* Recommendations - Lazy loaded */}
        <LazySection className="py-16 bg-gray-50 dark:bg-gray-800">
          <Suspense fallback={<div className="h-48 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg mx-4"></div>}>
            <RecommendationSection 
              title={language === 'pl' ? 'Polecane dla Ciebie' : language === 'en' ? 'Recommended for You' : 'Consigliato per te'} 
              userId="guest" 
              context={{ type: 'homepage' }} 
            />
          </Suspense>
        </LazySection>

        {/* Newsletter Section */}
        <section className="py-16 md:py-20 bg-blue-600 dark:bg-blue-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {language === 'pl' ? 'Bądź na bieżąco' : language === 'en' ? 'Stay Updated' : 'Rimani aggiornato'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {language === 'pl' 
                ? 'Zapisz się do naszego newslettera i otrzymuj ekskluzywne oferty oraz informacje o nowościach' 
                : language === 'en' 
                ? 'Subscribe to our newsletter for exclusive offers and style updates' 
                : 'Iscriviti alla nostra newsletter per offerte esclusive e aggiornamenti di stile'
              }
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder={language === 'pl' ? 'Wprowadź swój email' : language === 'en' ? 'Enter your email' : 'Inserisci la tua email'}
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                disabled={subscribeStatus === 'loading'}
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {subscribeStatus === 'loading' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'pl' ? 'Zapisywanie...' : language === 'en' ? 'Subscribing...' : 'Iscrizione...'}</span>
                  </div>
                ) : (
                  <span>{language === 'pl' ? 'Zapisz się' : language === 'en' ? 'Subscribe' : 'Iscriviti'}</span>
                )}
              </button>
            </form>
            
            {subscribeMessage && (
              <div className={`mt-4 p-3 rounded-lg ${
                subscribeStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white`}>
                {subscribeMessage}
              </div>
            )}
          </div>
        </section>

        {/* Features Section - Above Footer */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-truck-line text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Darmowa dostawa' : language === 'en' ? 'Free Shipping' : 'Spedizione gratuita'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'pl' ? 'Przy zamówieniach powyżej 200 zł' : language === 'en' ? 'On orders over $50' : 'Su ordini superiori a €50'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Gwarancja jakości' : language === 'en' ? 'Quality Guarantee' : 'Garanzia di qualità'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'pl' ? 'Materiały premium' : language === 'en' ? 'Premium materials' : 'Materiali premium'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-customer-service-line text-2xl text-purple-600 dark:text-purple-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Wsparcie 24/7' : language === 'en' ? '24/7 Support' : 'Supporto 24/7'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'pl' ? 'Zawsze gotowi pomóc' : language === 'en' ? 'Always here to help' : 'Sempre qui per aiutare'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-return-line text-2xl text-orange-600 dark:text-orange-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'pl' ? 'Łatwe zwroty' : language === 'en' ? 'Easy Returns' : 'Resi facili'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'pl' ? '30 dni na zwrot' : language === 'en' ? '30-day return policy' : 'Politica di reso di 30 giorni'}
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
