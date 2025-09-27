import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials" 
import { PrismaClient } from "./lib/generated/prisma";

declare module "next-auth" {
    interface Session {
        user: {
            email: string
            name: string
            role: "student" | "placement-cell" | "employer"
        } & DefaultSession["user"]
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
            let user = null;

            console.log("Authorizing user with credentials:", credentials);

            if (credentials?.role === "student") {
                user = await prisma.student.findUnique({
                    where: { email: credentials.email as string },
                });

                if (user && user.password === credentials?.password) {
                    return { id: user.id, email: user.email, role: "student" };
                }
            }

            if (credentials?.role === "placement-cell") {
                user = await prisma.placmentCell.findUnique({
                    where: { email: credentials.email as string },
                });

                if (user && user.password === credentials?.password) {
                    return { id: user.id, email: user.email, role: "placement-cell" };
                }
            }
                

            if (credentials?.role === "employer") {
                user = await prisma.employer.findUnique({
                    where: { email: credentials.email as string },
                });

                if (user && user.password === credentials?.password) {
                    return { id: user.id, email: user.email, role: "employer" };
                }
            }

            return user;
        }
    })
  ],
  callbacks: {
    session({ session, token, user }) {
        return {
            ...session,
            user: {
                email: session.user?.email || "",
                name: session.user?.name || "",
                role: token.role as "student" | "placement-cell" | "employer",
            }
        }
    }
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.AUTH_SECRET,
})