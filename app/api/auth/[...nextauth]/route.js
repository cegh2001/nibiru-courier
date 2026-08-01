import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock users para desarrollo sin backend
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin Nibiru",
    email: "admin@nibiru.courier",
    password: "admin123",
    roles: ["super-admin"],
  },
  {
    id: "2",
    name: "Despachador Demo",
    email: "despachador@nibiru.courier",
    password: "demo123",
    roles: ["despachador"],
  },
  {
    id: "3",
    name: "Conductor Demo",
    email: "conductor@nibiru.courier",
    password: "demo123",
    roles: ["conductor"],
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = MOCK_USERS.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "nibiru-courier-dev-secret",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
