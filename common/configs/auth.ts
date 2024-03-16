import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const nextAuthSecret = process.env.NEXT_AUTH_SECRET

if (!googleClientId) throw new Error('GOOGLE_CLIENT_ID env var is not set')
if (!googleClientSecret)
  throw new Error('GOOGLE_CLIENT_SECRET env var is not set')
if (!nextAuthSecret) throw new Error('NEXT_AUTH_SECRET env var is not set')

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    maxAge: 1400,
  },
  secret: nextAuthSecret,
  callbacks: {
    signIn: async ({ user }) => {
      if (!user?.email || !user.name)
        return 'Unable to sign in. Missing profile email and profile name'

      const u = await prisma.user.upsert({
        where: { email: user.email },
        update: { username: user.name, photoUrl: user.image },
        create: {
          email: user.email,
          username: user.name,
          photoUrl: user.image,
        },
      })

      user.id = u.id
      user.name = u.username
      user.image = u.photoUrl

      return true
    },
  },
}
