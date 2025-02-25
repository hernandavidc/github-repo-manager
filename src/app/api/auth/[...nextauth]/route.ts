import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) return null

                const isValid = await bcrypt.compare(credentials.password, user.password);
                return isValid ? {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name || "User",
                    githubId: user.githubId,
                } : null;
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        })
    ],
    callbacks: {
        async session({ session, user, token }: any) {
            if(token && session.user){
                session.user.id = token.userId;
                session.accessToken = token.accessToken;
            }
            session.user.githubId = token.githubId;
            session.user.accessToken = token.accessToken;
            return session;
        },
        async jwt({ token, user, account }: any) {
            if (user) token.id = user.id;
            if (account?.provider === "github") {
                token.accessToken = account.access_token;

                const existingUser = await prisma.user.findFirst({
                    where: { email: token.email }
                });

                if (existingUser && !existingUser.githubId) {
                    await prisma.user.update({
                        where: { email: token.email },
                        data: { githubId: account.providerAccountId }
                    });
                }

                token.githubId = account.providerAccountId;
            }
            return token
        }
    },
    session: { strategy: "jwt" as const },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

