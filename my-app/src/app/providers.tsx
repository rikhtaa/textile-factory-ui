'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname();

   useEffect(() => {
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
     if (user && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [user, router, pathname]);
  

  if (!user && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
