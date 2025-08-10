
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

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

// Enhanced slides data with modern design focus
const slides: Slide[] = [
  {
    id: 1,
    title: 'Nowa Kolekcja',
    titleEn: 'New Collection',
    titleIt: 'Nuova Collezione',
    subtitle: 'Odkryj najnowsze trendy modowe w naszej ekskluzywnej kolekcji',
    subtitleEn: 'Discover the latest fashion trends in our exclusive collection',
    subtitleIt: 'Scopri le ultime tendenze della moda nella nostra collezione esclusiva',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
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
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
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
    subtitle: 'Ekskluzywne produkty dla wymagających klientów',
    subtitleEn: 'Exclusive pieces for discerning customers',
    subtitleIt: 'Pezzi esclusivi per clienti esigenti',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
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
    subtitle: 'Wyjątkowe rabaty na wybrane produkty',
    subtitleEn: 'Exceptional discounts on selected products',
    subtitleIt: 'Sconti eccezionali su prodotti selezionati',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
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
  const activeSlides = useMemo(() => 
    slides.filter(slide => slide.isActive), 
    []
  );

  // Get current slide data with fallback
  const currentSlideData = useMemo(() => {
    const slide = activeSlides[currentSlide];
    if (!slide) return null;
    
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

  // Auto-play functionality
  useEffect(() => {
    if (!isClient || !isAutoPlaying || activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isClient, isAutoPlaying, activeSlides.length, handleNextSlide]);

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

  // Loading state
  if (!isClient || !currentSlideData) {
    return (
      <div className="relative aspect-[16/9] md:aspect-[16/9] lg:aspect-[16/9] bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative aspect-[4/3] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Slider hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className={`object-cover transition-all duration-500 ${
            isTransitioning ? 'scale-105 opacity-80' : 'scale-100 opacity-100'
          }`}
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transform transition-all duration-500 ${
            isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white mb-4 md:mb-6 leading-tight">
              {currentSlideData.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              {currentSlideData.subtitle}
            </p>
            
            {/* CTA Button */}
            <button
              onClick={() => handleButtonClick(currentSlideData.buttonLink)}
              className="inline-flex items-center px-8 py-3 md:px-10 md:py-4 bg-white/90 backdrop-blur text-gray-900 font-medium text-base md:text-lg rounded-2xl hover:bg-white transition-all duration-200 hover:shadow-md"
              aria-label="Przejdź do sekcji"
            >
              {currentSlideData.buttonText}
              <i className="ri-arrow-right-line ml-2 text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          {/* Previous Arrow */}
          <button
            onClick={handlePrevSlide}
            disabled={isTransitioning}
            className="absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Poprzedni slajd"
          >
            <i className="ri-arrow-left-line text-xl md:text-2xl"></i>
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNextSlide}
            disabled={isTransitioning}
            className="absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Następny slajd"
          >
            <i className="ri-arrow-right-line text-xl md:text-2xl"></i>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/60 hover:bg-white/80'
              } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/60`}
              aria-label={`Przejdź do slajdu ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      )}

      {/* Auto-play Toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-3 md:top-4 right-3 md:right-4 z-20 w-9 h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/60"
        aria-label={isAutoPlaying ? 'Wstrzymaj automatyczne przewijanie' : 'Wznów automatyczne przewijanie'}
      >
        <i className={`${isAutoPlaying ? 'ri-pause-line' : 'ri-play-line'} text-lg md:text-xl`}></i>
      </button>
    </section>
  );
}
