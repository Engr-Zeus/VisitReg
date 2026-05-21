import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Portal",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const expectedUsername = process.env.ADMIN_USERNAME;
        const expectedPassword = process.env.ADMIN_PASSWORD;

        // Verify credentials match the .env variables exactly
        if (
          credentials?.username === expectedUsername &&
          credentials?.password === expectedPassword
        ) {
          // Return an arbitrary user object to represent the session
          return { id: "1", name: "System Administrator", role: "admin" };
        }

        // Return null if authentication fails
        return null;
      }
    })
  ],
  pages: {
    // We will build this custom login screen next
    signIn: "/auth/signin", 
  },
  session: {
    // JSON Web Tokens are perfect for stateless env authentication
    strategy: "jwt", 
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };