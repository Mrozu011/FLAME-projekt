'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: string;
}

interface ReturnRequest {
  id: string;
  orderNumber: string;
  productName: string;
  reason: string;
  status: string;
  requestDate: string;
  refundAmount?: number;
}

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

export default function UserReturnsPage() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [activeTab, setActiveTab] = useState('request');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [returnForm, setReturnForm] = useState({
    reason: '',
    description: '',
    images: [] as File[]
  });

  const returnReasons = [
    { value: 'defective', label: 'Defective Item' },
    { value: 'size', label: 'Wrong Size' },
    { value: 'different', label: 'Different from Description' },
    { value: 'damaged', label: 'Damaged in Shipping' },
    { value: 'changed', label: 'Changed Mind' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    checkUserSession();
    loadUserOrders();
    loadUserReturns();
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

  const loadUserOrders = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 'FL001',
          orderNumber: 'FL001',
          date: '2024-01-15',
          items: [
            {
              id: '1',
              name: 'Premium Wireless Headphones',
              sku: 'PWH-001',
              quantity: 1,
              price: 149.99,
              image: 'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20with%20sleek%20modern%20design%2C%20professional%20product%20photography%20with%20clean%20white%20background&width=100&height=100&seq=order1&orientation=squarish'
            },
            {
              id: '2',
              name: 'Wireless Charging Pad',
              sku: 'WCP-002',
              quantity: 1,
              price: 39.99,
              image: 'https://readdy.ai/api/search-image?query=wireless%20charging%20pad%20with%20minimalist%20design%2C%20professional%20product%20photography%20with%20clean%20white%20background&width=100&height=100&seq=order2&orientation=squarish'
            }
          ],
          total: 189.98,
          status: 'delivered'
        },
        {
          id: 'FL002',
          orderNumber: 'FL002',
          date: '2024-01-10',
          items: [
            {
              id: '3',
              name: 'Smart Fitness Watch',
              sku: 'SFW-006',
              quantity: 1,
              price: 199.99,
              image: 'https://readdy.ai/api/search-image?query=smart%20fitness%20watch%20with%20health%20tracking%20features%2C%20professional%20product%20photography%20with%20clean%20white%20background&width=100&height=100&seq=order3&orientation=squarish'
            }
          ],
          total: 199.99,
          status: 'delivered'
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  };

  const loadUserReturns = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockReturns: ReturnRequest[] = [
        {
          id: 'RET001',
          orderNumber: 'FL003',
          productName: 'Bluetooth Speaker',
          reason: 'Defective Item',
          status: 'approved',
          requestDate: '2024-01-18',
          refundAmount: 89.99
        },
        {
          id: 'RET002',
          orderNumber: 'FL004',
          productName: 'Wireless Mouse',
          reason: 'Changed Mind',
          status: 'denied',
          requestDate: '2024-01-16'
        }
      ];
      
      setReturns(mockReturns);
    }, 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + returnForm.images.length > 5) {
      alert('You can upload maximum 5 images');
      return;
    }

    setReturnForm(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setReturnForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder || !selectedItem) return;

    if (!returnForm.reason) {
      alert('Please select a reason for return');
      return;
    }

    if (!returnForm.description.trim()) {
      alert('Please provide a description');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newReturn: ReturnRequest = {
        id: 'RET' + Date.now(),
        orderNumber: selectedOrder.orderNumber,
        productName: selectedItem.name,
        reason: returnReasons.find(r => r.value === returnForm.reason)?.label || returnForm.reason,
        status: 'pending',
        requestDate: new Date().toISOString().split('T')[0]
      };

      setReturns(prev => [newReturn, ...prev]);
      setShowReturnModal(false);
      setReturnForm({ reason: '', description: '', images: [] });
      setSelectedOrder(null);
      setSelectedItem(null);

      alert('Return request submitted successfully! You will receive an email confirmation shortly.');
    } catch (error) {
      alert('Failed to submit return request. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'ri-time-line';
      case 'approved': return 'ri-check-line';
      case 'denied': return 'ri-close-line';
      case 'refunded': return 'ri-money-dollar-circle-line';
      default: return 'ri-question-line';
    }
  };

  const canReturnItem = (order: Order) => {
    const orderDate = new Date(order.date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= 30 && (order.status === 'delivered' || order.status === 'completed');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Returns & Refunds</h1>
          <p className="text-gray-600">Manage your return requests and track refund status</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'request'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Request Return
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Return History
            </button>
          </div>
        </div>

        {/* Request Return Tab */}
        {activeTab === 'request' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Request a Return</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">No orders available for return</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">${order.total.toFixed(2)}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div>
                            {canReturnItem(order) ? (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setSelectedItem(item);
                                  setShowReturnModal(true);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Return Item
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">Return window expired</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Return History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Return History</h2>
            
            {returns.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-history-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">No return requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {returns.map((returnRequest) => (
                  <div key={returnRequest.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">#{returnRequest.id}</h3>
                        <p className="text-sm text-gray-500">Order: {returnRequest.orderNumber}</p>
                        <p className="text-sm text-gray-600">{returnRequest.productName}</p>
                        <p className="text-sm text-gray-500">Reason: {returnRequest.reason}</p>
                        <p className="text-sm text-gray-500">
                          Requested on {new Date(returnRequest.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getStatusColor(returnRequest.status)}`}>
                          <i className={`${getStatusIcon(returnRequest.status)} mr-1`}></i>
                          {returnRequest.status}
                        </span>
                        {returnRequest.refundAmount && (
                          <p className="text-sm font-medium text-green-600">
                            Refunded: ${returnRequest.refundAmount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Return Request Modal */}
        {showReturnModal && selectedOrder && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Request Return</h3>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitReturn} className="space-y-6">
                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedItem.name}</h4>
                      <p className="text-sm text-gray-500">Order: #{selectedOrder.orderNumber}</p>
                      <p className="text-sm text-gray-500">SKU: {selectedItem.sku}</p>
                      <p className="text-sm font-medium text-gray-900">${selectedItem.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Return Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Return <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a reason</option>
                    {returnReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={returnForm.description}
                    onChange={(e) => setReturnForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide detailed information about the issue..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {returnForm.description.length}/500 characters
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <i className="ri-upload-cloud-line text-3xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500">Maximum 5 images, up to 5MB each</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {returnForm.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {returnForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Return Policy Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Return Policy</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Items must be returned within 30 days of delivery</li>
                    <li>• Items must be in original condition with tags attached</li>
                    <li>• Refunds will be processed within 3-5 business days</li>
                    <li>• Original shipping costs are non-refundable</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Return Request
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