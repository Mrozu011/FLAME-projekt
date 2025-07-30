'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping & Returns</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Options</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-truck-line text-green-500"></i>
                      <h4 className="font-medium text-gray-900">Standard Shipping</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">5-7 business days</p>
                    <p className="text-gray-900 font-medium">$5.99 (Free on orders over $50)</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-flashlight-line text-blue-500"></i>
                      <h4 className="font-medium text-gray-900">Express Shipping</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">2-3 business days</p>
                    <p className="text-gray-900 font-medium">$12.99</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-time-line text-purple-500"></i>
                      <h4 className="font-medium text-gray-900">Next Day Delivery</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">1 business day</p>
                    <p className="text-gray-900 font-medium">$24.99</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Time</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Standard Processing:</strong> 1-2 business days
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Custom Items:</strong> 3-5 business days
                  </p>
                  <p className="text-gray-700">
                    <strong>Sale Items:</strong> 2-3 business days
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">International Shipping</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    We ship to over 50 countries worldwide.
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Delivery Time:</strong> 7-14 business days
                  </p>
                  <p className="text-gray-700">
                    <strong>Shipping Cost:</strong> Calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Tracking</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Track Your Order</h3>
                  <p className="text-gray-700 mb-4">
                    Once your order ships, you'll receive a confirmation email with tracking information.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span className="text-sm text-gray-700">Order Confirmed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-settings-line text-blue-500"></i>
                      <span className="text-sm text-gray-700">Processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-truck-line text-purple-500"></i>
                      <span className="text-sm text-gray-700">Shipped</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-home-line text-green-500"></i>
                      <span className="text-sm text-gray-700">Delivered</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Partners</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <img src="https://readdy.ai/api/search-image?query=DHL%20shipping%20logo%20icon%20simple%20white%20background&width=24&height=24&seq=dhl-icon&orientation=squarish" alt="DHL" className="w-6 h-6" />
                      <span className="text-gray-700">DHL Express</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img src="https://readdy.ai/api/search-image?query=UPS%20shipping%20logo%20icon%20simple%20white%20background&width=24&height=24&seq=ups-icon&orientation=squarish" alt="UPS" className="w-6 h-6" />
                      <span className="text-gray-700">UPS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img src="https://readdy.ai/api/search-image?query=FedEx%20shipping%20logo%20icon%20simple%20white%20background&width=24&height=24&seq=fedex-icon&orientation=squarish" alt="FedEx" className="w-6 h-6" />
                      <span className="text-gray-700">FedEx</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Returns & Exchanges</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Policy</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-time-line text-blue-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">30-Day Returns</h4>
                      <p className="text-gray-600 text-sm">Items can be returned within 30 days of purchase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <i className="ri-price-tag-3-line text-green-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Original Condition</h4>
                      <p className="text-gray-600 text-sm">Items must be unworn with original tags attached</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <i className="ri-money-dollar-circle-line text-purple-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Full Refund</h4>
                      <p className="text-gray-600 text-sm">Refund to original payment method within 5-7 business days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Exchange Policy</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-arrow-left-right-line text-blue-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Size Exchanges</h4>
                      <p className="text-gray-600 text-sm">Free exchanges for different sizes of the same item</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <i className="ri-palette-line text-green-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Color Exchanges</h4>
                      <p className="text-gray-600 text-sm">Exchange for different colors (subject to availability)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <i className="ri-truck-line text-purple-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Free Return Shipping</h4>
                      <p className="text-gray-600 text-sm">We cover return shipping costs for exchanges</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Start Return</h3>
                  <p className="text-sm text-gray-600">Log in to your account and select the item to return</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Print Label</h3>
                  <p className="text-sm text-gray-600">Print the prepaid return shipping label</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Package Item</h3>
                  <p className="text-sm text-gray-600">Package the item securely with original packaging</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ship Back</h3>
                  <p className="text-sm text-gray-600">Drop off at any authorized shipping location</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Circumstances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Damaged Items</h3>
                <p className="text-gray-700 mb-4">
                  If you receive a damaged item, please contact us within 48 hours with photos of the damage.
                </p>
                <p className="text-gray-700">
                  We'll provide a prepaid return label and expedite a replacement.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Wrong Item</h3>
                <p className="text-gray-700 mb-4">
                  If you receive the wrong item, we'll arrange immediate pickup and send the correct item.
                </p>
                <p className="text-gray-700">
                  No return shipping charges apply for our errors.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-black text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-gray-300 mb-4">
              Our customer service team is here to help with any shipping or return questions.
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <i className="ri-mail-line"></i>
                <span>support@flame-fashion.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-phone-line"></i>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}