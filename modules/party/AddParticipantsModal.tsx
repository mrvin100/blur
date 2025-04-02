"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Racer } from "@/types/party.types"
import { useUsers } from "@/hooks/useUsers"
import { useRace } from "@/hooks/useRace"

interface AddParticipantsModalProps {
  isOpen: boolean
  onClose: () => void
  raceId: bigint
  onParticipantsAdded: () => void
}

export default function AddParticipantsModal({
  isOpen,
  onClose,
  raceId,
  onParticipantsAdded,
}: AddParticipantsModalProps) {
  const [racers, setRacers] = useState<Racer[]>([])
  const [selectedRacers, setSelectedRacers] = useState<Racer[]>([])
  const { getUsers } = useUsers()
  const { updateRace } = useRace(selectedRacers, raceId)
  const users = getUsers.data;
  useEffect(() => {
    if (users) {
      users.forEach((user) => {
        const racer: Racer = {
          id: user.id,
          userName: user.userName
        }
        setRacers(prev => [...prev, racer])
      })
    }
  }, [getUsers.isLoading])
  const toggleRacerSelection = (racer: Racer) => {
    if (selectedRacers.some((r) => r.id === racer.id)) {
      setSelectedRacers(selectedRacers.filter((r) => r.id !== racer.id))
    } else {
      setSelectedRacers([...selectedRacers, racer])
    }
  }

  const handleAddParticipants = async () => {
    if (selectedRacers.length === 0) return
    return updateRace.mutateAsync().catch(e => console.error(e))
  }


  const isLoading = getUsers.isLoading

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
                  key={racer.id.toString()}
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

