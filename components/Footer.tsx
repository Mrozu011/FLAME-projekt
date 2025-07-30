
'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  const helpLinks = [
    { name: t('contact'), href: '/contact' },
    { name: t('faq'), href: '/faq' },
    { name: t('sizeGuide'), href: '/size-guide' },
    { name: t('shipping'), href: '/shipping' },
    { name: t('returns'), href: '/returns' }
  ];

  const legalLinks = [
    { name: t('privacy'), href: '/privacy' },
    { name: t('terms'), href: '/terms' },
    { name: t('cookies'), href: '/cookies' },
    { name: t('accessibility'), href: '/accessibility' }
  ];

  const companyLinks = [
    { name: t('about'), href: '/about' },
    { name: t('careers'), href: '/careers' },
    { name: t('press'), href: '/press' },
    { name: t('sustainability'), href: '/sustainability' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'ri-facebook-fill' },
    { name: 'Instagram', href: '#', icon: 'ri-instagram-line' },
    { name: 'Twitter', href: '#', icon: 'ri-twitter-fill' },
    { name: 'YouTube', href: '#', icon: 'ri-youtube-fill' },
    { name: 'TikTok', href: '#', icon: 'ri-tiktok-fill' }
  ];

  return (
    <footer className="bg-theme-secondary border-t border-theme-primary transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Help Links */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary uppercase tracking-wider mb-4">
              {t('help')}
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-theme-secondary hover:text-theme-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary uppercase tracking-wider mb-4">
              {t('company')}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-theme-secondary hover:text-theme-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary uppercase tracking-wider mb-4">
              {t('legal')}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-theme-secondary hover:text-theme-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Information - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand */}
            <div>
              <Link href="/" className="text-2xl font-bold text-theme-primary hover:text-theme-secondary transition-colors">
                <span style={{ fontFamily: 'Pacifico, serif' }}>FLAME</span>
              </Link>
              <p className="mt-3 text-theme-secondary text-sm leading-relaxed max-w-sm">
                {t('footerBrandDescription')}
              </p>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-theme-secondary">
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-phone-line text-base"></i>
                </div>
                <span>+48 123 456 789</span>
              </div>
              <div className="flex items-center text-sm text-theme-secondary">
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-mail-line text-base"></i>
                </div>
                <span>hello@flame-fashion.eu</span>
              </div>
              <div className="flex items-start text-sm text-theme-secondary">
                <div className="w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                  <i className="ri-map-pin-line text-base"></i>
                </div>
                <span>ul. Pokoju 59, 05-320 Mrozy, Poland</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium text-theme-primary mb-4">
                {t('followUs')}
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center bg-theme-primary/10 hover:bg-theme-accent text-theme-secondary hover:text-white rounded-lg transition-all duration-300 hover:scale-105"
                    aria-label={social.name}
                  >
                    <i className={`${social.icon} text-lg`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-theme-primary">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <p className="text-sm text-theme-secondary text-center lg:text-left">
              © {new Date().getFullYear()} Flame Fashion. {t('allRightsReserved')}
            </p>
            <div className="mt-4 lg:mt-0 flex flex-wrap items-center justify-center lg:justify-end space-x-6">
              <div className="flex items-center space-x-2">
                <i className="ri-secure-payment-line text-theme-secondary"></i>
                <span className="text-sm text-theme-secondary">{t('securePayment')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-truck-line text-theme-secondary"></i>
                <span className="text-sm text-theme-secondary">{t('freeShipping')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-shield-check-line text-theme-secondary"></i>
                <span className="text-sm text-theme-secondary">{t('qualityGuarantee')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
