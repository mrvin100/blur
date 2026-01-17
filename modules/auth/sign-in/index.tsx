'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn as nextAuthSignIn, getSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/submit-button';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const result = await nextAuthSignIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      const session = await getSession();
      if (!session?.user) {
        throw new Error('Failed to get user session');
      }

      router.push('/dashboard');
      toast.success('Successfully signed in!');
    } catch (error) {
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
    <section className="min-h-screen flex flex-col items-center justify-center bg-background relative px-4 py-8">
      <Link 
        href="/" 
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <Card className="w-full max-w-[400px] mx-4">
        <CardHeader className="text-center pb-2">
          <h2 className="text-xl sm:text-2xl font-bold">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                required
                disabled={isLoading}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-2">
            <SubmitButton
              isLoading={isLoading}
              buttonText="Sign In"
              className="w-full h-10 sm:h-11"
            />
            <p className="text-xs text-muted-foreground text-center">
              Demo: admin / admin123
            </p>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
