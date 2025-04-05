'use client';

import { DefaultRoutePreview } from "@/modules/shared/components/";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <DefaultRoutePreview
      title="Settings"
      icon={Settings}
      adminMessage={{
        title: "System Settings",
        description: "Configure system-wide settings",
        content: "Manage platform configuration, notification preferences, and system defaults."
      }}
      userMessage={{
        title: "User Settings",
        description: "Customize your experience",
        content: "Personalize your profile, notification preferences, and application settings."
      }}
    />
  );
} 