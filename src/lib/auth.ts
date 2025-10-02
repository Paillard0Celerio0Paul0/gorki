/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import DiscordProvider from "next-auth/providers/discord"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "discord") {
        try {
          // Créer ou mettre à jour l'utilisateur dans notre DB
          await prisma.user.upsert({
            where: { discord_id: account.providerAccountId },
            update: {
              username: user.name || "Unknown",
              email: user.email,
              avatar_url: user.image,
            },
            create: {
              discord_id: account.providerAccountId,
              username: user.name || "Unknown",
              email: user.email,
              avatar_url: user.image,
              is_admin: false, // Par défaut pas admin
            },
          });
          return true;
        } catch (error) {
          console.error("Erreur lors de la création/mise à jour de l'utilisateur:", error);
          return false;
        }
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        try {
          // Récupérer les données utilisateur depuis la DB
          const user = await prisma.user.findUnique({
            where: { discord_id: token.sub },
            select: { id: true, discord_id: true, username: true, is_admin: true }
          })
          
          if (user) {
            session.user.id = user.id
            session.user.discord_id = user.discord_id
            session.user.username = user.username
            session.user.is_admin = user.is_admin
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur:", error);
        }
      }
      return session
    },
    jwt: async ({ token, account }) => {
      if (account?.provider === "discord" && account?.providerAccountId) {
        token.discord_id = account.providerAccountId;
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt" as const,
  },
}

export default authOptions
