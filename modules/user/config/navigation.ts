import {
  LayoutDashboard,
  Calendar,
  Settings, Car
} from 'lucide-react';

export const userNavigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'History',
    href: '/dashboard/history',
    icon: Calendar,
  },
  {
    title: 'Party',
    href: '/dashboard/party',
    icon: Car
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];
