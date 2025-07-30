'use client';

import { useState, useEffect } from 'react';
import { usePersonalization } from '@/components/PersonalizationProvider';

export default function GDPRConsent() {
  const { updateConsent, togglePersonalization } = usePersonalization();
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // 检查是否已经获得同意
    const saved = localStorage.getItem('gdpr-consent');
    if (!saved) {
      // 延迟显示以避免影响初始加载
      setTimeout(() => {
        setShowConsent(true);
      }, 2000);
    }
  }, []);

  const handleAccept = () => {
    updateConsent(true);
    togglePersonalization(true);
    setShowConsent(false);
    
    localStorage.setItem('gdpr-consent', JSON.stringify({
      consent: true,
      date: new Date().toISOString(),
      version: '1.0'
    }));
  };

  const handleReject = () => {
    updateConsent(false);
    togglePersonalization(false);
    setShowConsent(false);
    
    localStorage.setItem('gdpr-consent', JSON.stringify({
      consent: false,
      date: new Date().toISOString(),
      version: '1.0'
    }));
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <i className="ri-shield-check-line text-blue-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                个性化体验和隐私设置
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                为了为您提供更好的购物体验，我们希望使用您的浏览数据来个性化内容和推荐。
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <i className="ri-check-line text-green-500 mr-3"></i>
              <span className="text-sm text-gray-700">个性化产品推荐</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-500 mr-3"></i>
              <span className="text-sm text-gray-700">记住您的偏好设置</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-500 mr-3"></i>
              <span className="text-sm text-gray-700">本地化配送选项</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-500 mr-3"></i>
              <span className="text-sm text-gray-700">优化的用户界面</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <i className="ri-lock-line text-gray-500 mr-2"></i>
              <span className="text-sm font-medium text-gray-700">您的隐私权利</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 随时查看、导出或删除您的数据</li>
              <li>• 随时撤回同意并禁用个性化</li>
              <li>• 所有数据都经过匿名化处理</li>
              <li>• 严格遵守 GDPR 和相关隐私法规</li>
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <i className="ri-information-line mr-1"></i>
              了解更多详情
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                拒绝
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                接受并启用
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">详细信息</h4>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">收集的数据类型：</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li>页面浏览记录和停留时间</li>
                    <li>产品查看和搜索历史</li>
                    <li>购买历史和偏好</li>
                    <li>设备信息和浏览器类型</li>
                    <li>IP 地址（仅用于本地化服务）</li>
                    <li>主题和语言偏好</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">数据处理目的：</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li>提供个性化的产品推荐</li>
                    <li>优化网站布局和内容显示</li>
                    <li>提供本地化的配送选项</li>
                    <li>记住您的偏好设置</li>
                    <li>改善整体用户体验</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">数据保护措施：</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li>所有数据都经过匿名化处理</li>
                    <li>数据自动在90天后过期删除</li>
                    <li>安全的本地存储，不会发送到外部服务器</li>
                    <li>您可以随时导出或删除您的数据</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <i className="ri-shield-check-line mr-2"></i>
                    我们承诺严格遵守 GDPR、CCPA 和其他适用的隐私法规。您的数据安全和隐私权利始终是我们的首要关注。
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