"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Race, Racer } from "@/types/party.types"
import { useUsers } from "@/hooks/useUsers"
import { useRace } from "@/hooks/useRace"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { useScore } from "@/hooks/useScore"
import { AddScoreRequestData } from "@/types/score.types"

interface AddParticipantsModalProps {
  isOpen: boolean
  onClose: () => void
  raceId: string
  onParticipantsAdded: () => void
  refresh: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Race, Error>>
}

export function AddParticipantsModal({
  isOpen,
  onClose,
  raceId,
  refresh
}: AddParticipantsModalProps) {
  const [racers, setRacers] = useState<Racer[]>([])
  const [selectedRacers, setSelectedRacers] = useState<Racer[]>([])
  const { getUsers } = useUsers()
  const { updateRace,fetchRaceById } = useRace(raceId)
  const { addScore,fetchScoreByRaceId } = useScore(raceId)

  const users = getUsers.data;
  useEffect(() => {
    setRacers([])
    if (users) {
      users.forEach((user) => {
        const racer: Racer = {
          id: user.id.toString(),
          userName: user.userName
        }
        if (racers.find(racer => racer.id === user.id.toString())) return
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
    await updateRace.mutateAsync({ selectedRacers, raceId }).then(() => {
      onClose()
      setRacers([])
      refresh()
    }).catch(e => console.error(e))
    for (let i = 0; i < selectedRacers.length; i++) {
      const newScore: AddScoreRequestData = {
        value: 0,
        raceId: raceId,
        userId: selectedRacers[i].id
      }
      await addScore.mutateAsync(newScore)
      await fetchScoreByRaceId.refetch()
      await fetchRaceById.refetch()
    }
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

