import { useEffect, useMemo, useState } from "react"
import { useUser, useAssignUserRoles, useRemoveUserRole, useUpdateUser, useCurrentUser } from "@/hooks"
import type { User } from "@/types/user.types"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const ALL_ROLES = ["RACER", "PARTY_MANAGER", "GREAT_ADMIN"] as const

type RoleType = typeof ALL_ROLES[number]

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const { data: userData, isLoading, isError, refetch } = useUser(userId)
  const { data: currentUser } = useCurrentUser()
  const canManageRoles = useMemo(() => {
    const perms = (currentUser?.permissions || []) as string[]
    return perms.includes('ALL_PERMISSIONS') || perms.includes('ASSIGN_ROLES') || perms.includes('UPDATE_USER') || (currentUser?.role === 'GREAT_ADMIN')
  }, [currentUser])

  const user = userData as User | undefined
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([])
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined)
  const [locked, setLocked] = useState<boolean | undefined>(undefined)
  const [userName, setUserName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const canEditDetails = useMemo(() => {
    const perms = (currentUser?.permissions || []) as string[]
    return perms.includes('ALL_PERMISSIONS') || perms.includes('UPDATE_USER') || (currentUser?.role === 'GREAT_ADMIN')
  }, [currentUser])

  const assignUserRoles = useAssignUserRoles()
  const removeUserRole = useRemoveUserRole()
  const updateUser = useUpdateUser()

  useEffect(() => {
    if (isOpen && userId) {
      refetch()
    }
  }, [isOpen, userId, refetch])

  useEffect(() => {
    if (user) {
      const roles = (user.roles && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : [])) as RoleType[]
      setSelectedRoles(roles)
      setEnabled(user.enabled)
      setLocked(user.accountNonLocked)
      setUserName(user.userName)
      setEmail(user.email ?? "")
      setPassword("")
      setConfirmPassword("")
    }
  }, [user])

  const handleSaveRoles = async () => {
    if (!user) return
    try {
      await assignUserRoles.mutateAsync({ id: user.id, roles: selectedRoles })
      await refetch()
    } catch (e) {
      // noop, handled by hook
    }
  }

  const handleSaveDetails = async () => {
    if (!user) return
    if (password && password !== confirmPassword) {
      // basic check
      return
    }
    try {
      await updateUser.mutateAsync({ id: user.id, data: { userName, email, password: password || undefined, enabled, accountNonLocked: locked } })
      await refetch()
    } catch (e) {
      // noop
    }
  }

  const handleUpdateAccount = async () => {
    if (!user) return
    try {
      await updateUser.mutateAsync({ id: user.id, data: { enabled, accountNonLocked: locked } })
      await refetch()
    } catch (e) {
      // noop
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
                <div className="space-y-5">
                  {/* Details form */}
                  {canEditDetails && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">User Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Username</label>
                          <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Email</label>
                          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Password (optional)</label>
                          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Confirm Password</label>
                          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <Button size="sm" className="cursor-pointer" onClick={handleSaveDetails} disabled={updateUser.isPending}>
                          {updateUser.isPending ? 'Saving...' : 'Save Details'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Permissions overview */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Permissions</h3>
                    {user.permissions && user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No permissions assigned</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Roles</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(selectedRoles.length > 0 ? selectedRoles : (user.role ? [user.role] : [])).map((r) => (
                        <Badge key={r} variant="outline">{r}</Badge>
                      ))}
                    </div>

                    {canManageRoles && (
                      <div className="space-y-2">
                        {ALL_ROLES.map((role) => (
                          <label key={role} className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedRoles.includes(role)}
                              onCheckedChange={(checked) => {
                                setSelectedRoles((prev) => {
                                  if (checked) return Array.from(new Set([...prev, role]))
                                  return prev.filter((r) => r !== role)
                                })
                              }}
                            />
                            <span className="text-sm">{role}</span>
                          </label>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="cursor-pointer" onClick={handleSaveRoles} disabled={assignUserRoles.isPending}>
                            {assignUserRoles.isPending ? 'Saving...' : 'Save Roles'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {canManageRoles && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Account</h3>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={!!enabled} onCheckedChange={(v) => setEnabled(!!v)} /> Enabled
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={!!locked} onCheckedChange={(v) => setLocked(!!v)} /> Account Non Locked
                        </label>
                        <Button size="sm" variant="outline" className="cursor-pointer" onClick={handleUpdateAccount} disabled={updateUser.isPending}>
                          {updateUser.isPending ? 'Saving...' : 'Save Account'}
                        </Button>
                      </div>
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
