import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { queryClient } from '../../dashboard/layout'
import NewPartyPage from '@/modules/party/NewParty'

const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NewPartyPage />
    </QueryClientProvider>
  )
}

export default page
