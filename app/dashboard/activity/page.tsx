'use client';

import { DefaultRoutePreview } from "@/modules/shared/components";
import { Activity } from "lucide-react";

export default function ActivityPage() {
  return (
    <DefaultRoutePreview
      title="Activity"
      icon={Activity}
      adminMessage={{
        title: "Activity Monitor",
        description: "Monitor system and user activity",
        content: "Track user engagement, tournament participation, and system events in real-time."
      }}
      userMessage={{
        title: "Activity Feed",
        description: "Your recent activity and updates",
        content: "View your recent tournament participation, match results, and achievements."
      }}
    />
  );
} 