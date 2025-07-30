'use client';

import { useState } from 'react';

interface PaymentMethodProps {
  onComplete: (data: any) => void;
  total: number;
}

export default function PaymentMethod({ onComplete, total }: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: 'ri-bank-card-line'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: 'ri-paypal-line'
    },
    {
      id: 'przelewy24',
      name: 'Przelewy24',
      description: 'Polish online payment system',
      icon: 'ri-secure-payment-line'
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      description: 'Pay with Touch ID or Face ID',
      icon: 'ri-apple-line'
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      description: 'Pay with Google Pay',
      icon: 'ri-google-pay-line'
    }
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    const mockCoupons = [
      { code: 'WELCOME10', discount: 10, type: 'percentage' },
      { code: 'SAVE20', discount: 20, type: 'fixed' },
      { code: 'FIRST15', discount: 15, type: 'percentage' }
    ];
    
    const coupon = mockCoupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      alert(`Coupon applied! ${coupon.type === 'percentage' ? coupon.discount + '%' : '$' + coupon.discount} off`);
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardCode.trim()) return;
    
    const mockGiftCards = [
      { code: 'GIFT1234', balance: 25.00 },
      { code: 'GIFT5678', balance: 50.00 },
      { code: 'GIFT9999', balance: 100.00 }
    ];
    
    const giftCard = mockGiftCards.find(g => g.code === giftCardCode.toUpperCase());
    if (giftCard) {
      setAppliedGiftCard(giftCard);
      alert(`Gift card applied! $${giftCard.balance} balance`);
    } else {
      alert('Invalid gift card code');
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (total * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  };

  const calculateFinalTotal = () => {
    let finalTotal = total - calculateDiscount();
    if (appliedGiftCard) {
      finalTotal = Math.max(0, finalTotal - appliedGiftCard.balance);
    }
    return finalTotal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    if (!agreedToTerms || !agreedToPrivacy) {
      alert('Please agree to the Terms & Conditions and Privacy Policy');
      return;
    }
    
    onComplete({
      method: selectedMethod,
      coupon: appliedCoupon,
      giftCard: appliedGiftCard,
      finalTotal: calculateFinalTotal()
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
        <p className="text-gray-600">Choose your preferred payment option</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h3>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-4"
                />
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                    <i className={`${method.icon} text-lg text-gray-600`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {selectedMethod === 'card' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="12345"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter cardholder name"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Discounts & Gift Cards</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter coupon code"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                  <span className="text-sm text-green-800">
                    Coupon "{appliedCoupon.code}" applied
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gift Card
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter gift card code"
                />
                <button
                  type="button"
                  onClick={handleApplyGiftCard}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
              {appliedGiftCard && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                  <span className="text-sm text-green-800">
                    Gift card applied: {formatPrice(appliedGiftCard.balance)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedGiftCard(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon.code}):</span>
                <span>-{formatPrice(calculateDiscount())}</span>
              </div>
            )}
            {appliedGiftCard && (
              <div className="flex justify-between text-green-600">
                <span>Gift Card:</span>
                <span>-{formatPrice(Math.min(appliedGiftCard.balance, total - calculateDiscount()))}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>{formatPrice(calculateFinalTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement</h3>
          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mr-2 mt-1"
              />
              <span className="text-sm text-gray-600">
                I agree to the <button type="button" className="text-blue-600 hover:text-blue-800">Terms & Conditions</button>
              </span>
            </label>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="mr-2 mt-1"
              />
              <span className="text-sm text-gray-600">
                I agree to the <button type="button" className="text-blue-600 hover:text-blue-800">Privacy Policy</button>
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Back to Delivery
          </button>
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Complete Order
          </button>
        </div>
      </form>
    </div>
  );
}