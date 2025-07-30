
interface UserBehavior {
  userId: string;
  timestamp: Date;
  action: 'page_view' | 'product_view' | 'category_browse' | 'search' | 'purchase' | 'add_to_cart' | 'wishlist_add' | 'theme_change' | 'language_change' | 'size_select' | 'location_detect';
  data: {
    page?: string;
    productId?: string;
    category?: string;
    subcategory?: string;
    searchQuery?: string;
    theme?: 'light' | 'dark';
    language?: string;
    size?: string;
    location?: string;
    ip?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    sessionId?: string;
  };
  metadata?: {
    userAgent?: string;
    referrer?: string;
    duration?: number;
    scrollDepth?: number;
  };
};

interface UserProfile {
  userId: string;
  anonymousId?: string;
  createdAt: Date;
  lastActive: Date;
  preferences: {
    primaryCategory: string;
    preferredSizes: string[];
    preferredBrands: string[];
    priceRange: { min: number; max: number };
    theme: 'light' | 'dark' | 'auto';
    language: string;
    location: {
      country?: string;
      region?: string;
      city?: string;
      timezone?: string;
    };
  };
  behaviors: {
    mostViewedCategories: Array<{ category: string; count: number; weight: number }>;
    searchPatterns: Array<{ query: string; frequency: number; lastUsed: Date }>;
    deviceUsage: Array<{ device: string; sessions: number; lastUsed: Date }>;
    timePatterns: Array<{ hour: number; activity: number }>;
    purchaseHistory: Array<{ productId: string; category: string; size?: string; date: Date }>;
  };
  segments: string[];
  personalizationEnabled: boolean;
  gdprConsent: boolean;
  consentDate?: Date;
};

interface PersonalizationSettings {
  enabled: boolean;
  categoryPrioritization: boolean;
  themePersonalization: boolean;
  sizeRecommendations: boolean;
  locationBasedShipping: boolean;
  weights: {
    categoryPreference: number;
    recencyBoost: number;
    purchaseHistory: number;
    deviceConsistency: number;
    locationRelevance: number;
  };
  privacyLevel: 'basic' | 'enhanced' | 'full';
  dataRetentionDays: number;
};

interface PersonalizationResult {
  userId: string;
  layoutConfig: {
    homepageSections: Array<{
      type: 'hero' | 'categories' | 'products' | 'recommendations';
      priority: number;
      content: any;
    }>;
    navigationPriority: string[];
    featuredCategories: string[];
  };
  contentConfig: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
    sizeSuggestions: string[];
    shippingOptions: Array<{
      method: string;
      estimatedDays: string;
      cost: number;
      local: boolean;
    }>;
  };
  recommendations: {
    products: string[];
    categories: string[];
    searches: string[];
  };
  confidence: number;
};

export class PersonalizationEngine {
  private behaviors: UserBehavior[] = [];
  private userProfiles: Map<string, UserProfile> = new Map();
  private settings: PersonalizationSettings = {
    enabled: true,
    categoryPrioritization: true,
    themePersonalization: true,
    sizeRecommendations: true,
    locationBasedShipping: true,
    weights: {
      categoryPreference: 0.4,
      recencyBoost: 0.2,
      purchaseHistory: 0.25,
      deviceConsistency: 0.1,
      locationRelevance: 0.05
    },
    privacyLevel: 'enhanced',
    dataRetentionDays: 90
  };

  constructor() {
    this.initializeEngine();
    this.loadStoredData();
    this.setupCleanupTasks();
  }

  private initializeEngine(): void {
    if (typeof window !== 'undefined') {
      // 检测用户位置信息
      this.detectUserLocation();

      // 设置自动行为跟踪
      this.setupBehaviorTracking();

      // 监听存储变化
      this.setupStorageListeners();
    }
  }

  private loadStoredData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // 从本地存储加载数据
      const storedBehaviors = localStorage.getItem('flame-personalization-behaviors');
      const storedProfiles = localStorage.getItem('flame-personalization-profiles');
      const storedSettings = localStorage.getItem('flame-personalization-settings');

