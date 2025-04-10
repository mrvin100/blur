"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddParticipantsModal, RaceDetailsModal, CarAttributions, RacesList, CurrentRace, ScoreForm, RaceMap } from "@/modules/party"
import { useParams } from "next/navigation"
import { useParty } from "@/hooks/useParty"
import { Race } from "@/types/party.types"
import { useRace } from "@/hooks/useRace"
import { useRaceParty } from "@/hooks/useRaceParty"
import { toast } from "sonner"

export function RaceManagement() {
  const [currentRace, setCurrentRace] = useState<Race | null>(null)
  const [selectedRace, setSelectedRace] = useState<string | null>(null)
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] = useState(false)
  const [isRaceDetailsModalOpen, setIsRaceDetailsModalOpen] = useState(false)
  const { partyId } = useParams()
  const { fetchPartyById } = useParty(partyId as string)
  const { fetchRaceByPartyId, createRace } = useRaceParty(partyId as string)
  const { fetchRaceById } = useRace(currentRace?.id || "1")
  const party = fetchPartyById.data
  const races = fetchRaceByPartyId.data
  useEffect(() => {
    setCurrentRace(getMostRecentRace(fetchRaceByPartyId.data || []))
  }, [fetchRaceByPartyId.isLoading, fetchRaceById.data])

  console.log("Party", party)
  console.log("Party Id", partyId)
  console.log("Current Race", currentRace)

  function getMostRecentRace(races: Race[]): Race | null {
    if (races.length === 0) return null;
    const sorted = [...races].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    return sorted[0];
  }



  const createNewRace = async () => {
    try {
      await createRace.mutateAsync().then(res => {
        setCurrentRace(res)
        toast.success("Succès", {
          description: "La course a été créée avec succès"
        })
      }).catch(error => console.error(error))
    } catch (error) {
      return console.error(error)
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-lg -z-10 blur-xl opacity-50" />
          <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">Gestion des Courses</h1>
        </div>

        {party ? (
          <div className="grid gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-lg shadow-sm border">
              <div>
                <h2 className="text-2xl font-semibold">Partie #{party.id}</h2>
                <p className="text-muted-foreground">Date: {formatDate(party.datePlayed)}</p>
              </div>
              <Button onClick={() => createNewRace()} className="w-full sm:w-auto cursor-pointer">
                Créer une nouvelle course
              </Button>
            </div>

            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current" className="cursor-pointer">Course Actuelle</TabsTrigger>
                <TabsTrigger value="history" className="cursor-pointer">Historique des Courses</TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <Card className="border shadow-md">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <span>Course {currentRace?.id ? `#${currentRace.id}` : ""}</span>
                      <Button onClick={() => setIsAddParticipantsModalOpen(true)} className="cursor-pointer">Ajouter des participants</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {currentRace ? (
                      <div className="space-y-8">
                        <CurrentRace race={currentRace} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CarAttributions race={currentRace} />
                          <RaceMap raceId={currentRace.id} />
                        </div>

                        <div className="mt-8 bg-muted/30 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold mb-4">Ajouter des scores</h3>
                          <ScoreForm raceId={currentRace.id} />
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-muted-foreground mb-4">Aucune course active</p>
                        <Button onClick={() => createNewRace()}>Créer une nouvelle course</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="border shadow-md">
                  <CardHeader className="bg-muted/30">
                    <CardTitle>Historique des Courses</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RacesList races={races || []} onRaceSelect={handleRaceSelect} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card className="border shadow-md">
            <CardContent className="py-20">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <p>Chargement des données de la partie...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {isAddParticipantsModalOpen && currentRace && (
          <AddParticipantsModal
            isOpen={isAddParticipantsModalOpen}
            onClose={() => setIsAddParticipantsModalOpen(false)}
            raceId={currentRace.id}
            onParticipantsAdded={() => {
              setIsAddParticipantsModalOpen(false)
            }}
            refresh={fetchRaceById.refetch}
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
    </div>
  )
}


