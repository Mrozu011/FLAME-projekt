/**
 * Invoice Data interface representing a complete invoice structure
 */
export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  order: {
    id: string;
    orderNumber: string;
    orderDate: string;
    status: string;
    paymentStatus: string;
  };
  seller: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
    website?: string;
    taxId?: string;
  };
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  summary: {
    subtotal: number;
    tax: number;
    taxRate: number;
    shipping: number;
    discount: number;
    total: number;
  };
  notes?: string;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    footer?: string;
  };
}

/**
 * Invoice Settings interface for configuring invoice templates and branding
 */
export interface InvoiceSettings {
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZipCode: string;
  companyCountry: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite?: string;
  companyTaxId?: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  footer: string;
  invoicePrefix: string;
  invoiceNumberLength: number;
  defaultNotes?: string;
  autoGenerate: boolean;
  emailToCustomer: boolean;
}

/**
 * Order interface for generating invoices from order data
 */
export interface Order {
  id: string;
  orderNumber?: string;
  orderDate?: string;
  date?: string;
  status: string;
  paymentStatus?: string;
  payment?: {
    status: string;
  };
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  billing?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shipping?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items?: Array<{
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  summary?: {
    subtotal: number;
    tax: number;
    taxRate: number;
    shipping: number;
    discount: number;
    total: number;
  };
  subtotal?: number;
  tax?: number;
  taxRate?: number;
  discount?: number;
  total?: number;
  amount?: number;
  email?: string;
  phone?: string;
}

/**
 * Invoice Service class for managing invoice generation, settings, and persistence
 * Provides methods for creating, updating, and managing invoice data and templates
 */
export class InvoiceService {
  private settings: InvoiceSettings;
  private invoiceCounter: number = 1000;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettings();
  }

  /**
   * Creates default invoice settings with Flame Fashion branding
   * @returns Default InvoiceSettings object with company information
   */
  private getDefaultSettings(): InvoiceSettings {
    return {
      companyName: 'Flame Fashion',
      companyAddress: '123 Fashion Street',
      companyCity: 'New York',
      companyState: 'NY',
      companyZipCode: '10001',
      companyCountry: 'United States',
      companyPhone: '+1 (555) 123-4567',
      companyEmail: 'billing@flamefashion.com',
      companyWebsite: 'www.flamefashion.com',
      companyTaxId: 'TAX123456789',
      primaryColor: '#000000',
      secondaryColor: '#666666',
      footer: 'Thank you for your business! For questions about this invoice, please contact our billing department.',
      invoicePrefix: 'INV',
      invoiceNumberLength: 6,
      defaultNotes: 'Payment is due within 30 days of invoice date.',
      autoGenerate: true,
      emailToCustomer: true
    };
  }

