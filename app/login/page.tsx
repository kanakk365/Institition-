'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import LoaderOverlay from '@/components/ui/Loader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <>
      {loading && <LoaderOverlay />}
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: 'url(/BackUI.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo and heading */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Image 
              src="/file.svg" 
              alt="Cambridge Assessment International Education" 
              width={60} 
              height={60} 
              className="mx-auto mb-2"
            />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign in to your Account</h2>
          <p className="text-gray-600 text-sm">Enter your email and password to get started</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Login form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input 
              type="email" 
              placeholder="E mail Id" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all duration-200"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all duration-200"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed button-primary bg-gradient-to-r from-[#FFB31F] to-[#FF4949] "
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
