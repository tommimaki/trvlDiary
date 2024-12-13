import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // Replace 'your-github-username' with your GitHub username
      const allowedUsername = "tommimaki";

      if (profile?.login === allowedUsername) {
        return true; // Allow access
      }

      return false; // Deny access
    },
    async session({ session, token }) {
      session.user.id = token.sub; // Add the user's ID to the session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
