'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError(t('emailRequired') || 'Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('invalidEmail') || 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send an actual email
      setIsEmailSent(true);
    } catch (error) {
      setError(t('resetEmailError') || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white">
                <span style={{ fontFamily: 'Pacifico, serif' }}>Flame</span>
              </Link>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                <i className="ri-check-line text-2xl text-green-600 dark:text-green-400"></i>
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                {t('resetEmailSent') || 'Reset Email Sent'}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('resetEmailSentMessage') || 'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions.'}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-information-line text-blue-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('checkSpamFolder') || 'Don\'t see the email? Check your spam folder or try resending.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsEmailSent(false);
                setEmail('');
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              {t('sendAnotherEmail') || 'Send Another Email'}
            </button>

            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('backToSignIn') || 'Back to Sign In'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {t('forgotPassword') || 'Forgot Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('forgotPasswordDescription') || 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('emailAddress') || 'Email Address'}
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder={t('enterYourEmail') || 'Enter your email address'}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
          </div>

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
                  {t('sendingEmail') || 'Sending Email...'}
                </span>
              ) : (
                t('sendResetEmail') || 'Send Reset Email'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('backToSignIn') || 'Back to Sign In'}
            </Link>
          </div>
        </form>

        <div className="mt-6">
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <p><strong>{t('demoNote') || 'Demo Note'}:</strong></p>
            <p className="mt-1">
              {t('demoResetNote') || 'In this demo, no actual emails are sent. The reset process is simulated for demonstration purposes.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}