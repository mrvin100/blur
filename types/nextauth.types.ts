import { Permission } from '@/types/auth';
import type { User } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    userName: string;
    permissions: Permission[];
  }
  
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}

export type { User, Session } from "next-auth"; 