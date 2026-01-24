"use client";

import { ReactNode } from 'react';
import { useUser } from '@/lib/stores/auth.store';
import { hasAll, hasAny } from '@/lib/permissions';

interface PermissionGateProps {
  any?: string[];
  all?: string[];
  mode?: 'hidden' | 'disabled';
  children: ReactNode;
}

export default function PermissionGate({ any, all, mode = 'hidden', children }: PermissionGateProps) {
  const user = useUser();

  const okAny = any && any.length > 0 ? hasAny(user, any) : true;
  const okAll = all && all.length > 0 ? hasAll(user, all) : true;
  const allowed = okAny && okAll;

  if (allowed) return <>{children}</>;

  if (mode === 'disabled') {
    // Try to clone element with disabled prop if possible, else hide
    const child = Array.isArray(children) ? children[0] : children;
    if (child && typeof child === 'object' && 'props' in (child as any)) {
      try {
        const el: any = child;
        return el && el.type
          ? ( // eslint-disable-next-line react/jsx-key
            <el.type {...el.props} disabled aria-disabled>
              {el.props?.children}
            </el.type>
          )
          : null;
      } catch {
        return null;
      }
    }
  }

  // Default: hidden
  return null;
}
