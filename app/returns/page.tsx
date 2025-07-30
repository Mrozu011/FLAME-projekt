
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('policy');

  const returnReasons = [
    { id: 'size', label: 'Wrong Size' },
    { id: 'defective', label: 'Defective Item' },
    { id: 'different', label: 'Different from Description' },
    { id: 'damaged', label: 'Damaged in Shipping' },
    { id: 'changed', label: 'Changed Mind' },
    { id: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to love your Flame Fashion purchase. If you're not completely satisfied, we're here to help with easy returns and exchanges.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-arrow-left-right-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Return</h3>
            <p className="text-gray-600 mb-4">Begin your return process online</p>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Start Return
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-truck-line text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Return</h3>
            <p className="text-gray-600 mb-4">Check your return status</p>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Track Return
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-customer-service-line text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">Contact our support team</p>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Get Help
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'policy', label: 'Return Policy' },
              { id: 'process', label: 'Return Process' },
              { id: 'exchanges', label: 'Exchanges' },
              { id: 'refunds', label: 'Refunds' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'policy' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Return Policy</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <i className="ri-time-line text-green-600 text-2xl mr-3"></i>
                <h3 className="text-xl font-semibold text-green-800">30-Day Return Window</h3>
              </div>
              <p className="text-green-700">
                You have 30 days from the date of delivery to return items for a full refund or exchange.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What Can Be Returned</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Items in original condition with tags attached</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Unworn and unwashed clothing</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Accessories in original packaging</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Shoes in original box</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Items purchased at full price or on sale</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What Cannot Be Returned</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="ri-close-line text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Intimate apparel and swimwear</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-close-line text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Customized or personalized items</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-close-line text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Items without original tags</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-close-line text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Items damaged by normal wear</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-close-line text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Gift cards and final sale items</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Return Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Initiate Return</h3>
                <p className="text-gray-600">Start your return online or contact customer service</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Items</h3>
                <p className="text-gray-600">Pack items securely in original packaging</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ship Back</h3>
                <p className="text-gray-600">Use prepaid return label to ship items back</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Refund</h3>
                <p className="text-gray-600">Receive refund within 5-7 business days</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Online Return Form</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter your order number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black pr-8">
                    <option value="">Select a reason</option>
                    {returnReasons.map(reason => (
                      <option key={reason.id} value={reason.id}>{reason.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments (Optional)</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    rows={4}
                    placeholder="Tell us more about your return..."
                  ></textarea>
                </div>
                
                <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                  Submit Return Request
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'exchanges' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Exchanges</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <i className="ri-arrow-left-right-line text-blue-600 text-2xl mr-3"></i>
                <h3 className="text-xl font-semibold text-blue-800">Free Exchanges</h3>
              </div>
              <p className="text-blue-700">
                Exchange your items for a different size or color at no extra cost within 30 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Size Exchanges</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Free size exchanges within 30 days</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Subject to availability</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Items must be unworn with tags</span>
                  </li>
                </ul>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Size Guide Available</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Check our size guide before ordering to find your perfect fit.
                  </p>
                  <button className="text-black font-medium hover:text-gray-700 transition-colors">
                    View Size Guide →
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Color Exchanges</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Exchange for different color</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Same style and size only</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Price difference may apply</span>
                  </li>
                </ul>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Color Accuracy</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Colors may vary slightly due to monitor settings and lighting.
                  </p>
                  <button className="text-black font-medium hover:text-gray-700 transition-colors">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Refunds</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Refund Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
                      <i className="ri-check-line text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Items Received</p>
                      <p className="text-sm text-gray-600">1-2 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                      <i className="ri-search-line text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Processing</p>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3">
                      <i className="ri-money-dollar-circle-line text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Refund Issued</p>
                      <p className="text-sm text-gray-600">3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Refund Methods</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Original Payment Method</h4>
                    <p className="text-sm text-gray-600">
                      Refunds are processed back to your original payment method (credit card, PayPal, etc.)
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Store Credit</h4>
                    <p className="text-sm text-gray-600">
                      Choose store credit for immediate use and earn 10% bonus credit
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Bank Transfer</h4>
                    <p className="text-sm text-gray-600">
                      Available for international customers upon request
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <i className="ri-information-line text-yellow-600 text-2xl mr-3"></i>
                <h3 className="text-xl font-semibold text-yellow-800">Important Notes</h3>
              </div>
              <ul className="text-yellow-700 space-y-2">
                <li>• Shipping costs are non-refundable unless the return is due to our error</li>
                <li>• International customers are responsible for return shipping costs</li>
                <li>• Refunds may take longer during peak seasons</li>
                <li>• Gift card purchases are final and non-refundable</li>
              </ul>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I return sale items?</h3>
              <p className="text-gray-600">
                Yes, sale items can be returned within 30 days for a full refund. Final sale items are clearly marked and cannot be returned.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What if I received a damaged item?</h3>
              <p className="text-gray-600">
                If you received a damaged item, please contact us immediately. We'll arrange a replacement or full refund, including shipping costs.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I return items to a physical store?</h3>
              <p className="text-gray-600">
                Yes, online purchases can be returned to any of our physical store locations. Bring your order confirmation and ID.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help with Your Return?</h2>
          <p className="text-gray-300 mb-8">
            Our customer service team is here to help make your return process as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Chat with Support
            </button>
            <button className="border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Email Support
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
