'use client';

import { DefaultRoutePreview } from "@/modules/shared/components";
import { Shield } from "lucide-react";

export default function SecurityPage() {
  return (
    <DefaultRoutePreview
      title="Security"
      icon={Shield}
      adminMessage={{
        title: "Security Management",
        description: "Manage system security and permissions",
        content: "Configure user permissions, roles, and access controls for the platform."
      }}
      userMessage={{
        title: "Security Settings",
        description: "Manage your account security",
        content: "Update your security preferences, two-factor authentication, and account access settings."
      }}
    />
  );
} 