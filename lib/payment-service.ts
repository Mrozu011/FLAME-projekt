interface PaymentConfig {
  stripe?: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'production';
  };
}

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  clientSecret?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  created: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  details: any;
  customerId?: string;
}

interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, any>;
}

interface RefundResponse {
  id: string;
  status: 'pending' | 'succeeded' | 'failed';
  amount: number;
  reason?: string;
  created: number;
}

export class PaymentService {
  private config: PaymentConfig;
  private stripe: any;
  private paypal: any;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    if (this.config.stripe) {
      this.stripe = require('stripe')(this.config.stripe.secretKey);
    }

    if (this.config.paypal) {
      this.paypal = require('@paypal/checkout-server-sdk');
    }
  }

  async createPaymentIntent(amount: number, currency: string, metadata: Record<string, any> = {}): Promise<PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true
        },
        metadata
      });

      return {
        id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: intent.status,
        clientSecret: intent.client_secret,
        metadata: intent.metadata,
        created: intent.created
      };
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const intent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });

      return {
        id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: intent.status,
        paymentMethod: intent.payment_method,
        metadata: intent.metadata,
        created: intent.created
      };
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      throw error;
    }
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: intent.status,
        clientSecret: intent.client_secret,
        paymentMethod: intent.payment_method,
        metadata: intent.metadata,
        created: intent.created
      };
    } catch (error) {
      console.error('Failed to retrieve payment intent:', error);
      throw error;
    }
  }

  async createPayPalOrder(amount: number, currency: string, metadata: Record<string, any> = {}): Promise<any> {
    if (!this.paypal) {
      throw new Error('PayPal not configured');
    }

    try {
      const PayPalApi = require('@paypal/checkout-server-sdk');
      const environment = this.config.paypal?.mode === 'production' 
        ? new PayPalApi.core.LiveEnvironment(this.config.paypal?.clientId || '', this.config.paypal?.clientSecret || '')
        : new PayPalApi.core.SandboxEnvironment(this.config.paypal?.clientId || '', this.config.paypal?.clientSecret || '');

      const client = new PayPalApi.core.PayPalHttpClient(environment);
      
      const request = new PayPalApi.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2)
          }
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/paypal/return`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/paypal/cancel`
        }
      });

      const order = await client.execute(request);
      return order.result;
    } catch (error) {
      console.error('Failed to create PayPal order:', error);
      throw error;
    }
  }

  async capturePayPalOrder(orderId: string): Promise<any> {
    if (!this.paypal) {
      throw new Error('PayPal not configured');
    }

    try {
      const PayPalApi = require('@paypal/checkout-server-sdk');
      const environment = this.config.paypal?.mode === 'production' 
        ? new PayPalApi.core.LiveEnvironment(this.config.paypal?.clientId || '', this.config.paypal?.clientSecret || '')
        : new PayPalApi.core.SandboxEnvironment(this.config.paypal?.clientId || '', this.config.paypal?.clientSecret || '');

      const client = new PayPalApi.core.PayPalHttpClient(environment);
      
      const request = new PayPalApi.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const capture = await client.execute(request);
      return capture.result;
    } catch (error) {
      console.error('Failed to capture PayPal order:', error);
      throw error;
    }
  }

  async createCustomer(email: string, name: string, metadata: Record<string, any> = {}): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata
      });

      return customer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }

  async savePaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      return {
        id: paymentMethod.id,
        type: paymentMethod.type,
        details: paymentMethod[paymentMethod.type],
        customerId
      };
    } catch (error) {
      console.error('Failed to save payment method:', error);
      throw error;
    }
  }

  async getCustomerPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return paymentMethods.data.map((pm: any) => ({
        id: pm.id,
        type: pm.type,
        details: pm[pm.type],
        customerId
      }));
    } catch (error) {
      console.error('Failed to get customer payment methods:', error);
      throw error;
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const refundData: any = {
        payment_intent: request.paymentId
      };

      if (request.amount) {
        refundData.amount = Math.round(request.amount * 100);
      }

      if (request.reason) {
        refundData.reason = request.reason;
      }

      if (request.metadata) {
        refundData.metadata = request.metadata;
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        id: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
        reason: refund.reason,
        created: refund.created
      };
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw error;
    }
  }

  async handleWebhook(payload: string, signature: string): Promise<any> {
    if (!this.stripe || !this.config.stripe?.webhookSecret) {
      throw new Error('Stripe webhook not configured');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.stripe.webhookSecret
      );

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  private async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Update order status
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await this.updateOrderStatus(orderId, 'paid');
    }
  }

  private async handlePaymentFailed(paymentIntent: any): Promise<void> {
    console.log('Payment failed:', paymentIntent.id);
    
    // Update order status
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await this.updateOrderStatus(orderId, 'payment_failed');
    }
  }

  private async handleChargeDispute(dispute: any): Promise<void> {
    console.log('Charge dispute created:', dispute.id);
    
    // Notify admin about dispute
    // Handle dispute response
  }

  private async updateOrderStatus(orderId: string, status: string): Promise<void> {
    // This would update your database
    console.log(`Updating order ${orderId} status to ${status}`);
  }

  async calculateFees(amount: number, currency: string, method: string): Promise<number> {
    // Calculate payment processing fees
    const rates = {
      stripe: {
        card: 0.029, // 2.9% + $0.30
        fixed: 0.30
      },
      paypal: {
        standard: 0.0349 // 3.49% + $0.49
      }
    };

    if (method === 'stripe') {
      return (amount * rates.stripe.card) + rates.stripe.fixed;
    } else if (method === 'paypal') {
      return amount * rates.paypal.standard;
    }

    return 0;
  }

  async generatePaymentLink(amount: number, currency: string, metadata: Record<string, any> = {}): Promise<string> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const price = await this.stripe.prices.create({
        unit_amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        product_data: {
          name: metadata.productName || 'Purchase'
        }
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: price.id,
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
        metadata
      });

      return session.url;
    } catch (error) {
      console.error('Failed to generate payment link:', error);
      throw error;
    }
  }

  async validatePayment(paymentId: string): Promise<boolean> {
    try {
      const intent = await this.getPaymentIntent(paymentId);
      return intent.status === 'succeeded';
    } catch (error) {
      console.error('Payment validation failed:', error);
      return false;
    }
  }

  getConfig(): PaymentConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<PaymentConfig>): void {
    this.config = { ...this.config, ...config };
    this.initializeProviders();
  }
}

// Default configuration
const paymentConfig: PaymentConfig = {
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    mode: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production'
  }
};

export const paymentService = new PaymentService(paymentConfig);