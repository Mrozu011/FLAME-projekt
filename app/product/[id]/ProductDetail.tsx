
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { getTranslatedProductData } from '@/lib/translations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';
import ExpandableSection from './ExpandableSection';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  sku: string;
  brand: string;
  material: string;
  careInstructions: string[];
  nameKey?: string;
  deliveryType: 'own-stock' | 'dropshipping';
  specifications: {
    weight: string;
    dimensions: string;
    origin: string;
    warranty: string;
  };
  tags: string[];
}

interface ProductDetailProps {
  productId: string;
}

function ProductDetailContent({ productId }: ProductDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const mockProduct: Product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 149.99,
    originalPrice: 199.99,
    description: 'Experience premium sound quality with our wireless headphones featuring advanced noise cancellation technology, comfortable over-ear design, and long-lasting battery life.',
    images: [
      'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20black%20over-ear%20design%20modern%20sleek%20product%20photography%20white%20background%20studio%20lighting%20high%20quality&width=600&height=600&seq=headphones1&orientation=squarish',
      'https://readdy.ai/api/search-image?query=wireless%20headphones%20side%20view%20showing%20padding%20comfortable%20design%20product%20photography%20white%20background%20studio%20lighting&width=600&height=600&seq=headphones2&orientation=squarish',
      'https://readdy.ai/api/search-image?query=wireless%20headphones%20folded%20compact%20design%20product%20photography%20white%20background%20studio%20lighting%20high%20quality&width=600&height=600&seq=headphones3&orientation=squarish'
    ],
    category: 'Electronics',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Silver'],
    inStock: true,
    rating: 4.8,
    reviewCount: 256,
    sku: 'PWH-001',
    brand: 'AudioTech',
    material: 'Premium plastic and metal',
    deliveryType: 'own-stock',
    specifications: {
      weight: '250g',
      dimensions: '18 x 16 x 8 cm',
      origin: 'Germany',
      warranty: '2 years'
    },
    careInstructions: [
      'Clean with soft, dry cloth',
      'Store in protective case',
      'Avoid exposure to extreme temperatures',
      'Do not submerge in water'
    ],
    tags: ['wireless', 'noise-cancelling', 'premium', 'electronics']
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      id: '2',
      name: 'Bluetooth Speaker',
      price: 89.99,
      description: 'Portable Bluetooth speaker with 360-degree sound',
      images: [
        'https://readdy.ai/api/search-image?query=portable%20bluetooth%20speaker%20round%20design%20modern%20black%20product%20photography%20white%20background%20studio%20lighting&width=600&height=600&seq=speaker1&orientation=squarish'
      ],
      category: 'Electronics',
      sizes: ['One Size'],
      colors: ['Black', 'Blue'],
      inStock: true,
      rating: 4.5,
      reviewCount: 128,
      sku: 'BTS-002',
      brand: 'SoundTech',
      material: 'Fabric and plastic',
      deliveryType: 'own-stock',
      specifications: {
        weight: '400g',
        dimensions: '12 x 12 x 5 cm',
        origin: 'China',
        warranty: '1 year'
      },
      careInstructions: [
        'Clean with damp cloth',
        'Keep dry',
        'Charge regularly'
      ],
      tags: ['bluetooth', 'portable', 'speaker']
    }
  ];

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);

      // Get URL parameters for color and size
      const urlColor = searchParams.get('color');
      const urlSize = searchParams.get('size');

      // Set selected color and size from URL or defaults
      setSelectedColor(urlColor && foundProduct.colors.includes(urlColor) ? urlColor : foundProduct.colors[0]);
      setSelectedSize(urlSize && foundProduct.sizes.includes(urlSize) ? urlSize : foundProduct.sizes[0]);
    }
    setLoading(false);
  }, [productId, searchParams]);

  const handleAddToCart = () => {
    if (!product) return;

    const translatedName = getTranslatedProductName(product);

    const cartItem = {
      id: product.id,
      name: translatedName,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      size: selectedSize,
      color: selectedColor
    };

    const savedCart = localStorage.getItem('flame-cart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = cartItems.findIndex((item: any) =>
      item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push(cartItem);
    }

    localStorage.setItem('flame-cart', JSON.stringify(cartItems));
    setAddedToCart(true);

    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const getBreadcrumbs = () => {
    if (!product) return [];
    return [
      { name: t('home'), href: '/' },
      { name: t(product.category.toLowerCase()), href: `/${product.category.toLowerCase()}` },
      { name: t(product.name.toLowerCase()), href: '' }
    ];
  };

  const getDeliveryEstimate = () => {
    return product?.deliveryType === 'own-stock' ? '2-5 days' : '9-12 days';
  };

  const getStockDisplay = () => {
    if (!product) return '';
    return product.inStock ? t('inStock') : t('outOfStock');
  };

  const isVariantAvailable = (size: string, color: string) => {
    return product?.inStock;
  };

  const getTranslatedProductName = (product: Product) => {
    if (product.nameKey) {
      return getTranslatedProductData(product.nameKey, language);
    }
    return product.name;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors whitespace-nowrap">
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const translatedName = getTranslatedProductName(product);
  const productName = typeof translatedName === 'string' ? translatedName : translatedName.name ?? '';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 mb-8 text-sm">
          {getBreadcrumbs().map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <i className="ri-arrow-right-s-line text-gray-400 mx-2"></i>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.name}</span>
              )}
            </div>
          ))}
        </nav>

        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <i className="ri-arrow-left-line"></i>
          <span>{t('back')}</span>
        </button>

        {/* Highlight selected variant */}
        {(searchParams.get('color') || searchParams.get('size')) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="ri-check-circle-fill text-blue-600"></i>
              <span className="text-blue-800 font-medium">
                Selected: {selectedColor} / {selectedSize}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductImageGallery
            images={product.images}
            productName={productName}
          />

          <ProductInfo
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            quantity={quantity}
            setQuantity={setQuantity}
            productName={productName}
          />
        </div>

        <div className="space-y-8">
          <ExpandableSection
            title={t('description') || 'Description'}
            content={
              <div className="space-y-4">
                <p className="text-gray-700">{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                    <dl className="space-y-1">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex">
                          <dt className="text-gray-600 w-20">{key}:</dt>
                          <dd className="text-gray-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
                    <ul className="space-y-1">
                      {product.careInstructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <i className="ri-check-line text-green-500 mr-2 mt-0.5"></i>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            }
            defaultOpen={true}
          />

          <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviewCount} />

          <ExpandableSection
            title="Shipping Info"
            content={
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <i className="ri-truck-line text-green-500"></i>
                        <span className="text-gray-700">Standard Delivery: {getDeliveryEstimate()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-flashlight-line text-blue-500"></i>
                        <span className="text-gray-700">Express Delivery: 1-2 days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-store-line text-purple-500"></i>
                        <span className="text-gray-700">Parcel Locker (Paczkomat): 2-3 days</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Partners</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">DHL Express</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">InPost</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">UPS</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Free shipping on orders over $50. International shipping available to most countries.
                    Processing time: 1-2 business days.
                  </p>
                </div>
              </div>
            }
          />

          <ExpandableSection
            title="Payment Methods"
            content={
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Credit Cards</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <i className="ri-visa-line text-blue-600"></i>
                        <span className="text-gray-700">Visa</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-mastercard-line text-red-600"></i>
                        <span className="text-gray-700">Mastercard</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-bank-card-line text-blue-500"></i>
                        <span className="text-gray-700">American Express</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Digital Payments</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <i className="ri-paypal-line text-blue-600"></i>
                        <span className="text-gray-700">PayPal</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-google-pay-line text-green-600"></i>
                        <span className="text-gray-700">Google Pay</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-apple-line text-gray-800"></i>
                        <span className="text-gray-700">Apple Pay</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    All payments are processed securely using SSL encryption. We accept gift cards and coupon codes during checkout.
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          </div>
          <Footer />
        </div>
      }
    >
      <ProductDetailContent productId={productId} />
    </Suspense>
  );
}
