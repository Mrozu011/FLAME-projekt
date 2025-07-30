
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  lastLogin: Date;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

interface AuthContext {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;
  private roles: Role[] = [];
  private permissions: Permission[] = [];
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.initializeRolesAndPermissions();
    this.loadUserFromStorage();
  }

  private initializeRolesAndPermissions() {
    this.permissions = [
      { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to admin dashboard', module: 'Dashboard' },
      { id: 'users.view', name: 'View Users', description: 'View user list and details', module: 'Users' },
      { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', module: 'Users' },
      { id: 'users.edit', name: 'Edit Users', description: 'Edit user information', module: 'Users' },
      { id: 'users.delete', name: 'Delete Users', description: 'Delete user accounts', module: 'Users' },
      { id: 'users.roles', name: 'Manage User Roles', description: 'Assign roles to users', module: 'Users' },
      { id: 'products.view', name: 'View Products', description: 'View product catalog', module: 'Products' },
      { id: 'products.create', name: 'Create Products', description: 'Add new products', module: 'Products' },
      { id: 'products.edit', name: 'Edit Products', description: 'Modify product details', module: 'Products' },
      { id: 'products.delete', name: 'Delete Products', description: 'Remove products', module: 'Products' },
      { id: 'products.publish', name: 'Publish Products', description: 'Control product visibility', module: 'Products' },
      { id: 'orders.view', name: 'View Orders', description: 'View order list and details', module: 'Orders' },
      { id: 'orders.edit', name: 'Edit Orders', description: 'Modify order information', module: 'Orders' },
      { id: 'orders.status', name: 'Change Order Status', description: 'Update order status', module: 'Orders' },
      { id: 'orders.refund', name: 'Process Refunds', description: 'Handle order refunds', module: 'Orders' },
      { id: 'content.view', name: 'View Content', description: 'Access content management', module: 'Content' },
      { id: 'content.edit', name: 'Edit Content', description: 'Modify site content', module: 'Content' },
      { id: 'content.publish', name: 'Publish Content', description: 'Control content visibility', module: 'Content' },
      { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics and reports', module: 'Analytics' },
      { id: 'analytics.export', name: 'Export Analytics', description: 'Export reports and data', module: 'Analytics' },
      { id: 'system.settings', name: 'System Settings', description: 'Access system configuration', module: 'System' },
      { id: 'system.backup', name: 'System Backup', description: 'Manage system backups', module: 'System' },
      { id: 'system.logs', name: 'View System Logs', description: 'Access system logs', module: 'System' }
    ];

    this.roles = [
      {
        id: 'super-admin',
        name: 'Super Admin',
        description: 'Full access to all system functions',
        permissions: this.permissions.map(p => p.id),
        isDefault: true
      },
      {
        id: 'admin',
        name: 'Admin',
        description: 'Administrative access with some restrictions',
        permissions: [
          'dashboard.view',
          'users.view', 'users.create', 'users.edit', 'users.roles',
          'products.view', 'products.create', 'products.edit', 'products.publish',
          'orders.view', 'orders.edit', 'orders.status', 'orders.refund',
          'content.view', 'content.edit', 'content.publish',
          'analytics.view', 'analytics.export'
        ],
        isDefault: true
      },
      {
        id: 'moderator',
        name: 'Moderator',
        description: 'Limited access to orders and content management',
        permissions: [
          'dashboard.view',
          'users.view',
          'products.view',
          'orders.view', 'orders.edit', 'orders.status',
          'content.view', 'content.edit',
          'analytics.view'
        ],
        isDefault: true
      },
      {
        id: 'customer',
        name: 'Customer',
        description: 'Basic customer access',
        permissions: [],
        isDefault: true
      }
    ];
  }

  private loadUserFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userData && token) {
          if (this.validateToken(token)) {
            this.currentUser = JSON.parse(userData);
            this.token = token;
          } else {
            this.clearStoredAuth();
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.clearStoredAuth();
      }
    }
  }

  private clearStoredAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.currentUser = null;
    this.token = null;
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      this.retryCount = 0;
      return await this.attemptLogin(email, password);
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed due to network error. Please try again.' 
      };
    }
  }

  private async attemptLogin(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      const mockUsers = [
        {
          id: '1',
          email: 'admin@flamestore.com',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'super-admin',
          status: 'active' as const,
          permissions: this.getRolePermissions('super-admin'),
          lastLogin: new Date()
        },
        {
          id: '2',
          email: 'manager@flamestore.com',
          firstName: 'Store',
          lastName: 'Manager',
          role: 'admin',
          status: 'active' as const,
          permissions: this.getRolePermissions('admin'),
          lastLogin: new Date()
        },
        {
          id: '3',
          email: 'moderator@flamestore.com',
          firstName: 'Content',
          lastName: 'Moderator',
          role: 'moderator',
          status: 'active' as const,
          permissions: this.getRolePermissions('moderator'),
          lastLogin: new Date()
        }
      ];

      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        this.logSecurityEvent('failed_login_attempt', { email, reason: 'user_not_found' });
        return { success: false, message: 'Invalid email or password' };
      }

      if (user.status !== 'active') {
        this.logSecurityEvent('failed_login_attempt', { email, reason: 'account_inactive' });
        return { success: false, message: 'Account is not active' };
      }

      if (password !== 'password123') {
        this.logSecurityEvent('failed_login_attempt', { email, reason: 'invalid_password' });
        return { success: false, message: 'Invalid email or password' };
      }

      this.currentUser = user;
      this.token = this.generateSecureToken(user);
      this.saveUserToStorage();

      this.logSecurityEvent('successful_login', { userId: user.id, email });

      return { success: true, message: 'Login successful', user };
    } catch (error) {
      console.error('Authentication error:', error);

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying login (${this.retryCount}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.attemptLogin(email, password);
      }

      return { success: false, message: 'Authentication service temporarily unavailable' };
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateSecureToken(user: User): string {
    try {
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        timestamp: Date.now(),
        sessionId: this.generateSessionId()
      };

      return btoa(JSON.stringify(payload));
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validateToken(token: string): boolean {
    if (!token) return false;

    try {
      const decoded = JSON.parse(atob(token));
      const now = Date.now();
      const tokenAge = now - decoded.timestamp;

      const isValid = tokenAge < 24 * 60 * 60 * 1000;

      if (!isValid) {
        this.logSecurityEvent('token_expired', { userId: decoded.userId });
      }

      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logSecurityEvent('invalid_token_attempt', { error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }

  async secureApiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const maxRetries = 3;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string> || {}),
        };

        if (this.token) {
          headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (response.status === 401) {
          this.logSecurityEvent('unauthorized_api_request', { url, status: response.status });
          if (await this.refreshToken()) {
            continue;
          } else {
            this.logout();
            throw new Error('Authentication expired. Please log in again.');
          }
        }

        if (response.status === 403) {
          this.logSecurityEvent('forbidden_api_request', { url, status: response.status });
          throw new Error('Access denied. Insufficient permissions.');
        }

        if (response.status === 404) {
          throw new Error('Requested resource not found');
        }

        if (response.status >= 500) {
          throw new Error(`Server error (${response.status}). Please try again later.`);
        }

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Request failed: ${response.status} - ${errorData}`);
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        console.error(`API request attempt ${attempt}/${maxRetries} failed:`, error);

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
    this.saveUserToStorage();
  }

  getAuthContext(): AuthContext {
    return {
      user: this.currentUser,
      token: this.token,
      isAuthenticated: !!this.currentUser,
      hasPermission: (permission: string) => this.hasPermission(permission),
      hasRole: (role: string) => this.hasRole(role),
      hasAnyPermission: (permissions: string[]) => this.hasAnyPermission(permissions),
      hasAllPermissions: (permissions: string[]) => this.hasAllPermissions(permissions)
    };
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === role;
  }

  hasAnyPermission(permissions: string[]): boolean {
    if (!this.currentUser) return false;
    return permissions.some(permission => this.currentUser!.permissions.includes(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    if (!this.currentUser) return false;
    return permissions.every(permission => this.currentUser!.permissions.includes(permission));
  }

  canAccessRoute(route: string): boolean {
    if (!this.currentUser) return false;

    const routePermissions: Record<string, string[]> = {
      '/admin': ['dashboard.view'],
      '/admin/users': ['users.view'],
      '/admin/users/create': ['users.create'],
      '/admin/users/roles': ['users.roles'],
      '/admin/products': ['products.view'],
      '/admin/products/create': ['products.create'],
      '/admin/orders': ['orders.view'],
      '/admin/content': ['content.view'],
      '/admin/analytics': ['analytics.view'],
      '/admin/settings': ['system.settings']
    };

    const requiredPermissions = routePermissions[route];
    if (!requiredPermissions) return true; 

    return this.hasAnyPermission(requiredPermissions);
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getRoles(): Role[] {
    return this.roles;
  }

  getPermissions(): Permission[] {
    return this.permissions;
  }

  getRolePermissions(roleId: string): string[] {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.permissions : [];
  }

  private generateToken(user: User): string {
    return btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    }));
  }

  async refreshToken(): Promise<boolean> {
    if (!this.currentUser || !this.token) return false;

    if (this.validateToken(this.token)) {
      this.token = this.generateToken(this.currentUser);
      this.saveUserToStorage();
      return true;
    }

    return false;
  }

  async updateUserRole(userId: string, newRole: string): Promise<boolean> {
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser.role = newRole;
      this.currentUser.permissions = this.getRolePermissions(newRole);
      this.saveUserToStorage();
      return true;
    }
    return false;
  }

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const newRole: Role = {
      ...role,
      id: Date.now().toString()
    };

    this.roles.push(newRole);
    return newRole;
  }

  async updateRole(roleId: string, updates: Partial<Role>): Promise<boolean> {
    const roleIndex = this.roles.findIndex(r => r.id === roleId);
    if (roleIndex !== -1) {
      this.roles[roleIndex] = { ...this.roles[roleIndex], ...updates };
      return true;
    }
    return false;
  }

  async deleteRole(roleId: string): Promise<boolean> {
    const roleIndex = this.roles.findIndex(r => r.id === roleId);
    if (roleIndex !== -1 && !this.roles[roleIndex].isDefault) {
      this.roles.splice(roleIndex, 1);
      return true;
    }
    return false;
  }

  requireAuth(requiredPermissions: string[] = []): (req: any, res: any, next: any) => void {
    return (req: any, res: any, next: any) => {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token || !this.validateToken(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = JSON.parse(atob(token));
      const userPermissions = this.getRolePermissions(decoded.role);

      if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.some(permission => 
          userPermissions.includes(permission)
        );

        if (!hasPermission) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      req.user = decoded;
      next();
    };
  }

  canManageUser(targetUserId: string, action: string): boolean {
    if (!this.currentUser) return false;

    if (this.hasRole('super-admin')) return true;

    if (this.hasRole('admin') && this.hasPermission(`users.${action}`)) {
      return true;
    }

    if (this.currentUser.id === targetUserId && ['edit', 'view'].includes(action)) {
      return true;
    }

    return false;
  }

  logSecurityEvent(event: string, details: any = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: this.currentUser?.id || 'anonymous',
      userEmail: this.currentUser?.email || 'unknown',
      event,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ip: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      sessionId: this.getSessionId()
    };

    console.log('Security Event:', logEntry);

    if (['failed_login_attempt', 'unauthorized_api_request', 'token_expired'].includes(event)) {
      this.storeSecurityLog(logEntry);
    }
  }

  private getSessionId(): string {
    if (this.token) {
      try {
        const decoded = JSON.parse(atob(this.token));
        return decoded.sessionId || 'unknown';
      } catch {
        return 'unknown';
      }
    }
    return 'no-session';
  }

  private storeSecurityLog(logEntry: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const existingLogs = JSON.parse(localStorage.getItem('security-logs') || '[]');
      existingLogs.push(logEntry);

      const recentLogs = existingLogs.slice(-100);
      localStorage.setItem('security-logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to store security log:', error);
    }
  }

  getSecurityLogs(): any[] {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('security-logs') || '[]');
    } catch {
      return [];
    }
  }

  clearSecurityLogs(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('security-logs');
  }

  private saveUserToStorage() {
    if (typeof window !== 'undefined') {
      if (this.currentUser && this.token) {
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        localStorage.setItem('token', this.token);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }
}

export const authService = new AuthService();
