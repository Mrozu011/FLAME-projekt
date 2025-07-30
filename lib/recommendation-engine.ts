interface UserBehavior {
  userId: string;
  productId: string;
  action: 'view' | 'purchase' | 'add_to_cart' | 'add_to_wishlist' | 'remove_from_cart';
  timestamp: Date;
  duration?: number; // viewing duration in seconds
  context?: string; // page context where action occurred
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  tags: string[];
  popularity: number;
  rating: number;
  image: string;
  description: string;
}

interface UserProfile {
  userId: string;
  preferences: {
    categories: Record<string, number>; // category -> preference score
    priceRange: { min: number; max: number };
    brands: Record<string, number>;
    tags: Record<string, number>;
  };
  purchaseHistory: string[];
  viewHistory: string[];
  wishlist: string[];
  cartItems: string[];
}

export interface RecommendationWeight {
  categoryMatch: number;
  popularity: number;
  priceCompatibility: number;
  userBehavior: number;
  collaborative: number;
  recency: number;
}

interface Recommendation {
  productId: string;
  score: number;
  reasons: string[];
  type: 'behavioral' | 'collaborative' | 'popularity' | 'category';
  confidence: number;
}

interface RecommendationContext {
  type: 'homepage' | 'product_page' | 'cart' | 'category' | 'search';
  currentProductId?: string;
  currentCategory?: string;
  cartItems?: string[];
  searchQuery?: string;
}

export class RecommendationEngine {
  private userBehaviors: UserBehavior[] = [];
  private products: Product[] = [];
  private userProfiles: Map<string, UserProfile> = new Map();
  private weights: RecommendationWeight = {
    categoryMatch: 0.3,
    popularity: 0.2,
    priceCompatibility: 0.15,
    userBehavior: 0.2,
    collaborative: 0.1,
    recency: 0.05
  };

  constructor() {
    this.initializeProducts();
    this.initializeUserBehaviors();
    this.updateUserProfiles();
  }

