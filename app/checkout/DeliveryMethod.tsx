'use client';

import { useState } from 'react';

interface DeliveryMethodProps {
  onComplete: (data: any) => void;
}

export default function DeliveryMethod({ onComplete }: DeliveryMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [paczkomatCode, setPaczkomatCode] = useState('');

  const deliveryMethods = [
    {
      id: 'home',
      name: 'Home Delivery',
      description: 'Direct delivery to your address',
      price: 9.99,
      time: '2-5 business days',
      icon: 'ri-home-line'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Fastest delivery option',
      price: 19.99,
      time: '1-2 business days',
      icon: 'ri-flashlight-line'
    },
    {
      id: 'paczkomat',
      name: 'Parcel Locker (Paczkomat)',
      description: 'Collect from InPost parcel locker',
      price: 4.99,
      time: '2-3 business days',
      icon: 'ri-store-line'
    }
  ];

  const carriers = [
    {
      id: 'dhl',
      name: 'DHL Express',
      description: 'Reliable international shipping',
      logo: 'https://readdy.ai/api/search-image?query=DHL%20logo%20courier%20service%2C%20professional%20shipping%20company%20branding%2C%20clean%20background%2C%20corporate%20identity%20design&width=100&height=50&seq=dhl-logo&orientation=landscape'
    },
    {
      id: 'inpost',
      name: 'InPost',
      description: 'Local delivery specialist',
      logo: 'https://readdy.ai/api/search-image?query=InPost%20logo%20courier%20service%2C%20parcel%20locker%20delivery%20company%20branding%2C%20clean%20background%2C%20corporate%20identity%20design&width=100&height=50&seq=inpost-logo&orientation=landscape'
    },
    {
      id: 'ups',
      name: 'UPS',
      description: 'Worldwide shipping network',
      logo: 'https://readdy.ai/api/search-image?query=UPS%20logo%20courier%20service%2C%20professional%20shipping%20company%20branding%2C%20clean%20background%2C%20corporate%20identity%20design&width=100&height=50&seq=ups-logo&orientation=landscape'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !selectedCarrier) {
      alert('Please select a delivery method and carrier');
      return;
    }
    if (selectedMethod === 'paczkomat' && !paczkomatCode) {
      alert('Please enter a Paczkomat code');
      return;
    }
    
    const selectedMethodData = deliveryMethods.find(m => m.id === selectedMethod);
    const selectedCarrierData = carriers.find(c => c.id === selectedCarrier);
    
    onComplete({
      method: selectedMethodData,
      carrier: selectedCarrierData,
      paczkomatCode: selectedMethod === 'paczkomat' ? paczkomatCode : null
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Method</h2>
        <p className="text-gray-600">Choose your preferred delivery option</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Options</h3>
          <div className="space-y-4">
            {deliveryMethods.map((method) => (
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
                  name="delivery"
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
                    <p className="text-sm text-gray-500">{method.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(method.price)}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {selectedMethod === 'paczkomat' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paczkomat Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paczkomat Code *
                </label>
                <input
                  type="text"
                  value={paczkomatCode}
                  onChange={(e) => setPaczkomatCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter Paczkomat code (e.g., KRA01M)"
                />
              </div>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Find nearest Paczkomat
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Carrier</h3>
          <div className="space-y-4">
            {carriers.map((carrier) => (
              <label
                key={carrier.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCarrier === carrier.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="carrier"
                  value={carrier.id}
                  checked={selectedCarrier === carrier.id}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="mr-4"
                />
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={carrier.logo}
                    alt={carrier.name}
                    className="w-16 h-8 object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{carrier.name}</h4>
                    <p className="text-sm text-gray-600">{carrier.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <i className="ri-information-line text-blue-600"></i>
            <h4 className="font-semibold text-blue-900">Delivery Information</h4>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Free shipping on orders over $50</li>
            <li>• All deliveries are fully tracked</li>
            <li>• Signature required for orders over $100</li>
            <li>• Weekend delivery available for express orders</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Back to Contact
          </button>
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}