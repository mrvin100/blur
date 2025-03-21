'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export function UserActions() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleDashboardClick = () => {
    router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="font-medium">
          {user?.userName}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDashboardClick}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 