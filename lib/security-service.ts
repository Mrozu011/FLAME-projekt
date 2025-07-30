'use client';

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'ip_blocked' | 'account_suspended' | 'data_breach_attempt' | 'cart_manipulation' | 'unusual_order_volume';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent?: string;
  location?: string;
  description: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actions: string[];
}

export interface SecurityRule {
  id: string;
  name: string;
  type: 'login_attempts' | 'order_volume' | 'cart_manipulation' | 'api_rate_limit' | 'suspicious_pattern';
  enabled: boolean;
  threshold: number;
  timeWindow: number; // in minutes
  action: 'flag' | 'block_ip' | 'suspend_account' | 'require_2fa' | 'email_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  conditions: Record<string, any>;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface BlockedIP {
  ip: string;
  reason: string;
  blockedAt: Date;
  blockedBy: string;
  expiresAt?: Date;
  permanent: boolean;
  attempts: number;
}

export interface TwoFactorAuth {
  userId: string;
  secret: string;
  enabled: boolean;
  backupCodes: string[];
  lastUsed?: Date;
  setupAt: Date;
}

export interface SuspiciousActivity {
  id: string;
  userId?: string;
  ipAddress: string;
  activityType: 'multiple_failed_checkouts' | 'cart_total_manipulation' | 'unusual_order_volume' | 'rapid_account_creation' | 'payment_method_abuse';
  riskScore: number;
  details: Record<string, any>;
  timestamp: Date;
  flagged: boolean;
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  actions: string[];
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  require2FA: boolean;
  autoBlock: boolean;
  emailAlerts: boolean;
  alertEmail: string;
  rateLimits: {
    api: number; // requests per minute
    checkout: number; // checkouts per hour
    registration: number; // registrations per hour
  };
  suspiciousActivityThresholds: {
    failedCheckouts: number;
    cartManipulation: number;
    orderVolume: number;
    newUserOrderValue: number;
  };
}

