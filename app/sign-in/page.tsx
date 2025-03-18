import { Metadata } from 'next';
import { SignInForm } from '@/modules/auth/sign-in';

export const metadata: Metadata = {
  title: 'Sign In | Blur App',
  description: 'Sign in to your Blur App account',
};

export default function SignInPage() {
  return <SignInForm />;
} 