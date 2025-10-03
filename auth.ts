import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials" 
import { PrismaClient } from "./lib/generated/prisma";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: "student" | "placement-cell" | "employer"
        }
    }

    interface User {
        id: string
        role: "student" | "placement-cell" | "employer"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: "student" | "placement-cell" | "employer"
    }
}

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
            email: {
              type: "email",
              label: "Email",
              placeholder: "Enter your email",
            },
            password: {
              type: "password",
              label: "Password",
              placeholder: "Enter password",
            },
            role: {
              type: "text",
              label: "Role",
            },
        },
        
        authorize: async (credentials) => {
            console.log("Authorizing user with credentials:", credentials);

            if (credentials?.role === "student") {
                const user = await prisma.student.findUnique({
                    where: { email: credentials.email as string },
                });

                console.log("Found student user:", user);

                if (user && user.password === credentials?.password) {
                    return { id: user.id, email: user.email, name: user.name, role: "student" };
                }
            }

            if (credentials?.role === "placement-cell") {
                const user = await prisma.placmentCell.findUnique({
                    where: { email: credentials.email as string },
                });

                if (user && user.password === credentials?.password) {
                    return { id: user.id, email: user.email, name: user.name, role: "placement-cell" };
                }
            }
                

            if (credentials?.role === "employer") {
                const user = await prisma.employer.findUnique({
                    where: { email: credentials.email as string },
                });

                if (user && user.password === credentials?.password) {
                    return { id: user.id, email: user.email, name: user.name, role: "employer" };
                }
            }

            return null;
        }
    })
  ],
  callbacks: {
    session({ session, token, user }) {
        console.log("Session callback:", { session, token, user });
        return {
            ...session,
            user: {
                id: token.id as string,
                email: session.user?.email || "",
                name: session.user?.name || "",
                role: token.role as "student" | "placement-cell" | "employer",
            }
        }
    },
    jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            token.role = user.role;
        }
        return token;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/error'
  },
  secret: process.env.AUTH_SECRET,
})