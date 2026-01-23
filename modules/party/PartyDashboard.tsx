"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRaceParameters, useCars, useMaps } from "@/hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiErrorState } from "@/components/ui/error-states"

export function PartyDashboard() {
  const { data: raceParameters, isLoading: isLoadingParams, isError: isParamsError, error: paramsError } = useRaceParameters();
  const { data: cars, isLoading: isLoadingCars, isError: isCarsError, error: carsError } = useCars();
  const { data: maps, isLoading: isLoadingMaps, isError: isMapsError, error: mapsError } = useMaps();

  const isLoading = isLoadingParams || isLoadingCars || isLoadingMaps;
  const isError = isParamsError || isCarsError || isMapsError;
  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <ApiErrorState error={paramsError ?? carsError ?? mapsError ?? new Error('Failed to load dashboard data')} />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Blur Racing Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Browse cars, maps, and race parameters for your next race</p>
        </div>
        <Link href="/dashboard/party/new" className="w-full sm:w-auto self-start">
          <Button size="default" className="gap-2 w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Launch a Party
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="cars" className="w-full">
        <TabsList className="w-full h-auto flex flex-wrap sm:grid sm:grid-cols-3 mb-6 sm:mb-8 gap-1 sm:gap-0">
          <TabsTrigger value="cars" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-2">
            Cars ({cars && cars.length})
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-2">
            Maps ({maps && maps.length})
          </TabsTrigger>
          <TabsTrigger value="parameters" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-2">
            <span className="hidden sm:inline">Race Parameters</span>
            <span className="sm:hidden">Params</span>
            <span className="ml-1">({raceParameters && raceParameters.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cars" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
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
                <CardHeader className="p-2 sm:p-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg truncate">{car.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maps" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {maps && maps.map((map) => (
              <Card key={map.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src={map.imageUrl || "/placeholder.svg"} alt={map.track} fill className="object-cover" />
                </div>
                <CardHeader className="p-2 sm:p-4">
                  <CardTitle className="text-sm sm:text-base">{map.location}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm truncate">{map.track}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {raceParameters && raceParameters.map((param) => (
              <Card key={param.id}>
                <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-3 sm:gap-4">
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <Image
                      src={param.downloadUrl || "/placeholder.svg?height=60&width=60"}
                      alt={param.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-sm sm:text-base md:text-lg truncate">{param.name}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 sm:mt-12 text-center">
        <Link href="/dashboard/party/new">
          <Button size="default" className="gap-2 w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Launch a Party
          </Button>
        </Link>
      </div>
    </div>
  )
}

