"use client"

import { useState } from "react"
import { useUsers, useCreateUser, useUpdateUser, useAvailableRoles } from "@/hooks"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, UserPlus, Users as UsersIcon, Pencil } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/types/user.types"
import { UserFormDialog } from "./UserFormDialog"
import PermissionGate from "@/components/ui/permission-gate"
import { ApiErrorState } from "@/components/ui/error-states"

// create/update form is handled by <UserFormDialog />

export function Users() {
  const { data: users, isLoading, isError } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const { data: availableRoles = [] } = useAvailableRoles()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleOpenUpdate = (user: User) => {
    setSelectedUser(user)
    setIsUpdateDialogOpen(true)
  }

  if (isLoading) {
    return <UsersSkeleton />
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <ApiErrorState error={createUser.error ?? new Error('Failed to load users')} />
      </div>
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
          <Button
            className="shrink-0 cursor-pointer w-full sm:w-auto"
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
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
                        <div className="flex flex-wrap gap-1">
                          {(user.roles && user.roles.length > 0 ? user.roles : [user.role || 'USER']).map((role, idx) => (
                            <span key={idx} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 sm:py-4">
                        <div className="flex justify-end gap-1">
                          <PermissionGate any={["UPDATE_USER", "ASSIGN_ROLES", "VIEW_ALL_USERS", "ALL_PERMISSIONS"]}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenUpdate(user)}
                              className="cursor-pointer h-8 w-8"
                              title="Edit user"
                            >
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="sr-only">Edit User</span>
                            </Button>
                          </PermissionGate>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenUpdate(user)}
                            className="cursor-pointer h-8 w-8"
                            title="Update user"
                          >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="sr-only">Update User</span>
                          </Button>
                        </div>
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

      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
        title="Create New User"
        submitLabel={createUser.isPending ? "Creating..." : "Create"}
        isSubmitting={createUser.isPending}
        availableRoles={availableRoles}
        onSubmit={async (values) => {
          await createUser.mutateAsync({
            userName: values.userName,
            email: values.email,
            password: values.password ?? "",
            roles: values.roles,
          })
          setIsCreateDialogOpen(false)
        }}
      />

      <UserFormDialog
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open)
          if (!open) setSelectedUser(null)
        }}
        mode="update"
        title={selectedUser ? `Update ${selectedUser.userName}` : "Update User"}
        submitLabel={updateUser.isPending ? "Saving..." : "Save"}
        isSubmitting={updateUser.isPending}
        availableRoles={availableRoles}
        initialUser={selectedUser}
        onSubmit={async (values) => {
          if (!selectedUser) return
          await updateUser.mutateAsync({
            id: selectedUser.id,
            data: {
              userName: values.userName,
              email: values.email,
              password: values.password,
              roles: values.roles,
              enabled: values.enabled,
              accountNonLocked: values.accountNonLocked,
            },
          })
          setIsUpdateDialogOpen(false)
          setSelectedUser(null)
        }}
      />
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