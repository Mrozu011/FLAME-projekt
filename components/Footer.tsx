
'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t, language } = useTranslation();

  // Link categories organized for minimal layout
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
          name: language === 'pl' ? 'Kariera' : language === 'en' ? 'Careers' : 'Carriere', 
          href: '/careers' 
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

  // Social media links
  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/flame-fashion', 
      icon: 'ri-facebook-fill'
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/flame-fashion', 
      icon: 'ri-instagram-line'
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/flame-fashion', 
      icon: 'ri-twitter-fill'
    },
    { 
      name: 'YouTube', 
      href: 'https://youtube.com/@flame-fashion', 
      icon: 'ri-youtube-fill'
    }
  ];

  // Company description
  const companyBio = {
    pl: 'FLAME to marka modowa oferująca ekskluzywną odzież i akcesoria najwyższej jakości. Każdy produkt jest starannie wyselekcjonowany, aby zapewnić naszym klientom wyjątkowy styl i komfort.',
    en: 'FLAME is a fashion brand offering exclusive clothing and accessories of the highest quality. Every product is carefully selected to provide our customers with exceptional style and comfort.',
    it: 'FLAME è un marchio di moda che offre abbigliamento ed accessori esclusivi della massima qualità. Ogni prodotto è accuratamente selezionato per fornire ai nostri clienti stile eccezionale e comfort.'
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              FLAME
            </Link>
            
            <p className="footer-description">
              {companyBio[language as keyof typeof companyBio] || companyBio.en}
            </p>

            {/* Social Links */}
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {linkCategories.map((category, index) => (
            <div key={index} className="footer-section">
              <h3 className="footer-title">
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="footer-link block"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} FLAME Fashion. {language === 'pl' ? 'Wszelkie prawa zastrzeżone.' : language === 'en' ? 'All rights reserved.' : 'Tutti i diritti riservati.'}
            </p>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-6">
              <Link
                href="/privacy"
                className="footer-link text-xs"
              >
                {language === 'pl' ? 'Polityka prywatności' : language === 'en' ? 'Privacy Policy' : 'Politica sulla privacy'}
              </Link>
              <Link
                href="/terms"
                className="footer-link text-xs"
              >
                {language === 'pl' ? 'Regulamin' : language === 'en' ? 'Terms of Service' : 'Termini di servizio'}
              </Link>
              <Link
                href="/cookies"
                className="footer-link text-xs"
              >
                {language === 'pl' ? 'Polityka cookies' : language === 'en' ? 'Cookie Policy' : 'Politica sui cookie'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
