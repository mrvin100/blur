"use client"

import { useState } from "react"
import { usePermissions } from "@/hooks/usePermissions"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { AlertCircle, Key, Plus, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Permission } from "@/types/auth"

export function Permissions() {
  const { getPermissions, createPermission, deletePermission } = usePermissions()
  const [newPermissionName, setNewPermissionName] = useState("")
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null)
  const [open, setOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleCreatePermission = async () => {
    if (!newPermissionName.trim()) {
      toast.error("Permission name cannot be empty")
      return
    }
    
    try {
      await createPermission.mutateAsync(newPermissionName)
      setNewPermissionName("")
      setOpen(false)
    } catch (error) {
      console.error("Failed to create permission:", error)
    }
  }

  const handleDeletePermission = async () => {
    if (!permissionToDelete) return
    
    try {
      await deletePermission.mutateAsync(permissionToDelete.id.toString())
      setPermissionToDelete(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete permission:", error)
    }
  }

  if (getPermissions.isLoading) {
    return <PermissionsSkeleton />
  }

  if (getPermissions.isError) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-8">
        <CardContent className="pt-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Error loading permissions</h3>
              <p className="text-sm">{getPermissions.error?.message || "An unexpected error occurred"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const permissions = getPermissions.data || []

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Key className="h-5 w-5" />
              Permissions Management
            </CardTitle>
            <CardDescription>
              Create and manage user permissions
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Permission</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="permission-name" className="text-sm font-medium inline-block mb-4">
                      Permission Name
                    </label>
                    <Input
                      id="permission-name"
                      placeholder="e.g., canManageUsers"
                      value={newPermissionName}
                      onChange={(e) => setNewPermissionName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="cursor-pointer">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreatePermission} disabled={createPermission.isPending} className="cursor-pointer">
                  {createPermission.isPending ? "Creating..." : "Create Permission"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {permissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No permissions found</p>
            <p className="text-sm mt-1">
              Click the &quot;Add Permission&quot; button to create your first permission
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id.toString()}>
                  <TableCell className="font-medium">{permission.id}</TableCell>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog 
                      open={isDeleteDialogOpen && permissionToDelete?.id === permission.id} 
                      onOpenChange={(isOpen) => {
                        setIsDeleteDialogOpen(isOpen)
                        if (!isOpen) setPermissionToDelete(null)
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPermissionToDelete(permission)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the permission &quot;{permission.name}&quot;?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeletePermission}
                            disabled={deletePermission.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletePermission.isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Total: {permissions.length} permission(s)</div>
        <div>{new Date().toLocaleDateString()}</div>
      </CardFooter>
    </Card>
  )
}

function PermissionsSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  )
} 