import { JWT } from "next-auth/jwt";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Read-only scope for repo metadata.
      authorization: { params: { scope: "read:user public_repo" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: { access_token?: string } }) {
      if (account?.access_token) token.accessToken = account.access_token;
      return token;
    },
  },
};
