'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      fetchProfile().finally(() => router.push('/'));
    } else {
      router.push('/auth/login');
    }
  }, [searchParams, router, fetchProfile]);

  return (
    <div className="w-8 h-8 border-2 border-glacier-400 border-t-transparent rounded-full animate-spin" />
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <Suspense fallback={<div className="w-8 h-8 border-2 border-glacier-400 border-t-transparent rounded-full animate-spin" />}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
