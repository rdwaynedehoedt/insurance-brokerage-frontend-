'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
            <Building2 size={32} className="text-orange-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Insurance Brokerage</h1>
        </div>
        
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
            Sign in
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Access your dashboard
          </p>
        </div>

        {mounted && <LoginForm />}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
} 