
import { categoryMapping, getCategoryName, getSubcategoryName } from './translations';

export interface DynamicPageConfig {
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  path: string;
  filters?: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  category: string;
  subcategory: string;
  size: string[];
  colors: string[];
  material: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  popularity: number;
  tags: string[];
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  isPublished?: boolean;
  specifications?: { [key: string]: string };
  careInstructions?: string[];
  description?: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Static product data that works in both server and client contexts
const STATIC_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Elegant Summer Dress',
    price: 89.99,
    originalPrice: 120.00,
    image: 'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20fashion%20photography%2C%20model%20wearing%20stylish%20dress%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=dress-1&orientation=portrait',
    images: [
      'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20fashion%20photography%2C%20model%20wearing%20stylish%20dress%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=dress-1&orientation=portrait',
      'https://readdy.ai/api/search-image?query=elegant%20summer%20dress%20back%20view%2C%20fashion%20model%20showing%20dress%20details%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=dress-1-back&orientation=portrait'
    ],
    rating: 4.5,
    reviewCount: 128,
    category: 'women',
    subcategory: 'dresses',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Red'],
    material: '95% Polyester, 5% Elastane',
    isNew: true,
    isOnSale: true,
    discount: 25,
    popularity: 95,
    tags: ['summer', 'elegant', 'bestseller'],
    stockStatus: 'in-stock',
    isPublished: true,
    description: 'A beautiful and elegant summer dress perfect for any occasion. Made from high-quality materials with attention to detail. Features a flattering silhouette that complements all body types.',
    specifications: {
      'Material': '95% Polyester, 5% Elastane',
      'Length': 'Knee-length',
      'Sleeve': 'Sleeveless',
      'Closure': 'Back zip',
      'Lining': 'Fully lined',
      'Fit': 'Regular fit'
    },
    careInstructions: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low heat',
      'Dry clean if needed'
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Classic White Blouse',
    price: 45.99,
    image: 'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20fashion%20photography%2C%20professional%20business%20attire%2C%20model%20wearing%20elegant%20shirt%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=blouse-1&orientation=portrait',
    images: [
      'https://readdy.ai/api/search-image?query=classic%20white%20blouse%20fashion%20photography%2C%20professional%20business%20attire%2C%20model%20wearing%20elegant%20shirt%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=blouse-1&orientation=portrait'
    ],
    rating: 4.8,
    reviewCount: 95,
    category: 'women',
    subcategory: 'tops',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue', 'Pink'],
    material: '70% Cotton, 30% Polyester',
    isNew: false,
    isOnSale: false,
    popularity: 88,
    tags: ['classic', 'professional', 'cotton'],
    stockStatus: 'in-stock',
    isPublished: true,
    description: 'A timeless classic white blouse perfect for professional and casual wear. Crafted from premium cotton blend for comfort and durability.',
    specifications: {
      'Material': '70% Cotton, 30% Polyester',
      'Collar': 'Classic collar',
      'Sleeve': 'Long sleeve',
      'Closure': 'Button front',
      'Fit': 'Regular fit'
    },
    careInstructions: [
      'Machine wash warm',
      'Do not bleach',
      'Tumble dry medium',
      'Iron on medium heat',
      'Professional dry clean'
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'High-Waisted Skinny Jeans',
    price: 79.99,
    originalPrice: 95.00,
    image: 'https://readdy.ai/api/search-image?query=high%20waisted%20skinny%20jeans%20fashion%20photography%2C%20model%20wearing%20denim%20pants%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=jeans-1&orientation=portrait',
    images: [
      'https://readdy.ai/api/search-image?query=high%20waisted%20skinny%20jeans%20fashion%20photography%2C%20model%20wearing%20denim%20pants%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=jeans-1&orientation=portrait'
    ],
    rating: 4.3,
    reviewCount: 156,
    category: 'women',
    subcategory: 'jeans',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Dark Blue', 'Black', 'Light Blue'],
    material: '98% Cotton, 2% Elastane',
    isNew: false,
    isOnSale: true,
    discount: 16,
    popularity: 92,
    tags: ['denim', 'skinny', 'high-waisted'],
    stockStatus: 'in-stock',
    isPublished: true,
    description: 'High-waisted skinny jeans for a stylish and comfortable fit. Made from premium denim for durability and flexibility.',
    specifications: {
      'Material': '98% Cotton, 2% Elastane',
      'Length': 'Ankle-length',
      'Fit': 'Skinny fit',
      'Closure': 'Button fly',
      'Pocket': 'Five pocket style'
    },
    careInstructions: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low heat',
      'Dry clean if needed'
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '7',
    name: 'Classic Denim Jacket',
    price: 89.99,
    originalPrice: 110.00,
    image: 'https://readdy.ai/api/search-image?query=classic%20denim%20jacket%20men%20fashion%20photography%2C%20model%20wearing%20stylish%20jacket%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-jacket-1&orientation=portrait',
    images: [
      'https://readdy.ai/api/search-image?query=classic%20denim%20jacket%20men%20fashion%20photography%2C%20model%20wearing%20stylish%20jacket%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-jacket-1&orientation=portrait'
    ],
    rating: 4.6,
    reviewCount: 142,
    category: 'men',
    subcategory: 'jackets',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Black', 'Light Blue'],
    material: '100% Cotton Denim',
    isNew: false,
    isOnSale: true,
    discount: 18,
    popularity: 93,
    tags: ['denim', 'classic', 'casual'],
    stockStatus: 'in-stock',
    isPublished: true,
    description: 'A classic denim jacket for a timeless look. Made from premium cotton denim for durability and comfort.',
    specifications: {
      'Material': '100% Cotton Denim',
      'Length': 'Hip-length',
      'Fit': 'Regular fit',
      'Closure': 'Button front',
      'Pocket': 'Four pocket style'
    },
    careInstructions: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low heat',
      'Dry clean if needed'
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '8',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    image: 'https://readdy.ai/api/search-image?query=premium%20cotton%20t-shirt%20men%20fashion%20photography%2C%20model%20wearing%20basic%20tee%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-tshirt-1&orientation=portrait',
    images: [
      'https://readdy.ai/api/search-image?query=premium%20cotton%20t-shirt%20men%20fashion%20photography%2C%20model%20wearing%20basic%20tee%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=mens-tshirt-1&orientation=portrait'
    ],
    rating: 4.8,
    reviewCount: 256,
    category: 'men',
    subcategory: 'tshirts',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    material: '100% Organic Cotton',
    isNew: true,
    isOnSale: false,
    popularity: 98,
    tags: ['cotton', 'basic', 'organic', 'bestseller'],
    stockStatus: 'in-stock',
    isPublished: true,
    description: 'A premium cotton t-shirt for a comfortable and stylish fit. Made from high-quality organic cotton for durability and breathability.',
    specifications: {
      'Material': '100% Organic Cotton',
      'Length': 'Crew neck',
      'Fit': 'Regular fit',
      'Closure': 'None',
      'Pocket': 'None'
    },
    careInstructions: [
      'Machine wash warm',
      'Do not bleach',
      'Tumble dry medium',
      'Iron on medium heat',
      'Professional dry clean'
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '13',
    name: 'Leather Crossbody Bag',
    price: 129.99,
    originalPrice: 160.00,
    image: 'https://readdy.ai/api/search-image?query=leather%20crossbody%20bag%20fashion%20photography%2C%20luxury%20handbag%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=bag-1&orientation=portrait',
    images: [
      'https://readdy.ai/api/search-image?query=leather%20crossbody%20bag%20fashion%20photography%2C%20luxury%20handbag%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=bag-1&orientation=portrait'
    ],
    rating: 4.7,
    reviewCount: 203,
    category: 'accessories',
    subcategory: 'bags',
    size: ['One Size'],
    colors: ['Black', 'Brown', 'Tan', 'Burgundy'],
    material: 'Genuine Leather',
    isNew: false,
    isOnSale: true,
    discount: 19,
    popularity: 92,
    tags: ['leather', 'crossbody', 'luxury'],
    stockStatus: 'in-stock',
    isPublished: true,
    description: 'A luxurious leather crossbody bag for a stylish and practical accessory. Made from high-quality genuine leather for durability and sophistication.',
    specifications: {
      'Material': 'Genuine Leather',
      'Length': 'Adjustable strap',
      'Closure': 'Magnetic snap',
      'Pocket': 'One interior pocket'
    },
    careInstructions: [
      'Avoid exposure to water',
      'Avoid exposure to direct sunlight',
      'Use leather conditioner to maintain leather quality',
      'Avoid contact with abrasive materials'
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '15',
    name: 'Classic Sunglasses',
    price: 89.99,
    originalPrice: 120.00,
    image: 'https://readdy.ai/api/search-image?query=classic%20sunglasses%20fashion%20photography%2C%20designer%20eyewear%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=sunglasses-1&orientation=portrait',
    images: [
      'https://readdy.ai/api/search-image?query=classic%20sunglasses%20fashion%20photography%2C%20designer%20eyewear%2C%20professional%20product%20photography%2C%20clean%20studio%20background%2C%20modern%20fashion%20brand%20aesthetic&width=400&height=500&seq=sunglasses-1&orientation=portrait'
    ],
    rating: 4.8,
    reviewCount: 267,
    category: 'accessories',
    subcategory: 'eyewear',
    size: ['One Size'],
    colors: ['Black', 'Brown', 'Gold'],
    material: 'Acetate Frame',
    isNew: false,
    isOnSale: true,
    discount: 25,
    popularity: 95,
    tags: ['sunglasses', 'classic', 'bestseller'],
    stockStatus: 'in-stock',
    isPublished: true,
    description: 'A classic pair of sunglasses for a timeless and stylish look. Made from high-quality acetate frames for durability and comfort.',
    specifications: {
      'Material': 'Acetate Frame',
      'Lens': 'Polycarbonate lens',
      'Frame': 'Classic aviator shape',
      'Temple': 'Acetate temple tips'
    },
    careInstructions: [
      'Avoid exposure to water',
      'Avoid exposure to direct sunlight',
      'Use soft cloth to clean lenses',
      'Avoid contact with abrasive materials'
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

export class DynamicPageManager {
  private static instance: DynamicPageManager;
  private products: Product[] = [];
  private pageConfigs: Map<string, DynamicPageConfig> = new Map();

  private constructor() {
    this.products = [...STATIC_PRODUCTS];
    this.generatePageConfigs();
  }

  static getInstance(): DynamicPageManager {
    if (!DynamicPageManager.instance) {
      DynamicPageManager.instance = new DynamicPageManager();
    }
    return DynamicPageManager.instance;
  }

  private generatePageConfigs(): void {
    const categories = ['women', 'men', 'accessories', 'sale'];

    categories.forEach(category => {
      this.pageConfigs.set(category, {
        category,
        title: `${getCategoryName(category, 'en')} - Flame Fashion`,
        description: `Discover our ${getCategoryName(category, 'en').toLowerCase()} collection. Premium quality fashion at affordable prices.`,
        path: `/${category}`
      });
    });

    Object.entries(categoryMapping.en).forEach(([categoryKey, categoryData]) => {
      Object.entries(categoryData.subcategories).forEach(([subcategoryKey, subcategoryName]) => {
        const path = `/${categoryKey}/${subcategoryKey}`;
        this.pageConfigs.set(path, {
          category: categoryKey,
          subcategory: subcategoryKey,
          title: `${subcategoryName} - ${categoryData.name} - Flame Fashion`,
          description: `Shop ${subcategoryName.toLowerCase()} in our ${categoryData.name.toLowerCase()} collection. Find the perfect pieces for your style.`,
          path
        });
      });
    });
  }

  public getPageConfig(path: string): DynamicPageConfig | null {
    return this.pageConfigs.get(path) || null;
  }

  public getProductsByCategory(category: string, subcategory?: string): Product[] {
    let filtered = this.products.filter(product => product.category === category);

    if (subcategory) {
      filtered = filtered.filter(product => product.subcategory === subcategory);
    }

    return filtered;
  }

  public getProductsByTag(tag: string): Product[] {
    return this.products.filter(product => product.tags.includes(tag));
  }

  public getSaleProducts(): Product[] {
    return this.products.filter(product => product.isOnSale);
  }

  public getNewProducts(): Product[] {
    return this.products.filter(product => product.isNew);
  }

  public getBestSellerProducts(): Product[] {
    return this.products.filter(product => product.tags.includes('bestseller'));
  }

  public getAllProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | null {
    return this.products.find(product => product.id === id) || null;
  }

  public searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.subcategory.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      product.material.toLowerCase().includes(lowerQuery)
    );
  }

  public getAvailableCategories(): string[] {
    return Array.from(new Set(this.products.map(p => p.category)));
  }

  public getAvailableSubcategories(category: string): string[] {
    return Array.from(new Set(
      this.products
        .filter(p => p.category === category)
        .map(p => p.subcategory)
    ));
  }

  public getAvailableSizes(category?: string, subcategory?: string): string[] {
    let filtered = this.products;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }

    return Array.from(new Set(filtered.flatMap(p => p.size))).sort();
  }

  public getAvailableColors(category?: string, subcategory?: string): string[] {
    let filtered = this.products;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }

    return Array.from(new Set(filtered.flatMap(p => p.colors))).sort();
  }

  public getAvailableMaterials(category?: string, subcategory?: string): string[] {
    let filtered = this.products;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }

    return Array.from(new Set(filtered.map(p => p.material))).sort();
  }

