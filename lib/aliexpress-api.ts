interface AliExpressProduct {
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  shippingInfo: ShippingInfo;
  supplierInfo: SupplierInfo;
  category: string;
  subcategory: string;
  stock: number;
  minOrderQuantity: number;
  rating: number;
  reviews: number;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  images: string[];
}

interface ShippingInfo {
  freeShipping: boolean;
  shippingCost: number;
  deliveryTime: string;
  availableCountries: string[];
}

interface SupplierInfo {
  id: string;
  name: string;
  rating: number;
  responseTime: string;
  followedBy: number;
  location: string;
}

interface ImportSettings {
  priceMultiplier: number;
  categoryMapping: Record<string, string>;
  autoPublish: boolean;
  minimumRating: number;
  minimumStock: number;
  excludedSuppliers: string[];
  imageOptimization: boolean;
}

export class AliExpressAPI {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private importSettings: ImportSettings;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = 'https://gw.api.alibaba.com/openapi';
    this.importSettings = this.getDefaultSettings();
  }

  private getDefaultSettings(): ImportSettings {
    return {
      priceMultiplier: 1.5,
      categoryMapping: {
        'Women\'s Clothing': 'women',
        'Men\'s Clothing': 'men',
        'Consumer Electronics': 'electronics',
        'Home & Garden': 'lifestyle',
        'Jewelry & Accessories': 'accessories'
      },
      autoPublish: false,
      minimumRating: 4.0,
      minimumStock: 10,
      excludedSuppliers: [],
      imageOptimization: true
    };
  }

  private generateSignature(params: Record<string, any>): string {
    const sortedKeys = Object.keys(params).sort();
    const queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
    
    // Simulate signature generation (in real implementation, use HMAC-SHA256)
    const timestamp = Date.now().toString();
    return btoa(`${this.apiSecret}${queryString}${timestamp}`).substring(0, 32);
  }

  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<any> {
    const requestParams = {
      ...params,
      app_key: this.apiKey,
      timestamp: Date.now(),
      format: 'json',
      v: '2.0'
    };

    const signature = this.generateSignature(requestParams);
    requestParams.sign = signature;

    const url = `${this.baseUrl}${endpoint}`;
    const queryString = new URLSearchParams(requestParams).toString();

    try {
      const response = await fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FlameStore/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AliExpress API request failed:', error);
      throw error;
    }
  }

  async searchProducts(query: string, category?: string, minPrice?: number, maxPrice?: number): Promise<AliExpressProduct[]> {
    const params: Record<string, any> = {
      keywords: query,
      page_no: 1,
      page_size: 50,
      sort: 'SALE_PRICE_ASC'
    };

    if (category) params.category_id = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;

    try {
      const response = await this.makeRequest('/param2/1/portals.open/api.findAeProductByKeywords', params);
      
      if (response.error_code) {
        throw new Error(`AliExpress API error: ${response.error_message}`);
      }

      return this.transformProducts(response.result?.products || []);
    } catch (error) {
      console.error('Product search failed:', error);
      return [];
    }
  }

  async getProductDetails(productId: string): Promise<AliExpressProduct | null> {
    const params = {
      product_id: productId,
      target_currency: 'USD',
      target_language: 'EN'
    };

    try {
      const response = await this.makeRequest('/param2/1/portals.open/api.getAeProductById', params);
      
      if (response.error_code) {
        throw new Error(`AliExpress API error: ${response.error_message}`);
      }

      const product = response.result;
      return product ? this.transformProduct(product) : null;
    } catch (error) {
      console.error('Product details fetch failed:', error);
      return null;
    }
  }

  async getSupplierInfo(supplierId: string): Promise<SupplierInfo | null> {
    const params = {
      supplier_id: supplierId
    };

    try {
      const response = await this.makeRequest('/param2/1/portals.open/api.getSupplierById', params);
      
      if (response.error_code) {
        throw new Error(`AliExpress API error: ${response.error_message}`);
      }

      return response.result || null;
    } catch (error) {
      console.error('Supplier info fetch failed:', error);
      return null;
    }
  }

  private transformProducts(products: any[]): AliExpressProduct[] {
    return products.map(product => this.transformProduct(product)).filter(Boolean);
  }

  private transformProduct(product: any): AliExpressProduct {
    const basePrice = parseFloat(product.min_price || product.price || 0);
    const adjustedPrice = basePrice * this.importSettings.priceMultiplier;

    return {
      productId: product.product_id,
      title: product.subject || product.title,
      price: adjustedPrice,
      originalPrice: basePrice,
      currency: product.currency || 'USD',
      description: this.cleanDescription(product.description || ''),
      images: this.extractImages(product.product_main_image_url, product.product_small_image_urls),
      variants: this.extractVariants(product.sku_products || []),
      specifications: this.extractSpecifications(product.properties || []),
      shippingInfo: this.extractShippingInfo(product.shipping_info || {}),
      supplierInfo: this.extractSupplierInfo(product.supplier_info || {}),
      category: this.mapCategory(product.category_name),
      subcategory: this.mapSubcategory(product.category_name, product.sub_category_name),
      stock: parseInt(product.stock || 0),
      minOrderQuantity: parseInt(product.min_order_quantity || 1),
      rating: parseFloat(product.avg_rating || 0),
      reviews: parseInt(product.review_count || 0)
    };
  }

  private cleanDescription(description: string): string {
    return description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 500); // Limit length
  }

  private extractImages(mainImage: string, smallImages: string[] = []): string[] {
    const images = [mainImage, ...smallImages].filter(Boolean);
    
    if (this.importSettings.imageOptimization) {
      return images.map(img => this.optimizeImageUrl(img));
    }
    
    return images;
  }

  private optimizeImageUrl(url: string): string {
    // Optimize image URLs for better performance
    return url.replace(/\.(jpg|jpeg|png)$/i, '_300x300.jpg');
  }

  private extractVariants(skuProducts: any[]): ProductVariant[] {
    return skuProducts.map(sku => ({
      id: sku.sku_id,
      name: sku.sku_name || 'Default',
      price: parseFloat(sku.sku_price || 0) * this.importSettings.priceMultiplier,
      stock: parseInt(sku.sku_stock || 0),
      attributes: this.extractAttributes(sku.sku_attr || []),
      images: sku.sku_image ? [sku.sku_image] : []
    }));
  }

  private extractAttributes(attributes: any[]): Record<string, string> {
    const attrs: Record<string, string> = {};
    attributes.forEach(attr => {
      if (attr.property_name && attr.property_value) {
        attrs[attr.property_name] = attr.property_value;
      }
    });
    return attrs;
  }

  private extractSpecifications(properties: any[]): Record<string, string> {
    const specs: Record<string, string> = {};
    properties.forEach(prop => {
      if (prop.property_name && prop.property_value) {
        specs[prop.property_name] = prop.property_value;
      }
    });
    return specs;
  }

  private extractShippingInfo(shippingInfo: any): ShippingInfo {
    return {
      freeShipping: shippingInfo.free_shipping || false,
      shippingCost: parseFloat(shippingInfo.shipping_cost || 0),
      deliveryTime: shippingInfo.delivery_time || '15-30 days',
      availableCountries: shippingInfo.available_countries || ['US', 'EU', 'AU']
    };
  }

  private extractSupplierInfo(supplierInfo: any): SupplierInfo {
    return {
      id: supplierInfo.supplier_id || '',
      name: supplierInfo.supplier_name || 'Unknown Supplier',
      rating: parseFloat(supplierInfo.supplier_rating || 0),
      responseTime: supplierInfo.response_time || '24 hours',
      followedBy: parseInt(supplierInfo.followed_by || 0),
      location: supplierInfo.location || 'China'
    };
  }

  private mapCategory(categoryName: string): string {
    const mapping = this.importSettings.categoryMapping;
    return mapping[categoryName] || 'accessories';
  }

  private mapSubcategory(categoryName: string, subcategoryName: string): string {
    const categoryMap: Record<string, Record<string, string>> = {
      'women': {
        'Dresses': 'dresses',
        'Tops': 'tops',
        'Bottoms': 'bottoms',
        'Outerwear': 'outerwear'
      },
      'men': {
        'Shirts': 'shirts',
        'Pants': 'pants',
        'Jackets': 'jackets'
      },
      'electronics': {
        'Phones': 'phones',
        'Computers': 'computers',
        'Audio': 'audio'
      }
    };

    const category = this.mapCategory(categoryName);
    const subcategories = categoryMap[category] || {};
    return subcategories[subcategoryName] || 'other';
  }

  async importProduct(productId: string, customizations?: Partial<AliExpressProduct>): Promise<any> {
    const product = await this.getProductDetails(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Apply quality filters
    if (product.rating < this.importSettings.minimumRating) {
      throw new Error(`Product rating (${product.rating}) below minimum (${this.importSettings.minimumRating})`);
    }

    if (product.stock < this.importSettings.minimumStock) {
      throw new Error(`Product stock (${product.stock}) below minimum (${this.importSettings.minimumStock})`);
    }

    if (this.importSettings.excludedSuppliers.includes(product.supplierInfo.id)) {
      throw new Error('Supplier is excluded from imports');
    }

    // Apply customizations
    const finalProduct = { ...product, ...customizations };

    // Prepare for database insertion
    const productData = {
      name: finalProduct.title,
      description: finalProduct.description,
      price: finalProduct.price,
      originalPrice: finalProduct.originalPrice,
      category: finalProduct.category,
      subcategory: finalProduct.subcategory,
      images: finalProduct.images,
      variants: finalProduct.variants,
      specifications: finalProduct.specifications,
      stock: finalProduct.stock,
      type: 'dropship',
      supplierId: finalProduct.supplierInfo.id,
      supplierProductId: finalProduct.productId,
      status: this.importSettings.autoPublish ? 'active' : 'draft',
      importedAt: new Date().toISOString(),
      shippingInfo: finalProduct.shippingInfo,
      supplierInfo: finalProduct.supplierInfo
    };

    return productData;
  }

  async bulkImportProducts(productIds: string[], customizations?: Record<string, Partial<AliExpressProduct>>): Promise<any[]> {
    const results = [];
    
    for (const productId of productIds) {
      try {
        const customization = customizations?.[productId];
        const productData = await this.importProduct(productId, customization);
        results.push({ success: true, productId, data: productData });
      } catch (error) {
        results.push({ success: false, productId, error: error.message });
      }
    }

    return results;
  }

  async syncInventory(productIds: string[]): Promise<void> {
    for (const productId of productIds) {
      try {
        const product = await this.getProductDetails(productId);
        if (product) {
          // Update local inventory
          await this.updateLocalInventory(productId, product.stock, product.price);
        }
      } catch (error) {
        console.error(`Failed to sync inventory for product ${productId}:`, error);
      }
    }
  }

  private async updateLocalInventory(productId: string, stock: number, price: number): Promise<void> {
    // This would update your local database
    console.log(`Updating inventory for ${productId}: stock=${stock}, price=${price}`);
  }

  async getCategories(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/param2/1/portals.open/api.getChildrenCategoryById', {
        category_id: 0 // Root category
      });
      
      return response.result?.categories || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  updateSettings(settings: Partial<ImportSettings>): void {
    this.importSettings = { ...this.importSettings, ...settings };
  }

  getSettings(): ImportSettings {
    return { ...this.importSettings };
  }
}

export const aliExpressAPI = new AliExpressAPI(
  process.env.ALIEXPRESS_API_KEY || 'your-api-key',
  process.env.ALIEXPRESS_API_SECRET || 'your-api-secret'
);