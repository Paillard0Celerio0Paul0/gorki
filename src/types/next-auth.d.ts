// import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      discord_id: string
      username: string
      is_admin: boolean
    } & DefaultSession["user"]
  }

  interface User {
    discord_id: string
    username: string
    email?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discord_id: string
  }
}
