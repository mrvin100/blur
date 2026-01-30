"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RaceDetailsModal, CarAttributions, RacesList, CurrentRace, ScoreForm, RaceMap } from "@/modules/party"
import { useParams } from "next/navigation"
import { useParty, useRacesByParty, useCreateRace, usePartyActionability } from "@/hooks"
import { Race } from "@/types/party.types"
import { toast } from "sonner"
import { ApiErrorState } from "@/components/ui/error-states"

export function RaceManagement() {
  const [currentRace, setCurrentRace] = useState<Race | null>(null)
  const [selectedRace, setSelectedRace] = useState<string | null>(null)
  const [isRaceDetailsModalOpen, setIsRaceDetailsModalOpen] = useState(false)
  const { partyId } = useParams()
  const numericPartyId = Number(partyId)

  const { data: party, refetch: refetchParty, isError: isPartyError, error: partyError } = useParty(numericPartyId)
  const { data: races, refetch: refetchRaces, isError: isRacesError, error: racesError } = useRacesByParty(numericPartyId)
  const partyActionability = usePartyActionability(numericPartyId)
  const createRace = useCreateRace()

  const actionsDisabled = partyActionability.isLoading || !partyActionability.isActionable
  const actionsDisabledReason = partyActionability.reason
  
  useEffect(() => {
    if (races && races.length > 0) {
      setCurrentRace(getMostRecentRace(races))
    }
  }, [races])

  // New rule: if there is no race yet for today's party, auto-create one.
  useEffect(() => {
    if (!party) return
    if (!races) return
    if (races.length > 0) return
    if (actionsDisabled) return
    if (createRace.isPending) return

    // fire-and-forget; errors are handled by mutation handler
    createRace.mutate({ partyId: numericPartyId, attributionType: 'PER_USER' })
  }, [party, races, actionsDisabled, createRace.isPending, numericPartyId])

  function getMostRecentRace(races: Race[]): Race | null {
    if (races.length === 0) return null;

    const isActive = (r: Race) => r.status === 'PENDING' || r.status === 'IN_PROGRESS';

    const sorted = [...races].sort((a, b) => {
      const aTime = a.createdAt || '';
      const bTime = b.createdAt || '';
      return bTime.localeCompare(aTime);
    });

    // Prefer active race (pending / in progress). Fallback to latest.
    return sorted.find(isActive) ?? sorted[0];
  }



  const createNewRace = async () => {
    if (actionsDisabled) {
      toast.error("Cette partie n'est pas active aujourd'hui. Action impossible.")
      return
    }

    try {
      await createRace.mutateAsync({
        partyId: numericPartyId,
        attributionType: 'PER_USER', // Default, can be changed by user
      })
      await refetchParty()
      await refetchRaces()
    } catch {
      // error toast is handled by handleApiError in the React Query mutation
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

  if (isPartyError || isRacesError) {
    return (
      <div className="flex items-center justify-center py-10">
        <ApiErrorState error={partyError ?? racesError ?? new Error('Failed to load party/races')} />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Gestion des Courses</h1>
      </div>

        {party ? (
          <div className="grid gap-4 sm:gap-6 md:gap-8">
            {actionsDisabled && (
              <div className="rounded-lg border bg-muted/30 p-3 sm:p-4 text-sm text-muted-foreground">
                Cette partie n'est plus active pour aujourd'hui. Les actions sont désactivées.
                {actionsDisabledReason ? ` (Raison: ${actionsDisabledReason})` : ''}
              </div>
            )}
            <div className="flex flex-col gap-3 sm:gap-4 bg-card p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Partie #{party.id}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Date: {formatDate(party.datePlayed)}</p>
                </div>
                <Button
                  onClick={() => createNewRace()}
                  className="w-full sm:w-auto cursor-pointer"
                  size="sm"
                  disabled={actionsDisabled}
                  title={actionsDisabled ? "Cette partie n'est pas active aujourd'hui" : undefined}
                >
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
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    {currentRace ? (
                      <div className="space-y-4 sm:space-y-6 md:space-y-8">
                        <CurrentRace raceId={currentRace.id.toString()} partyId={numericPartyId} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <CarAttributions raceId={currentRace.id.toString()} />
                          <RaceMap raceId={currentRace.id.toString()} />
                        </div>

                        <div className="mt-4 sm:mt-6 md:mt-8 bg-muted/30 p-3 sm:p-4 md:p-6 rounded-lg">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Ajouter des scores</h3>
                          <ScoreForm raceId={currentRace.id.toString()} disabled={actionsDisabled} />
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 sm:py-16 md:py-20 text-center">
                        <p className="text-sm sm:text-base text-muted-foreground mb-4">Aucune course active</p>
                        <Button
                          onClick={() => createNewRace()}
                          size="sm"
                          disabled={actionsDisabled}
                          title={actionsDisabled ? "Cette partie n'est pas active aujourd'hui" : undefined}
                        >
                          Créer une nouvelle course
                        </Button>
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


