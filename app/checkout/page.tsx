
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutSteps from './CheckoutSteps';
import LoginOptions from './LoginOptions';
import ContactShipping from './ContactShipping';
import DeliveryMethod from './DeliveryMethod';
import PaymentMethod from './PaymentMethod';
import { emailMarketingService } from '@/lib/email-marketing-service';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<'login' | 'register' | 'guest' | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [checkoutData, setCheckoutData] = useState({
    contact: {},
    shipping: {},
    delivery: {},
    payment: {}
  });
  const [emailSubscription, setEmailSubscription] = useState({
    subscribeToNewsletter: false,
    marketingEmails: false
  });

  const currencies: Record<string, Currency> = {
    USD: { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.85, name: 'Euro' },
    PLN: { code: 'PLN', symbol: 'zł', rate: 4.40, name: 'Polish Złoty' },
    JPY: { code: 'JPY', symbol: '¥', rate: 110, name: 'Japanese Yen' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.73, name: 'British Pound' }
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('flame-cart');
    const savedCurrency = localStorage.getItem('flame-currency') || 'USD';

    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      if (items.length === 0) {
        router.push('/');
      }
    } else {
      router.push('/');
    }

    setCurrentCurrency(savedCurrency);
  }, [router]);

  const convertPrice = (price: number) => {
    const rate = currencies[currentCurrency].rate;
    return price * rate;
  };

  const formatPrice = (price: number) => {
    const currency = currencies[currentCurrency];
    const convertedPrice = convertPrice(price);

    if (currentCurrency === 'PLN') {
      return `${convertedPrice.toFixed(2).replace('.', ',')} ${currency.symbol}`;
    } else if (currentCurrency === 'JPY') {
      return `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    } else {
      return `${currency.symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  const handleStepComplete = (stepData: any) => {
    if (currentStep === 0) {
      setUserType(stepData.userType);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCheckoutData(prev => ({
        ...prev,
        contact: stepData.contact,
        shipping: stepData.shipping
      }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCheckoutData(prev => ({
        ...prev,
        delivery: stepData
      }));
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCheckoutData(prev => ({
        ...prev,
        payment: stepData
      }));
      handleCompleteOrder();
    }
  };

  const handleCompleteOrder = async () => {
    localStorage.removeItem('flame-cart');
    router.push('/order-confirmation');
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    const freeShippingThreshold = currentCurrency === 'PLN' ? 250 / currencies.PLN.rate : 50;
    return subtotal >= freeShippingThreshold ? 0 : 9.99;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handlePlaceOrder = async () => {
    if (!checkoutData.payment.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      // ... existing order processing code ...

      // Handle email subscription
      if (emailSubscription.subscribeToNewsletter || emailSubscription.marketingEmails) {
        try {
          await emailMarketingService.addSubscriberFromCheckout(
            checkoutData.contact.email,
            checkoutData.contact.firstName,
            checkoutData.contact.lastName,
            'en' // You can get this from user preferences or browser settings
          );
        } catch (error) {
          console.error('Error subscribing to newsletter:', error);
          // Don't fail the order if newsletter subscription fails
        }
      }

      // ... rest of existing order processing ...
      handleCompleteOrder();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <LoginOptions onComplete={handleStepComplete} />;
      case 1:
        return <ContactShipping onComplete={handleStepComplete} userType={userType} />;
      case 2:
        return <DeliveryMethod onComplete={handleStepComplete} />;
      case 3:
        return <PaymentMethod onComplete={handleStepComplete} total={getTotal()} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <CheckoutSteps currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderCurrentStep()}

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={emailSubscription.subscribeToNewsletter}
                    onChange={(e) => setEmailSubscription({
                      ...emailSubscription,
                      subscribeToNewsletter: e.target.checked
                    })}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Subscribe to our newsletter</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Get the latest updates on new products, sales, and exclusive offers
                    </p>
                  </div>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={emailSubscription.marketingEmails}
                    onChange={(e) => setEmailSubscription({
                      ...emailSubscription,
                      marketingEmails: e.target.checked
                    })}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Receive promotional emails</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Be the first to know about special promotions and seasonal sales
                    </p>
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                You can unsubscribe at any time. View our privacy policy for more information.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Place Order
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium">
                    {getDeliveryFee() === 0 ? 'Free' : formatPrice(getDeliveryFee())}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              {getDeliveryFee() > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {currentCurrency === 'PLN' ? (
                      <>Add {formatPrice(250 / currencies.PLN.rate - getSubtotal())} more for free shipping!</>
                    ) : (
                      <>Add {formatPrice(50 - getSubtotal())} more for free shipping!</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
