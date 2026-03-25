import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { headers } from 'next/headers';
import { requestLogin, refreshOnce, requestRefresh } from '../api/auth';
import z from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const { handlers, signIn, auth, signOut, unstable_update } = NextAuth({
  pages: {
    signIn: '/login'
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const {
            user,
            accessToken,
            expiresIn,
            refreshToken,
            refreshExpiresIn
          } = await requestLogin(parsed.data.email, parsed.data.password);

          return {
            id: user.id,
            email: user.email,
            role: 'user',
            image: user.avatarUrl,
            name: `${user.firstName} ${user.lastName}`.trim(),
            accessToken,
            accessTokenExpiresAt: Date.now() + expiresIn * 1000,
            refreshToken,
            refreshTokenExpiresAt: Date.now() + refreshExpiresIn * 1000
          };
        } catch {
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.userId = user.id;
        token.userImage = user.image ?? null;
        token.userName = user.name ?? null;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.refreshToken = user.refreshToken ?? null;
        token.refreshTokenExpiresAt = user.refreshTokenExpiresAt ?? null;
        token.refreshError = null;
      }
      console.log('session 9999999', session);
      if (trigger === 'update' && session) {
        if ('accessToken' in session) {
          token.accessToken = session.accessToken;
        }
        if ('accessTokenExpiresAt' in session) {
          token.accessTokenExpiresAt = session.accessTokenExpiresAt;
        }
        if ('refreshToken' in session) {
          token.refreshToken = session.refreshToken;
        }
        if ('refreshTokenExpiresAt' in session) {
          token.refreshTokenExpiresAt = session.refreshTokenExpiresAt;
        }
        if ('refreshError' in session) {
          token.refreshError = session.refreshError;
        }
      }

      const now = Date.now();
      const accessTokenExpiresAt = token.accessTokenExpiresAt ?? 0;
      const refreshTokenExpiresAt = token.refreshTokenExpiresAt ?? 0;

      if (token.accessToken && now < accessTokenExpiresAt - 2000) {
        return token;
      }

      if (!token.refreshToken || now >= refreshTokenExpiresAt - 2000) {
        return {
          ...token,
          accessToken: undefined,
          accessTokenExpiresAt: null,
          refreshToken: null,
          refreshTokenExpiresAt: null,
          refreshError: 'RefreshTokenExpired'
        };
      }

      return {
        ...token,
        refreshError: null
      };
    },

    session({ token, session }) {
      session.accessToken = token.accessToken;
      session.refreshError = token.refreshError ?? null;
      session.user.id = token.userId!;
      session.user.role = token.role;
      session.user.name = token.userName;
      session.user.image = token.userImage;

      return session;
    }
  }
});

async function getJwtPayload() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error('Missing auth secret');
  }

  const requestHeaders = await headers();

  return getToken({
    req: { headers: requestHeaders },
    secret
  });
}

function buildSessionUpdate(data: Partial<Session>): Partial<Session> {
  return data;
}

export async function authWithRefresh() {
  const session = await auth();
  const token = await getJwtPayload();

  if (!session || !token) return session;

  const now = Date.now();
  const accessTokenExpiresAt = token.accessTokenExpiresAt ?? 0;
  const refreshTokenExpiresAt = token.refreshTokenExpiresAt ?? 0;

  if (token.accessToken && now < accessTokenExpiresAt - 2000) {
    return {
      ...session,
      accessToken: token.accessToken,
      refreshError: token.refreshError ?? null
    };
  }

  if (!token.refreshToken || now >= refreshTokenExpiresAt - 2000) {
    console.log('in.    163 !!!!!!');
    await unstable_update(
      buildSessionUpdate({
        accessToken: undefined,
        accessTokenExpiresAt: null,
        refreshToken: null,
        refreshTokenExpiresAt: null,
        refreshError: 'RefreshTokenExpired'
      })
    );

    return {
      ...session,
      accessToken: undefined,
      refreshError: 'RefreshTokenExpired'
    };
  }

  try {
    const { accessToken, expiresIn, refreshToken, refreshExpiresIn } =
      await requestRefresh(token.refreshToken);

    await unstable_update(
      buildSessionUpdate({
        accessToken,
        accessTokenExpiresAt: Date.now() + expiresIn * 1000,
        refreshToken,
        refreshTokenExpiresAt: Date.now() + refreshExpiresIn * 1000,
        refreshError: null
      })
    );

    return {
      ...session,
      accessToken,
      refreshError: null
    };
  } catch {
    await unstable_update(
      buildSessionUpdate({
        accessToken: undefined,
        accessTokenExpiresAt: null,
        refreshToken: null,
        refreshTokenExpiresAt: null,
        refreshError: 'RefreshAccessTokenError'
      })
    );

    return {
      ...session,
      accessToken: undefined,
      refreshError: 'RefreshAccessTokenError'
    };
  }
}
