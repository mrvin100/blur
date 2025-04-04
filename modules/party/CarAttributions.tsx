"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Dices } from "lucide-react"
import { Race, Racer } from "@/types/party.types"
import { useCars } from "@/hooks/useCars"
import { Car, CarAttribution } from "@/types/car.types"
import { useRace } from "@/hooks/useRace"

interface CarAttributionProps {
  race: Race
}

export default function CarAttributions({ race }: CarAttributionProps) {
  const [globalCar, setGlobalCar] = useState<Car | null>(null)
  const [individualCars, setIndividualCars] = useState<CarAttribution[]>([])
  const [loadingGlobal, setLoadingGlobal] = useState(false)
  const [loadingIndividual, setLoadingIndividual] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("global")
  const { fetchRaceById } = useRace(race.id)
  const { getIndividualCar, getGlobalCar } = useCars(fetchRaceById?.data?.racers.map((racer: Racer) => racer.userName) || [])

  const fetchGlobalCar = async () => {
    try {
      setLoadingGlobal(true)
      await getGlobalCar.refetch()
      if (getGlobalCar.data) {
        setGlobalCar(getGlobalCar.data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la voiture globale:", error)
    } finally {
      setLoadingGlobal(false)
    }
  }

  const fetchIndividualCars = async () => {
    try {
      setLoadingIndividual(true)
      await getIndividualCar.refetch()
      console.log("Individual Attribution", getIndividualCar.data)
      if (getIndividualCar.data) {
        setIndividualCars(getIndividualCar.data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des voitures individuelles:", error)
    } finally {
      setLoadingIndividual(false)
    }
  }

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle>Attribution des Voitures</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="global" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global">Attribution Globale</TabsTrigger>
            <TabsTrigger value="individual">Attribution Individuelle</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="pt-4">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={fetchGlobalCar} disabled={loadingGlobal}>
                <Dices className="h-4 w-4 mr-1" />
                Attribuer une voiture
              </Button>
            </div>

            {loadingGlobal ? (
              <div className="py-16 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                  <p>Chargement...</p>
                </div>
              </div>
            ) : globalCar ? (
              <div className="space-y-4">
                <h3 className="font-medium text-lg text-center">{globalCar.name}</h3>
                <div className="relative h-48 w-full overflow-hidden rounded-md shadow-md">
                  <Image
                    src={globalCar.imageUrl || "/placeholder.svg"}
                    alt={globalCar.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Cette voiture sera utilisée par tous les participants de la course.
                </p>
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-4">Aucune voiture attribuée</p>
                <Button variant="outline" onClick={fetchGlobalCar}>
                  <Dices className="h-4 w-4 mr-2" />
                  Attribuer une voiture
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="individual" className="pt-4">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchIndividualCars}
                disabled={loadingIndividual || !fetchRaceById.data || fetchRaceById.data.racers.length === 0}
              >
                <Dices className="h-4 w-4 mr-1" />
                Attribuer des voitures
              </Button>
            </div>

            {loadingIndividual ? (
              <div className="py-16 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                  <p>Chargement...</p>
                </div>
              </div>
            ) : individualCars.length > 0 ? (
              <div className="space-y-4">
                {individualCars.map((car) => (
                  <div key={`${car.id} ${car.imageUrl}`} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                    <div className="relative h-16 w-24 overflow-hidden rounded-md flex-shrink-0 shadow-sm">
                      <Image src={car.imageUrl || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium">{car.userName}</h4>
                      <p className="text-sm text-muted-foreground">{car.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-4">
                  {race.racers.length === 0
                    ? "Ajoutez des participants à la course pour pouvoir attribuer des voitures"
                    : "Aucune voiture attribuée aux participants"}
                </p>
                {fetchRaceById.data && fetchRaceById.data.racers.length > 0 && (
                  <Button variant="outline" onClick={fetchIndividualCars}>
                    <Dices className="h-4 w-4 mr-2" />
                    Attribuer des voitures
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

