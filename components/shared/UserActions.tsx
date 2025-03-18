'use client';

import { useAuth } from "@/modules/auth/context/AuthContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Settings, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";

interface UserActionsProps {
  variant?: 'default' | 'minimal';
  align?: 'start' | 'end';
}

export function UserActions({ variant = 'default', align = 'end' }: UserActionsProps) {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: Settings,
    },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-2 hover:bg-accent"
          aria-label="User menu"
        >
          <UserCircle className="h-5 w-5" />
          {variant === 'default' && (
            <span className="text-sm font-medium">{user.username}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => logout()}
          className="text-destructive focus:text-destructive flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 