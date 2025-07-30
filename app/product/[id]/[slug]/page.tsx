import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ProductDetail from '../ProductDetail'
import { dynamicPageManager } from '@/lib/dynamic-pages'
import { seoManager } from '@/lib/seo-manager'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: { id: string; slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = dynamicPageManager?.getProductById(params.id) || null
  
  if (!product) {
    return {
      title: 'Product Not Found - Flame Fashion',
      description: 'The product you are looking for is not available.',
      robots: 'noindex, nofollow'
    }
  }

  const correctSlug = generateProductSlug(product.name)
  
  // If slug doesn't match, redirect to correct URL
  if (params.slug !== correctSlug) {
    redirect(`/product/${params.id}/${correctSlug}`)
  }

  return seoManager.generateProductMetadata(product, correctSlug)
}

export async function generateStaticParams() {
  const products = dynamicPageManager?.getAllProducts() || []
  
  return products.map(product => ({
    id: product.id,
    slug: generateProductSlug(product.name)
  }))
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
  const product = dynamicPageManager?.getProductById(params.id) || null
  
  if (!product) {
    notFound()
  }

  const correctSlug = generateProductSlug(product.name)
  
  // Redirect if slug doesn't match
  if (params.slug !== correctSlug) {
    redirect(`/product/${params.id}/${correctSlug}`)
  }

  const seo = seoManager.generateProductSEO(product, correctSlug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData, null, 2)
        }}
      />
      <ProductDetail productId={params.id} />
    </>
  )
}