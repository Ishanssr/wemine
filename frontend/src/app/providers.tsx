'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth-store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60000, retry: 1, refetchOnWindowFocus: false },
  },
});

function AuthLoader({ children }: { children: React.ReactNode }) {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  useEffect(() => { fetchProfile(); }, [fetchProfile]);
  return <>{children}</>;
}

import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthLoader>
        {!isAdminRoute && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {!isAdminRoute && <Footer />}
      </AuthLoader>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.5)',
          },
          duration: 4000,
        }}
      />
    </QueryClientProvider>
  );
}
