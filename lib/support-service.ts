import { emailService } from './email-service';

interface SupportMessage {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  topic: string;
  message: string;
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo: string | null;
  assignedAdmin: string | null;
  createdAt: string;
  updatedAt: string;
  lastReply: string | null;
  replies: SupportReply[];
  attachments: SupportAttachment[];
  tags: string[];
}

interface SupportReply {
  id: string;
  messageId: string;
  authorType: 'customer' | 'admin';
  authorId: string;
  authorName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  attachments: SupportAttachment[];
}

interface SupportAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

interface SupportNotification {
  id: string;
  type: 'new_message' | 'reply' | 'status_change' | 'assignment';
  messageId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export class SupportService {
  private messages: SupportMessage[] = [];
  private notifications: SupportNotification[] = [];
  private ticketCounter = 1;

  constructor() {
    this.loadMessages();
  }

  private loadMessages() {
    // Load messages from storage or database
    const stored = localStorage.getItem('support-messages');
    if (stored) {
      this.messages = JSON.parse(stored);
      this.ticketCounter = this.messages.length + 1;
    }
  }

  private saveMessages() {
    localStorage.setItem('support-messages', JSON.stringify(this.messages));
  }

  private generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const ticketNum = String(this.ticketCounter).padStart(3, '0');
    this.ticketCounter++;
    return `TK-${year}-${ticketNum}`;
  }

  async createSupportMessage(data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    topic: string;
    message: string;
    attachments?: SupportAttachment[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }): Promise<SupportMessage> {
    const message: SupportMessage = {
      id: Date.now().toString(),
      ticketNumber: this.generateTicketNumber(),
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      subject: data.subject,
      topic: data.topic,
      message: data.message,
      status: 'new',
      priority: data.priority || 'normal',
      assignedTo: null,
      assignedAdmin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastReply: null,
      replies: [],
      attachments: data.attachments || [],
      tags: []
    };

    this.messages.push(message);
    this.saveMessages();

    // Send email notification to customer
    await this.sendCustomerConfirmation(message);

    // Send email notification to admin
    await this.sendAdminNotification(message);

    // Create internal notification
    await this.createNotification({
      type: 'new_message',
      messageId: message.id,
      recipientId: 'admin',
      content: `New support request: ${message.subject}`
    });

    return message;
  }

  async addReply(messageId: string, reply: {
    authorType: 'customer' | 'admin';
    authorId: string;
    authorName: string;
    content: string;
    isInternal?: boolean;
    attachments?: SupportAttachment[];
  }): Promise<SupportReply> {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    const newReply: SupportReply = {
      id: Date.now().toString(),
      messageId: messageId,
      authorType: reply.authorType,
      authorId: reply.authorId,
      authorName: reply.authorName,
      content: reply.content,
      isInternal: reply.isInternal || false,
      createdAt: new Date().toISOString(),
      attachments: reply.attachments || []
    };

    message.replies.push(newReply);
    message.lastReply = newReply.createdAt;
    message.updatedAt = new Date().toISOString();

    // Update status if admin replied
    if (reply.authorType === 'admin' && !reply.isInternal) {
      message.status = 'open';
    }

    this.saveMessages();

    // Send email notification
    if (!reply.isInternal) {
      if (reply.authorType === 'admin') {
        await this.sendCustomerReplyNotification(message, newReply);
      } else {
        await this.sendAdminReplyNotification(message, newReply);
      }
    }

    // Create internal notification
    await this.createNotification({
      type: 'reply',
      messageId: messageId,
      recipientId: reply.authorType === 'admin' ? message.customerId : 'admin',
      content: `New reply on ticket ${message.ticketNumber}`
    });

    return newReply;
  }

  async updateMessageStatus(messageId: string, status: SupportMessage['status'], adminId?: string): Promise<void> {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    const oldStatus = message.status;
    message.status = status;
    message.updatedAt = new Date().toISOString();

    this.saveMessages();

    // Send email notification if status changed to resolved
    if (status === 'resolved' && oldStatus !== 'resolved') {
      await this.sendCustomerResolutionNotification(message);
    }

    // Create internal notification
    await this.createNotification({
      type: 'status_change',
      messageId: messageId,
      recipientId: message.customerId,
      content: `Ticket ${message.ticketNumber} status changed to ${status}`
    });
  }

  async assignMessage(messageId: string, adminId: string, adminName: string): Promise<void> {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    message.assignedTo = adminId;
    message.assignedAdmin = adminName;
    message.updatedAt = new Date().toISOString();

    this.saveMessages();

    // Create internal notification
    await this.createNotification({
      type: 'assignment',
      messageId: messageId,
      recipientId: adminId,
      content: `Ticket ${message.ticketNumber} has been assigned to you`
    });
  }