  private initializeProducts(): void {
    this.products = [
      {
        id: '1',
        name: 'Premium Silk Blouse',
        price: 89.99,
        category: 'Women',
        subcategory: 'Tops',
        tags: ['silk', 'premium', 'elegant', 'work'],
        popularity: 85,
        rating: 4.5,
        image: 'https://readdy.ai/api/search-image?query=elegant%20silk%20blouse%20white%20premium%20fashion%20women%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=silk-blouse-1&orientation=portrait',
        description: 'Elegant silk blouse perfect for professional settings'
      },
      {
        id: '2',
        name: 'Designer Leather Jacket',
        price: 299.99,
        category: 'Men',
        subcategory: 'Outerwear',
        tags: ['leather', 'designer', 'casual', 'trendy'],
        popularity: 92,
        rating: 4.7,
        image: 'https://readdy.ai/api/search-image?query=black%20leather%20jacket%20premium%20fashion%20designer%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=leather-jacket-2&orientation=portrait',
        description: 'Premium leather jacket with modern design'
      },
      {
        id: '3',
        name: 'Cashmere Sweater',
        price: 159.99,
        category: 'Women',
        subcategory: 'Knitwear',
        tags: ['cashmere', 'luxury', 'warm', 'comfort'],
        popularity: 78,
        rating: 4.6,
        image: 'https://readdy.ai/api/search-image?query=cashmere%20sweater%20beige%20premium%20fashion%20knitwear%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=cashmere-sweater-3&orientation=portrait',
        description: 'Luxurious cashmere sweater for ultimate comfort'
      },
      {
        id: '4',
        name: 'Premium Denim Jeans',
        price: 129.99,
        category: 'Men',
        subcategory: 'Bottoms',
        tags: ['denim', 'premium', 'casual', 'versatile'],
        popularity: 88,
        rating: 4.4,
        image: 'https://readdy.ai/api/search-image?query=premium%20denim%20jeans%20dark%20blue%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=denim-jeans-4&orientation=portrait',
        description: 'High-quality denim jeans with perfect fit'
      },
      {
        id: '5',
        name: 'Wool Coat',
        price: 249.99,
        category: 'Women',
        subcategory: 'Outerwear',
        tags: ['wool', 'winter', 'elegant', 'warm'],
        popularity: 75,
        rating: 4.3,
        image: 'https://readdy.ai/api/search-image?query=wool%20coat%20grey%20winter%20fashion%20women%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=wool-coat-5&orientation=portrait',
        description: 'Elegant wool coat for winter fashion'
      },
      {
        id: '6',
        name: 'Cotton Polo Shirt',
        price: 49.99,
        category: 'Men',
        subcategory: 'Tops',
        tags: ['cotton', 'casual', 'polo', 'basic'],
        popularity: 82,
        rating: 4.2,
        image: 'https://readdy.ai/api/search-image?query=cotton%20polo%20shirt%20navy%20blue%20men%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=polo-shirt-6&orientation=portrait',
        description: 'Classic cotton polo shirt for everyday wear'
      },
      {
        id: '7',
        name: 'Silk Dress',
        price: 179.99,
        category: 'Women',
        subcategory: 'Dresses',
        tags: ['silk', 'elegant', 'formal', 'luxury'],
        popularity: 71,
        rating: 4.8,
        image: 'https://readdy.ai/api/search-image?query=silk%20dress%20black%20elegant%20formal%20women%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=silk-dress-7&orientation=portrait',
        description: 'Elegant silk dress for special occasions'
      },
      {
        id: '8',
        name: 'Chino Pants',
        price: 79.99,
        category: 'Men',
        subcategory: 'Bottoms',
        tags: ['chino', 'casual', 'versatile', 'work'],
        popularity: 76,
        rating: 4.1,
        image: 'https://readdy.ai/api/search-image?query=chino%20pants%20khaki%20men%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=chino-pants-8&orientation=portrait',
        description: 'Versatile chino pants for work and casual wear'
      },
      {
        id: '9',
        name: 'Knit Cardigan',
        price: 89.99,
        category: 'Women',
        subcategory: 'Knitwear',
        tags: ['knit', 'cardigan', 'cozy', 'layering'],
        popularity: 69,
        rating: 4.4,
        image: 'https://readdy.ai/api/search-image?query=knit%20cardigan%20cream%20women%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=knit-cardigan-9&orientation=portrait',
        description: 'Cozy knit cardigan perfect for layering'
      },
      {
        id: '10',
        name: 'Oxford Shirt',
        price: 69.99,
        category: 'Men',
        subcategory: 'Tops',
        tags: ['oxford', 'formal', 'business', 'classic'],
        popularity: 84,
        rating: 4.5,
        image: 'https://readdy.ai/api/search-image?query=oxford%20shirt%20white%20men%20formal%20business%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=oxford-shirt-10&orientation=portrait',
        description: 'Classic oxford shirt for business and formal wear'
      },
      {
        id: '11',
        name: 'Maxi Dress',
        price: 119.99,
        category: 'Women',
        subcategory: 'Dresses',
        tags: ['maxi', 'summer', 'casual', 'flowy'],
        popularity: 73,
        rating: 4.3,
        image: 'https://readdy.ai/api/search-image?query=maxi%20dress%20floral%20summer%20women%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=maxi-dress-11&orientation=portrait',
        description: 'Flowy maxi dress perfect for summer'
      },
      {
        id: '12',
        name: 'Blazer',
        price: 199.99,
        category: 'Men',
        subcategory: 'Outerwear',
        tags: ['blazer', 'formal', 'business', 'professional'],
        popularity: 77,
        rating: 4.6,
        image: 'https://readdy.ai/api/search-image?query=blazer%20navy%20blue%20men%20formal%20business%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=300&height=400&seq=blazer-12&orientation=portrait',
        description: 'Professional blazer for business attire'
      }
    ];
  }

  private initializeUserBehaviors(): void {
    // Generate realistic user behavior data
    const users = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'];
    const actions: UserBehavior['action'][] = ['view', 'purchase', 'add_to_cart', 'add_to_wishlist'];
    
    for (let i = 0; i < 500; i++) {
      const behavior: UserBehavior = {
        userId: users[Math.floor(Math.random() * users.length)],
        productId: this.products[Math.floor(Math.random() * this.products.length)].id,
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
        duration: Math.random() * 300 + 10, // 10-310 seconds
        context: Math.random() > 0.5 ? 'homepage' : 'product_page'
      };
      this.userBehaviors.push(behavior);
    }
  }

