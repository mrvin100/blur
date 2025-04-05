"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRaceParameters } from "@/hooks/useRaceParameters"
import { useCars } from "@/hooks/useCars"
import { useMaps } from "@/hooks/useMaps"
import { Commet } from "react-loading-indicators"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PartyDashboard() {
  const { getRaceParameters } = useRaceParameters();
  const { getCars } = useCars();
  const { getMaps } = useMaps();
  const maps = getMaps.data;
  const cars = getCars.data;
  const raceParameters = getRaceParameters.data;

  const isLoading = getRaceParameters.isLoading || getCars.isLoading || getMaps.isLoading;
  if (isLoading) {
    return <div className="h-[70vh] flex items-center justify-center">
      <Commet color="var(--primary)" size="large" text="Loading" textColor="" />
    </div>
  }
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blur Racing Dashboard</h1>
          <p className="text-muted-foreground mt-1">Browse cars, maps, and race parameters for your next race</p>
        </div>
        <Link href="/dashboard/party/new">
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Launch a Party
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="cars" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="cars">Cars ({cars && cars.length})</TabsTrigger>
          <TabsTrigger value="maps">Maps ({maps && maps.length})</TabsTrigger>
          <TabsTrigger value="parameters">Race Parameters ({raceParameters && raceParameters.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="cars" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cars && cars.map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={car.imageUrl || "/placeholder.svg?height=120&width=200"}
                    alt={car.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{car.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maps" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {maps && maps.map((map) => (
              <Card key={map.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src={map.imageUrl || "/placeholder.svg"} alt={map.track} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle>{map.location}</CardTitle>
                  <CardDescription>{map.track}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {raceParameters && raceParameters.map((param) => (
              <Card key={param.id}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={param.downloadUrl || "/placeholder.svg?height=60&width=60"}
                      alt={param.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-lg">{param.name}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <Link href="/dashboard/party/new">
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Launch a Party
          </Button>
        </Link>
      </div>
    </div>
  )
}

