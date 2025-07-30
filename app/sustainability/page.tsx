
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SustainabilityPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const sustainabilityMetrics = [
    {
      title: 'Carbon Neutral Shipping',
      value: '100%',
      description: 'All orders shipped with carbon-neutral delivery options',
      icon: 'ri-truck-line'
    },
    {
      title: 'Sustainable Materials',
      value: '75%',
      description: 'Of our collections made from eco-friendly materials',
      icon: 'ri-leaf-line'
    },
    {
      title: 'Waste Reduction',
      value: '60%',
      description: 'Reduction in packaging waste since 2020',
      icon: 'ri-recycle-line'
    },
    {
      title: 'Water Conservation',
      value: '40%',
      description: 'Less water used in production processes',
      icon: 'ri-drop-line'
    }
  ];

  const initiatives = [
    {
      title: 'Eco-Friendly Materials',
      description: 'We source organic cotton, recycled polyester, and innovative bio-based materials for our collections.',
      image: 'https://readdy.ai/api/search-image?query=organic%20cotton%20sustainable%20fabric%20eco-friendly%20materials%20natural%20textile%20professional%20photography%20clean%20background&width=400&height=300&seq=sustain-materials&orientation=landscape',
      actions: [
        'Organic cotton certified by GOTS',
        'Recycled polyester from ocean plastic',
        'Tencel from sustainably sourced wood',
        'Natural dyes and low-impact processes'
      ]
    },
    {
      title: 'Circular Fashion',
      description: 'Our take-back program allows customers to return worn items for recycling or upcycling.',
      image: 'https://readdy.ai/api/search-image?query=circular%20fashion%20recycling%20program%20clothing%20donation%20sustainable%20fashion%20cycle%20professional%20photography&width=400&height=300&seq=sustain-circular&orientation=landscape',
      actions: [
        'Clothing take-back program',
        'Upcycling workshops',
        'Repair and alteration services',
        'Resale platform for pre-loved items'
      ]
    },
    {
      title: 'Ethical Manufacturing',
      description: 'We partner with certified factories that ensure fair wages and safe working conditions.',
      image: 'https://readdy.ai/api/search-image?query=ethical%20fashion%20manufacturing%20fair%20trade%20workers%20sustainable%20production%20facility%20professional%20photography&width=400&height=300&seq=sustain-ethics&orientation=landscape',
      actions: [
        'Fair Trade certified suppliers',
        'Regular factory audits',
        'Living wage guarantee',
        'Safe working conditions'
      ]
    },
    {
      title: 'Carbon Footprint',
      description: 'We measure and offset our carbon emissions while working towards carbon neutrality.',
      image: 'https://readdy.ai/api/search-image?query=carbon%20footprint%20reduction%20green%20energy%20sustainable%20business%20environmental%20impact%20professional%20photography&width=400&height=300&seq=sustain-carbon&orientation=landscape',
      actions: [
        'Carbon footprint measurement',
        'Renewable energy in facilities',
        'Carbon offset programs',
        'Sustainable transportation'
      ]
    }
  ];

  const certifications = [
    {
      name: 'GOTS Certified',
      description: 'Global Organic Textile Standard certification for organic fiber products',
      logo: 'https://readdy.ai/api/search-image?query=GOTS%20organic%20textile%20certification%20logo%20sustainable%20fashion%20badge%20professional%20white%20background&width=120&height=120&seq=cert-gots&orientation=squarish'
    },
    {
      name: 'B-Corp Certified',
      description: 'Certified B Corporation meeting highest standards of social and environmental performance',
      logo: 'https://readdy.ai/api/search-image?query=B-Corp%20certification%20logo%20sustainable%20business%20badge%20professional%20white%20background&width=120&height=120&seq=cert-bcorp&orientation=squarish'
    },
    {
      name: 'Fair Trade',
      description: 'Fair Trade certification ensuring ethical labor practices and fair wages',
      logo: 'https://readdy.ai/api/search-image?query=Fair%20Trade%20certification%20logo%20ethical%20fashion%20badge%20professional%20white%20background&width=120&height=120&seq=cert-fairtrade&orientation=squarish'
    },
    {
      name: 'Cradle to Cradle',
      description: 'Cradle to Cradle Certified products designed for circular economy',
      logo: 'https://readdy.ai/api/search-image?query=Cradle%20to%20Cradle%20certification%20logo%20sustainable%20design%20badge%20professional%20white%20background&width=120&height=120&seq=cert-c2c&orientation=squarish'
    }
  ];

  const timeline = [
    {
      year: '2020',
      milestone: 'Sustainability Commitment',
      description: 'Launched our comprehensive sustainability program with clear targets and timelines.'
    },
    {
      year: '2021',
      milestone: 'First Eco Collection',
      description: 'Introduced our first collection made entirely from sustainable materials.'
    },
    {
      year: '2022',
      milestone: 'Carbon Neutral Shipping',
      description: 'Achieved 100% carbon-neutral shipping across all delivery options.'
    },
    {
      year: '2023',
      milestone: 'Circular Program Launch',
      description: 'Launched clothing take-back and recycling program for customers.'
    },
    {
      year: '2024',
      milestone: 'B-Corp Certification',
      description: 'Achieved B-Corporation certification for social and environmental performance.'
    },
    {
      year: '2025',
      milestone: 'Carbon Neutral Goal',
      description: 'Target to achieve complete carbon neutrality across all operations.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sustainability at Flame Fashion
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're committed to creating beautiful fashion while protecting our planet. Discover our journey towards a more sustainable future.
          </p>
          <div className="flex justify-center">
            <img 
              src="https://readdy.ai/api/search-image?query=sustainable%20fashion%20eco-friendly%20clothing%20green%20nature%20environmental%20responsibility%20professional%20photography%20modern%20design&width=800&height=400&seq=sustain-hero&orientation=landscape"
              alt="Sustainability Hero"
              className="rounded-lg shadow-lg max-w-4xl w-full object-cover object-top"
            />
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sustainabilityMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${metric.icon} text-green-600 text-2xl`}></i>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</h3>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{metric.title}</h4>
                <p className="text-gray-600 text-sm">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'initiatives', label: 'Initiatives' },
              { id: 'certifications', label: 'Certifications' },
              { id: 'timeline', label: 'Timeline' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
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
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Sustainability Vision</h2>
              <p className="text-lg text-gray-600 mb-8">
                At Flame Fashion, we believe that style and sustainability go hand in hand. Our commitment extends beyond creating beautiful clothing to ensuring that our practices contribute to a healthier planet and more equitable society.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-earth-line text-blue-600 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Environmental Stewardship</h3>
                <p className="text-gray-600">
                  We minimize our environmental impact through sustainable materials, efficient production processes, and circular design principles.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-group-line text-purple-600 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Social Responsibility</h3>
                <p className="text-gray-600">
                  We ensure fair labor practices, safe working conditions, and support for the communities where we operate.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lightbulb-line text-orange-600 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate to find new ways to reduce our environmental footprint while maintaining quality and style.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'initiatives' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Sustainability Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {initiatives.map((initiative, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    src={initiative.image} 
                    alt={initiative.title}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{initiative.title}</h3>
                    <p className="text-gray-600 mb-4">{initiative.description}</p>
                    <ul className="space-y-2">
                      {initiative.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start">
                          <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                          <span className="text-sm text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <img 
                    src={cert.logo} 
                    alt={cert.name}
                    className="w-20 h-20 mx-auto mb-4 object-contain"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Sustainability Journey</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="space-y-8">
                  {timeline.map((item, index) => (
                    <div key={index} className="relative flex items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 ${
                        item.year === '2025' ? 'bg-gray-400' : 'bg-green-600'
                      }`}>
                        {item.year === '2025' ? '?' : '✓'}
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{item.year}</h3>
                          <span className="ml-4 text-lg font-medium text-gray-700">{item.milestone}</span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Sustainability Mission</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Together, we can create a more sustainable future for fashion. Learn how you can be part of our journey towards a greener tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium whitespace-nowrap">
              Shop Sustainable Collection
            </button>
            <button className="border border-green-400 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap">
              Learn More
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
