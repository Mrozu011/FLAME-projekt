'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';

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

export default function SupportMessagesPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<SupportMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyType, setReplyType] = useState<'customer' | 'internal'>('customer');

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    topic: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    open: 0,
    pending: 0,
    resolved: 0,
    avgResponseTime: 0,
    todayMessages: 0
  });

  const [adminUsers] = useState([
    { id: '1', name: 'Sarah Johnson', email: 'sarah@flamestore.com' },
    { id: '2', name: 'Mike Chen', email: 'mike@flamestore.com' },
    { id: '3', name: 'Emma Wilson', email: 'emma@flamestore.com' }
  ]);

  const topics = [
    'Product Question',
    'Order Issue',
    'Return Request',
    'Payment Problem',
    'Shipping Inquiry',
    'Technical Support',
    'Account Issue',
    'General Inquiry'
  ];

  useEffect(() => {
    loadSupportMessages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, messages]);

  const loadSupportMessages = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockMessages: SupportMessage[] = [
        {
          id: '1',
          ticketNumber: 'TK-2024-001',
          customerId: 'cust-001',
          customerName: 'John Smith',
          customerEmail: 'john.smith@example.com',
          subject: 'Issue with recent order',
          topic: 'Order Issue',
          message: 'Hi, I received my order yesterday but one of the items (Premium Leather Jacket) has a defect. The zipper is broken and there are some scratches on the leather. I would like to return or exchange this item. Order number: FL001. Please let me know the next steps.',
          status: 'new',
          priority: 'high',
          assignedTo: null,
          assignedAdmin: null,
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T10:30:00Z',
          lastReply: null,
          replies: [],
          attachments: [
            {
              id: 'att-1',
              filename: 'jacket-defect.jpg',
              url: 'https://readdy.ai/api/search-image?query=premium%20leather%20jacket%20with%20zipper%20defect%20and%20scratches%2C%20product%20quality%20issue%20photo%20with%20clear%20detail%20showing%20damaged%20areas&width=400&height=300&seq=defect1&orientation=landscape',
              size: 2048576,
              type: 'image/jpeg'
            }
          ],
          tags: ['defective-product', 'return-request']
        },
        {
          id: '2',
          ticketNumber: 'TK-2024-002',
          customerId: 'cust-002',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.johnson@example.com',
          subject: 'Payment not processing',
          topic: 'Payment Problem',
          message: 'Hello, I\'m trying to place an order but my payment keeps getting declined. I\'ve tried multiple cards and they all work fine elsewhere. The error message says "Payment processing failed, please try again." Can you help me resolve this issue?',
          status: 'open',
          priority: 'normal',
          assignedTo: '1',
          assignedAdmin: 'Sarah Johnson',
          createdAt: '2024-01-19T14:15:00Z',
          updatedAt: '2024-01-19T16:22:00Z',
          lastReply: '2024-01-19T16:22:00Z',
          replies: [
            {
              id: 'reply-1',
              messageId: '2',
              authorType: 'admin',
              authorId: '1',
              authorName: 'Sarah Johnson',
              content: 'Hi Sarah, I understand your frustration with the payment issue. Let me help you resolve this. Can you please try clearing your browser cache and cookies, then attempt the payment again? Also, please make sure your billing address matches exactly what\'s on file with your bank. If the issue persists, I can manually process your order. Please let me know which items you\'re trying to purchase.',
              isInternal: false,
              createdAt: '2024-01-19T16:22:00Z',
              attachments: []
            }
          ],
          attachments: [],
          tags: ['payment-issue', 'technical-support']
        },
        {
          id: '3',
          ticketNumber: 'TK-2024-003',
          customerId: 'cust-003',
          customerName: 'Mike Chen',
          customerEmail: 'mike.chen@example.com',
          subject: 'When will my order ship?',
          topic: 'Shipping Inquiry',
          message: 'Hi, I placed an order 5 days ago (Order #FL003) and it still shows as "processing" in my account. The estimated shipping time was 2-3 business days. Can you please provide an update on when my order will ship? I need it by next Friday for an event.',
          status: 'pending',
          priority: 'normal',
          assignedTo: '2',
          assignedAdmin: 'Mike Chen',
          createdAt: '2024-01-18T09:45:00Z',
          updatedAt: '2024-01-18T11:30:00Z',
          lastReply: '2024-01-18T11:30:00Z',
          replies: [
            {
              id: 'reply-2',
              messageId: '3',
              authorType: 'admin',
              authorId: '2',
              authorName: 'Mike Chen',
              content: 'Hi Mike, thank you for reaching out about your order. I\'ve checked with our warehouse team and your order is being prepared for shipment today. You should receive a tracking number via email within the next 2-3 hours. Given the urgency for your event, I\'ve also requested priority processing. Your order should arrive by Thursday, well before your Friday event.',
              isInternal: false,
              createdAt: '2024-01-18T11:30:00Z',
              attachments: []
            }
          ],
          attachments: [],
          tags: ['shipping-inquiry', 'urgent-delivery']
        },
        {
          id: '4',
          ticketNumber: 'TK-2024-004',
          customerId: 'cust-004',
          customerName: 'Emma Wilson',
          customerEmail: 'emma.wilson@example.com',
          subject: 'Size exchange request',
          topic: 'Return Request',
          message: 'Hello, I recently purchased a Designer Silk Dress (Order #FL004) but the size is too small. I ordered a Medium but need a Large. The dress is still in perfect condition with tags attached. Can I exchange it for a larger size? How do I initiate the exchange process?',
          status: 'resolved',
          priority: 'low',
          assignedTo: '3',
          assignedAdmin: 'Emma Wilson',
          createdAt: '2024-01-17T16:20:00Z',
          updatedAt: '2024-01-18T10:15:00Z',
          lastReply: '2024-01-18T10:15:00Z',
          replies: [
            {
              id: 'reply-3',
              messageId: '4',
              authorType: 'admin',
              authorId: '3',
              authorName: 'Emma Wilson',
              content: 'Hi Emma, absolutely! We can arrange a size exchange for you. Since the dress is in perfect condition with tags, this should be no problem. I\'ve initiated the exchange process and sent you a prepaid return label via email. Once we receive the Medium size, we\'ll immediately ship out the Large size. The exchange should be completed within 5-7 business days.',
              isInternal: false,
              createdAt: '2024-01-18T10:15:00Z',
              attachments: []
            },
            {
              id: 'reply-4',
              messageId: '4',
              authorType: 'customer',
              authorId: 'cust-004',
              authorName: 'Emma Wilson',
              content: 'Thank you so much for the quick response and easy exchange process! I\'ve printed the return label and will drop off the package today. I appreciate the excellent customer service.',
              isInternal: false,
              createdAt: '2024-01-18T10:15:00Z',
              attachments: []
            }
          ],
          attachments: [],
          tags: ['size-exchange', 'return-request', 'resolved']
        }
      ];

      setMessages(mockMessages);
      setFilteredMessages(mockMessages);
      
      // Calculate stats
      const stats = {
        total: mockMessages.length,
        new: mockMessages.filter(m => m.status === 'new').length,
        open: mockMessages.filter(m => m.status === 'open').length,
        pending: mockMessages.filter(m => m.status === 'pending').length,
        resolved: mockMessages.filter(m => m.status === 'resolved').length,
        avgResponseTime: 4.2,
        todayMessages: mockMessages.filter(m => 
          new Date(m.createdAt).toDateString() === new Date().toDateString()
        ).length
      };
      
      setStats(stats);
      setLoading(false);
    }, 1000);
  };

  const applyFilters = () => {
    let filtered = [...messages];

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(msg => msg.status === filters.status);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(msg => msg.priority === filters.priority);
    }

    // Assigned filter
    if (filters.assignedTo) {
      filtered = filtered.filter(msg => msg.assignedTo === filters.assignedTo);
    }

    // Topic filter
    if (filters.topic) {
      filtered = filtered.filter(msg => msg.topic === filters.topic);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.subject.toLowerCase().includes(searchTerm) ||
        msg.customerName.toLowerCase().includes(searchTerm) ||
        msg.customerEmail.toLowerCase().includes(searchTerm) ||
        msg.message.toLowerCase().includes(searchTerm) ||
        msg.ticketNumber.toLowerCase().includes(searchTerm)
      );
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(msg => msg.createdAt >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(msg => msg.createdAt <= filters.dateTo);
    }

    setFilteredMessages(filtered);
  };

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: newStatus as any, updatedAt: new Date().toISOString() }
        : msg
    ));
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(prev => prev ? { ...prev, status: newStatus as any } : null);
    }
  };

  const handleAssignMessage = async (messageId: string, adminId: string) => {
    const admin = adminUsers.find(u => u.id === adminId);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            assignedTo: adminId, 
            assignedAdmin: admin?.name || null,
            updatedAt: new Date().toISOString()
          }
        : msg
    ));
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(prev => prev ? { 
        ...prev, 
        assignedTo: adminId, 
        assignedAdmin: admin?.name || null 
      } : null);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyContent.trim()) return;

    setIsReplying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReply: SupportReply = {
        id: Date.now().toString(),
        messageId: selectedMessage.id,
        authorType: 'admin',
        authorId: '1',
        authorName: 'Current Admin',
        content: replyContent,
        isInternal: replyType === 'internal',
        createdAt: new Date().toISOString(),
        attachments: []
      };

      const updatedMessage = {
        ...selectedMessage,
        replies: [...selectedMessage.replies, newReply],
        lastReply: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: replyType === 'customer' ? 'open' as const : selectedMessage.status
      };

      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id ? updatedMessage : msg
      ));
      
      setSelectedMessage(updatedMessage);
      setReplyContent('');
      setShowReplyModal(false);
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return 'ri-mail-line';
      case 'open': return 'ri-mail-open-line';
      case 'pending': return 'ri-time-line';
      case 'resolved': return 'ri-check-line';
      case 'closed': return 'ri-lock-line';
      default: return 'ri-question-line';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading support messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Messages</h1>
                <p className="text-gray-600">Manage customer support tickets and inquiries</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowReplyModal(true)}
                  disabled={!selectedMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="ri-reply-line mr-2"></i>
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-mail-line text-blue-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-notification-line text-yellow-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New</p>
                    <p className="text-xl font-bold text-gray-900">{stats.new}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-mail-open-line text-orange-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Open</p>
                    <p className="text-xl font-bold text-gray-900">{stats.open}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-time-line text-purple-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-check-line text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-xl font-bold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-timer-line text-indigo-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="text-xl font-bold text-gray-900">{stats.avgResponseTime}h</p>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-calendar-line text-teal-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Today</p>
                    <p className="text-xl font-bold text-gray-900">{stats.todayMessages}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages List */}
          <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filters.assignedTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Assigned</option>
                    <option value="">Unassigned</option>
                    {adminUsers.map(admin => (
                      <option key={admin.id} value={admin.id}>{admin.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={filters.topic}
                    onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Topics</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search messages..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <i className="ri-inbox-line text-4xl mb-2"></i>
                    <p>No messages found</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                            <i className={`${getStatusIcon(message.status)} mr-1`}></i>
                            {message.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{message.ticketNumber}</span>
                      </div>
                      
                      <div className="mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{message.subject}</h3>
                        <p className="text-xs text-gray-600">{message.customerName} • {message.customerEmail}</p>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{message.topic}</span>
                          {message.attachments.length > 0 && (
                            <i className="ri-attachment-line text-gray-400 text-xs"></i>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {message.assignedAdmin && (
                            <span className="text-xs text-gray-500">→ {message.assignedAdmin}</span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="w-1/2 bg-white flex flex-col">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h2>
                      <p className="text-gray-600">{selectedMessage.ticketNumber}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="new">New</option>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select
                        value={selectedMessage.assignedTo || ''}
                        onChange={(e) => handleAssignMessage(selectedMessage.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {adminUsers.map(admin => (
                          <option key={admin.id} value={admin.id}>{admin.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Customer</p>
                      <p className="font-medium">{selectedMessage.customerName}</p>
                      <p className="text-gray-600">{selectedMessage.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Topic</p>
                      <p className="font-medium">{selectedMessage.topic}</p>
                      <p className="text-gray-600">Priority: {selectedMessage.priority}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Original Message */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-gray-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedMessage.customerName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedMessage.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">Customer</span>
                    </div>
                    <p className="text-gray-700 mb-3">{selectedMessage.message}</p>
                    
                    {selectedMessage.attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Attachments:</p>
                        {selectedMessage.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                            <i className="ri-attachment-line text-gray-400"></i>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{attachment.filename}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              <i className="ri-download-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {selectedMessage.replies.map((reply) => (
                    <div key={reply.id} className={`rounded-lg p-4 ${
                      reply.authorType === 'admin' 
                        ? reply.isInternal 
                          ? 'bg-yellow-50 border-l-4 border-yellow-400' 
                          : 'bg-blue-50 border-l-4 border-blue-400'
                        : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            reply.authorType === 'admin' ? 'bg-blue-200' : 'bg-gray-200'
                          }`}>
                            <i className={`${reply.authorType === 'admin' ? 'ri-shield-user-line' : 'ri-user-line'} text-${reply.authorType === 'admin' ? 'blue' : 'gray'}-600`}></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{reply.authorName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {reply.isInternal && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Internal
                            </span>
                          )}
                          <span className="text-xs text-gray-500 capitalize">{reply.authorType}</span>
                        </div>
                      </div>
                      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <i className="ri-mail-line text-4xl mb-2"></i>
                  <p>Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reply Modal */}
        {showReplyModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Reply to {selectedMessage.customerName}</h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reply Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="customer"
                        checked={replyType === 'customer'}
                        onChange={(e) => setReplyType(e.target.value as 'customer' | 'internal')}
                        className="mr-2"
                      />
                      <span className="text-sm">Reply to Customer</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="internal"
                        checked={replyType === 'internal'}
                        onChange={(e) => setReplyType(e.target.value as 'customer' | 'internal')}
                        className="mr-2"
                      />
                      <span className="text-sm">Internal Note</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message {replyType === 'internal' && '(Internal - Not visible to customer)'}
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={replyType === 'customer' ? 'Type your reply to the customer...' : 'Add an internal note...'}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use plain text or basic HTML formatting
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReplyModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReplying || !replyContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isReplying ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line mr-2"></i>
                        Send {replyType === 'internal' ? 'Note' : 'Reply'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}