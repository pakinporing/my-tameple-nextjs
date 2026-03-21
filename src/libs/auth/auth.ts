import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { requestLogin, refreshOnce } from '../api/auth';
import z from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const { handlers, signIn, auth, signOut } = NextAuth({
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
    async jwt({ token, user }) {
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

      try {
        const { accessToken, expiresIn, refreshToken, refreshExpiresIn } =
          await refreshOnce(token.refreshToken);

        return {
          ...token,
          accessToken: accessToken ?? token.accessToken,
          accessTokenExpiresAt: Date.now() + expiresIn * 1000,
          refreshToken: refreshToken ?? token.refreshToken,
          refreshTokenExpiresAt: Date.now() + refreshExpiresIn * 1000,
          refreshError: null
        };
      } catch {
        return {
          ...token,
          accessToken: undefined,
          accessTokenExpiresAt: null,
          refreshToken: null,
          refreshTokenExpiresAt: null,
          refreshError: 'RefreshAccessTokenError'
        };
      }
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
