interface EmailConfig {
  service: 'sendgrid' | 'smtp';
  apiKey?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  password?: string;
  from: string;
  fromName: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
  templateId?: string;
  templateData?: Record<string, any>;
}

export class EmailService {
  private config: EmailConfig;
  private templates: Record<string, EmailTemplate>;

  constructor(config: EmailConfig) {
    this.config = config;
    this.templates = this.getDefaultTemplates();
  }

  private getDefaultTemplates(): Record<string, EmailTemplate> {
    return {
      'order-confirmation': {
        subject: 'Order Confirmation - #{orderNumber}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <h1 style="color: #333; margin: 0;">Order Confirmation</h1>
            </div>
            
            <div style="padding: 20px; background-color: white;">
              <h2 style="color: #333;">Hi {{customerName}},</h2>
              <p>Thank you for your order! We're excited to get your items to you.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0;">Order Details</h3>
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Order Date:</strong> {{orderDate}}</p>
                <p><strong>Total:</strong> {{orderTotal}}</p>
              </div>
              
              <h3>Items Ordered:</h3>
              <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
                {{#each items}}
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>{{name}}</strong><br>
                      <small>{{description}}</small><br>
                      <small>Quantity: {{quantity}}</small>
                    </div>
                    <div style="text-align: right;">
                      <strong>{{price}}</strong>
                    </div>
                  </div>
                </div>
                {{/each}}
              </div>
              
              <h3>Shipping Information:</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <p><strong>Shipping Address:</strong></p>
                <p>{{shippingAddress}}</p>
                <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p>We'll send you another email with tracking information once your order ships.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
              </div>
            </div>
            
            <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">Thank you for shopping with us!</p>
              <p style="margin: 5px 0 0 0;">{{storeName}}</p>
            </div>
          </div>
        `
      },
      
      'order-shipped': {
        subject: 'Your Order Has Shipped - #{orderNumber}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #28a745; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Your Order Has Shipped!</h1>
            </div>
            
            <div style="padding: 20px; background-color: white;">
              <h2 style="color: #333;">Hi {{customerName}},</h2>
              <p>Great news! Your order is on its way.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0;">Tracking Information</h3>
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
                <p><strong>Carrier:</strong> {{carrier}}</p>
                <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackingUrl}}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Track Your Package
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p>We'll continue to keep you updated on your order's progress.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
              </div>
            </div>
            
            <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">Thank you for shopping with us!</p>
              <p style="margin: 5px 0 0 0;">{{storeName}}</p>
            </div>
          </div>
        `
      },
      
      'admin-new-order': {
        subject: 'New Order Received - #{orderNumber}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #007bff; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Order Received</h1>
            </div>
            
            <div style="padding: 20px; background-color: white;">
              <h2 style="color: #333;">Order Details</h2>
              
              <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Customer:</strong> {{customerName}} ({{customerEmail}})</p>
                <p><strong>Order Date:</strong> {{orderDate}}</p>
                <p><strong>Total:</strong> {{orderTotal}}</p>
                <p><strong>Payment Status:</strong> {{paymentStatus}}</p>
              </div>
              
              <h3>Items Ordered:</h3>
              <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
                {{#each items}}
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>{{name}}</strong><br>
                      <small>SKU: {{sku}}</small><br>
                      <small>Quantity: {{quantity}}</small>
                    </div>
                    <div style="text-align: right;">
                      <strong>{{price}}</strong>
                    </div>
                  </div>
                </div>
                {{/each}}
              </div>
              
              <h3>Shipping Address:</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <p>{{shippingAddress}}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{adminUrl}}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Order in Admin
                </a>
              </div>
            </div>
          </div>
        `
      },
      
      'low-stock-alert': {
        subject: 'Low Stock Alert - {{productName}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ffc107; padding: 20px; text-align: center;">
              <h1 style="color: #333; margin: 0;">Low Stock Alert</h1>
            </div>
            
            <div style="padding: 20px; background-color: white;">
              <h2 style="color: #333;">Stock Level Warning</h2>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0; color: #856404;">{{productName}}</h3>
                <p><strong>Current Stock:</strong> {{currentStock}} units</p>
                <p><strong>SKU:</strong> {{sku}}</p>
                <p><strong>Threshold:</strong> {{threshold}} units</p>
              </div>
              
              <p>This product is running low on stock. Consider restocking soon to avoid stockouts.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{productUrl}}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Manage Product
                </a>
              </div>
            </div>
          </div>
        `
      }
    };
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (this.config.service === 'sendgrid') {
        return await this.sendWithSendGrid(options);
      } else {
        return await this.sendWithSMTP(options);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private async sendWithSendGrid(options: EmailOptions): Promise<boolean> {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(this.config.apiKey);

    const msg = {
      to: Array.isArray(options.to) ? options.to : [options.to],
      from: {
        email: this.config.from,
        name: this.config.fromName
      },
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        type: att.contentType
      }))
    };

    if (options.cc) {
      msg.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
    }

    if (options.bcc) {
      msg.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
    }

    try {
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }
  }

  private async sendWithSMTP(options: EmailOptions): Promise<boolean> {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransporter({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.username,
        pass: this.config.password
      }
    });

    const mailOptions = {
      from: `"${this.config.fromName}" <${this.config.from}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      }))
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('SMTP error:', error);
      return false;
    }
  }

  async sendOrderConfirmation(orderData: any): Promise<boolean> {
    const template = this.templates['order-confirmation'];
    const html = this.compileTemplate(template.html, orderData);
    const subject = this.compileTemplate(template.subject, orderData);

    return await this.sendEmail({
      to: orderData.customerEmail,
      subject,
      html
    });
  }

  async sendOrderShipped(orderData: any): Promise<boolean> {
    const template = this.templates['order-shipped'];
    const html = this.compileTemplate(template.html, orderData);
    const subject = this.compileTemplate(template.subject, orderData);

    return await this.sendEmail({
      to: orderData.customerEmail,
      subject,
      html
    });
  }

  async sendAdminNewOrder(orderData: any, adminEmail: string): Promise<boolean> {
    const template = this.templates['admin-new-order'];
    const html = this.compileTemplate(template.html, orderData);
    const subject = this.compileTemplate(template.subject, orderData);

    return await this.sendEmail({
      to: adminEmail,
      subject,
      html
    });
  }

  async sendLowStockAlert(productData: any, adminEmail: string): Promise<boolean> {
    const template = this.templates['low-stock-alert'];
    const html = this.compileTemplate(template.html, productData);
    const subject = this.compileTemplate(template.subject, productData);

    return await this.sendEmail({
      to: adminEmail,
      subject,
      html
    });
  }

  private compileTemplate(template: string, data: Record<string, any>): string {
    let compiled = template;

    // Simple template compilation
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      compiled = compiled.replace(regex, String(value));
    });

    // Handle arrays with {{#each}} syntax
    const eachRegex = /{{#each (\w+)}}(.*?){{\/each}}/gs;
    compiled = compiled.replace(eachRegex, (match, arrayName, itemTemplate) => {
      const array = data[arrayName];
      if (!Array.isArray(array)) return '';

      return array.map(item => {
        let itemHtml = itemTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          itemHtml = itemHtml.replace(regex, String(value));
        });
        return itemHtml;
      }).join('');
    });

    return compiled;
  }

  addTemplate(name: string, template: EmailTemplate): void {
    this.templates[name] = template;
  }

  getTemplate(name: string): EmailTemplate | undefined {
    return this.templates[name];
  }

  updateConfig(config: Partial<EmailConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Default configuration
const emailConfig: EmailConfig = {
  service: 'sendgrid',
  apiKey: process.env.SENDGRID_API_KEY || '',
  from: process.env.FROM_EMAIL || 'noreply@flamestore.com',
  fromName: process.env.FROM_NAME || 'Flame Store'
};

export const emailService = new EmailService(emailConfig);