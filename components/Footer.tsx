
'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t, language } = useTranslation();

  // Left side links organized by categories
  const linkCategories = [
    {
      title: language === 'pl' ? 'Pomoc' : language === 'en' ? 'Help' : 'Aiuto',
      links: [
        { 
          name: language === 'pl' ? 'Kontakt' : language === 'en' ? 'Contact' : 'Contatto', 
          href: '/contact' 
        },
        { 
          name: language === 'pl' ? 'FAQ' : language === 'en' ? 'FAQ' : 'FAQ', 
          href: '/faq' 
        },
        { 
          name: language === 'pl' ? 'Przewodnik rozmiarów' : language === 'en' ? 'Size Guide' : 'Guida alle taglie', 
          href: '/size-guide' 
        },
        { 
          name: language === 'pl' ? 'Dostawa' : language === 'en' ? 'Shipping' : 'Spedizione', 
          href: '/shipping' 
        }
      ]
    },
    {
      title: language === 'pl' ? 'Informacje' : language === 'en' ? 'About' : 'Informazioni',
      links: [
        { 
          name: language === 'pl' ? 'O nas' : language === 'en' ? 'About Us' : 'Chi siamo', 
          href: '/about' 
        },
        { 
          name: language === 'pl' ? 'Wsparcie' : language === 'en' ? 'Support' : 'Supporto', 
          href: '/support' 
        },
        { 
          name: language === 'pl' ? 'Zwroty' : language === 'en' ? 'Returns' : 'Resi', 
          href: '/returns' 
        },
        { 
          name: language === 'pl' ? 'Warunki' : language === 'en' ? 'Terms' : 'Termini', 
          href: '/terms' 
        }
      ]
    }
  ];

  // Social media links with proper icons
  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/flame-fashion', 
      icon: 'ri-facebook-fill',
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/flame-fashion', 
      icon: 'ri-instagram-line',
      color: 'hover:text-pink-600'
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/flame-fashion', 
      icon: 'ri-twitter-fill',
      color: 'hover:text-blue-400'
    },
    { 
      name: 'TikTok', 
      href: 'https://tiktok.com/@flame-fashion', 
      icon: 'ri-tiktok-fill',
      color: 'hover:text-pink-500'
    },
    { 
      name: 'YouTube', 
      href: 'https://youtube.com/@flame-fashion', 
      icon: 'ri-youtube-fill',
      color: 'hover:text-red-600'
    }
  ];

  // Company bio text
  const companyBio = {
    pl: 'FLAME to marka modowa oferująca ekskluzywną odzież i akcesoria najwyższej jakości. Każdy produkt jest starannie wyselekcjonowany, aby zapewnić naszym klientom wyjątkowy styl i komfort.',
    en: 'FLAME is a fashion brand offering exclusive clothing and accessories of the highest quality. Every product is carefully selected to provide our customers with exceptional style and comfort.',
    it: 'FLAME è un marchio di moda che offre abbigliamento ed accessori esclusivi della massima qualità. Ogni prodotto è accuratamente selezionato per fornire ai nostri clienti stile eccezionale e comfort.'
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Links */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {linkCategories.map((category, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Company Info */}
          <div className="space-y-6">
            {/* Brand Logo */}
            <div>
              <Link 
                href="/" 
                className="text-3xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
              >
                <span style={{ fontFamily: 'Pacifico, serif' }}>FLAME</span>
              </Link>
            </div>
            
            {/* Company Bio */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              {companyBio[language as keyof typeof companyBio] || companyBio.en}
            </p>
            
            {/* Company Details */}
            <div className="space-y-3">
              <div className="flex items-start text-sm text-gray-300">
                <div className="w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                  <i className="ri-building-line text-base"></i>
                </div>
                <div>
                  <div>NIP: 123-456-78-90</div>
                  <div>REGON: 123456789</div>
                </div>
              </div>
              
              <div className="flex items-start text-sm text-gray-300">
                <div className="w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                  <i className="ri-map-pin-line text-base"></i>
                </div>
                <span>ul. Modowa 123<br />00-001 Warszawa, Polska</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-mail-line text-base"></i>
                </div>
                <a 
                  href="mailto:hello@flame-fashion.eu" 
                  className="hover:text-white transition-colors duration-200"
                >
                  hello@flame-fashion.eu
                </a>
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-phone-line text-base"></i>
                </div>
                <a 
                  href="tel:+48123456789" 
                  className="hover:text-white transition-colors duration-200"
                >
                  +48 123 456 789
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-sm font-medium text-white mb-4">
                {language === 'pl' ? 'Śledź nas' : language === 'en' ? 'Follow Us' : 'Seguici'}
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-300 ${social.color} rounded-lg transition-all duration-300 hover:scale-110 hover:bg-gray-700`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <i className={`${social.icon} text-lg`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-gray-300 text-center lg:text-left">
              © {new Date().getFullYear()} FLAME Fashion. {language === 'pl' ? 'Wszelkie prawa zastrzeżone.' : language === 'en' ? 'All rights reserved.' : 'Tutti i diritti riservati.'}
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end space-x-6">
              <div className="flex items-center space-x-2">
                <i className="ri-secure-payment-line text-gray-400"></i>
                <span className="text-sm text-gray-300">
                  {language === 'pl' ? 'Bezpieczne płatności' : language === 'en' ? 'Secure Payment' : 'Pagamento sicuro'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-truck-line text-gray-400"></i>
                <span className="text-sm text-gray-300">
                  {language === 'pl' ? 'Darmowa dostawa' : language === 'en' ? 'Free Shipping' : 'Spedizione gratuita'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-shield-check-line text-gray-400"></i>
                <span className="text-sm text-gray-300">
                  {language === 'pl' ? 'Gwarancja jakości' : language === 'en' ? 'Quality Guarantee' : 'Garanzia di qualità'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Legal Links */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap justify-center lg:justify-start items-center space-x-6">
              <Link
                href="/privacy"
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {language === 'pl' ? 'Polityka prywatności' : language === 'en' ? 'Privacy Policy' : 'Politica sulla privacy'}
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {language === 'pl' ? 'Regulamin' : language === 'en' ? 'Terms of Service' : 'Termini di servizio'}
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {language === 'pl' ? 'Polityka cookies' : language === 'en' ? 'Cookie Policy' : 'Politica sui cookie'}
              </Link>
              <Link
                href="/accessibility"
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {language === 'pl' ? 'Dostępność' : language === 'en' ? 'Accessibility' : 'Accessibilità'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
