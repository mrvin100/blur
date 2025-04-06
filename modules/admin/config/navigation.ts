import {
  LayoutDashboard,
  Settings,
  Shield,
  Calendar,
  Activity,
  Trophy,
  Car,
  Users,
} from 'lucide-react';

export const adminNavigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tournaments',
    href: '/dashboard/tournaments',
    icon: Trophy,
  },
  {
    title: 'Permissions',
    href: '/dashboard/permissions',
    icon: Shield,
  },
  {
    title: 'Activity',
    href: '/dashboard/activity',
    icon: Activity,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'History',
    href: '/dashboard/history',
    icon: Calendar,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Party',
    href: '/dashboard/party/new',
    icon: Car
  }
]; 