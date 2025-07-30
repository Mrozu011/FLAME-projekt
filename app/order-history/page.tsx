'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  loginTime: string;
  expiresAt: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { format } = useCurrency();
  
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedSession = localStorage.getItem('flame-user-session');
    
    if (!savedSession) {
      router.push('/login');
      return;
    }

    try {
      const session = JSON.parse(savedSession);
      const now = new Date().toISOString();
      
      if (session.expiresAt && session.expiresAt > now) {
        setUserSession(session);
        loadOrderHistory(session.user.id);
      } else {
        localStorage.removeItem('flame-user-session');
        router.push('/login');
      }
    } catch {
      localStorage.removeItem('flame-user-session');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loadOrderHistory = (userId: string) => {
    // Mock order data - in real app, this would come from an API
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'FL2024001',
        date: '2024-01-15',
        status: 'delivered',
        items: [
          {
            id: '1',
            name: 'Premium Silk Blouse',
            price: 89.99,
            quantity: 1,
            size: 'M',
            color: 'White',
            image: 'https://readdy.ai/api/search-image?query=elegant%20silk%20blouse%20white%20premium%20fashion%20women%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=150&height=200&seq=silk-blouse-order-1&orientation=portrait'
          },
          {
            id: '2',
            name: 'Designer Leather Jacket',
            price: 299.99,
            quantity: 1,
            size: 'L',
            color: 'Black',
            image: 'https://readdy.ai/api/search-image?query=black%20leather%20jacket%20premium%20fashion%20designer%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=150&height=200&seq=leather-jacket-order-2&orientation=portrait'
          }
        ],
        subtotal: 389.98,
        shipping: 9.99,
        tax: 31.20,
        total: 431.17,
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        trackingNumber: 'FL123456789',
        estimatedDelivery: '2024-01-20'
      },
      {
        id: '2',
        orderNumber: 'FL2024002',
        date: '2024-01-20',
        status: 'shipped',
        items: [
          {
            id: '3',
            name: 'Cashmere Sweater',
            price: 159.99,
            quantity: 2,
            size: 'S',
            color: 'Beige',
            image: 'https://readdy.ai/api/search-image?query=cashmere%20sweater%20beige%20premium%20fashion%20knitwear%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=150&height=200&seq=cashmere-sweater-order-3&orientation=portrait'
          }
        ],
        subtotal: 319.98,
        shipping: 9.99,
        tax: 25.60,
        total: 355.57,
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        trackingNumber: 'FL987654321',
        estimatedDelivery: '2024-01-25'
      },
      {
        id: '3',
        orderNumber: 'FL2024003',
        date: '2024-01-22',
        status: 'processing',
        items: [
          {
            id: '4',
            name: 'Premium Denim Jeans',
            price: 129.99,
            quantity: 1,
            size: '32',
            color: 'Dark Blue',
            image: 'https://readdy.ai/api/search-image?query=premium%20denim%20jeans%20dark%20blue%20fashion%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=150&height=200&seq=denim-jeans-order-4&orientation=portrait'
          },
          {
            id: '5',
            name: 'Cotton T-Shirt',
            price: 29.99,
            quantity: 3,
            size: 'M',
            color: 'White',
            image: 'https://readdy.ai/api/search-image?query=white%20cotton%20t-shirt%20premium%20fashion%20basic%20clothing%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=150&height=200&seq=cotton-tshirt-order-5&orientation=portrait'
          }
        ],
        subtotal: 219.96,
        shipping: 9.99,
        tax: 17.60,
        total: 247.55,
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        id: '4',
        orderNumber: 'FL2024004',
        date: '2024-01-25',
        status: 'pending',
        items: [
          {
            id: '6',
            name: 'Wool Coat',
            price: 399.99,
            quantity: 1,
            size: 'L',
            color: 'Navy',
            image: 'https://readdy.ai/api/search-image?query=navy%20wool%20coat%20premium%20fashion%20outerwear%20studio%20photography%20clean%20white%20background%20professional%20product%20photo&width=150&height=200&seq=wool-coat-order-6&orientation=portrait'
          }
        ],
        subtotal: 399.99,
        shipping: 0.00,
        tax: 32.00,
        total: 431.99,
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      }
    ];

    setOrders(mockOrders);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return t('pending') || 'Pending';
      case 'processing':
        return t('processing') || 'Processing';
      case 'shipped':
        return t('shipped') || 'Shipped';
      case 'delivered':
        return t('delivered') || 'Delivered';
      case 'cancelled':
        return t('cancelled') || 'Cancelled';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('orderHistory') || 'Order History'}
              </h1>
              <p className="text-gray-600">
                {t('manageTrackOrders') || 'Manage and track your orders'}
              </p>
            </div>
            <Link
              href="/profile"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              {t('backToProfile') || 'Back to Profile'}
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchOrders') || 'Search orders...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-8"
            >
              <option value="all">{t('allOrders') || 'All Orders'}</option>
              <option value="pending">{t('pending') || 'Pending'}</option>
              <option value="processing">{t('processing') || 'Processing'}</option>
              <option value="shipped">{t('shipped') || 'Shipped'}</option>
              <option value="delivered">{t('delivered') || 'Delivered'}</option>
              <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-32 h-32 mx-auto mb-8">
              <img 
                src="https://readdy.ai/api/search-image?query=empty%20order%20history%20illustration%20minimalist%20design%20clean%20simple%20line%20art%20style%20modern%20e-commerce%20website%20empty%20state%20vector%20graphic&width=128&height=128&seq=empty-orders-illustration&orientation=squarish"
                alt="No orders illustration"
                className="w-full h-full object-contain opacity-60"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('noOrdersFound') || 'No orders found'}
            </h2>
            <p className="text-gray-600 mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? (t('noOrdersMatchFilter') || 'No orders match your current filter')
                : (t('noOrdersYet') || 'You haven\'t placed any orders yet')
              }
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              {t('startShopping') || 'Start Shopping'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('order') || 'Order'} #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t('placed') || 'Placed'} {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {format(order.total)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} {t('language') === 'pl' ? 'produktów' : 'items'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded-lg object-top"
                        />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex-shrink-0 w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {order.trackingNumber && (
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-truck-line mr-2"></i>
                          {t('tracking') || 'Tracking'}: {order.trackingNumber}
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-calendar-line mr-2"></i>
                          {t('estimatedDelivery') || 'Est. Delivery'}: {order.estimatedDelivery}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {selectedOrder?.id === order.id 
                          ? (t('hideDetails') || 'Hide Details')
                          : (t('viewDetails') || 'View Details')
                        }
                      </button>
                      {order.status === 'delivered' && (
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          {t('buyAgain') || 'Buy Again'}
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('orderItems') || 'Order Items'}
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-16 h-20 object-cover rounded-lg object-top"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.name}</h5>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    {item.size && <span>{t('size')}: {item.size}</span>}
                                    {item.color && <span>{t('color')}: {item.color}</span>}
                                    <span>{t('qty')}: {item.quantity}</span>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {format(item.price)} {item.quantity > 1 && `x ${item.quantity}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('orderSummary') || 'Order Summary'}
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('subtotal')}</span>
                              <span className="font-medium">{format(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('shipping')}</span>
                              <span className="font-medium">
                                {order.shipping === 0 ? (
                                  <span className="text-green-600">{t('free') || 'FREE'}</span>
                                ) : (
                                  format(order.shipping)
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('tax')}</span>
                              <span className="font-medium">{format(order.tax)}</span>
                            </div>
                            <div className="border-t pt-3">
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-900">{t('total')}</span>
                                <span className="text-lg font-semibold text-gray-900">{format(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h5 className="font-medium text-gray-900 mb-2">
                              {t('shippingAddress') || 'Shipping Address'}
                            </h5>
                            <div className="text-sm text-gray-600">
                              <p>{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}