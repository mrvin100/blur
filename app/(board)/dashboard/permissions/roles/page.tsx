"use client";

import { useState } from 'react';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks';
import PermissionGate from '@/components/ui/permission-gate';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ALL_PERMISSIONS = [
  'CREATE_USER','UPDATE_USER','DELETE_USER','VIEW_ALL_USERS','ASSIGN_ROLES',
  'CREATE_PARTY','JOIN_PARTY','MANAGE_PARTY','DELETE_PARTY','VIEW_PARTY',
  'CREATE_RACE','START_RACE','JOIN_RACE','LEAVE_RACE','VIEW_RACE','DELETE_RACE',
  'SUBMIT_SCORE','VIEW_SCORE','EDIT_SCORE','VIEW_CARS','VIEW_MAPS','VIEW_STATISTICS','VIEW_HISTORY',
  'UPDATE_OWN_PROFILE','VIEW_OWN_PROFILE','ALL_PERMISSIONS'
] as const;

export default function RolesPage() {
  const { data: roles, isLoading, isError } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<string[]>([]);

  const handleCreate = async () => {
    if (!newRoleName) {
      toast.error('Role name is required');
      return;
    }
    try {
      await createRole.mutateAsync({ name: newRoleName, description: newRoleDesc, permissions: newRolePerms });
      setNewRoleName('');
      setNewRoleDesc('');
      setNewRolePerms([]);
    } catch {}
  };

  return (
    <PermissionGate any={["ASSIGN_ROLES","ALL_PERMISSIONS"]}>
      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Create and manage roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Create Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Role name (enum) e.g., PARTY_MANAGER" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value.toUpperCase())} />
                <Input placeholder="Description" value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} />
                <Button className="cursor-pointer" onClick={handleCreate} disabled={createRole.isPending}>Create</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {ALL_PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={newRolePerms.includes(perm)} onCheckedChange={(c) => {
                      setNewRolePerms((prev) => c ? Array.from(new Set([...prev, perm])) : prev.filter((p) => p !== perm))
                    }} />
                    {perm}
                  </label>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Existing Roles</h3>
              {isLoading && <p>Loading...</p>}
              {isError && <p className="text-destructive">Failed to load roles</p>}
              <div className="space-y-3">
                {roles?.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.description || '—'}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="cursor-pointer" onClick={async () => {
                            try {
                              await updateRole.mutateAsync({ id: r.id, data: { description: r.description, permissions: r.permissions } });
                            } catch {}
                          }}>Save</Button>
                          <Button size="sm" variant="destructive" className="cursor-pointer" onClick={async () => {
                            try { await deleteRole.mutateAsync(r.id); } catch {}
                          }}>Delete</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {ALL_PERMISSIONS.map((perm) => (
                          <label key={perm} className="flex items-center gap-2 text-sm">
                            <Checkbox checked={r.permissions.includes(perm)} onCheckedChange={(c) => {
                              const exists = r.permissions.includes(perm);
                              if (c && !exists) {
                                r.permissions.push(perm);
                              } else if (!c && exists) {
                                r.permissions = r.permissions.filter((p) => p !== perm);
                              }
                            }} />
                            {perm}
                          </label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}
