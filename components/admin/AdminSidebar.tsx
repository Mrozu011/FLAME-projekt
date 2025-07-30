
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminTranslation, LanguageSwitcher } from '@/hooks/useAdminTranslation';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { t } = useAdminTranslation();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    {
      name: t('navigation.dashboard'),
      href: '/admin',
      icon: 'ri-dashboard-line',
      exact: true
    },
    {
      name: t('navigation.products'),
      href: '/admin/products',
      icon: 'ri-box-3-line',
      children: [
        { name: t('products.addProduct'), href: '/admin/products/create' },
        { name: t('navigation.inventory'), href: '/admin/inventory' }
      ]
    },
    {
      name: t('navigation.orders'),
      href: '/admin/orders',
      icon: 'ri-shopping-bag-line',
      children: [
        { name: t('navigation.returns'), href: '/admin/returns' },
        { name: t('navigation.invoices'), href: '/admin/invoices' }
      ]
    },
    {
      name: t('navigation.customers'),
      href: '/admin/customers',
      icon: 'ri-user-line',
      children: [
        { name: t('navigation.users'), href: '/admin/users' },
        { name: t('navigation.reviews'), href: '/admin/reviews' }
      ]
    },
    {
      name: t('navigation.marketing'),
      href: '/admin/marketing',
      icon: 'ri-megaphone-line',
      children: [
        { name: t('navigation.campaigns'), href: '/admin/campaigns' },
        { name: t('navigation.discounts'), href: '/admin/discounts' },
        { name: t('navigation.promotions'), href: '/admin/promotions' }
      ]
    },
    {
      name: t('navigation.analytics'),
      href: '/admin/analytics',
      icon: 'ri-bar-chart-line',
      children: [
        { name: t('navigation.reports'), href: '/admin/reports' },
        { name: t('navigation.tracking'), href: '/admin/tracking' }
      ]
    },
    {
      name: t('navigation.content'),
      href: '/admin/content',
      icon: 'ri-file-text-line',
      children: [
        { name: t('navigation.translations'), href: '/admin/translations' }
      ]
    },
    {
      name: t('navigation.settings'),
      href: '/admin/settings',
      icon: 'ri-settings-3-line',
      children: [
        { name: t('navigation.notifications'), href: '/admin/notifications' },
        { name: t('navigation.security'), href: '/admin/security' },
        { name: t('navigation.systemHistory'), href: '/admin/system-history' }
      ]
    },
    {
      name: t('navigation.help'),
      href: '/admin/help',
      icon: 'ri-question-line'
    },
    {
      name: t('navigation.support'),
      href: '/admin/support',
      icon: 'ri-customer-service-line'
    }
  ];

  const isActiveRoute = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleItemClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white shadow-lg lg:shadow-none border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-3" onClick={handleItemClick}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-store-line text-white"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>
                  Flame
                </h2>
                <p className="text-xs text-gray-600">{t('navigation.dashboard')}</p>
              </div>
            </Link>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            )}
          </div>

          {/* Language Switcher */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{t('common.language')}</label>
            </div>
            <LanguageSwitcher className="w-full" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleItemClick}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActiveRoute(item.href, item.exact)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <i className={`${item.icon} mr-3 text-lg`}></i>
                  {item.name}
                  {item.children && (
                    <i className="ri-arrow-down-s-line ml-auto text-gray-400"></i>
                  )}
                </Link>
                
                {/* Sub-navigation */}
                {item.children && isActiveRoute(item.href) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={handleItemClick}
                        className={`
                          flex items-center px-3 py-2 rounded-lg text-sm transition-colors
                          ${isActiveRoute(child.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Flame Admin Panel</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
