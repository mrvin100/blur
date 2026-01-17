import {
  LayoutDashboard,
  Calendar,
  Settings,
  Car,
} from 'lucide-react';

export const userNavigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Party',
    href: '/dashboard/party/new',
    icon: Car,
  },
  {
    title: 'History',
    href: '/dashboard/history',
    icon: Calendar,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];
