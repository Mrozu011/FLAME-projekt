interface ShippingConfig {
  packeta?: {
    apiKey: string;
    apiPassword: string;
    senderId: string;
    baseUrl: string;
  };
  dpd?: {
    apiKey: string;
    username: string;
    password: string;
    baseUrl: string;
  };
  inpost?: {
    apiKey: string;
    organizationId: string;
    baseUrl: string;
  };
}

interface ShippingAddress {
  name: string;
  company?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

interface ShippingPackage {
  weight: number; // in kg
  dimensions: {
    length: number; // in cm
    width: number;
    height: number;
  };
  value: number;
  description: string;
}

interface ShippingRequest {
  orderId: string;
  carrier: 'packeta' | 'dpd' | 'inpost';
  service: string;
  from: ShippingAddress;
  to: ShippingAddress;
  package: ShippingPackage;
  options?: {
    insurance?: boolean;
    cod?: boolean;
    codAmount?: number;
    pickup?: boolean;
    pickupPoint?: string;
  };
}

interface ShippingLabel {
  id: string;
  trackingNumber: string;
  labelUrl: string;
  cost: number;
  currency: string;
  estimatedDelivery: string;
  carrier: string;
  service: string;
}

interface TrackingInfo {
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned';
  carrier: string;
  events: TrackingEvent[];
  estimatedDelivery?: string;
  deliveredAt?: string;
}

interface TrackingEvent {
  date: string;
  status: string;
  description: string;
  location?: string;
}

interface ShippingRate {
  carrier: string;
  service: string;
  cost: number;
  currency: string;
  estimatedDelivery: string;
  transitTime: number;
}

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: Record<string, string>;
  services: string[];
}

export class ShippingService {
  private config: ShippingConfig;

  constructor(config: ShippingConfig) {
    this.config = config;
  }

  async createShippingLabel(request: ShippingRequest): Promise<ShippingLabel> {
    switch (request.carrier) {
      case 'packeta':
        return await this.createPacketaLabel(request);
      case 'dpd':
        return await this.createDpdLabel(request);
      case 'inpost':
        return await this.createInpostLabel(request);
      default:
        throw new Error(`Unsupported carrier: ${request.carrier}`);
    }
  }

