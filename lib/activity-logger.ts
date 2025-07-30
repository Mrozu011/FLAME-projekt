


export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  actionType: 'login' | 'logout' | 'product' | 'order' | 'user' | 'discount' | 'system' | 'settings';
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  resourceId?: string;
  resourceType?: string;
  changes?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface ActivityLogFilter {
  adminName?: string;
  actionType?: string;
  dateFrom?: string;
  dateTo?: string;
  severity?: string;
  search?: string;
}

class ActivityLogger {
  private logs: ActivityLog[] = [];
  private maxLogs = 10000;
  private retentionDays = 90;

  constructor() {
    this.loadLogs();
    this.cleanupOldLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem('admin_activity_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem('admin_activity_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save activity logs:', error);
    }
  }

  private cleanupOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
    
    this.logs = this.logs.filter(log => 
      new Date(log.timestamp) > cutoffDate
    );
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    this.saveLogs();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getCurrentAdmin() {
    return {
      id: 'admin_001',
      name: 'Current Admin'
    };
  }

  private getClientInfo() {
    return {
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent
    };
  }

  public log(
    action: string,
    actionType: ActivityLog['actionType'],
    description: string,
    options?: {
      resourceId?: string;
      resourceType?: string;
      changes?: Record<string, any>;
      severity?: ActivityLog['severity'];
    }
  ) {
    const admin = this.getCurrentAdmin();
    const clientInfo = this.getClientInfo();
    
    const logEntry: ActivityLog = {
      id: this.generateId(),
      adminId: admin.id,
      adminName: admin.name,
      action,
      actionType,
      description,
      timestamp: new Date().toISOString(),
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      resourceId: options?.resourceId,
      resourceType: options?.resourceType,
      changes: options?.changes,
      severity: options?.severity || 'info'
    };

    this.logs.unshift(logEntry);
    this.saveLogs();

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
      this.saveLogs();
    }
  }

  public getLogs(filter?: ActivityLogFilter, page = 1, limit = 50): {
    logs: ActivityLog[];
    total: number;
    hasMore: boolean;
  } {
    let filteredLogs = [...this.logs];

    if (filter?.adminName) {
      filteredLogs = filteredLogs.filter(log =>
        log.adminName.toLowerCase().includes(filter.adminName!.toLowerCase())
      );
    }

    if (filter?.actionType) {
      filteredLogs = filteredLogs.filter(log =>
        log.actionType === filter.actionType
      );
    }

    if (filter?.severity) {
      filteredLogs = filteredLogs.filter(log =>
        log.severity === filter.severity
      );
    }

    if (filter?.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.action.toLowerCase().includes(searchTerm) ||
        log.description.toLowerCase().includes(searchTerm) ||
        log.resourceId?.toLowerCase().includes(searchTerm)
      );
    }

    if (filter?.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) >= fromDate
      );
    }

    if (filter?.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) <= toDate
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
      hasMore: endIndex < filteredLogs.length
    };
  }

  public exportLogs(filter?: ActivityLogFilter): string {
    const { logs } = this.getLogs(filter, 1, 10000);
    
    const headers = [
      'Timestamp',
      'Admin ID',
      'Admin Name',
      'Action Type',
      'Action',
      'Description',
      'Resource Type',
      'Resource ID',
      'IP Address',
      'Severity'
    ];

    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.adminId,
      log.adminName,
      log.actionType,
      log.action,
      log.description,
      log.resourceType || '',
      log.resourceId || '',
      log.ipAddress || '',
      log.severity
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  public clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  public getStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: this.logs.length,
      today: this.logs.filter(log => new Date(log.timestamp) >= today).length,
      thisWeek: this.logs.filter(log => new Date(log.timestamp) >= thisWeek).length,
      thisMonth: this.logs.filter(log => new Date(log.timestamp) >= thisMonth).length,
      byType: {
        login: this.logs.filter(log => log.actionType === 'login').length,
        logout: this.logs.filter(log => log.actionType === 'logout').length,
        product: this.logs.filter(log => log.actionType === 'product').length,
        order: this.logs.filter(log => log.actionType === 'order').length,
        user: this.logs.filter(log => log.actionType === 'user').length,
        discount: this.logs.filter(log => log.actionType === 'discount').length,
        system: this.logs.filter(log => log.actionType === 'system').length,
        settings: this.logs.filter(log => log.actionType === 'settings').length
      },
      bySeverity: {
        info: this.logs.filter(log => log.severity === 'info').length,
        warning: this.logs.filter(log => log.severity === 'warning').length,
        error: this.logs.filter(log => log.severity === 'error').length,
        success: this.logs.filter(log => log.severity === 'success').length
      }
    };
  }

  // Predefined log methods for common actions
  public logLogin(adminName: string, method = 'password') {
    this.log(
      'Admin Login',
      'login',
      `Admin ${adminName} logged in using ${method}`,
      { severity: 'success' }
    );
  }

  public logLogout(adminName: string) {
    this.log(
      'Admin Logout',
      'logout',
      `Admin ${adminName} logged out`,
      { severity: 'info' }
    );
  }

  public logProductCreate(productId: string, productName: string) {
    this.log(
      'Product Created',
      'product',
      `Created new product: ${productName}`,
      {
        resourceId: productId,
        resourceType: 'product',
        severity: 'success'
      }
    );
  }

  public logProductUpdate(productId: string, productName: string, changes: Record<string, any>) {
    this.log(
      'Product Updated',
      'product',
      `Updated product: ${productName}`,
      {
        resourceId: productId,
        resourceType: 'product',
        changes,
        severity: 'info'
      }
    );
  }

  public logProductDelete(productId: string, productName: string) {
    this.log(
      'Product Deleted',
      'product',
      `Deleted product: ${productName}`,
      {
        resourceId: productId,
        resourceType: 'product',
        severity: 'warning'
      }
    );
  }

  public logOrderUpdate(orderId: string, oldStatus: string, newStatus: string) {
    this.log(
      'Order Status Updated',
      'order',
      `Order #${orderId} status changed from ${oldStatus} to ${newStatus}`,
      {
        resourceId: orderId,
        resourceType: 'order',
        changes: { status: { from: oldStatus, to: newStatus } },
        severity: 'info'
      }
    );
  }

  public logUserRoleChange(userId: string, userName: string, oldRole: string, newRole: string) {
    this.log(
      'User Role Changed',
      'user',
      `Changed ${userName}'s role from ${oldRole} to ${newRole}`,
      {
        resourceId: userId,
        resourceType: 'user',
        changes: { role: { from: oldRole, to: newRole } },
        severity: 'warning'
      }
    );
  }

  public logDiscountCreate(discountId: string, discountCode: string, discountType: string) {
    this.log(
      'Discount Created',
      'discount',
      `Created new ${discountType} discount: ${discountCode}`,
      {
        resourceId: discountId,
        resourceType: 'discount',
        severity: 'success'
      }
    );
  }

  public logDiscountUpdate(discountId: string, discountCode: string, changes: Record<string, any>) {
    this.log(
      'Discount Updated',
      'discount',
      `Updated discount: ${discountCode}`,
      {
        resourceId: discountId,
        resourceType: 'discount',
        changes,
        severity: 'info'
      }
    );
  }

  public logDiscountDelete(discountId: string, discountCode: string) {
    this.log(
      'Discount Deleted',
      'discount',
      `Deleted discount: ${discountCode}`,
      {
        resourceId: discountId,
        resourceType: 'discount',
        severity: 'warning'
      }
    );
  }

  public logSystemError(error: string, context?: string) {
    this.log(
      'System Error',
      'system',
      `System error: ${error}${context ? ` (Context: ${context})` : ''}`,
      { severity: 'error' }
    );
  }

  public logSettingsChange(setting: string, oldValue: any, newValue: any) {
    this.log(
      'Settings Changed',
      'settings',
      `Changed ${setting} from ${oldValue} to ${newValue}`,
      {
        changes: { [setting]: { from: oldValue, to: newValue } },
        severity: 'info'
      }
    );
  }
}

export const activityLogger = new ActivityLogger();
