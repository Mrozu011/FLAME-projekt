import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/order-history/',
          '/profile/',
          '/cart/',
          '/login/',
          '/register/',
          '/403/',
          '/search?*',
          '/*?*color=*',
          '/*?*size=*',
          '/*?*sort=*',
          '/*?*filter=*'
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/order-history/',
          '/profile/',
          '/cart/',
          '/login/',
          '/register/',
          '/403/'
        ]
      }
    ],
    sitemap: 'https://flamestore.com/sitemap.xml',
    host: 'https://flamestore.com'
  }
}