export class SecurityService {
  private events: SecurityEvent[] = [];
  private rules: SecurityRule[] = [];
  private blockedIPs: BlockedIP[] = [];
  private twoFactorAuth: TwoFactorAuth[] = [];
  private suspiciousActivities: SuspiciousActivity[] = [];
  private settings: SecuritySettings;
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeDefaultRules();
    this.loadFromStorage();
    this.startMonitoring();
  }

  private getDefaultSettings(): SecuritySettings {
    return {
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      require2FA: true,
      autoBlock: true,
      emailAlerts: true,
      alertEmail: 'security@flamestore.com',
      rateLimits: {
        api: 60,
        checkout: 10,
        registration: 5
      },
      suspiciousActivityThresholds: {
        failedCheckouts: 3,
        cartManipulation: 2,
        orderVolume: 10,
        newUserOrderValue: 1000
      }
    };
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'failed-login-attempts',
        name: 'Multiple Failed Login Attempts',
        type: 'login_attempts',
        enabled: true,
        threshold: 5,
        timeWindow: 15,
        action: 'block_ip',
        severity: 'high',
        conditions: { consecutive: true },
        createdAt: new Date(),
        triggerCount: 0
      },
      {
        id: 'unusual-order-volume',
        name: 'Unusual Order Volume',
        type: 'order_volume',
        enabled: true,
        threshold: 10,
        timeWindow: 60,
        action: 'flag',
        severity: 'medium',
        conditions: { newUser: true },
        createdAt: new Date(),
        triggerCount: 0
      },
      {
        id: 'cart-manipulation',
        name: 'Cart Total Manipulation',
        type: 'cart_manipulation',
        enabled: true,
        threshold: 2,
        timeWindow: 30,
        action: 'suspend_account',
        severity: 'critical',
        conditions: { priceChange: true },
        createdAt: new Date(),
        triggerCount: 0
      },
      {
        id: 'api-rate-limit',
        name: 'API Rate Limit Exceeded',
        type: 'api_rate_limit',
        enabled: true,
        threshold: 100,
        timeWindow: 1,
        action: 'block_ip',
        severity: 'medium',
        conditions: { endpoint: 'all' },
        createdAt: new Date(),
        triggerCount: 0
      },
      {
        id: 'suspicious-pattern',
        name: 'Suspicious Behavior Pattern',
        type: 'suspicious_pattern',
        enabled: true,
        threshold: 5,
        timeWindow: 60,
        action: 'email_alert',
        severity: 'high',
        conditions: { multipleIndicators: true },
        createdAt: new Date(),
        triggerCount: 0
      }
    ];
  }

  private loadFromStorage(): void {
    try {
      const storedEvents = localStorage.getItem('flame-security-events');
      if (storedEvents) {
        this.events = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
          resolvedAt: event.resolvedAt ? new Date(event.resolvedAt) : undefined
        }));
      }

      const storedRules = localStorage.getItem('flame-security-rules');
      if (storedRules) {
        this.rules = JSON.parse(storedRules).map((rule: any) => ({
          ...rule,
          createdAt: new Date(rule.createdAt),
          lastTriggered: rule.lastTriggered ? new Date(rule.lastTriggered) : undefined
        }));
      }

      const storedBlocked = localStorage.getItem('flame-blocked-ips');
      if (storedBlocked) {
        this.blockedIPs = JSON.parse(storedBlocked).map((ip: any) => ({
          ...ip,
          blockedAt: new Date(ip.blockedAt),
          expiresAt: ip.expiresAt ? new Date(ip.expiresAt) : undefined
        }));
      }

      const storedSettings = localStorage.getItem('flame-security-settings');
      if (storedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
      }

      const stored2FA = localStorage.getItem('flame-2fa-settings');
      if (stored2FA) {
        this.twoFactorAuth = JSON.parse(stored2FA).map((auth: any) => ({
          ...auth,
          setupAt: new Date(auth.setupAt),
          lastUsed: auth.lastUsed ? new Date(auth.lastUsed) : undefined
        }));
      }

      const storedSuspicious = localStorage.getItem('flame-suspicious-activities');
      if (storedSuspicious) {
        this.suspiciousActivities = JSON.parse(storedSuspicious).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
          reviewedAt: activity.reviewedAt ? new Date(activity.reviewedAt) : undefined
        }));
      }
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('flame-security-events', JSON.stringify(this.events));
      localStorage.setItem('flame-security-rules', JSON.stringify(this.rules));
      localStorage.setItem('flame-blocked-ips', JSON.stringify(this.blockedIPs));
      localStorage.setItem('flame-security-settings', JSON.stringify(this.settings));
      localStorage.setItem('flame-2fa-settings', JSON.stringify(this.twoFactorAuth));
      localStorage.setItem('flame-suspicious-activities', JSON.stringify(this.suspiciousActivities));
    } catch (error) {
      console.error('Error saving security data:', error);
    }
  }

  private startMonitoring(): void {
    // Clean up expired IP blocks
    setInterval(() => {
      this.cleanupExpiredBlocks();
    }, 60000); // Every minute

    // Clean up old events
    setInterval(() => {
      this.cleanupOldEvents();
    }, 3600000); // Every hour

    // Monitor rate limits
    setInterval(() => {
      this.cleanupRateLimitTracker();
    }, 60000); // Every minute
  }

  private cleanupExpiredBlocks(): void {
    const now = new Date();
    this.blockedIPs = this.blockedIPs.filter(ip => {
      return ip.permanent || !ip.expiresAt || ip.expiresAt > now;
    });
    this.saveToStorage();
  }

  private cleanupOldEvents(): void {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30); // Keep events for 30 days
    
    this.events = this.events.filter(event => event.timestamp > cutoff);
    this.saveToStorage();
  }

  private cleanupRateLimitTracker(): void {
    const now = Date.now();
    for (const [key, data] of this.rateLimitTracker.entries()) {
      if (now > data.resetTime) {
        this.rateLimitTracker.delete(key);
      }
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getClientIP(): string {
    // In a real implementation, this would get the actual client IP
    return '192.168.1.' + Math.floor(Math.random() * 255);
  }

  private getLocation(ip: string): string {
    // Mock location lookup - in production, use a GeoIP service
    const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Toronto, CA'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  // Public API Methods

  public logSecurityEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    description: string,
    details: Record<string, any> = {},
    userId?: string,
    userEmail?: string
  ): void {
    const ipAddress = this.getClientIP();
    const location = this.getLocation(ipAddress);

    const event: SecurityEvent = {
      id: this.generateId(),
      type,
      severity,
      userId,
      userEmail,
      ipAddress,
      userAgent: navigator.userAgent,
      location,
      description,
      details,
      timestamp: new Date(),
      resolved: false,
      actions: []
    };

    this.events.unshift(event);
    this.saveToStorage();

    // Check rules and take actions
    this.checkRulesAndTakeAction(event);

    // Send alert for critical events
    if (severity === 'critical') {
      this.sendSecurityAlert(event);
    }
  }

  public trackLoginAttempt(email: string, success: boolean, ipAddress?: string): void {
    const ip = ipAddress || this.getClientIP();
    
    if (this.isIPBlocked(ip)) {
      this.logSecurityEvent(
        'login_attempt',
        'high',
        `Login attempt from blocked IP: ${ip}`,
        { email, success: false, blocked: true },
        undefined,
        email
      );
      return;
    }

    this.logSecurityEvent(
      success ? 'login_attempt' : 'failed_login',
      success ? 'low' : 'medium',
      `${success ? 'Successful' : 'Failed'} login attempt for ${email}`,
      { email, success, ip },
      undefined,
      email
    );

    if (!success) {
      this.handleFailedLogin(email, ip);
    }
  }

  private handleFailedLogin(email: string, ip: string): void {
    const recentAttempts = this.getRecentFailedLogins(ip, 15); // Last 15 minutes
    
    if (recentAttempts.length >= this.settings.maxLoginAttempts) {
      this.blockIP(ip, `Too many failed login attempts for ${email}`, this.settings.lockoutDuration);
      
      this.logSecurityEvent(
        'ip_blocked',
        'high',
        `IP ${ip} blocked due to ${recentAttempts.length} failed login attempts`,
        { email, attempts: recentAttempts.length },
        undefined,
        email
      );
    }
  }

  public trackSuspiciousActivity(
    activityType: SuspiciousActivity['activityType'],
    details: Record<string, any>,
    userId?: string
  ): void {
    const ipAddress = this.getClientIP();
    const riskScore = this.calculateRiskScore(activityType, details);

    const activity: SuspiciousActivity = {
      id: this.generateId(),
      userId,
      ipAddress,
      activityType,
      riskScore,
      details,
      timestamp: new Date(),
      flagged: riskScore > 70,
      reviewed: false,
      actions: []
    };

    this.suspiciousActivities.unshift(activity);
    this.saveToStorage();

    if (activity.flagged) {
      this.logSecurityEvent(
        'suspicious_activity',
        riskScore > 90 ? 'critical' : 'high',
        `Suspicious activity detected: ${activityType}`,
        { ...details, riskScore },
        userId
      );
    }
  }

  private calculateRiskScore(activityType: SuspiciousActivity['activityType'], details: Record<string, any>): number {
    let score = 0;

    switch (activityType) {
      case 'multiple_failed_checkouts':
        score = Math.min(details.count * 20, 100);
        break;
      case 'cart_total_manipulation':
        score = 95;
        break;
      case 'unusual_order_volume':
        score = Math.min((details.orderCount / this.settings.suspiciousActivityThresholds.orderVolume) * 80, 100);
        break;
      case 'rapid_account_creation':
        score = Math.min(details.count * 25, 100);
        break;
      case 'payment_method_abuse':
        score = 90;
        break;
    }

    // Adjust score based on user history
    if (details.isNewUser) score += 10;
    if (details.hasVPN) score += 15;
    if (details.multipleDevices) score += 10;

    return Math.min(score, 100);
  }

  public checkRateLimit(endpoint: string, ipAddress?: string): boolean {
    const ip = ipAddress || this.getClientIP();
    const key = `${endpoint}:${ip}`;
    const now = Date.now();
    const limit = this.settings.rateLimits.api;

    if (this.isIPBlocked(ip)) {
      return false;
    }

    let tracker = this.rateLimitTracker.get(key);
    if (!tracker) {
      tracker = { count: 0, resetTime: now + 60000 }; // 1 minute window
      this.rateLimitTracker.set(key, tracker);
    }

    if (now > tracker.resetTime) {
      tracker.count = 0;
      tracker.resetTime = now + 60000;
    }

    tracker.count++;

    if (tracker.count > limit) {
      this.logSecurityEvent(
        'rate_limit_exceeded',
        'medium',
        `Rate limit exceeded for ${endpoint} from ${ip}`,
        { endpoint, count: tracker.count, limit },
        undefined,
        undefined
      );

      if (tracker.count > limit * 2) {
        this.blockIP(ip, `Rate limit severely exceeded for ${endpoint}`, 60);
      }

      return false;
    }

    return true;
  }

  public blockIP(ip: string, reason: string, durationMinutes?: number, permanent: boolean = false): void {
    const existing = this.blockedIPs.find(blocked => blocked.ip === ip);
    
    if (existing) {
      existing.attempts++;
      existing.reason = reason;
      existing.blockedAt = new Date();
      if (durationMinutes) {
        existing.expiresAt = new Date(Date.now() + durationMinutes * 60000);
      }
      existing.permanent = permanent;
    } else {
      const blockedIP: BlockedIP = {
        ip,
        reason,
        blockedAt: new Date(),
        blockedBy: 'System',
        expiresAt: durationMinutes ? new Date(Date.now() + durationMinutes * 60000) : undefined,
        permanent,
        attempts: 1
      };
      this.blockedIPs.push(blockedIP);
    }

    this.saveToStorage();
  }

  public unblockIP(ip: string): boolean {
    const index = this.blockedIPs.findIndex(blocked => blocked.ip === ip);
    if (index !== -1) {
      this.blockedIPs.splice(index, 1);
      this.saveToStorage();
      
      this.logSecurityEvent(
        'ip_blocked',
        'low',
        `IP ${ip} unblocked manually`,
        { action: 'unblock' }
      );
      
      return true;
    }
    return false;
  }

  public isIPBlocked(ip: string): boolean {
    const blocked = this.blockedIPs.find(blocked => blocked.ip === ip);
    if (!blocked) return false;

    if (blocked.permanent) return true;
    if (blocked.expiresAt && blocked.expiresAt > new Date()) return true;

    return false;
  }

  public suspendAccount(userId: string, reason: string): void {
    this.logSecurityEvent(
      'account_suspended',
      'high',
      `Account suspended: ${reason}`,
      { userId, reason },
      userId
    );

    // In a real implementation, this would update the user's status in the database
    console.log(`Account ${userId} suspended: ${reason}`);
  }

  public setup2FA(userId: string): { secret: string; qrCode: string; backupCodes: string[] } {
    const secret = this.generate2FASecret();
    const backupCodes = this.generateBackupCodes();
    
    const auth: TwoFactorAuth = {
      userId,
      secret,
      enabled: false, // Will be enabled after verification
      backupCodes,
      setupAt: new Date()
    };

    const existingIndex = this.twoFactorAuth.findIndex(a => a.userId === userId);
    if (existingIndex !== -1) {
      this.twoFactorAuth[existingIndex] = auth;
    } else {
      this.twoFactorAuth.push(auth);
    }

    this.saveToStorage();

    return {
      secret,
      qrCode: this.generateQRCode(secret, userId),
      backupCodes
    };
  }

  public verify2FA(userId: string, token: string): boolean {
    const auth = this.twoFactorAuth.find(a => a.userId === userId);
    if (!auth) return false;

    // In a real implementation, this would use a proper TOTP library
    const isValid = this.verifyTOTP(auth.secret, token) || auth.backupCodes.includes(token);

    if (isValid) {
      auth.enabled = true;
      auth.lastUsed = new Date();
      
      // Remove backup code if used
      if (auth.backupCodes.includes(token)) {
        auth.backupCodes = auth.backupCodes.filter(code => code !== token);
      }
      
      this.saveToStorage();
    }

    return isValid;
  }

  private generate2FASecret(): string {
    return Array.from({ length: 32 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');
  }

  private generateBackupCodes(): string[] {
    return Array.from({ length: 10 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
  }

  private generateQRCode(secret: string, userId: string): string {
    // In a real implementation, this would generate an actual QR code
    return `otpauth://totp/FlameStore:${userId}?secret=${secret}&issuer=FlameStore`;
  }

  private verifyTOTP(secret: string, token: string): boolean {
    // Mock TOTP verification - in production, use a proper library like speakeasy
    return token === '123456' || token.length === 6;
  }

  private checkRulesAndTakeAction(event: SecurityEvent): void {
    for (const rule of this.rules.filter(r => r.enabled)) {
      if (this.doesEventMatchRule(event, rule)) {
        rule.triggerCount++;
        rule.lastTriggered = new Date();
        
        this.executeRuleAction(rule, event);
        this.saveToStorage();
      }
    }
  }

  private doesEventMatchRule(event: SecurityEvent, rule: SecurityRule): boolean {
    // Simple rule matching - in production, this would be more sophisticated
    const eventMap = {
      'login_attempts': ['failed_login'],
      'order_volume': ['suspicious_activity'],
      'cart_manipulation': ['suspicious_activity'],
      'api_rate_limit': ['rate_limit_exceeded'],
      'suspicious_pattern': ['suspicious_activity']
    };

    return eventMap[rule.type]?.includes(event.type) || false;
  }

  private executeRuleAction(rule: SecurityRule, event: SecurityEvent): void {
    switch (rule.action) {
      case 'block_ip':
        this.blockIP(event.ipAddress, `Rule triggered: ${rule.name}`, rule.timeWindow);
        break;
      case 'suspend_account':
        if (event.userId) {
          this.suspendAccount(event.userId, `Rule triggered: ${rule.name}`);
        }
        break;
      case 'email_alert':
        this.sendSecurityAlert(event);
        break;
      case 'require_2fa':
        // Mark that user needs 2FA
        break;
      case 'flag':
        // Already flagged by logging the event
        break;
    }
  }

  private sendSecurityAlert(event: SecurityEvent): void {
    if (!this.settings.emailAlerts) return;

    // In a real implementation, this would send an actual email
    console.log(`Security Alert Email sent to ${this.settings.alertEmail}:`, {
      subject: `Security Alert: ${event.type}`,
      body: `
        Security Event Details:
        Type: ${event.type}
        Severity: ${event.severity}
        Description: ${event.description}
        IP Address: ${event.ipAddress}
        Location: ${event.location}
        Time: ${event.timestamp.toISOString()}
        
        Please review this event in the Security Dashboard.
      `
    });
  }

  // Data retrieval methods

  public getSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(0, limit);
  }

  public getSecurityRules(): SecurityRule[] {
    return this.rules;
  }

  public getBlockedIPs(): BlockedIP[] {
    return this.blockedIPs;
  }

  public getSuspiciousActivities(): SuspiciousActivity[] {
    return this.suspiciousActivities;
  }

  public getSettings(): SecuritySettings {
    return this.settings;
  }

  public updateSettings(settings: Partial<SecuritySettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveToStorage();
  }

  public getRecentFailedLogins(ip: string, minutes: number): SecurityEvent[] {
    const cutoff = new Date(Date.now() - minutes * 60000);
    return this.events.filter(event => 
      event.type === 'failed_login' && 
      event.ipAddress === ip && 
      event.timestamp > cutoff
    );
  }

  public getSecurityStatistics(): {
    totalEvents: number;
    criticalEvents: number;
    blockedIPs: number;
    suspiciousActivities: number;
    last24Hours: {
      events: number;
      failedLogins: number;
      blockedIPs: number;
    };
  } {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp > last24Hours);

    return {
      totalEvents: this.events.length,
      criticalEvents: this.events.filter(e => e.severity === 'critical').length,
      blockedIPs: this.blockedIPs.length,
      suspiciousActivities: this.suspiciousActivities.filter(a => a.flagged).length,
      last24Hours: {
        events: recentEvents.length,
        failedLogins: recentEvents.filter(e => e.type === 'failed_login').length,
        blockedIPs: this.blockedIPs.filter(ip => ip.blockedAt > last24Hours).length
      }
    };
  }

  public resolveSecurityEvent(eventId: string, resolvedBy: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      event.resolvedAt = new Date();
      event.resolvedBy = resolvedBy;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public addSecurityRule(rule: Omit<SecurityRule, 'id' | 'createdAt' | 'triggerCount'>): SecurityRule {
    const newRule: SecurityRule = {
      ...rule,
      id: this.generateId(),
      createdAt: new Date(),
      triggerCount: 0
    };

    this.rules.push(newRule);
    this.saveToStorage();
    return newRule;
  }

  public updateSecurityRule(id: string, updates: Partial<SecurityRule>): boolean {
    const index = this.rules.findIndex(r => r.id === id);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public deleteSecurityRule(id: string): boolean {
    const index = this.rules.findIndex(r => r.id === id);
    if (index !== -1) {
      this.rules.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

export const securityService = new SecurityService();