  public getAvailableTags(category?: string, subcategory?: string): string[] {
    let filtered = this.products;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }

    return Array.from(new Set(filtered.flatMap(p => p.tags))).sort();
  }

  public addProduct(product: Product): string {
    const slug = this.generateProductSlug(product.name);

    const productWithMeta = {
      ...product,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: product.isPublished !== false
    };

    this.products.push(productWithMeta);
    this.generatePageConfigs();

    return slug;
  }

  public updateProduct(id: string, updates: Partial<Product>): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      if (updates.name && updates.name !== this.products[index].name) {
        updates.slug = this.generateProductSlug(updates.name);
      }

      this.products[index] = { 
        ...this.products[index], 
        ...updates,
        updatedAt: new Date()
      };
      return true;
    }
    return false;
  }

  public deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  public getProductBySlug(slug: string): Product | null {
    return this.products.find(p => p.slug === slug) || null;
  }

  public generateProductSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  public generateProductUrl(product: Product): string {
    const slug = product.slug || this.generateProductSlug(product.name);
    return `/product/${product.id}/${slug}`;
  }

  public getPublishedProducts(): Product[] {
    return this.products.filter(product => product.isPublished !== false);
  }

  public getUnpublishedProducts(): Product[] {
    return this.products.filter(product => product.isPublished === false);
  }

  public publishProduct(id: string): boolean {
    return this.updateProduct(id, { isPublished: true });
  }

  public unpublishProduct(id: string): boolean {
    return this.updateProduct(id, { isPublished: false });
  }

  public getProductsForSitemap(): Array<{id: string, slug: string, updatedAt: Date}> {
    return this.getPublishedProducts().map(product => ({
      id: product.id,
      slug: product.slug || this.generateProductSlug(product.name),
      updatedAt: product.updatedAt || new Date()
    }));
  }
}

// Export functions for server-side usage
export function getAllProducts(): Product[] {
  return [...STATIC_PRODUCTS];
}

export function getProductById(id: string): Product | null {
  return STATIC_PRODUCTS.find(product => product.id === id) || null;
}

export function getProductsByCategory(category: string, subcategory?: string): Product[] {
  let filtered = STATIC_PRODUCTS.filter(product => product.category === category);

  if (subcategory) {
    filtered = filtered.filter(product => product.subcategory === subcategory);
  }

  return filtered;
}

export function getSaleProducts(): Product[] {
  return STATIC_PRODUCTS.filter(product => product.isOnSale);
}

export function getNewProducts(): Product[] {
  return STATIC_PRODUCTS.filter(product => product.isNew);
}

export function getBestSellerProducts(): Product[] {
  return STATIC_PRODUCTS.filter(product => product.tags.includes('bestseller'));
}

// Client-side instance for dynamic functionality
export const dynamicPageManager = typeof window !== 'undefined' ? DynamicPageManager.getInstance() : null;
