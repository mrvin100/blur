'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn as nextAuthSignIn, getSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/submit-button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('[SignIn] Starting authentication process...');
      
      // Sign in with NextAuth directly
      const result = await nextAuthSignIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error('[SignIn] NextAuth error:', result.error);
        throw new Error(result.error);
      }

      // Get the session to check user permissions
      const session = await getSession();
      if (!session?.user) {
        throw new Error('Failed to get user session');
      }

      // Redirect to dashboard - the layout will handle showing the correct view
      console.log('[SignIn] Authentication successful, redirecting to dashboard');
      router.push('/dashboard');
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error('[SignIn] Authentication error:', error);
      let errorMessage = 'An error occurred during sign in';
      
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          errorMessage = 'Unable to connect to the authentication service. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative px-4">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton
              isLoading={isLoading}
              buttonText="Sign In"
              className="w-full"
            />
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
