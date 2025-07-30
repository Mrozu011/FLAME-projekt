
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { chatbotService, ChatbotAnalytics } from '@/lib/chatbot-service';

export default function ChatbotAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    const data = chatbotService.getAnalytics();
    setAnalytics(data);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMetricColor = (value: number, threshold: number, reverse: boolean = false) => {
    if (reverse) {
      return value <= threshold ? 'text-green-600' : 'text-red-600';
    }
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  if (!analytics) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chatbot Analytics</h1>
                <p className="text-gray-600">Monitor chatbot performance and user interactions</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                <button
                  onClick={loadAnalytics}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Refresh
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalSessions}</p>
                    <p className="text-sm text-gray-500">{analytics.activeSessions} active</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-chat-3-line text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{formatDuration(analytics.avgSessionDuration)}</p>
                    <p className="text-sm text-gray-500">per conversation</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-time-line text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                    <p className={`text-2xl font-bold ${getMetricColor(analytics.resolutionRate, 80)}`}>
                      {analytics.resolutionRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">successful resolutions</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-check-line text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Escalation Rate</p>
                    <p className={`text-2xl font-bold ${getMetricColor(analytics.escalationRate, 20, true)}`}>
                      {analytics.escalationRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">escalated to humans</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-user-line text-orange-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                  <i className="ri-bar-chart-line text-xl text-gray-400"></i>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Messages per Session</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analytics.messagesPerSession.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`ri-star-${i < Math.floor(analytics.satisfactionScore) ? 'fill' : 'line'} text-yellow-400`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.satisfactionScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Resolution Rate</span>
                      <span className={`text-sm font-medium ${getMetricColor(analytics.resolutionRate, 80)}`}>
                        {analytics.resolutionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analytics.resolutionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Escalation Rate</span>
                      <span className={`text-sm font-medium ${getMetricColor(analytics.escalationRate, 20, true)}`}>
                        {analytics.escalationRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analytics.escalationRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Questions</h3>
                  <i className="ri-question-line text-xl text-gray-400"></i>
                </div>
                
                <div className="space-y-3">
                  {analytics.topQuestions.length > 0 ? (
                    analytics.topQuestions.slice(0, 8).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-700 truncate max-w-xs">
                            {item.question}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <i className="ri-question-line text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-500">No questions data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Analytics</h3>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Export Report
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-message-line text-blue-600 text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">User Engagement</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Average of {analytics.messagesPerSession.toFixed(1)} messages per session
                  </p>
                  <div className="mt-3 text-2xl font-bold text-blue-600">
                    {analytics.totalSessions > 0 ? 'High' : 'Low'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-thumb-up-line text-green-600 text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Success Rate</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {analytics.resolutionRate.toFixed(1)}% of conversations resolved
                  </p>
                  <div className={`mt-3 text-2xl font-bold ${getMetricColor(analytics.resolutionRate, 80)}`}>
                    {analytics.resolutionRate >= 80 ? 'Excellent' : analytics.resolutionRate >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-arrow-up-line text-orange-600 text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Escalation Control</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {analytics.escalationRate.toFixed(1)}% escalated to human agents
                  </p>
                  <div className={`mt-3 text-2xl font-bold ${getMetricColor(analytics.escalationRate, 20, true)}`}>
                    {analytics.escalationRate <= 20 ? 'Optimal' : analytics.escalationRate <= 40 ? 'Moderate' : 'High'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
