
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import OptimizedImage from './OptimizedImage';

interface Slide {
  id: number;
  title: string;
  titlePl: string;
  subtitle: string;
  subtitlePl: string;
  image: string;
  buttonText: string;
  buttonTextPl: string;
  buttonLink: string;
}

// Memoized slides data for better performance
const slides: Slide[] = [
  {
    id: 1,
    title: 'New Collection',
    titlePl: 'Nowa Kolekcja',
    subtitle: 'Discover the latest fashion trends',
    subtitlePl: 'Odkryj najnowsze trendy modowe',
    image: 'https://readdy.ai/api/search-image?query=fashion%20model%20wearing%20elegant%20dress%20in%20modern%20studio%20setting%2C%20professional%20fashion%20photography%2C%20clean%20minimalist%20background%2C%20high-end%20fashion%20brand%20aesthetic%2C%20premium%20clothing%20showcase&width=1920&height=1080&seq=main-slide-1&orientation=landscape',
    buttonText: 'Shop Now',
    buttonTextPl: 'Kup Teraz',
    buttonLink: '/women'
  },
  {
    id: 2,
    title: 'Premium Quality',
    titlePl: 'Najwyższa Jakość',
    subtitle: 'Crafted with attention to detail',
    subtitlePl: 'Wykonane z dbałością o szczegóły',
    image: 'https://readdy.ai/api/search-image?query=luxury%20fashion%20items%20displayed%20elegantly%2C%20premium%20clothing%20and%20accessories%2C%20sophisticated%20product%20photography%2C%20clean%20studio%20background%2C%20high-end%20fashion%20brand%20aesthetic&width=1920&height=1080&seq=main-slide-2&orientation=landscape',
    buttonText: 'Explore',
    buttonTextPl: 'Odkryj',
    buttonLink: '/about'
  },
  {
    id: 3,
    title: 'Limited Edition',
    titlePl: 'Limitowana Edycja',
    subtitle: 'Exclusive pieces for discerning customers',
    subtitlePl: 'Ekskluzywne produkty dla wymagających klientów',
    image: 'https://readdy.ai/api/search-image?query=exclusive%20fashion%20collection%20showcase%2C%20limited%20edition%20clothing%20items%2C%20luxury%20fashion%20photography%2C%20elegant%20studio%20setting%2C%20premium%20brand%20aesthetic&width=1920&height=1080&seq=main-slide-3&orientation=landscape',
    buttonText: 'View Collection',
    buttonTextPl: 'Zobacz Kolekcję',
    buttonLink: '/sale'
  }
];

export default function MainSlider() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Memoized slide content for performance
  const currentSlideData = useMemo(() => slides[currentSlide], [currentSlide]);

  // Optimized client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Optimized auto-play with cleanup
  useEffect(() => {
    if (!isClient || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isClient, isAutoPlaying]);

  // Memoized navigation handlers
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const handleButtonClick = useCallback((buttonLink: string) => {
    router.push(buttonLink);
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    if (!isClient) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key >= '1' && e.key <= '3') {
        goToSlide(parseInt(e.key) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isClient, prevSlide, nextSlide, goToSlide]);

  // Performance optimized loading state
  if (!isClient) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-black"
      role="banner"
      aria-label="Main slider"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={index !== currentSlide}
        >
          {/* Background Image with Optimization */}
          <div className="absolute inset-0">
            <OptimizedImage
              src={slide.image}
              alt={language === 'pl' ? slide.titlePl : slide.title}
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg animate-fade-in"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  animationDelay: '0.2s',
                  animationFillMode: 'both'
                }}
              >
                {language === 'pl' ? slide.titlePl : slide.title}
              </h1>
              
              <p 
                className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 drop-shadow animate-fade-in"
                style={{
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  animationDelay: '0.4s',
                  animationFillMode: 'both'
                }}
              >
                {language === 'pl' ? slide.subtitlePl : slide.subtitle}
              </p>
              
              <button 
                onClick={() => handleButtonClick(slide.buttonLink)}
                className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-lg whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 animate-fade-in"
                style={{
                  animationDelay: '0.6s',
                  animationFillMode: 'both'
                }}
                aria-label={`${language === 'pl' ? slide.buttonTextPl : slide.buttonText} - ${language === 'pl' ? slide.titlePl : slide.title}`}
              >
                {language === 'pl' ? slide.buttonTextPl : slide.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300 cursor-pointer backdrop-blur-sm hover:scale-110 z-20"
        aria-label="Previous slide"
      >
        <i className="ri-arrow-left-line text-2xl"></i>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300 cursor-pointer backdrop-blur-sm hover:scale-110 z-20"
        aria-label="Next slide"
      >
        <i className="ri-arrow-right-line text-2xl"></i>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide 
                ? 'bg-white scale-110 shadow-lg' 
                : 'bg-white/50 hover:bg-white/75 hover:scale-105'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
