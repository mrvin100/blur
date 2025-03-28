import {
  LayoutDashboard,
  Trophy,
  Users,
  Calendar,
  Gamepad2,
  Settings,
  Bell,
} from 'lucide-react';

export const userNavigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Tournaments',
    href: '/dashboard/tournaments',
    icon: Trophy,
  },
  {
    title: 'Community',
    href: '/dashboard/community',
    icon: Users,
  },
  {
    title: 'Schedule',
    href: '/dashboard/schedule',
    icon: Calendar,
  },
  {
    title: 'Gaming',
    href: '/dashboard/gaming',
    icon: Gamepad2,
  },
  {
    title: 'History',
    href: '/dashboard/history',
    icon: Calendar,
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]; 