'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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

    const promise = signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    toast.promise(promise, {
      loading: 'Signing in...',
      success: (result) => {
        if (result?.error) {
          throw new Error(result.error);
        }
        router.push('/dashboard');
        return 'Successfully signed in!';
      },
      error: (err) => {
        setIsLoading(false);
        return err?.message || 'Invalid credentials';
      },
    });
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
              <Label htmlFor="username">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                disabled={isLoading}
                placeholder="Enter your username"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                placeholder="Enter your password"
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton 
              isLoading={isLoading} 
              buttonText="Sign In" 
              className="w-full"
            />
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">Terms</Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
