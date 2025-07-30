
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { invoiceService } from '@/lib/invoice-service';

interface OrderItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  userId: string;
}

interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Shipping extends Address {
  method: string;
  carrier: string;
  trackingNumber?: string;
  estimatedDelivery: string;
}

interface Payment {
  method: string;
  cardLast4: string;
  cardType: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
}

interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

interface StatusHistoryEntry {
  status: string;
  date: string;
  note: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  billing: Address;
  shipping: Shipping;
  payment: Payment;
  items: OrderItem[];
  summary: OrderSummary;
  status: string;
  orderDate: string;
  type: string;
  notes?: string;
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  summary: {
    total: number;
  };
  [key: string]: any; // Allow additional properties
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [orderInvoices, setOrderInvoices] = useState<InvoiceData[]>([]);

  useEffect(() => {
    const loadOrderDetails = () => {
      // Mock order data - in real app, fetch from API
      const mockOrder: Order = {
        id: params.id as string,
        orderNumber: `#${params.id}`,
        customer: {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          userId: 'user123',
        },
        billing: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
        },
        shipping: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          method: 'Standard Shipping',
          carrier: 'FedEx',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-28',
        },
        payment: {
          method: 'Credit Card',
          cardLast4: '4242',
          cardType: 'Visa',
          transactionId: 'txn_1234567890',
          amount: 299.99,
          currency: 'USD',
          status: 'paid',
          paidAt: '2024-01-15T10:30:00Z',
        },
        items: [
          {
            id: 1,
            name: 'Premium Wireless Headphones',
            sku: 'PWH-001',
            quantity: 1,
            price: 149.99,
            total: 149.99,
            image: 'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20with%20sleek%20modern%20design%2C%20professional%20product%20photography%20with%20clean%20white%20background&width=100&height=100&seq=order1&orientation=squarish',
          },
          {
            id: 2,
            name: 'Wireless Charging Pad',
            sku: 'WCP-002',
            quantity: 1,
            price: 39.99,
            total: 39.99,
            image: 'https://readdy.ai/api/search-image?query=wireless%20charging%20pad%20with%20minimalist%20design%2C%20professional%20product%20photography%20with%20clean%20white%20background&width=100&height=100&seq=order2&orientation=squarish',
          },
        ],
        summary: {
          subtotal: 189.98,
          tax: 15.20,
          shipping: 9.99,
          discount: 0,
          total: 215.17,
        },
        status: 'processing',
        orderDate: '2024-01-15T08:00:00Z',
        type: 'our',
        notes: 'Customer requested expedited processing',
      };

      const mockHistory: StatusHistoryEntry[] = [
        { status: 'pending', date: '2024-01-15T08:00:00Z', note: 'Order placed' },
        { status: 'processing', date: '2024-01-15T10:30:00Z', note: 'Payment confirmed' },
        { status: 'processing', date: '2024-01-15T14:00:00Z', note: 'Items picked from warehouse' },
      ];

      setOrder(mockOrder);
      setStatusHistory(mockHistory);
      setNewStatus(mockOrder.status);
      setLoading(false);

      // Load invoices for this order
      loadOrderInvoices(mockOrder.id);
    };

