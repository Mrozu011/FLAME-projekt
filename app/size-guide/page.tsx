
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState('women');
  const [activeUnit, setActiveUnit] = useState('cm');
  const [selectedGender, setSelectedGender] = useState('women');

  const categories = [
    { id: 'women', label: 'Women\'s Clothing', icon: 'ri-user-3-line' },
    { id: 'men', label: 'Men\'s Clothing', icon: 'ri-user-line' },
    { id: 'shoes', label: 'Shoes', icon: 'ri-footprint-line' },
    { id: 'accessories', label: 'Accessories', icon: 'ri-handbag-line' }
  ];

  const womenSizes = {
    cm: [
      { size: 'XS', bust: '78-82', waist: '58-62', hips: '86-90' },
      { size: 'S', bust: '82-86', waist: '62-66', hips: '90-94' },
      { size: 'M', bust: '86-90', waist: '66-70', hips: '94-98' },
      { size: 'L', bust: '90-96', waist: '70-76', hips: '98-104' },
      { size: 'XL', bust: '96-102', waist: '76-82', hips: '104-110' },
      { size: 'XXL', bust: '102-108', waist: '82-88', hips: '110-116' }
    ],
    in: [
      { size: 'XS', bust: '31-32', waist: '23-24', hips: '34-35' },
      { size: 'S', bust: '32-34', waist: '24-26', hips: '35-37' },
      { size: 'M', bust: '34-35', waist: '26-28', hips: '37-39' },
      { size: 'L', bust: '35-38', waist: '28-30', hips: '39-41' },
      { size: 'XL', bust: '38-40', waist: '30-32', hips: '41-43' },
      { size: 'XXL', bust: '40-43', waist: '32-35', hips: '43-46' }
    ]
  };

  const menSizes = {
    cm: [
      { size: 'XS', chest: '84-88', waist: '68-72', hips: '88-92' },
      { size: 'S', chest: '88-92', waist: '72-76', hips: '92-96' },
      { size: 'M', chest: '92-96', waist: '76-80', hips: '96-100' },
      { size: 'L', chest: '96-102', waist: '80-86', hips: '100-106' },
      { size: 'XL', chest: '102-108', waist: '86-92', hips: '106-112' },
      { size: 'XXL', chest: '108-114', waist: '92-98', hips: '112-118' }
    ],
    in: [
      { size: 'XS', chest: '33-35', waist: '27-28', hips: '35-36' },
      { size: 'S', chest: '35-36', waist: '28-30', hips: '36-38' },
      { size: 'M', chest: '36-38', waist: '30-31', hips: '38-39' },
      { size: 'L', chest: '38-40', waist: '31-34', hips: '39-42' },
      { size: 'XL', chest: '40-43', waist: '34-36', hips: '42-44' },
      { size: 'XXL', chest: '43-45', waist: '36-39', hips: '44-46' }
    ]
  };

  const shoeSizes = {
    women: [
      { us: '5', uk: '2.5', eu: '35', cm: '22' },
      { us: '5.5', uk: '3', eu: '35.5', cm: '22.5' },
      { us: '6', uk: '3.5', eu: '36', cm: '23' },
      { us: '6.5', uk: '4', eu: '37', cm: '23.5' },
      { us: '7', uk: '4.5', eu: '37.5', cm: '24' },
      { us: '7.5', uk: '5', eu: '38', cm: '24.5' },
      { us: '8', uk: '5.5', eu: '38.5', cm: '25' },
      { us: '8.5', uk: '6', eu: '39', cm: '25.5' },
      { us: '9', uk: '6.5', eu: '40', cm: '26' },
      { us: '9.5', uk: '7', eu: '40.5', cm: '26.5' },
      { us: '10', uk: '7.5', eu: '41', cm: '27' },
      { us: '10.5', uk: '8', eu: '42', cm: '27.5' }
    ],
    men: [
      { us: '6', uk: '5.5', eu: '39', cm: '24' },
      { us: '6.5', uk: '6', eu: '39.5', cm: '24.5' },
      { us: '7', uk: '6.5', eu: '40', cm: '25' },
      { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
      { us: '8', uk: '7.5', eu: '41', cm: '26' },
      { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
      { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
      { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
      { us: '10', uk: '9.5', eu: '44', cm: '28' },
      { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
      { us: '11', uk: '10.5', eu: '45', cm: '29' },
      { us: '11.5', uk: '11', eu: '45.5', cm: '29.5' },
      { us: '12', uk: '11.5', eu: '46', cm: '30' }
    ]
  };

  const getCurrentSizes = () => {
    if (activeCategory === 'women') return womenSizes[activeUnit];
    if (activeCategory === 'men') return menSizes[activeUnit];
    if (activeCategory === 'shoes') return shoeSizes[selectedGender];
    return [];
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Size Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find your perfect fit with our comprehensive size guide. Accurate measurements ensure you get the right size every time.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size Charts */}
        {(activeCategory === 'women' || activeCategory === 'men') && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                {activeCategory === 'women' ? 'Women\'s' : 'Men\'s'} Clothing Sizes
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Units:</span>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setActiveUnit('cm')}
                    className={`px-4 py-2 text-sm rounded-l-lg transition-colors ${
                      activeUnit === 'cm' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    CM
                  </button>
                  <button
                    onClick={() => setActiveUnit('in')}
                    className={`px-4 py-2 text-sm rounded-r-lg transition-colors ${
                      activeUnit === 'in' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    IN
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeCategory === 'women' ? 'Bust' : 'Chest'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hips</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentSizes().map((size, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{size.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activeCategory === 'women' ? size.bust : size.chest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{size.waist}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{size.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeCategory === 'shoes' && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Shoe Sizes</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Gender:</span>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setSelectedGender('women')}
                    className={`px-4 py-2 text-sm rounded-l-lg transition-colors ${
                      selectedGender === 'women' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Women's
                  </button>
                  <button
                    onClick={() => setSelectedGender('men')}
                    className={`px-4 py-2 text-sm rounded-r-lg transition-colors ${
                      selectedGender === 'men' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Men's
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">US</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UK</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CM</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentSizes().map((size, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{size.us}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{size.uk}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{size.eu}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeCategory === 'accessories' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Accessories Sizing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Bag Dimensions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Small Bag:</span>
                    <span className="text-gray-900">20cm x 15cm x 8cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medium Bag:</span>
                    <span className="text-gray-900">30cm x 20cm x 12cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Large Bag:</span>
                    <span className="text-gray-900">40cm x 30cm x 15cm</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Belt Sizing</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">XS:</span>
                    <span className="text-gray-900">65-70cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">S:</span>
                    <span className="text-gray-900">70-80cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">M:</span>
                    <span className="text-gray-900">80-90cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">L:</span>
                    <span className="text-gray-900">90-100cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">XL:</span>
                    <span className="text-gray-900">100-110cm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Measurement Guide */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Measure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-ruler-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bust/Chest</h3>
              <p className="text-gray-600">
                Measure around the fullest part of your bust/chest, keeping the tape measure parallel to the floor.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-scissors-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Waist</h3>
              <p className="text-gray-600">
                Measure around the narrowest part of your waist, typically just above the hip bones.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-focus-line text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hips</h3>
              <p className="text-gray-600">
                Measure around the fullest part of your hips, keeping the tape measure parallel to the floor.
              </p>
            </div>
          </div>
        </div>

        {/* Size Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sizing Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                <i className="ri-lightbulb-line mr-2"></i>
                Pro Tips
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Always refer to our size chart for each item</li>
                <li>• Consider the fit description (slim, regular, relaxed)</li>
                <li>• Check the fabric composition for stretch</li>
                <li>• When in doubt, size up for comfort</li>
                <li>• Read customer reviews for fit insights</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                <i className="ri-check-line mr-2"></i>
                Perfect Fit Guarantee
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• Free size exchanges within 30 days</li>
                <li>• Virtual fit consultation available</li>
                <li>• Customer service sizing support</li>
                <li>• Size recommendation algorithm</li>
                <li>• Easy returns if size doesn't fit</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact for Help */}
        <div className="bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Sizing Help?</h2>
          <p className="text-gray-300 mb-8">
            Our sizing experts are here to help you find the perfect fit. Get personalized sizing recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Chat with Size Expert
            </button>
            <button className="border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Email Size Team
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
