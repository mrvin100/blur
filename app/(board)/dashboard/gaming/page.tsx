'use client';

import { DefaultRoutePreview } from "@/modules/shared/components";
import { Gamepad2 } from "lucide-react";

export default function GamingPage() {
  return (
    <DefaultRoutePreview
      title="Gaming"
      icon={Gamepad2}
      userMessage={{
        title: "Gaming Hub",
        description: "Your gaming center",
        content: "Access your games, view statistics, and manage your gaming preferences. Connect with other players and join gaming sessions."
      }}
    />
  );
} 