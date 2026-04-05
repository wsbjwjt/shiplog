import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { prisma } from './prisma'

// Debug: Log environment variables (remove in production)
console.log('AUTH_GITHUB_ID exists:', !!process.env.AUTH_GITHUB_ID)
console.log('AUTH_GITHUB_SECRET exists:', !!process.env.AUTH_GITHUB_SECRET)
console.log('AUTH_SECRET exists:', !!process.env.AUTH_SECRET)
console.log('AUTH_URL exists:', !!process.env.AUTH_URL)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: '/login',
  },
})