  /**
   * Loads saved settings from localStorage and merges with defaults
   * Handles errors gracefully and falls back to default settings
   */
  private loadSettings(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('flame-invoice-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsedSettings };
      }
      
      const counter = localStorage.getItem('flame-invoice-counter');
      if (counter) {
        this.invoiceCounter = parseInt(counter);
      }
    } catch (error) {
      console.error('Error loading invoice settings:', error);
      // Fall back to default settings
      this.settings = this.getDefaultSettings();
    }
  }

  /**
   * Saves current settings to localStorage for persistence
   * Handles errors gracefully and logs issues
   */
  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('flame-invoice-settings', JSON.stringify(this.settings));
      localStorage.setItem('flame-invoice-counter', this.invoiceCounter.toString());
    } catch (error) {
      console.error('Error saving invoice settings:', error);
    }
  }

  /**
   * Retrieves current invoice settings
   * @returns Copy of current InvoiceSettings object
   */
  public getSettings(): InvoiceSettings {
    return { ...this.settings };
  }

  /**
   * Updates invoice settings with new values and persists to storage
   * @param updates - Partial settings object containing fields to update
   */
  public updateSettings(updates: Partial<InvoiceSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  /**
   * Generates a unique invoice number based on current counter and prefix
   * @returns Formatted invoice number string (e.g., "INV-001000")
   */
  public generateInvoiceNumber(): string {
    const number = this.invoiceCounter.toString().padStart(this.settings.invoiceNumberLength, '0');
    this.invoiceCounter++;
    this.saveSettings();
    return `${this.settings.invoicePrefix}-${number}`;
  }

  /**
   * Generates a complete invoice from order data
   * @param orderData - Order object containing customer, items, and payment information
   * @param customNotes - Optional custom notes to include in the invoice
   * @returns Promise resolving to complete InvoiceData object
   */
  public async generateInvoice(orderData: Order, customNotes?: string): Promise<InvoiceData> {
    const invoiceNumber = this.generateInvoiceNumber();
    const issueDate = new Date().toISOString().split('T')[0];
    
    // Validate required order data
    if (!orderData.id) {
      throw new Error('Order ID is required');
    }

    const invoice: InvoiceData = {
      invoiceNumber,
      issueDate,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: {
        id: orderData.id,
        orderNumber: orderData.orderNumber || orderData.id,
        orderDate: orderData.orderDate || orderData.date || new Date().toISOString(),
        status: orderData.status,
        paymentStatus: orderData.paymentStatus || orderData.payment?.status || 'pending'
      },
      seller: {
        name: this.settings.companyName,
        address: this.settings.companyAddress,
        city: this.settings.companyCity,
        state: this.settings.companyState,
        zipCode: this.settings.companyZipCode,
        country: this.settings.companyCountry,
        phone: this.settings.companyPhone,
        email: this.settings.companyEmail,
        website: this.settings.companyWebsite,
        taxId: this.settings.companyTaxId
      },
      buyer: {
        name: orderData.customer?.name || 'Unknown Customer',
        email: orderData.customer?.email || orderData.email || 'no-email@example.com',
        phone: orderData.customer?.phone || orderData.phone || 'No phone provided',
        address: orderData.billing?.address || orderData.shipping?.address || 'No address provided',
        city: orderData.billing?.city || orderData.shipping?.city || 'Unknown',
        state: orderData.billing?.state || orderData.shipping?.state || 'Unknown',
        zipCode: orderData.billing?.zipCode || orderData.shipping?.zipCode || '00000',
        country: orderData.billing?.country || orderData.shipping?.country || 'Unknown'
      },
      items: orderData.items || [],
      summary: orderData.summary || {
        subtotal: orderData.subtotal || 0,
        tax: orderData.tax || 0,
        taxRate: orderData.taxRate || 0,
        shipping: typeof orderData.shipping === 'number' ? orderData.shipping : 0,
        discount: orderData.discount || 0,
        total: orderData.total || orderData.amount || 0
      },
      notes: customNotes || this.settings.defaultNotes,
      branding: {
        logo: this.settings.logo,
        primaryColor: this.settings.primaryColor,
        secondaryColor: this.settings.secondaryColor,
        footer: this.settings.footer
      }
    };

    // Save invoice to local storage
    this.saveInvoice(invoice);
    
    return invoice;
  }

  /**
   * Saves an invoice to localStorage for persistence
   * @param invoice - Complete InvoiceData object to save
   */
  private saveInvoice(invoice: InvoiceData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('flame-invoices');
      const invoices = saved ? JSON.parse(saved) : [];
      invoices.push({
        ...invoice,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('flame-invoices', JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  }

  /**
   * Retrieves all saved invoices from localStorage
   * @returns Array of InvoiceData objects, empty array if none found
   */
  public getInvoices(): InvoiceData[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem('flame-invoices');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading invoices:', error);
      return [];
    }
  }

  /**
   * Retrieves a specific invoice by invoice number
   * @param invoiceNumber - Unique invoice number to search for
   * @returns InvoiceData object if found, null otherwise
   */
  public getInvoice(invoiceNumber: string): InvoiceData | null {
    try {
      const invoices = this.getInvoices();
      return invoices.find(invoice => invoice.invoiceNumber === invoiceNumber) || null;
    } catch (error) {
      console.error('Error getting invoice:', error);
      return null;
    }
  }

  /**
   * Retrieves all invoices for a specific order
   * @param orderId - Order ID to filter invoices by
   * @returns Array of InvoiceData objects for the specified order
   */
  public getInvoicesByOrder(orderId: string): InvoiceData[] {
    try {
      const invoices = this.getInvoices();
      return invoices.filter(invoice => invoice.order.id === orderId);
    } catch (error) {
      console.error('Error getting invoices by order:', error);
      return [];
    }
  }

  /**
   * Generates HTML content for an invoice with styling and layout
   * @param invoice - Complete InvoiceData object to render
   * @returns HTML string containing the formatted invoice
   */
  public generateHTML(invoice: InvoiceData): string {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
          }
          .invoice-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, ${invoice.branding?.primaryColor || '#000000'}, ${invoice.branding?.secondaryColor || '#666666'});
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 1.1em;
            opacity: 0.9;
          }
          .invoice-details {
            padding: 30px;
            border-bottom: 2px solid #eee;
          }
          .invoice-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-number {
            font-size: 1.5em;
            font-weight: bold;
            color: ${invoice.branding?.primaryColor || '#000000'};
          }
          .invoice-date {
            color: #666;
          }
          .parties {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
          }
          .party {
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .party h3 {
            color: ${invoice.branding?.primaryColor || '#000000'};
            margin-bottom: 15px;
            border-bottom: 2px solid ${invoice.branding?.secondaryColor || '#666666'};
            padding-bottom: 5px;
          }
          .party p {
            margin-bottom: 5px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          .items-table th {
            background: ${invoice.branding?.primaryColor || '#000000'};
            color: white;
            padding: 15px;
            text-align: left;
          }
          .items-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
          }
          .items-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .summary-section {
            margin: 30px 0;
          }
          .summary-table {
            width: 100%;
            border-collapse: collapse;
          }
          .summary-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .summary-table .label {
            font-weight: bold;
            text-align: right;
            width: 50%;
          }
          .summary-table .value {
            text-align: right;
            width: 50%;
          }
          .summary-table .total {
            font-weight: bold;
            font-size: 1.2em;
            background: ${invoice.branding?.primaryColor || '#000000'};
            color: white;
          }
          .notes-section {
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin: 30px 0;
          }
          .notes-section h3 {
            color: ${invoice.branding?.primaryColor || '#000000'};
            margin-bottom: 10px;
          }
          .footer {
            background: ${invoice.branding?.secondaryColor || '#666666'};
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
          }
          @media print {
            body { background: white; }
            .invoice-container { box-shadow: none; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            ${invoice.branding?.logo ? `<img src="${invoice.branding.logo}" alt="Company Logo" style="max-height: 60px; margin-bottom: 20px;">` : ''}
            <h1>INVOICE</h1>
            <p>${invoice.seller.name}</p>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-meta">
              <div>
                <div class="invoice-number">#${invoice.invoiceNumber}</div>
                <div class="invoice-date">Issued: ${formatDate(invoice.issueDate)}</div>
                ${invoice.dueDate ? `<div class="invoice-date">Due: ${formatDate(invoice.dueDate)}</div>` : ''}
              </div>
              <div>
                <h3>Order Details</h3>
                <p><strong>Order #:</strong> ${invoice.order.orderNumber}</p>
                <p><strong>Date:</strong> ${formatDate(invoice.order.orderDate)}</p>
                <p><strong>Status:</strong> ${invoice.order.status}</p>
                <p><strong>Payment:</strong> ${invoice.order.paymentStatus}</p>
              </div>
            </div>
            
            <div class="parties">
              <div class="party">
                <h3>From</h3>
                <p><strong>${invoice.seller.name}</strong></p>
                <p>${invoice.seller.address}</p>
                <p>${invoice.seller.city}, ${invoice.seller.state} ${invoice.seller.zipCode}</p>
                <p>${invoice.seller.country}</p>
                <p>Phone: ${invoice.seller.phone}</p>
                <p>Email: ${invoice.seller.email}</p>
                ${invoice.seller.website ? `<p>Web: ${invoice.seller.website}</p>` : ''}
                ${invoice.seller.taxId ? `<p>Tax ID: ${invoice.seller.taxId}</p>` : ''}
              </div>
              
              <div class="party">
                <h3>To</h3>
                <p><strong>${invoice.buyer.name}</strong></p>
                <p>${invoice.buyer.address}</p>
                <p>${invoice.buyer.city}, ${invoice.buyer.state} ${invoice.buyer.zipCode}</p>
                <p>${invoice.buyer.country}</p>
                <p>Phone: ${invoice.buyer.phone}</p>
                <p>Email: ${invoice.buyer.email}</p>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary-section">
              <table class="summary-table">
                <tr>
                  <td class="label">Subtotal:</td>
                  <td class="value">${formatCurrency(invoice.summary.subtotal)}</td>
                </tr>
                ${invoice.summary.discount > 0 ? `
                <tr>
                  <td class="label">Discount:</td>
                  <td class="value">-${formatCurrency(invoice.summary.discount)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td class="label">Shipping:</td>
                  <td class="value">${formatCurrency(invoice.summary.shipping)}</td>
                </tr>
                <tr>
                  <td class="label">Tax (${invoice.summary.taxRate}%):</td>
                  <td class="value">${formatCurrency(invoice.summary.tax)}</td>
                </tr>
                <tr class="total">
                  <td class="label">Total:</td>
                  <td class="value">${formatCurrency(invoice.summary.total)}</td>
                </tr>
              </table>
            </div>

            ${invoice.notes ? `
            <div class="notes-section">
              <h3>Notes:</h3>
              <p>${invoice.notes}</p>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>${invoice.branding?.footer || 'Thank you for your business!'}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Downloads an invoice as an HTML file
   * @param invoice - Complete InvoiceData object to download
   */
  public downloadInvoice(invoice: InvoiceData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const html = this.generateHTML(invoice);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  }

  /**
   * Opens an invoice in a new window for printing
   * @param invoice - Complete InvoiceData object to print
   */
  public printInvoice(invoice: InvoiceData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const html = this.generateHTML(invoice);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    } catch (error) {
      console.error('Error printing invoice:', error);
    }
  }

  /**
   * Sends an invoice via email (simulated)
   * @param invoice - Complete InvoiceData object to send
   * @param recipientEmail - Email address of the recipient
   * @returns Promise resolving to boolean indicating success
   */
  public async emailInvoice(invoice: InvoiceData, recipientEmail: string): Promise<boolean> {
    try {
      // Simulate email sending
      console.log('Sending invoice email:', {
        to: recipientEmail,
        invoice: invoice.invoiceNumber,
        amount: invoice.summary.total
      });
      
      // In a real application, this would call your email service
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return false;
    }
  }
}

export const invoiceService = new InvoiceService();