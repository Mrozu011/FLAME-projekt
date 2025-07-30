
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePersonalization } from '@/components/PersonalizationProvider';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslation } from '@/hooks/useTranslation';
import ProductGrid from '@/components/ProductGrid';
import RecommendationSection from '@/components/RecommendationSection';

interface PersonalizedHomepageProps {
  defaultProducts: any[];
}

export default function PersonalizedHomepage({ defaultProducts }: PersonalizedHomepageProps) {
  const { personalization, isLoading, trackBehavior } = usePersonalization();
  const { format } = useCurrency();
  const { t } = useTranslation();

  const [featuredProducts, setFeaturedProducts] = useState(defaultProducts);
  const [heroSection, setHeroSection] = useState<any>(null);
  const [categoriesLayout, setCategoriesLayout] = useState<any>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);

  useEffect(() => {
    if (personalization && !isLoading) {
      applyPersonalization();
    }
  }, [personalization, isLoading]);

  const applyPersonalization = () => {
    if (!personalization) return;

    // Apply personalized homepage layout
    const { layoutConfig, contentConfig } = personalization;

    // Set hero section content
    const heroSectionData = layoutConfig.homepageSections.find((s: any) => s.type === 'hero');
    if (heroSectionData) {
      setHeroSection(heroSectionData.content);
    }

    // Set categories layout
    const categoriesSection = layoutConfig.homepageSections.find((s: any) => s.type === 'categories');
    if (categoriesSection) {
      setCategoriesLayout(categoriesSection.content);
    }

    // Set shipping options
    setShippingOptions(contentConfig.shippingOptions || []);

    // Personalize products
    personalizeProducts();
  };

  const personalizeProducts = () => {
    if (!personalization) return;

    const { recommendations, layoutConfig } = personalization;

    // Adjust product display based on user preferences
    let personalizedProducts = [...defaultProducts];

    // If user has main category preference, prioritize that category products
    const categoriesSection = layoutConfig.homepageSections.find((s: any) => s.type === 'categories');
    if (categoriesSection?.content?.featured) {
      const featuredCategory = categoriesSection.content.featured;
      personalizedProducts = personalizedProducts.sort((a, b) => {
        const aMatch = a.category.toLowerCase() === featuredCategory;
        const bMatch = b.category.toLowerCase() === featuredCategory;
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    setFeaturedProducts(personalizedProducts);
  };

  const handleCategoryClick = (category: string) => {
    trackBehavior('category_browse', { category });
  };

  const handleProductClick = (productId: string) => {
    trackBehavior('product_view', { productId });
  };

  const getPersonalizedHeroContent = () => {
    if (!personalization) return null;

    const { layoutConfig } = personalization;
    const heroSectionData = layoutConfig.homepageSections.find((s: any) => s.type === 'hero');

    if (heroSectionData?.content?.featured === 'category' && layoutConfig.featuredCategories.length > 0) {
      const primaryCategory = layoutConfig.featuredCategories[0];
      return {
        title: `Discover ${primaryCategory} Collection`,
        subtitle: `Curated ${primaryCategory} products for you`,
        cta: `Browse ${primaryCategory}`,
        link: `/${primaryCategory.toLowerCase()}`,
        image: `https://readdy.ai/api/search-image?query=$%7BprimaryCategory%7D%20fashion%20collection%20modern%20elegant%20clothing%20lifestyle%20photography%20clean%20professional%20lighting&width=800&height=600&seq=hero-${primaryCategory.toLowerCase()}&orientation=landscape`
      };
    }

    return {
      title: 'Discover Your Personal Style',
      subtitle: 'Curated based on your preferences',
      cta: 'Shop Now',
      link: '/women',
      image: 'https://readdy.ai/api/search-image?query=modern%20fashion%20hero%20banner%20elegant%20clothing%20lifestyle%20photography%20clean%20professional%20lighting%20diverse%20models&width=800&height=600&seq=hero-personalized&orientation=landscape'
    };
  };

  const getPersonalizedCategories = () => {
    if (!personalization) {
      return [
        { name: 'Women', slug: 'women', image: 'https://readdy.ai/api/search-image?query=women%20fashion%20category%20elegant%20clothing%20modern%20style%20photography%20clean%20background&width=300&height=400&seq=cat-women&orientation=portrait' },
        { name: 'Men', slug: 'men', image: 'https://readdy.ai/api/search-image?query=men%20fashion%20category%20elegant%20clothing%20modern%20style%20photography%20clean%20background&width=300&height=400&seq=cat-men&orientation=portrait' },
        { name: 'Accessories', slug: 'accessories', image: 'https://readdy.ai/api/search-image?query=fashion%20accessories%20luxury%20items%20modern%20style%20photography%20clean%20background&width=300&height=400&seq=cat-accessories&orientation=portrait' }
      ];
    }

    const { layoutConfig } = personalization;
    const categories = [
      { name: 'Women', slug: 'women', priority: 0 },
      { name: 'Men', slug: 'men', priority: 0 },
      { name: 'Accessories', slug: 'accessories', priority: 0 },
      { name: 'Sale', slug: 'sale', priority: 0 }
    ];

    // Adjust category order based on user preferences
    layoutConfig.navigationPriority.forEach((category: string, index: number) => {
      const cat = categories.find(c => c.name === category || c.slug === category.toLowerCase());
      if (cat) {
        cat.priority = layoutConfig.navigationPriority.length - index;
      }
    });

    return categories
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
      .map(cat => ({
        name: cat.name,
        slug: cat.slug,
        image: `https://readdy.ai/api/search-image?query=$%7Bcat.slug%7D%20fashion%20category%20elegant%20clothing%20modern%20style%20photography%20clean%20background&width=300&height=400&seq=cat-${cat.slug}&orientation=portrait`
      }));
  };

  const renderPersonalizedShipping = () => {
    if (!shippingOptions.length) return null;

    const localOptions = shippingOptions.filter(option => option.local);
    const standardOptions = shippingOptions.filter(option => !option.local);

    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-theme-primary mb-4">
            Recommended Shipping Options
          </h2>
          <p className="text-lg text-theme-secondary">
            Best shipping experience based on your location
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localOptions.map((option, index) => (
            <div key={index} className="card-theme p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-truck-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-theme-primary mb-2">{option.method}</h3>
              <p className="text-sm text-theme-secondary mb-2">{option.estimatedDays}</p>
              <p className="text-lg font-bold text-theme-primary">{format(option.cost)}</p>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                Local Delivery
              </span>
            </div>
          ))}

          {standardOptions.map((option, index) => (
            <div key={index} className="card-theme p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-global-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-theme-primary mb-2">{option.method}</h3>
              <p className="text-sm text-theme-secondary mb-2">{option.estimatedDays}</p>
              <p className="text-lg font-bold text-theme-primary">{format(option.cost)}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const personalizedHeroContent = getPersonalizedHeroContent();
  const personalizedCategories = getPersonalizedCategories();

  return (
    <div className="min-h-screen bg-theme-primary transition-theme">
      {/* Personalized hero section */}
      {personalizedHeroContent && (
        <section className="relative bg-theme-secondary py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${personalizedHeroContent.image})` }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {personalizedHeroContent.title}
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {personalizedHeroContent.subtitle}
              </p>
              <Link
                href={personalizedHeroContent.link}
                onClick={() => handleCategoryClick(personalizedHeroContent.link)}
                className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                {personalizedHeroContent.cta}
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Personalized categories display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-theme-primary mb-4">
            {personalization ? 'Recommended Categories' : 'Popular Categories'}
          </h2>
          <p className="text-lg text-theme-secondary">
            {personalization ? 'Based on your browsing preferences' : 'Explore our product collections'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personalizedCategories.map((category, index) => (
            <Link
              key={index}
              href={`/${category.slug}`}
              onClick={() => handleCategoryClick(category.slug)}
              className="group relative overflow-hidden rounded-lg bg-theme-secondary hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                <p className="text-white/80 mt-2">Explore latest collection</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalized product recommendations */}
      {personalization && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <RecommendationSection
            title="Just For You"
            userId={localStorage.getItem('user-id') || 'guest'}
            context={{ type: 'homepage' }}
            limit={8}
            showReasons={true}
          />
        </section>
      )}

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-theme-primary mb-4">
            {personalization ? 'Based on Your Preferences' : 'Featured Products'}
          </h2>
          <p className="text-lg text-theme-secondary">
            {personalization ? 'These products might match your taste' : 'Curated popular products'}
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Personalized shipping options */}
      {renderPersonalizedShipping()}

      {/* Personalized size suggestions */}
      {personalization && personalization.contentConfig.sizeSuggestions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card-theme p-8 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-theme-primary mb-4">
                Your Preferred Sizes
              </h2>
              <p className="text-lg text-theme-secondary">
                Recommended based on your purchase history
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              {personalization.contentConfig.sizeSuggestions.map((size: string, index: number) => (
                <div key={index} className="bg-theme-secondary px-6 py-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-theme-primary">{size}</div>
                  <div className="text-sm text-theme-secondary">Recommended Size</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Personalization confidence indicator */}
      {personalization && personalization.confidence > 0.3 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-brain-line text-blue-600 dark:text-blue-400"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Personalized Experience
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    We've customized this page based on your preferences
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(personalization.confidence * 100)}%
                </div>
                <div className="text-sm text-blue-500 dark:text-blue-400">
                  Match Rate
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
