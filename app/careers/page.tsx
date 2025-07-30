
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Fashion Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead our design team in creating innovative fashion collections that define trends and inspire customers worldwide.',
      requirements: ['Bachelor\'s degree in Fashion Design', '5+ years experience in fashion design', 'Strong portfolio', 'Leadership skills'],
      benefits: ['Competitive salary', 'Health insurance', 'Creative freedom', 'Travel opportunities']
    },
    {
      id: 2,
      title: 'E-commerce Manager',
      department: 'Digital',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Drive our online sales growth and enhance customer experience across all digital platforms.',
      requirements: ['Experience with e-commerce platforms', 'Digital marketing knowledge', 'Analytics skills', 'Project management'],
      benefits: ['Remote work', 'Flexible hours', 'Professional development', 'Stock options']
    },
    {
      id: 3,
      title: 'Brand Marketing Specialist',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Develop and execute marketing campaigns that elevate our brand presence and drive customer engagement.',
      requirements: ['Marketing degree preferred', 'Social media expertise', 'Creative thinking', 'Communication skills'],
      benefits: ['Creative environment', 'Brand discounts', 'Career growth', 'Team events']
    },
    {
      id: 4,
      title: 'Supply Chain Coordinator',
      department: 'Operations',
      location: 'Chicago, IL',
      type: 'Full-time',
      experience: '1+ years',
      description: 'Coordinate with suppliers and manage inventory to ensure smooth operations and timely deliveries.',
      requirements: ['Supply chain knowledge', 'Organizational skills', 'Problem-solving abilities', 'Software proficiency'],
      benefits: ['Growth opportunities', 'Training programs', 'Health benefits', 'Work-life balance']
    },
    {
      id: 5,
      title: 'Customer Success Manager',
      department: 'Customer Service',
      location: 'Miami, FL',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Ensure exceptional customer experience and build lasting relationships with our valued customers.',
      requirements: ['Customer service experience', 'Communication skills', 'Problem-solving', 'Team collaboration'],
      benefits: ['Customer interaction', 'Skill development', 'Supportive team', 'Performance bonuses']
    },
    {
      id: 6,
      title: 'Fashion Photographer',
      department: 'Creative',
      location: 'New York, NY',
      type: 'Contract',
      experience: '3+ years',
      description: 'Capture stunning product photography and lifestyle images that showcase our collections beautifully.',
      requirements: ['Professional photography experience', 'Fashion industry knowledge', 'Technical skills', 'Creative vision'],
      benefits: ['Creative projects', 'Industry networking', 'Portfolio building', 'Competitive rates']
    }
  ];

  const departments = ['all', 'Design', 'Digital', 'Marketing', 'Operations', 'Customer Service', 'Creative'];
  const locations = ['all', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'Remote'];

  const filteredJobs = jobOpenings.filter(job => {
    const departmentMatch = selectedDepartment === 'all' || job.department === selectedDepartment;
    const locationMatch = selectedLocation === 'all' || job.location === selectedLocation;
    return departmentMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Fashion Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Be part of a team that's redefining fashion. We're looking for passionate individuals who share our vision of creating beautiful, sustainable, and accessible fashion for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              View Open Positions
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
              Learn About Our Culture
            </button>
          </div>
        </div>

        {/* Why Work With Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Flame Fashion?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lightbulb-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation First</h3>
              <p className="text-gray-600">
                We embrace new ideas and technologies to stay ahead in the fashion industry. Your creativity will drive our innovation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-team-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Culture</h3>
              <p className="text-gray-600">
                Work with talented professionals who support each other. Our inclusive environment values every voice.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-plant-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable Impact</h3>
              <p className="text-gray-600">
                Be part of creating positive change in fashion. We're committed to sustainability and ethical practices.
              </p>
            </div>
          </div>
        </div>

        {/* Job Filters */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Open Positions</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Department:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black pr-8"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Location:</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black pr-8"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 gap-6 mb-16">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <i className="ri-building-line mr-1"></i>
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-map-pin-line mr-1"></i>
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-time-line mr-1"></i>
                      {job.type}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-user-line mr-1"></i>
                      {job.experience}
                    </span>
                  </div>
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors mt-4 md:mt-0 whitespace-nowrap">
                  Apply Now
                </button>
              </div>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <i className="ri-star-line text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-search-line text-gray-300 text-4xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No positions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new opportunities.</p>
          </div>
        )}

        {/* Application Process */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply Online</h3>
              <p className="text-sm text-gray-600">Submit your application and resume through our online portal.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Initial Review</h3>
              <p className="text-sm text-gray-600">Our team reviews your application and qualifications.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interview Process</h3>
              <p className="text-sm text-gray-600">Meet with our team to discuss your experience and fit.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Join Our Team</h3>
              <p className="text-sm text-gray-600">Start your journey with Flame Fashion and make an impact.</p>
            </div>
          </div>
        </div>

        {/* Contact HR */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            Our HR team is here to help you learn more about opportunities at Flame Fashion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:careers@flame-fashion.com" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Email HR Team
            </a>
            <a href="tel:+1-555-123-4567" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
              Call Us
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
