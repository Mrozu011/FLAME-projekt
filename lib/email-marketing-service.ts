
interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  templateId?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  stats: {
    sent: number;
    delivered: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  };
  createdAt: string;
  updatedAt: string;
  language: string;
  segmentIds: string[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  language: string;
  category: 'newsletter' | 'promotional' | 'transactional';
  createdAt: string;
  updatedAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
  segments: string[];
  customFields: Record<string, any>;
}

interface IntegrationSettings {
  mailchimp: {
    apiKey: string;
    listId: string;
    enabled: boolean;
  };
  brevo: {
    apiKey: string;
    listId: string;
    enabled: boolean;
  };
  autoTranslation: {
    enabled: boolean;
    service: 'google' | 'deepl' | 'azure';
  };
}

export class EmailMarketingService {
  private baseUrl = '/api/email-marketing';
  private storageKey = 'flame-email-marketing';

  // Campaign Management
  async getCampaigns(): Promise<Campaign[]> {
    // Use mock data directly in frontend-only environment
    return this.getMockCampaigns();
  }

  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    // Mock creation
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignData.name || 'New Campaign',
      subject: campaignData.subject || 'New Campaign Subject',
      content: campaignData.content || '',
      templateId: campaignData.templateId,
      status: 'draft',
      scheduledAt: campaignData.scheduledAt,
      recipients: 0,
      stats: {
        sent: 0,
        delivered: 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: campaignData.language || 'en',
      segmentIds: campaignData.segmentIds || []
    };
    return newCampaign;
  }

  async updateCampaign(id: string, campaignData: Partial<Campaign>): Promise<Campaign> {
    // Mock update
    const campaigns = this.getMockCampaigns();
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      return {
        ...campaign,
        ...campaignData,
        updatedAt: new Date().toISOString()
      };
    }
    throw new Error('Campaign not found');
  }

  async deleteCampaign(id: string): Promise<void> {
    // Mock deletion
    console.log(`Campaign ${id} deleted`);
  }

  async sendCampaign(id: string): Promise<void> {
    // Mock sending
    console.log(`Campaign ${id} sent`);
  }

  async duplicateCampaign(id: string): Promise<Campaign> {
    // Mock duplication
    const originalCampaign = this.getMockCampaigns().find(c => c.id === id);
    if (originalCampaign) {
      return {
        ...originalCampaign,
        id: Date.now().toString(),
        name: `${originalCampaign.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    throw new Error('Campaign not found');
  }

  // Template Management
  async getTemplates(): Promise<EmailTemplate[]> {
    // Use mock data directly in frontend-only environment
    return this.getMockTemplates();
  }

  async createTemplate(templateData: Partial<EmailTemplate>): Promise<EmailTemplate> {
    // Mock creation
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: templateData.name || 'New Template',
      subject: templateData.subject || 'New Template Subject',
      content: templateData.content || '',
      language: templateData.language || 'en',
      category: templateData.category || 'newsletter',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().isEqualToNow()
    };
    return newTemplate;
  }

  async updateTemplate(id: string, templateData: Partial<EmailTemplate>): Promise<EmailTemplate> {
    // Mock update
    const templates = this.getMockTemplates();
    const template = templates.find(t => t.id === id);
    if (template) {
      return {
        ...template,
        ...templateData,
        updatedAt: new Date().toISOString()
      };
    }
    throw new Error('Template not found');
  }

  async deleteTemplate(id: string): Promise<void> {
    // Mock deletion
    console.log(`Template ${id} deleted`);
  }

  // Subscriber Management
  async getSubscribers(limit: number = 100, offset: number = 0): Promise<Subscriber[]> {
    // Use mock data directly in frontend-only environment
    return this.getMockSubscribers();
  }

  async addSubscriber(subscriberData: Partial<Subscriber>): Promise<Subscriber> {
    // Mock add
    const newSubscriber: Subscriber = {
      id: Date.now().toString(),
      email: subscriberData.email || '',
      firstName: subscriberData.firstName || '',
      lastName: subscriberData.lastName || '',
      language: subscriberData.language || 'en',
      status: subscriberData.status || 'active',
      subscribedAt: subscriberData.subscribedAt || new Date().toISOString(),
      segments: subscriberData.segments || [],
      customFields: subscriberData.customFields || {}
    };
    return newSubscriber;
  }

  async updateSubscriber(id: string, subscriberData: Partial<Subscriber>): Promise<Subscriber> {
    // Mock update
    const subscribers = this.getMockSubscribers();
    const subscriber = subscribers.find(s => s.id === id);
    if (subscriber) {
      return {
        ...subscriber,
        ...subscriberData
      };
    }
    throw new Error('Subscriber not found');
  }

  async unsubscribe(email: string): Promise<void> {
    // Mock unsubscribe
    console.log(`${email} unsubscribed`);
  }

  // Export and Sync
  async exportSubscribers(format: 'csv' | 'json', filters?: any): Promise<Blob> {
    // Mock CSV export
    const csvData = this.generateMockCSV();
    return new Blob([csvData], { type: 'text/csv' });
  }

  async syncWithPlatform(platform: 'mailchimp' | 'brevo'): Promise<void> {
    // Mock sync
    console.log(`Synced with ${platform}`);
  }

  // Integration Management
  async getIntegrationStatus(): Promise<any> {
    // Use mock data directly in frontend-only environment
    return {
      mailchimp: { connected: false, lastSync: null },
      brevo: { connected: false, lastSync: null }
    };
  }

  async saveSettings(settings: IntegrationSettings): Promise<void> {
    // Mock save to localStorage
    localStorage.setItem(`${this.storageKey}-settings`, JSON.stringify(settings));
  }

  async getSettings(): Promise<IntegrationSettings> {
    // Mock load from localStorage
    const saved = localStorage.getItem(`${this.storageKey}-settings`);
    return saved ? JSON.parse(saved) : this.getDefaultSettings();
  }

  async testIntegration(platform: 'mailchimp' | 'brevo', config: any): Promise<{ success: boolean; message: string }> {
    // Mock test result
    return {
      success: config.apiKey && config.apiKey.length > 10,
      message: config.apiKey && config.apiKey.length > 10 ? 'Connection successful' : 'Invalid API key'
    };
  }

  // Analytics and Stats
  async getStats(): Promise<any> {
    // Use mock data directly in frontend-only environment
    return {
      totalSubscribers: 15647,
      activeSubscribers: 14892,
      totalCampaigns: 23,
      averageOpenRate: 0.247,
      averageClickRate: 0.032,
      monthlyGrowth: 0.085
    };
  }

  async getCampaignStats(id: string): Promise<any> {
    // Use mock data directly in frontend-only environment
    return {
      sent: 1000,
      delivered: 985,
      opens: 245,
      clicks: 32,
      bounces: 15,
      unsubscribes: 3,
      openRate: 0.249,
      clickRate: 0.033,
      bounceRate: 0.015
    };
  }

  // Translation Services
  async translateContent(content: string, fromLang: string, toLang: string): Promise<string> {
    // Mock translation
    return `[${toLang.toUpperCase()}] ${content}`;
  }

  async getAvailableLanguages(): Promise<Array<{ code: string; name: string }>> {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' }
    ];
  }

  // Checkout Integration
  async addSubscriberFromCheckout(email: string, firstName: string, lastName: string, language: string): Promise<void> {
    // Mock add from checkout
    console.log(`Added subscriber from checkout: ${email}`);
  }

  private getMockCampaigns(): Campaign[] {
    return [
      {
        id: '1',
        name: 'Summer Sale Newsletter',
        subject: "Don't Miss Our Summer Sale - Up to 50% Off!",
        content: `
          <h1>Summer Sale is Here!</h1>
          <p>Get ready for amazing deals on our entire summer collection.</p>
          <ul>
            <li>50% off swimwear</li>
            <li>30% off summer dresses</li>
            <li>25% off sandals and accessories</li>
          </ul>
          <a href="/sale" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Shop Now</a>
        `,
        templateId: '1',
        status: 'sent',
        sentAt: '2024-06-15T10:00:00Z',
        recipients: 15647,
        stats: {
          sent: 15647,
          delivered: 15432,
          opens: 3847,
          clicks: 502,
          bounces: 215,
          unsubscribes: 23,
          openRate: 0.249,
          clickRate: 0.033,
          bounceRate: 0.014
        },
        createdAt: '2024-06-14T14:30:00Z',
        updatedAt: '2024-06-15T10:00:00Z',
        language: 'en',
        segmentIds: ['customers', 'newsletter']
      },
      {
        id: '2',
        name: 'New Collection Announcement',
        subject: 'Introducing Our Fall Collection 2024',
        content: `
          <h1>Fall Collection 2024</h1>
          <p>Discover our latest fall arrivals featuring the season's hottest trends.</p>
          <img src="https://readdy.ai/api/search-image?query=fall%20fashion%20collection%202024%20with%20elegant%20autumn%20colors%20and%20modern%20clothing%20items%20displayed%20on%20models%20in%20professional%20product%20photography%20with%20clean%20studio%20background&width=600&height=400&seq=fall1&orientation=landscape" alt="Fall Collection" style="width: 100%; height: auto;" />
          <p>From cozy sweaters to stylish boots, we have everything you need for the season.</p>
          <a href="/collections/fall-2024" style="background-color: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Explore Collection</a>
        `,
        templateId: '2',
        status: 'scheduled',
        scheduledAt: '2024-09-01T09:00:00Z',
        recipients: 14892,
        stats: {
          sent: 0,
          delivered: 0,
          opens: 0,
          clicks: 0,
          bounces: 0,
          unsubscribes: 0,
          openRate: 0,
          clickRate: 0,
          bounceRate: 0
        },
        createdAt: '2024-08-25T16:45:00Z',
        updatedAt: '2024-08-25T16:45:00Z',
        language: 'en',
        segmentIds: ['customers', 'newsletter']
      },
      {
        id: '3',
        name: 'Weekly Newsletter #32',
        subject: 'Your Weekly Style Update',
        content: `
          <h1>This Week in Fashion</h1>
          <h2>Trending Now</h2>
          <p>See what's hot this week and get styling tips from our fashion experts.</p>
          <h2>Customer Spotlight</h2>
          <p>Check out how our customers are styling their recent purchases.</p>
          <h2>Upcoming Events</h2>
          <p>Don't miss our virtual styling session this Friday at 2 PM EST.</p>
          <a href="/newsletter" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Read More</a>
        `,
        templateId: '3',
        status: 'draft',
        recipients: 14892,
        stats: {
          sent: 0,
          delivered: 0,
          opens: 0,
          clicks: 0,
          bounces: 0,
          unsubscribes: 0,
          openRate: 0,
          clickRate: 0,
          bounceRate: 0
        },
        createdAt: '2024-08-28T11:20:00Z',
        updatedAt: '2024-08-28T11:20:00Z',
        language: 'en',
        segmentIds: ['newsletter']
      }
    ];
  }

  private getMockTemplates(): EmailTemplate[] {
    return [
      {
        id: '1',
        name: 'Sale Announcement',
        subject: 'Special Sale - Save {{discount}}%!',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">{{sale_title}}</h1>
            <p style="font-size: 16px; line-height: 1.6;">{{sale_description}}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{sale_url}}" style="background-color: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Shop Now</a>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">Valid until {{end_date}}</p>
          </div>
        `,
        language: 'en',
        category: 'promotional',
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2024-06-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'New Collection',
        subject: 'New Arrivals: {{collection_name}}',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1F2937; text-align: center;">{{collection_name}}</h1>
            <img src="{{collection_image}}" alt="{{collection_name}}" style="width: 100%; height: auto; border-radius: 8px;" />
            <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">{{collection_description}}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{collection_url}}" style="background-color: #F59E0B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Explore Collection</a>
            </div>
          </div>
        `,
        language: 'en',
        category: 'newsletter',
        createdAt: '2024-06-15T14:30:00Z',
        updatedAt: '2024-06-15T14:30:00Z'
      },
      {
        id: '3',
        name: 'Weekly Newsletter',
        subject: 'Your Weekly Update',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981; text-align: center;">{{newsletter_title}}</h1>
            <h2 style="color: #374151;">This Week's Highlights</h2>
            <p style="font-size: 16px; line-height: 1.6;">{{weekly_content}}</p>
            <h2 style="color: #374151;">Featured Products</h2>
            <div style="display: flex; justify-content: space-between; margin: 20px 0;">
              {{featured_products}}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{newsletter_url}}" style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Read More</a>
            </div>
          </div>
        `,
        language: 'en',
        category: 'newsletter',
        createdAt: '2024-07-01T09:00:00Z',
        updatedAt: '2024-07-01T09:00:00Z'
      },
      {
        id: '4',
        name: 'Boletín de Ofertas',
        subject: 'Ofertas Especiales - ¡Ahorra {{discount}}%!',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">{{sale_title}}</h1>
            <p style="font-size: 16px; line-height: 1.6;">{{sale_description}}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{sale_url}}" style="background-color: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Comprar Ahora</a>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">Válido hasta {{end_date}}</p>
          </div>
        `,
        language: 'es',
        category: 'promotional',
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2024-06-01T10:00:00Z'
      }
    ];
  }

  private getMockSubscribers(): Subscriber[] {
    return [
      {
        id: '1',
        email: 'sarah.johnson@email.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        language: 'en',
        status: 'active',
        subscribedAt: '2024-03-15T10:30:00Z',
        segments: ['customers', 'newsletter', 'vip'],
        customFields: {
          source: 'website',
          totalOrders: 5,
          lastPurchase: '2024-08-20T14:00:00Z'
        }
      },
      {
        id: '2',
        email: 'maria.garcia@email.com',
        firstName: 'Maria',
        lastName: 'Garcia',
        language: 'es',
        status: 'active',
        subscribedAt: '2024-04-02T16:20:00Z',
        segments: ['customers', 'newsletter'],
        customFields: {
          source: 'social_media',
          totalOrders: 2,
          lastPurchase: '2024-07-10T12:00:00Z'
        }
      },
      {
        id: '3',
        email: 'david.chen@email.com',
        firstName: 'David',
        lastName: 'Chen',
        language: 'en',
        status: 'active',
        subscribedAt: '2024-05-18T09:15:00Z',
        segments: ['newsletter'],
        customFields: {
          source: 'referral',
          totalOrders: 0
        }
      },
      {
        id: '4',
        email: 'emma.wilson@email.com',
        firstName: 'Emma',
        lastName: 'Wilson',
        language: 'en',
        status: 'unsubscribed',
        subscribedAt: '2024-02-10T11:45:00Z',
        unsubscribedAt: '2024-08-15T14:30:00Z',
        segments: ['customers'],
        customFields: {
          source: 'checkout',
          totalOrders: 1,
          lastPurchase: '2024-02-10T11:45:00Z'
        }
      }
    ];
  }

  private generateMockCSV(): string {
    const subscribers = this.getMockSubscribers();
    const headers = ['Email', 'First Name', 'Last Name', 'Language', 'Status', 'Subscribed At', 'Segments'];
    const csvRows = [headers.join(',')];

    subscribers.forEach(subscriber => {
      const row = [
        subscriber.email,
        subscriber.firstName,
        subscriber.lastName,
        subscriber.language,
        subscriber.status,
        subscriber.subscribedAt,
        subscriber.segments.join(';')
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\\n');
  }

  private getDefaultSettings(): IntegrationSettings {
    return {
      mailchimp: {
        apiKey: '',
        listId: '',
        enabled: false
      },
      brevo: {
        apiKey: '',
        listId: '',
        enabled: false
      },
      autoTranslation: {
        enabled: false,
        service: 'google'
      }
    };
  }
}

export const emailMarketingService = new EmailMarketingService();
