
import { MetadataRoute } from 'next'
import { dynamicPageManager } from '@/lib/dynamic-pages'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://flamestore.com'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/women',
    '/men',
    '/accessories',
    '/sale',
    '/careers',
    '/press',
    '/sustainability',
    '/size-guide',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
    '/faq',
    '/cookies',
    '/accessibility'
  ]

  const staticSitemap = staticPages.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  // Dynamic product pages - only published products
  const products = dynamicPageManager.getProductsForSitemap()
  const productSitemap = products.map(product => ({
    url: `${baseUrl}/product/${product.id}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Category pages
  const categories = dynamicPageManager.getAvailableCategories()
  const categorySitemap = categories.map(category => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Subcategory pages
  const subcategorySitemap: any[] = []
  categories.forEach(category => {
    const subcategories = dynamicPageManager.getAvailableSubcategories(category)
    subcategories.forEach(subcategory => {
      subcategorySitemap.push({
        url: `${baseUrl}/${category}/${subcategory}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    })
  })

  return [
    ...staticSitemap,
    ...productSitemap,
    ...categorySitemap,
    ...subcategorySitemap
  ]
}