  async getMessages(filters?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    topic?: string;
    customerId?: string;
  }): Promise<SupportMessage[]> {
    let filtered = [...this.messages];

    if (filters) {
      if (filters.status) {
        filtered = filtered.filter(m => m.status === filters.status);
      }
      if (filters.priority) {
        filtered = filtered.filter(m => m.priority === filters.priority);
      }
      if (filters.assignedTo) {
        filtered = filtered.filter(m => m.assignedTo === filters.assignedTo);
      }
      if (filters.topic) {
        filtered = filtered.filter(m => m.topic === filters.topic);
      }
      if (filters.customerId) {
        filtered = filtered.filter(m => m.customerId === filters.customerId);
      }
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getMessage(id: string): Promise<SupportMessage | null> {
    return this.messages.find(m => m.id === id) || null;
  }

  async getMessageByTicketNumber(ticketNumber: string): Promise<SupportMessage | null> {
    return this.messages.find(m => m.ticketNumber === ticketNumber) || null;
  }

  async getCustomerMessages(customerId: string): Promise<SupportMessage[]> {
    return this.messages
      .filter(m => m.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getStatistics(): Promise<{
    total: number;
    new: number;
    open: number;
    pending: number;
    resolved: number;
    avgResponseTime: number;
    todayMessages: number;
  }> {
    const today = new Date().toDateString();
    
    return {
      total: this.messages.length,
      new: this.messages.filter(m => m.status === 'new').length,
      open: this.messages.filter(m => m.status === 'open').length,
      pending: this.messages.filter(m => m.status === 'pending').length,
      resolved: this.messages.filter(m => m.status === 'resolved').length,
      avgResponseTime: this.calculateAvgResponseTime(),
      todayMessages: this.messages.filter(m => 
        new Date(m.createdAt).toDateString() === today
      ).length
    };
  }

  private calculateAvgResponseTime(): number {
    const messagesWithReplies = this.messages.filter(m => m.replies.length > 0);
    if (messagesWithReplies.length === 0) return 0;

    const totalTime = messagesWithReplies.reduce((sum, message) => {
      const firstReply = message.replies.find(r => r.authorType === 'admin');
      if (firstReply) {
        const responseTime = new Date(firstReply.createdAt).getTime() - new Date(message.createdAt).getTime();
        return sum + responseTime;
      }
      return sum;
    }, 0);

    return Math.round(totalTime / messagesWithReplies.length / (1000 * 60 * 60)); // Convert to hours
  }

  private async sendCustomerConfirmation(message: SupportMessage): Promise<void> {
    await emailService.sendEmail({
      to: message.customerEmail,
      subject: `Support Request Confirmation - ${message.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Support Request Received</h1>
          </div>
          
          <div style="padding: 20px; background-color: white;">
            <h2 style="color: #333;">Hi ${message.customerName},</h2>
            <p>Thank you for contacting our support team. We've received your request and will respond as soon as possible.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0;">Request Details</h3>
              <p><strong>Ticket Number:</strong> ${message.ticketNumber}</p>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Topic:</strong> ${message.topic}</p>
              <p><strong>Priority:</strong> ${message.priority}</p>
              <p><strong>Created:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0;">Your Message:</h4>
              <p>${message.message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p>You can track the status of your request in your account dashboard.</p>
              <p>Our typical response time is 4-6 hours during business hours.</p>
            </div>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Thank you for choosing Flame Fashion!</p>
          </div>
        </div>
      `
    });
  }

  private async sendAdminNotification(message: SupportMessage): Promise<void> {
    await emailService.sendEmail({
      to: 'support@flamestore.com',
      subject: `New Support Request - ${message.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #007bff; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Support Request</h1>
          </div>
          
          <div style="padding: 20px; background-color: white;">
            <h2 style="color: #333;">Request Details</h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>Ticket Number:</strong> ${message.ticketNumber}</p>
              <p><strong>Customer:</strong> ${message.customerName} (${message.customerEmail})</p>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Topic:</strong> ${message.topic}</p>
              <p><strong>Priority:</strong> ${message.priority}</p>
              <p><strong>Created:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
            </div>
            
            <h3>Message:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p>${message.message}</p>
            </div>
            
            ${message.attachments.length > 0 ? `
              <h3>Attachments:</h3>
              <ul>
                ${message.attachments.map(att => `<li>${att.filename} (${this.formatFileSize(att.size)})</li>`).join('')}
              </ul>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="/admin/support?ticket=${message.ticketNumber}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View in Admin Panel
              </a>
            </div>
          </div>
        </div>
      `
    });
  }

  private async sendCustomerReplyNotification(message: SupportMessage, reply: SupportReply): Promise<void> {
    await emailService.sendEmail({
      to: message.customerEmail,
      subject: `Support Reply - ${message.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #28a745; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Support Team Reply</h1>
          </div>
          
          <div style="padding: 20px; background-color: white;">
            <h2 style="color: #333;">Hi ${message.customerName},</h2>
            <p>Our support team has replied to your request.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0;">Ticket: ${message.ticketNumber}</h3>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Reply from:</strong> ${reply.authorName}</p>
              <p><strong>Reply time:</strong> ${new Date(reply.createdAt).toLocaleString()}</p>
            </div>
            
            <h3>Reply:</h3>
            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
              <div>${reply.content}</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="/profile/support" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Full Conversation
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p>If you have any follow-up questions, please reply through your account dashboard.</p>
            </div>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Thank you for choosing Flame Fashion!</p>
          </div>
        </div>
      `
    });
  }

  private async sendAdminReplyNotification(message: SupportMessage, reply: SupportReply): Promise<void> {
    if (message.assignedTo) {
      await emailService.sendEmail({
        to: `admin-${message.assignedTo}@flamestore.com`,
        subject: `Customer Reply - ${message.ticketNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ffc107; padding: 20px; text-align: center;">
              <h1 style="color: #333; margin: 0;">Customer Reply</h1>
            </div>
            
            <div style="padding: 20px; background-color: white;">
              <h2 style="color: #333;">Customer Response</h2>
              
              <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Ticket:</strong> ${message.ticketNumber}</p>
                <p><strong>Customer:</strong> ${message.customerName} (${message.customerEmail})</p>
                <p><strong>Subject:</strong> ${message.subject}</p>
                <p><strong>Reply time:</strong> ${new Date(reply.createdAt).toLocaleString()}</p>
              </div>
              
              <h3>Customer's Reply:</h3>
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
                <div>${reply.content}</div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="/admin/support?ticket=${message.ticketNumber}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View and Reply
                </a>
              </div>
            </div>
          </div>
        `
      });
    }
  }

  private async sendCustomerResolutionNotification(message: SupportMessage): Promise<void> {
    await emailService.sendEmail({
      to: message.customerEmail,
      subject: `Support Request Resolved - ${message.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #28a745; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Support Request Resolved</h1>
          </div>
          
          <div style="padding: 20px; background-color: white;">
            <h2 style="color: #333;">Hi ${message.customerName},</h2>
            <p>We're pleased to inform you that your support request has been resolved.</p>
            
            <div style="background-color: #d4edda; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #28a745;">
              <h3 style="margin: 0 0 10px 0;">Ticket: ${message.ticketNumber}</h3>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Status:</strong> Resolved</p>
              <p><strong>Resolved on:</strong> ${new Date(message.updatedAt).toLocaleString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="/profile/support" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Full Conversation
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p>If you need further assistance, please don't hesitate to create a new support request.</p>
              <p>Thank you for giving us the opportunity to help you!</p>
            </div>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Thank you for choosing Flame Fashion!</p>
          </div>
        </div>
      `
    });
  }

  private async createNotification(data: {
    type: SupportNotification['type'];
    messageId: string;
    recipientId: string;
    content: string;
  }): Promise<void> {
    const notification: SupportNotification = {
      id: Date.now().toString(),
      type: data.type,
      messageId: data.messageId,
      recipientId: data.recipientId,
      content: data.content,
      createdAt: new Date().toISOString(),
      read: false
    };

    this.notifications.push(notification);
    localStorage.setItem('support-notifications', JSON.stringify(this.notifications));
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async searchMessages(query: string): Promise<SupportMessage[]> {
    const searchTerm = query.toLowerCase();
    return this.messages.filter(message => 
      message.subject.toLowerCase().includes(searchTerm) ||
      message.customerName.toLowerCase().includes(searchTerm) ||
      message.customerEmail.toLowerCase().includes(searchTerm) ||
      message.message.toLowerCase().includes(searchTerm) ||
      message.ticketNumber.toLowerCase().includes(searchTerm) ||
      message.topic.toLowerCase().includes(searchTerm)
    );
  }

  async addTags(messageId: string, tags: string[]): Promise<void> {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    message.tags = [...new Set([...message.tags, ...tags])];
    message.updatedAt = new Date().toISOString();
    this.saveMessages();
  }

  async removeTags(messageId: string, tags: string[]): Promise<void> {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    message.tags = message.tags.filter(tag => !tags.includes(tag));
    message.updatedAt = new Date().toISOString();
    this.saveMessages();
  }

  async getMessagesByTag(tag: string): Promise<SupportMessage[]> {
    return this.messages.filter(message => message.tags.includes(tag));
  }

  async exportMessages(format: 'csv' | 'json' = 'csv'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(this.messages, null, 2);
    }
    
    // CSV format
    const headers = ['Ticket Number', 'Customer Name', 'Customer Email', 'Subject', 'Topic', 'Status', 'Priority', 'Created At', 'Updated At', 'Assigned To'];
    const rows = this.messages.map(message => [
      message.ticketNumber,
      message.customerName,
      message.customerEmail,
      message.subject,
      message.topic,
      message.status,
      message.priority,
      message.createdAt,
      message.updatedAt,
      message.assignedAdmin || 'Unassigned'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const supportService = new SupportService();