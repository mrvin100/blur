"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Dices, MapPin } from "lucide-react"
import { Map } from "@/types/map.types"
import { useMaps } from "@/hooks/useMaps"
import { Button } from "@/components/ui/button"

export default function RaceMap() {
  const [map, setMap] = useState<Map | null>(null)
  const [loading, setLoading] = useState(true)
  const { getIndividualMap } = useMaps()
  useEffect(() => {
    fetchRandomMap()
  }, [])

  const fetchRandomMap = async () => {
    try {
      setLoading(true)
      await getIndividualMap.refetch()
      if (getIndividualMap.data) {
        setMap(getIndividualMap.data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la carte:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="flex justify-between items-center text-lg">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Circuit
          </div>
          <Button variant="outline" size="sm" onClick={fetchRandomMap} disabled={loading}>
            <Dices className="h-4 w-4 mr-1" />
            Tirer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="py-16 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <p>Tirage en cours...</p>
            </div>
          </div>
        ) : map ? (
          <div className="space-y-4">
            <div className="relative h-48 w-full overflow-hidden rounded-md shadow-md">
              <Image src={map.imageUrl || "/placeholder.svg"} alt={map.track} fill className="object-cover" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{map.track}</h3>
              <p className="text-muted-foreground">{map.location}</p>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Aucun circuit sélectionné</p>
            <Button variant="outline" onClick={fetchRandomMap}>
              <Dices className="h-4 w-4 mr-2" />
              Tirer un circuit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