    loadOrderDetails();
  }, [params.id]);

  const loadOrderInvoices = (orderId: string) => {
    try {
      const invoices = invoiceService.getInvoicesByOrder(orderId);
      setOrderInvoices(invoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || !order || newStatus === order.status) return;

    try {
      const oldStatus = order.status;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      setStatusHistory((prev) => [...prev, {
        status: newStatus,
        date: new Date().toISOString(),
        note: `Status updated to ${newStatus}`,
      }]);

      // Auto-generate invoice when status changes to paid
      if (newStatus === 'paid' && oldStatus !== 'paid' && order) {
        try {
          const invoice = await invoiceService.generateInvoice(order);
          setOrderInvoices((prev) => [invoice, ...prev]);
          alert(`Invoice ${invoice.invoiceNumber} generated successfully!`);
        } catch (error) {
          console.error('Error generating invoice:', error);
          alert('Status updated but invoice generation failed');
        }
      }

      setShowStatusModal(false);
      alert('Order status updated successfully');
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleGenerateInvoice = async () => {
    if (!order) return;
    
    try {
      const invoice = await invoiceService.generateInvoice(order);
      setOrderInvoices((prev) => [invoice, ...prev]);
      alert(`Invoice ${invoice.invoiceNumber} generated successfully!`);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice');
    }
  };

  const handleDownloadInvoice = (invoice: InvoiceData) => {
    invoiceService.downloadInvoice(invoice as any);
  };

  const handlePrintInvoice = (invoice: InvoiceData) => {
    invoiceService.printInvoice(invoice as any);
  };

  const handleEmailInvoice = async (invoice: InvoiceData) => {
    if (!order) return;
    
    try {
      const success = await invoiceService.emailInvoice(invoice as any, order.customer.email);
      if (success) {
        alert('Invoice sent successfully!');
      } else {
        alert('Failed to send invoice');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    }
  };

  const printOrder = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-file-search-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">Order not found</p>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.orderDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStatusModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-edit-line mr-2"></i>
                Update Status
              </button>
              <button
                onClick={handleGenerateInvoice}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-file-text-line mr-2"></i>
                Generate Invoice
              </button>
              <button
                onClick={printOrder}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-printer-line mr-2"></i>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.total}</p>
                      <p className="text-sm text-gray-500">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <i className="ri-user-line mr-2"></i>
                      {order.customer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <i className="ri-mail-line mr-2"></i>
                      {order.customer.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <i className="ri-phone-line mr-2"></i>
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Billing Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{order.billing.address}</p>
                    <p>{order.billing.city}, {order.billing.state} {order.billing.zipCode}</p>
                    <p>{order.billing.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{order.shipping.address}</p>
                    <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                    <p>{order.shipping.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Method:</span> {order.shipping.method}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Carrier:</span> {order.shipping.carrier}
                    </p>
                    {order.shipping.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tracking:</span> {order.shipping.trackingNumber}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Est. Delivery:</span> {order.shipping.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Summary & Status */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Order Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                      order.payment.status
                    )}`}
                  >
                    {order.payment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Order Type:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.type === 'our' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {order.type === 'our' ? 'Our Stock' : 'Dropship'}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoices */}
            {orderInvoices.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h2>
                <div className="space-y-3">
                  {orderInvoices.map((invoice) => (
                    <div key={invoice.invoiceNumber} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(invoice.issueDate)} • ${invoice.summary.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900 w-8 h-8 flex items-center justify-center"
                          title="Download"
                        >
                          <i className="ri-download-line"></i>
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(invoice)}
                          className="text-purple-600 hover:text-purple-900 w-8 h-8 flex items-center justify-center"
                          title="Print"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                        <button
                          onClick={() => handleEmailInvoice(invoice)}
                          className="text-green-600 hover:text-green-900 w-8 h-8 flex items-center justify-center"
                          title="Email"
                        >
                          <i className="ri-mail-send-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Method:</span>
                  <span className="text-sm text-gray-900">{order.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Card:</span>
                  <span className="text-sm text-gray-900">
                    {order.payment.cardType} ****{order.payment.cardLast4}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="text-sm text-gray-900 font-mono">{order.payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Paid At:</span>
                  <span className="text-sm text-gray-900">{formatDate(order.payment.paidAt)}</span>
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
              <div className="space-y-3">
                {statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 capitalize">{entry.status}</p>
                      <p className="text-xs text-gray-500">{entry.note}</p>
                      <p className="text-xs text-gray-400">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
            <p className="text-gray-600 mb-4">
              Update status for order {order.orderNumber}
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 pr-8"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
