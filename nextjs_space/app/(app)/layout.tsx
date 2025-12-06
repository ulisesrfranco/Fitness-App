'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const showBottomNav = ['/home', '/coach', '/trends', '/settings']?.some(
    (path) => pathname?.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
