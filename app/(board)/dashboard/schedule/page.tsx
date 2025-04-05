'use client';

import { DefaultRoutePreview } from "@/modules/shared/components";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  return (
    <DefaultRoutePreview
      title="Schedule"
      icon={Calendar}
      adminMessage={{
        title: "Schedule Management",
        description: "Manage tournament schedules and events",
        content: "The schedule management interface will allow you to create and manage tournament schedules, set event times, and coordinate activities."
      }}
      userMessage={{
        title: "My Schedule",
        description: "View your upcoming tournaments and events",
        content: "Here you'll be able to see your upcoming tournament schedule, match times, and event details."
      }}
    />
  );
} 