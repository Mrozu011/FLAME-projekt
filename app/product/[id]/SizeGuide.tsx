'use client';

import { useState } from 'react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  productCategory?: string;
}

export default function SizeGuide({ isOpen, onClose, productCategory = 'clothing' }: SizeGuideProps) {
  const [selectedUnit, setSelectedUnit] = useState<'cm' | 'in'>('cm');
  const [selectedGender, setSelectedGender] = useState<'women' | 'men' | 'unisex'>('women');

  if (!isOpen) return null;

  const convertMeasurement = (cm: number) => {
    return selectedUnit === 'cm' ? cm : Math.round(cm / 2.54 * 10) / 10;
  };

  const getUnit = () => selectedUnit === 'cm' ? 'cm' : 'in';

  const sizingData = {
    women: {
      clothing: {
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        measurements: {
          XS: { chest: 81, waist: 63, hip: 87 },
          S: { chest: 86, waist: 68, hip: 92 },
          M: { chest: 91, waist: 73, hip: 97 },
          L: { chest: 96, waist: 78, hip: 102 },
          XL: { chest: 101, waist: 83, hip: 107 },
          XXL: { chest: 106, waist: 88, hip: 112 }
        }
      },
      shoes: {
        sizes: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
        measurements: {
          '5': { length: 22.5 },
          '5.5': { length: 23.0 },
          '6': { length: 23.5 },
          '6.5': { length: 24.0 },
          '7': { length: 24.5 },
          '7.5': { length: 25.0 },
          '8': { length: 25.5 },
          '8.5': { length: 26.0 },
          '9': { length: 26.5 },
          '9.5': { length: 27.0 },
          '10': { length: 27.5 },
          '10.5': { length: 28.0 },
          '11': { length: 28.5 }
        }
      }
    },
    men: {
      clothing: {
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        measurements: {
          XS: { chest: 86, waist: 71, hip: 89 },
          S: { chest: 91, waist: 76, hip: 94 },
          M: { chest: 96, waist: 81, hip: 99 },
          L: { chest: 101, waist: 86, hip: 104 },
          XL: { chest: 106, waist: 91, hip: 109 },
          XXL: { chest: 111, waist: 96, hip: 114 }
        }
      },
      shoes: {
        sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
        measurements: {
          '6': { length: 24.0 },
          '6.5': { length: 24.5 },
          '7': { length: 25.0 },
          '7.5': { length: 25.5 },
          '8': { length: 26.0 },
          '8.5': { length: 26.5 },
          '9': { length: 27.0 },
          '9.5': { length: 27.5 },
          '10': { length: 28.0 },
          '10.5': { length: 28.5 },
          '11': { length: 29.0 },
          '11.5': { length: 29.5 },
          '12': { length: 30.0 },
          '13': { length: 31.0 }
        }
      }
    }
  };

  const getCurrentData = () => {
    const genderKey = selectedGender === 'unisex' ? 'women' : selectedGender;
    const genderData = sizingData[genderKey as keyof typeof sizingData];
    return genderData[productCategory as keyof typeof genderData] || genderData.clothing;
  };

  const currentData = getCurrentData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <div className="flex rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setSelectedGender('women')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedGender === 'women' 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Women
                  </button>
                  <button
                    onClick={() => setSelectedGender('men')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedGender === 'men' 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Men
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Unit:</span>
              <div className="flex rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setSelectedUnit('cm')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedUnit === 'cm' 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  CM
                </button>
                <button
                  onClick={() => setSelectedUnit('in')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedUnit === 'in' 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  IN
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <i className="ri-information-line mr-2"></i>
              How to Measure
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              {productCategory === 'shoes' ? (
                <div>
                  <p><strong>Foot Length:</strong> Stand on a piece of paper and mark the longest point of your foot. Measure from heel to toe.</p>
                  <p><strong>Tip:</strong> Measure both feet and use the larger measurement. Measure in the evening when feet are at their largest.</p>
                </div>
              ) : (
                <div>
                  <p><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape level.</p>
                  <p><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</p>
                  <p><strong>Hip:</strong> Measure around the fullest part of your hips, about 8 inches below your waist.</p>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                  {productCategory === 'shoes' ? (
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                      Length ({getUnit()})
                    </th>
                  ) : (
                    <>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                        Chest ({getUnit()})
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                        Waist ({getUnit()})
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                        Hip ({getUnit()})
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.sizes.map((size) => {
                  const measurements = currentData.measurements[size as keyof typeof currentData.measurements];
                  return (
                    <tr key={size} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">{size}</td>
                      {productCategory === 'shoes' ? (
                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {convertMeasurement((measurements as { length: number }).length)}
                        </td>
                      ) : (
                        <>
                          <td className="border border-gray-200 px-4 py-3 text-gray-700">
                            {convertMeasurement((measurements as { chest: number }).chest)}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-700">
                            {convertMeasurement((measurements as { waist: number }).waist)}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-700">
                            {convertMeasurement((measurements as { hip: number }).hip)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="ri-question-line mr-2"></i>
                Fit Guide
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span><strong>Regular Fit:</strong> Comfortable, relaxed fit with room to move</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span><strong>Slim Fit:</strong> Closer to the body, tailored silhouette</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span><strong>Loose Fit:</strong> Relaxed, oversized style</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="ri-customer-service-2-line mr-2"></i>
                Need Help?
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>Still not sure about your size? Our customer service team is here to help!</p>
                <div className="flex flex-col space-y-1">
                  <span><strong>Email:</strong> support@flame.com</span>
                  <span><strong>Phone:</strong> 1-800-FLAME-01</span>
                  <span><strong>Live Chat:</strong> Available 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
              <i className="ri-lightbulb-line mr-2"></i>
              Pro Tips
            </h4>
            <div className="space-y-1 text-sm text-yellow-800">
              <p>• If you're between sizes, we recommend sizing up for comfort</p>
              <p>• Consider the fabric - stretchy materials may fit differently</p>
              <p>• Check the product description for specific fit information</p>
              <p>• Remember our 30-day return policy if the fit isn't perfect</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}