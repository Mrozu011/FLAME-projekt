


export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId: string;
  type: 'text' | 'quick_reply' | 'product_card' | 'order_status';
  metadata?: any;
}

export interface ChatSession {
  id: string;
  userId?: string;
  userEmail?: string;
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  status: 'active' | 'closed' | 'escalated';
  assignedAgent?: string;
  language: string;
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface QATrainingPair {
  id: string;
  question: string;
  answer: string;
  category: string;
  language: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotAnalytics {
  totalSessions: number;
  activeSessions: number;
  avgSessionDuration: number;
  topQuestions: { question: string; count: number }[];
  resolutionRate: number;
  escalationRate: number;
  satisfactionScore: number;
  messagesPerSession: number;
}

class ChatbotService {
  private sessions: Map<string, ChatSession> = new Map();
  private trainingData: QATrainingPair[] = [];
  private analytics: ChatbotAnalytics = {
    totalSessions: 0,
    activeSessions: 0,
    avgSessionDuration: 0,
    topQuestions: [],
    resolutionRate: 0,
    escalationRate: 0,
    satisfactionScore: 0,
    messagesPerSession: 0
  };
  private subscribers: ((sessions: ChatSession[]) => void)[] = [];

  constructor() {
    this.loadData();
    this.initializeDefaultTrainingData();
  }

  private loadData() {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionsData = localStorage.getItem('chatbot-sessions');
      if (sessionsData) {
        const parsed = JSON.parse(sessionsData);
        parsed.forEach((session: any) => {
          this.sessions.set(session.id, {
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          });
        });
      }

      const trainingData = localStorage.getItem('chatbot-training');
      if (trainingData) {
        this.trainingData = JSON.parse(trainingData).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }));
      }

