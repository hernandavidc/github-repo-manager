import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      githubId: any;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    username?: string;
    image?: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    accessToken?: string;
  }
}