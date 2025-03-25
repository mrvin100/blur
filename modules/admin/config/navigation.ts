import {
  LayoutDashboard,
  Users,
  Settings,
  Trophy,
  Calendar,
  Activity,
  Shield,
} from 'lucide-react';

export const adminNavigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Tournaments',
    href: '/dashboard/tournaments',
    icon: Trophy,
  },
  {
    title: 'Schedule',
    href: '/dashboard/schedule',
    icon: Calendar,
  },
  {
    title: 'Activity',
    href: '/dashboard/activity',
    icon: Activity,
  },
  {
    title: 'Security',
    href: '/dashboard/security',
    icon: Shield,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]; 