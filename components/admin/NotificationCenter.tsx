
'use client';

import { useState, useEffect, useRef } from 'react';
import { notificationService, Notification } from '@/lib/notification-service';

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'urgent'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load
    loadNotifications();
    
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Request desktop notification permission
    notificationService.requestDesktopPermission();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      await notificationService.checkForNewNotifications();
      setNotifications(notificationService.getNotifications());
      setUnreadCount(notificationService.getUnreadCount());
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      notificationService.markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleSnooze = (notificationId: string, minutes: number, event: React.MouseEvent) => {
    event.stopPropagation();
    notificationService.snoozeNotification(notificationId, minutes);
  };

  const handleDelete = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    notificationService.deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
  };

  const handleRefresh = () => {
    loadNotifications();
  };

  const getFilteredNotifications = () => {
    switch (selectedTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'urgent':
        return notifications.filter(n => n.priority === 'urgent' || n.priority === 'high');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return 'ri-shopping-bag-line';
      case 'return_request':
        return 'ri-arrow-go-back-line';
      case 'stock_warning':
        return 'ri-alert-line';
      case 'payment_failed':
        return 'ri-error-warning-line';
      case 'shipping_delay':
        return 'ri-truck-line';
      default:
        return 'ri-notification-line';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <i className="ri-notification-line text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <i className={`ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Mark all read
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => setSelectedTab('all')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  selectedTab === 'all'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setSelectedTab('unread')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  selectedTab === 'unread'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setSelectedTab('urgent')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  selectedTab === 'urgent'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Urgent ({notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <i className="ri-notification-line text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">No notifications</p>
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getPriorityColor(notification.priority)}`}>
                        <i className={`${getNotificationIcon(notification.type)} text-sm`}></i>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2 mt-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          
                          <div className="relative group">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              Snooze
                            </button>
                            <div className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <button
                                onClick={(e) => handleSnooze(notification.id, 15, e)}
                                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 rounded-t-md"
                              >
                                15 minutes
                              </button>
                              <button
                                onClick={(e) => handleSnooze(notification.id, 60, e)}
                                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                              >
                                1 hour
                              </button>
                              <button
                                onClick={(e) => handleSnooze(notification.id, 1440, e)}
                                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 rounded-b-md"
                              >
                                1 day
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="text-xs text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Clear all
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/admin/notifications';
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