  private updateUserProfiles(): void {
    this.userProfiles.clear();
    
    // Group behaviors by user
    const behaviorsByUser = this.userBehaviors.reduce((acc, behavior) => {
      if (!acc[behavior.userId]) {
        acc[behavior.userId] = [];
      }
      acc[behavior.userId].push(behavior);
      return acc;
    }, {} as Record<string, UserBehavior[]>);

    // Create user profiles
    Object.entries(behaviorsByUser).forEach(([userId, behaviors]) => {
      const profile: UserProfile = {
        userId,
        preferences: {
          categories: {},
          priceRange: { min: 0, max: 1000 },
          brands: {},
          tags: {}
        },
        purchaseHistory: [],
        viewHistory: [],
        wishlist: [],
        cartItems: []
      };

      behaviors.forEach(behavior => {
        const product = this.products.find(p => p.id === behavior.productId);
        if (!product) return;

        switch (behavior.action) {
          case 'purchase':
            profile.purchaseHistory.push(behavior.productId);
            break;
          case 'view':
            profile.viewHistory.push(behavior.productId);
            break;
          case 'add_to_wishlist':
            profile.wishlist.push(behavior.productId);
            break;
          case 'add_to_cart':
            profile.cartItems.push(behavior.productId);
            break;
        }

        // Update category preferences
        if (!profile.preferences.categories[product.category]) {
          profile.preferences.categories[product.category] = 0;
        }
        profile.preferences.categories[product.category] += this.getActionWeight(behavior.action);

        // Update tag preferences
        product.tags.forEach(tag => {
          if (!profile.preferences.tags[tag]) {
            profile.preferences.tags[tag] = 0;
          }
          profile.preferences.tags[tag] += this.getActionWeight(behavior.action);
        });
      });

      this.userProfiles.set(userId, profile);
    });
  }

  private getActionWeight(action: UserBehavior['action']): number {
    const weights = {
      view: 1,
      add_to_cart: 3,
      add_to_wishlist: 2,
      purchase: 5,
      remove_from_cart: -1
    };
    return weights[action] || 0;
  }

  public trackUserBehavior(behavior: UserBehavior): void {
    this.userBehaviors.push(behavior);
    this.updateUserProfiles();
    
    // Store in localStorage for persistence
    const stored = JSON.parse(localStorage.getItem('recommendation-behaviors') || '[]');
    stored.push(behavior);
    // Keep only last 1000 behaviors
    if (stored.length > 1000) {
      stored.splice(0, stored.length - 1000);
    }
    localStorage.setItem('recommendation-behaviors', JSON.stringify(stored));
  }

  public getRecommendations(
    userId: string,
    context: RecommendationContext,
    limit: number = 8
  ): Recommendation[] {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      return this.getPopularityBasedRecommendations(context, limit);
    }

    const recommendations: Recommendation[] = [];

    // Get behavioral recommendations
    const behavioralRecs = this.getBehavioralRecommendations(userProfile, context);
    recommendations.push(...behavioralRecs);

    // Get collaborative filtering recommendations
    const collaborativeRecs = this.getCollaborativeRecommendations(userProfile, context);
    recommendations.push(...collaborativeRecs);

    // Get category-based recommendations
    const categoryRecs = this.getCategoryBasedRecommendations(userProfile, context);
    recommendations.push(...categoryRecs);

    // Get popularity-based recommendations
    const popularityRecs = this.getPopularityBasedRecommendations(context, limit);
    recommendations.push(...popularityRecs);

    // Remove duplicates and products user already owns/viewed recently
    const uniqueRecs = this.removeDuplicates(recommendations, userProfile, context);

    // Calculate final scores and sort
    const scoredRecs = uniqueRecs.map(rec => ({
      ...rec,
      score: this.calculateFinalScore(rec, userProfile, context)
    }));

    scoredRecs.sort((a, b) => b.score - a.score);

