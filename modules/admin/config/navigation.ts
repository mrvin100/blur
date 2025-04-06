import {
  LayoutDashboard,
  Settings,
  Shield,
  Calendar,
  Activity,
  Trophy,
  Car,
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
  {
    title: 'History',
    href: '/dashboard/history',
    icon: Calendar,
  },
  {
    title: 'Party',
    href: '/dashboard/party/new',
    icon: Car
  }
]; 