      const analyticsData = localStorage.getItem('chatbot-analytics');
      if (analyticsData) {
        this.analytics = JSON.parse(analyticsData);
      }
    } catch (error) {
      console.error('Error loading chatbot data:', error);
    }
  }

  private saveData() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('chatbot-sessions', JSON.stringify(Array.from(this.sessions.values())));
      localStorage.setItem('chatbot-training', JSON.stringify(this.trainingData));
      localStorage.setItem('chatbot-analytics', JSON.stringify(this.analytics));
    } catch (error) {
      console.error('Error saving chatbot data:', error);
    }
  }

  private initializeDefaultTrainingData() {
    if (this.trainingData.length === 0) {
      const defaultTraining: Omit<QATrainingPair, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          question: "What are your store hours?",
          answer: "We're open 24/7 online! Our customer service team is available Monday-Friday 9AM-6PM EST.",
          category: "store_info",
          language: "en",
          keywords: ["hours", "open", "time", "available"]
        },
        {
          question: "How can I track my order?",
          answer: "You can track your order by entering your order ID or email address. I can help you with that right now!",
          category: "orders",
          language: "en",
          keywords: ["track", "order", "shipping", "status"]
        },
        {
          question: "What sizes do you have?",
          answer: "We offer sizes XS, S, M, L, XL, and XXL for most items. Would you like me to check availability for a specific product?",
          category: "products",
          language: "en",
          keywords: ["size", "sizing", "fit", "measurements"]
        },
        {
          question: "What is your return policy?",
          answer: "We offer free returns within 30 days of purchase. Items must be in original condition with tags attached.",
          category: "returns",
          language: "en",
          keywords: ["return", "exchange", "refund", "policy"]
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes! We ship worldwide. International shipping typically takes 7-14 business days.",
          category: "shipping",
          language: "en",
          keywords: ["international", "shipping", "worldwide", "delivery"]
        },
        {
          question: "How do I contact customer service?",
          answer: "You can reach our customer service team via email at support@flame-fashion.com or through this chat. Would you like me to escalate this to a human agent?",
          category: "support",
          language: "en",
          keywords: ["contact", "support", "help", "human", "agent"]
        }
      ];

      defaultTraining.forEach(item => {
        this.addTrainingPair(item);
      });
    }
  }

  createSession(language: string = 'en'): ChatSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      startTime: new Date(),
      messages: [],
      status: 'active',
      language
    };

    this.sessions.set(sessionId, session);
    this.analytics.totalSessions++;
    this.analytics.activeSessions++;
    this.saveData();
    this.notifySubscribers();

    // Welcome message
    this.addMessage(sessionId, {
      id: `msg_${Date.now()}`,
      content: "Hi! I'm your shopping assistant. I can help you find products, check order status, answer questions about sizing, and more. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      sessionId,
      type: 'text'
    });

    return session;
  }

  async sendMessage(sessionId: string, content: string, userInfo?: any): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      sessionId,
      type: 'text'
    };

    this.addMessage(sessionId, userMessage);

    // Update user info if provided
    if (userInfo) {
      session.userInfo = { ...session.userInfo, ...userInfo };
    }

    // Process message and generate response
    const response = await this.processMessage(content, session);
    
    // Add bot response
    type ChatMessageType = 'text' | 'quick_reply' | 'product_card' | 'order_status';
    const allowedTypes: ChatMessageType[] = ['text', 'quick_reply', 'product_card', 'order_status'];
    const type: ChatMessageType = allowedTypes.includes(response.type as ChatMessageType)
      ? (response.type as ChatMessageType)
      : 'text';

    const botMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      content: response.content,
      sender: 'bot',
      timestamp: new Date(),
      sessionId,
      type,
      metadata: response.metadata
    };

    this.addMessage(sessionId, botMessage);
    this.saveData();
    this.notifySubscribers();

    return botMessage;
  }

  private async processMessage(content: string, session: ChatSession): Promise<{
    content: string;
    type?: string;
    metadata?: any;
  }> {
    const lowerContent = content.toLowerCase();
    
    // Check for order tracking intent
    if (this.isOrderTrackingIntent(lowerContent)) {
      return this.handleOrderTracking(content, session);
    }

    // Check for product questions
    if (this.isProductQuestionIntent(lowerContent)) {
      return this.handleProductQuestion(content, session);
    }

    // Check for size questions
    if (this.isSizeQuestionIntent(lowerContent)) {
      return this.handleSizeQuestion(content, session);
    }

    // Check for escalation request
    if (this.isEscalationIntent(lowerContent)) {
      return this.handleEscalation(session);
    }

    // Check training data for matching Q&A
    const matchingPair = this.findMatchingTrainingPair(content, session.language);
    if (matchingPair) {
      return {
        content: matchingPair.answer,
        type: 'text'
      };
    }

    // Default response with suggestions
    return {
      content: "I'm not sure about that. I can help you with:\n• Product information and sizing\n• Order tracking\n• Return policy\n• Shipping information\n\nWhat would you like to know?",
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          "Track my order",
          "Size guide",
          "Return policy",
          "Talk to human"
        ]
      }
    };
  }

  private isOrderTrackingIntent(content: string): boolean {
    const keywords = ['track', 'order', 'status', 'shipping', 'where is', 'delivery'];
    return keywords.some(keyword => content.includes(keyword));
  }

  private isProductQuestionIntent(content: string): boolean {
    const keywords = ['product', 'item', 'buy', 'price', 'available', 'stock'];
    return keywords.some(keyword => content.includes(keyword));
  }

  private isSizeQuestionIntent(content: string): boolean {
    const keywords = ['size', 'fit', 'measurements', 'sizing', 'xs', 'small', 'medium', 'large', 'xl'];
    return keywords.some(keyword => content.includes(keyword));
  }

  private isEscalationIntent(content: string): boolean {
    const keywords = ['human', 'agent', 'support', 'speak to', 'talk to', 'representative'];
    return keywords.some(keyword => content.includes(keyword));
  }

  private handleOrderTracking(content: string, session: ChatSession): {
    content: string;
    type: string;
    metadata: any;
  } {
    // Extract order ID or email from content
    const orderIdMatch = content.match(/[A-Z0-9]{6,}/);
    const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    if (orderIdMatch || emailMatch) {
      // Mock order status
      const mockOrderStatus = {
        orderId: orderIdMatch ? orderIdMatch[0] : 'FL-2024-001',
        status: 'Shipped',
        trackingNumber: 'TN123456789',
        estimatedDelivery: '2024-01-15',
        items: [
          { name: 'Cotton T-Shirt', quantity: 2, price: 29.99 },
          { name: 'Denim Jeans', quantity: 1, price: 79.99 }
        ]
      };

      return {
        content: `Great! I found your order #${mockOrderStatus.orderId}. 

📦 Status: ${mockOrderStatus.status}
🚚 Tracking: ${mockOrderStatus.trackingNumber}
📅 Estimated Delivery: ${mockOrderStatus.estimatedDelivery}

Items in your order:
${mockOrderStatus.items.map(item => `• ${item.name} (${item.quantity}x) - $${item.price}`).join('\n')}

Would you like me to send tracking updates to your email?`,
        type: 'order_status',
        metadata: mockOrderStatus
      };
    }

    return {
      content: "I'd be happy to help you track your order! Please provide either:\n• Your order ID (e.g., FL-2024-001)\n• The email address used for the order",
      type: 'text',
      metadata: {}
    };
  }

  private handleProductQuestion(content: string, session: ChatSession): {
    content: string;
    type: string;
    metadata: any;
  } {
    // Mock product recommendations based on content
    const mockProducts = [
      {
        id: 'prod_1',
        name: 'Classic Cotton T-Shirt',
        price: 29.99,
        image: 'https://readdy.ai/api/search-image?query=classic%20white%20cotton%20t-shirt%20minimal%20clean%20product%20photography%20white%20background%20studio%20lighting%20high%20quality&width=300&height=300&seq=prod1&orientation=squarish',
        availability: 'In Stock',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        id: 'prod_2',
        name: 'Slim Fit Denim Jeans',
        price: 79.99,
        image: 'https://readdy.ai/api/search-image?query=blue%20denim%20jeans%20slim%20fit%20modern%20casual%20wear%20product%20photography%20white%20background%20studio%20lighting%20high%20quality&width=300&height=300&seq=prod2&orientation=squarish',
        availability: 'In Stock',
        sizes: ['28', '30', '32', '34', '36']
      }
    ];

    return {
      content: "Here are some popular products that might interest you:",
      type: 'product_card',
      metadata: {
        products: mockProducts
      }
    };
  }

  private handleSizeQuestion(content: string, session: ChatSession): {
    content: string;
    type: string;
    metadata: any;
  } {
    return {
      content: `Here's our sizing guide:

👕 **Tops (T-shirts, Shirts)**
• XS: Chest 32-34"
• S: Chest 34-36"
• M: Chest 36-38"
• L: Chest 38-40"
• XL: Chest 40-42"
• XXL: Chest 42-44"

👖 **Bottoms (Jeans, Pants)**
• Available in waist sizes 28-40
• Inseam lengths: 30", 32", 34"

📏 **How to measure:**
• Chest: Around the fullest part
• Waist: Around the narrowest part
• Hips: Around the fullest part

Need help with a specific item? Just ask!`,
      type: 'text',
      metadata: {}
    };
  }

  private handleEscalation(session: ChatSession): {
    content: string;
    type: string;
    metadata: any;
  } {
    session.status = 'escalated';
    this.analytics.escalationRate++;
    
    return {
      content: "I'm connecting you with a human agent. Please hold on while I transfer your conversation. A customer service representative will be with you shortly.\n\nIn the meantime, you can also reach us at:\n📧 support@flame-fashion.com\n📞 1-800-FLAME-99",
      type: 'text',
      metadata: {
        escalated: true
      }
    };
  }

  private findMatchingTrainingPair(content: string, language: string): QATrainingPair | null {
    const lowerContent = content.toLowerCase();
    
    return this.trainingData.find(pair => 
      pair.language === language && 
      (pair.keywords.some(keyword => lowerContent.includes(keyword.toLowerCase())) ||
       lowerContent.includes(pair.question.toLowerCase()))
    ) || null;
  }

  private addMessage(sessionId: string, message: ChatMessage) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push(message);
    }
  }

  closeSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'closed';
      session.endTime = new Date();
      this.analytics.activeSessions--;
      this.saveData();
      this.notifySubscribers();
    }
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  getActiveSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).filter(session => session.status === 'active');
  }

  // Training data management
  addTrainingPair(data: Omit<QATrainingPair, 'id' | 'createdAt' | 'updatedAt'>): QATrainingPair {
    const pair: QATrainingPair = {
      ...data,
      id: `qa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trainingData.push(pair);
    this.saveData();
    return pair;
  }

  updateTrainingPair(id: string, updates: Partial<QATrainingPair>): QATrainingPair | null {
    const index = this.trainingData.findIndex(pair => pair.id === id);
    if (index !== -1) {
      this.trainingData[index] = {
        ...this.trainingData[index],
        ...updates,
        updatedAt: new Date()
      };
      this.saveData();
      return this.trainingData[index];
    }
    return null;
  }

  deleteTrainingPair(id: string): boolean {
    const index = this.trainingData.findIndex(pair => pair.id === id);
    if (index !== -1) {
      this.trainingData.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  getTrainingData(): QATrainingPair[] {
    return this.trainingData;
  }

  // Analytics
  getAnalytics(): ChatbotAnalytics {
    this.updateAnalytics();
    return this.analytics;
  }

  private updateAnalytics() {
    const sessions = Array.from(this.sessions.values());
    const completedSessions = sessions.filter(s => s.status === 'closed');
    
    this.analytics.totalSessions = sessions.length;
    this.analytics.activeSessions = sessions.filter(s => s.status === 'active').length;
    
    if (completedSessions.length > 0) {
      const totalDuration = completedSessions.reduce((sum, session) => {
        if (session.endTime) {
          return sum + (session.endTime.getTime() - session.startTime.getTime());
        }
        return sum;
      }, 0);
      this.analytics.avgSessionDuration = totalDuration / completedSessions.length;
    }

    // Calculate top questions
    const questionCounts = new Map<string, number>();
    sessions.forEach(session => {
      session.messages.forEach(msg => {
        if (msg.sender === 'user') {
          const count = questionCounts.get(msg.content) || 0;
          questionCounts.set(msg.content, count + 1);
        }
      });
    });

    this.analytics.topQuestions = Array.from(questionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }));

    this.analytics.escalationRate = (sessions.filter(s => s.status === 'escalated').length / sessions.length) * 100;
    this.analytics.resolutionRate = (completedSessions.length / sessions.length) * 100;
    this.analytics.satisfactionScore = 4.2; // Mock satisfaction score
    this.analytics.messagesPerSession = sessions.length > 0 ? 
      sessions.reduce((sum, s) => sum + s.messages.length, 0) / sessions.length : 0;
  }

  // Subscription for real-time updates
  subscribe(callback: (sessions: ChatSession[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      callback(Array.from(this.sessions.values()));
    });
  }

  // Language support
  async translateMessage(message: string, fromLang: string, toLang: string): Promise<string> {
    // Mock translation - in real implementation, use translation API
    const translations: { [key: string]: { [key: string]: string } } = {
      'en': {
        'es': 'Hola! Soy tu asistente de compras. ¿Cómo puedo ayudarte hoy?',
        'fr': 'Salut! Je suis votre assistant shopping. Comment puis-je vous aider aujourd\'hui?',
        'de': 'Hallo! Ich bin Ihr Einkaufsassistent. Wie kann ich Ihnen heute helfen?'
      }
    };

    return translations[fromLang]?.[toLang] || message;
  }

  // WhatsApp/Instagram integration placeholders
  async sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    // Mock WhatsApp integration
    console.log(`Sending WhatsApp message to ${to}: ${message}`);
    return true;
  }

  async sendInstagramMessage(recipientId: string, message: string): Promise<boolean> {
    // Mock Instagram integration
    console.log(`Sending Instagram message to ${recipientId}: ${message}`);
    return true;
  }
}

export const chatbotService = new ChatbotService();
