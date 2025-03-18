'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/modules/auth/context/AuthContext';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          expand={true}
          duration={4000}
        />
      </AuthProvider>
    </SessionProvider>
  );
} 