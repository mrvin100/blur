"use client"

import { useState } from "react"
import { useUsers } from "@/hooks/useUsers"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Eye, UserPlus, Users as UsersIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User } from "@/types/auth"
import UserDetailsModal from "./UserDetailsModal"

const createUserSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  permissionsIds: z.array(z.number()).optional(),
})

type FormValues = z.infer<typeof createUserSchema>

export function Users() {
  const { getUsers, createUser } = useUsers()
  const { getPermissions } = usePermissions()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      userName: "",
      password: "",
      permissionsIds: [],
    },
  })

  const handleCreateUser = async (values: FormValues) => {
    try {
      await createUser.mutateAsync({
        ...values,
        permissionsIds: selectedPermissions,
      })
      setIsCreateDialogOpen(false)
      form.reset()
      setSelectedPermissions([])
    } catch (error) {
      console.error("Failed to create user:", error)
    }
  }

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsDetailsModalOpen(true)
  }

  if (getUsers.isLoading || getPermissions.isLoading) {
    return <UsersSkeleton />
  }

  if (getUsers.isError) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-8">
        <CardContent className="pt-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Error loading users</h3>
              <p className="text-sm">{getUsers.error?.message || "An unexpected error occurred"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const users = getUsers.data || []
  const permissions = getPermissions.data || []

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Create and manage system users
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 cursor-pointer">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {permissions.length > 0 && (
                    <div className="space-y-2">
                      <FormLabel>Permissions</FormLabel>
                      <div className="max-h-[200px] overflow-y-auto border rounded-md p-3 space-y-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`permission-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={createUser.isPending} className="cursor-pointer">
                      {createUser.isPending ? "Creating..." : "Create User"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No users found</p>
            <p className="text-sm mt-1">
              Click the &quot;Add User&quot; button to create your first user
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id.toString()}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions && user.permissions.length > 0 ? (
                        user.permissions.map((permission) => (
                          <Badge key={permission.id} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">No permissions</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewUser(user)}
                      className="cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Total: {users.length} user(s)</div>
        <div>{new Date().toLocaleDateString()}</div>
      </CardFooter>

      {selectedUser && (
        <UserDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          userId={selectedUser.id.toString()}
        />
      )}
    </Card>
  )
}

function UsersSkeleton() {
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
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-48" />
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