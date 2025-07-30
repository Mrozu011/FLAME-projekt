'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import OptimizedImage from '@/components/OptimizedImage';

export default function NotFound() {
  const { language } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Multilingual content
  const content = {
    pl: {
      title: 'Strona nie została znaleziona',
      subtitle: 'Ups! Nie możemy znaleźć strony, której szukasz.',
      description: 'Strona mogła zostać przeniesiona, usunięta lub wpisałeś nieprawidłowy adres URL.',
      homeButton: 'Wróć do strony głównej',
      shopButton: 'Sprawdź nasze produkty',
      helpButton: 'Centrum pomocy',
      searchPlaceholder: 'Czego szukasz?',
      searchButton: 'Szukaj',
      suggestions: {
        title: 'Może zainteresuje Cię:',
        items: [
          { name: 'Nowa kolekcja', href: '/women' },
          { name: 'Promocje', href: '/sale' },
          { name: 'Bestsellery', href: '/bestsellers' },
          { name: 'Akcesoria', href: '/accessories' }
        ]
      }
    },
    en: {
      title: 'Page Not Found',
      subtitle: 'Oops! We can\'t find the page you\'re looking for.',
      description: 'The page might have been moved, deleted, or you entered an incorrect URL.',
      homeButton: 'Back to Home',
      shopButton: 'Explore Products',
      helpButton: 'Help Center',
      searchPlaceholder: 'What are you looking for?',
      searchButton: 'Search',
      suggestions: {
        title: 'You might be interested in:',
        items: [
          { name: 'New Collection', href: '/women' },
          { name: 'Sale', href: '/sale' },
          { name: 'Bestsellers', href: '/bestsellers' },
          { name: 'Accessories', href: '/accessories' }
        ]
      }
    },
    it: {
      title: 'Pagina Non Trovata',
      subtitle: 'Ops! Non riusciamo a trovare la pagina che stai cercando.',
      description: 'La pagina potrebbe essere stata spostata, eliminata o hai inserito un URL errato.',
      homeButton: 'Torna alla Home',
      shopButton: 'Esplora Prodotti',
      helpButton: 'Centro Assistenza',
      searchPlaceholder: 'Cosa stai cercando?',
      searchButton: 'Cerca',
      suggestions: {
        title: 'Potrebbe interessarti:',
        items: [
          { name: 'Nuova Collezione', href: '/women' },
          { name: 'Saldi', href: '/sale' },
          { name: 'Bestseller', href: '/bestsellers' },
          { name: 'Accessori', href: '/accessories' }
        ]
      }
    }
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          {/* 404 Image/Illustration */}
          <div className="relative w-full max-w-md mx-auto mb-8">
            <OptimizedImage
              src="https://readdy.ai/api/search-image?query=404%20error%20page%20illustration%2C%20modern%20minimalist%20design%2C%20fashion%20ecommerce%20theme%2C%20elegant%20error%20graphic%2C%20professional%20ui%20design&width=400&height=300&seq=404-illustration&orientation=landscape"
              alt="404 Error Illustration"
              width={400}
              height={300}
              className="w-full h-auto opacity-80"
              priority
            />
          </div>

          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-gray-300 dark:text-gray-600 leading-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {currentContent.title}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {currentContent.subtitle}
            </p>
            
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {currentContent.description}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex rounded-lg shadow-lg">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentContent.searchPlaceholder}
                  className="flex-1 px-6 py-3 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <i className="ri-search-line text-xl"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <i className="ri-home-line mr-2"></i>
              {currentContent.homeButton}
            </Link>
            
            <Link
              href="/women"
              className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              {currentContent.shopButton}
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <i className="ri-customer-service-line mr-2"></i>
              {currentContent.helpButton}
            </Link>
          </div>

          {/* Suggestions */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {currentContent.suggestions.title}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentContent.suggestions.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <i className="ri-arrow-right-line text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Brand Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="inline-block text-3xl font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <span style={{ fontFamily: 'Pacifico, serif' }}>FLAME</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {language === 'pl' ? 'Premium moda i styl życia' : language === 'en' ? 'Premium fashion & lifestyle' : 'Moda e lifestyle premium'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}