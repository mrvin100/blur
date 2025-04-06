import {
  LayoutDashboard,
  Settings,
  Shield,
  Calendar,
  Car,
  Users,
} from "lucide-react";

export const adminNavigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Party",
    href: "/dashboard/party/new",
    icon: Car,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: Calendar,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Permissions",
    href: "/dashboard/permissions",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
