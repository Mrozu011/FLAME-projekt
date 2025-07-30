interface AutomationRule {
  id: string;
  name: string;
  type: 'order' | 'product' | 'inventory';
  trigger: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
    value: any;
  }>;
  actions: Array<{
    type: 'email' | 'status_update' | 'inventory_update' | 'generate_label' | 'notification';
    config: any;
  }>;
  active: boolean;
  priority: number;
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
}

interface AutomationEvent {
  id: string;
  type: 'order_status_changed' | 'product_created' | 'inventory_updated' | 'payment_confirmed';
  entityId: string;
  entityType: 'order' | 'product' | 'inventory';
  data: any;
  timestamp: Date;
  triggeredRules: string[];
}

interface AutomationLog {
  id: string;
  ruleId: string;
  eventId: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  executionTime: number;
  timestamp: Date;
  error?: string;
}

export class AutomationService {
  private rules: AutomationRule[] = [];
  private events: AutomationEvent[] = [];
  private logs: AutomationLog[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    this.rules = [
      {
        id: 'email-on-paid',
        name: 'Send confirmation email when order is paid',
        type: 'order',
        trigger: 'order_status_changed',
        conditions: [
          { field: 'newStatus', operator: 'equals', value: 'paid' },
          { field: 'oldStatus', operator: 'not_equals', value: 'paid' }
        ],
        actions: [
          {
            type: 'email',
            config: {
              template: 'order-confirmation',
              recipient: 'customer',
              subject: 'Order Confirmation - #{orderNumber}'
            }
          }
        ],
        active: true,
        priority: 1,
        createdAt: new Date(),
        runCount: 0
      },
      {
        id: 'generate-shipping-label',
        name: 'Generate shipping label when order is packing',
        type: 'order',
        trigger: 'order_status_changed',
        conditions: [
          { field: 'newStatus', operator: 'equals', value: 'packing' },
          { field: 'oldStatus', operator: 'not_equals', value: 'packing' }
        ],
        actions: [
          {
            type: 'generate_label',
            config: {
              carrier: 'auto',
              service: 'standard'
            }
          }
        ],
        active: true,
        priority: 2,
        createdAt: new Date(),
        runCount: 0
      },
      {
        id: 'email-on-shipped',
        name: 'Send tracking email when order is shipped',
        type: 'order',
        trigger: 'order_status_changed',
        conditions: [
          { field: 'newStatus', operator: 'equals', value: 'shipped' },
          { field: 'oldStatus', operator: 'not_equals', value: 'shipped' }
        ],
        actions: [
          {
            type: 'email',
            config: {
              template: 'order-shipped',
              recipient: 'customer',
              subject: 'Your Order Has Shipped - #{orderNumber}'
            }
          }
        ],
        active: true,
        priority: 3,
        createdAt: new Date(),
        runCount: 0
      },
      {
        id: 'auto-out-of-stock',
        name: 'Mark product as out of stock when inventory reaches zero',
        type: 'inventory',
        trigger: 'inventory_updated',
        conditions: [
          { field: 'newStock', operator: 'equals', value: 0 },
          { field: 'oldStock', operator: 'greater_than', value: 0 }
        ],
        actions: [
          {
            type: 'status_update',
            config: {
              entity: 'product',
              status: 'out-of-stock'
            }
          },
          {
            type: 'notification',
            config: {
              type: 'admin',
              message: 'Product #{productName} is now out of stock'
            }
          }
        ],
        active: true,
        priority: 4,
        createdAt: new Date(),
        runCount: 0
      },
      {
        id: 'low-stock-alert',
        name: 'Send low stock alert when inventory is below threshold',
        type: 'inventory',
        trigger: 'inventory_updated',
        conditions: [
          { field: 'newStock', operator: 'less_than', value: 10 },
          { field: 'newStock', operator: 'greater_than', value: 0 },
          { field: 'oldStock', operator: 'greater_than', value: 10 }
        ],
        actions: [
          {
            type: 'email',
            config: {
              template: 'low-stock-alert',
              recipient: 'admin',
              subject: 'Low Stock Alert - #{productName}'
            }
          }
        ],
        active: true,
        priority: 5,
        createdAt: new Date(),
        runCount: 0
      },
      {
        id: 'inventory-deduction',
        name: 'Deduct inventory when order is confirmed',
        type: 'order',
        trigger: 'order_status_changed',
        conditions: [
          { field: 'newStatus', operator: 'equals', value: 'paid' },
          { field: 'oldStatus', operator: 'not_equals', value: 'paid' }
        ],
        actions: [
          {
            type: 'inventory_update',
            config: {
              operation: 'deduct',
              source: 'order_items'
            }
          }
        ],
        active: true,
        priority: 6,
        createdAt: new Date(),
        runCount: 0
      }
    ];
  }

  async triggerEvent(eventType: string, entityId: string, entityType: string, data: any): Promise<void> {
    const event: AutomationEvent = {
      id: this.generateId(),
      type: eventType as any,
      entityId,
      entityType: entityType as any,
      data,
      timestamp: new Date(),
      triggeredRules: []
    };

    this.events.push(event);
    await this.processEvent(event);
  }

