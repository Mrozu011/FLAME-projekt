
'use client';

import { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OptimizedImage from '@/components/OptimizedImage';
import { LazySection } from '@/components/LazyComponent';
// Dynamic import to avoid SSR issues
const initializeAdvancedPerformance = () => {
  if (typeof window !== 'undefined') {
    import('@/lib/performance').then(({ initializeAdvancedPerformance: init }) => {
      init();
    });
  }
};
import { useEffect, useState } from 'react';

// Lazy load non-critical components
const MainSlider = lazy(() => import('@/components/MainSlider'));
const ProductGrid = lazy(() => import('@/components/ProductGrid'));
const RecommendationSection = lazy(() => import('@/components/RecommendationSection'));
const PersonalizedHomepage = lazy(() => import('@/components/PersonalizedHomepage'));

// Minimal loading fallbacks
const SliderSkeleton = () => (
  <div className="relative h-[500px] md:h-[600px] bg-gray-100 animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

declare const gtag: (...args: any[]) => void;

// Force client-side rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function Home() {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  useEffect(() => {
    // Initialize performance optimizations only on client side
    if (typeof window !== 'undefined') {
      initializeAdvancedPerformance();
      
      // Preload critical resources
      const criticalImages = [
        'https://readdy.ai/api/search-image?query=premium%20fashion%20hero%20background%2C%20modern%20lifestyle%20photography%2C%20elegant%20clothing%20display%2C%20minimalist%20design%2C%20high-end%20fashion%20photography&width=1920&height=800&seq=hero-bg-1&orientation=landscape',
      ];
      
      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscribeEmail || !/\S+@\S+\.\S+/.test(subscribeEmail)) {
      setSubscribeStatus('error');
      setSubscribeMessage('Please enter a valid email address');
      return;
    }

    // Check if already subscribed
    if (typeof window !== 'undefined') {
      const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (existingSubscriptions.includes(subscribeEmail)) {
        setSubscribeStatus('error');
        setSubscribeMessage('This email is already subscribed');
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
      setSubscribeMessage('Thank you for subscribing!');
      setSubscribeEmail('');
      
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage('Subscription failed. Please try again.');
    }
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setSubscribeStatus('idle');
      setSubscribeMessage('');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section - Critical, load immediately */}
        <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
          <OptimizedImage
            src="https://readdy.ai/api/search-image?query=premium%20fashion%20hero%20background%2C%20modern%20lifestyle%20photography%2C%20elegant%20clothing%20display%2C%20minimalist%20design%2C%20high-end%20fashion%20photography%2C%20text%20area%20background%20color%20perfectly%20blends%20with%20image%20left%20background%20color%2C%20text%20must%20be%20clearly%20readable%20with%20sufficient%20contrast%20against%20background%2C%20overall%20visual%20effect%20should%20be%20modern%20minimalist%20and%20design-rich&width=1920&height=800&seq=hero-bg-1&orientation=landscape"
            alt="Premium Fashion Hero Background"
            width={1920}
            height={800}
            priority={true}
            className="absolute inset-0 w-full h-full object-cover object-center"
            sizes="100vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Premium
                <span className="block text-blue-400">Fashion</span>
                Collection
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Discover exceptional style with our curated collection of premium fashion and lifestyle products
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-lg font-medium whitespace-nowrap hover:scale-105 active:scale-95">
                  Shop Collection
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 text-lg font-medium whitespace-nowrap hover:scale-105 active:scale-95">
                  View Lookbook
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Slider - Lazy loaded */}
        <LazySection className="py-12">
          <Suspense fallback={<SliderSkeleton />}>
            <MainSlider />
          </Suspense>
        </LazySection>

        {/* Personalized Homepage - Lazy loaded */}
        <LazySection className="py-16">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4"></div>}>
            <PersonalizedHomepage defaultProducts={[]} />
          </Suspense>
        </LazySection>

        {/* Featured Products - Lazy loaded */}
        <LazySection className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our most popular items</p>
            </div>
            
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={[
                {
                  id: '1',
                  name: 'Elegant Summer Dress',
                  price: 89.99,
                  originalPrice: 120.00,
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
                  stockStatus: 'in-stock'
                },
                {
                  id: '2',
                  name: 'Classic White Blouse',
                  price: 59.99,
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
                  stockStatus: 'in-stock'
                },
                {
                  id: '3',
                  name: 'Leather Jacket',
                  price: 199.99,
                  originalPrice: 280.00,
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
                  discount: 29,
                  popularity: 92,
                  tags: ['leather', 'jacket', 'casual'],
                  stockStatus: 'in-stock'
                },
                {
                  id: '4',
                  name: 'Designer Handbag',
                  price: 149.99,
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
                  stockStatus: 'in-stock'
                }
              ]} />
            </Suspense>
          </div>
        </LazySection>

        {/* Recommendations - Lazy loaded */}
        <LazySection className="py-16 bg-gray-50">
          <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4"></div>}>
            <RecommendationSection title="Recommended for You" userId="guest" context={{ type: 'homepage' }} />
          </Suspense>
        </LazySection>

        {/* Newsletter Section */}
        <section className="py-16 md:py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers and style updates
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email"
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
                    <span>Subscribing...</span>
                  </div>
                ) : (
                  <span>Subscribe</span>
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
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-truck-line text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-2xl text-green-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                <p className="text-sm text-gray-600">Premium materials</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-customer-service-line text-2xl text-purple-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-return-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
