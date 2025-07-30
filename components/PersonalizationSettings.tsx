'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePersonalization } from '@/components/PersonalizationProvider';
import { personalizationEngine } from '@/lib/personalization-engine';

export default function PersonalizationSettings() {
  const { 
    personalization, 
    isPersonalizationEnabled, 
    togglePersonalization, 
    resetPersonalization, 
    updateConsent 
  } = usePersonalization();
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const loadUserData = useCallback(() => {
    const userId = localStorage.getItem('user-id') || 'guest';
    const profile = personalizationEngine.getUserProfile(userId);
    setUserProfile(profile);
    
    if (profile) {
      const userAnalytics = {
        totalBehaviors: personalizationEngine.getBehaviors(userId).length,
        topCategories: profile.behaviors.mostViewedCategories.slice(0, 5),
        searchPatterns: profile.behaviors.searchPatterns.slice(0, 5),
        dataSize: calculateDataSize(profile)
      };
      setAnalytics(userAnalytics);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    loadGdprConsent();
  }, [loadUserData]);



  const loadGdprConsent = () => {
    const saved = localStorage.getItem('gdpr-consent');
    if (saved) {
      const consent = JSON.parse(saved);
      setGdprConsent(consent.consent);
    }
  };

  const calculateDataSize = (profile: any) => {
    const dataStr = JSON.stringify(profile);
    return Math.round(dataStr.length / 1024 * 100) / 100; // KB
  };

  const handleResetPersonalization = () => {
    setShowConfirmDialog(true);
  };

  const confirmReset = () => {
    resetPersonalization();
    setShowConfirmDialog(false);
    loadUserData();
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const userId = localStorage.getItem('user-id') || 'guest';
      const userData = personalizationEngine.exportUserData(userId);
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `我的个性化数据-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('导出数据失败:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleConsentChange = (consent: boolean) => {
    setGdprConsent(consent);
    updateConsent(consent);
    
    if (!consent) {
      // 如果取消同意，也禁用个性化
      togglePersonalization(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 个性化开关 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">个性化体验</h3>
            <p className="text-sm text-gray-600">
              启用个性化功能，为您提供定制化的购物体验
            </p>
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isPersonalizationEnabled}
              onChange={(e) => togglePersonalization(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </label>
        </div>
        
        {isPersonalizationEnabled && personalization && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-information-line text-blue-500 mr-2"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium">个性化已启用</p>
                <p>匹配度: {Math.round(personalization.confidence * 100)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GDPR 同意管理 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">隐私设置</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <label className="inline-flex items-start mt-1">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => handleConsentChange(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600 mt-1"
              />
            </label>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                我同意收集和处理我的个人数据
              </p>
              <p className="text-xs text-gray-600 mt-1">
                我们将使用您的数据来提供个性化的购物体验。您可以随时撤回同意。
                <button 
                  className="text-blue-600 hover:text-blue-800 ml-1"
                  onClick={() => setShowDataExport(true)}
                >
                  了解更多
                </button>
              </p>
            </div>
          </div>
          
          {gdprConsent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                <span className="text-sm text-green-800">
                  您已同意数据处理政策
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 数据概览 */}
      {userProfile && analytics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">我的数据概览</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{analytics.totalBehaviors}</div>
              <div className="text-sm text-gray-600">浏览记录</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{userProfile.behaviors.purchaseHistory.length}</div>
              <div className="text-sm text-gray-600">购买记录</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{analytics.topCategories.length}</div>
              <div className="text-sm text-gray-600">浏览分类</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{analytics.dataSize}</div>
              <div className="text-sm text-gray-600">数据大小(KB)</div>
            </div>
          </div>
          
          {analytics.topCategories.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">最常浏览分类</h4>
              <div className="flex flex-wrap gap-2">
                {analytics.topCategories.map((cat: any, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {cat.category} ({cat.count})
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {analytics.searchPatterns.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">搜索历史</h4>
              <div className="flex flex-wrap gap-2">
                {analytics.searchPatterns.map((search: any, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    "{search.query}"
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 数据管理操作 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">导出我的数据</h4>
              <p className="text-sm text-gray-600">
                下载包含您所有个人数据的 JSON 文件
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {exportLoading ? (
                <span className="flex items-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  导出中...
                </span>
              ) : (
                <span className="flex items-center">
                  <i className="ri-download-line mr-2"></i>
                  导出数据
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">重置个性化设置</h4>
              <p className="text-sm text-gray-600">
                清除所有个性化数据，恢复默认设置
              </p>
            </div>
            <button
              onClick={handleResetPersonalization}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors whitespace-nowrap"
            >
              <i className="ri-refresh-line mr-2"></i>
              重置设置
            </button>
          </div>
        </div>
      </div>

      {/* 确认重置对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md mx-4 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <i className="ri-alert-line text-yellow-600"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                确认重置个性化设置
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              此操作将永久删除您的所有个性化数据，包括浏览历史、偏好设置和推荐记录。此操作不可撤销。
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 数据说明对话框 */}
      {showDataExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl mx-4 p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                数据收集和使用说明
              </h3>
              <button
                onClick={() => setShowDataExport(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">我们收集的数据：</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>页面浏览记录和浏览时长</li>
                  <li>产品查看和搜索历史</li>
                  <li>购买历史和偏好</li>
                  <li>设备类型和浏览器信息</li>
                  <li>IP 地址（仅用于本地化服务）</li>
                  <li>主题和语言偏好</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">数据用途：</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>提供个性化的产品推荐</li>
                  <li>优化网站布局和内容</li>
                  <li>提供本地化的配送选项</li>
                  <li>记住您的偏好设置</li>
                  <li>改善用户体验</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">您的权利：</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>随时查看和导出您的数据</li>
                  <li>随时撤回数据处理同意</li>
                  <li>要求删除您的个人数据</li>
                  <li>要求更正错误数据</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800">
                  <i className="ri-shield-check-line mr-2"></i>
                  所有数据都经过匿名化处理，严格遵守 GDPR 和相关隐私法规。
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDataExport(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}