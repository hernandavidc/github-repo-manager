import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

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
        async jwt({ token, user, account, profile }: any) {
            if (user){
                token.id = user.id;
                token.userId = user.id;
            }
            
            if (account?.provider === "github") {
                token.accessToken = account.access_token;
                
                let existingUser = await prisma.user.findFirst({
                    where: { githubId: account.providerAccountId }
                });

                if (existingUser) {
                    token.userId = existingUser.id;
                    token.githubId = existingUser.githubId;
                    return token;
                }
                
                let sessionEmail = null;
                try {
                    const cookieStore = await cookies();
                    const githubCookie = cookieStore.get('github_connect_email');
                    if (githubCookie) {
                        sessionEmail = githubCookie.value;
                        
                        cookieStore.set('github_connect_email', '', { maxAge: 0, path: '/' });
                    }
                } catch (error) {
                    console.error("Error cookie:", error);
                }
                
                const githubEmail = profile?.email;
                
                if (sessionEmail) {
                    existingUser = await prisma.user.findFirst({
                        where: { email: sessionEmail }
                    });
                    
                    if (existingUser) {
                        console.log(`User found with session email: ${sessionEmail}`);
                        
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { githubId: account.providerAccountId }
                        });
                        
                        token.userId = existingUser.id;
                        token.githubId = account.providerAccountId;
                        return token;
                    }
                } else if (githubEmail) {
                    existingUser = await prisma.user.findFirst({
                        where: { email: githubEmail }
                    });
                    
                    if (existingUser) {
                        console.log(`User found with GitHub email: ${githubEmail}`);
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { githubId: account.providerAccountId }
                        });
                        
                        token.userId = existingUser.id;
                        token.githubId = account.providerAccountId;
                        return token;
                    }
                }
                
                console.log("Creating a new user with GitHub");
                existingUser = await prisma.user.create({
                    data: {
                        email: githubEmail || sessionEmail || `github_${account.providerAccountId}@example.com`,
                        name: profile?.name || "GitHub User",
                        githubId: account.providerAccountId
                    }
                });
                
                token.userId = existingUser.id;
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

