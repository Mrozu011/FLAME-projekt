'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { personalizationEngine } from '@/lib/personalization-engine';

export default function PersonalizationAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState(personalizationEngine.getSettings());
  const [analytics, setAnalytics] = useState<any>(null);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [exportLoading, setExportLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadAnalytics();
    loadUserProfiles();
  }, []);

  const loadAnalytics = () => {
    const data = personalizationEngine.getAnalytics();
    setAnalytics(data);
  };

  const loadUserProfiles = () => {
    const profiles = personalizationEngine.getAllUserProfiles();
    setUserProfiles(profiles);
  };

  const handleSettingsUpdate = async (updatedSettings: any) => {
    setSaving(true);
    try {
      personalizationEngine.updateSettings(updatedSettings);
      setSettings(personalizationEngine.getSettings());
      setSuccessMessage('个性化设置已更新');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportUserData = async (userId: string) => {
    setExportLoading(true);
    try {
      const userData = personalizationEngine.exportUserData(userId);
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `user-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting user data:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteUserData = async (userId: string) => {
    if (confirm('确定要删除该用户的所有个性化数据吗？此操作不可逆。')) {
      personalizationEngine.deleteUserData(userId);
      loadUserProfiles();
      loadAnalytics();
      setSuccessMessage('用户数据已删除');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleResetUserPersonalization = (userId: string) => {
    if (confirm('确定要重置该用户的个性化设置吗？')) {
      personalizationEngine.resetUserPersonalization(userId);
      loadUserProfiles();
      loadAnalytics();
      setSuccessMessage('用户个性化设置已重置');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg mr-3"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">个性化引擎管理</h1>
            </div>
            <div className="text-sm text-gray-500">
              智能用户体验个性化系统
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <i className="ri-check-line text-green-500 mr-2"></i>
              <p className="text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                个性化设置
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                分析数据
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                用户管理
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'privacy'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                隐私合规
              </button>
            </nav>
          </div>

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">核心设置</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">启用个性化引擎</h3>
                      <p className="text-sm text-gray-500">全局开关，控制整个个性化系统</p>
                    </div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">分类优先级</h3>
                        <p className="text-sm text-gray-500">根据浏览习惯调整分类显示</p>
                      </div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.categoryPrioritization}
                          onChange={(e) => setSettings({...settings, categoryPrioritization: e.target.checked})}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">主题个性化</h3>
                        <p className="text-sm text-gray-500">记住用户主题偏好</p>
                      </div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.themePersonalization}
                          onChange={(e) => setSettings({...settings, themePersonalization: e.target.checked})}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">尺寸推荐</h3>
                        <p className="text-sm text-gray-500">基于购买历史推荐尺寸</p>
                      </div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.sizeRecommendations}
                          onChange={(e) => setSettings({...settings, sizeRecommendations: e.target.checked})}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">本地化配送</h3>
                        <p className="text-sm text-gray-500">根据IP地址提供本地配送选项</p>
                      </div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.locationBasedShipping}
                          onChange={(e) => setSettings({...settings, locationBasedShipping: e.target.checked})}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">算法权重调整</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      分类偏好权重: {settings.weights.categoryPreference}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.weights.categoryPreference}
                      onChange={(e) => setSettings({
                        ...settings,
                        weights: {
                          ...settings.weights,
                          categoryPreference: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      时间新近度权重: {settings.weights.recencyBoost}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.weights.recencyBoost}
                      onChange={(e) => setSettings({
                        ...settings,
                        weights: {
                          ...settings.weights,
                          recencyBoost: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      购买历史权重: {settings.weights.purchaseHistory}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.weights.purchaseHistory}
                      onChange={(e) => setSettings({
                        ...settings,
                        weights: {
                          ...settings.weights,
                          purchaseHistory: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      设备一致性权重: {settings.weights.deviceConsistency}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.weights.deviceConsistency}
                      onChange={(e) => setSettings({
                        ...settings,
                        weights: {
                          ...settings.weights,
                          deviceConsistency: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      位置相关性权重: {settings.weights.locationRelevance}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.weights.locationRelevance}
                      onChange={(e) => setSettings({
                        ...settings,
                        weights: {
                          ...settings.weights,
                          locationRelevance: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">数据管理</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      隐私级别
                    </label>
                    <select
                      value={settings.privacyLevel}
                      onChange={(e) => setSettings({...settings, privacyLevel: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      <option value="basic">基础 - 只收集必要数据</option>
                      <option value="enhanced">增强 - 收集行为分析数据</option>
                      <option value="full">完整 - 收集所有可用数据</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      数据保留天数: {settings.dataRetentionDays}
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="30"
                      value={settings.dataRetentionDays}
                      onChange={(e) => setSettings({...settings, dataRetentionDays: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>30天</span>
                      <span>365天</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSettingsUpdate(settings)}
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    saving
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {saving ? (
                    <span className="flex items-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      保存中...
                    </span>
                  ) : (
                    '保存设置'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-line text-blue-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">总用户数</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-pulse-line text-green-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">活跃用户</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-database-line text-purple-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">行为数据</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalBehaviors}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="ri-shield-check-line text-orange-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">GDPR同意率</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.privacyMetrics.consentRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">热门分类</h3>
                  <div className="space-y-3">
                    {analytics.topCategories.map((category: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{category.category}</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${(category.count / Math.max(...analytics.topCategories.map((c: any) => c.count))) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">设备分布</h3>
                  <div className="space-y-3">
                    {analytics.deviceBreakdown.map((device: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className={`${
                            device.device === 'mobile' ? 'ri-smartphone-line' :
                            device.device === 'tablet' ? 'ri-tablet-line' :
                            'ri-computer-line'
                          } text-gray-400 mr-3`}></i>
                          <span className="text-sm font-medium text-gray-900 capitalize">{device.device}</span>
                        </div>
                        <span className="text-sm text-gray-600">{device.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">用户个性化数据管理</h2>
                  <p className="text-sm text-gray-500 mt-1">管理用户个性化设置和数据导出</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          用户ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          主要分类
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          最后活跃
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GDPR同意
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userProfiles.map((profile, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {profile.userId.startsWith('anon_') ? '匿名用户' : profile.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {profile.preferences.primaryCategory || '未设置'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(profile.lastActive).toLocaleDateString('zh-CN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              profile.gdprConsent 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {profile.gdprConsent ? '已同意' : '未同意'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleExportUserData(profile.userId)}
                              disabled={exportLoading}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <i className="ri-download-line mr-1"></i>
                              导出
                            </button>
                            <button
                              onClick={() => handleResetUserPersonalization(profile.userId)}
                              className="text-yellow-600 hover:text-yellow-900 ml-2"
                            >
                              <i className="ri-refresh-line mr-1"></i>
                              重置
                            </button>
                            <button
                              onClick={() => handleDeleteUserData(profile.userId)}
                              className="text-red-600 hover:text-red-900 ml-2"
                            >
                              <i className="ri-delete-bin-line mr-1"></i>
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && analytics && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">GDPR 合规状态</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {analytics.privacyMetrics.totalUsers}
                    </div>
                    <p className="text-sm text-gray-600">总用户数</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {analytics.privacyMetrics.consentedUsers}
                    </div>
                    <p className="text-sm text-gray-600">已同意用户</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {analytics.privacyMetrics.consentRate.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">同意率</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">数据保护措施</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      <span className="text-sm text-gray-700">用户数据匿名化处理</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      <span className="text-sm text-gray-700">自动数据过期清理（{analytics.privacyMetrics.dataRetentionDays}天）</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      <span className="text-sm text-gray-700">用户数据导出功能</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      <span className="text-sm text-gray-700">用户数据删除功能</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      <span className="text-sm text-gray-700">隐私级别控制：{analytics.privacyMetrics.privacyLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookie 和追踪说明</h2>
                <div className="prose text-sm text-gray-600">
                  <p className="mb-3">
                    我们的个性化引擎使用以下技术来改善用户体验：
                  </p>
                  <ul className="space-y-2">
                    <li>• <strong>本地存储</strong>：保存用户偏好和个性化设置</li>
                    <li>• <strong>会话存储</strong>：临时存储浏览会话数据</li>
                    <li>• <strong>行为分析</strong>：分析用户浏览模式以提供个性化内容</li>
                    <li>• <strong>IP 地理位置</strong>：提供本地化的配送选项</li>
                  </ul>
                  <p className="mt-4">
                    所有数据处理都符合 GDPR 要求，用户可以随时选择退出个性化服务或删除其数据。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}