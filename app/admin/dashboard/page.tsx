'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User, Permission } from '@/types/auth';
import { getUsers, createUser, deleteUser, getPermissions, createPermission, deletePermission } from '@/lib/auth';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newUser, setNewUser] = useState({ userName: '', password: '', permissionsIds: [] as number[] });
  const [newPermission, setNewPermission] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    } else if (session?.user && !session.user.permissions.some(p => p.name === 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      setPermissions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to fetch permissions');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setNewUser({ userName: '', password: '', permissionsIds: [] });
      toast.success('User created successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPermission({ name: newPermission });
      setNewPermission('');
      toast.success('Permission created successfully');
      fetchPermissions();
    } catch (error) {
      toast.error('Failed to create permission');
    }
  };

  const handleDeletePermission = async (permissionId: number) => {
    try {
      await deletePermission(permissionId);
      toast.success('Permission deleted successfully');
      fetchPermissions();
    } catch (error) {
      toast.error('Failed to delete permission');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Create New User</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                value={newUser.userName}
                onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newUser.permissionsIds.includes(permission.id)}
                      onChange={(e) => {
                        const newPermissionsIds = e.target.checked
                          ? [...newUser.permissionsIds, permission.id]
                          : newUser.permissionsIds.filter((id) => id !== permission.id);
                        setNewUser({ ...newUser, permissionsIds: newPermissionsIds });
                      }}
                    />
                    <span>{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit">Create User</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Create New Permission</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePermission} className="space-y-4">
            <div>
              <Label htmlFor="permissionName">Permission Name</Label>
              <Input
                id="permissionName"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Create Permission</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Users</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>
                    {user.permissions.map((p) => p.name).join(', ')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Permissions</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.id}</TableCell>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeletePermission(permission.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 