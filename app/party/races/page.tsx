import PartyDashboard from '@/modules/party/PartyDashboard'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { queryClient } from '../../dashboard/layout'

const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PartyDashboard />
    </QueryClientProvider>
  )
}

export default page
