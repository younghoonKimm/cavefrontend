import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  // debug: true,

  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_API_ID,
      clientSecret: process.env.KAKAO_API_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  cookies: {},
  events: {
    signIn: async (message) => {
      const { user, account, profile } = message;

      if (account && profile) {
        const { provider, expires_at, providerAccountId: providerId } = account;
        // const { properties } = profile;
        const { name, image: profileImg, email } = user;
      }
    },
  },
  secret: process.env.NEXT_AUTH_SECRE_KEY,

  callbacks: {
    async signIn({ account, profile }: any) {
      if (account?.provider === 'kakao') {
        return true;
      }
      return false;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      // if (url === `${baseUrl}/login`) return baseUrl;
      // if (baseUrl) return `${baseUrl}/login`;
      // if (url.startsWith("/")) return `${baseUrl}${url}`;
      // // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, _, account, profile }: any) {
      if (account && profile) {
        const { provider, expires_at, providerAccountId: providerId } = account;
        const { properties } = profile;
        const {
          nickname: name,
          thumbnail_image: profileImg,
          email,
        } = properties;

        const userProfile = {
          socialPlatform: provider,
          providerId,
          expires_at,
          profileImg,
          name,
          email,
        };

        // const res = await axios.post(
        //   `${process.env.API_URL}/auth/login`,
        //   userProfile,
        // );

        // const { accessToken, refreshToken } = res.data;

        token.userProfile = { ...userProfile };
      }
      return token;
    },

    async session({ session, _, token }: any) {
      session.user.id = token.userProfile.providerId;
      session.user.email = token.userProfile.email ?? null;
      session.userProfile = token.userProfile;

      return session;
    },
  },
};

export default NextAuth(authOptions);
