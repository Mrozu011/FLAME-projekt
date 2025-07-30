
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { chatbotService, ChatSession, ChatMessage } from '@/lib/chatbot-service';

export default function ChatbotConversationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSessions();
    
    const unsubscribe = chatbotService.subscribe((updatedSessions) => {
      setSessions(updatedSessions);
    });

    return () => unsubscribe();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const allSessions = chatbotService.getAllSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesSearch = !searchQuery || 
      session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExportSession = (session: ChatSession) => {
    const data = {
      sessionId: session.id,
      userInfo: session.userInfo,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      messages: session.messages,
      duration: formatDuration(session.startTime, session.endTime)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-session-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-lg px-4 py-2 ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm whitespace-pre-line">{message.content}</p>
          </div>
          
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.sender === 'user' ? 'User' : 'Bot'} • {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Sessions List */}
            <div className="w-1/3 border-r border-gray-200 bg-white">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Chat Conversations</h1>
                <p className="text-gray-600 mt-1">Review and manage customer conversations</p>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="escalated">Escalated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading conversations...</p>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="p-8 text-center">
                    <i className="ri-chat-3-line text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedSession?.id === session.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <i className="ri-user-line text-blue-600"></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {session.userInfo?.name || 'Anonymous User'}
                              </p>
                              <p className="text-sm text-gray-500">{session.userInfo?.email}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          {session.messages.length > 0 && (
                            <p className="truncate">
                              {session.messages[session.messages.length - 1].content}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatTime(session.startTime)}</span>
                          <span>{session.messages.length} messages</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Conversation Detail */}
            <div className="flex-1 flex flex-col">
              {selectedSession ? (
                <>
                  {/* Header */}
                  <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedSession.userInfo?.name || 'Anonymous User'}
                        </h2>
                        <p className="text-gray-600">{selectedSession.userInfo?.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                            {selectedSession.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Duration: {formatDuration(selectedSession.startTime, selectedSession.endTime)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Messages: {selectedSession.messages.length}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleExportSession(selectedSession)}
                          className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <i className="ri-download-line mr-2"></i>
                          Export
                        </button>
                        
                        {selectedSession.status === 'active' && (
                          <button
                            onClick={() => chatbotService.closeSession(selectedSession.id)}
                            className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <i className="ri-close-line mr-2"></i>
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                      {selectedSession.messages.map(renderMessage)}
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="bg-white border-t border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Session ID</p>
                        <p className="text-sm text-gray-600">{selectedSession.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Language</p>
                        <p className="text-sm text-gray-600">{selectedSession.language}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Started</p>
                        <p className="text-sm text-gray-600">{formatTime(selectedSession.startTime)}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <i className="ri-chat-3-line text-6xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
