
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PressPage() {
  const [selectedYear, setSelectedYear] = useState('2024');

  const pressReleases = [
    {
      id: 1,
      title: 'Flame Fashion Launches Sustainable Collection for Spring 2024',
      date: '2024-03-15',
      category: 'Product Launch',
      summary: 'Flame Fashion announces its most sustainable collection yet, featuring eco-friendly materials and carbon-neutral shipping.',
      image: 'https://readdy.ai/api/search-image?query=sustainable%20fashion%20collection%20eco-friendly%20clothing%20display%20modern%20studio%20photography%20clean%20professional%20background&width=600&height=400&seq=press-sustainable&orientation=landscape'
    },
    {
      id: 2,
      title: 'CEO Sarah Johnson Named "Fashion Innovator of the Year"',
      date: '2024-02-28',
      category: 'Awards',
      summary: 'Flame Fashion CEO Sarah Johnson receives prestigious industry award for innovation in sustainable fashion practices.',
      image: 'https://readdy.ai/api/search-image?query=fashion%20CEO%20award%20ceremony%20professional%20business%20woman%20elegant%20suit%20modern%20corporate%20photography&width=600&height=400&seq=press-award&orientation=landscape'
    },
    {
      id: 3,
      title: 'Flame Fashion Expands to European Markets',
      date: '2024-02-10',
      category: 'Business',
      summary: 'Company announces strategic expansion into UK, France, and Germany markets with new distribution partnerships.',
      image: 'https://readdy.ai/api/search-image?query=European%20fashion%20market%20expansion%20international%20business%20modern%20office%20professional%20photography&width=600&height=400&seq=press-europe&orientation=landscape'
    },
    {
      id: 4,
      title: 'Partnership with Local Artisans Supports Community Growth',
      date: '2024-01-20',
      category: 'Community',
      summary: 'Flame Fashion partners with local artisans to create exclusive handcrafted pieces while supporting community development.',
      image: 'https://readdy.ai/api/search-image?query=local%20artisans%20handcrafted%20fashion%20community%20workshop%20traditional%20craftsmanship%20professional%20photography&width=600&height=400&seq=press-artisan&orientation=landscape'
    },
    {
      id: 5,
      title: 'Record-Breaking Holiday Season Sales',
      date: '2024-01-05',
      category: 'Business',
      summary: 'Flame Fashion reports strongest holiday season performance with 40% increase in online sales and customer satisfaction.',
      image: 'https://readdy.ai/api/search-image?query=holiday%20fashion%20shopping%20success%20celebration%20modern%20retail%20store%20professional%20photography&width=600&height=400&seq=press-sales&orientation=landscape'
    },
    {
      id: 6,
      title: 'New Flagship Store Opens in Downtown Manhattan',
      date: '2023-12-15',
      category: 'Store Opening',
      summary: 'Flame Fashion unveils its largest flagship store featuring interactive displays and sustainable design elements.',
      image: 'https://readdy.ai/api/search-image?query=flagship%20fashion%20store%20Manhattan%20modern%20retail%20interior%20design%20professional%20architectural%20photography&width=600&height=400&seq=press-store&orientation=landscape'
    }
  ];

  const mediaKit = [
    {
      type: 'Brand Guidelines',
      description: 'Complete brand identity guidelines including logos, colors, and typography',
      format: 'PDF',
      size: '2.5 MB'
    },
    {
      type: 'Product Images',
      description: 'High-resolution product photography and lifestyle images',
      format: 'ZIP',
      size: '45 MB'
    },
    {
      type: 'Executive Headshots',
      description: 'Professional headshots of key executives and leadership team',
      format: 'ZIP',
      size: '12 MB'
    },
    {
      type: 'Company Factsheet',
      description: 'Key facts, figures, and company information',
      format: 'PDF',
      size: '500 KB'
    }
  ];

  const mediaContacts = [
    {
      name: 'Jennifer Martinez',
      title: 'Director of Communications',
      email: 'press@flame-fashion.com',
      phone: '+1 (555) 123-4567',
      image: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20communications%20director%20corporate%20headshot%20professional%20photography&width=300&height=300&seq=press-contact-1&orientation=squarish'
    },
    {
      name: 'Michael Chen',
      title: 'PR Manager',
      email: 'pr@flame-fashion.com',
      phone: '+1 (555) 123-4568',
      image: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20PR%20manager%20corporate%20headshot%20professional%20photography&width=300&height=300&seq=press-contact-2&orientation=squarish'
    }
  ];

  const filteredReleases = pressReleases.filter(release => 
    release.date.startsWith(selectedYear)
  );

  const years = ['2024', '2023', '2022'];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Press Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and media resources from Flame Fashion.
          </p>
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Press Releases</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black pr-8"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredReleases.map(release => (
              <article key={release.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={release.image} 
                  alt={release.title}
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
                      {release.category}
                    </span>
                    <time className="text-sm text-gray-500">
                      {new Date(release.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {release.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {release.summary}
                  </p>
                  <button className="text-black font-medium hover:text-gray-700 transition-colors">
                    Read Full Release →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.type}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{item.format}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media Contacts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaContacts.map((contact, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <img 
                  src={contact.image} 
                  alt={contact.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover object-top"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{contact.name}</h3>
                <p className="text-gray-600 mb-4">{contact.title}</p>
                <div className="space-y-2">
                  <a href={`mailto:${contact.email}`} className="flex items-center justify-center text-gray-700 hover:text-black transition-colors">
                    <i className="ri-mail-line mr-2"></i>
                    {contact.email}
                  </a>
                  <a href={`tel:${contact.phone}`} className="flex items-center justify-center text-gray-700 hover:text-black transition-colors">
                    <i className="ri-phone-line mr-2"></i>
                    {contact.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press Inquiries */}
        <div className="bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Press Inquiries</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            For press inquiries, interview requests, or additional information, please contact our media team. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:press@flame-fashion.com" className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Email Press Team
            </a>
            <a href="tel:+1-555-123-4567" className="border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Call Press Line
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
