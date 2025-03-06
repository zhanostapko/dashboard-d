import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";
import { JWT } from "next-auth/jwt";
import { Account, User, Session } from "next-auth";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user?.email || "" },
      });

      return !!existingUser;
    },
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log(token);
      return session;
    },
  },
};
