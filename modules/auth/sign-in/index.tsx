'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/submit-button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { signIn as apiSignIn } from '@/lib/auth';

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
      // First, authenticate with the API
      const response = await apiSignIn(username, password);
      const user = response.data;

      // Then, sign in with NextAuth
      const result = await nextAuthSignIn('credentials', {
        username,
        password,
        permissions: JSON.stringify(user.permissions),
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Determine user role and redirect accordingly
      const isAdmin = user.permissions.some(p => p.name === 'canCreateUsers');
      const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';
      
      router.push(redirectPath);
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid credentials');
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
