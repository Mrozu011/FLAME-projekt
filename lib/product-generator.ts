import { Product } from './dynamic-pages'
import { seoManager } from './seo-manager'

export interface ProductGenerationData {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory: string
  images: string[]
  colors: string[]
  sizes: string[]
  material?: string
  tags?: string[]
  has3DModel?: boolean
  specifications?: { [key: string]: string }
  careInstructions?: string[]
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'
  isPublished?: boolean
}

export class ProductGenerator {
  private static instance: ProductGenerator
  private generatedProducts: Map<string, Product> = new Map()

  private constructor() {}

  static getInstance(): ProductGenerator {
    if (!ProductGenerator.instance) {
      ProductGenerator.instance = new ProductGenerator()
    }
    return ProductGenerator.instance
  }

  generateProductSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  generateProductId(name: string, category: string): string {
    const prefix = category.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const nameHash = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8)
    return `${prefix}-${nameHash}-${timestamp}`
  }

  async generateProduct(data: ProductGenerationData): Promise<{
    product: Product
    slug: string
    url: string
    seo: any
  }> {
    // Generate unique product ID if not provided
    const productId = data.id || this.generateProductId(data.name, data.category)
    
    // Generate SEO-friendly slug
    const slug = this.generateProductSlug(data.name)
    
    // Create product object
    const product: Product = {
      id: productId,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      category: data.category,
      subcategory: data.subcategory,
      image: data.images[0] || '',
      images: data.images,
      rating: 4.5, // Default rating
      reviewCount: 0, // Default review count
      size: data.sizes,
      colors: data.colors,
      material: data.material || 'Not specified',
      tags: data.tags || [],
      has3DModel: data.has3DModel || false,
      popularity: 50, // Default popularity
      stockStatus: data.stockStatus || 'in-stock',
      isPublished: data.isPublished !== false
    }

    // Add additional properties if available
    if (data.specifications) {
      product.specifications = data.specifications
    }

    if (data.careInstructions) {
      product.careInstructions = data.careInstructions
    }

    // Generate URL
    const url = `/product/${productId}/${slug}`

    // Generate SEO metadata
    const seo = seoManager.generateProductSEO(product, slug)

    // Store generated product
    this.generatedProducts.set(productId, product)

    return {
      product,
      slug,
      url,
      seo
    }
  }

  async generateProductPage(productId: string, data: ProductGenerationData): Promise<string> {
    const { product, slug, url, seo } = await this.generateProduct(data)

    // Generate the product page component
    const pageComponent = this.generateProductPageComponent(product, slug, seo)

    // Create the page directory structure
    const pageDir = `app/product/${productId}`
    const pagePath = `${pageDir}/page.tsx`

    return pageComponent
  }

  private generateProductPageComponent(product: Product, slug: string, seo: any): string {
    return `import { Metadata } from 'next'
import ProductDetail from '../ProductDetail'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "${seo.title}",
    description: "${seo.description}",
    keywords: [${seo.keywords.map(k => `"${k}"`).join(', ')}],
    authors: [{ name: "Flame Fashion" }],
    robots: "index, follow",
    canonical: "${seo.canonical}",
    openGraph: {
      title: "${seo.ogTitle}",
      description: "${seo.ogDescription}",
      type: "website",
      url: "${seo.canonical}",
      images: [
        {
          url: "${seo.ogImage}",
          width: 1200,
          height: 630,
          alt: "${product.name}"
        }
      ],
      siteName: "Flame Fashion",
      locale: "en_US"
    },
    twitter: {
      card: "summary_large_image",
      title: "${seo.ogTitle}",
      description: "${seo.ogDescription}",
      images: ["${seo.ogImage}"]
    },
    other: {
      "product:price:amount": "${product.price}",
      "product:price:currency": "USD",
      "product:availability": "${seo.structuredData.offers.availability}",
      "product:condition": "new",
      "product:brand": "Flame Fashion",
      "product:category": "${product.category}",
      "product:retailer_item_id": "${product.id}"
    }
  }
}

export async function generateStaticParams() {
  return [{ id: '${product.id}' }]
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(${JSON.stringify(seo.structuredData, null, 2)})
        }}
      />
      <ProductDetail productId="${product.id}" />
    </>
  )
}`
  }

  generateFallbackPage(productId: string, slug: string): string {
    const fallbackSEO = seoManager.generateFallbackSEO(productId, slug)
    
    return `import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "${fallbackSEO.title}",
  description: "${fallbackSEO.description}",
  robots: "noindex, nofollow",
  openGraph: {
    title: "${fallbackSEO.ogTitle}",
    description: "${fallbackSEO.ogDescription}",
    type: "website",
    images: [
      {
        url: "${fallbackSEO.ogImage}",
        width: 1200,
        height: 630,
        alt: "Product Not Found"
      }
    ]
  }
}

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-search-line text-gray-400 text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              The product you're looking for is no longer available or has been discontinued.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What can you do?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="ri-search-2-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Search Similar Products</h3>
                <p className="text-sm text-gray-600">Find similar items in our collection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="ri-star-line text-green-600 text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Check New Arrivals</h3>
                <p className="text-sm text-gray-600">Discover our latest products</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="ri-home-4-line text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Return Home</h3>
                <p className="text-sm text-gray-600">Browse our main categories</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Search Products
              </Link>
              <Link
                href="/sale"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                View Sale Items
              </Link>
              <Link
                href="/"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}`
  }

  getGeneratedProduct(productId: string): Product | null {
    return this.generatedProducts.get(productId) || null
  }

  getAllGeneratedProducts(): Product[] {
    return Array.from(this.generatedProducts.values())
  }

  updateProduct(productId: string, updates: Partial<Product>): boolean {
    const product = this.generatedProducts.get(productId)
    if (product) {
      this.generatedProducts.set(productId, { ...product, ...updates })
      return true
    }
    return false
  }

  deleteProduct(productId: string): boolean {
    return this.generatedProducts.delete(productId)
  }
}

export const productGenerator = ProductGenerator.getInstance()