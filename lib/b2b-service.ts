'use client';

interface BusinessAccount {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId: string;
  businessType: 'retailer' | 'distributor' | 'manufacturer' | 'other';
  annualVolume: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  pricingListId?: string;
  taxExempt: boolean;
  paymentTerms: 'net15' | 'net30' | 'net45' | 'net60';
  creditLimit: number;
  minimumOrderValue: number;
  discountPercentage: number;
  specialPricing: boolean;
  notes: string;
  approvedBy?: string;
  approvedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  minQuantity: number;
  maxQuantity?: number;
  discountType: 'percentage' | 'fixed' | 'special_price';
  discountValue: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  active: boolean;
}

interface B2BPricingList {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  productPricing: {
    productId: string;
    tiers: PricingTier[];
  }[];
  active: boolean;
  validFrom: Date;
  validTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface WholesaleOrder {
  id: string;
  businessAccountId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    discountedPrice: number;
    totalPrice: number;
    tier: string;
  }[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'invoice' | 'bank_transfer' | 'credit_card' | 'check';
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  dueDate?: Date;
  taxExempt: boolean;
  shippingAddress: {
    companyName: string;
    contactPerson: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  invoiceNumber?: string;
  poNumber?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface B2BApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessType: string;
  taxId: string;
  annualVolume: string;
  productsOfInterest: string[];
  currentSuppliers: string;
  reasonForJoining: string;
  references: {
    name: string;
    company: string;
    email: string;
    phone: string;
  }[];
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    resaleCertificate?: string;
  };
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

export class B2BService {
  private businessAccounts: BusinessAccount[] = [];
  private pricingLists: B2BPricingList[] = [];
  private wholesaleOrders: WholesaleOrder[] = [];
  private applications: B2BApplication[] = [];
  private defaultPricingTiers: PricingTier[] = [];

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default pricing tiers
    this.defaultPricingTiers = [
      {
        id: 'bronze-tier-1',
        name: 'Bronze Tier 1',
        description: '10-49 units',
        minQuantity: 10,
        maxQuantity: 49,
        discountType: 'percentage',
        discountValue: 5,
        tier: 'bronze',
        active: true
      },
      {
        id: 'bronze-tier-2',
        name: 'Bronze Tier 2',
        description: '50-99 units',
        minQuantity: 50,
        maxQuantity: 99,
        discountType: 'percentage',
        discountValue: 10,
        tier: 'bronze',
        active: true
      },
      {
        id: 'silver-tier-1',
        name: 'Silver Tier 1',
        description: '100-199 units',
        minQuantity: 100,
        maxQuantity: 199,
        discountType: 'percentage',
        discountValue: 15,
        tier: 'silver',
        active: true
      },
      {
        id: 'silver-tier-2',
        name: 'Silver Tier 2',
        description: '200+ units',
        minQuantity: 200,
        discountType: 'percentage',
        discountValue: 20,
        tier: 'silver',
        active: true
      },
      {
        id: 'gold-tier-1',
        name: 'Gold Tier 1',
        description: '500+ units',
        minQuantity: 500,
        discountType: 'percentage',
        discountValue: 25,
        tier: 'gold',
        active: true
      },
      {
        id: 'platinum-tier-1',
        name: 'Platinum Tier 1',
        description: '1000+ units',
        minQuantity: 1000,
        discountType: 'percentage',
        discountValue: 30,
        tier: 'platinum',
        active: true
      }
    ];

    // Initialize mock business accounts
    this.businessAccounts = [
      {
        id: 'b2b-001',
        companyName: 'TechWorld Retail Inc.',
        contactPerson: 'James Wilson',
        email: 'james@techworld.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        taxId: 'EIN-123456789',
        businessType: 'retailer',
        annualVolume: '$500,000 - $1,000,000',
        status: 'approved',
        tier: 'gold',
        pricingListId: 'pricing-list-gold',
        taxExempt: true,
        paymentTerms: 'net30',
        creditLimit: 50000,
        minimumOrderValue: 500,
        discountPercentage: 25,
        specialPricing: true,
        notes: 'VIP client with excellent payment history',
        approvedBy: 'admin',
        approvedDate: new Date('2024-01-01'),
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'b2b-002',
        companyName: 'Fashion Forward Distributors',
        contactPerson: 'Sarah Martinez',
        email: 'sarah@fashionforward.com',
        phone: '+1 (555) 987-6543',
        address: {
          street: '456 Commerce St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        taxId: 'EIN-987654321',
        businessType: 'distributor',
        annualVolume: '$1,000,000+',
        status: 'approved',
        tier: 'platinum',
        pricingListId: 'pricing-list-platinum',
        taxExempt: true,
        paymentTerms: 'net45',
        creditLimit: 100000,
        minimumOrderValue: 1000,
        discountPercentage: 30,
        specialPricing: true,
        notes: 'Largest distributor in West Coast',
        approvedBy: 'admin',
        approvedDate: new Date('2023-11-15'),
        createdAt: new Date('2023-11-01'),
        updatedAt: new Date('2023-11-15')
      }
    ];

    // Initialize mock wholesale orders
    this.wholesaleOrders = [
      {
        id: 'WO-001',
        businessAccountId: 'b2b-001',
        companyName: 'TechWorld Retail Inc.',
        contactPerson: 'James Wilson',
        email: 'james@techworld.com',
        items: [
          {
            productId: '1',
            name: 'Premium Wireless Headphones',
            sku: 'PWH-001',
            quantity: 100,
            unitPrice: 149.99,
            discountedPrice: 112.49,
            totalPrice: 11249.00,
            tier: 'Gold Tier 1'
          },
          {
            productId: '2',
            name: 'Bluetooth Speaker',
            sku: 'BTS-002',
            quantity: 50,
            unitPrice: 89.99,
            discountedPrice: 67.49,
            totalPrice: 3374.50,
            tier: 'Gold Tier 1'
          }
        ],
        subtotal: 14623.50,
        discount: 3655.88,
        taxAmount: 0,
        shippingCost: 150.00,
        total: 14773.50,
        status: 'processing',
        paymentMethod: 'invoice',
        paymentStatus: 'pending',
        paymentTerms: 'Net 30',
        dueDate: new Date('2024-02-15'),
        taxExempt: true,
        shippingAddress: {
          companyName: 'TechWorld Retail Inc.',
          contactPerson: 'James Wilson',
          street: '123 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          phone: '+1 (555) 123-4567'
        },
        invoiceNumber: 'INV-WO-001',
        poNumber: 'PO-2024-001',
        notes: 'Rush order for Q1 inventory',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16')
      }
    ];

    // Initialize pending applications
    this.applications = [
      {
        id: 'app-001',
        companyName: 'Electronics Plus Store',
        contactPerson: 'Michael Johnson',
        email: 'mike@electronicsplus.com',
        phone: '+1 (555) 456-7890',
        website: 'www.electronicsplus.com',
        address: {
          street: '789 Retail Blvd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        businessType: 'retailer',
        taxId: 'EIN-456789123',
        annualVolume: '$250,000 - $500,000',
        productsOfInterest: ['Electronics', 'Accessories', 'Audio'],
        currentSuppliers: 'BestBuy Wholesale, TechDistributor Inc.',
        reasonForJoining: 'Looking for better pricing and exclusive products for our retail chain',
        references: [
          {
            name: 'David Smith',
            company: 'TechDistributor Inc.',
            email: 'david@techdist.com',
            phone: '+1 (555) 111-2222'
          }
        ],
        documents: {
          businessLicense: 'business-license-001.pdf',
          taxCertificate: 'tax-cert-001.pdf',
          resaleCertificate: 'resale-cert-001.pdf'
        },
        status: 'under_review',
        submittedAt: new Date('2024-01-10')
      }
    ];
  }

  // B2B Application Methods
  public submitApplication(application: Omit<B2BApplication, 'id' | 'status' | 'submittedAt'>): B2BApplication {
    const newApplication: B2BApplication = {
      ...application,
      id: this.generateId(),
      status: 'submitted',
      submittedAt: new Date()
    };

    this.applications.push(newApplication);
    return newApplication;
  }

  public getApplications(): B2BApplication[] {
    return this.applications;
  }

  public getApplication(id: string): B2BApplication | undefined {
    return this.applications.find(app => app.id === id);
  }

  public reviewApplication(
    id: string, 
    status: 'approved' | 'rejected', 
    reviewerId: string, 
    notes?: string
  ): boolean {
    const application = this.applications.find(app => app.id === id);
    if (!application) return false;

    application.status = status;
    application.reviewedBy = reviewerId;
    application.reviewNotes = notes;
    application.reviewedAt = new Date();

    // If approved, create business account
    if (status === 'approved') {
      this.createBusinessAccountFromApplication(application);
    }

    return true;
  }

  private createBusinessAccountFromApplication(application: B2BApplication): BusinessAccount {
    const tier = this.determineTierFromVolume(application.annualVolume);
    
    const businessAccount: BusinessAccount = {
      id: this.generateId(),
      companyName: application.companyName,
      contactPerson: application.contactPerson,
      email: application.email,
      phone: application.phone,
      address: application.address,
      taxId: application.taxId,
      businessType: application.businessType as any,
      annualVolume: application.annualVolume,
      status: 'approved',
      tier,
      taxExempt: false,
      paymentTerms: 'net30',
      creditLimit: this.getCreditLimitByTier(tier),
      minimumOrderValue: this.getMinimumOrderByTier(tier),
      discountPercentage: this.getDiscountByTier(tier),
      specialPricing: false,
      notes: `Created from application ${application.id}`,
      approvedBy: application.reviewedBy,
      approvedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.businessAccounts.push(businessAccount);
    return businessAccount;
  }

  private determineTierFromVolume(volume: string): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (volume.includes('$1,000,000+')) return 'platinum';
    if (volume.includes('$500,000')) return 'gold';
    if (volume.includes('$250,000')) return 'silver';
    return 'bronze';
  }

  private getCreditLimitByTier(tier: string): number {
    const limits = { bronze: 10000, silver: 25000, gold: 50000, platinum: 100000 };
    return limits[tier as keyof typeof limits] || 10000;
  }

  private getMinimumOrderByTier(tier: string): number {
    const minimums = { bronze: 100, silver: 250, gold: 500, platinum: 1000 };
    return minimums[tier as keyof typeof minimums] || 100;
  }

  private getDiscountByTier(tier: string): number {
    const discounts = { bronze: 5, silver: 15, gold: 25, platinum: 30 };
    return discounts[tier as keyof typeof discounts] || 5;
  }

  // Business Account Methods
  public getBusinessAccounts(): BusinessAccount[] {
    return this.businessAccounts;
  }

  public getBusinessAccount(id: string): BusinessAccount | undefined {
    return this.businessAccounts.find(account => account.id === id);
  }

  public createBusinessAccount(account: Omit<BusinessAccount, 'id' | 'createdAt' | 'updatedAt'>): BusinessAccount {
    const newAccount: BusinessAccount = {
      ...account,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.businessAccounts.push(newAccount);
    return newAccount;
  }

  public updateBusinessAccount(id: string, updates: Partial<BusinessAccount>): boolean {
    const accountIndex = this.businessAccounts.findIndex(account => account.id === id);
    if (accountIndex !== -1) {
      this.businessAccounts[accountIndex] = {
        ...this.businessAccounts[accountIndex],
        ...updates,
        updatedAt: new Date()
      };
      return true;
    }
    return false;
  }

  // Pricing Methods
  public calculateB2BPricing(
    productId: string, 
    quantity: number, 
    businessAccountId: string
  ): { unitPrice: number; discountedPrice: number; tier: string; totalSavings: number } {
    const account = this.getBusinessAccount(businessAccountId);
    if (!account) {
      throw new Error('Business account not found');
    }

    // Get base price (would normally come from product service)
    const basePrice = this.getProductPrice(productId);
    
    // Find applicable tier
    const applicableTier = this.findApplicableTier(quantity, account.tier);
    
    if (!applicableTier) {
      return {
        unitPrice: basePrice,
        discountedPrice: basePrice,
        tier: 'No discount tier',
        totalSavings: 0
      };
    }

    let discountedPrice = basePrice;
    
    if (applicableTier.discountType === 'percentage') {
      discountedPrice = basePrice * (1 - applicableTier.discountValue / 100);
    } else if (applicableTier.discountType === 'fixed') {
      discountedPrice = Math.max(0, basePrice - applicableTier.discountValue);
    }

    // Apply additional account-specific discount if any
    if (account.specialPricing && account.discountPercentage > 0) {
      const additionalDiscount = discountedPrice * (account.discountPercentage / 100);
      discountedPrice = Math.max(0, discountedPrice - additionalDiscount);
    }

    const totalSavings = (basePrice - discountedPrice) * quantity;

    return {
      unitPrice: basePrice,
      discountedPrice: Number(discountedPrice.toFixed(2)),
      tier: applicableTier.name,
      totalSavings: Number(totalSavings.toFixed(2))
    };
  }

  private findApplicableTier(quantity: number, accountTier: string): PricingTier | null {
    const accountTiers = this.defaultPricingTiers.filter(tier => 
      tier.tier === accountTier && 
      quantity >= tier.minQuantity &&
      (tier.maxQuantity === undefined || quantity <= tier.maxQuantity)
    );

    // Return the highest tier that applies
    return accountTiers.reduce((best, current) => {
      if (!best) return current;
      return current.minQuantity > best.minQuantity ? current : best;
    }, null as PricingTier | null);
  }

  private getProductPrice(productId: string): number {
    // Mock product prices - in real implementation, this would query the product service
    const prices: Record<string, number> = {
      '1': 149.99,
      '2': 89.99,
      '3': 29.99,
      '4': 199.99,
      '5': 79.99
    };
    return prices[productId] || 99.99;
  }

  // Wholesale Order Methods
  public getWholesaleOrders(): WholesaleOrder[] {
    return this.wholesaleOrders;
  }

  public getWholesaleOrder(id: string): WholesaleOrder | undefined {
    return this.wholesaleOrders.find(order => order.id === id);
  }

  public createWholesaleOrder(order: Omit<WholesaleOrder, 'id' | 'createdAt' | 'updatedAt'>): WholesaleOrder {
    const newOrder: WholesaleOrder = {
      ...order,
      id: `WO-${this.generateOrderNumber()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.wholesaleOrders.push(newOrder);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: WholesaleOrder['status']): boolean {
    const orderIndex = this.wholesaleOrders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      this.wholesaleOrders[orderIndex].status = status;
      this.wholesaleOrders[orderIndex].updatedAt = new Date();
      return true;
    }
    return false;
  }

  // Catalog Export Methods
  public generateB2BCatalog(businessAccountId: string, format: 'csv' | 'excel' = 'csv'): string {
    const account = this.getBusinessAccount(businessAccountId);
    if (!account) {
      throw new Error('Business account not found');
    }

    // Mock product data with B2B pricing
    const products = [
      { id: '1', name: 'Premium Wireless Headphones', sku: 'PWH-001', category: 'Electronics', description: 'High-quality wireless headphones' },
      { id: '2', name: 'Bluetooth Speaker', sku: 'BTS-002', category: 'Electronics', description: 'Portable bluetooth speaker' },
      { id: '3', name: 'Wireless Charging Pad', sku: 'WCP-003', category: 'Accessories', description: 'Fast wireless charging pad' },
      { id: '4', name: 'Smart Fitness Watch', sku: 'SFW-004', category: 'Electronics', description: 'Advanced fitness tracking watch' },
      { id: '5', name: 'USB-C Cable', sku: 'USC-005', category: 'Accessories', description: 'High-speed USB-C cable' }
    ];

    if (format === 'csv') {
      const headers = [
        'SKU',
        'Product Name',
        'Category',
        'Description',
        'Retail Price',
        'Tier 1 Price (10-49 units)',
        'Tier 1 Discount',
        'Tier 2 Price (50-99 units)',
        'Tier 2 Discount',
        'Tier 3 Price (100+ units)',
        'Tier 3 Discount',
        'Minimum Order Quantity',
        'Stock Status'
      ];

      const rows = products.map(product => {
        const basePrice = this.getProductPrice(product.id);
        const tier1 = this.calculateB2BPricing(product.id, 10, businessAccountId);
        const tier2 = this.calculateB2BPricing(product.id, 50, businessAccountId);
        const tier3 = this.calculateB2BPricing(product.id, 100, businessAccountId);

        return [
          product.sku,
          product.name,
          product.category,
          product.description,
          `$${basePrice.toFixed(2)}`,
          `$${tier1.discountedPrice}`,
          `${(((basePrice - tier1.discountedPrice) / basePrice) * 100).toFixed(1)}%`,
          `$${tier2.discountedPrice}`,
          `${(((basePrice - tier2.discountedPrice) / basePrice) * 100).toFixed(1)}%`,
          `$${tier3.discountedPrice}`,
          `${(((basePrice - tier3.discountedPrice) / basePrice) * 100).toFixed(1)}%`,
          account.minimumOrderValue.toString(),
          'In Stock'
        ];
      });

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    return 'Excel format not implemented';
  }

  // Statistics Methods
  public getB2BStats(): {
    totalBusinessAccounts: number;
    pendingApplications: number;
    approvedAccounts: number;
    totalWholesaleOrders: number;
    wholesaleRevenue: number;
    averageOrderValue: number;
    topTier: string;
  } {
    const pendingApplications = this.applications.filter(app => app.status === 'submitted' || app.status === 'under_review').length;
    const approvedAccounts = this.businessAccounts.filter(acc => acc.status === 'approved').length;
    const wholesaleRevenue = this.wholesaleOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = this.wholesaleOrders.length > 0 ? wholesaleRevenue / this.wholesaleOrders.length : 0;
    
    const tierCounts = this.businessAccounts.reduce((acc, account) => {
      acc[account.tier] = (acc[account.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topTier = Object.entries(tierCounts).reduce((a, b) => tierCounts[a[0]] > tierCounts[b[0]] ? a : b)?.[0] || 'bronze';

    return {
      totalBusinessAccounts: this.businessAccounts.length,
      pendingApplications,
      approvedAccounts,
      totalWholesaleOrders: this.wholesaleOrders.length,
      wholesaleRevenue,
      averageOrderValue,
      topTier
    };
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateOrderNumber(): string {
    return String(this.wholesaleOrders.length + 1).padStart(3, '0');
  }

  // Tax-exempt verification
  public verifyTaxExemption(businessAccountId: string, taxCertificate: string): boolean {
    const account = this.getBusinessAccount(businessAccountId);
    if (!account) return false;

    // In real implementation, this would verify the tax certificate
    // For now, we'll just update the account
    this.updateBusinessAccount(businessAccountId, { taxExempt: true });
    return true;
  }

  // Payment terms management
  public updatePaymentTerms(businessAccountId: string, terms: BusinessAccount['paymentTerms']): boolean {
    return this.updateBusinessAccount(businessAccountId, { paymentTerms: terms });
  }

  // Credit limit management
  public updateCreditLimit(businessAccountId: string, creditLimit: number): boolean {
    return this.updateBusinessAccount(businessAccountId, { creditLimit });
  }
}

export const b2bService = new B2BService();