
'use client';

export interface NotificationRule {
  id: string;
  name: string;
  type: 'stock' | 'orders' | 'returns' | 'payments' | 'shipping';
  condition: {
    field: string;
    operator: 'less_than' | 'greater_than' | 'equals' | 'older_than' | 'contains';
    value: any;
  };
  active: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  lastTriggered?: Date;
}

export interface Notification {
  id: string;
  type: 'new_order' | 'return_request' | 'stock_warning' | 'payment_failed' | 'shipping_delay' | 'custom';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  entityId?: string;
  entityType?: string;
  data?: any;
  read: boolean;
  snoozed: boolean;
  snoozeUntil?: Date;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  ruleId?: string;
}

export interface NotificationSettings {
  emailSummary: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
    email: string;
  };
  autoRefresh: {
    enabled: boolean;
    interval: number;
  };
  soundEnabled: boolean;
  desktopNotifications: boolean;
  maxNotifications: number;
  autoMarkReadAfter: number;
}

export class NotificationService {
  private notifications: Notification[] = [];
  private rules: NotificationRule[] = [];
  private settings: NotificationSettings;
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private refreshInterval?: NodeJS.Timeout;
  private lastRefresh: Date = new Date();

  constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeDefaultRules();
    this.loadFromStorage();
    this.startAutoRefresh();
  }

  private getDefaultSettings(): NotificationSettings {
    return {
      emailSummary: {
        enabled: true,
        frequency: 'daily',
        time: '09:00',
        email: 'admin@flamestore.com'
      },
      autoRefresh: {
        enabled: true,
        interval: 15000 // 15 seconds
      },
      soundEnabled: true,
      desktopNotifications: true,
      maxNotifications: 100,
      autoMarkReadAfter: 86400000 // 24 hours
    };
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'stock-low-5',
        name: 'Stock below 5 units',
        type: 'stock',
        condition: {
          field: 'quantity',
          operator: 'less_than',
          value: 5
        },
        active: true,
        priority: 'high',
        createdAt: new Date()
      },
      {
        id: 'stock-out',
        name: 'Out of stock',
        type: 'stock',
        condition: {
          field: 'quantity',
          operator: 'equals',
          value: 0
        },
        active: true,
        priority: 'urgent',
        createdAt: new Date()
      },
      {
        id: 'return-old-48h',
        name: 'Return request older than 48 hours',
        type: 'returns',
        condition: {
          field: 'createdAt',
          operator: 'older_than',
          value: 48 * 60 * 60 * 1000 // 48 hours in milliseconds
        },
        active: true,
        priority: 'medium',
        createdAt: new Date()
      },
      {
        id: 'payment-failed',
        name: 'Payment failed',
        type: 'payments',
        condition: {
          field: 'status',
          operator: 'equals',
          value: 'failed'
        },
        active: true,
        priority: 'high',
        createdAt: new Date()
      },
      {
        id: 'shipping-delayed',
        name: 'Shipping delay detected',
        type: 'shipping',
        condition: {
          field: 'status',
          operator: 'equals',
          value: 'delayed'
        },
        active: true,
        priority: 'medium',
        createdAt: new Date()
      }
    ];
  }

  private loadFromStorage(): void {
    try {
      const savedNotifications = localStorage.getItem('flame-notifications');
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          readAt: n.readAt ? new Date(n.readAt) : undefined,
          snoozeUntil: n.snoozeUntil ? new Date(n.snoozeUntil) : undefined
        }));
      }

      const savedRules = localStorage.getItem('flame-notification-rules');
      if (savedRules) {
        this.rules = JSON.parse(savedRules).map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          lastTriggered: r.lastTriggered ? new Date(r.lastTriggered) : undefined
        }));
      }

      const savedSettings = localStorage.getItem('flame-notification-settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('flame-notifications', JSON.stringify(this.notifications));
      localStorage.setItem('flame-notification-rules', JSON.stringify(this.rules));
      localStorage.setItem('flame-notification-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  private startAutoRefresh(): void {
    if (this.settings.autoRefresh.enabled) {
      this.refreshInterval = setInterval(() => {
        this.checkForNewNotifications();
      }, this.settings.autoRefresh.interval);
    }
  }

  private stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
    }
  }

  public async checkForNewNotifications(): Promise<void> {
    try {
      // Check for new orders
      await this.checkNewOrders();
      
      // Check for new return requests
      await this.checkNewReturns();
      
      // Check stock levels
      await this.checkStockLevels();
      
      // Check for failed payments
      await this.checkFailedPayments();
      
      // Check for shipping delays
      await this.checkShippingDelays();
      
      // Apply custom rules
      await this.applyCustomRules();
      
      // Clean up old notifications
      this.cleanupNotifications();
      
      // Auto-mark read old notifications
      this.autoMarkReadOldNotifications();
      
      this.lastRefresh = new Date();
      this.saveToStorage();
      this.notifyListeners();
      
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  }

  private async checkNewOrders(): Promise<void> {
    try {
      // Simulate API call to check for new orders
      const newOrders = await this.fetchNewOrders();
      
      for (const order of newOrders) {
        if (!this.notificationExists('new_order', order.id)) {
          this.addNotification({
            type: 'new_order',
            title: 'New Order Received',
            message: `Order #${order.id} placed by ${order.customerName}`,
            priority: 'medium',
            entityId: order.id,
            entityType: 'order',
            data: order,
            actionUrl: `/admin/orders/${order.id}`
          });
        }
      }
    } catch (error) {
      console.error('Error checking new orders:', error);
    }
  }

  private async checkNewReturns(): Promise<void> {
    try {
      // Simulate API call to check for new return requests
      const newReturns = await this.fetchNewReturns();
      
      for (const returnRequest of newReturns) {
        if (!this.notificationExists('return_request', returnRequest.id)) {
          this.addNotification({
            type: 'return_request',
            title: 'New Return Request',
            message: `Return request for order #${returnRequest.orderId}`,
            priority: 'medium',
            entityId: returnRequest.id,
            entityType: 'return',
            data: returnRequest,
            actionUrl: `/admin/returns`
          });
        }
      }
    } catch (error) {
      console.error('Error checking new returns:', error);
    }
  }

  private async checkStockLevels(): Promise<void> {
    try {
      // Simulate API call to check stock levels
      const products = await this.fetchProducts();
      
      for (const product of products) {
        // Check if product matches any stock rules
        for (const rule of this.rules.filter(r => r.active && r.type === 'stock')) {
          if (this.evaluateCondition(rule.condition, product)) {
            const notificationId = `stock-${product.id}-${rule.id}`;
            
            if (!this.notificationExists('stock_warning', notificationId)) {
              this.addNotification({
                type: 'stock_warning',
                title: 'Stock Level Warning',
                message: `${product.name} has ${product.quantity} units remaining`,
                priority: rule.priority,
                entityId: notificationId,
                entityType: 'product',
                data: product,
                actionUrl: `/admin/products/${product.id}/edit`,
                ruleId: rule.id
              });
              
              rule.lastTriggered = new Date();
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking stock levels:', error);
    }
  }

  private async checkFailedPayments(): Promise<void> {
    try {
      // Simulate API call to check for failed payments
      const failedPayments = await this.fetchFailedPayments();
      
      for (const payment of failedPayments) {
        if (!this.notificationExists('payment_failed', payment.id)) {
          this.addNotification({
            type: 'payment_failed',
            title: 'Payment Failed',
            message: `Payment failed for order #${payment.orderId}`,
            priority: 'high',
            entityId: payment.id,
            entityType: 'payment',
            data: payment,
            actionUrl: `/admin/orders/${payment.orderId}`
          });
        }
      }
    } catch (error) {
      console.error('Error checking failed payments:', error);
    }
  }

  private async checkShippingDelays(): Promise<void> {
    try {
      // Simulate API call to check for shipping delays
      const shippingDelays = await this.fetchShippingDelays();
      
      for (const delay of shippingDelays) {
        if (!this.notificationExists('shipping_delay', delay.id)) {
          this.addNotification({
            type: 'shipping_delay',
            title: 'Shipping Delay',
            message: `Shipment ${delay.trackingNumber} is delayed`,
            priority: 'medium',
            entityId: delay.id,
            entityType: 'shipment',
            data: delay,
            actionUrl: `/admin/orders/${delay.orderId}`
          });
        }
      }
    } catch (error) {
      console.error('Error checking shipping delays:', error);
    }
  }

  private async applyCustomRules(): Promise<void> {
    try {
      // Apply custom rules that aren't covered by specific checks
      const customRules = this.rules.filter(r => r.active && !['stock'].includes(r.type));
      
      for (const rule of customRules) {
        await this.evaluateRule(rule);
      }
    } catch (error) {
      console.error('Error applying custom rules:', error);
    }
  }

  private async evaluateRule(rule: NotificationRule): Promise<void> {
    // This would be implemented based on specific rule types
    // For now, we'll skip custom rule evaluation
  }

  private evaluateCondition(condition: any, data: any): boolean {
    const value = this.getNestedValue(data, condition.field);
    
    switch (condition.operator) {
      case 'less_than':
        return Number(value) < Number(condition.value);
      case 'greater_than':
        return Number(value) > Number(condition.value);
      case 'equals':
        return value === condition.value;
      case 'older_than':
        const createdAt = new Date(data.createdAt);
        const threshold = new Date(Date.now() - condition.value);
        return createdAt < threshold;
      case 'contains':
        return String(value).includes(String(condition.value));
      default:
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private notificationExists(type: string, entityId: string): boolean {
    return this.notifications.some(n => n.type === type && n.entityId === entityId);
  }

  private addNotification(notification: Omit<Notification, 'id' | 'read' | 'snoozed' | 'createdAt'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      read: false,
      snoozed: false,
      createdAt: new Date()
    };

    this.notifications.unshift(newNotification);
    
    // Limit notifications to max count
    if (this.notifications.length > this.settings.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.settings.maxNotifications);
    }

    // Show desktop notification if enabled
    if (this.settings.desktopNotifications && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico'
        });
      }
    }

    // Play sound if enabled
    if (this.settings.soundEnabled) {
      this.playNotificationSound();
    }
  }

  private playNotificationSound(): void {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch (error) {
      // Ignore audio errors
    }
  }

  private cleanupNotifications(): void {
    // Remove old notifications based on settings
    const cutoffTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    this.notifications = this.notifications.filter(n => n.createdAt > cutoffTime);
  }

  private autoMarkReadOldNotifications(): void {
    if (this.settings.autoMarkReadAfter > 0) {
      const cutoffTime = new Date(Date.now() - this.settings.autoMarkReadAfter);
      this.notifications.forEach(n => {
        if (!n.read && n.createdAt < cutoffTime) {
          n.read = true;
          n.readAt = new Date();
        }
      });
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Mock API calls
  private async fetchNewOrders(): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return mock new orders
    return [
      {
        id: 'ORD-' + Date.now(),
        customerName: 'John Smith',
        total: 299.99,
        status: 'pending',
        createdAt: new Date()
      }
    ];
  }

  private async fetchNewReturns(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [];
  }

  private async fetchProducts(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      {
        id: 'PROD-1',
        name: 'Premium Wireless Headphones',
        quantity: 3,
        threshold: 5
      },
      {
        id: 'PROD-2',
        name: 'Leather Jacket',
        quantity: 0,
        threshold: 5
      }
    ];
  }

  private async fetchFailedPayments(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [];
  }

  private async fetchShippingDelays(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [];
  }

  // Public API methods
  public getNotifications(): Notification[] {
    return this.notifications.filter(n => !n.snoozed || (n.snoozeUntil && n.snoozeUntil <= new Date()));
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  public markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      notification.readAt = new Date();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(n => {
      if (!n.read) {
        n.read = true;
        n.readAt = new Date();
      }
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  public snoozeNotification(notificationId: string, minutes: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.snoozed = true;
      notification.snoozeUntil = new Date(Date.now() + minutes * 60 * 1000);
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  public deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveToStorage();
    this.notifyListeners();
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getRules(): NotificationRule[] {
    return this.rules;
  }

  public addRule(rule: Omit<NotificationRule, 'id' | 'createdAt'>): NotificationRule {
    const newRule: NotificationRule = {
      ...rule,
      id: this.generateId(),
      createdAt: new Date()
    };
    
    this.rules.push(newRule);
    this.saveToStorage();
    return newRule;
  }

  public updateRule(id: string, updates: Partial<NotificationRule>): boolean {
    const ruleIndex = this.rules.findIndex(r => r.id === id);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public deleteRule(id: string): boolean {
    const ruleIndex = this.rules.findIndex(r => r.id === id);
    if (ruleIndex !== -1) {
      this.rules.splice(ruleIndex, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public getSettings(): NotificationSettings {
    return this.settings;
  }

  public updateSettings(updates: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveToStorage();
    
    // Restart auto-refresh if interval changed
    if (updates.autoRefresh) {
      this.stopAutoRefresh();
      this.startAutoRefresh();
    }
  }

  public requestDesktopPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  public async sendEmailSummary(): Promise<void> {
    if (!this.settings.emailSummary.enabled) return;
    
    const unreadNotifications = this.notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;
    
    // This would integrate with your email service
    console.log('Sending email summary to:', this.settings.emailSummary.email);
    console.log('Unread notifications:', unreadNotifications.length);
  }

  public getStatistics(): {
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  } {
    const notifications = this.getNotifications();
    
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: notifications.reduce((acc, n) => {
        acc[n.priority] = (acc[n.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  public destroy(): void {
    this.stopAutoRefresh();
    this.listeners.clear();
  }
}

export const notificationService = new NotificationService();
