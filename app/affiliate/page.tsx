
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AffiliatePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const benefits = [
    {
      title: 'Competitive Commissions',
      description: 'Earn up to 8% commission on every sale you refer',
      icon: 'ri-money-dollar-circle-line',
      highlight: 'Up to 8%'
    },
    {
      title: 'High-Quality Products',
      description: 'Promote premium fashion items customers love',
      icon: 'ri-star-line',
      highlight: '4.8★ Rating'
    },
    {
      title: 'Marketing Support',
      description: 'Access to banners, product images, and promotional materials',
      icon: 'ri-image-line',
      highlight: '500+ Assets'
    },
    {
      title: 'Real-Time Tracking',
      description: 'Monitor your performance with detailed analytics',
      icon: 'ri-line-chart-line',
      highlight: 'Live Dashboard'
    }
  ];

  const commissionStructure = [
    {
      tier: 'Bronze',
      sales: '$0 - $1,000',
      commission: '5%',
      perks: ['Basic marketing materials', 'Monthly payments', 'Email support']
    },
    {
      tier: 'Silver',
      sales: '$1,001 - $5,000',
      commission: '6%',
      perks: ['Premium marketing materials', 'Bi-weekly payments', 'Priority support', 'Exclusive promotions']
    },
    {
      tier: 'Gold',
      sales: '$5,001 - $10,000',
      commission: '7%',
      perks: ['Custom marketing materials', 'Weekly payments', 'Dedicated account manager', 'Early access to new products']
    },
    {
      tier: 'Platinum',
      sales: '$10,000+',
      commission: '8%',
      perks: ['Personalized support', 'Daily payments', 'VIP events', 'Co-marketing opportunities']
    }
  ];

  const faqs = [
    {
      question: 'How do I join the affiliate program?',
      answer: 'Simply fill out our application form and we\'ll review your application within 2-3 business days. Once approved, you\'ll receive access to your affiliate dashboard and marketing materials.'
    },
    {
      question: 'When do I get paid?',
      answer: 'Payment frequency depends on your tier level. Bronze affiliates are paid monthly, Silver bi-weekly, Gold weekly, and Platinum daily. All payments are processed via PayPal or bank transfer.'
    },
    {
      question: 'What marketing materials do you provide?',
      answer: 'We provide banners, product images, promotional codes, email templates, and social media content. Higher tiers get access to more premium and custom materials.'
    },
    {
      question: 'Is there a minimum payout threshold?',
      answer: 'Yes, the minimum payout is $50 for all tiers. Once you reach this threshold, payments will be processed according to your tier\'s payment schedule.'
    },
    {
      question: 'Can I promote on social media?',
      answer: 'Absolutely! We encourage social media promotion. We provide specific guidelines and assets optimized for different platforms including Instagram, TikTok, YouTube, and Facebook.'
    },
    {
      question: 'How long do cookies last?',
      answer: 'Our affiliate cookies last for 30 days, giving you credit for any purchases made within that timeframe after a user clicks your affiliate link.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Flame Fashion Affiliate Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join our affiliate program and earn commissions by promoting premium fashion products. Start earning today with our competitive commission structure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Apply Now
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
              Learn More
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Join Our Program?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${benefit.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-3">{benefit.description}</p>
                <div className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {benefit.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'commissions', label: 'Commissions' },
              { id: 'application', label: 'How to Apply' },
              { id: 'faq', label: 'FAQ' }
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
        {activeTab === 'overview' && (
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Program Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Perfect for:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Fashion bloggers and influencers</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Social media content creators</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Website owners and reviewers</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Email marketers</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Anyone passionate about fashion</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">What You Get:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Competitive commission rates</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Professional marketing materials</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Real-time performance tracking</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Dedicated support team</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-gray-700">Regular promotional opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-link text-blue-600 text-xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Easy Link Generation</h4>
                    <p className="text-gray-600 text-sm">Generate affiliate links for any product with one click</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-smartphone-line text-green-600 text-xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mobile-Friendly</h4>
                    <p className="text-gray-600 text-sm">Access your dashboard and materials on any device</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-customer-service-line text-purple-600 text-xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
                    <p className="text-gray-600 text-sm">Get help whenever you need it from our support team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Commission Structure</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Our tiered commission structure rewards high-performing affiliates with higher rates and exclusive benefits.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {commissionStructure.map((tier, index) => (
                <div key={index} className={`rounded-lg p-6 border-2 ${
                  tier.tier === 'Gold' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{tier.tier}</h3>
                    <p className="text-sm text-gray-600 mb-2">{tier.sales}</p>
                    <div className="text-3xl font-bold text-gray-900">{tier.commission}</div>
                    <p className="text-sm text-gray-600">Commission</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Perks:</h4>
                    <ul className="space-y-1">
                      {tier.perks.map((perk, perkIndex) => (
                        <li key={perkIndex} className="flex items-start">
                          <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0 text-sm"></i>
                          <span className="text-sm text-gray-700">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'application' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How to Apply</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Submit Application</h3>
                  <p className="text-gray-600">Fill out our simple application form with your details and platform information.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Approved</h3>
                  <p className="text-gray-600">We'll review your application within 2-3 business days and notify you of approval.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Earning</h3>
                  <p className="text-gray-600">Access your dashboard, get your links, and start promoting to earn commissions.</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Application Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Required Information:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Personal/Business details</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Website or social media profiles</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Marketing strategy description</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Payment information</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">We Look For:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Quality content and engagement</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Relevant audience interested in fashion</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Professional approach to marketing</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">Commitment to brand values</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of affiliates who are already earning commissions by promoting Flame Fashion products. Apply today and start your journey to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium whitespace-nowrap">
              Apply Now
            </button>
            <button className="border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
