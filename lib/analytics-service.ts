interface AnalyticsData {
  revenue: {
    today: number;
    month: number;
    lifetime: number;
    growth: {
      daily: number;
      monthly: number;
      yearly: number;
    };
  };
  orders: {
    total: number;
    byStatus: {
      paid: number;
      pending: number;
      shipped: number;
      returned: number;
      cancelled: number;
    };
    growth: number;
  };
  traffic: {
    visitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
    sources: {
      organic: number;
      direct: number;
      social: number;
      referral: number;
    };
  };
  products: {
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
      growth: number;
    }>;
    lowStock: Array<{
      id: string;
      name: string;
      stock: number;
      threshold: number;
    }>;
  };
  users: {
    total: number;
    new: number;
    active: number;
    growth: number;
    retention: number;
  };
}

interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  conversionRate: number;
}

export class AnalyticsService {
  private baseUrl = '/api/analytics';

  async getDashboardData(timeRange: string = '7d', customRange?: { start: string; end: string }): Promise<AnalyticsData> {
    try {
      const params = new URLSearchParams({ timeRange });
      if (customRange) {
        params.append('start', customRange.start);
        params.append('end', customRange.end);
      }

      const response = await fetch(`${this.baseUrl}/dashboard?${params}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return this.getMockDashboardData();
    }
  }

  async getTimeSeriesData(timeRange: string = '7d', customRange?: { start: string; end: string }): Promise<TimeSeriesData[]> {
    try {
      const params = new URLSearchParams({ timeRange });
      if (customRange) {
        params.append('start', customRange.start);
        params.append('end', customRange.end);
      }

      const response = await fetch(`${this.baseUrl}/timeseries?${params}`);
      if (!response.ok) throw new Error('Failed to fetch time series data');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching time series data:', error);
      return this.getMockTimeSeriesData();
    }
  }

  async exportData(format: 'csv' | 'excel', timeRange: string = '7d'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/export?format=${format}&timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to export data');
      
      return await response.blob();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async sendEmailSummary(recipients: string[], settings: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/email-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          settings,
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending email summary:', error);
      return false;
    }
  }

  private getMockDashboardData(): AnalyticsData {
    return {
      revenue: {
        today: 2840.30,
        month: 45230.85,
        lifetime: 234567.89,
        growth: {
          daily: 12.5,
          monthly: 8.3,
          yearly: 24.7
        }
      },
      orders: {
        total: 1247,
        byStatus: {
          paid: 145,
          pending: 23,
          shipped: 34,
          returned: 12,
          cancelled: 11
        },
        growth: 15.2
      },
      traffic: {
        visitors: 1234,
        pageViews: 3456,
        bounceRate: 32.5,
        avgSessionDuration: 245,
        conversionRate: 3.2,
        sources: {
          organic: 45,
          direct: 30,
          social: 15,
          referral: 10
        }
      },
      products: {
        topSelling: [
          { id: '1', name: 'Premium Leather Jacket', sales: 89, revenue: 12450, growth: 23.5 },
          { id: '2', name: 'Designer Silk Dress', sales: 67, revenue: 9380, growth: 18.2 },
          { id: '3', name: 'Wireless Earbuds Pro', sales: 134, revenue: 8040, growth: 45.8 },
          { id: '4', name: 'Organic Cotton T-Shirt', sales: 156, revenue: 7020, growth: 12.3 },
          { id: '5', name: 'Sports Running Shoes', sales: 78, revenue: 6240, growth: 31.7 }
        ],
        lowStock: [
          { id: '1', name: 'Premium Leather Jacket', stock: 5, threshold: 10 },
          { id: '2', name: 'Designer Silk Dress', stock: 3, threshold: 15 },
          { id: '3', name: 'Wireless Earbuds Pro', stock: 8, threshold: 20 }
        ]
      },
      users: {
        total: 892,
        new: 189,
        active: 567,
        growth: 21.2,
        retention: 68.5
      }
    };
  }

  private getMockTimeSeriesData(): TimeSeriesData[] {
    const data: TimeSeriesData[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 2000) + 3000,
        orders: Math.floor(Math.random() * 20) + 15,
        visitors: Math.floor(Math.random() * 500) + 800,
        pageViews: Math.floor(Math.random() * 1000) + 2000,
        bounceRate: Math.floor(Math.random() * 20) + 25,
        conversionRate: Math.floor(Math.random() * 3) + 2
      });
    }
    
    return data;
  }

  generateCSVReport(data: AnalyticsData, timeSeriesData: TimeSeriesData[]): string {
    const headers = [
      'Date',
      'Revenue',
      'Orders',
      'Visitors',
      'Page Views',
      'Bounce Rate (%)',
      'Conversion Rate (%)'
    ];

    const rows = timeSeriesData.map(item => [
      item.date,
      item.revenue.toFixed(2),
      item.orders.toString(),
      item.visitors.toString(),
      item.pageViews.toString(),
      item.bounceRate.toFixed(1),
      item.conversionRate.toFixed(1)
    ]);

    // Add summary section
    const summaryRows = [
      [''],
      ['SUMMARY'],
      ['Total Revenue', data.revenue.lifetime.toFixed(2)],
      ['Monthly Revenue', data.revenue.month.toFixed(2)],
      ['Today Revenue', data.revenue.today.toFixed(2)],
      ['Total Orders', data.orders.total.toString()],
      ['Total Users', data.users.total.toString()],
      ['New Users', data.users.new.toString()],
      [''],
      ['TOP PRODUCTS'],
      ['Product Name', 'Sales', 'Revenue']
    ];

    data.products.topSelling.forEach(product => {
      summaryRows.push([product.name, product.sales.toString(), product.revenue.toFixed(2)]);
    });

    const allRows = [headers, ...rows, ...summaryRows];
    return allRows.map(row => row.join(',')).join('\n');
  }

  generateExcelReport(data: AnalyticsData, timeSeriesData: TimeSeriesData[]): any {
    // This would integrate with a library like xlsx or exceljs
    // For now, return structured data that can be converted to Excel
    return {
      worksheets: [
        {
          name: 'Dashboard Summary',
          data: [
            ['Metric', 'Value'],
            ['Total Revenue', data.revenue.lifetime],
            ['Monthly Revenue', data.revenue.month],
            ['Today Revenue', data.revenue.today],
            ['Total Orders', data.orders.total],
            ['Total Users', data.users.total],
            ['New Users', data.users.new],
            ['Bounce Rate', data.traffic.bounceRate],
            ['Conversion Rate', data.traffic.conversionRate]
          ]
        },
        {
          name: 'Time Series Data',
          data: [
            ['Date', 'Revenue', 'Orders', 'Visitors', 'Page Views', 'Bounce Rate', 'Conversion Rate'],
            ...timeSeriesData.map(item => [
              item.date,
              item.revenue,
              item.orders,
              item.visitors,
              item.pageViews,
              item.bounceRate,
              item.conversionRate
            ])
          ]
        },
        {
          name: 'Top Products',
          data: [
            ['Product Name', 'Sales', 'Revenue', 'Growth'],
            ...data.products.topSelling.map(product => [
              product.name,
              product.sales,
              product.revenue,
              product.growth
            ])
          ]
        }
      ]
    };
  }

  async scheduleEmailSummary(settings: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/schedule-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      return response.ok;
    } catch (error) {
      console.error('Error scheduling email summary:', error);
      return false;
    }
  }

  async getEmailSummarySettings(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/email-settings`);
      if (!response.ok) throw new Error('Failed to fetch email settings');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching email settings:', error);
      return {
        enabled: false,
        frequency: 'daily',
        time: '09:00',
        recipients: [],
        includeCharts: true,
        includeTopProducts: true,
        includeTrafficStats: true,
        includeOrderSummary: true,
        customMessage: ''
      };
    }
  }
}

export const analyticsService = new AnalyticsService();