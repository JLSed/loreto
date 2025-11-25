import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { verifyPassword } from '@/lib/server-only-utils'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET

if (!googleClientId) throw new Error('GOOGLE_CLIENT_ID env var is not set')
if (!googleClientSecret)
  throw new Error('GOOGLE_CLIENT_SECRET env var is not set')
if (!nextAuthSecret) throw new Error('NEXTAUTH_SECRET env var is not set')

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null

        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
            verified: true,
          },
        })

        if (!user) return null
        if (!user.password) return null

        const passwordMatched = verifyPassword(
          credentials.password,
          user.password
        )

        if (!passwordMatched) return null

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    maxAge: 3600,
  },
  secret: nextAuthSecret,
  callbacks: {
    signIn: async ({ user, profile, account }) => {
      if (account?.provider !== 'google') return true

      if (!user?.email || !user.name || !profile)
        return 'Unable to sign in. Missing profile email and profile name'

      const u = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          username: user.name,
          photoUrl: user.image,
          firstName: profile.given_name ?? user.name,
          lastName: profile.family_name ?? '',
          verified: true,
        },
        create: {
          email: user.email,
          username: user.name,
          photoUrl: user.image,
          firstName: profile.given_name ?? user.name,
          lastName: profile.family_name ?? '',
          verified: true,
        },
      })

      user.name = u.username
      user.image = u.photoUrl ?? undefined
      user.role = u.role
      user.id = u.id

      return true
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.id = user.id
      }

      return token
    },
    session: async ({ session, token }) => {
      session.user.role = token.role
      session.user.id = token.id

      return session
    },
  },
}
