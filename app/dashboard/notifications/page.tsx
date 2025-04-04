'use client';

import { DefaultRoutePreview } from "@/modules/shared/components";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <DefaultRoutePreview
      title="Notifications"
      icon={Bell}
      userMessage={{
        title: "Notifications Center",
        description: "Stay updated with your activities",
        content: "View your notifications about tournaments, matches, friend requests, and system updates."
      }}
    />
  );
} 