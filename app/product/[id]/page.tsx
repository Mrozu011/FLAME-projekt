
import { Metadata } from 'next'
import ProductDetail from './ProductDetail'
import { getAllProducts, getProductById } from '@/lib/dynamic-pages'
import { seoManager } from '@/lib/seo-manager'
import { notFound } from 'next/navigation'
import RecommendationSection from '@/components/RecommendationSection';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById(params.id)

  if (!product) {
    return {
      title: 'Product Not Found - Flame Fashion',
      description: 'The product you are looking for is not available.',
      robots: 'noindex, nofollow'
    }
  }

  const slug = generateProductSlug(product.name)
  return seoManager.generateProductMetadata(product, slug)
}

export async function generateStaticParams() {
  const products = getAllProducts()

  // Include all possible product IDs that might be accessed
  const staticParams = products.map(product => ({
    id: product.id
  }))

  // Add additional IDs that might be referenced in the app
  const additionalIds = [
    '4', '5', '6', '9', '10', '11', '12', '14', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ]

  additionalIds.forEach(id => {
    if (!staticParams.find(param => param.id === id)) {
      staticParams.push({ id })
    }
  })

  return staticParams
}

function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  const slug = generateProductSlug(product.name)
  const seo = seoManager.generateProductSEO(product, slug)
  const productId = params.id;

  return (
    <div className="min-h-screen bg-theme-primary transition-theme">      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail productId={productId} />
        
        {/* Frequently Bought Together */}
        <section className="mt-12">
          <FrequentlyBoughtTogether
            productId={productId}
            userId="guest"
          />
        </section>

        {/* You May Also Like */}
        <section className="mt-12">
          <RecommendationSection
            title="You May Also Like"
            userId="guest"
            context={{ 
              type: 'product_page', 
              currentProductId: productId 
            }}
            limit={8}
            showReasons={true}
          />
        </section>

        {/* Similar Products */}
        <section className="mt-12">
          <RecommendationSection
            title="Similar Products"
            userId="guest"
            context={{ 
              type: 'category', 
              currentProductId: productId 
            }}
            limit={6}
            showReasons={false}
          />
        </section>
      </main>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData, null, 2)
        }}
      />
    </div>
  )
}
