import { Product } from './dynamic-pages'
import { Metadata } from 'next'

interface SEOConfig {
  siteName: string
  baseUrl: string
  defaultImage: string
  twitterHandle: string
  facebookAppId?: string
}

export interface ProductSEO {
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogType: 'product'
  structuredData: any
  canonical: string
  alternateLanguages?: { [key: string]: string }
}

export class SEOManager {
  private config: SEOConfig

  constructor(config: SEOConfig) {
    this.config = config
  }

  generateProductSEO(product: Product, slug: string): ProductSEO {
    const productUrl = `${this.config.baseUrl}/product/${product.id}/${slug}`
    const keywords = this.generateKeywords(product)
    const structuredData = this.generateStructuredData(product, productUrl)

    return {
      title: `${product.name} - ${this.config.siteName}`,
      description: this.truncateDescription(product.description || '', 160),
      keywords,
      ogTitle: product.name,
      ogDescription: this.truncateDescription(product.description || '', 200),
      ogImage: product.images?.[0] || this.config.defaultImage,
      ogType: 'product',
      structuredData,
      canonical: productUrl,
      alternateLanguages: {
        'en': productUrl,
        'pl': `${productUrl}?lang=pl`,
        'de': `${productUrl}?lang=de`,
        'fr': `${productUrl}?lang=fr`
      }
    }
  }

  generateProductMetadata(product: Product, slug: string): Metadata {
    const seo = this.generateProductSEO(product, slug)
    const productUrl = `${this.config.baseUrl}/product/${product.id}/${slug}`
    
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords.join(', '),
      authors: [{ name: this.config.siteName }],
      robots: product.isPublished !== false ? 'index, follow' : 'noindex, nofollow',
      alternates: {
        canonical: seo.canonical,
        languages: seo.alternateLanguages || {}
      },
      openGraph: {
        title: seo.ogTitle,
        description: seo.ogDescription,
        type: 'website',
        url: productUrl,
        images: [
          {
            url: seo.ogImage,
            width: 1200,
            height: 630,
            alt: product.name
          }
        ],
        siteName: this.config.siteName,
        locale: 'en_US',
        alternateLocale: ['pl_PL', 'de_DE', 'fr_FR']
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.ogTitle,
        description: seo.ogDescription,
        images: [seo.ogImage],
        creator: this.config.twitterHandle
      },
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': 'USD',
        'product:availability': this.getAvailabilityStatus(product),
        'product:condition': 'new',
        'product:brand': this.config.siteName,
        'product:category': product.category,
        'product:retailer_item_id': product.id
      }
    }
  }

  private generateKeywords(product: Product): string[] {
    const baseKeywords = [
      product.name.toLowerCase(),
      product.category,
      product.subcategory,
      'fashion',
      'clothing',
      'premium',
      'online shopping'
    ]

    // Add material keywords
    if (product.material) {
      baseKeywords.push(product.material.toLowerCase())
    }

    // Add color keywords
    if (product.colors && product.colors.length > 0) {
      baseKeywords.push(...product.colors.map(color => color.toLowerCase()))
    }

    // Add size keywords
    if (product.size && product.size.length > 0) {
      baseKeywords.push(...product.size.map(size => size.toLowerCase()))
    }

    // Add tag keywords
    if (product.tags && product.tags.length > 0) {
      baseKeywords.push(...product.tags)
    }

    // Add brand-specific keywords
    baseKeywords.push(this.config.siteName.toLowerCase())

    return [...new Set(baseKeywords.filter(keyword => keyword.length > 2))]
  }

  private generateStructuredData(product: Product, productUrl: string): any {
    const offers = {
      '@type': 'Offer',
      'url': productUrl,
      'priceCurrency': 'USD',
      'price': product.price.toString(),
      'availability': this.getSchemaAvailability(product),
      'seller': {
        '@type': 'Organization',
        'name': this.config.siteName
      }
    }

    if (product.originalPrice && product.originalPrice > product.price) {
      (offers as any).priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    const aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': product.rating.toString(),
      'reviewCount': product.reviewCount.toString(),
      'bestRating': '5',
      'worstRating': '1'
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'description': product.description,
      'image': product.images || [this.config.defaultImage],
      'brand': {
        '@type': 'Brand',
        'name': this.config.siteName
      },
      'category': product.category,
      'sku': product.id,
      'offers': offers,
      'aggregateRating': aggregateRating,
      'url': productUrl
    }

    // Add additional properties if available
    if (product.material) {
      (structuredData as any).material = product.material
    }

    if (product.colors && product.colors.length > 0) {
      (structuredData as any).color = product.colors
    }

    if (product.size && product.size.length > 0) {
      (structuredData as any).size = product.size
    }

    if ((product as any).has3DModel) {
      (structuredData as any).additionalProperty = [
        {
          '@type': 'PropertyValue',
          'name': '3D Model',
          'value': 'Available'
        }
      ]
    }

    return structuredData
  }

  private getAvailabilityStatus(product: Product): string {
    if (product.stockStatus === 'in-stock') return 'in stock'
    if (product.stockStatus === 'low-stock') return 'limited availability'
    return 'out of stock'
  }

  private getSchemaAvailability(product: Product): string {
    if (product.stockStatus === 'in-stock') return 'https://schema.org/InStock'
    if (product.stockStatus === 'low-stock') return 'https://schema.org/LimitedAvailability'
    return 'https://schema.org/OutOfStock'
  }

  private truncateDescription(description: string, maxLength: number): string {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  generateFallbackSEO(productId: string, slug: string): ProductSEO {
    const productUrl = `${this.config.baseUrl}/product/${productId}/${slug}`
    
    return {
      title: `Product Not Found - ${this.config.siteName}`,
      description: 'The product you are looking for is not available or has been discontinued.',
      keywords: ['product not found', 'discontinued', 'unavailable', this.config.siteName.toLowerCase()],
      ogTitle: 'Product Not Found',
      ogDescription: 'This product is no longer available.',
      ogImage: this.config.defaultImage,
      ogType: 'product',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': 'Product Not Found',
        'description': 'This product is no longer available.',
        'offers': {
          '@type': 'Offer',
          'availability': 'https://schema.org/Discontinued'
        }
      },
      canonical: productUrl
    }
  }
}

// Default configuration
const seoConfig: SEOConfig = {
  siteName: 'Flame Fashion',
  baseUrl: 'https://flamestore.com',
  defaultImage: 'https://flamestore.com/images/default-product.jpg',
  twitterHandle: '@flamestore',
  facebookAppId: process.env.FACEBOOK_APP_ID
}

export const seoManager = new SEOManager(seoConfig)