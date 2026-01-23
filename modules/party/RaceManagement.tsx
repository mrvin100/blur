"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddParticipantsModal, RaceDetailsModal, CarAttributions, RacesList, CurrentRace, ScoreForm, RaceMap } from "@/modules/party"
import { useParams } from "next/navigation"
import { useParty, useRacesByParty, useCreateRace } from "@/hooks"
import { Race } from "@/types/party.types"
import { toast } from "sonner"

export function RaceManagement() {
  const [currentRace, setCurrentRace] = useState<Race | null>(null)
  const [selectedRace, setSelectedRace] = useState<string | null>(null)
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] = useState(false)
  const [isRaceDetailsModalOpen, setIsRaceDetailsModalOpen] = useState(false)
  const { partyId } = useParams()
  const { data: party, refetch: refetchParty } = useParty(Number(partyId))
  const { data: races, refetch: refetchRaces } = useRacesByParty(Number(partyId))
  const createRace = useCreateRace()
  
  useEffect(() => {
    if (races && races.length > 0) {
      setCurrentRace(getMostRecentRace(races))
    }
  }, [races])

  function getMostRecentRace(races: Race[]): Race | null {
    if (races.length === 0) return null;
    const sorted = [...races].sort((a, b) => {
      const aTime = a.createdAt || '';
      const bTime = b.createdAt || '';
      return bTime.localeCompare(aTime);
    });
    return sorted[0];
  }



  const createNewRace = async () => {
    try {
      await createRace.mutateAsync({
        partyId: Number(partyId),
        attributionType: 'PER_USER', // Default, can be changed by user
      })
      await refetchParty()
      await refetchRaces()
    } catch {
      toast.error("Failed to create race")
    }
  }

  const handleRaceSelect = (raceId: string) => {
    setSelectedRace(raceId)
    setIsRaceDetailsModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="w-full">
      <div className="relative mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Gestion des Courses</h1>
      </div>

        {party ? (
          <div className="grid gap-4 sm:gap-6 md:gap-8">
            <div className="flex flex-col gap-3 sm:gap-4 bg-card p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Partie #{party.id}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Date: {formatDate(party.datePlayed)}</p>
                </div>
                <Button onClick={() => createNewRace()} className="w-full sm:w-auto cursor-pointer" size="sm">
                  Créer une nouvelle course
                </Button>
              </div>
            </div>

            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="current" className="cursor-pointer text-xs sm:text-sm py-2 px-2 sm:px-4">
                  <span className="hidden sm:inline">Course Actuelle</span>
                  <span className="sm:hidden">Actuelle</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="cursor-pointer text-xs sm:text-sm py-2 px-2 sm:px-4">
                  <span className="hidden sm:inline">Historique des Courses</span>
                  <span className="sm:hidden">Historique</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <Card className="border shadow-md">
                  <CardHeader className="bg-muted/30 p-3 sm:p-4 md:p-6">
                    <CardTitle className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
                      <span className="text-base sm:text-lg md:text-xl">Course {party?.id ? `#${party.id}` : ""}</span>
                      <Button onClick={() => setIsAddParticipantsModalOpen(true)} className="cursor-pointer w-full sm:w-auto" size="sm">
                        Ajouter des participants
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    {currentRace ? (
                      <div className="space-y-4 sm:space-y-6 md:space-y-8">
                        <CurrentRace raceId={currentRace.id.toString()} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <CarAttributions raceId={currentRace.id.toString()} />
                          <RaceMap raceId={currentRace.id.toString()} />
                        </div>

                        <div className="mt-4 sm:mt-6 md:mt-8 bg-muted/30 p-3 sm:p-4 md:p-6 rounded-lg">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Ajouter des scores</h3>
                          <ScoreForm raceId={currentRace.id.toString()} />
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 sm:py-16 md:py-20 text-center">
                        <p className="text-sm sm:text-base text-muted-foreground mb-4">Aucune course active</p>
                        <Button onClick={() => createNewRace()} size="sm">Créer une nouvelle course</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="border shadow-md">
                  <CardHeader className="bg-muted/30 p-3 sm:p-4 md:p-6">
                    <CardTitle className="text-base sm:text-lg md:text-xl">Historique des Courses</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <RacesList races={races || []} onRaceSelect={handleRaceSelect} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card className="border shadow-md">
            <CardContent className="py-10 sm:py-16 md:py-20">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                <p className="text-sm sm:text-base">Chargement des données de la partie...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {isAddParticipantsModalOpen && currentRace && (
          <AddParticipantsModal
            isOpen={isAddParticipantsModalOpen}
            onClose={() => setIsAddParticipantsModalOpen(false)}
            raceId={currentRace.id.toString()}
            onParticipantsAdded={() => {
              setIsAddParticipantsModalOpen(false)
            }}
            refresh={() => refetchRaces()}
          />
        )}

      {isRaceDetailsModalOpen && selectedRace && (
        <RaceDetailsModal
          isOpen={isRaceDetailsModalOpen}
          onClose={() => setIsRaceDetailsModalOpen(false)}
          raceId={selectedRace}
        />
      )}
    </div>
  )
}