    return scoredRecs.slice(0, limit);
  }

  private getBehavioralRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Based on viewing history
    userProfile.viewHistory.forEach(productId => {
      const product = this.products.find(p => p.id === productId);
      if (!product) return;

      // Find similar products
      const similarProducts = this.findSimilarProducts(product, context);
      similarProducts.forEach(similar => {
        recommendations.push({
          productId: similar.id,
          score: 0.8,
          reasons: [`Viewed similar item: ${product.name}`],
          type: 'behavioral',
          confidence: 0.7
        });
      });
    });

    // Based on purchase history
    userProfile.purchaseHistory.forEach(productId => {
      const product = this.products.find(p => p.id === productId);
      if (!product) return;

      const similarProducts = this.findSimilarProducts(product, context);
      similarProducts.forEach(similar => {
        recommendations.push({
          productId: similar.id,
          score: 0.9,
          reasons: [`Purchased similar item: ${product.name}`],
          type: 'behavioral',
          confidence: 0.8
        });
      });
    });

    return recommendations;
  }

  private getCollaborativeRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Find similar users
    const similarUsers = this.findSimilarUsers(userProfile);
    
    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserProfile = this.userProfiles.get(similarUserId);
      if (!similarUserProfile) return;

      // Recommend products that similar users purchased but current user hasn't
      similarUserProfile.purchaseHistory.forEach(productId => {
        if (!userProfile.purchaseHistory.includes(productId) && 
            !userProfile.viewHistory.includes(productId)) {
          const product = this.products.find(p => p.id === productId);
          if (product) {
            recommendations.push({
              productId,
              score: similarity * 0.7,
              reasons: [`Users with similar taste also bought this`],
              type: 'collaborative',
              confidence: similarity
            });
          }
        }
      });
    });

    return recommendations;
  }

  private getCategoryBasedRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Get top categories by preference
    const topCategories = Object.entries(userProfile.preferences.categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    topCategories.forEach(([category, preference]) => {
      const categoryProducts = this.products.filter(p => p.category === category);
      categoryProducts.forEach(product => {
        if (!userProfile.purchaseHistory.includes(product.id) &&
            !userProfile.viewHistory.includes(product.id)) {
          recommendations.push({
            productId: product.id,
            score: preference * 0.6,
            reasons: [`Matches your interest in ${category}`],
            type: 'category',
            confidence: 0.6
          });
        }
      });
    });

    return recommendations;
  }

  private getPopularityBasedRecommendations(
    context: RecommendationContext,
    limit: number
  ): Recommendation[] {
    const popularProducts = [...this.products]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);

    return popularProducts.map(product => ({
      productId: product.id,
      score: product.popularity / 100,
      reasons: [`Popular among all users`],
      type: 'popularity' as const,
      confidence: 0.5
    }));
  }

  private findSimilarProducts(product: Product, context: RecommendationContext): Product[] {
    return this.products.filter(p => {
      if (p.id === product.id) return false;
      
      let similarity = 0;
      
      // Category match
      if (p.category === product.category) similarity += 0.4;
      if (p.subcategory === product.subcategory) similarity += 0.3;
      
      // Tag overlap
      const tagOverlap = product.tags.filter(tag => p.tags.includes(tag)).length;
      similarity += (tagOverlap / product.tags.length) * 0.3;
      
      // Price similarity
      const priceDiff = Math.abs(p.price - product.price) / product.price;
      if (priceDiff < 0.3) similarity += 0.2;
      
      return similarity > 0.5;
    });
  }

  private findSimilarUsers(userProfile: UserProfile): { userId: string; similarity: number }[] {
    const similarUsers: { userId: string; similarity: number }[] = [];

    this.userProfiles.forEach((otherProfile, otherUserId) => {
      if (otherUserId === userProfile.userId) return;

      let similarity = 0;
      let totalWeight = 0;

      // Category preference similarity
      Object.entries(userProfile.preferences.categories).forEach(([category, preference]) => {
        const otherPreference = otherProfile.preferences.categories[category] || 0;
        const weight = Math.max(preference, otherPreference);
        similarity += weight * (1 - Math.abs(preference - otherPreference) / Math.max(preference, otherPreference, 1));
        totalWeight += weight;
      });

      // Purchase history overlap
      const purchaseOverlap = userProfile.purchaseHistory.filter(id => 
        otherProfile.purchaseHistory.includes(id)
      ).length;
      
      if (purchaseOverlap > 0) {
        similarity += purchaseOverlap * 10;
        totalWeight += purchaseOverlap * 10;
      }

      if (totalWeight > 0) {
        similarity = similarity / totalWeight;
        if (similarity > 0.1) {
          similarUsers.push({ userId: otherUserId, similarity });
        }
      }
    });

    return similarUsers.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }

  private removeDuplicates(
    recommendations: Recommendation[],
    userProfile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const seen = new Set<string>();
    const filtered: Recommendation[] = [];

    // Remove user's own products
    const excludeIds = new Set([
      ...userProfile.purchaseHistory,
      ...(context.currentProductId ? [context.currentProductId] : []),
      ...(context.cartItems || [])
    ]);

    recommendations.forEach(rec => {
      if (!seen.has(rec.productId) && !excludeIds.has(rec.productId)) {
        seen.add(rec.productId);
        filtered.push(rec);
      }
    });

    return filtered;
  }

  private calculateFinalScore(
    recommendation: Recommendation,
    userProfile: UserProfile,
    context: RecommendationContext
  ): number {
    const product = this.products.find(p => p.id === recommendation.productId);
    if (!product) return 0;

    let score = recommendation.score;

    // Apply weights
    if (recommendation.type === 'category') {
      score *= this.weights.categoryMatch;
    } else if (recommendation.type === 'popularity') {
      score *= this.weights.popularity;
    } else if (recommendation.type === 'behavioral') {
      score *= this.weights.userBehavior;
    } else if (recommendation.type === 'collaborative') {
      score *= this.weights.collaborative;
    }

    // Context-specific adjustments
    if (context.type === 'cart') {
      // Boost complementary products
      if (context.cartItems) {
        const hasComplementary = context.cartItems.some(cartItemId => {
          const cartProduct = this.products.find(p => p.id === cartItemId);
          return cartProduct && this.areComplementary(cartProduct, product);
        });
        if (hasComplementary) score *= 1.5;
      }
    } else if (context.type === 'product_page' && context.currentProductId) {
      // Boost similar products
      const currentProduct = this.products.find(p => p.id === context.currentProductId);
      if (currentProduct && this.areSimilar(currentProduct, product)) {
        score *= 1.3;
      }
    }

    // Price compatibility
    const avgPurchasePrice = userProfile.purchaseHistory.length > 0
      ? userProfile.purchaseHistory.reduce((sum, id) => {
          const p = this.products.find(prod => prod.id === id);
          return sum + (p?.price || 0);
        }, 0) / userProfile.purchaseHistory.length
      : 100;

    const priceDiff = Math.abs(product.price - avgPurchasePrice) / avgPurchasePrice;
    if (priceDiff < 0.2) score *= 1.1;
    else if (priceDiff > 0.5) score *= 0.8;

    // Recency boost
    const recentBehaviors = this.userBehaviors.filter(b => 
      b.userId === userProfile.userId && 
      Date.now() - b.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );
    if (recentBehaviors.length > 0) {
      score *= (1 + this.weights.recency);
    }

    return score * recommendation.confidence;
  }

  private areComplementary(product1: Product, product2: Product): boolean {
    // Define complementary product rules
    const complementaryRules: Record<string, string[]> = {
      'Tops': ['Bottoms', 'Outerwear'],
      'Bottoms': ['Tops', 'Outerwear'],
      'Outerwear': ['Tops', 'Bottoms'],
      'Dresses': ['Outerwear'],
      'Knitwear': ['Bottoms', 'Outerwear']
    };

    return product1.subcategory && product2.subcategory && complementaryRules[product1.subcategory as keyof typeof complementaryRules]?.includes(product2.subcategory) || false;
  }

  private areSimilar(product1: Product, product2: Product): boolean {
    return product1.category === product2.category && 
           product1.subcategory === product2.subcategory;
  }

  public getFrequentlyBoughtTogether(productId: string): string[] {
    const productBehaviors = this.userBehaviors.filter(b => b.productId === productId);
    const userIds = productBehaviors.map(b => b.userId);
    
    const coOccurrence: Record<string, number> = {};
    
    userIds.forEach(userId => {
      const userBehaviors = this.userBehaviors.filter(b => 
        b.userId === userId && b.productId !== productId
      );
      
      userBehaviors.forEach(behavior => {
        if (!coOccurrence[behavior.productId]) {
          coOccurrence[behavior.productId] = 0;
        }
        coOccurrence[behavior.productId]++;
      });
    });

    return Object.entries(coOccurrence)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => id);
  }

  public updateWeights(newWeights: Partial<RecommendationWeight>): void {
    this.weights = { ...this.weights, ...newWeights };
    localStorage.setItem('recommendation-weights', JSON.stringify(this.weights));
  }

  public getWeights(): RecommendationWeight {
    const stored = localStorage.getItem('recommendation-weights');
    if (stored) {
      this.weights = JSON.parse(stored);
    }
    return this.weights;
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getProduct(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public getAnalytics(): {
    totalUsers: number;
    totalBehaviors: number;
    topCategories: { category: string; count: number }[];
    topProducts: { productId: string; views: number; purchases: number }[];
  } {
    const totalUsers = this.userProfiles.size;
    const totalBehaviors = this.userBehaviors.length;
    
    const categoryCount: Record<string, number> = {};
    const productStats: Record<string, { views: number; purchases: number }> = {};
    
    this.userBehaviors.forEach(behavior => {
      const product = this.products.find(p => p.id === behavior.productId);
      if (product) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        
        if (!productStats[behavior.productId]) {
          productStats[behavior.productId] = { views: 0, purchases: 0 };
        }
        
        if (behavior.action === 'view') {
          productStats[behavior.productId].views++;
        } else if (behavior.action === 'purchase') {
          productStats[behavior.productId].purchases++;
        }
      }
    });

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    const topProducts = Object.entries(productStats)
      .sort((a, b) => (b[1].views + b[1].purchases) - (a[1].views + a[1].purchases))
      .slice(0, 10)
      .map(([productId, stats]) => ({ productId, ...stats }));

    return {
      totalUsers,
      totalBehaviors,
      topCategories,
      topProducts
    };
  }
}

export const recommendationEngine = new RecommendationEngine();