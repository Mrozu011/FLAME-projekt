'use client';

import { useState } from 'react';

interface LoginOptionsProps {
  onComplete: (data: { userType: 'login' | 'register' | 'guest' }) => void;
}

export default function LoginOptions({ onComplete }: LoginOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<'login' | 'register' | 'guest' | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleOptionSelect = (option: 'login' | 'register' | 'guest') => {
    setSelectedOption(option);
    if (option === 'login') {
      setShowLoginForm(true);
    } else if (option === 'register') {
      setShowRegisterForm(true);
    } else {
      onComplete({ userType: option });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      onComplete({ userType: selectedOption });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Checkout Method</h2>
        <p className="text-gray-600">Select how you'd like to proceed with your order</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleOptionSelect('login')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            selectedOption === 'login' 
              ? 'border-black bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <i className="ri-user-line text-2xl text-blue-600"></i>
            <h3 className="text-lg font-semibold text-gray-900">Login</h3>
          </div>
          <p className="text-sm text-gray-600">
            Sign in to your existing account for faster checkout and order tracking
          </p>
          <div className="mt-4 text-sm text-blue-600">
            • Saved addresses
            • Order history
            • Wishlist sync
          </div>
        </button>

        <button
          onClick={() => handleOptionSelect('register')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            selectedOption === 'register' 
              ? 'border-black bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <i className="ri-user-add-line text-2xl text-green-600"></i>
            <h3 className="text-lg font-semibold text-gray-900">Register</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create a new account to save your preferences and track orders
          </p>
          <div className="mt-4 text-sm text-green-600">
            • Exclusive offers
            • Faster future checkouts
            • Personalized recommendations
          </div>
        </button>

        <button
          onClick={() => handleOptionSelect('guest')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            selectedOption === 'guest' 
              ? 'border-black bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <i className="ri-user-line text-2xl text-purple-600"></i>
            <h3 className="text-lg font-semibold text-gray-900">Guest Checkout</h3>
          </div>
          <p className="text-sm text-gray-600">
            Continue without creating an account for quick one-time purchase
          </p>
          <div className="mt-4 text-sm text-purple-600">
            • No account needed
            • Quick checkout
            • Email order confirmation
          </div>
        </button>
      </div>

      {showLoginForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sign In</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setShowLoginForm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showRegisterForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Account</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Confirm your password"
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" required className="mr-2" />
              <span className="text-sm text-gray-600">
                I agree to the <button type="button" className="text-blue-600 hover:text-blue-800">Terms of Service</button> and <button type="button" className="text-blue-600 hover:text-blue-800">Privacy Policy</button>
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}