"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Car, RefreshCw } from "lucide-react"
import { useRace, useAssignCars } from "@/hooks"

interface CarAttributionProps {
  raceId: string
  canAssign?: boolean
}

export function CarAttributions({ raceId, canAssign = true }: CarAttributionProps) {
  const { data: race } = useRace(raceId)
  const assignCars = useAssignCars()

  // Filter attributions to only show those with users (individual attributions)
  const individualAttributions = race?.attributions?.filter(attr => attr.user !== null) || []
  const hasIndividualAttributions = individualAttributions.length > 0
  const isPending = race?.status === 'PENDING'
  const hasRacers = race?.racers && race.racers.length > 0
  
  // Can only assign cars if race is pending and has participants
  const canAssignCars = canAssign && isPending && hasRacers

  const handleAssignCars = () => {
    if (!canAssignCars) return
    assignCars.mutate(raceId)
  }

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex justify-between items-center">
          <span>Attribution des Voitures</span>
          {canAssignCars && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAssignCars}
              disabled={assignCars.isPending}
              className="gap-2"
              title="Attribuer une voiture aléatoire à chaque participant"
            >
              <RefreshCw className={`h-4 w-4 ${assignCars.isPending ? 'animate-spin' : ''}`} />
              {hasIndividualAttributions ? "Réattribuer" : "Attribuer"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {assignCars.isPending ? (
          <div className="py-16 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <p>Attribution en cours...</p>
            </div>
          </div>
        ) : hasIndividualAttributions ? (
          <div className="space-y-4">
            {individualAttributions.map((attribution) => (
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
            <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {!hasRacers
                ? "Ajoutez des participants à la course pour attribuer des voitures"
                : "Aucune voiture attribuée aux participants"}
            </p>
            {canAssignCars && (
              <Button 
                variant="outline" 
                onClick={handleAssignCars}
                disabled={assignCars.isPending}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Attribuer les voitures
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

