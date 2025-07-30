
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import OptimizedImage from './OptimizedImage';

interface Slide {
  id: number;
  title: string;
  titleEn: string;
  titleIt: string;
  subtitle: string;
  subtitleEn: string;
  subtitleIt: string;
  image: string;
  buttonText: string;
  buttonTextEn: string;
  buttonTextIt: string;
  buttonLink: string;
  isActive?: boolean;
}

// Enhanced slides data with better multilingual support and admin-configurable structure
const slides: Slide[] = [
  {
    id: 1,
    title: 'Nowa Kolekcja',
    titleEn: 'New Collection',
    titleIt: 'Nuova Collezione',
    subtitle: 'Odkryj najnowsze trendy modowe w naszej ekskluzywnej kolekcji',
    subtitleEn: 'Discover the latest fashion trends in our exclusive collection',
    subtitleIt: 'Scopri le ultime tendenze della moda nella nostra collezione esclusiva',
    image: 'https://readdy.ai/api/search-image?query=elegant%20fashion%20model%20wearing%20premium%20clothing%20in%20modern%20studio%2C%20professional%20fashion%20photography%2C%20clean%20minimalist%20background%2C%20high-end%20brand%20aesthetic%2C%20dramatic%20lighting&width=1920&height=800&seq=hero-slide-1&orientation=landscape',
    buttonText: 'Kup Teraz',
    buttonTextEn: 'Shop Now',
    buttonTextIt: 'Acquista Ora',
    buttonLink: '/women',
    isActive: true
  },
  {
    id: 2,
    title: 'Jakość Premium',
    titleEn: 'Premium Quality',
    titleIt: 'Qualità Premium',
    subtitle: 'Każdy produkt wykonany z dbałością o najdrobniejsze szczegóły',
    subtitleEn: 'Every product crafted with attention to the finest details',
    subtitleIt: 'Ogni prodotto realizzato con attenzione ai minimi dettagli',
    image: 'https://readdy.ai/api/search-image?query=luxury%20fashion%20accessories%20and%20clothing%20displayed%20elegantly%2C%20premium%20materials%2C%20sophisticated%20product%20photography%2C%20clean%20studio%20background%2C%20high-end%20fashion%20brand%20aesthetic&width=1920&height=800&seq=hero-slide-2&orientation=landscape',
    buttonText: 'Odkryj',
    buttonTextEn: 'Explore',
    buttonTextIt: 'Esplora',
    buttonLink: '/about',
    isActive: true
  },
  {
    id: 3,
    title: 'Limitowana Edycja',
    titleEn: 'Limited Edition',
    titleIt: 'Edizione Limitata',
    subtitle: 'Ekskluzywne produkty dla wymagających klientów - tylko przez ograniczony czas',
    subtitleEn: 'Exclusive pieces for discerning customers - available for limited time only',
    subtitleIt: 'Pezzi esclusivi per clienti esigenti - disponibili solo per un tempo limitato',
    image: 'https://readdy.ai/api/search-image?query=exclusive%20limited%20edition%20fashion%20collection%20showcase%2C%20luxury%20clothing%20items%2C%20elegant%20fashion%20photography%2C%20sophisticated%20studio%20setting%2C%20premium%20brand%20aesthetic&width=1920&height=800&seq=hero-slide-3&orientation=landscape',
    buttonText: 'Zobacz Kolekcję',
    buttonTextEn: 'View Collection',
    buttonTextIt: 'Vedi Collezione',
    buttonLink: '/sale',
    isActive: true
  },
  {
    id: 4,
    title: 'Wyprzedaż -50%',
    titleEn: 'Sale -50%',
    titleIt: 'Saldi -50%',
    subtitle: 'Wyjątkowe rabaty na wybrane produkty - nie przegap okazji!',
    subtitleEn: 'Exceptional discounts on selected products - don\'t miss out!',
    subtitleIt: 'Sconti eccezionali su prodotti selezionati - non perdere l\'occasione!',
    image: 'https://readdy.ai/api/search-image?query=fashion%20sale%20promotion%20with%20discounted%20clothing%2C%20attractive%20sale%20display%2C%20professional%20retail%20photography%2C%20modern%20boutique%20setting%2C%20vibrant%20promotional%20aesthetic&width=1920&height=800&seq=hero-slide-4&orientation=landscape',
    buttonText: 'Sprawdź Ofertę',
    buttonTextEn: 'Check Offers',
    buttonTextIt: 'Controlla Offerte',
    buttonLink: '/sale',
    isActive: true
  }
];

export default function MainSlider() {
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Filter active slides
  const activeSlides = useMemo(() => slides.filter(slide => slide.isActive), []);

  // Get current slide data with language support
  const currentSlideData = useMemo(() => {
    if (!activeSlides[currentSlide]) return null;
    
    const slide = activeSlides[currentSlide];
    return {
      ...slide,
      title: language === 'pl' ? slide.title : language === 'en' ? slide.titleEn : slide.titleIt,
      subtitle: language === 'pl' ? slide.subtitle : language === 'en' ? slide.subtitleEn : slide.subtitleIt,
      buttonText: language === 'pl' ? slide.buttonText : language === 'en' ? slide.buttonTextEn : slide.buttonTextIt
    };
  }, [currentSlide, language, activeSlides]);

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isClient || !isAutoPlaying || activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isClient, isAutoPlaying, activeSlides.length, currentSlide]);

  // Navigation handlers
  const handleNextSlide = useCallback(() => {
    if (isTransitioning || activeSlides.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, activeSlides.length]);

  const handlePrevSlide = useCallback(() => {
    if (isTransitioning || activeSlides.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, activeSlides.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide || activeSlides.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentSlide, activeSlides.length]);

  // Touch/swipe handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  }, [touchStartX, touchEndX, handleNextSlide, handlePrevSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Button click handler
  const handleButtonClick = useCallback((link: string) => {
    router.push(link);
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevSlide, handleNextSlide]);

  if (!isClient || activeSlides.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!currentSlideData) return null;

  return (
    <section 
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600xl overflow-hidden bg-gray-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Featured content slider"
    >
      {/* Slide Images */}
      <div className="relative w-full h-full">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <OptimizedImage
              src={slide.image}
              alt={language === 'pl' ? slide.title : language === 'en' ? slide.titleEn : slide.titleIt}
              width={1920}
              height={600}
              priority={index === 0}
              className="w-full h-full object-cover object-center"
              sizes="100vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className={`transition-all duration-500 ease-in-out ${
              isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}>
              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {currentSlideData.title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
                {currentSlideData.subtitle}
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => handleButtonClick(currentSlideData.buttonLink)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                aria-label={currentSlideData.buttonText}
              >
                {currentSlideData.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Previous slide"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          
          <button
            onClick={handleNextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Next slide"
          >
            <i className="ri-arrow-right-line text-xl"></i>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed ${
                index === currentSlide
                  ? 'bg-white shadow-lg scale-125'
                  : 'bg-white/50 hover:bg-white/70 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Indicator */}
      {activeSlides.length > 1 && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/30"
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            <i className={`${isAutoPlaying ? 'ri-pause-line' : 'ri-play-line'} text-lg`}></i>
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {activeSlides.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / activeSlides.length) * 100}%`
            }}
          />
        </div>
      )}
    </section>
  );
}
