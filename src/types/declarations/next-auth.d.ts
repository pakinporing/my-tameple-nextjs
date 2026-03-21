import type { DefaultSession } from 'next-auth';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: 'admin' | 'user';
    accessToken?: string;
    name?: string | null;
    image?: string | null;
    accessTokenExpiresAt?: number | null;
    refreshToken?: string | null;
    refreshTokenExpiresAt?: number | null;
  }

  interface Session {
    accessToken?: string;
    refreshError?: string | null;
    user: {
      id?: string;
      role?: 'admin' | 'user';
      name?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'admin' | 'user';
    accessToken?: string;
    userId?: string;
    userImage?: string | null;
    userName?: string | null;
    accessTokenExpiresAt?: number | null;
    refreshToken?: string | null;
    refreshTokenExpiresAt?: number | null;
    refreshError?: string | null;
  }
}
