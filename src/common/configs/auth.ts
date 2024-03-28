import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import async from '../../app/(public)/Navbar'

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
  ],
  session: {
    maxAge: 3600,
  },
  secret: nextAuthSecret,
  callbacks: {
    signIn: async ({ user, profile }) => {
      if (!user?.email || !user.name || !profile)
        return 'Unable to sign in. Missing profile email and profile name'

      const u = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          username: user.name,
          photoUrl: user.image,
          firstName: profile.given_name,
          lastName: profile.family_name,
        },
        create: {
          email: user.email,
          username: user.name,
          photoUrl: user.image,
          firstName: profile.given_name,
          lastName: profile.family_name,
        },
      })

      user.name = u.username
      user.image = u.photoUrl ?? undefined
      user.role = u.role

      return true
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
      }

      return token
    },
    session: async ({ session, token }) => {
      session.user.role = token.role

      return session
    },
  },
}
