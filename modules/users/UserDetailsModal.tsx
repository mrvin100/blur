import { useEffect } from "react"
import { useUsers } from "@/hooks/useUsers"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, User as UserIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const { useUserById } = useUsers()
  const { data: user, isLoading, isError, refetch } = useUserById(userId)

  useEffect(() => {
    if (isOpen && userId) {
      refetch()
    }
  }, [isOpen, userId, refetch])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : isError ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Error loading user details</h3>
              <p className="text-sm">Failed to load user information</p>
            </div>
          </div>
        ) : user ? (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">{user.userName}</CardTitle>
                </div>
                <CardDescription>User ID: {user.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Permissions</h3>
                    {user.permissions && user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission) => (
                          <Badge key={permission.id} variant="secondary">
                            {permission.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No permissions assigned</p>
                    )}
                  </div>
                  
                  {user.races && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Races</h3>
                      {user.races.length > 0 ? (
                        <p className="text-sm">{user.races.length} races participated</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No race participation history</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">User not found</p>
        )}
        
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 