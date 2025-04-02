"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/app/dashboard/layout"
import RaceManagement from "@/modules/party/RaceManagement"

export default function RaceManagementPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <RaceManagement />
    </QueryClientProvider>
  )
}

