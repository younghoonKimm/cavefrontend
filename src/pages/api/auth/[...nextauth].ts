import axios from "axios";
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  // debug: true,

  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_API_ID,
      clientSecret: process.env.KAKAO_API_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXT_AUTH_SECRE_KEY,
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account?.provider === "kakao") {
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

        const { data } = await axios.post(
          `${process.env.API_URL}/auth/login`,
          userProfile
        );

        return true;
      }
      return false;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
