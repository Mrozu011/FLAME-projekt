
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminTranslation, AdminTranslationProvider } from '@/hooks/useAdminTranslation';
import { adminHelpSystem, HelpTopic, HelpCategory } from '@/lib/admin-help';

function AdminHelpPageContent() {
  const { t } = useAdminTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [topics, setTopics] = useState<HelpTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<HelpTopic[]>([]);
  const [popularTopics, setPopularTopics] = useState<HelpTopic[]>([]);
  const [recentTopics, setRecentTopics] = useState<HelpTopic[]>([]);
  const [feedback, setFeedback] = useState<{ topicId: string; helpful: boolean } | null>(null);

  useEffect(() => {
    // Initialize help system and scan for new routes
    adminHelpSystem.scanAdminRoutes();
    
    // Load data
    setCategories(adminHelpSystem.getAllCategories());
    setTopics(adminHelpSystem.getAllTopics());
    setPopularTopics(adminHelpSystem.getPopularTopics(6));
    setRecentTopics(adminHelpSystem.getRecentlyUpdatedTopics(4));
  }, []);

  useEffect(() => {
    filterTopics();
  }, [searchQuery, selectedCategory, topics]);

  const filterTopics = () => {
    let filtered = topics;

    if (searchQuery.trim()) {
      filtered = adminHelpSystem.searchTopics(searchQuery);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }

    setFilteredTopics(filtered);
  };

  const handleTopicSelect = (topic: HelpTopic) => {
    setSelectedTopic(topic);
    setFeedback(null);
  };

  const handleFeedback = (topicId: string, helpful: boolean) => {
    setFeedback({ topicId, helpful });
    // In a real implementation, you would send this to an analytics service
    console.log('Feedback submitted:', { topicId, helpful });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown renderer - in production, use a proper markdown library
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
      .replace(/^\*\*(.*)\*\*/gm, '<strong class="font-semibold">$1</strong>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  if (selectedTopic) {
    const relatedTopics = adminHelpSystem.getRelatedTopics(selectedTopic.id);
    const category = adminHelpSystem.getCategory(selectedTopic.category);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedTopic.title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{category?.name}</span>
                    <span>•</span>
                    <span>{t('help.lastUpdated')}: {new Date(selectedTopic.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {selectedTopic.route && (
                  <Link
                    href={selectedTopic.route}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    {t('common.open')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedTopic.content) }}
                />

                {/* Tags */}
                {selectedTopic.tags && selectedTopic.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopic.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Tutorial */}
                {selectedTopic.videoUrl && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">{t('help.videoTutorials')}:</h4>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={selectedTopic.videoUrl}
                        className="w-full h-64 rounded-lg"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">{t('help.wasHelpful')}</h4>
                  {feedback?.topicId === selectedTopic.id ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <i className="ri-check-circle-fill text-green-600 mr-2"></i>
                        <span className="text-green-800">{t('help.thankYou')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleFeedback(selectedTopic.id, true)}
                        className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <i className="ri-thumb-up-line mr-2"></i>
                        {t('help.yes')}
                      </button>
                      <button
                        onClick={() => handleFeedback(selectedTopic.id, false)}
                        className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <i className="ri-thumb-down-line mr-2"></i>
                        {t('help.no')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Related Topics */}
                {relatedTopics.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('help.relatedTopics')}</h3>
                    <div className="space-y-3">
                      {relatedTopics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicSelect(topic)}
                          className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900">{topic.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{topic.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Support */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('help.contactSupport')}</h3>
                  <div className="space-y-3">
                    <Link
                      href="/admin/support"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i className="ri-customer-service-line mr-2"></i>
                      {t('help.contactSupport')}
                    </Link>
                    <Link
                      href="/admin/support?action=report"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i className="ri-bug-line mr-2"></i>
                      {t('help.reportIssue')}
                    </Link>
                    <Link
                      href="/admin/support?action=feature"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i className="ri-lightbulb-line mr-2"></i>
                      {t('help.requestFeature')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('help.title')}</h1>
                <p className="text-sm text-gray-600">{t('help.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-lg">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder={t('help.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">{t('help.categories')}:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">{t('help.allCategories')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* No search results */}
        {searchQuery && filteredTopics.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('help.noResults', { query: searchQuery })}
            </h3>
            <p className="text-gray-600">{t('help.tryDifferentSearch')}</p>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && filteredTopics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('common.search')} "{searchQuery}" ({filteredTopics.length} results)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => {
                const category = adminHelpSystem.getCategory(topic.category);
                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTopicSelect(topic)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`${category?.icon || 'ri-article-line'} text-blue-600`}></i>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">{topic.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{category?.name}</span>
                          <span>•</span>
                          <span>{new Date(topic.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Default View - Categories and Popular Topics */}
        {!searchQuery && (
          <>
            {/* Quick Start */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('help.quickStart')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTopics.slice(0, 3).map((topic) => {
                  const category = adminHelpSystem.getCategory(topic.category);
                  return (
                    <div
                      key={topic.id}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all"
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                          <i className={`${category?.icon || 'ri-article-line'} text-white`}></i>
                        </div>
                        <div>
                          <h3 className="font-medium">{topic.title}</h3>
                          <p className="text-sm text-blue-100">{category?.name}</p>
                        </div>
                      </div>
                      <p className="text-sm text-blue-100">{topic.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('help.categories')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const categoryTopics = adminHelpSystem.getTopicsByCategory(category.id);
                  return (
                    <div
                      key={category.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <i className={`${category.icon} text-gray-600`}></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{categoryTopics.length} topics</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('help.popularTopics')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTopics.map((topic) => {
                  const category = adminHelpSystem.getCategory(topic.category);
                  return (
                    <div
                      key={topic.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className={`${category?.icon || 'ri-article-line'} text-gray-600`}></i>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">{topic.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{category?.name}</span>
                            <span>•</span>
                            <span>{new Date(topic.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recently Updated */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('help.recentlyUpdated')}</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                {recentTopics.map((topic) => {
                  const category = adminHelpSystem.getCategory(topic.category);
                  return (
                    <div
                      key={topic.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className={`${category?.icon || 'ri-article-line'} text-gray-600`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">{topic.title}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(topic.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                            <span>{category?.name}</span>
                            {topic.tags.slice(0, 2).map((tag, index) => (
                              <span key={index}>• #{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminHelpPage() {
  return (
    <AdminTranslationProvider>
      <AdminHelpPageContent />
    </AdminTranslationProvider>
  );
}
