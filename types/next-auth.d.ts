import { Permission } from './auth';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    userName: string;
    permissions: Permission[];
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      userName: string;
      permissions: Permission[];
    };
  }
} 