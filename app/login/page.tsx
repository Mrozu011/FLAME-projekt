
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { activityLogger } from '@/lib/activity-logger';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const userSession = localStorage.getItem('flame-user-session');
    if (userSession) {
      const session = JSON.parse(userSession);
      if (session.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      general: ''
    };

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.invalidEmail') || 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired') || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordTooShort') || 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication check
      if (formData.email === 'admin@example.com' && formData.password === 'password') {
        // Log successful login
        activityLogger.logLogin('Admin User', 'password');

        // Create user session
        const sessionData = {
          user: {
            id: '1',
            name: 'Admin User',
            email: formData.email,
            role: 'admin'
          },
          loginTime: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
        localStorage.setItem('flame-user-session', JSON.stringify(sessionData));

        // Redirect to admin dashboard
        router.push('/admin');
      } else if (formData.email === 'user@example.com' && formData.password === 'password') {
        // Regular user login
        const sessionData = {
          user: {
            id: '2',
            name: 'Regular User',
            email: formData.email,
            role: 'user'
          },
          loginTime: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        localStorage.setItem('flame-user-session', JSON.stringify(sessionData));
        router.push('/');
      } else {
        // Log failed login attempt
        activityLogger.log(
          'Login Failed',
          'login',
          `Failed login attempt for email: ${formData.email}`,
          {
            severity: 'warning'
          }
        );
        setErrors(prev => ({ ...prev, general: t('auth.invalidCredentials') || 'Invalid email or password' }));
      }
    } catch (error) {
      console.error('Login error:', error);
      activityLogger.logSystemError('Login system error', formData.email);
      setErrors(prev => ({ ...prev, general: t('auth.loginError') || 'An error occurred during login' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white">
              <span style={{ fontFamily: 'Pacifico, serif' }}>Flame</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.signIn') || 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.or') || 'or'}{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              {t('auth.createAccount') || 'create your account'}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.emailAddress') || 'Email Address'}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder={t('auth.enterYourEmail') || 'Enter your email'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.password') || 'Password'}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder={t('auth.enterYourPassword') || 'Enter your password'}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {errors.general && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-error-warning-line text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } whitespace-nowrap`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  {t('auth.signingIn') || 'Signing in...'}
                </span>
              ) : (
                t('auth.signIn') || 'Sign In'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                {t('auth.forgotPassword') || 'Forgot password?'}
              </Link>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('auth.dontHaveAccount') || 'Don\'t have an account?'}</span>{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                {t('auth.signUp') || 'Sign up'}
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                {t('auth.demoNote') || 'Demo Accounts'}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <p>
                <strong>Admin:</strong> admin@example.com / password
              </p>
              <p>
                <strong>User:</strong> user@example.com / password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
