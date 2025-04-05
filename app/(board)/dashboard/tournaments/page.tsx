'use client';

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function TournamentsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.permissions?.some((p) => p.name === "canCreateUsers");

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isAdmin ? "Tournaments Management" : "My Tournaments"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>No Tournaments Available</CardTitle>
              <CardDescription>
                {isAdmin 
                  ? "Start by creating your first tournament."
                  : "There are no tournaments available at the moment."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isAdmin
              ? "As an admin, you can create and manage tournaments here. The tournament management interface will be implemented soon."
              : "Check back later for upcoming tournaments you can join. The tournament system will be implemented soon."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 