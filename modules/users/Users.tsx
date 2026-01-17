"use client"

import { useState } from "react"
import { useUsers, useCreateUser } from "@/hooks"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Eye, EyeOff, UserPlus, Users as UsersIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User } from "@/types/auth"
import UserDetailsModal from "./UserDetailsModal"

const createUserSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["GREAT_ADMIN", "PARTY_MANAGER", "RACER"]),
})

type FormValues = z.infer<typeof createUserSchema>

export function Users() {
  const { data: users, isLoading, isError } = useUsers()
  const createUser = useCreateUser()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      userName: "",
      password: "",
      role: "RACER", 
      email: "",
    },
  })

  const handleCreateUser = async (values: FormValues) => {
    try {
      await createUser.mutateAsync({
        userName: values.userName,
        password: values.password,
        role: values.role,
        email: values.email || undefined,
      })
      setIsCreateDialogOpen(false)
      form.reset()
    } catch {
      toast.error("Failed to create user")
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsDetailsModalOpen(true)
  }

  if (isLoading) {
    return <UsersSkeleton />
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Error loading users</h3>
              <p className="text-sm">An unexpected error occurred</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
              <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              User Management
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Create and manage system users
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 cursor-pointer w-full sm:w-auto" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
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
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter password" 
                              className="pr-10"
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="RACER">RACER</SelectItem>
                            <SelectItem value="PARTY_MANAGER">PARTY_MANAGER</SelectItem>
                            <SelectItem value="GREAT_ADMIN">GREAT_ADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        {!users || users.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <p className="text-sm sm:text-base">No users found</p>
            <p className="text-xs sm:text-sm mt-1">
              Click the &quot;Add User&quot; button to create your first user
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[40px] sm:min-w-[60px] text-xs sm:text-sm">ID</TableHead>
                    <TableHead className="min-w-[100px] sm:min-w-[150px] text-xs sm:text-sm">Username</TableHead>
                    <TableHead className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Role</TableHead>
                    <TableHead className="text-right min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.map((user) => (
                    <TableRow key={user.id.toString()}>
                      <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">{user.id}</TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4 truncate max-w-[100px] sm:max-w-none">{user.userName}</TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted rounded">{(user as any).role ?? 'USER'}</span>
                      </TableCell>
                      <TableCell className="text-right py-2 sm:py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewUser(user)}
                          className="cursor-pointer h-8 w-8"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs sm:text-sm text-muted-foreground p-4 sm:p-6">
        <div>Total: {users?.length || 0} user(s)</div>
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
    <Card className="w-full">
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