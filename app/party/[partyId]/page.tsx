"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddParticipantsModal from "@/modules/party/AddParticipantsModal"
import RaceDetailsModal from "@/modules/party/RaceDetailsModal"
import CarAttributions from "@/modules/party/CarAttributions"
import RacesList from "@/modules/party/RacesList"
import { Party, Race } from "@/types/party.types"
import CurrentRace from "@/modules/party/CurrentRace"
import ScoreForm from "@/modules/party/ScoreForm"
import RaceMap from "@/modules/party/RaceMap"
import { useParams } from "next/navigation"
import { useParty } from "@/hooks/useParty"
import { useRace } from "@/hooks/useRace"
import { useRaceParty } from "@/hooks/useRaceParty"

export default function RaceManagementPage() {
  const [party, setParty] = useState<Party | null>(null)
  const [races, setRaces] = useState<Race[]>([])
  const [currentRace, setCurrentRace] = useState<Race | null>(null)
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] = useState(false)
  const [isRaceDetailsModalOpen, setIsRaceDetailsModalOpen] = useState(false)
  const [partyId, setPartyId] = useState<string>("1")
  const { fetchPartyById } = useParty(partyId)
  const { fetchRaceByPartyId } = useRaceParty(partyId)

  useEffect(() => {
    const params = useParams();
    const { slug } = params;
    if (slug) {
      setPartyId(slug as string)
    }
    fetchPartyData(partyId)
  }, [])

  const fetchPartyData = (id: string) => {
    if (fetchPartyById.data) {
      setParty(fetchPartyById.data)
      fetchRaces(id)
    }
  }

  const fetchRaces = (partyId: string) => {
    const racesData = fetchRaceByPartyId.data
    if (racesData && Array.isArray(racesData)) {
      setRaces(racesData)
      if (racesData.length > 0) {
        const mostRecentRace = racesData[racesData.length - 1]
        setCurrentRace(mostRecentRace)
      }
    }
  }

  const fetchRaceDetails = (raceId: bigint) => {
    const { fetchRaceById } = useRace(raceId)
    const raceData = fetchRaceById.data
    if (raceData.data) {
      return raceData
    }
    return null
  }

  const createNewRace = async () => {
    try {
      const newRaceData = await mockApi.createRace(partyId)

      if (newRaceData.data) {
        // Définir la nouvelle course comme course actuelle immédiatement
        setCurrentRace(newRaceData.data)
        // Puis rafraîchir la liste des courses
        fetchRaces(partyId)
      }
    } catch (error) {
      console.error("Erreur lors de la création d'une nouvelle course:", error)
    }
  }

  const handleRaceSelect = async (raceId: bigint) => {
    const race = await fetchRaceDetails(raceId)
    if (race) {
      setSelectedRace(race)
      setIsRaceDetailsModalOpen(true)
    }
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

  const refreshCurrentRace = async () => {
    if (currentRace) {
      const updatedRace = await fetchRaceDetails(currentRace.id)
      if (updatedRace) {
        setCurrentRace(updatedRace)
      }
    }
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
              <Button onClick={() => createNewRace()} className="w-full sm:w-auto">
                Créer une nouvelle course
              </Button>
            </div>

            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Course Actuelle</TabsTrigger>
                <TabsTrigger value="history">Historique des Courses</TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <Card className="border shadow-md">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <span>Course {currentRace?.id ? `#${currentRace.id}` : ""}</span>
                      <Button onClick={() => setIsAddParticipantsModalOpen(true)}>Ajouter des participants</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {currentRace ? (
                      <div className="space-y-8">
                        <CurrentRace race={currentRace} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CarAttributions race={currentRace} />
                          <RaceMap />
                        </div>

                        <div className="mt-8 bg-muted/30 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold mb-4">Ajouter des scores</h3>
                          <ScoreForm raceId={currentRace.id} onScoreAdded={refreshCurrentRace} />
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
                    <RacesList races={races} onRaceSelect={handleRaceSelect} />
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
              refreshCurrentRace()
            }}
          />
        )}

        {isRaceDetailsModalOpen && selectedRace && (
          <RaceDetailsModal
            isOpen={isRaceDetailsModalOpen}
            onClose={() => setIsRaceDetailsModalOpen(false)}
            race={selectedRace}
          />
        )}
      </div>
    </div>
  )
}

