
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CookiesPage() {
  const [activeTab, setActiveTab] = useState('policy');

  const cookieTypes = [
    {
      type: 'Essential Cookies',
      description: 'Required for basic website functionality',
      purpose: 'These cookies are necessary for the website to function properly and cannot be disabled.',
      examples: ['Session management', 'Shopping cart', 'Authentication', 'Security'],
      retention: 'Session or 1 year',
      required: true
    },
    {
      type: 'Performance Cookies',
      description: 'Help us understand how visitors interact with our website',
      purpose: 'These cookies collect information about how you use our website to help us improve it.',
      examples: ['Page views', 'Time on site', 'Click tracking', 'Error reporting'],
      retention: '2 years',
      required: false
    },
    {
      type: 'Functionality Cookies',
      description: 'Remember your preferences and settings',
      purpose: 'These cookies allow us to remember choices you make and provide enhanced features.',
      examples: ['Language preferences', 'Currency settings', 'Theme preferences', 'Region selection'],
      retention: '1 year',
      required: false
    },
    {
      type: 'Marketing Cookies',
      description: 'Used for advertising and remarketing',
      purpose: 'These cookies track your browsing activity to show you relevant advertisements.',
      examples: ['Ad targeting', 'Remarketing', 'Social media integration', 'Conversion tracking'],
      retention: '1-2 years',
      required: false
    }
  ];

  const thirdPartyServices = [
    {
      service: 'Google Analytics',
      purpose: 'Website analytics and performance monitoring',
      cookies: ['_ga', '_gid', '_gat'],
      privacy: 'https://policies.google.com/privacy'
    },
    {
      service: 'Facebook Pixel',
      purpose: 'Social media integration and advertising',
      cookies: ['_fbp', '_fbc', 'fr'],
      privacy: 'https://www.facebook.com/privacy/policy'
    },
    {
      service: 'Stripe',
      purpose: 'Payment processing and fraud prevention',
      cookies: ['__stripe_mid', '__stripe_sid'],
      privacy: 'https://stripe.com/privacy'
    },
    {
      service: 'PayPal',
      purpose: 'Alternative payment processing',
      cookies: ['PAYPAL_CHECKOUT', 'l7_az'],
      privacy: 'https://www.paypal.com/privacy'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience on our website.
          </p>
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Last updated: December 2024
            </p>
          </div>
        </div>

        {/* Cookie Consent Banner Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-16">
          <div className="flex items-center mb-4">
            <i className="ri-information-line text-blue-600 text-2xl mr-3"></i>
            <h3 className="text-xl font-semibold text-blue-900">Cookie Consent</h3>
          </div>
          <p className="text-blue-800 mb-4">
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage your cookie preferences at any time.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            Manage Cookie Preferences
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'policy', label: 'Cookie Policy' },
              { id: 'types', label: 'Cookie Types' },
              { id: 'third-party', label: 'Third-Party Services' },
              { id: 'manage', label: 'Manage Cookies' }
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What Are Cookies?</h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why We Use Cookies</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">To remember your login status and preferences</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">To keep items in your shopping cart</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">To analyze website traffic and improve performance</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">To personalize content and advertisements</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">To ensure website security and prevent fraud</span>
                  </li>
                </ul>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Legal Basis</h3>
              <p className="text-gray-600 mb-6">
                We process cookies based on your consent, except for essential cookies which are necessary for the website to function. You can withdraw your consent at any time by adjusting your cookie preferences.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h3>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Accept or reject non-essential cookies</li>
                <li>• Withdraw consent at any time</li>
                <li>• Delete cookies from your browser</li>
                <li>• Request information about cookies we use</li>
                <li>• File a complaint with supervisory authorities</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{cookie.type}</h3>
                      <p className="text-gray-600">{cookie.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cookie.required 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {cookie.required ? 'Required' : 'Optional'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Purpose:</h4>
                      <p className="text-sm text-gray-600 mb-4">{cookie.purpose}</p>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">Retention:</h4>
                      <p className="text-sm text-gray-600">{cookie.retention}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {cookie.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="flex items-start">
                            <i className="ri-arrow-right-s-line text-gray-400 mr-1 mt-0.5 flex-shrink-0"></i>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'third-party' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Third-Party Services</h2>
            
            <p className="text-gray-600 mb-8">
              We use third-party services that may set their own cookies. These services help us provide better functionality and analyze our website performance.
            </p>
            
            <div className="space-y-6">
              {thirdPartyServices.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.service}</h3>
                      <p className="text-gray-600">{service.purpose}</p>
                    </div>
                    <a 
                      href={service.privacy} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Privacy Policy →
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cookies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.cookies.map((cookie, cookieIndex) => (
                        <span key={cookieIndex} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {cookie}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Manage Your Cookie Preferences</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookie Preference Center</h3>
              <p className="text-gray-600 mb-4">
                You can manage your cookie preferences using the controls below. Changes will take effect immediately.
              </p>
              
              <div className="space-y-4">
                {cookieTypes.map((cookie, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{cookie.type}</h4>
                      <p className="text-sm text-gray-600">{cookie.description}</p>
                    </div>
                    <div className="ml-4">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={cookie.required}
                          disabled={cookie.required}
                          className="sr-only"
                        />
                        <div className={`relative w-12 h-6 rounded-full transition-colors ${
                          cookie.required ? 'bg-gray-400' : 'bg-gray-300'
                        }`}>
                          <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            cookie.required ? 'translate-x-6' : ''
                          }`}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {cookie.required ? 'Required' : 'Optional'}
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-6">
                <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                  Save Preferences
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Accept All
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Reject All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Browser Settings</h3>
                <p className="text-gray-600 mb-4">
                  You can also manage cookies through your browser settings:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <a href="#" className="text-blue-600 hover:text-blue-800">Chrome Cookie Settings</a></li>
                  <li>• <a href="#" className="text-blue-600 hover:text-blue-800">Firefox Cookie Settings</a></li>
                  <li>• <a href="#" className="text-blue-600 hover:text-blue-800">Safari Cookie Settings</a></li>
                  <li>• <a href="#" className="text-blue-600 hover:text-blue-800">Edge Cookie Settings</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Devices</h3>
                <p className="text-gray-600 mb-4">
                  For mobile devices, you can manage cookies through:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• iOS Safari Settings</li>
                  <li>• Android Chrome Settings</li>
                  <li>• Mobile App Privacy Settings</li>
                  <li>• Device-level Ad Preferences</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About Cookies?</h2>
          <p className="text-gray-300 mb-8">
            If you have questions about our cookie policy or need help managing your preferences, our privacy team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:privacy@flame-fashion.com" className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Email Privacy Team
            </a>
            <button className="border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
