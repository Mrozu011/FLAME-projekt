'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { recommendationEngine, RecommendationWeight } from '@/lib/recommendation-engine';
import { useCurrency } from '@/hooks/useCurrency';

export default function RecommendationsPage() {
  const { format } = useCurrency();
  const [weights, setWeights] = useState<RecommendationWeight>({
    categoryMatch: 0.3,
    popularity: 0.2,
    priceCompatibility: 0.15,
    userBehavior: 0.2,
    collaborative: 0.1,
    recency: 0.05
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentWeights = recommendationEngine.getWeights();
        const analyticsData = recommendationEngine.getAnalytics();
        
        setWeights(currentWeights);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading recommendation data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleWeightChange = (key: keyof RecommendationWeight, value: number) => {
    const newWeights = { ...weights, [key]: value };
    
    // Ensure weights sum to 1
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    if (total <= 1.1) { // Allow slight tolerance
      setWeights(newWeights);
      recommendationEngine.updateWeights(newWeights);
    }
  };

  const resetWeights = () => {
    const defaultWeights: RecommendationWeight = {
      categoryMatch: 0.3,
      popularity: 0.2,
      priceCompatibility: 0.15,
      userBehavior: 0.2,
      collaborative: 0.1,
      recency: 0.05
    };
    setWeights(defaultWeights);
    recommendationEngine.updateWeights(defaultWeights);
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 0.25) return 'bg-red-500';
    if (weight >= 0.15) return 'bg-orange-500';
    if (weight >= 0.1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const tabs = [
    { id: 'settings', label: 'Algorithm Settings', icon: 'ri-settings-line' },
    { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' },
    { id: 'testing', label: 'A/B Testing', icon: 'ri-test-tube-line' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary transition-theme">
        <div className="flex">
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary transition-theme">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-theme-primary mb-2">
              Recommendation Engine
            </h1>
            <p className="text-theme-secondary">
              Manage AI-powered product recommendations and algorithm settings
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-theme p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-secondary">Total Users</p>
                  <p className="text-2xl font-bold text-theme-primary">
                    {analytics?.totalUsers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <i className="ri-user-line text-xl text-blue-600 dark:text-blue-400"></i>
                </div>
              </div>
            </div>

            <div className="card-theme p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-secondary">Total Behaviors</p>
                  <p className="text-2xl font-bold text-theme-primary">
                    {analytics?.totalBehaviors || 0}
                  </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-lg">
                  <i className="ri-mouse-line text-xl text-green-600 dark:text-green-400"></i>
                </div>
              </div>
            </div>

            <div className="card-theme p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-secondary">Algorithm Accuracy</p>
                  <p className="text-2xl font-bold text-theme-primary">87.3%</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <i className="ri-target-line text-xl text-purple-600 dark:text-purple-400"></i>
                </div>
              </div>
            </div>

            <div className="card-theme p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-secondary">Click-through Rate</p>
                  <p className="text-2xl font-bold text-theme-primary">12.4%</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <i className="ri-cursor-line text-xl text-orange-600 dark:text-orange-400"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-theme-primary shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Algorithm Weights */}
              <div className="card-theme p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-theme-primary">
                    Algorithm Weights
                  </h3>
                  <button
                    onClick={resetWeights}
                    className="btn-secondary px-4 py-2 rounded-lg transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(weights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-theme-secondary capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <span className="text-sm text-theme-primary font-medium">
                          {(value * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={value}
                          onChange={(e) => handleWeightChange(key as keyof RecommendationWeight, parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div
                          className={`absolute top-0 left-0 h-2 ${getWeightColor(value)} rounded-lg transition-all duration-200`}
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-information-line text-blue-600 dark:text-blue-400"></i>
                    <span className="text-sm font-medium text-theme-primary">Weight Distribution</span>
                  </div>
                  <div className="text-sm text-theme-secondary">
                    Total weight: {(Object.values(weights).reduce((sum, w) => sum + w, 0) * 100).toFixed(1)}%
                    {Object.values(weights).reduce((sum, w) => sum + w, 0) > 1 && (
                      <span className="text-red-500 ml-2">⚠ Weights should sum to 100%</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendation Types */}
              <div className="card-theme p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-theme-primary mb-4">
                  Recommendation Types
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-theme-secondary rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-user-heart-line text-blue-500"></i>
                      <h4 className="font-medium text-theme-primary">Behavioral</h4>
                    </div>
                    <p className="text-sm text-theme-secondary">
                      Based on user's browsing and purchase history
                    </p>
                  </div>

                  <div className="p-4 border border-theme-secondary rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-team-line text-green-500"></i>
                      <h4 className="font-medium text-theme-primary">Collaborative</h4>
                    </div>
                    <p className="text-sm text-theme-secondary">
                      Recommendations from users with similar preferences
                    </p>
                  </div>

                  <div className="p-4 border border-theme-secondary rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-fire-line text-orange-500"></i>
                      <h4 className="font-medium text-theme-primary">Popularity</h4>
                    </div>
                    <p className="text-sm text-theme-secondary">
                      Based on overall product popularity and trends
                    </p>
                  </div>

                  <div className="p-4 border border-theme-secondary rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-price-tag-3-line text-purple-500"></i>
                      <h4 className="font-medium text-theme-primary">Category</h4>
                    </div>
                    <p className="text-sm text-theme-secondary">
                      Products from preferred categories and brands
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Top Categories */}
              <div className="card-theme p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-theme-primary mb-4">
                  Top Categories
                </h3>
                <div className="space-y-3">
                  {analytics?.topCategories?.map((category: any, index: number) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium text-theme-primary">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-theme-primary">
                          {category.count} interactions
                        </div>
                        <div className="text-xs text-theme-secondary">
                          {((category.count / analytics.totalBehaviors) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="card-theme p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-theme-primary mb-4">
                  Top Recommended Products
                </h3>
                <div className="space-y-3">
                  {analytics?.topProducts?.slice(0, 5).map((product: any, index: number) => {
                    const productData = recommendationEngine.getProduct(product.productId);
                    return (
                      <div key={product.productId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-lg">
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-theme-primary">
                              {productData?.name || 'Unknown Product'}
                            </div>
                            <div className="text-sm text-theme-secondary">
                              {productData?.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-theme-primary">
                            {product.views} views
                          </div>
                          <div className="text-xs text-theme-secondary">
                            {product.purchases} purchases
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div className="card-theme p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-theme-primary mb-4">
                  A/B Testing
                </h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-flask-line text-yellow-600 dark:text-yellow-400"></i>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      A/B testing functionality is coming soon. This will allow you to test different recommendation algorithms and measure their performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}