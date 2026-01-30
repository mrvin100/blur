"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Car } from "lucide-react"
import { useRace, useCars } from "@/hooks"

interface CarAttributionProps {
  raceId: string
}

export function CarAttributions({ raceId }: CarAttributionProps) {
  const [loadingGlobal, setLoadingGlobal] = useState(false)
  const [loadingIndividual, setLoadingIndividual] = useState(false)
  const { data: race, refetch: refetchRace } = useRace(raceId)
  useCars()

  const hasCar = !!race?.car
  const isAllUsers = race?.attributionType === 'ALL_USERS'
  const hasIndividualAttributions = (race?.attributions?.length || 0) > 0

  // Default to the most relevant tab based on attribution type.
  // - ALL_USERS: global car
  // - PER_USER: individual attributions
  const preferredTab: 'global' | 'individual' =
    race?.attributionType === 'ALL_USERS' ? 'global' : 'individual'

  const [activeTab, setActiveTab] = useState<'global' | 'individual'>(preferredTab)

  useEffect(() => {
    setActiveTab(preferredTab)
  }, [preferredTab])

  // Attributions are assigned automatically by the backend when the race starts.
  // Manual overrides may be implemented later (UI intentionally read-only for now).
  const fetchGlobalCar = async () => {
    setLoadingGlobal(true)
    await refetchRace()
    setLoadingGlobal(false)
  }

  const fetchIndividualCars = async () => {
    setLoadingIndividual(true)
    await refetchRace()
    setLoadingIndividual(false)
  }

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle>Attribution des Voitures</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs className="w-full" onValueChange={(v) => setActiveTab(v as 'global' | 'individual')} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global">Attribution Globale</TabsTrigger>
            <TabsTrigger value="individual">Attribution Individuelle</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="pt-4">
            <div className="flex justify-end mb-4">
              {isAllUsers && !hasCar && (
                <Button variant="outline" size="sm" onClick={fetchGlobalCar} disabled={loadingGlobal}>
                  <Car className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              )}
            </div>

            {loadingGlobal ? (
              <div className="py-16 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                  <p>Chargement...</p>
                </div>
              </div>
            ) : race && isAllUsers && hasCar ? (
              <div className="space-y-4">
                <h3 className="font-medium text-lg text-center">{race.car?.name}</h3>
                <div className="relative h-48 w-full overflow-hidden rounded-md shadow-md">
                  <Image
                    src={race.car?.imageUrl || "/placeholder.svg"}
                    alt={race.car?.name || "Car"}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Cette voiture sera utilisée par tous les participants de la course.
                </p>
              </div>
            ) : (
              !isAllUsers && <div className="py-16 text-center">
                <p className="text-muted-foreground">
                  Attribution globale indisponible en mode PER_USER (voir "Attribution Individuelle").
                </p>
              </div>
            )}

            {isAllUsers && !hasCar && (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-4">Aucune voiture attribuée</p>
                <Button variant="outline" onClick={fetchGlobalCar}>
                  Refresh
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="individual" className="pt-4">
            <div className="flex justify-end mb-4">
              {!hasIndividualAttributions && <Button
                variant="outline"
                size="sm"
                onClick={fetchIndividualCars}
                disabled={loadingIndividual || !race || !race.racers || race.racers.length === 0}
              >
                <Car className="h-4 w-4 mr-1" />
                Refresh
              </Button>}
            </div>

            {loadingIndividual ? (
              <div className="py-16 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                  <p>Chargement...</p>
                </div>
              </div>
            ) : race && hasIndividualAttributions ? (
              <div className="space-y-4">
                {race.attributions?.map((attribution) => (
                  <div key={`${attribution.id}-${attribution.car?.id || 'no-car'}`} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                    <div className="relative h-16 w-24 overflow-hidden rounded-md flex-shrink-0 shadow-sm">
                      <Image src={attribution.car?.imageUrl || "/placeholder.svg"} alt={attribution.car?.name || "Car"} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium">{attribution.user?.userName}</h4>
                      <p className="text-sm text-muted-foreground">{attribution.car?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-4">
                  {race && (!race.racers || race.racers.length === 0)
                    ? "Ajoutez des participants à la course pour pouvoir attribuer des voitures"
                    : "Aucune voiture attribuée aux participants"}
                </p>
                {race && race.racers && race.racers.length > 0 && !hasIndividualAttributions && (
                  <Button variant="outline" onClick={fetchIndividualCars}>
                    Refresh
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