  private async processEvent(event: AutomationEvent): Promise<void> {
    if (this.isProcessing) {
      // Queue the event for later processing
      setTimeout(() => this.processEvent(event), 100);
      return;
    }

    this.isProcessing = true;

    try {
      const applicableRules = this.rules
        .filter(rule => rule.active && rule.trigger === event.type)
        .sort((a, b) => a.priority - b.priority);

      for (const rule of applicableRules) {
        if (await this.evaluateConditions(rule, event)) {
          event.triggeredRules.push(rule.id);
          await this.executeRule(rule, event);
        }
      }
    } catch (error) {
      console.error('Error processing automation event:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async evaluateConditions(rule: AutomationRule, event: AutomationEvent): Promise<boolean> {
    for (const condition of rule.conditions) {
      if (!this.evaluateCondition(condition, event.data)) {
        return false;
      }
    }
    return true;
  }

  private evaluateCondition(condition: any, data: any): boolean {
    const value = this.getNestedValue(data, condition.field);
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'greater_than':
        return Number(value) > Number(condition.value);
      case 'less_than':
        return Number(value) < Number(condition.value);
      case 'contains':
        return String(value).includes(String(condition.value));
      default:
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async executeRule(rule: AutomationRule, event: AutomationEvent): Promise<void> {
    const logEntry: AutomationLog = {
      id: this.generateId(),
      ruleId: rule.id,
      eventId: event.id,
      status: 'pending',
      message: `Executing rule: ${rule.name}`,
      executionTime: 0,
      timestamp: new Date()
    };

    this.logs.push(logEntry);
    const startTime = Date.now();

    try {
      for (const action of rule.actions) {
        await this.executeAction(action, event);
      }

      logEntry.status = 'success';
      logEntry.message = `Rule executed successfully: ${rule.name}`;
      logEntry.executionTime = Date.now() - startTime;
      
      rule.runCount++;
      rule.lastRun = new Date();
      
    } catch (error) {
      logEntry.status = 'failed';
      logEntry.message = `Rule execution failed: ${rule.name}`;
      logEntry.error = error.message;
      logEntry.executionTime = Date.now() - startTime;
      
      console.error(`Automation rule ${rule.id} failed:`, error);
    }
  }

  private async executeAction(action: any, event: AutomationEvent): Promise<void> {
    switch (action.type) {
      case 'email':
        await this.sendEmail(action.config, event);
        break;
      case 'status_update':
        await this.updateStatus(action.config, event);
        break;
      case 'inventory_update':
        await this.updateInventory(action.config, event);
        break;
      case 'generate_label':
        await this.generateShippingLabel(action.config, event);
        break;
      case 'notification':
        await this.sendNotification(action.config, event);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async sendEmail(config: any, event: AutomationEvent): Promise<void> {
    // Email sending logic would go here
    // This would integrate with your email service
    console.log('Sending email:', {
      template: config.template,
      recipient: config.recipient,
      subject: this.interpolateTemplate(config.subject, event.data),
      eventData: event.data
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async updateStatus(config: any, event: AutomationEvent): Promise<void> {
    // Status update logic would go here
    console.log('Updating status:', {
      entity: config.entity,
      entityId: event.entityId,
      status: config.status,
      eventData: event.data
    });
    
    // Simulate status update delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async updateInventory(config: any, event: AutomationEvent): Promise<void> {
    // Inventory update logic would go here
    console.log('Updating inventory:', {
      operation: config.operation,
      source: config.source,
      eventData: event.data
    });
    
    // Simulate inventory update delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  private async generateShippingLabel(config: any, event: AutomationEvent): Promise<void> {
    // Shipping label generation logic would go here
    console.log('Generating shipping label:', {
      carrier: config.carrier,
      service: config.service,
      eventData: event.data
    });
    
    // Simulate label generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async sendNotification(config: any, event: AutomationEvent): Promise<void> {
    // Notification sending logic would go here
    console.log('Sending notification:', {
      type: config.type,
      message: this.interpolateTemplate(config.message, event.data),
      eventData: event.data
    });
    
    // Simulate notification delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private interpolateTemplate(template: string, data: any): string {
    return template.replace(/#\{([^}]+)\}/g, (match, key) => {
      return this.getNestedValue(data, key) || match;
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Public API methods
  
  public getRules(): AutomationRule[] {
    return this.rules;
  }

  public getRule(id: string): AutomationRule | undefined {
    return this.rules.find(rule => rule.id === id);
  }

  public createRule(rule: Omit<AutomationRule, 'id' | 'createdAt' | 'runCount'>): AutomationRule {
    const newRule: AutomationRule = {
      ...rule,
      id: this.generateId(),
      createdAt: new Date(),
      runCount: 0
    };
    
    this.rules.push(newRule);
    return newRule;
  }

  public updateRule(id: string, updates: Partial<AutomationRule>): boolean {
    const ruleIndex = this.rules.findIndex(rule => rule.id === id);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
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
      return true;
    }
    return false;
  }

  public getEvents(limit: number = 100): AutomationEvent[] {
    return this.events.slice(-limit).reverse();
  }

  public getLogs(ruleId?: string, limit: number = 100): AutomationLog[] {
    let filteredLogs = this.logs;
    
    if (ruleId) {
      filteredLogs = filteredLogs.filter(log => log.ruleId === ruleId);
    }
    
    return filteredLogs.slice(-limit).reverse();
  }

  public getStats(): {
    totalRules: number;
    activeRules: number;
    totalEvents: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
  } {
    const totalRules = this.rules.length;
    const activeRules = this.rules.filter(rule => rule.active).length;
    const totalEvents = this.events.length;
    const successfulExecutions = this.logs.filter(log => log.status === 'success').length;
    const failedExecutions = this.logs.filter(log => log.status === 'failed').length;
    const averageExecutionTime = this.logs.length > 0 
      ? this.logs.reduce((sum, log) => sum + log.executionTime, 0) / this.logs.length
      : 0;

    return {
      totalRules,
      activeRules,
      totalEvents,
      successfulExecutions,
      failedExecutions,
      averageExecutionTime
    };
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public clearEvents(): void {
    this.events = [];
  }
}

export const automationService = new AutomationService();