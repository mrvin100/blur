'use client';

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideProps } from "lucide-react";
import { ElementType } from "react";

interface DefaultRoutePreviewProps {
  title: string;
  icon: ElementType<LucideProps>;
  adminMessage?: {
    title: string;
    description: string;
    content: string;
  };
  userMessage?: {
    title: string;
    description: string;
    content: string;
  };
}

export function DefaultRoutePreview({
  title,
  icon: Icon,
  adminMessage = {
    title: "Coming Soon",
    description: "This section is under development",
    content: "The management interface for this feature will be implemented soon."
  },
  userMessage = {
    title: "Coming Soon",
    description: "This section is under development",
    content: "This feature will be available soon. Check back later."
  }
}: DefaultRoutePreviewProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.permissions?.some((p) => p.name === "canCreateUsers");
  
  const message = isAdmin ? adminMessage : userMessage;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>{message.title}</CardTitle>
              <CardDescription>{message.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message.content}</p>
        </CardContent>
      </Card>
    </div>
  );
} 