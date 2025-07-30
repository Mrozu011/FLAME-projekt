interface InvoiceData {
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

interface InvoiceSettings {
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

export class InvoiceService {
  private settings: InvoiceSettings;
  private invoiceCounter: number = 1000;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettings();
  }

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

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('flame-invoice-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
      
      const counter = localStorage.getItem('flame-invoice-counter');
      if (counter) {
        this.invoiceCounter = parseInt(counter);
      }
    } catch (error) {
      console.error('Error loading invoice settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('flame-invoice-settings', JSON.stringify(this.settings));
      localStorage.setItem('flame-invoice-counter', this.invoiceCounter.toString());
    } catch (error) {
      console.error('Error saving invoice settings:', error);
    }
  }

  public getSettings(): InvoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<InvoiceSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  public generateInvoiceNumber(): string {
    const number = this.invoiceCounter.toString().padStart(this.settings.invoiceNumberLength, '0');
    this.invoiceCounter++;
    this.saveSettings();
    return `${this.settings.invoicePrefix}-${number}`;
  }

  public async generateInvoice(orderData: any, customNotes?: string): Promise<InvoiceData> {
    const invoiceNumber = this.generateInvoiceNumber();
    const issueDate = new Date().toISOString().split('T')[0];
    
    const invoice: InvoiceData = {
      invoiceNumber,
      issueDate,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: {
        id: orderData.id,
        orderNumber: orderData.orderNumber || orderData.id,
        orderDate: orderData.orderDate || orderData.date,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus || orderData.payment?.status
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
        name: orderData.customer?.name || orderData.customer,
        email: orderData.customer?.email || orderData.email,
        phone: orderData.customer?.phone || orderData.phone,
        address: orderData.billing?.address || orderData.shipping?.address,
        city: orderData.billing?.city || orderData.shipping?.city,
        state: orderData.billing?.state || orderData.shipping?.state,
        zipCode: orderData.billing?.zipCode || orderData.shipping?.zipCode,
        country: orderData.billing?.country || orderData.shipping?.country
      },
      items: orderData.items || [],
      summary: orderData.summary || {
        subtotal: orderData.subtotal || 0,
        tax: orderData.tax || 0,
        taxRate: orderData.taxRate || 0,
        shipping: orderData.shipping || 0,
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

  private saveInvoice(invoice: InvoiceData): void {
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

  public getInvoices(): InvoiceData[] {
    try {
      const saved = localStorage.getItem('flame-invoices');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading invoices:', error);
      return [];
    }
  }

  public getInvoice(invoiceNumber: string): InvoiceData | null {
    const invoices = this.getInvoices();
    return invoices.find(inv => inv.invoiceNumber === invoiceNumber) || null;
  }

  public getInvoicesByOrder(orderId: string): InvoiceData[] {
    const invoices = this.getInvoices();
    return invoices.filter(inv => inv.order.id === orderId);
  }

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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid ${invoice.branding?.primaryColor || '#000'};
          }
          
          .company-info {
            flex: 1;
          }
          
          .company-logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 15px;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: ${invoice.branding?.primaryColor || '#000'};
            margin-bottom: 10px;
          }
          
          .company-details {
            color: ${invoice.branding?.secondaryColor || '#666'};
            font-size: 14px;
          }
          
          .invoice-info {
            text-align: right;
            flex-shrink: 0;
          }
          
          .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: ${invoice.branding?.primaryColor || '#000'};
            margin-bottom: 10px;
          }
          
          .invoice-meta {
            color: ${invoice.branding?.secondaryColor || '#666'};
            font-size: 14px;
          }
          
          .invoice-meta div {
            margin-bottom: 5px;
          }
          
          .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          
          .billing-info {
            flex: 1;
            margin-right: 20px;
          }
          
          .billing-info h3 {
            color: ${invoice.branding?.primaryColor || '#000'};
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .billing-info p {
            margin-bottom: 5px;
            color: ${invoice.branding?.secondaryColor || '#666'};
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .items-table th {
            background: ${invoice.branding?.primaryColor || '#000'};
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          
          .items-table tr:nth-child(even) {
            background: #f9f9f9;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-center {
            text-align: center;
          }
          
          .summary-section {
            margin-left: auto;
            width: 300px;
          }
          
          .summary-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .summary-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
          }
          
          .summary-table .label {
            color: ${invoice.branding?.secondaryColor || '#666'};
            font-weight: 500;
          }
          
          .summary-table .value {
            text-align: right;
            font-weight: 600;
          }
          
          .summary-table .total {
            background: ${invoice.branding?.primaryColor || '#000'};
            color: white;
            font-weight: bold;
            font-size: 18px;
          }
          
          .notes-section {
            margin-top: 40px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
          }
          
          .notes-section h3 {
            color: ${invoice.branding?.primaryColor || '#000'};
            margin-bottom: 10px;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: ${invoice.branding?.secondaryColor || '#666'};
            font-size: 14px;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 10px;
            }
            
            .invoice-header {
              flex-direction: column;
              text-align: center;
            }
            
            .company-info {
              margin-bottom: 20px;
            }
            
            .invoice-info {
              text-align: center;
            }
            
            .invoice-title {
              font-size: 24px;
            }
            
            .billing-section {
              flex-direction: column;
            }
            
            .billing-info {
              margin-right: 0;
              margin-bottom: 20px;
            }
            
            .items-table {
              font-size: 14px;
            }
            
            .items-table th,
            .items-table td {
              padding: 8px 4px;
            }
            
            .summary-section {
              width: 100%;
              margin-left: 0;
            }
          }
          
          @media (max-width: 480px) {
            .items-table {
              font-size: 12px;
            }
            
            .items-table th:nth-child(2),
            .items-table td:nth-child(2) {
              display: none;
            }
            
            .invoice-title {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="company-info">
            ${invoice.branding?.logo ? `<img src="${invoice.branding.logo}" alt="Company Logo" class="company-logo">` : ''}
            <div class="company-name">${invoice.seller.name}</div>
            <div class="company-details">
              <div>${invoice.seller.address}</div>
              <div>${invoice.seller.city}, ${invoice.seller.state} ${invoice.seller.zipCode}</div>
              <div>${invoice.seller.country}</div>
              <div>Phone: ${invoice.seller.phone}</div>
              <div>Email: ${invoice.seller.email}</div>
              ${invoice.seller.website ? `<div>Website: ${invoice.seller.website}</div>` : ''}
              ${invoice.seller.taxId ? `<div>Tax ID: ${invoice.seller.taxId}</div>` : ''}
            </div>
          </div>
          <div class="invoice-info">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-meta">
              <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
              <div><strong>Issue Date:</strong> ${formatDate(invoice.issueDate)}</div>
              ${invoice.dueDate ? `<div><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</div>` : ''}
              <div><strong>Order #:</strong> ${invoice.order.orderNumber}</div>
            </div>
          </div>
        </div>

        <div class="billing-section">
          <div class="billing-info">
            <h3>Bill To:</h3>
            <p><strong>${invoice.buyer.name}</strong></p>
            <p>${invoice.buyer.address}</p>
            <p>${invoice.buyer.city}, ${invoice.buyer.state} ${invoice.buyer.zipCode}</p>
            <p>${invoice.buyer.country}</p>
            <p>Email: ${invoice.buyer.email}</p>
            <p>Phone: ${invoice.buyer.phone}</p>
          </div>
          <div class="billing-info">
            <h3>Order Details:</h3>
            <p><strong>Order Date:</strong> ${formatDate(invoice.order.orderDate)}</p>
            <p><strong>Order Status:</strong> ${invoice.order.status}</p>
            <p><strong>Payment Status:</strong> ${invoice.order.paymentStatus}</p>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>SKU</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.sku}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.price)}</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
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
              <td>Total:</td>
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

        <div class="footer">
          <p>${invoice.branding?.footer || 'Thank you for your business!'}</p>
        </div>
      </body>
      </html>
    `;
  }

  public downloadInvoice(invoice: InvoiceData): void {
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
  }

  public printInvoice(invoice: InvoiceData): void {
    const html = this.generateHTML(invoice);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }

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