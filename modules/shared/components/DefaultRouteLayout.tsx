'use client';

import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function DefaultRouteLoading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[300px]" />
            <div className="pt-4">
              <Skeleton className="h-[125px] w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DefaultRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DefaultRouteLoading />}>
      {children}
    </Suspense>
  );
} 