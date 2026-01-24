import type { AuthUser } from '@/lib/schemas/auth.schema';

export type Permission = string;

export function hasPermission(user: AuthUser | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  const perms = user.permissions || [];
  return perms.includes('ALL_PERMISSIONS') || perms.includes(permission);
}

export function hasAny(user: AuthUser | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false;
  const perms = user.permissions || [];
  if (perms.includes('ALL_PERMISSIONS')) return true;
  return permissions.some((p) => perms.includes(p));
}

export function hasAll(user: AuthUser | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false;
  const perms = user.permissions || [];
  if (perms.includes('ALL_PERMISSIONS')) return true;
  return permissions.every((p) => perms.includes(p));
}