      if (storedBehaviors) {
        this.behaviors = JSON.parse(storedBehaviors).map((b: any) => ({
          ...b,
          timestamp: new Date(b.timestamp)
        }));
      }

      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        Object.entries(profiles).forEach(([userId, profile]: [string, any]) => {
          this.userProfiles.set(userId, {
            ...profile,
            createdAt: new Date(profile.createdAt),
            lastActive: new Date(profile.lastActive),
            behaviors: {
              ...profile.behaviors,
              purchaseHistory: profile.behaviors.purchaseHistory.map((p: any) => ({
                ...p,
                date: new Date(p.date)
              }))
            }
          });
        });
      }

      if (storedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
      }
    } catch (error) {
      console.error('Error loading personalization data:', error);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // 保存行为数据
      localStorage.setItem('flame-personalization-behaviors', JSON.stringify(this.behaviors));

      // 保存用户档案
      const profiles: Record<string, any> = {};
      this.userProfiles.forEach((profile, userId) => {
        profiles[userId] = profile;
      });
      localStorage.setItem('flame-personalization-profiles', JSON.stringify(profiles));

      // 保存设置
      localStorage.setItem('flame-personalization-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving personalization data:', error);
    }
  }

  private detectUserLocation(): void {
    if (!navigator.geolocation) return;

    // 使用IP地址获取大致位置（模拟）
    this.getLocationFromIP().then(location => {
      if (location) {
        this.trackBehavior(this.getCurrentUserId(), {
          action: 'location_detect',
          timestamp: new Date(),
          data: {
            location: `${location.city}, ${location.country}`,
            ip: location.ip
          }
        });
      }
    });
  }

  private async getLocationFromIP(): Promise<any> {
    // 模拟IP位置检测
    const mockLocations = [
      { city: 'New York', country: 'US', region: 'NY', timezone: 'America/New_York', ip: '192.168.1.1' },
      { city: 'London', country: 'UK', region: 'England', timezone: 'Europe/London', ip: '192.168.1.2' },
      { city: 'Tokyo', country: 'JP', region: 'Tokyo', timezone: 'Asia/Tokyo', ip: '192.168.1.3' },
      { city: 'Paris', country: 'FR', region: 'Île-de-France', timezone: 'Europe/Paris', ip: '192.168.1.4' },
      { city: 'Sydney', country: 'AU', region: 'NSW', timezone: 'Australia/Sydney', ip: '192.168.1.5' }
    ];

    return mockLocations[Math.floor(Math.random() * mockLocations.length)];
  }

  private setupBehaviorTracking(): void {
    // 页面浏览跟踪
    this.trackPageView();

    // 滚动深度跟踪
    this.trackScrollDepth();

    // 点击跟踪
    this.trackClicks();

    // 搜索跟踪
    this.trackSearches();
  }

  private trackPageView(): void {
    const userId = this.getCurrentUserId();
    const currentPage = window.location.pathname;

    this.trackBehavior(userId, {
      action: 'page_view',
      timestamp: new Date(),
      data: {
        page: currentPage,
        deviceType: this.getDeviceType(),
        sessionId: this.getSessionId()
      },
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    });
  }

  private trackScrollDepth(): void {
    let maxScroll = 0;
    const userId = this.getCurrentUserId();

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
      }
    });

    window.addEventListener('beforeunload', () => {
      if (maxScroll > 25) { // 只记录滚动超过25%的情况
        this.trackBehavior(userId, {
          action: 'page_view',
          timestamp: new Date(),
          data: {
            page: window.location.pathname
          },
          metadata: {
            scrollDepth: maxScroll,
            duration: performance.now()
          }
        });
      }
    });
  }

  private trackClicks(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const userId = this.getCurrentUserId();

      // 跟踪产品点击
      const productElement = target.closest('[data-product-id]');
      if (productElement) {
        const productId = productElement.getAttribute('data-product-id');
        this.trackBehavior(userId, {
          action: 'product_view',
          timestamp: new Date(),
          data: {
            productId: productId || ''
          }
        });
      }

      // 跟踪分类浏览
      const categoryElement = target.closest('[data-category]');
      if (categoryElement) {
        const category = categoryElement.getAttribute('data-category');
        this.trackBehavior(userId, {
          action: 'category_browse',
          timestamp: new Date(),
          data: {
            category: category || ''
          }
        });
      }
    });
  }

  private trackSearches(): void {
    // 监听搜索表单提交
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const searchInput = form.querySelector('input[type="text"], input[type="search"]') as HTMLInputElement;

      if (searchInput && searchInput.value.trim()) {
        const userId = this.getCurrentUserId();
        this.trackBehavior(userId, {
          action: 'search',
          timestamp: new Date(),
          data: {
            searchQuery: searchInput.value.trim()
          }
        });
      }
    });
  }

  private setupStorageListeners(): void {
    // 监听主题变化
    window.addEventListener('themeChanged', (event: any) => {
      const userId = this.getCurrentUserId();
      this.trackBehavior(userId, {
        action: 'theme_change',
        timestamp: new Date(),
        data: {
          theme: event.detail.theme
        }
      });
    });

    // 监听语言变化
    window.addEventListener('languageChanged', (event: any) => {
      const userId = this.getCurrentUserId();
      this.trackBehavior(userId, {
        action: 'language_change',
        timestamp: new Date(),
        data: {
          language: event.detail.language
        }
      });
    });

    // 监听购物车变化
    window.addEventListener('cartUpdated', () => {
      try {
        const cart = JSON.parse(localStorage.getItem('flame-cart') || '[]');
        const userId = this.getCurrentUserId();

        cart.forEach((item: any) => {
          this.trackBehavior(userId, {
            action: 'add_to_cart',
            timestamp: new Date(),
            data: {
              productId: item.id,
              category: item.category,
              size: item.size
            }
          });
        });
      } catch (error) {
        console.error('Error tracking cart updates:', error);
      }
    });
  }

  private setupCleanupTasks(): void {
    // 定期清理旧数据
    setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000); // 每天清理一次
  }

  private cleanupOldData(): void {
    const cutoffDate = new Date(Date.now() - (this.settings.dataRetentionDays * 24 * 60 * 60 * 1000));

    // 清理旧的行为数据
    this.behaviors = this.behaviors.filter(behavior => behavior.timestamp > cutoffDate);

    // 更新用户档案
    this.userProfiles.forEach(profile => {
      profile.behaviors.searchPatterns = profile.behaviors.searchPatterns.filter(
        pattern => pattern.lastUsed > cutoffDate
      );
      profile.behaviors.deviceUsage = profile.behaviors.deviceUsage.filter(
        usage => usage.lastUsed > cutoffDate
      );
    });

    this.saveToStorage();
  }

  public trackBehavior(userId: string, behavior: Omit<UserBehavior, 'userId'>): void {
    if (!this.settings.enabled) return;

    const fullBehavior: UserBehavior = {
      userId,
      ...behavior
    };

    this.behaviors.push(fullBehavior);
    this.updateUserProfile(userId, fullBehavior);
    this.saveToStorage();

    // 限制内存中的行为数据
    if (this.behaviors.length > 10000) {
      this.behaviors = this.behaviors.slice(-8000);
    }
  }

  private updateUserProfile(userId: string, behavior: UserBehavior): void {
    let profile = this.userProfiles.get(userId);

    if (!profile) {
      profile = this.createUserProfile(userId);
      this.userProfiles.set(userId, profile);
    }

    profile.lastActive = new Date();

    // 更新行为模式
    switch (behavior.action) {
      case 'category_browse':
        this.updateCategoryPreferences(profile, behavior);
        break;
      case 'search':
        this.updateSearchPatterns(profile, behavior);
        break;
      case 'theme_change':
        this.updateThemePreference(profile, behavior);
        break;
      case 'language_change':
        this.updateLanguagePreference(profile, behavior);
        break;
      case 'size_select':
        this.updateSizePreferences(profile, behavior);
        break;
      case 'location_detect':
        this.updateLocationInfo(profile, behavior);
        break;
      case 'purchase':
        this.updatePurchaseHistory(profile, behavior);
        break;
    }
  }

  private createUserProfile(userId: string): UserProfile {
    return {
      userId,
      anonymousId: this.generateAnonymousId(),
      createdAt: new Date(),
      lastActive: new Date(),
      preferences: {
        primaryCategory: '',
        preferredSizes: [],
        preferredBrands: [],
        priceRange: { min: 0, max: 1000 },
        theme: 'auto',
        language: 'en',
        location: {}
      },
      behaviors: {
        mostViewedCategories: [],
        searchPatterns: [],
        deviceUsage: [],
        timePatterns: [],
        purchaseHistory: []
      },
      segments: [],
      personalizationEnabled: true,
      gdprConsent: false
    };
  }

  private generateAnonymousId(): string {
    return 'anon_' + Math.random().toString(36).substr(2, 9);
  }

  private updateCategoryPreferences(profile: UserProfile, behavior: UserBehavior): void {
    const category = behavior.data.category;
    if (!category) return;

    const existing = profile.behaviors.mostViewedCategories.find(c => c.category === category);
    if (existing) {
      existing.count++;
      existing.weight = this.calculateCategoryWeight(existing.count, behavior.timestamp);
    } else {
      profile.behaviors.mostViewedCategories.push({
        category,
        count: 1,
        weight: 1
      });
    }

    // 保持最多10个分类
    profile.behaviors.mostViewedCategories.sort((a, b) => b.weight - a.weight);
    profile.behaviors.mostViewedCategories = profile.behaviors.mostViewedCategories.slice(0, 10);

    // 更新主要分类
    if (profile.behaviors.mostViewedCategories.length > 0) {
      profile.preferences.primaryCategory = profile.behaviors.mostViewedCategories[0].category;
    }
  }

  private updateSearchPatterns(profile: UserProfile, behavior: UserBehavior): void {
    const query = behavior.data.searchQuery;
    if (!query) return;

    const existing = profile.behaviors.searchPatterns.find(p => p.query.toLowerCase() === query.toLowerCase());
    if (existing) {
      existing.frequency++;
      existing.lastUsed = behavior.timestamp;
    } else {
      profile.behaviors.searchPatterns.push({
        query,
        frequency: 1,
        lastUsed: behavior.timestamp
      });
    }

    // 保持最多20个搜索模式
    profile.behaviors.searchPatterns.sort((a, b) => b.frequency - a.frequency);
    profile.behaviors.searchPatterns = profile.behaviors.searchPatterns.slice(0, 20);
  }

  private updateThemePreference(profile: UserProfile, behavior: UserBehavior): void {
    if (behavior.data.theme) {
      profile.preferences.theme = behavior.data.theme;
    }
  }

  private updateLanguagePreference(profile: UserProfile, behavior: UserBehavior): void {
    if (behavior.data.language) {
      profile.preferences.language = behavior.data.language;
    }
  }

  private updateSizePreferences(profile: UserProfile, behavior: UserBehavior): void {
    const size = behavior.data.size;
    if (!size) return;

    if (!profile.preferences.preferredSizes.includes(size)) {
      profile.preferences.preferredSizes.push(size);
    }

    // 保持最多5个尺寸
    if (profile.preferences.preferredSizes.length > 5) {
      profile.preferences.preferredSizes = profile.preferences.preferredSizes.slice(-5);
    }
  }

  private updateLocationInfo(profile: UserProfile, behavior: UserBehavior): void {
    if (behavior.data.location) {
      const locationParts = behavior.data.location.split(', ');
      profile.preferences.location = {
        city: locationParts[0],
        country: locationParts[1],
        ...profile.preferences.location
      };
    }
  }

  private updatePurchaseHistory(profile: UserProfile, behavior: UserBehavior): void {
    if (behavior.data.productId) {
      profile.behaviors.purchaseHistory.push({
        productId: behavior.data.productId,
        category: behavior.data.category || '',
        size: behavior.data.size,
        date: behavior.timestamp
      });

      // 保持最多100个购买记录
      if (profile.behaviors.purchaseHistory.length > 100) {
        profile.behaviors.purchaseHistory = profile.behaviors.purchaseHistory.slice(-100);
      }
    }
  }

  private calculateCategoryWeight(count: number, timestamp: Date): number {
    const recencyBoost = this.getRecencyBoost(timestamp);
    const frequencyWeight = Math.min(count / 10, 1); // 最大权重为1
    return (frequencyWeight * 0.7) + (recencyBoost * 0.3);
  }

  private getRecencyBoost(timestamp: Date): number {
    const daysSince = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - (daysSince / 30)); // 30天后权重降为0
  }

  public getPersonalization(userId: string): PersonalizationResult {
    if (!this.settings.enabled) {
      return this.getDefaultPersonalization(userId);
    }

    const profile = this.userProfiles.get(userId);
    if (!profile || !profile.personalizationEnabled) {
      return this.getDefaultPersonalization(userId);
    }

    const layoutConfig = this.generateLayoutConfig(profile);
    const contentConfig = this.generateContentConfig(profile);
    const recommendations = this.generateRecommendations(profile);
    const confidence = this.calculateConfidence(profile);

    return {
      userId,
      layoutConfig,
      contentConfig,
      recommendations,
      confidence
    };
  }

  private getDefaultPersonalization(userId: string): PersonalizationResult {
    return {
      userId,
      layoutConfig: {
        homepageSections: [
          { type: 'hero', priority: 1, content: { featured: 'new-arrivals' } },
          { type: 'categories', priority: 2, content: { layout: 'grid' } },
          { type: 'products', priority: 3, content: { type: 'featured' } },
          { type: 'recommendations', priority: 4, content: { type: 'popular' } }
        ],
        navigationPriority: ['Women', 'Men', 'Accessories', 'Sale'],
        featuredCategories: ['Women', 'Men', 'Accessories']
      },
      contentConfig: {
        theme: 'auto',
        language: 'en',
        currency: 'USD',
        sizeSuggestions: ['S', 'M', 'L'],
        shippingOptions: [
          { method: 'Standard', estimatedDays: '5-7', cost: 9.99, local: false },
          { method: 'Express', estimatedDays: '2-3', cost: 19.99, local: false }
        ]
      },
      recommendations: {
        products: [],
        categories: [],
        searches: []
      },
      confidence: 0.1
    };
  }

  private generateLayoutConfig(profile: UserProfile): PersonalizationResult['layoutConfig'] {
    const sections: PersonalizationResult['layoutConfig']['homepageSections'] = [
      { type: 'hero', priority: 1, content: { featured: 'new-arrivals' } }
    ];

    // 根据用户偏好调整首页布局
    if (profile.preferences.primaryCategory) {
      sections.push({
        type: 'categories',
        priority: 2,
        content: {
          layout: 'grid',
          featured: profile.preferences.primaryCategory.toLowerCase()
        }
      });

      sections.push({
        type: 'products',
        priority: 3,
        content: {
          type: 'category',
          category: profile.preferences.primaryCategory
        }
      });
    } else {
      sections.push(
        { type: 'categories', priority: 2, content: { layout: 'grid' } },
        { type: 'products', priority: 3, content: { type: 'featured' } }
      );
    }

    sections.push({
      type: 'recommendations',
      priority: 4,
      content: { type: 'personalized' }
    });

    // 导航优先级
    const navigationPriority = this.getNavigationPriority(profile);
    const featuredCategories = this.getFeaturedCategories(profile);

    return {
      homepageSections: sections,
      navigationPriority,
      featuredCategories
    };
  }

  private generateContentConfig(profile: UserProfile): PersonalizationResult['contentConfig'] {
    const shippingOptions = this.getShippingOptions(profile);

    return {
      theme: profile.preferences.theme,
      language: profile.preferences.language,
      currency: this.getCurrencyForLocation(profile.preferences.location.country),
      sizeSuggestions: profile.preferences.preferredSizes.length > 0
        ? profile.preferences.preferredSizes
        : this.getDefaultSizesForLocation(profile.preferences.location.country),
      shippingOptions
    };
  }

  private generateRecommendations(profile: UserProfile): PersonalizationResult['recommendations'] {
    const products = this.getRecommendedProducts(profile);
    const categories = this.getRecommendedCategories(profile);
    const searches = this.getRecommendedSearches(profile);

    return {
      products,
      categories,
      searches
    };
  }

  private getNavigationPriority(profile: UserProfile): string[] {
    const categories = profile.behaviors.mostViewedCategories
      .sort((a, b) => b.weight - a.weight)
      .map(c => c.category);

    const defaults = ['Women', 'Men', 'Accessories', 'Sale'];
    const result = [...categories];

    defaults.forEach(category => {
      if (!result.includes(category)) {
        result.push(category);
      }
    });

    return result;
  }

  private getFeaturedCategories(profile: UserProfile): string[] {
    return profile.behaviors.mostViewedCategories
      .slice(0, 3)
      .map(c => c.category);
  }

  private getShippingOptions(profile: UserProfile): PersonalizationResult['contentConfig']['shippingOptions'] {
    const baseOptions = [
      { method: 'Standard', estimatedDays: '5-7', cost: 9.99, local: false },
      { method: 'Express', estimatedDays: '2-3', cost: 19.99, local: false }
    ];

    // 根据位置添加本地配送选项
    if (profile.preferences.location.country) {
      const localOptions = this.getLocalShippingOptions(profile.preferences.location.country);
      return [...localOptions, ...baseOptions];
    }

    return baseOptions;
  }

  private getLocalShippingOptions(country?: string): PersonalizationResult['contentConfig']['shippingOptions'] {
    const localOptions: Record<string, any[]> = {
      'US': [
        { method: 'Local Delivery', estimatedDays: '1-2', cost: 5.99, local: true },
        { method: 'Same Day', estimatedDays: 'Same day', cost: 15.99, local: true }
      ],
      'UK': [
        { method: 'UK Delivery', estimatedDays: '1-2', cost: 4.99, local: true },
        { method: 'London Same Day', estimatedDays: 'Same day', cost: 12.99, local: true }
      ],
      'FR': [
        { method: 'Livraison France', estimatedDays: '1-2', cost: 4.99, local: true },
        { method: 'Paris Express', estimatedDays: 'Same day', cost: 12.99, local: true }
      ]
    };

    return localOptions[country || ''] || [];
  }

  private getCurrencyForLocation(country?: string): string {
    const currencies: Record<string, string> = {
      'US': 'USD',
      'UK': 'GBP',
      'FR': 'EUR',
      'DE': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'JP': 'JPY',
      'AU': 'AUD',
      'CA': 'CAD'
    };

    return currencies[country || ''] || 'USD';
  }

  private getDefaultSizesForLocation(country?: string): string[] {
    const sizesByRegion: Record<string, string[]> = {
      'US': ['XS', 'S', 'M', 'L', 'XL'],
      'UK': ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14'],
      'FR': ['FR 36', 'FR 38', 'FR 40', 'FR 42', 'FR 44'],
      'DE': ['DE 34', 'DE 36', 'DE 38', 'DE 40', 'DE 42'],
      'IT': ['IT 38', 'IT 40', 'IT 42', 'IT 44', 'IT 46'],
      'JP': ['JP S', 'JP M', 'JP L', 'JP LL', 'JP 3L']
    };

    return sizesByRegion[country || ''] || ['S', 'M', 'L', 'XL'];
  }

  private getRecommendedProducts(profile: UserProfile): string[] {
    // 基于用户行为推荐产品
    const categoryPreferences = profile.behaviors.mostViewedCategories
      .slice(0, 3)
      .map(c => c.category);

    // 这里应该从产品数据库获取相关产品
    // 现在返回模拟的产品ID
    return ['prod_001', 'prod_002', 'prod_003', 'prod_004', 'prod_005'];
  }

  private getRecommendedCategories(profile: UserProfile): string[] {
    return profile.behaviors.mostViewedCategories
      .slice(0, 5)
      .map(c => c.category);
  }

  private getRecommendedSearches(profile: UserProfile): string[] {
    return profile.behaviors.searchPatterns
      .slice(0, 5)
      .map(p => p.query);
  }

  private calculateConfidence(profile: UserProfile): number {
    let confidence = 0;

    // 数据量评分 (40%)
    const behaviorCount = this.behaviors.filter(b => b.userId === profile.userId).length;
    const dataScore = Math.min(behaviorCount / 50, 1) * 0.4;

    // 活跃度评分 (30%)
    const daysSinceLastActive = (Date.now() - profile.lastActive.getTime()) / (1000 * 60 * 60 * 24);
    const activityScore = Math.max(0, 1 - (daysSinceLastActive / 30)) * 0.3;

    // 多样性评分 (30%)
    const diversityScore = Math.min(profile.behaviors.mostViewedCategories.length / 5, 1) * 0.3;

    confidence = dataScore + activityScore + diversityScore;
    return Math.round(confidence * 100) / 100;
  }

  public updateSettings(newSettings: Partial<PersonalizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage();

    if (!newSettings.enabled) {
      // 如果禁用了个性化，清理敏感数据
      this.cleanupSensitiveData();
    }
  }

  private cleanupSensitiveData(): void {
    if (this.settings.privacyLevel === 'basic') {
      // 只保留基本的匿名化数据
      this.userProfiles.forEach(profile => {
        profile.preferences.location = {};
        profile.behaviors.searchPatterns = [];
      });
    }
  }

  public resetUserPersonalization(userId: string): void {
    this.userProfiles.delete(userId);
    this.behaviors = this.behaviors.filter(b => b.userId !== userId);
    this.saveToStorage();

    // 清理本地存储
    localStorage.removeItem(`flame-personalization-${userId}`);
  }

  public exportUserData(userId: string): any {
    const profile = this.userProfiles.get(userId);
    const userBehaviors = this.behaviors.filter(b => b.userId === userId);

    return {
      profile: profile ? {
        ...profile,
        anonymousId: profile.anonymousId // 只导出匿名ID
      } : null,
      behaviors: userBehaviors.map(b => ({
        timestamp: b.timestamp,
        action: b.action,
        data: {
          ...b.data,
          ip: undefined // 移除IP地址
        }
      })),
      exportDate: new Date().toISOString(),
      gdprCompliant: true
    };
  }

  public deleteUserData(userId: string): void {
    this.resetUserPersonalization(userId);

    // 记录删除操作（用于审计）
    console.log(`User data deleted for userId: ${userId} at ${new Date().toISOString()}`);
  }

  public getAnalytics(): any {
    const totalUsers = this.userProfiles.size;
    const totalBehaviors = this.behaviors.length;
    const activeUsers = Array.from(this.userProfiles.values())
      .filter(p => (Date.now() - p.lastActive.getTime()) < (7 * 24 * 60 * 60 * 1000))
      .length;

    const topCategories = this.getTopCategories();
    const deviceBreakdown = this.getDeviceBreakdown();
    const privacyMetrics = this.getPrivacyMetrics();

    return {
      totalUsers,
      totalBehaviors,
      activeUsers,
      topCategories,
      deviceBreakdown,
      privacyMetrics,
      settings: this.settings
    };
  }

  private getTopCategories(): Array<{ category: string; count: number }> {
    const categoryCounts: Record<string, number> = {};

    this.behaviors.forEach(behavior => {
      if (behavior.data.category) {
        categoryCounts[behavior.data.category] = (categoryCounts[behavior.data.category] || 0) + 1;
      }
    });

    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }));
  }

  private getDeviceBreakdown(): Array<{ device: string; count: number }> {
    const deviceCounts: Record<string, number> = {};

    this.behaviors.forEach(behavior => {
      if (behavior.data.deviceType) {
        deviceCounts[behavior.data.deviceType] = (deviceCounts[behavior.data.deviceType] || 0) + 1;
      }
    });

    return Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }));
  }

  private getPrivacyMetrics(): any {
    const consentedUsers = Array.from(this.userProfiles.values())
      .filter(p => p.gdprConsent).length;

    return {
      totalUsers: this.userProfiles.size,
      consentedUsers,
      consentRate: this.userProfiles.size > 0 ? (consentedUsers / this.userProfiles.size) * 100 : 0,
      dataRetentionDays: this.settings.dataRetentionDays,
      privacyLevel: this.settings.privacyLevel
    };
  }

  // 辅助方法
  private getCurrentUserId(): string {
    return localStorage.getItem('user-id') || localStorage.getItem('flame-anonymous-id') || this.generateAnonymousId();
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('flame-session-id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('flame-session-id', sessionId);
    }
    return sessionId;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  public getSettings(): PersonalizationSettings {
    return { ...this.settings };
  }

  public getUserProfile(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  public getAllUserProfiles(): UserProfile[] {
    return Array.from(this.userProfiles.values());
  }

  public getBehaviors(userId?: string): UserBehavior[] {
    return userId
      ? this.behaviors.filter(b => b.userId === userId)
      : this.behaviors;
  }
}

export const personalizationEngine = new PersonalizationEngine();
