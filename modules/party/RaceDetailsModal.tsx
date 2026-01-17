import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useRace } from "@/hooks"

interface RaceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  raceId: string
}

export function RaceDetailsModal({ isOpen, onClose, raceId }: RaceDetailsModalProps) {
  const { data: race } = useRace(raceId)
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Détails de la Course #{race?.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted/20 p-3 rounded-md">
            <p className="text-sm">Date: {race?.createdAt && formatDate(race.createdAt)}</p>
          </div>

          {race?.raceParameters && race.raceParameters.length > 0 && (
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Paramètres de la course</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {race.raceParameters?.map((param) => (
                    param.isActive && <div key={param.id.toString()} className="flex flex-col items-center">
                      <div className="relative h-16 w-16 mb-2 shadow-sm rounded-md overflow-hidden">
                        <Image
                          src={param.downloadUrl || "/placeholder.svg"}
                          alt={param.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{param.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h3 className="font-medium mb-3">Participants et Scores</h3>
            {race?.racers && race.racers.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {race.racers.map((racer) => {
                      const score = race.scores?.find((s) => s.user?.id == racer.id)
                      return (
                        <TableRow key={racer.id}>
                          <TableCell className="font-medium">{racer.userName}</TableCell>
                          <TableCell>{score ? score.value : "-"}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">Aucun participant</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