  private async createPacketaLabel(request: ShippingRequest): Promise<ShippingLabel> {
    if (!this.config.packeta) {
      throw new Error('Packeta not configured');
    }

    const payload = {
      apiPassword: this.config.packeta.apiPassword,
      packetAttributes: {
        number: request.orderId,
        name: request.to.name,
        surname: request.to.name.split(' ').slice(1).join(' '),
        company: request.to.company || '',
        email: request.to.email || '',
        phone: request.to.phone || '',
        addressId: request.options?.pickupPoint || null,
        value: request.package.value,
        weight: request.package.weight,
        size: this.calculatePacketaSize(request.package.dimensions),
        cod: request.options?.cod ? request.options.codAmount : null,
        currency: 'CZK'
      }
    };

    try {
      const response = await fetch(`${this.config.packeta.baseUrl}/packets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.packeta.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Packeta API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Get label PDF
      const labelResponse = await fetch(`${this.config.packeta.baseUrl}/packets/${data.id}/label/`, {
        headers: {
          'Authorization': `Bearer ${this.config.packeta.apiKey}`
        }
      });

      const labelBlob = await labelResponse.blob();
      const labelUrl = URL.createObjectURL(labelBlob);

      return {
        id: data.id,
        trackingNumber: data.barcode,
        labelUrl,
        cost: data.cost || 0,
        currency: 'CZK',
        estimatedDelivery: this.calculateEstimatedDelivery(2),
        carrier: 'packeta',
        service: request.service
      };
    } catch (error) {
      console.error('Packeta label creation failed:', error);
      throw error;
    }
  }

  private async createDpdLabel(request: ShippingRequest): Promise<ShippingLabel> {
    if (!this.config.dpd) {
      throw new Error('DPD not configured');
    }

    const payload = {
      orderType: 'consignment',
      collectionOnDelivery: request.options?.cod,
      invoice: request.options?.codAmount || 0,
      parcel: {
        weight: request.package.weight * 1000, // Convert to grams
        printOptions: {
          printOption: 'allDocuments',
          printerLanguage: 'PDF'
        }
      },
      productAndServiceData: {
        orderType: 'consignment',
        saturdayDelivery: false,
        sundayDelivery: false
      },
      receiverDetails: {
        receiverName1: request.to.name,
        receiverName2: request.to.company || '',
        receiverAddress1: request.to.street,
        receiverCity: request.to.city,
        receiverCountry: request.to.country,
        receiverPostCode: request.to.postalCode,
        receiverPhone: request.to.phone || '',
        receiverEmail: request.to.email || ''
      }
    };

    try {
      const response = await fetch(`${this.config.dpd.baseUrl}/shipping/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.dpd.username}:${this.config.dpd.password}`)}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`DPD API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.shipmentId,
        trackingNumber: data.mpsId,
        labelUrl: data.labelURL,
        cost: data.cost || 0,
        currency: 'EUR',
        estimatedDelivery: this.calculateEstimatedDelivery(1),
        carrier: 'dpd',
        service: request.service
      };
    } catch (error) {
      console.error('DPD label creation failed:', error);
      throw error;
    }
  }

  private async createInpostLabel(request: ShippingRequest): Promise<ShippingLabel> {
    if (!this.config.inpost) {
      throw new Error('InPost not configured');
    }

    const payload = {
      receiver: {
        name: request.to.name,
        email: request.to.email || '',
        phone: request.to.phone || ''
      },
      parcels: [{
        dimensions: {
          length: request.package.dimensions.length,
          width: request.package.dimensions.width,
          height: request.package.dimensions.height,
          unit: 'cm'
        },
        weight: {
          amount: request.package.weight,
          unit: 'kg'
        },
        value: request.package.value
      }],
      service: request.service,
      reference: request.orderId,
      cod_amount: request.options?.cod ? request.options.codAmount : null
    };

    if (request.options?.pickupPoint) {
      (payload as any).custom_attributes = {
        target_point: request.options.pickupPoint
      };
    }

    try {
      const response = await fetch(`${this.config.inpost.baseUrl}/v1/organizations/${this.config.inpost.organizationId}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.inpost.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`InPost API error: ${response.status}`);
      }

      const data = await response.json();

      // Get label
      const labelResponse = await fetch(`${this.config.inpost.baseUrl}/v1/organizations/${this.config.inpost.organizationId}/shipments/${data.id}/label`, {
        headers: {
          'Authorization': `Bearer ${this.config.inpost.apiKey}`,
          'Accept': 'application/pdf'
        }
      });

      const labelBlob = await labelResponse.blob();
      const labelUrl = URL.createObjectURL(labelBlob);

      return {
        id: data.id,
        trackingNumber: data.tracking_number,
        labelUrl,
        cost: data.cost || 0,
        currency: 'PLN',
        estimatedDelivery: this.calculateEstimatedDelivery(1),
        carrier: 'inpost',
        service: request.service
      };
    } catch (error) {
      console.error('InPost label creation failed:', error);
      throw error;
    }
  }

  async trackShipment(trackingNumber: string, carrier: string): Promise<TrackingInfo> {
    switch (carrier) {
      case 'packeta':
        return await this.trackPacketaShipment(trackingNumber);
      case 'dpd':
        return await this.trackDpdShipment(trackingNumber);
      case 'inpost':
        return await this.trackInpostShipment(trackingNumber);
      default:
        throw new Error(`Unsupported carrier: ${carrier}`);
    }
  }

  private async trackPacketaShipment(trackingNumber: string): Promise<TrackingInfo> {
    if (!this.config.packeta) {
      throw new Error('Packeta not configured');
    }

    try {
      const response = await fetch(`${this.config.packeta.baseUrl}/packet-status/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.config.packeta.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Packeta tracking error: ${response.status}`);
      }

      const data = await response.json();

      return {
        trackingNumber,
        status: this.mapPacketaStatus(data.status),
        carrier: 'packeta',
        events: data.events?.map((event: any) => ({
          date: event.date,
          status: event.status,
          description: event.description,
          location: event.location
        })) || [],
        estimatedDelivery: data.estimatedDelivery,
        deliveredAt: data.deliveredAt
      };
    } catch (error) {
      console.error('Packeta tracking failed:', error);
      throw error;
    }
  }

  private async trackDpdShipment(trackingNumber: string): Promise<TrackingInfo> {
    if (!this.config.dpd) {
      throw new Error('DPD not configured');
    }

    try {
      const response = await fetch(`${this.config.dpd.baseUrl}/tracking/${trackingNumber}`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.dpd.username}:${this.config.dpd.password}`)}`
        }
      });

      if (!response.ok) {
        throw new Error(`DPD tracking error: ${response.status}`);
      }

      const data = await response.json();

      return {
        trackingNumber,
        status: this.mapDpdStatus(data.status),
        carrier: 'dpd',
        events: data.events?.map((event: any) => ({
          date: event.date,
          status: event.status,
          description: event.description,
          location: event.location
        })) || [],
        estimatedDelivery: data.estimatedDelivery,
        deliveredAt: data.deliveredAt
      };
    } catch (error) {
      console.error('DPD tracking failed:', error);
      throw error;
    }
  }

  private async trackInpostShipment(trackingNumber: string): Promise<TrackingInfo> {
    if (!this.config.inpost) {
      throw new Error('InPost not configured');
    }

    try {
      const response = await fetch(`${this.config.inpost.baseUrl}/v1/tracking/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.config.inpost.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`InPost tracking error: ${response.status}`);
      }

      const data = await response.json();

      return {
        trackingNumber,
        status: this.mapInpostStatus(data.status),
        carrier: 'inpost',
        events: data.events?.map((event: any) => ({
          date: event.date,
          status: event.status,
          description: event.description,
          location: event.location
        })) || [],
        estimatedDelivery: data.estimatedDelivery,
        deliveredAt: data.deliveredAt
      };
    } catch (error) {
      console.error('InPost tracking failed:', error);
      throw error;
    }
  }

  async getShippingRates(from: ShippingAddress, to: ShippingAddress, pkg: ShippingPackage): Promise<ShippingRate[]> {
    const rates: ShippingRate[] = [];

    // Get rates from each carrier
    if (this.config.packeta) {
      const packetaRates = await this.getPacketaRates(from, to, pkg);
      rates.push(...packetaRates);
    }

    if (this.config.dpd) {
      const dpdRates = await this.getDpdRates(from, to, pkg);
      rates.push(...dpdRates);
    }

    if (this.config.inpost) {
      const inpostRates = await this.getInpostRates(from, to, pkg);
      rates.push(...inpostRates);
    }

    return rates.sort((a, b) => a.cost - b.cost);
  }

  private async getPacketaRates(from: ShippingAddress, to: ShippingAddress, pkg: ShippingPackage): Promise<ShippingRate[]> {
    // Mock implementation - in reality, call Packeta API
    return [
      {
        carrier: 'packeta',
        service: 'pickup_point',
        cost: 3.90,
        currency: 'EUR',
        estimatedDelivery: this.calculateEstimatedDelivery(2),
        transitTime: 2
      },
      {
        carrier: 'packeta',
        service: 'home_delivery',
        cost: 5.90,
        currency: 'EUR',
        estimatedDelivery: this.calculateEstimatedDelivery(3),
        transitTime: 3
      }
    ];
  }

  private async getDpdRates(from: ShippingAddress, to: ShippingAddress, pkg: ShippingPackage): Promise<ShippingRate[]> {
    // Mock implementation - in reality, call DPD API
    return [
      {
        carrier: 'dpd',
        service: 'classic',
        cost: 8.50,
        currency: 'EUR',
        estimatedDelivery: this.calculateEstimatedDelivery(1),
        transitTime: 1
      },
      {
        carrier: 'dpd',
        service: 'express',
        cost: 15.00,
        currency: 'EUR',
        estimatedDelivery: this.calculateEstimatedDelivery(1),
        transitTime: 1
      }
    ];
  }

  private async getInpostRates(from: ShippingAddress, to: ShippingAddress, pkg: ShippingPackage): Promise<ShippingRate[]> {
    // Mock implementation - in reality, call InPost API
    return [
      {
        carrier: 'inpost',
        service: 'paczkomat',
        cost: 10.99,
        currency: 'PLN',
        estimatedDelivery: this.calculateEstimatedDelivery(1),
        transitTime: 1
      },
      {
        carrier: 'inpost',
        service: 'kurier',
        cost: 15.99,
        currency: 'PLN',
        estimatedDelivery: this.calculateEstimatedDelivery(1),
        transitTime: 1
      }
    ];
  }

  async getPickupPoints(carrier: string, address: ShippingAddress, radius: number = 5): Promise<PickupPoint[]> {
    switch (carrier) {
      case 'packeta':
        return await this.getPacketaPickupPoints(address, radius);
      case 'inpost':
        return await this.getInpostPickupPoints(address, radius);
      default:
        return [];
    }
  }

  private async getPacketaPickupPoints(address: ShippingAddress, radius: number): Promise<PickupPoint[]> {
    if (!this.config.packeta) {
      throw new Error('Packeta not configured');
    }

    try {
      const response = await fetch(`${this.config.packeta.baseUrl}/branch-offices?address=${encodeURIComponent(address.street + ' ' + address.city)}&radius=${radius}`, {
        headers: {
          'Authorization': `Bearer ${this.config.packeta.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Packeta pickup points error: ${response.status}`);
      }

      const data = await response.json();

      return data.map((point: any) => ({
        id: point.id,
        name: point.name,
        address: point.address,
        city: point.city,
        postalCode: point.zip,
        country: point.country,
        coordinates: {
          latitude: point.latitude,
          longitude: point.longitude
        },
        openingHours: point.openingHours,
        services: point.services
      }));
    } catch (error) {
      console.error('Packeta pickup points failed:', error);
      return [];
    }
  }

  private async getInpostPickupPoints(address: ShippingAddress, radius: number): Promise<PickupPoint[]> {
    if (!this.config.inpost) {
      throw new Error('InPost not configured');
    }

    try {
      const response = await fetch(`${this.config.inpost.baseUrl}/v1/points?address=${encodeURIComponent(address.street + ' ' + address.city)}&radius=${radius}`, {
        headers: {
          'Authorization': `Bearer ${this.config.inpost.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`InPost pickup points error: ${response.status}`);
      }

      const data = await response.json();

      return data.map((point: any) => ({
        id: point.name,
        name: point.name,
        address: point.address.line1,
        city: point.address.city,
        postalCode: point.address.post_code,
        country: point.address.country_code,
        coordinates: {
          latitude: point.location.latitude,
          longitude: point.location.longitude
        },
        openingHours: point.opening_hours,
        services: point.services
      }));
    } catch (error) {
      console.error('InPost pickup points failed:', error);
      return [];
    }
  }

  private calculatePacketaSize(dimensions: { length: number; width: number; height: number }): number {
    const { length, width, height } = dimensions;
    const longestSide = Math.max(length, width, height);
    
    if (longestSide <= 15) return 1;
    if (longestSide <= 25) return 2;
    if (longestSide <= 35) return 3;
    if (longestSide <= 45) return 4;
    return 5;
  }

  private calculateEstimatedDelivery(days: number): string {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + days);
    return delivery.toISOString().split('T')[0];
  }

  private mapPacketaStatus(status: string): 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned' {
    const statusMap: Record<string, 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned'> = {
      'posted': 'pending',
      'in_transit': 'in_transit',
      'delivered': 'delivered',
      'exception': 'exception',
      'returned': 'returned'
    };
    return statusMap[status] || 'pending';
  }

  private mapDpdStatus(status: string): 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned' {
    const statusMap: Record<string, 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned'> = {
      'collected': 'pending',
      'in_transit': 'in_transit',
      'delivered': 'delivered',
      'exception': 'exception',
      'returned': 'returned'
    };
    return statusMap[status] || 'pending';
  }

  private mapInpostStatus(status: string): 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned' {
    const statusMap: Record<string, 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned'> = {
      'created': 'pending',
      'dispatched': 'in_transit',
      'delivered': 'delivered',
      'exception': 'exception',
      'returned': 'returned'
    };
    return statusMap[status] || 'pending';
  }

  getConfig(): ShippingConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ShippingConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Default configuration
const shippingConfig: ShippingConfig = {
  packeta: {
    apiKey: process.env.PACKETA_API_KEY || '',
    apiPassword: process.env.PACKETA_API_PASSWORD || '',
    senderId: process.env.PACKETA_SENDER_ID || '',
    baseUrl: process.env.PACKETA_BASE_URL || 'https://www.zasilkovna.cz/api/rest'
  },
  dpd: {
    apiKey: process.env.DPD_API_KEY || '',
    username: process.env.DPD_USERNAME || '',
    password: process.env.DPD_PASSWORD || '',
    baseUrl: process.env.DPD_BASE_URL || 'https://api.dpd.com'
  },
  inpost: {
    apiKey: process.env.INPOST_API_KEY || '',
    organizationId: process.env.INPOST_ORGANIZATION_ID || '',
    baseUrl: process.env.INPOST_BASE_URL || 'https://api-shipx-pl.easypack24.net'
  }
};

export const shippingService = new ShippingService(shippingConfig);