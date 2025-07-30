
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  loginTime: string;
  expiresAt: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { format } = useCurrency();

  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResults, setTrackingResults] = useState<any>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedSession = localStorage.getItem('flame-user-session');

    if (!savedSession) {
      router.push('/login');
      return;
    }

    try {
      const session = JSON.parse(savedSession);
      const now = new Date().toISOString();

      if (session.expiresAt && session.expiresAt > now) {
        setUserSession(session);
        loadUserProfile(session.user);
      } else {
        localStorage.removeItem('flame-user-session');
        router.push('/login');
      }
    } catch {
      localStorage.removeItem('flame-user-session');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loadUserProfile = (user: UserSession['user']) => {
    const savedProfile = localStorage.getItem(`flame-profile-${user.id}`);

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setUserProfile((prev) => ({
        ...prev,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ')[1] || '',
        email: user.email
      }));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const validationErrors: Record<string, string> = {};

    if (!userProfile.firstName.trim()) {
      validationErrors.firstName = t('auth.required') || 'Required';
    }
    if (!userProfile.lastName.trim()) {
      validationErrors.lastName = t('auth.required') || 'Required';
    }
    if (!userProfile.email.trim()) {
      validationErrors.email = t('auth.emailRequired') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userProfile.email)) {
      validationErrors.email = t('auth.invalidEmail') || 'Invalid email';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userSession) {
        localStorage.setItem(`flame-profile-${userSession.user.id}`, JSON.stringify(userProfile));

        const updatedSession = {
          ...userSession,
          user: {
            ...userSession.user,
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            email: userProfile.email
          }
        };
        localStorage.setItem('flame-user-session', JSON.stringify(updatedSession));
        setUserSession(updatedSession);
      }

      setSuccessMessage(t('profile.profileUpdated') || 'Profile updated successfully');
      setIsEditing(false);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: t('profile.errorOccurred') || 'An error occurred' });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const validationErrors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      validationErrors.currentPassword = t('auth.passwordRequired') || 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      validationErrors.newPassword = t('auth.passwordRequired') || 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      validationErrors.newPassword = t('auth.passwordTooShort') || 'Password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      validationErrors.confirmPassword = t('auth.passwordMismatch') || 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccessMessage(t('profile.passwordUpdated') || 'Password updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: t('profile.errorOccurred') || 'An error occurred' });
    }
  };

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsTrackingLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockTrackingData = {
        trackingNumber: trackingNumber,
        status: 'In Transit',
        estimatedDelivery: '2024-01-28',
        carrier: 'FedEx',
        location: 'Distribution Center - Chicago, IL',
        events: [
          { date: '2024-01-25', time: '14:30', location: 'Origin Facility', event: 'Package picked up' },
          { date: '2024-01-25', time: '18:45', location: 'Sorting Facility', event: 'Package sorted' },
          { date: '2024-01-26', time: '08:15', location: 'Distribution Center', event: 'In transit' },
          { date: '2024-01-26', time: '12:30', location: 'Chicago, IL', event: 'Arrived at facility' }
        ]
      };

      setTrackingResults(mockTrackingData);
    } catch (error) {
      setErrors({ tracking: t('trackingError') || 'Error tracking shipment' });
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Support Request - Flame Fashion');
    const body = encodeURIComponent(`Hello Flame Fashion Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nAccount: ${userSession?.user.email}\nName: ${userSession?.user.name}\n\nThank you for your help!`);
    window.location.href = `mailto:support@flame.com?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('profile.personalInfo') || 'My Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('profile.manageTrackOrders') || 'Manage your account settings and preferences'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 sticky top-20">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <i className="ri-user-fill text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{userSession.user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{userSession.user.email}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1">
                    <i className="ri-shield-check-line mr-1"></i>
                    Verified
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="ri-user-settings-line mr-3 text-lg"></i>
                  {t('profile.personalInfo') || 'Personal Information'}
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'password'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="ri-lock-password-line mr-3 text-lg"></i>
                  {t('profile.changePassword') || 'Change Password'}
                </button>

                <button
                  onClick={() => setActiveTab('tracking')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'tracking'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="ri-truck-line mr-3 text-lg"></i>
                  {t('profile.trackShipment') || 'Track Shipment'}
                </button>

                <Link
                  href="/order-history"
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <i className="ri-history-line mr-3 text-lg"></i>
                  {t('profile.orderHistory') || 'Order History'}
                </Link>

                <Link
                  href="/profile/returns"
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <i className="ri-refund-line mr-3 text-lg"></i>
                  Returns & Refunds
                </Link>

                <Link
                  href="/profile/support"
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <i className="ri-customer-service-line mr-3 text-lg"></i>
                  Support Center
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-3"></i>
                  <p className="text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('profile.personalInfo') || 'Personal Information'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your account details and preferences
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                        isEditing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                          : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                      }`}
                    >
                      <i className={`${isEditing ? 'ri-close-line' : 'ri-edit-line'} mr-2`}></i>
                      {isEditing ? (t('common.cancel') || 'Cancel') : (t('common.edit') || 'Edit')}
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          {t('profile.firstName') || 'First Name'}
                        </label>
                        <input
                          type="text"
                          value={userProfile.firstName}
                          onChange={(e) =>
                            setUserProfile((prev) => ({ ...prev, firstName: e.target.value }))
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          } ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          {t('profile.lastName') || 'Last Name'}
                        </label>
                        <input
                          type="text"
                          value={userProfile.lastName}
                          onChange={(e) =>
                            setUserProfile((prev) => ({ ...prev, lastName: e.target.value }))
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          } ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {t('auth.emailAddress') || 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) =>
                          setUserProfile((prev) => ({ ...prev, email: e.target.value }))
                        }
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                          !isEditing 
                            ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        } ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          {t('profile.phone') || 'Phone Number'}
                        </label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) =>
                            setUserProfile((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          {t('profile.dateOfBirth') || 'Date of Birth'}
                        </label>
                        <input
                          type="date"
                          value={userProfile.dateOfBirth}
                          onChange={(e) =>
                            setUserProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <i className="ri-map-pin-line mr-2"></i>
                        {t('profile.billingAddress') || 'Billing Address'}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          placeholder={t('profile.streetAddress') || 'Street Address'}
                          value={userProfile.address.street}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              address: { ...prev.address, street: e.target.value }
                            }))
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder={t('profile.city') || 'City'}
                            value={userProfile.address.city}
                            onChange={(e) =>
                              setUserProfile((prev) => ({
                                ...prev,
                                address: { ...prev.address, city: e.target.value }
                              }))
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                              !isEditing 
                                ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}
                          />
                          <input
                            type="text"
                            placeholder={t('profile.zipCode') || 'ZIP Code'}
                            value={userProfile.address.zipCode}
                            onChange={(e) =>
                              setUserProfile((prev) => ({
                                ...prev,
                                address: { ...prev.address, zipCode: e.target.value }
                              }))
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                              !isEditing 
                                ? 'bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex items-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                          type="submit"
                          className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
                        >
                          <i className="ri-save-line mr-2"></i>
                          {t('profile.saveChanges') || 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium whitespace-nowrap"
                        >
                          <i className="ri-close-line mr-2"></i>
                          {t('common.cancel') || 'Cancel'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('profile.changePassword') || 'Change Password'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Update your password to keep your account secure
                  </p>
                </div>

                <div className="p-8">
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {t('auth.currentPassword') || 'Current Password'}
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: e.target.value
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.currentPassword && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {t('auth.newPassword') || 'New Password'}
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.newPassword && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {t('profile.confirmNewPassword') || 'Confirm New Password'}
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="submit"
                        className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
                      >
                        <i className="ri-key-line mr-2"></i>
                        {t('profile.updatePassword') || 'Update Password'}
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      {t('auth.passwordRequirements') || 'Password Requirements'}
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li className="flex items-center">
                        <i className="ri-check-line mr-2"></i>
                        {t('auth.passwordMinLength') || 'At least 6 characters long'}
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line mr-2"></i>
                        {t('auth.passwordUpperLower') || 'Contains uppercase and lowercase letters'}
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line mr-2"></i>
                        {t('auth.passwordNumber') || 'Contains at least one number'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('profile.trackShipment') || 'Track Shipment'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Enter your tracking number to get real-time updates
                  </p>
                </div>

                <div className="p-8">
                  <form onSubmit={handleTrackShipment} className="mb-8">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder={t('profile.enterTrackingNumber') || 'Enter tracking number (e.g., FL123456789)'}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isTrackingLoading}
                        className={`px-8 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                          isTrackingLoading
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                        }`}
                      >
                        {isTrackingLoading ? (
                          <span className="flex items-center">
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            {t('profile.tracking') || 'Tracking...'}
                          </span>
                        ) : (
                          <>
                            <i className="ri-search-line mr-2"></i>
                            {t('profile.track') || 'Track'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {trackingResults && (
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t('profile.trackingNumber') || 'Tracking Number'}
                            </p>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{trackingResults.trackingNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.carrier') || 'Carrier'}</p>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{trackingResults.carrier}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('common.status') || 'Status'}</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold">
                              <i className="ri-truck-line mr-1"></i>
                              {trackingResults.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t('profile.estimatedDelivery') || 'Estimated Delivery'}
                            </p>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{trackingResults.estimatedDelivery}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <i className="ri-time-line mr-2"></i>
                          {t('profile.trackingHistory') || 'Tracking History'}
                        </h3>
                        <div className="space-y-4">
                          {trackingResults.events.map((event: any, index: number) => (
                            <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <i className="ri-map-pin-line text-white"></i>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">{event.event}</p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{event.location}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                  {event.date} at {event.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
