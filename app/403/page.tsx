'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccessDeniedPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <i className="ri-shield-cross-line text-8xl text-red-500 mb-4"></i>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            403 - Access Denied
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          
          <div className="space-y-4">
            <p className="text-gray-500">
              This area is restricted to authorized administrators only.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/" 
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Go to Homepage
              </Link>
              
              <Link 
                href="/login" 
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
              >
                Login
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-400">
            You will be redirected to the homepage in 5 seconds...
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}