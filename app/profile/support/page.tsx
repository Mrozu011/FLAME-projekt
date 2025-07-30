'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SupportMessage {
  id: string;
  ticketNumber: string;
  subject: string;
  topic: string;
  message: string;
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  replies: SupportReply[];
  attachments: SupportAttachment[];
}

interface SupportReply {
  id: string;
  authorType: 'customer' | 'admin';
  authorName: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

interface SupportAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export default function CustomerSupportPage() {
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);
  const [activeTab, setActiveTab] = useState('new');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newMessageForm, setNewMessageForm] = useState({
    subject: '',
    topic: '',
    message: '',
    attachments: [] as File[]
  });

  const supportTopics = [
    { value: 'product-question', label: 'Product Question' },
    { value: 'order-issue', label: 'Order Issue' },
    { value: 'return-request', label: 'Return Request' },
    { value: 'payment-problem', label: 'Payment Problem' },
    { value: 'shipping-inquiry', label: 'Shipping Inquiry' },
    { value: 'technical-support', label: 'Technical Support' },
    { value: 'account-issue', label: 'Account Issue' },
    { value: 'general-inquiry', label: 'General Inquiry' }
  ];

  useEffect(() => {
    checkUserSession();
    loadSupportMessages();
  }, []);

  const checkUserSession = () => {
    const session = localStorage.getItem('flame-user-session');
    if (!session) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedSession = JSON.parse(session);
      setUserSession(parsedSession);
    } catch {
      router.push('/login');
    }
  };

  const loadSupportMessages = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockMessages: SupportMessage[] = [
        {
          id: '1',
          ticketNumber: 'TK-2024-001',
          subject: 'Question about Premium Leather Jacket sizing',
          topic: 'Product Question',
          message: 'Hi, I\'m interested in purchasing the Premium Leather Jacket but I\'m not sure about the sizing. I usually wear a Medium in most brands, but I\'ve heard leather jackets can run small. Could you provide measurements for the Medium size? Also, what is your return policy if the size doesn\'t fit correctly?',
          status: 'resolved',
          priority: 'normal',
          createdAt: '2024-01-18T10:30:00Z',
          updatedAt: '2024-01-18T14:22:00Z',
          replies: [
            {
              id: 'reply-1',
              authorType: 'admin',
              authorName: 'Sarah Johnson',
              content: 'Hi! Thank you for your interest in our Premium Leather Jacket. For the Medium size, the measurements are: Chest: 42 inches, Length: 26 inches, Shoulder: 18 inches, Sleeve: 24 inches. Our leather jackets do run slightly small, so if you\'re between sizes, I\'d recommend sizing up. We offer free returns within 30 days, so you can always exchange if needed. The jacket comes with a detailed size guide that you can find on the product page. Feel free to reach out if you have any other questions!',
              createdAt: '2024-01-18T14:22:00Z',
              isInternal: false
            },
            {
              id: 'reply-2',
              authorType: 'customer',
              authorName: 'Customer',
              content: 'Perfect! Thank you for the detailed measurements and sizing advice. I\'ll go with a Large to be safe. Just placed my order. Looking forward to receiving it!',
              createdAt: '2024-01-18T14:45:00Z',
              isInternal: false
            }
          ],
          attachments: []
        },
        {
          id: '2',
          ticketNumber: 'TK-2024-002',
          subject: 'Order FL002 - Delayed shipping notification',
          topic: 'Order Issue',
          message: 'Hello, I placed order FL002 five days ago and selected standard shipping (2-3 business days). The order status still shows "Processing" and I haven\'t received any shipping confirmation. Could you please provide an update on my order status? I need the items by this weekend for a special event.',
          status: 'open',
          priority: 'high',
          createdAt: '2024-01-19T09:15:00Z',
          updatedAt: '2024-01-19T11:30:00Z',
          replies: [
            {
              id: 'reply-3',
              authorType: 'admin',
              authorName: 'Mike Chen',
              content: 'Hi, I sincerely apologize for the delay with your order FL002. I\'ve checked with our warehouse team and there was an unexpected delay with one of the items in your order. However, I\'ve escalated this to priority processing and your order will ship today via express delivery at no additional cost. You should receive a tracking number within 2-3 hours, and the package will arrive by Friday - in time for your weekend event. Again, I apologize for any inconvenience this may have caused.',
              createdAt: '2024-01-19T11:30:00Z',
              isInternal: false
            }
          ],
          attachments: []
        },
        {
          id: '3',
          ticketNumber: 'TK-2024-003',
          subject: 'Return request for Designer Silk Dress',
          topic: 'Return Request',
          message: 'Hi, I received my Designer Silk Dress yesterday (Order FL003) but unfortunately, the color doesn\'t match what I expected from the website photos. The dress appears more muted in person than the vibrant color shown online. I would like to return it for a refund. The dress is unworn with all tags attached. How do I proceed with the return?',
          status: 'pending',
          priority: 'normal',
          createdAt: '2024-01-20T13:45:00Z',
          updatedAt: '2024-01-20T13:45:00Z',
          replies: [],
          attachments: [
            {
              id: 'att-1',
              filename: 'dress-color-comparison.jpg',
              url: 'https://readdy.ai/api/search-image?query=designer%20silk%20dress%20color%20comparison%20showing%20difference%20between%20online%20photo%20and%20actual%20product%2C%20professional%20photography%20with%20natural%20lighting&width=400&height=300&seq=dress1&orientation=landscape',
              size: 1824567,
              type: 'image/jpeg'
            }
          ]
        }
      ];
      
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  };

  const handleNewMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageForm.subject.trim() || !newMessageForm.topic || !newMessageForm.message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newMessage: SupportMessage = {
        id: Date.now().toString(),
        ticketNumber: `TK-2024-${String(messages.length + 1).padStart(3, '0')}`,
        subject: newMessageForm.subject,
        topic: supportTopics.find(t => t.value === newMessageForm.topic)?.label || newMessageForm.topic,
        message: newMessageForm.message,
        status: 'new',
        priority: 'normal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        replies: [],
        attachments: newMessageForm.attachments.map((file, index) => ({
          id: `att-${Date.now()}-${index}`,
          filename: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type
        }))
      };

      setMessages(prev => [newMessage, ...prev]);
      setNewMessageForm({ subject: '', topic: '', message: '', attachments: [] });
      setShowNewMessageModal(false);
      
      // Simulate email notification
      alert('Your support request has been submitted successfully! You will receive an email confirmation shortly.');
      
    } catch (error) {
      alert('Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + newMessageForm.attachments.length > 3) {
      alert('You can upload maximum 3 files');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a supported image format`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setNewMessageForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeAttachment = (index: number) => {
    setNewMessageForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
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

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'new') return msg.status === 'new';
    if (activeTab === 'open') return msg.status === 'open' || msg.status === 'pending';
    if (activeTab === 'resolved') return msg.status === 'resolved' || msg.status === 'closed';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading support messages...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help with your orders, products, and account</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowNewMessageModal(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <i className="ri-add-line mr-2"></i>
            New Support Request
          </button>
          <button
            onClick={() => router.push('/faq')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <i className="ri-question-line mr-2"></i>
            View FAQ
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'new'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              New Messages
            </button>
            <button
              onClick={() => setActiveTab('open')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'open'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Open Messages
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">No messages in this category</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          <i className={`${getStatusIcon(message.status)} mr-1`}></i>
                          {message.status}
                        </span>
                        <span className="text-xs text-gray-500">{message.ticketNumber}</span>
                        <span className="text-xs text-gray-500">{message.topic}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{message.subject}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{message.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {new Date(message.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(message.updatedAt).toLocaleDateString()}</span>
                        {message.replies.length > 0 && (
                          <span>{message.replies.length} reply{message.replies.length > 1 ? 'ies' : ''}</span>
                        )}
                        {message.attachments.length > 0 && (
                          <span className="flex items-center">
                            <i className="ri-attachment-line mr-1"></i>
                            {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <i className="ri-arrow-right-line text-gray-400 ml-4"></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h3>
                  <p className="text-gray-600">{selectedMessage.ticketNumber} • {selectedMessage.topic}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                    <i className={`${getStatusIcon(selectedMessage.status)} mr-1`}></i>
                    {selectedMessage.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(selectedMessage.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Updated: {new Date(selectedMessage.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Message Thread */}
              <div className="space-y-6">
                {/* Original Message */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-gray-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">You</p>
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
                {selectedMessage.replies.filter(reply => !reply.isInternal).map((reply) => (
                  <div key={reply.id} className={`rounded-lg p-4 ${
                    reply.authorType === 'admin' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
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
                      <span className="text-xs text-gray-500 capitalize">
                        {reply.authorType === 'admin' ? 'Support Team' : 'You'}
                      </span>
                    </div>
                    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
                  </div>
                ))}
              </div>

              {/* Status Info */}
              {selectedMessage.status === 'resolved' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line text-green-600 mr-2"></i>
                    <p className="text-green-800">This support request has been resolved. If you need further assistance, please create a new support request.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Message Modal */}
        {showNewMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">New Support Request</h3>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleNewMessageSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMessageForm.subject}
                    onChange={(e) => setNewMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newMessageForm.topic}
                    onChange={(e) => setNewMessageForm(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a topic</option>
                    {supportTopics.map(topic => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newMessageForm.message}
                    onChange={(e) => setNewMessageForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide as much detail as possible about your issue..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <i className="ri-upload-cloud-line text-3xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500">Maximum 3 images, up to 5MB each</p>
                    </label>
                  </div>

                  {/* Attachment Preview */}
                  {newMessageForm.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                      {newMessageForm.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center space-x-2">
                            <i className="ri-image-line text-gray-400"></i>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Before You Submit</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Check our FAQ section for common questions</li>
                    <li>• Provide as much detail as possible</li>
                    <li>• Include order numbers if relevant</li>
                    <li>• Attach images if they help explain your issue</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewMessageModal(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line mr-2"></i>
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}