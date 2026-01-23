"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Race, Racer } from "@/types/party.types"
import type { User } from "@/types/user.types"
import { useUsers, useAddParticipant, useSubmitScore } from "@/hooks"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { toast } from "sonner"

interface AddParticipantsModalProps {
  isOpen: boolean
  onClose: () => void
  raceId: string
  onParticipantsAdded: () => void
  refresh: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<unknown, Error>>
}

export function AddParticipantsModal({
  isOpen,
  onClose,
  raceId,
  refresh
}: AddParticipantsModalProps) {
  const [selectedRacers, setSelectedRacers] = useState<Racer[]>([])
  const { data: users, isLoading } = useUsers()
  const addParticipant = useAddParticipant()
  const submitScore = useSubmitScore()

  const racers: Racer[] = (users as User[] | undefined)?.map((user) => ({
    id: user.id,
    userName: user.userName,
    email: user.email
  })) || []
  const toggleRacerSelection = (racer: Racer) => {
    if (selectedRacers.some((r) => r.id === racer.id)) {
      setSelectedRacers(selectedRacers.filter((r) => r.id !== racer.id))
    } else {
      setSelectedRacers([...selectedRacers, racer])
    }
  }

  const handleAddParticipants = async () => {
    if (selectedRacers.length === 0) return
    
    try {
      // Add each selected racer as a participant to the race
      for (const racer of selectedRacers) {
        await addParticipant.mutateAsync({
          raceId: raceId,
          userId: racer.id
        })
        
        // Create initial score for new participant
        await submitScore.mutateAsync({
          value: 0,
          raceId: Number(raceId),
          userId: Number(racer.id)
        })
      }

      await refresh()
      setSelectedRacers([])
      onClose()
    } catch {
      toast.error("Error adding participants")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter des participants</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <p>Chargement des utilisateurs...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {racers.map((racer) => (
                <div
                  key={racer.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`racer-${racer.id}`}
                    checked={selectedRacers.some((r) => r.id === racer.id)}
                    onCheckedChange={() => toggleRacerSelection(racer)}
                  />
                  <label
                    htmlFor={`racer-${racer.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {racer.userName}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleAddParticipants} disabled={selectedRacers.length === 0}>
            Ajouter {selectedRacers.length} participant{selectedRacers.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

