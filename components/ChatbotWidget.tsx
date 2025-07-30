
'use client';

import { useState, useEffect, useRef } from 'react';
import { chatbotService, ChatMessage, ChatSession } from '@/lib/chatbot-service';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !session) {
      const newSession = chatbotService.createSession();
      setSession(newSession);
      setMessages(newSession.messages);
    }
  }, [isOpen, session]);

  useEffect(() => {
    if (session) {
      const unsubscribe = chatbotService.subscribe((sessions) => {
        const currentSession = sessions.find(s => s.id === session.id);
        if (currentSession) {
          setMessages(currentSession.messages);
        }
      });

      return () => unsubscribe();
    }
  }, [session]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;

    setIsTyping(true);
    setInputValue('');

    try {
      await chatbotService.sendMessage(session.id, inputValue, userInfo);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (reply: string) => {
    if (session) {
      setInputValue(reply);
      handleSendMessage();
    }
  };

  const handleUserInfoSubmit = () => {
    setShowUserForm(false);
    if (session) {
      chatbotService.sendMessage(session.id, `My details: ${userInfo.name} - ${userInfo.email}`, userInfo);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <i className="ri-robot-line text-white text-xs"></i>
              </div>
              <span className="text-xs text-gray-500">Shopping Assistant</span>
            </div>
          )}
          
          <div className={`rounded-lg px-4 py-2 ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {message.type === 'product_card' && message.metadata?.products ? (
              <div className="space-y-3">
                <p className="text-sm mb-3">{message.content}</p>
                {message.metadata.products.map((product: any) => (
                  <div key={product.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex space-x-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-lg font-bold text-blue-600">${product.price}</p>
                        <p className="text-sm text-green-600">{product.availability}</p>
                        <p className="text-xs text-gray-500">Sizes: {product.sizes.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : message.type === 'order_status' && message.metadata ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Order Status</p>
                <div className="bg-white rounded p-3 text-gray-800">
                  <p><strong>Order ID:</strong> {message.metadata.orderId}</p>
                  <p><strong>Status:</strong> {message.metadata.status}</p>
                  <p><strong>Tracking:</strong> {message.metadata.trackingNumber}</p>
                  <p><strong>Delivery:</strong> {message.metadata.estimatedDelivery}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            )}
          </div>
          
          {message.type === 'quick_reply' && message.metadata?.quickReplies && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.metadata.quickReplies.map((reply: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
          
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 z-50"
      >
        <i className="ri-chat-3-line text-xl"></i>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white">1</span>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-2xl border z-50 transition-all duration-300 ${
      isMinimized ? 'h-12' : 'h-96'
    }`}>
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <i className="ri-robot-line text-sm"></i>
          </div>
          <div>
            <h3 className="font-medium">Shopping Assistant</h3>
            <p className="text-xs opacity-90">Online • Typically replies instantly</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <i className={`ri-${isMinimized ? 'add' : 'subtract'}-line text-sm`}></i>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {messages.map(renderMessage)}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUserForm(true)}
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                title="Add contact info"
              >
                <i className="ri-user-line"></i>
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <i className="ri-send-plane-line"></i>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleQuickReply('Track my order')}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                >
                  Track order
                </button>
                <button
                  onClick={() => handleQuickReply('Size guide')}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                >
                  Size guide
                </button>
              </div>
              <p className="text-xs text-gray-500">Powered by AI</p>
            </div>
          </div>
        </>
      )}

      {/* User Info Modal */}
      {showUserForm && (
        <div className="absolute inset-0 bg-white rounded-lg z-10">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Contact Information</h3>
              <button
                onClick={() => setShowUserForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your phone number"
              />
            </div>
            
            <button
              onClick={handleUserInfoSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
