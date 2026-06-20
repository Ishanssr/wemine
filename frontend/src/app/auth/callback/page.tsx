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
      fetchProfile().then(() => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.email) {
            localStorage.setItem('googleUser', JSON.stringify({
              email: payload.email,
              name: payload.name || payload.email?.split('@')[0] || 'User',
              picture: payload.picture || '',
            }));
          }
        } catch {}
        router.push('/');
      });
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
