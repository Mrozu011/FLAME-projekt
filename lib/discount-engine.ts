
interface DiscountRule {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bundle';
  value: number;
  bundlePrice?: number;
  conditions: {
    type: 'quantity' | 'category' | 'product' | 'cart_total' | 'bundle_products' | 'user_type';
    operator: 'equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'contains' | 'in';
    value: any;
    productIds?: string[];
    categoryIds?: string[];
  }[];
  priority: number;
  stackable: boolean;
  active: boolean;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usageCount: number;
  minCartValue?: number;
  maxDiscount?: number;
  customerMessage: string;
  almostQualifiedMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateDiscountRule {
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bundle';
  value: number;
  bundlePrice?: number;
  conditions: {
    type: 'quantity' | 'category' | 'product' | 'cart_total' | 'bundle_products' | 'user_type';
    operator: 'equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'contains' | 'in';
    value: any;
    productIds?: string[];
    categoryIds?: string[];
  }[];
  priority: number;
  stackable: boolean;
  active: boolean;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  minCartValue?: number;
  maxDiscount?: number;
  customerMessage: string;
  almostQualifiedMessage: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  originalPrice?: number;
}

interface DiscountApplication {
  ruleId: string;
  ruleName: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bundle';
  discountAmount: number;
  message: string;
  appliedToItems?: string[];
  originalTotal?: number;
  newTotal?: number;
}

interface DiscountResult {
  appliedDiscounts: DiscountApplication[];
  subtotal: number;
  discountTotal: number;
  finalTotal: number;
  freeShipping: boolean;
  messages: string[];
  almostQualified: {
    ruleId: string;
    message: string;
    requirement: string;
  }[];
}

export class DiscountEngine {
  private rules: DiscountRule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    this.rules = [
      {
        id: 'buy2get10',
        name: 'Buy 2 or More - 10% Off',
        description: 'Get 10% off when you buy 2 or more items',
        type: 'percentage',
        value: 10,
        conditions: [
          {
            type: 'quantity',
            operator: 'greater_equal',
            value: 2
          }
        ],
        priority: 1,
        stackable: false,
        active: true,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        usageLimit: 1000,
        usageCount: 0,
        minCartValue: 50,
        maxDiscount: 100,
        customerMessage: 'You saved {amount} with our Buy 2+ discount!',
        almostQualifiedMessage: 'Add {needed} more item(s) to save 10%!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'bundle-shirt-pants',
        name: 'Shirt + Pants Bundle',
        description: 'Special bundle price for shirt and pants combination',
        type: 'bundle',
        value: 0,
        bundlePrice: 79.99,
        conditions: [
          {
            type: 'bundle_products',
            operator: 'contains',
            value: 'all',
            productIds: ['shirt-001', 'pants-001']
          }
        ],
        priority: 2,
        stackable: false,
        active: true,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        usageLimit: 500,
        usageCount: 0,
        customerMessage: 'Bundle discount applied! You saved {amount}!',
        almostQualifiedMessage: 'Add matching pants to get bundle price!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'free-shipping-100',
        name: 'Free Shipping Over $100',
        description: 'Free shipping for orders over $100',
        type: 'free_shipping',
        value: 0,
        conditions: [
          {
            type: 'cart_total',
            operator: 'greater_equal',
            value: 100
          }
        ],
        priority: 3,
        stackable: true,
        active: true,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        usageCount: 0,
        customerMessage: 'Free shipping applied!',
        almostQualifiedMessage: 'Add {amount} more to get free shipping!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'summer-sale-20',
        name: 'Summer Sale - 20% Off',
        description: '20% off all summer items',
        type: 'percentage',
        value: 20,
        conditions: [
          {
            type: 'category',
            operator: 'in',
            value: ['summer', 'swimwear', 'shorts']
          }
        ],
        priority: 4,
        stackable: true,
        active: true,
        validFrom: new Date('2024-06-01'),
        validTo: new Date('2024-08-31'),
        usageCount: 0,
        maxDiscount: 50,
        customerMessage: 'Summer sale discount applied! You saved {amount}!',
        almostQualifiedMessage: 'Add summer items to save 20%!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'vip-exclusive',
        name: 'VIP Customer - 15% Off',
        description: 'Exclusive 15% discount for VIP customers',
        type: 'percentage',
        value: 15,
        conditions: [
          {
            type: 'user_type',
            operator: 'equals',
            value: 'vip'
          }
        ],
        priority: 5,
        stackable: true,
        active: true,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        usageCount: 0,
        customerMessage: 'VIP exclusive discount applied!',
        almostQualifiedMessage: 'Become a VIP member to unlock exclusive discounts!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'cart-200-fixed',
        name: '$25 Off Orders Over $200',
        description: 'Get $25 off when you spend over $200',
        type: 'fixed',
        value: 25,
        conditions: [
          {
            type: 'cart_total',
            operator: 'greater_equal',
            value: 200
          }
        ],
        priority: 6,
        stackable: false,
        active: true,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        usageCount: 0,
        customerMessage: '$25 discount applied to your order!',
        almostQualifiedMessage: 'Add {amount} more to save $25!',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  public calculateDiscounts(
    cartItems: CartItem[], 
    userType: string = 'regular',
    currentDate: Date = new Date()
  ): DiscountResult {
    const result: DiscountResult = {
      appliedDiscounts: [],
      subtotal: 0,
      discountTotal: 0,
      finalTotal: 0,
      freeShipping: false,
      messages: [],
      almostQualified: []
    };

    // Calculate subtotal
    result.subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Get active and valid rules
    const activeRules = this.rules
      .filter(rule => 
        rule.active && 
        currentDate >= rule.validFrom && 
        currentDate <= rule.validTo &&
        (!rule.usageLimit || rule.usageCount < rule.usageLimit)
      )
      .sort((a, b) => a.priority - b.priority);

    // Check almost qualified rules first
    this.checkAlmostQualified(cartItems, activeRules, userType, result);

    // Apply eligible rules
    const applicableRules = activeRules.filter(rule => 
      this.isRuleApplicable(rule, cartItems, userType, result.subtotal)
    );

    // Group rules by stackability
    const exclusiveRules = applicableRules.filter(rule => !rule.stackable);
    const stackableRules = applicableRules.filter(rule => rule.stackable);

    // Apply best exclusive rule first
    if (exclusiveRules.length > 0) {
      const bestExclusiveRule = this.findBestExclusiveRule(exclusiveRules, cartItems, result.subtotal);
      if (bestExclusiveRule) {
        this.applyRule(bestExclusiveRule, cartItems, result);
      }
    }

    // Apply all stackable rules
    stackableRules.forEach(rule => {
      this.applyRule(rule, cartItems, result);
    });

    // Calculate final total
    result.finalTotal = Math.max(0, result.subtotal - result.discountTotal);

    return result;
  }

  private isRuleApplicable(
    rule: DiscountRule, 
    cartItems: CartItem[], 
    userType: string, 
    subtotal: number
  ): boolean {
    // Check minimum cart value
    if (rule.minCartValue && subtotal < rule.minCartValue) {
      return false;
    }

    // Check all conditions
    return rule.conditions.every(condition => {
      switch (condition.type) {
        case 'quantity':
          const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          return this.evaluateCondition(totalQuantity, condition.operator, condition.value);

        case 'cart_total':
          return this.evaluateCondition(subtotal, condition.operator, condition.value);

        case 'category':
          const hasCategory = cartItems.some(item => 
            condition.operator === 'in' ? 
              condition.value.includes(item.category) : 
              item.category === condition.value
          );
          return hasCategory;

        case 'product':
          const hasProduct = cartItems.some(item => 
            condition.productIds?.includes(item.id)
          );
          return hasProduct;

        case 'bundle_products':
          if (condition.productIds) {
            const cartProductIds = cartItems.map(item => item.id);
            return condition.productIds.every(productId => 
              cartProductIds.includes(productId)
            );
          }
          return false;

        case 'user_type':
          return userType === condition.value;

        default:
          return false;
      }
    });
  }

  private evaluateCondition(value: number, operator: string, target: number): boolean {
    switch (operator) {
      case 'equals': return value === target;
      case 'greater_than': return value > target;
      case 'less_than': return value < target;
      case 'greater_equal': return value >= target;
      case 'less_equal': return value <= target;
      default: return false;
    }
  }

  private findBestExclusiveRule(rules: DiscountRule[], cartItems: CartItem[], subtotal: number): DiscountRule | null {
    let bestRule: DiscountRule | null = null;
    let bestDiscount = 0;

    rules.forEach(rule => {
      const discount = this.calculateRuleDiscount(rule, cartItems, subtotal);
      if (discount > bestDiscount) {
        bestDiscount = discount;
        bestRule = rule;
      }
    });

    return bestRule;
  }

  private calculateRuleDiscount(rule: DiscountRule, cartItems: CartItem[], subtotal: number): number {
    switch (rule.type) {
      case 'percentage':
        let discount = (subtotal * rule.value) / 100;
        if (rule.maxDiscount) {
          discount = Math.min(discount, rule.maxDiscount);
        }
        return discount;

      case 'fixed':
        return Math.min(rule.value, subtotal);

      case 'bundle':
        if (rule.bundlePrice) {
          const bundleItemsTotal = cartItems
            .filter(item => rule.conditions[0].productIds?.includes(item.id))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return Math.max(0, bundleItemsTotal - rule.bundlePrice);
        }
        return 0;

      case 'free_shipping':
        return 0; // Shipping discount handled separately

      default:
        return 0;
    }
  }

  private applyRule(rule: DiscountRule, cartItems: CartItem[], result: DiscountResult): void {
    const discountAmount = this.calculateRuleDiscount(rule, cartItems, result.subtotal);

    if (discountAmount > 0 || rule.type === 'free_shipping') {
      const application: DiscountApplication = {
        ruleId: rule.id,
        ruleName: rule.name,
        type: rule.type,
        discountAmount,
        message: rule.customerMessage.replace('{amount}', `$${discountAmount.toFixed(2)}`),
        appliedToItems: rule.conditions[0].productIds || [],
        originalTotal: result.subtotal,
        newTotal: result.subtotal - discountAmount
      };

      result.appliedDiscounts.push(application);
      result.discountTotal += discountAmount;
      result.messages.push(application.message);

      if (rule.type === 'free_shipping') {
        result.freeShipping = true;
      }

      // Update usage count
      rule.usageCount++;
    }
  }

  private checkAlmostQualified(
    cartItems: CartItem[], 
    rules: DiscountRule[], 
    userType: string, 
    result: DiscountResult
  ): void {
    rules.forEach(rule => {
      if (this.isRuleApplicable(rule, cartItems, userType, result.subtotal)) {
        return; // Already qualified
      }

      // Check what's needed to qualify
      rule.conditions.forEach(condition => {
        switch (condition.type) {
          case 'quantity':
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            const needed = condition.value - totalQuantity;
            if (needed > 0 && needed <= 3) { // Only show if close
              result.almostQualified.push({
                ruleId: rule.id,
                message: rule.almostQualifiedMessage.replace('{needed}', needed.toString()),
                requirement: `Add ${needed} more item(s)`
              });
            }
            break;

          case 'cart_total':
            const needed_amount = condition.value - result.subtotal;
            if (needed_amount > 0 && needed_amount <= 50) { // Only show if within $50
              result.almostQualified.push({
                ruleId: rule.id,
                message: rule.almostQualifiedMessage.replace('{amount}', `$${needed_amount.toFixed(2)}`),
                requirement: `Add $${needed_amount.toFixed(2)} more`
              });
            }
            break;

          case 'bundle_products':
            if (condition.productIds) {
              const cartProductIds = cartItems.map(item => item.id);
              const missingProducts = condition.productIds.filter(id => !cartProductIds.includes(id));
              if (missingProducts.length > 0 && missingProducts.length <= 2) {
                result.almostQualified.push({
                  ruleId: rule.id,
                  message: rule.almostQualifiedMessage,
                  requirement: `Add required bundle items`
                });
              }
            }
            break;
        }
      });
    });
  }

  // Public API methods for admin panel

  public getRules(): DiscountRule[] {
    return this.rules;
  }

  public getRule(id: string): DiscountRule | undefined {
    return this.rules.find(rule => rule.id === id);
  }

  public createRule(rule: CreateDiscountRule): DiscountRule {
    const newRule: DiscountRule = {
      ...rule,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };

    this.rules.push(newRule);
    return newRule;
  }

  public updateRule(id: string, updates: Partial<DiscountRule>): boolean {
    const ruleIndex = this.rules.findIndex(rule => rule.id === id);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = {
        ...this.rules[ruleIndex],
        ...updates,
        updatedAt: new Date()
      };
      return true;
    }
    return false;
  }

  public deleteRule(id: string): boolean {
    const ruleIndex = this.rules.findIndex(rule => rule.id === id);
    if (ruleIndex !== -1) {
      this.rules.splice(ruleIndex, 1);
      return true;
    }
    return false;
  }

  public toggleRule(id: string): boolean {
    const rule = this.rules.find(rule => rule.id === id);
    if (rule) {
      rule.active = !rule.active;
      rule.updatedAt = new Date();
      return true;
    }
    return false;
  }

  public testRule(ruleId: string, mockCart: CartItem[], userType: string = 'regular'): DiscountResult {
    const rule = this.getRule(ruleId);
    if (!rule) {
      throw new Error('Rule not found');
    }

    // Create a temporary rule list with only the test rule
    const originalRules = this.rules;
    this.rules = [rule];

    const result = this.calculateDiscounts(mockCart, userType);

    // Restore original rules
    this.rules = originalRules;

    return result;
  }

  public validateRule(rule: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!rule.name || rule.name.trim().length === 0) {
      errors.push('Rule name is required');
    }

    if (!rule.type || !['percentage', 'fixed', 'free_shipping', 'bundle'].includes(rule.type)) {
      errors.push('Valid discount type is required');
    }

    if (rule.type === 'percentage' && (rule.value < 0 || rule.value > 100)) {
      errors.push('Percentage value must be between 0 and 100');
    }

    if (rule.type === 'fixed' && rule.value < 0) {
      errors.push('Fixed discount value cannot be negative');
    }

    if (rule.type === 'bundle' && !rule.bundlePrice) {
      errors.push('Bundle price is required for bundle discounts');
    }

    if (!rule.conditions || rule.conditions.length === 0) {
      errors.push('At least one condition is required');
    }

    if (rule.validFrom && rule.validTo && rule.validFrom > rule.validTo) {
      errors.push('Valid from date cannot be after valid to date');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  public getActiveRules(): DiscountRule[] {
    const now = new Date();
    return this.rules.filter(rule => 
      rule.active && 
      now >= rule.validFrom && 
      now <= rule.validTo &&
      (!rule.usageLimit || rule.usageCount < rule.usageLimit)
    );
  }

  public getStats(): {
    totalRules: number;
    activeRules: number;
    expiredRules: number;
    totalUsage: number;
    avgDiscountAmount: number;
  } {
    const now = new Date();
    const activeRules = this.rules.filter(rule => 
      rule.active && now >= rule.validFrom && now <= rule.validTo
    );
    const expiredRules = this.rules.filter(rule => now > rule.validTo);
    const totalUsage = this.rules.reduce((sum, rule) => sum + rule.usageCount, 0);

    return {
      totalRules: this.rules.length,
      activeRules: activeRules.length,
      expiredRules: expiredRules.length,
      totalUsage,
      avgDiscountAmount: 0 // This would need transaction data to calculate
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const discountEngine = new DiscountEngine();
